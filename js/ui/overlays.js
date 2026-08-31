// ============================================
// WAVEFORGE - Overlay Screens
// ============================================

const Overlays = {
    init() {
        this.setupStartScreen();
        this.setupRestartButton();
    },
    
    setupStartScreen() {
        const startBtn = document.getElementById('startGameBtn');
        
        // Make Start button directly start the game
        startBtn.addEventListener('click', () => {
            console.log('🎮 Start button clicked');
            // Directly start with empty arena
            Game.currentMap = 'empty_arena';
            document.getElementById('startScreen').style.display = 'none';
            Arena.setWalls([]);
            Game.startGameWithMap();
        });
        
        startBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            console.log('🎮 Start button touched');
            Game.currentMap = 'empty_arena';
            document.getElementById('startScreen').style.display = 'none';
            Arena.setWalls([]);
            Game.startGameWithMap();
        });
        
        // Continue game button - only show if save exists
        const continueBtn = document.getElementById('continueGameBtn');
        if (Save.hasSave()) {
            continueBtn.style.display = 'block';
            continueBtn.addEventListener('click', () => {
                if (Save.loadGame()) {
                    document.getElementById('startScreen').style.display = 'none';
                }
            });
            continueBtn.addEventListener('touchstart', (e) => {
                e.preventDefault();
                if (Save.loadGame()) {
                    document.getElementById('startScreen').style.display = 'none';
                }
            });
        } else {
            continueBtn.style.display = 'none';
        }
    },
    
    setupRestartButton() {
        const restartBtn = document.getElementById('restartBtn');
        restartBtn.addEventListener('click', () => {
            this.hideAll();
            document.getElementById('startScreen').style.display = 'flex';
            Game.sandboxMode = false;
            Game.gameWon = false;
        });
        restartBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.hideAll();
            document.getElementById('startScreen').style.display = 'flex';
            Game.sandboxMode = false;
            Game.gameWon = false;
        });
    },
    
    showStart() {
        document.getElementById('startScreen').style.display = 'flex';
    },
    
    showWin() {
        const overlay = document.getElementById('gameOverOverlay');
        const text = document.getElementById('gameOverText');
        
        overlay.style.display = 'flex';
        text.innerHTML = `
            <div style="font-size:2rem;color:#ffd700;margin-bottom:15px;">🎉 YOU WIN! 🎉</div>
            <div style="font-size:1.2rem;margin-bottom:10px;">You conquered all 40 waves!</div>
            <div style="font-size:1rem;color:#aaa;margin-bottom:20px;">
                Kills: ${Game.kills} | Gold: ${Game.gold} | Difficulty: ${Game.difficulty.toUpperCase()}
            </div>
        `;
        
        // Add sandbox continue button
        const sandboxBtn = document.createElement('button');
        sandboxBtn.id = 'sandboxContinueBtn';
        sandboxBtn.textContent = '🏖️ Continue in Sandbox Mode (Endless Waves)';
        sandboxBtn.style.cssText = 'display:block;width:280px;margin:15px auto;padding:15px;background:linear-gradient(45deg,#6a0dad,#9b59b6);color:white;border:none;border-radius:10px;font-size:1.1rem;cursor:pointer;';
        sandboxBtn.addEventListener('click', () => this.startSandbox());
        sandboxBtn.addEventListener('touchstart', (e) => { e.preventDefault(); this.startSandbox(); });
        
        const oldBtn = document.getElementById('sandboxContinueBtn');
        if (oldBtn) oldBtn.remove();
        text.appendChild(sandboxBtn);
        
        document.getElementById('restartBtn').style.display = 'block';
        document.getElementById('restartBtn').textContent = '🔄 Play Again';
        Messages.show('CONGRATULATIONS! You beat the game!', 5000);
    },
    
    showGameOver() {
        const overlay = document.getElementById('gameOverOverlay');
        const text = document.getElementById('gameOverText');
        
        overlay.style.display = 'flex';
        text.textContent = `You survived ${Game.wave} waves with ${Game.kills} kills.`;
        
        // Remove sandbox button if present
        const sandboxBtn = document.getElementById('sandboxContinueBtn');
        if (sandboxBtn) sandboxBtn.remove();
        
        document.getElementById('restartBtn').style.display = 'block';
        document.getElementById('restartBtn').textContent = '🔄 Play Again';
    },
    
    startSandbox() {
        Game.sandboxMode = true;
        Game.gameWon = false;
        Game.state = GAME_STATE.WAVE;
        Game.waveActive = true;
        Game.waveStartTime = Date.now();
        Game.pendingSpawns = 0;
        Game.wave = 41;
        
        Player.inSlowField = false;
        Player.slowFieldTicks = 0;
        Player.speed = Player.baseSpeed * Player.speedMultiplier;
        Player.weapons.forEach(w => { if (w.resetEachRound) w.resetAmmo(); });
        
        Boss.reset();
        Monsters.reset();
        Projectiles.reset();
        Physics.clear();
        
        const waveConfig = Waves.getWaveConfig(Game.wave);
        document.getElementById('waveDisplay').textContent = `🏖️ Wave ${Game.wave} (Sandbox)`;
        document.getElementById('waveDisplay').style.opacity = 1;
        
        if (waveConfig.isBoss) {
            document.getElementById('waveDisplay').textContent = `🏖️ SANDSTORM BOSS ${Game.wave}`;
            document.getElementById('waveDisplay').classList.add('boss-wave');
            Monsters.spawnBoss();
            Monsters.spawnWave(waveConfig, true);
        } else {
            Monsters.spawnWave(waveConfig, false);
        }
        
        setTimeout(() => {
            document.getElementById('waveDisplay').style.opacity = 0.5;
        }, 2500);
        
        this.hideAll();
        Messages.show('🏖️ Sandbox Mode: Endless waves incoming!', 3000);
        HUD.updateAll();
    },
    
    hideAll() {
        document.getElementById('gameOverOverlay').style.display = 'none';
        document.getElementById('waveCompleteOverlay').style.display = 'none';
        document.getElementById('difficultySelect').style.display = 'none';
        document.getElementById('mapSelectionOverlay').style.display = 'none';
    }
};
