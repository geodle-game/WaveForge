// ============================================
// WAVEFORGE - Map Definitions & Selection
// ============================================

const MAP_DEFINITIONS = {
    'empty_arena': {
        id: 'empty_arena',
        name: 'Empty Arena',
        icon: '⬜',
        description: 'No walls. Pure open combat.',
        difficulty: 'easy',
        walls: []
    },
    'arena': {
        id: 'arena',
        name: 'Arena',
        icon: '🏟️',
        description: 'Random barrels, boxes, and barriers.',
        difficulty: 'medium',
        walls: []
    },
    'backrooms': {
        id: 'backrooms',
        name: 'Backrooms',
        icon: '🚪',
        description: 'Maze-like walls.',
        difficulty: 'hard',
        walls: []
    }
};

const MapGenerators = {
    generateMap(mapId) {
        switch(mapId) {
            case 'empty_arena': return this.generateEmptyArena();
            case 'arena': return this.generateArena();
            case 'backrooms': return this.generateBackrooms();
            default: return this.generateEmptyArena();
        }
    },
    
    generateEmptyArena() {
        return [];
    },
    
    generateArena() {
        const walls = [];
        const numObstacles = 8 + Math.floor(Math.random() * 6); // Fewer obstacles for old size
        
        for (let i = 0; i < numObstacles; i++) {
            let x, y, valid = false;
            let attempts = 0;
            while (!valid && attempts < 30) {
                attempts++;
                x = 80 + Math.random() * (CONFIG.CANVAS_WIDTH - 160);
                y = 80 + Math.random() * (CONFIG.CANVAS_HEIGHT - 160);
                
                // Keep center clear for player
                if (Math.hypot(x - CONFIG.CANVAS_WIDTH/2, y - CONFIG.CANVAS_HEIGHT/2) < 100) continue;
                
                let overlap = false;
                for (let wall of walls) {
                    const dx = x - wall.x;
                    const dy = y - wall.y;
                    if (Math.hypot(dx, dy) < 70) {
                        overlap = true;
                        break;
                    }
                }
                if (!overlap) valid = true;
            }
            
            if (valid) {
                const type = Math.random();
                let width, height, color;
                if (type < 0.4) {
                    width = 25 + Math.random() * 15;
                    height = width;
                    color = '#8B4513';
                } else if (type < 0.7) {
                    width = 30 + Math.random() * 20;
                    height = 30 + Math.random() * 20;
                    color = '#8B7355';
                } else {
                    width = 15 + Math.random() * 20;
                    height = 40 + Math.random() * 30;
                    color = '#696969';
                }
                
                walls.push({
                    x, y, width, height, color, health: Infinity, indestructible: true
                });
            }
        }
        
        return walls;
    },
    
    generateBackrooms() {
        // Simplified for old size
        const walls = [];
        const wallThickness = 12;
        const roomSize = 100;
        const cols = Math.floor(CONFIG.CANVAS_WIDTH / roomSize);
        const rows = Math.floor(CONFIG.CANVAS_HEIGHT / roomSize);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                const cx = x * roomSize + roomSize / 2;
                const cy = y * roomSize + roomSize / 2;
                
                if (Math.random() < 0.3) {
                    walls.push({
                        x: cx, y: cy,
                        width: roomSize,
                        height: wallThickness,
                        color: '#2a2a4a',
                        health: Infinity,
                        indestructible: true
                    });
                }
                
                if (Math.random() < 0.3) {
                    walls.push({
                        x: cx, y: cy,
                        width: wallThickness,
                        height: roomSize,
                        color: '#2a2a4a',
                        health: Infinity,
                        indestructible: true
                    });
                }
            }
        }
        
        return walls;
    }
};
