// ============================================
// WAVEFORGE - Camera System
// ============================================

const Camera = {
    x: 0,
    y: 0,
    width: 800,
    height: 600,
    worldWidth: 800,
    worldHeight: 600,
    smoothness: 0.1,
    
    init() {
        this.width = CONFIG.CANVAS_WIDTH;
        this.height = CONFIG.CANVAS_HEIGHT;
        this.worldWidth = CONFIG.CANVAS_WIDTH * 2;  // Support for larger worlds
        this.worldHeight = CONFIG.CANVAS_HEIGHT * 2;
        this.x = 0;
        this.y = 0;
    },
    
    follow(player) {
        if (!player) return;
        
        // Calculate target camera position to center player
        const targetX = player.x - this.width / 2;
        const targetY = player.y - this.height / 2;
        
        // Clamp camera to arena bounds - NEVER show outside arena
        const clampedX = Math.max(0, Math.min(this.worldWidth - this.width, targetX));
        const clampedY = Math.max(0, Math.min(this.worldHeight - this.height, targetY));
        
        // Smooth movement
        this.x += (clampedX - this.x) * this.smoothness;
        this.y += (clampedY - this.y) * this.smoothness;
        
        // Snap to bounds if very close (prevent floating point issues)
        if (Math.abs(this.x - clampedX) < 0.5) this.x = clampedX;
        if (Math.abs(this.y - clampedY) < 0.5) this.y = clampedY;
    },
    
    worldToScreen(worldX, worldY) {
        return { x: worldX - this.x, y: worldY - this.y };
    },
    
    screenToWorld(screenX, screenY) {
        return { x: screenX + this.x, y: screenY + this.y };
    },
    
    isVisible(worldX, worldY, margin = 50) {
        return worldX >= this.x - margin && 
               worldX <= this.x + this.width + margin &&
               worldY >= this.y - margin && 
               worldY <= this.y + this.height + margin;
    },
    
    apply(ctx) {
        ctx.save();
        ctx.translate(-this.x, -this.y);
    },
    
    restore(ctx) {
        ctx.restore();
    },
    
    drawBounds(ctx) {
        // Draw arena boundary
        ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        ctx.lineWidth = 3;
        ctx.strokeRect(0, 0, this.worldWidth, this.worldHeight);
        
        // Draw visible area
        ctx.strokeStyle = 'rgba(0, 255, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.x, this.y, this.width, this.height);
        
        // Draw player position marker
        if (Player.entity) {
            ctx.fillStyle = 'rgba(0, 255, 0, 0.5)';
            ctx.beginPath();
            ctx.arc(Player.entity.x, Player.entity.y, 5, 0, Math.PI * 2);
            ctx.fill();
        }
    }
};
