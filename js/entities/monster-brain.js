// ============================================
// WAVEFORGE - Monster Brain (AI System)
// ============================================

const MonsterBrain = {
    flocks: new Map(),
    roles: {
        CHASER: 'chaser',
        FLANKER: 'flanker',
        BLOCKER: 'blocker',
        SUPPORT: 'support'
    },
    
    init() {
        this.flocks.clear();
    },
    
    reset() {
        this.flocks.clear();
    },
    
    // Dummy function for compatibility with maps.js
    initGrid() {
        console.log('✅ A* grid initialized (simplified)');
    },
    
    // Check if there's a wall between two points
    isWallBetween(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy);
        const steps = Math.ceil(dist / 10);
        
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const px = x1 + dx * t;
            const py = y1 + dy * t;
            
            for (let wall of Arena.walls) {
                if (wall.destroyed) continue;
                const halfW = wall.width / 2;
                const halfH = wall.height / 2;
                if (px >= wall.x - halfW && px <= wall.x + halfW &&
                    py >= wall.y - halfH && py <= wall.y + halfH) {
                    return true;
                }
            }
        }
        return false;
    },
    
    // Find a waypoint around a wall
    findWaypointAroundWall(monster, targetX, targetY) {
        const wall = this.findBlockingWall(monster.x, monster.y, targetX, targetY);
        if (!wall) return null;
        
        const wallHalfW = wall.width / 2 + 20;
        const wallHalfH = wall.height / 2 + 20;
        
        const waypoints = [
            { x: wall.x - wallHalfW - 10, y: wall.y },
            { x: wall.x + wallHalfW + 10, y: wall.y },
            { x: wall.x, y: wall.y - wallHalfH - 10 },
            { x: wall.x, y: wall.y + wallHalfH + 10 },
            { x: wall.x - wallHalfW - 10, y: wall.y - wallHalfH - 10 },
            { x: wall.x + wallHalfW + 10, y: wall.y - wallHalfH - 10 },
            { x: wall.x - wallHalfW - 10, y: wall.y + wallHalfH + 10 },
            { x: wall.x + wallHalfW + 10, y: wall.y + wallHalfH + 10 }
        ];
        
        let bestWaypoint = null;
        let bestDist = Infinity;
        
        for (let wp of waypoints) {
            let insideWall = false;
            for (let w of Arena.walls) {
                if (w.destroyed) continue;
                const halfW = w.width / 2;
                const halfH = w.height / 2;
                if (wp.x >= w.x - halfW && wp.x <= w.x + halfW &&
                    wp.y >= w.y - halfH && wp.y <= w.y + halfH) {
                    insideWall = true;
                    break;
                }
            }
            if (insideWall) continue;
            
            if (this.isWallBetween(monster.x, monster.y, wp.x, wp.y)) continue;
            if (this.isWallBetween(wp.x, wp.y, targetX, targetY)) continue;
            
            const dist = Math.hypot(wp.x - monster.x, wp.y - monster.y);
            if (dist < bestDist) {
                bestDist = dist;
                bestWaypoint = wp;
            }
        }
        
        return bestWaypoint;
    },
    
    // Find the wall blocking the path
    findBlockingWall(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        const dist = Math.hypot(dx, dy);
        const steps = Math.ceil(dist / 10);
        
        for (let i = 1; i < steps; i++) {
            const t = i / steps;
            const px = x1 + dx * t;
            const py = y1 + dy * t;
            
            for (let wall of Arena.walls) {
                if (wall.destroyed) continue;
                const halfW = wall.width / 2;
                const halfH = wall.height / 2;
                if (px >= wall.x - halfW && px <= wall.x + halfW &&
                    py >= wall.y - halfH && py <= wall.y + halfH) {
                    return wall;
                }
            }
        }
        return null;
    },
    
    formFlocks() {
        this.flocks.clear();
        const unassigned = [...Monsters.active];
        for (let monster of unassigned) {
            if (monster.flockId) continue;
            const flockId = `flock_${Date.now()}_${Math.random()}`;
            const flock = {
                id: flockId,
                members: [monster],
                leader: monster,
                center: { x: monster.x, y: monster.y },
                targetX: Player.entity ? Player.entity.x : monster.x,
                targetY: Player.entity ? Player.entity.y : monster.y,
                formation: 'loose'
            };
            monster.flockId = flockId;
            monster.role = this.roles.CHASER;
            for (let other of unassigned) {
                if (other === monster || other.flockId) continue;
                if (other.type === monster.type || (monster.isBoss && other.isMinion)) {
                    const dist = Physics.distance(monster, other);
                    if (dist < 200) {
                        flock.members.push(other);
                        other.flockId = flockId;
                        other.role = this.assignRole(flock);
                    }
                }
            }
            this.flocks.set(flockId, flock);
            this.updateFlockCenter(flock);
            this.assignRoles(flock);
        }
    },
    
    assignRole(flock) {
        const counts = {};
        for (let m of flock.members) counts[m.role] = (counts[m.role] || 0) + 1;
        if ((counts[this.roles.CHASER] || 0) <= (counts[this.roles.FLANKER] || 0)) {
            return this.roles.CHASER;
        } else if ((counts[this.roles.FLANKER] || 0) <= 2 && flock.members.length > 3) {
            return this.roles.FLANKER;
        } else if ((counts[this.roles.BLOCKER] || 0) === 0 && flock.members.length > 4) {
            return this.roles.BLOCKER;
        }
        return this.roles.CHASER;
    },
    
    assignRoles(flock) {
        const size = flock.members.length;
        if (size <= 2) {
            for (let m of flock.members) m.role = this.roles.CHASER;
        } else if (size <= 5) {
            for (let i = 0; i < flock.members.length; i++) {
                flock.members[i].role = i < 2 ? this.roles.FLANKER : this.roles.CHASER;
            }
        } else {
            const roles = [
                this.roles.CHASER, this.roles.CHASER, this.roles.CHASER,
                this.roles.FLANKER, this.roles.FLANKER,
                this.roles.BLOCKER, this.roles.SUPPORT
            ];
            for (let i = 0; i < flock.members.length; i++) {
                flock.members[i].role = roles[i % roles.length];
            }
        }
    },
    
    updateFlockCenter(flock) {
        let cx = 0, cy = 0;
        for (let m of flock.members) { cx += m.x; cy += m.y; }
        flock.center.x = cx / flock.members.length;
        flock.center.y = cy / flock.members.length;
    },
    
    getMovement(monster) {
        if (!Player.entity) return { x: 0, y: 0 };
        if (monster.isDasher && monster.isDashing) return { x: 0, y: 0 };
        const player = Player.entity;
        const flock = monster.flockId ? this.flocks.get(monster.flockId) : null;
        
        // Ghosts pass through walls - direct movement
        if (monster.isGhost) {
            return this.getGhostMovement(monster, player);
        }
        
        // Healers stay near other monsters, not directly chase player
        if (monster.isHealer) {
            return this.getHealerMovement(monster, player, flock);
        }
        
        // Summoners keep distance from player
        if (monster.isSummoner) {
            return this.getSummonerMovement(monster, player);
        }
        
        // Shield Bearers move slowly but steadily toward player
        if (monster.isShieldBearer) {
            return this.getShieldBearerMovement(monster, player);
        }
        
        // Teleporters move toward player but teleport closer
        if (monster.isTeleporter) {
            return this.getTeleporterMovement(monster, player);
        }
        
        // Berserkers chase player aggressively
        if (monster.isBerserker) {
            return this.getBerserkerMovement(monster, player);
        }
        
        // Direct movement towards player - simplest and most stable
        let moveX = player.x - monster.x;
        let moveY = player.y - monster.y;
        
        // Role-based modification
        switch (monster.role) {
            case this.roles.FLANKER:
                const flankAngle = Math.atan2(player.y - monster.y, player.x - monster.x) + Math.PI / 3;
                const flankDist = 150;
                const flankTargetX = player.x + Math.cos(flankAngle) * flankDist;
                const flankTargetY = player.y + Math.sin(flankAngle) * flankDist;
                moveX = flankTargetX - monster.x;
                moveY = flankTargetY - monster.y;
                break;
            case this.roles.BLOCKER:
                const centerX = CONFIG.CANVAS_WIDTH / 2;
                const centerY = CONFIG.CANVAS_HEIGHT / 2;
                const blockAngle = Math.atan2(centerY - player.y, centerX - player.x);
                const blockDist = 120;
                const blockTargetX = player.x + Math.cos(blockAngle) * blockDist;
                const blockTargetY = player.y + Math.sin(blockAngle) * blockDist;
                moveX = blockTargetX - monster.x;
                moveY = blockTargetY - monster.y;
                break;
            case this.roles.SUPPORT:
                if (flock) {
                    const supportAngle = Math.atan2(player.y - flock.center.y, player.x - flock.center.x) + Math.PI;
                    const supportDist = 100;
                    const supportTargetX = flock.center.x + Math.cos(supportAngle) * supportDist;
                    const supportTargetY = flock.center.y + Math.sin(supportAngle) * supportDist;
                    moveX = supportTargetX - monster.x;
                    moveY = supportTargetY - monster.y;
                }
                break;
        }
        
        // Normalize
        const dist = Math.hypot(moveX, moveY);
        if (dist > 0) { moveX /= dist; moveY /= dist; }
        
        // Simple wall avoidance - just slide along walls
        const testDist = 15;
        const testX = monster.x + moveX * testDist;
        const testY = monster.y + moveY * testDist;
        let blocked = false;
        
        for (let wall of Arena.walls) {
            if (wall.destroyed) continue;
            const halfW = wall.width / 2;
            const halfH = wall.height / 2;
            if (testX >= wall.x - halfW && testX <= wall.x + halfW &&
                testY >= wall.y - halfH && testY <= wall.y + halfH) {
                blocked = true;
                break;
            }
        }
        
        if (blocked) {
            const alternatives = [
                {x: moveY, y: -moveX},
                {x: -moveY, y: moveX},
                {x: 1, y: 0},
                {x: -1, y: 0},
                {x: 0, y: 1},
                {x: 0, y: -1}
            ];
            
            let found = false;
            for (let alt of alternatives) {
                const altX = monster.x + alt.x * testDist;
                const altY = monster.y + alt.y * testDist;
                let altBlocked = false;
                
                for (let w of Arena.walls) {
                    if (w.destroyed) continue;
                    const hW = w.width / 2;
                    const hH = w.height / 2;
                    if (altX >= w.x - hW && altX <= w.x + hW &&
                        altY >= w.y - hH && altY <= w.y + hH) {
                        altBlocked = true;
                        break;
                    }
                }
                
                if (!altBlocked) {
                    const altDist = Math.hypot(alt.x, alt.y);
                    moveX = alt.x / altDist;
                    moveY = alt.y / altDist;
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                moveX = 0;
                moveY = 0;
            }
        }
        
        // Boundary avoidance
        const bounds = Arena.getBounds();
        const edgeMargin = 30;
        if (monster.x < bounds.minX + edgeMargin) moveX += 0.5;
        if (monster.x > bounds.maxX - edgeMargin) moveX -= 0.5;
        if (monster.y < bounds.minY + edgeMargin) moveY += 0.5;
        if (monster.y > bounds.maxY - edgeMargin) moveY -= 0.5;
        
        // Final normalization
        const finalDist = Math.hypot(moveX, moveY);
        if (finalDist > 0) { moveX /= finalDist; moveY /= finalDist; }
        
        return { x: moveX, y: moveY };
    },
    
    // Ghost movement - passes through walls
    getGhostMovement(monster, player) {
        let moveX = player.x - monster.x;
        let moveY = player.y - monster.y;
        const dist = Math.hypot(moveX, moveY);
        if (dist > 0) { moveX /= dist; moveY /= dist; }
        return { x: moveX, y: moveY };
    },
    
    // Healer movement - stays near other monsters
    getHealerMovement(monster, player, flock) {
        // Find nearest friendly monster to heal
        let nearestAlly = null;
        let nearestDist = Infinity;
        for (let other of Monsters.active) {
            if (other === monster) continue;
            if (other._dead) continue;
            const dist = Physics.distance(monster, other);
            if (dist < nearestDist) {
                nearestDist = dist;
                nearestAlly = other;
            }
        }
        
        // If allies are nearby, move toward them
        if (nearestAlly && nearestDist < 200) {
            const moveX = nearestAlly.x - monster.x;
            const moveY = nearestAlly.y - monster.y;
            const dist = Math.hypot(moveX, moveY);
            if (dist > 0) { return { x: moveX / dist, y: moveY / dist }; }
        }
        
        // Otherwise move toward player but keep distance
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 150) {
            return { x: dx / dist, y: dy / dist };
        }
        return { x: 0, y: 0 };
    },
    
    // Summoner movement - keeps distance from player
    getSummonerMovement(monster, player) {
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const dist = Math.hypot(dx, dy);
        
        // If too close to player, move away
        if (dist < 150) {
            return { x: -dx / dist, y: -dy / dist };
        }
        
        // If too far from player, move closer
        if (dist > 300) {
            return { x: dx / dist, y: dy / dist };
        }
        
        // Otherwise move toward player slowly
        return { x: dx / dist, y: dy / dist };
    },
    
    // Shield Bearer movement - moves toward player with shield
    getShieldBearerMovement(monster, player) {
        return this.getMovement(monster);
    },
    
    // Teleporter movement - moves toward player
    getTeleporterMovement(monster, player) {
        return this.getMovement(monster);
    },
    
    // Berserker movement - chases player aggressively
    getBerserkerMovement(monster, player) {
        const dx = player.x - monster.x;
        const dy = player.y - monster.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 0) { return { x: dx / dist, y: dy / dist }; }
        return { x: 0, y: 0 };
    },
    
    onMonsterDeath(monster) {
        if (monster.flockId) {
            const flock = this.flocks.get(monster.flockId);
            if (flock) {
                const idx = flock.members.indexOf(monster);
                if (idx > -1) flock.members.splice(idx, 1);
                if (flock.members.length === 0) {
                    this.flocks.delete(monster.flockId);
                } else if (monster === flock.leader) {
                    flock.leader = flock.members[0];
                }
            }
        }
    },
    
    update(currentTime) {
        // Update flocks periodically
        if (!this._lastFlockUpdate || currentTime - this._lastFlockUpdate > 3000) {
            this.formFlocks();
            this._lastFlockUpdate = currentTime;
        }
        
        // Update flock centers
        for (let [id, flock] of this.flocks) {
            this.updateFlockCenter(flock);
        }
    }
};
