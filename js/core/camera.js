// ============================================
// WAVEFORGE - Camera System
// ============================================

const Camera = {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    worldWidth: 800,  // Changed from 1600 to 800 (old size)
    worldHeight: 600, // Changed from 1200 to 600 (old size)
    smoothness: 0.1,
    
    init() {
        this.width = CONFIG.CANVAS_WIDTH;
        this.height = CONFIG.CANVAS_HEIGHT;
        this.worldWidth = CONFIG.CANVAS_WIDTH;  // Old size - just the canvas size
        this.worldHeight = CONFIG.CANVAS_HEIGHT; // Old size - just the canvas size
        this.x = 0;
        this.y = 0;
    },
    
    follow(player) {
        if (!player) return;
        // No need to follow - camera is static since world = canvas size
        this.x = 0;
        this.y = 0;
    },
    
    worldToScreen(worldX, worldY) {
        return { x: worldX, y: worldY };
    },
    
    screenToWorld(screenX, screenY) {
        return { x: screenX, y: screenY };
    },
    
    isVisible(worldX, worldY, margin = 50) {
        return true; // Everything is visible since camera doesn't move
    },
    
    apply(ctx) {
        // No translation needed for old size
        ctx.save();
    },
    
    restore(ctx) {
        ctx.restore();
    },
    
    drawBounds(ctx) {
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(0, 0, this.worldWidth, this.worldHeight);
    }
};
