// ============================================
// WAVEFORGE - Monster Brain (AI System with Smooth A* Pathfinding)
// ============================================

const MonsterBrain = {
    flocks: new Map(),
    roles: {
        CHASER: 'chaser',
        FLANKER: 'flanker',
        BLOCKER: 'blocker',
        SUPPORT: 'support'
    },
    
    // A* Pathfinding grid
    grid: null,
    gridSize: 40,  // Grid cell size
    gridCols: 0,
    gridRows: 0,
    
    // Path cache to avoid recalculating every frame
    pathCache: new Map(),
    pathCacheMaxSize: 100,
    pathRecalcInterval: 1000, // Recalculate path every 1 second
    
    init() {
        this.flocks.clear();
        this.pathCache.clear();
        this.initGrid();
    },
    
    reset() {
        this.flocks.clear();
        this.pathCache.clear();
        this.initGrid();
    },
    
    // Initialize A* grid based on arena size
    initGrid() {
        const bounds = Arena.getBounds();
        this.gridCols = Math.ceil((bounds.maxX - bounds.minX) / this.gridSize);
        this.gridRows = Math.ceil((bounds.maxY - bounds.minY) / this.gridSize);
        this.grid = new Array(this.gridCols * this.gridRows).fill(0);
        
        // Mark walls in grid
        for (let wall of Arena.walls) {
            if (wall.destroyed) continue;
            const minCol = Math.floor((wall.x - wall.width/2 - bounds.minX) / this.gridSize);
            const maxCol = Math.floor((wall.x + wall.width/2 - bounds.minX) / this.gridSize);
            const minRow = Math.floor((wall.y - wall.height/2 - bounds.minY) / this.gridSize);
            const maxRow = Math.floor((wall.y + wall.height/2 - bounds.minY) / this.gridSize);
            
            for (let col = Math.max(0, minCol); col <= Math.min(this.gridCols - 1, maxCol); col++) {
                for (let row = Math.max(0, minRow); row <= Math.min(this.gridRows - 1, maxRow); row++) {
                    this.grid[row * this.gridCols + col] = 1; // 1 = blocked
                }
            }
        }
    },
    
    // Convert world coordinates to grid coordinates
    worldToGrid(x, y) {
        const bounds = Arena.getBounds();
        const col = Math.floor((x - bounds.minX) / this.gridSize);
        const row = Math.floor((y - bounds.minY) / this.gridSize);
        return { col: Math.max(0, Math.min(this.gridCols - 1, col)), 
                 row: Math.max(0, Math.min(this.gridRows - 1, row)) };
    },
    
    // Convert grid coordinates to world coordinates
    gridToWorld(col, row) {
        const bounds = Arena.getBounds();
        return {
            x: bounds.minX + (col + 0.5) * this.gridSize,
            y: bounds.minY + (row + 0.5) * this.gridSize
        };
    },
    
    // Check if grid cell is walkable
    isWalkable(col, row) {
        if (col < 0 || col >= this.gridCols || row < 0 || row >= this.gridRows) return false;
        return this.grid[row * this.gridCols + col] === 0;
    },
    
    // A* Pathfinding algorithm
    findPath(startX, startY, endX, endY) {
        const start = this.worldToGrid(startX, startY);
        const end = this.worldToGrid(endX, endY);
        
        // If start or end is blocked, find nearest walkable
        if (!this.isWalkable(start.col, start.row)) {
            const nearest = this.findNearestWalkable(start.col, start.row);
            if (!nearest) return null;
            start.col = nearest.col;
            start.row = nearest.row;
        }
        if (!this.isWalkable(end.col, end.row)) {
            const nearest = this.findNearestWalkable(end.col, end.row);
            if (!nearest) return null;
            end.col = nearest.col;
            end.row = nearest.row;
        }
        
        // A* algorithm
        const openSet = new Map();
        const closedSet = new Set();
        const cameFrom = new Map();
        const gScore = new Map();
        const fScore = new Map();
        
        const startKey = `${start.col},${start.row}`;
        const endKey = `${end.col},${end.row}`;
        
        openSet.set(startKey, { col: start.col, row: start.row });
        gScore.set(startKey, 0);
        fScore.set(startKey, this.heuristic(start.col, start.row, end.col, end.row));
        
        while (openSet.size > 0) {
            // Find node with lowest fScore
            let current = null;
            let currentKey = null;
            let lowestF = Infinity;
            
            for (let [key, node] of openSet) {
                const f = fScore.get(key) || Infinity;
                if (f < lowestF) {
                    lowestF = f;
                    current = node;
                    currentKey = key;
                }
            }
            
            if (currentKey === endKey) {
                // Path found - reconstruct path
                return this.reconstructPath(cameFrom, currentKey);
            }
            
            openSet.delete(currentKey);
            closedSet.add(currentKey);
            
            // Check neighbors
            const neighbors = [
                { col: current.col + 1, row: current.row },
                { col: current.col - 1, row: current.row },
                { col: current.col, row: current.row + 1 },
                { col: current.col, row: current.row - 1 },
                { col: current.col + 1, row: current.row + 1 },
                { col: current.col - 1, row: current.row - 1 },
                { col: current.col + 1, row: current.row - 1 },
                { col: current.col - 1, row: current.row + 1 }
            ];
            
            for (let neighbor of neighbors) {
                if (!this.isWalkable(neighbor.col, neighbor.row)) continue;
                const neighborKey = `${neighbor.col},${neighbor.row}`;
                if (closedSet.has(neighborKey)) continue;
                
                // Diagonal movement cost
                const isDiagonal = neighbor.col !== current.col && neighbor.row !== current.row;
                const tentativeG = (gScore.get(currentKey) || 0) + (isDiagonal ? 1.414 : 1);
                
                if (!openSet.has(neighborKey) || tentativeG < (gScore.get(neighborKey) || Infinity)) {
                    cameFrom.set(neighborKey, currentKey);
                    gScore.set(neighborKey, tentativeG);
                    fScore.set(neighborKey, tentativeG + this.heuristic(neighbor.col, neighbor.row, end.col, end.row));
                    openSet.set(neighborKey, neighbor);
                }
            }
        }
        
        // No path found
        return null;
    },
    
    // Heuristic function (Manhattan distance)
    heuristic(col1, row1, col2, row2) {
        return Math.abs(col1 - col2) + Math.abs(row1 - row2);
    },
    
    // Find nearest walkable cell
    findNearestWalkable(col, row) {
        for (let radius = 1; radius < 5; radius++) {
            for (let c = col - radius; c <= col + radius; c++) {
                for (let r = row - radius; r <= row + radius; r++) {
                    if (this.isWalkable(c, r)) {
                        return { col: c, row: r };
                    }
                }
            }
        }
        return null;
    },
    
    // Reconstruct path from cameFrom map
    reconstructPath(cameFrom, currentKey) {
        const path = [];
        let key = currentKey;
        
        while (key) {
            const [col, row] = key.split(',').map(Number);
            path.unshift(this.gridToWorld(col, row));
            key = cameFrom.get(key);
        }
        
        return path;
    },
    
    // Get cached path for monster
    getCachedPath(monster) {
        const cacheKey = `${monster.id || monster.type}_${Math.round(monster.x / 50)}_${Math.round(monster.y / 50)}_${Math.round(Player.entity.x / 50)}_${Math.round(Player.entity.y / 50)}`;
        return this.pathCache.get(cacheKey);
    },
    
    // Cache path for monster
    cachePath(monster, path) {
        const cacheKey = `${monster.id || monster.type}_${Math.round(monster.x / 50)}_${Math.round(monster.y / 50)}_${Math.round(Player.entity.x / 50)}_${Math.round(Player.entity.y / 50)}`;
        
        // Limit cache size
        if (this.pathCache.size >= this.pathCacheMaxSize) {
            const firstKey = this.pathCache.keys().next().value;
            this.pathCache.delete(firstKey);
        }
        
        this.pathCache.set(cacheKey, { path, timestamp: Date.now() });
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
        let moveX = 0, moveY = 0;
        
        // Get or calculate path (recalculate every ~1 second)
        const now = Date.now();
        let path = null;
        
        if (monster._lastPathRecalc && now - monster._lastPathRecalc < this.pathRecalcInterval) {
            // Use cached path if still valid
            path = monster._currentPath;
        } else {
            // Calculate new path
            path = this.findPath(monster.x, monster.y, player.x, player.y);
            monster._currentPath = path;
            monster._lastPathRecalc = now;
        }
        
        // Smooth path following - skip waypoints that are too close
        if (path && path.length > 1) {
            // Skip waypoints we've already passed
            let nextIndex = 1;
            while (nextIndex < path.length - 1) {
                const waypoint = path[nextIndex];
                const distToWaypoint = Math.hypot(waypoint.x - monster.x, waypoint.y - monster.y);
                if (distToWaypoint < 30) {
                    nextIndex++;
                } else {
                    break;
                }
            }
            
            const nextWaypoint = path[nextIndex];
            const dx = nextWaypoint.x - monster.x;
            const dy = nextWaypoint.y - monster.y;
            const dist = Math.hypot(dx, dy);
            
            // Only move if we're not at the waypoint
            if (dist > 5) {
                moveX = dx / dist;
                moveY = dy / dist;
            }
        }
        
        // If no path found or too close to waypoint, direct movement
        if (moveX === 0 && moveY === 0) {
            switch (monster.role) {
                case this.roles.CHASER:
                    moveX = player.x - monster.x;
                    moveY = player.y - monster.y;
                    break;
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
                    } else {
                        moveX = player.x - monster.x;
                        moveY = player.y - monster.y;
                    }
                    break;
                default:
                    moveX = player.x - monster.x;
                    moveY = player.y - monster.y;
            }
        }
        
        // Reduce random variation to prevent jitter
        moveX += (Math.random() - 0.5) * 5;
        moveY += (Math.random() - 0.5) * 5;
        
        // Flocking behavior (with reduced force)
        if (flock && flock.members.length > 1) {
            const separationForce = this.getSeparationForce(monster, flock);
            const cohesionForce = this.getCohesionForce(monster, flock);
            moveX += separationForce.x * 0.3 + cohesionForce.x * 0.2;
            moveY += separationForce.y * 0.3 + cohesionForce.y * 0.2;
        }
        
        // Normalize movement
        const dist = Math.hypot(moveX, moveY);
        if (dist > 0) { moveX /= dist; moveY /= dist; }
        
        // Wall avoidance
        const testDist = 20;
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
                {x: 1, y: 0}, {x: -1, y: 0},
                {x: 0, y: 1}, {x: 0, y: -1},
                {x: 0.7, y: 0.7}, {x: -0.7, y: 0.7},
                {x: 0.7, y: -0.7}, {x: -0.7, y: -0.7}
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
                    moveX = alt.x;
                    moveY = alt.y;
                    found = true;
                    break;
                }
            }
            if (!found) { moveX = 0; moveY = 0; }
        }
        
        // Boundary avoidance
        const bounds = Arena.getBounds();
        const edgeMargin = 40;
        if (monster.x < bounds.minX + edgeMargin) moveX += 0.3;
        if (monster.x > bounds.maxX - edgeMargin) moveX -= 0.3;
        if (monster.y < bounds.minY + edgeMargin) moveY += 0.3;
        if (monster.y > bounds.maxY - edgeMargin) moveY -= 0.3;
        
        // Final normalization
        const finalDist = Math.hypot(moveX, moveY);
        if (finalDist > 0) { moveX /= finalDist; moveY /= finalDist; }
        
        return { x: moveX, y: moveY };
    },
    
    getSeparationForce(monster, flock) {
        let sx = 0, sy = 0;
        const separationRadius = 40;
        for (let other of flock.members) {
            if (other === monster) continue;
            const dx = monster.x - other.x;
            const dy = monster.y - other.y;
            const dist = Math.hypot(dx, dy);
            if (dist < separationRadius && dist > 0) {
                const force = (separationRadius - dist) / separationRadius;
                sx += (dx / dist) * force;
                sy += (dy / dist) * force;
            }
        }
        return { x: sx, y: sy };
    },
    
    getCohesionForce(monster, flock) {
        const dx = flock.center.x - monster.x;
        const dy = flock.center.y - monster.y;
        const dist = Math.hypot(dx, dy);
        if (dist > 80 && dist > 0) {
            return { x: dx / dist, y: dy / dist };
        }
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
        
        // Clear path cache for dead monster
        if (monster._currentPath) {
            monster._currentPath = null;
        }
    },
    
    update(currentTime) {
        // Update A* grid periodically (walls might change)
        if (!this._lastGridUpdate || currentTime - this._lastGridUpdate > 5000) {
            this.initGrid();
            this._lastGridUpdate = currentTime;
        }
        
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
