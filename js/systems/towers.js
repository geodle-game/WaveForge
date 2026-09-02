// ============================================
// WAVEFORGE - Towers System
// ============================================

const Towers = {
    landmines: {
        count: 0,
        max: CONFIG.MAX_LANDMINES,
        active: []
    },
    healingTowers: {
        count: 0,
        max: CONFIG.MAX_HEALING_TOWERS,
        active: []
    },
    turrets: {
        count: 0,
        max: CONFIG.MAX_TURRETS,
        active: []
    },
    frostTowers: {
        count: 0,
        max: CONFIG.MAX_FROST_TOWERS,
        active: []
    },
    poisonTowers: {
        count: 0,
        max: CONFIG.MAX_POISON_TOWERS,
        active: []
    },
    
    init() {
        this.landmines.count = 0;
        this.landmines.active = [];
        this.healingTowers.count = 0;
        this.healingTowers.active = [];
        this.turrets.count = 0;
        this.turrets.active = [];
        this.frostTowers.count = 0;
        this.frostTowers.active = [];
        this.poisonTowers.count = 0;
        this.poisonTowers.active = [];
    },
    
    reset() {
        this.landmines.active = [];
        this.healingTowers.active = [];
        this.turrets.active = [];
        this.frostTowers.active = [];
        this.poisonTowers.active = [];
    },
    
    // Spawn all deployed towers at wave start
    deployAll() {
        for (let i = 0; i < this.landmines.count; i++) {
            setTimeout(() => this.spawnLandmine(), i * 200);
        }
        for (let i = 0; i < this.healingTowers.count; i++) {
            setTimeout(() => this.spawnHealingTower(), i * 200 + 500);
        }
        for (let i = 0; i < this.turrets.count; i++) {
            setTimeout(() => this.spawnTurret(), i * 200 + 1000);
        }
        for (let i = 0; i < this.frostTowers.count; i++) {
            setTimeout(() => this.spawnFrostTower(), i * 200 + 1500);
        }
        for (let i = 0; i < this.poisonTowers.count; i++) {
            setTimeout(() => this.spawnPoisonTower(), i * 200 + 2000);
        }
    },
    
    spawnLandmine() {
        let x, y, valid = false;
        for (let attempts = 0; attempts < 100; attempts++) {
            x = 50 + Math.random() * (CONFIG.CANVAS_WIDTH - 100);
            y = 50 + Math.random() * (CONFIG.CANVAS_HEIGHT - 100);
            
            if (Player.entity && Physics.distance({x, y}, Player.entity) < 100) continue;
            
            let tooClose = false;
            for (let mine of this.landmines.active) {
                if (Physics.distance({x, y}, mine) < 50 + mine.radius) {
                    tooClose = true; break;
                }
            }
            if (!tooClose) { valid = true; break; }
        }
        
        if (!valid) {
            x = 100 + Math.random() * (CONFIG.CANVAS_WIDTH - 200);
            y = 100 + Math.random() * (CONFIG.CANVAS_HEIGHT - 200);
        }
        
        this.landmines.active.push({
            x, y, radius: 15, damage: CONFIG.LANDMINE_DAMAGE,
            explosionRadius: CONFIG.LANDMINE_RADIUS, active: true,
            startTime: Date.now(), color: '#8B4513'
        });
    },
    
    spawnHealingTower() {
        if (!Player.entity) return;
        const angle = Math.random() * Math.PI * 2;
        const dist = 80 + Math.random() * 100;
        const x = Player.entity.x + Math.cos(angle) * dist;
        const y = Player.entity.y + Math.sin(angle) * dist;
        
        this.healingTowers.active.push({
            x, y, radius: 20, health: 30,
            healAmount: CONFIG.HEALING_TOWER_AMOUNT,
            lastHeal: Date.now(),
            id: Date.now() + Math.random()
        });
    },
    
    spawnTurret() {
        if (!Player.entity) return;
        
        // Find a stationary position away from player
        let x, y, valid = false;
        for (let attempts = 0; attempts < 100; attempts++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 150 + Math.random() * 200;
            x = Player.entity.x + Math.cos(angle) * dist;
            y = Player.entity.y + Math.sin(angle) * dist;
            
            // Check bounds
            if (x < 50 || x > CONFIG.CANVAS_WIDTH - 50 || y < 50 || y > CONFIG.CANVAS_HEIGHT - 50) continue;
            
            // Check not too close to player
            if (Physics.distance({x, y}, Player.entity) < 100) continue;
            
            // Check not too close to other turrets
            let tooClose = false;
            for (let turret of this.turrets.active) {
                if (Physics.distance({x, y}, turret) < 60) {
                    tooClose = true; break;
                }
            }
            if (!tooClose) { valid = true; break; }
        }
        
        if (!valid) {
            x = 100 + Math.random() * (CONFIG.CANVAS_WIDTH - 200);
            y = 100 + Math.random() * (CONFIG.CANVAS_HEIGHT - 200);
        }
        
        // Turret is STATIONARY - it stays at this position
        this.turrets.active.push({
            x, y, radius: 20, health: 30,
            damage: CONFIG.TURRET_DAMAGE,
            range: CONFIG.TURRET_RANGE,
            attackSpeed: CONFIG.TURRET_ATTACK_SPEED,
            lastAttack: 0,
            projectileColor: '#FFD700',
            projectileSpeed: 10,
            isStationary: true,  // Mark as stationary
            id: Date.now() + Math.random()
        });
    },
    
    spawnFrostTower() {
        if (!Player.entity) return;
        
        // Find a stationary position away from player
        let x, y, valid = false;
        for (let attempts = 0; attempts < 100; attempts++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 150;
            x = Player.entity.x + Math.cos(angle) * dist;
            y = Player.entity.y + Math.sin(angle) * dist;
            
            if (x < 50 || x > CONFIG.CANVAS_WIDTH - 50 || y < 50 || y > CONFIG.CANVAS_HEIGHT - 50) continue;
            if (Physics.distance({x, y}, Player.entity) < 80) continue;
            
            let tooClose = false;
            for (let tower of this.frostTowers.active) {
                if (Physics.distance({x, y}, tower) < 60) {
                    tooClose = true; break;
                }
            }
            if (!tooClose) { valid = true; break; }
        }
        
        if (!valid) {
            x = 100 + Math.random() * (CONFIG.CANVAS_WIDTH - 200);
            y = 100 + Math.random() * (CONFIG.CANVAS_HEIGHT - 200);
        }
        
        this.frostTowers.active.push({
            x, y, radius: 20, health: 30,
            slowPercent: CONFIG.FROST_TOWER_SLOW_PERCENT,
            radius: CONFIG.FROST_TOWER_RADIUS,
            interval: CONFIG.FROST_TOWER_INTERVAL,
            lastSlow: Date.now(),
            isStationary: true,
            id: Date.now() + Math.random()
        });
    },
    
    spawnPoisonTower() {
        if (!Player.entity) return;
        
        // Find a stationary position away from player
        let x, y, valid = false;
        for (let attempts = 0; attempts < 100; attempts++) {
            const angle = Math.random() * Math.PI * 2;
            const dist = 100 + Math.random() * 150;
            x = Player.entity.x + Math.cos(angle) * dist;
            y = Player.entity.y + Math.sin(angle) * dist;
            
            if (x < 50 || x > CONFIG.CANVAS_WIDTH - 50 || y < 50 || y > CONFIG.CANVAS_HEIGHT - 50) continue;
            if (Physics.distance({x, y}, Player.entity) < 80) continue;
            
            let tooClose = false;
            for (let tower of this.poisonTowers.active) {
                if (Physics.distance({x, y}, tower) < 60) {
                    tooClose = true; break;
                }
            }
            if (!tooClose) { valid = true; break; }
        }
        
        if (!valid) {
            x = 100 + Math.random() * (CONFIG.CANVAS_WIDTH - 200);
            y = 100 + Math.random() * (CONFIG.CANVAS_HEIGHT - 200);
        }
        
        this.poisonTowers.active.push({
            x, y, radius: 20, health: 30,
            damage: CONFIG.POISON_TOWER_DAMAGE,
            radius: CONFIG.POISON_TOWER_RADIUS,
            interval: CONFIG.POISON_TOWER_INTERVAL,
            lastPoison: Date.now(),
            isStationary: true,
            id: Date.now() + Math.random()
        });
    },
    
    purchaseTower(type) {
        switch (type) {
            case 'landmine':
                if (this.landmines.count >= this.landmines.max) return false;
                this.landmines.count++;
                if (Game.state === GAME_STATE.WAVE) this.spawnLandmine();
                return true;
            case 'healing_tower':
                if (this.healingTowers.count >= this.healingTowers.max) return false;
                this.healingTowers.count++;
                if (Game.state === GAME_STATE.WAVE) this.spawnHealingTower();
                return true;
            case 'turret':
                if (this.turrets.count >= this.turrets.max) return false;
                this.turrets.count++;
                if (Game.state === GAME_STATE.WAVE) this.spawnTurret();
                return true;
            case 'frost_tower':
                if (this.frostTowers.count >= this.frostTowers.max) return false;
                this.frostTowers.count++;
                if (Game.state === GAME_STATE.WAVE) this.spawnFrostTower();
                return true;
            case 'poison_tower':
                if (this.poisonTowers.count >= this.poisonTowers.max) return false;
                this.poisonTowers.count++;
                if (Game.state === GAME_STATE.WAVE) this.spawnPoisonTower();
                return true;
        }
        return false;
    },
    
    checkLandmineTriggers() {
        for (let i = this.landmines.active.length - 1; i >= 0; i--) {
            const mine = this.landmines.active[i];
            for (let j = 0; j < Monsters.active.length; j++) {
                const monster = Monsters.active[j];
                if (Physics.distance(mine, monster) < mine.radius + monster.radius) {
                    for (let k = Monsters.active.length - 1; k >= 0; k--) {
                        const other = Monsters.active[k];
                        if (Physics.distance(mine, other) < mine.explosionRadius + other.radius) {
                            other.health -= mine.damage;
                            Effects.damageIndicator(other.x, other.y, mine.damage, true);
                            if (other.health <= 0) Monsters.handleDeath(other, k);
                        }
                    }
                    Effects.explosion(mine.x, mine.y, mine.explosionRadius, '#FF4500');
                    this.landmines.active.splice(i, 1);
                    break;
                }
            }
        }
    },
    
    updateTurrets(currentTime) {
        for (let turret of this.turrets.active) {
            // Turret is STATIONARY - no movement
            if (currentTime - turret.lastAttack < 1000 / turret.attackSpeed) continue;
            
            let target = null;
            let nearestDist = turret.range;
            for (let monster of Monsters.active) {
                const dist = Physics.distance(turret, monster);
                if (dist < nearestDist) {
                    nearestDist = dist;
                    target = monster;
                }
            }
            
            if (target) {
                turret.lastAttack = currentTime;
                const angle = Math.atan2(target.y - turret.y, target.x - turret.x);
                Projectiles.spawn({
                    x: turret.x, y: turret.y,
                    angle: angle,
                    speed: turret.projectileSpeed,
                    range: turret.range,
                    damage: turret.damage,
                    color: turret.projectileColor,
                    size: 3,
                    startTime: currentTime,
                    type: 'turret',
                    distanceTraveled: 0
                });
            }
        }
    },
    
    updateFrostTowers(currentTime) {
        for (let tower of this.frostTowers.active) {
            // Tower is STATIONARY - no movement
            if (currentTime - tower.lastSlow >= tower.interval) {
                for (let monster of Monsters.active) {
                    if (Physics.distance(tower, monster) < tower.radius + monster.radius) {
                        monster.slowed = true;
                        monster.slowUntil = Date.now() + tower.interval;
                        monster.speed = monster.originalSpeed * (1 - tower.slowPercent);
                    }
                }
                tower.lastSlow = currentTime;
            }
        }
    },
    
    updatePoisonTowers(currentTime) {
        for (let tower of this.poisonTowers.active) {
            // Tower is STATIONARY - no movement
            if (currentTime - tower.lastPoison >= tower.interval) {
                for (let monster of Monsters.active) {
                    if (Physics.distance(tower, monster) < tower.radius + monster.radius) {
                        monster.poisoned = true;
                        monster.poisonDmg = tower.damage;
                        monster.poisonEnd = Date.now() + tower.interval;
                    }
                }
                tower.lastPoison = currentTime;
            }
        }
    },
    
    update(currentTime) {
        this.checkLandmineTriggers();
        this.updateTurrets(currentTime);
        this.updateFrostTowers(currentTime);
        this.updatePoisonTowers(currentTime);
        
        for (let tower of this.healingTowers.active) {
            if (currentTime - tower.lastHeal >= CONFIG.HEALING_TOWER_INTERVAL && 
                Player.health < Player.maxHealth) {
                Player.heal(tower.healAmount);
                tower.lastHeal = currentTime;
            }
        }
    },
    
    draw() {
        const ctx = Game.ctx;
        
        // Landmines
        for (let mine of this.landmines.active) {
            ctx.save();
            ctx.translate(mine.x, mine.y);
            const pulse = Math.sin(Date.now() * 0.01) * 0.2 + 0.8;
            ctx.shadowColor = '#8B4513'; ctx.shadowBlur = 15;
            ctx.strokeStyle = '#F00'; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(0, 0, mine.radius * pulse, 0, Math.PI * 2); ctx.stroke();
            ctx.fillStyle = mine.color;
            ctx.beginPath(); ctx.arc(0, 0, mine.radius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FF4500';
            ctx.beginPath(); ctx.arc(0, 0, mine.radius * 0.5, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFF'; ctx.font = 'bold 12px Arial';
            ctx.textAlign = 'center'; ctx.fillText('💣', 0, 0);
            ctx.restore();
        }
        
        // Healing towers
        for (let tower of this.healingTowers.active) {
            ctx.save();
            ctx.translate(tower.x, tower.y);
            ctx.fillStyle = '#2E7D32'; ctx.shadowColor = '#4CAF50'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.arc(0, 0, tower.radius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFF'; ctx.font = 'bold 20px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('+', 0, 0);
            const hpPercent = tower.health / 30;
            ctx.fillStyle = '#000';
            ctx.fillRect(-tower.radius, -tower.radius - 10, tower.radius * 2, 5);
            ctx.fillStyle = '#0F0';
            ctx.fillRect(-tower.radius, -tower.radius - 10, tower.radius * 2 * hpPercent, 5);
            ctx.restore();
        }
        
        // Turrets (STATIONARY)
        for (let turret of this.turrets.active) {
            ctx.save();
            ctx.translate(turret.x, turret.y);
            ctx.fillStyle = '#555'; ctx.shadowColor = '#888'; ctx.shadowBlur = 10;
            ctx.fillRect(-10, -10, 20, 20);
            ctx.fillStyle = '#333';
            ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.fill();
            const angle = Monsters.active.length > 0 ? 
                Math.atan2(Monsters.active[0].y - turret.y, Monsters.active[0].x - turret.x) : 0;
            ctx.save(); ctx.rotate(angle);
            ctx.fillStyle = '#444';
            ctx.fillRect(8, -3, 15, 6);
            ctx.restore();
            const hpPercent = turret.health / 30;
            ctx.fillStyle = '#000';
            ctx.fillRect(-turret.radius, -turret.radius - 10, turret.radius * 2, 5);
            ctx.fillStyle = '#0F0';
            ctx.fillRect(-turret.radius, -turret.radius - 10, turret.radius * 2 * hpPercent, 5);
            ctx.restore();
        }
        
        // Frost towers
        for (let tower of this.frostTowers.active) {
            ctx.save();
            ctx.translate(tower.x, tower.y);
            ctx.fillStyle = '#1E90FF'; ctx.shadowColor = '#00BFFF'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.arc(0, 0, tower.radius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#FFF'; ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('❄', 0, 0);
            ctx.strokeStyle = 'rgba(30,144,255,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(0, 0, tower.radius, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
        }
        
        // Poison towers
        for (let tower of this.poisonTowers.active) {
            ctx.save();
            ctx.translate(tower.x, tower.y);
            ctx.fillStyle = '#4B0082'; ctx.shadowColor = '#8B008B'; ctx.shadowBlur = 15;
            ctx.beginPath(); ctx.arc(0, 0, tower.radius, 0, Math.PI * 2); ctx.fill();
            ctx.fillStyle = '#00FF00'; ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('☠', 0, 0);
            ctx.strokeStyle = 'rgba(75,0,130,0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(0, 0, tower.radius, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
        }
    }
};
