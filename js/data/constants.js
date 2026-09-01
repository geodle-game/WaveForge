// ============================================
// WAVEFORGE - Constants & Configuration
// ============================================

const CONFIG = {
    // Canvas
    CANVAS_WIDTH: 800,
    CANVAS_HEIGHT: 600,
    
    // Player defaults
    PLAYER_START: {
        health: 20,
        maxHealth: 20,
        speed: 3,
        gold: 50,
        radius: 20
    },
    
    // Combat
    MONSTER_ATTACK_COOLDOWN: 1000,
    DAMAGE_INDICATOR_DURATION: 1000,
    GOLD_POPUP_DURATION: 1000,
    
    // Shop
    SHOP_REFRESH_BASE_COST: 5,
    SHOP_REFRESH_COST_INCREMENT: 2,
    MAX_WEAPON_SLOTS: 6,
    
    // Towers
    MAX_LANDMINES: 5,
    MAX_HEALING_TOWERS: 3,
    MAX_TURRETS: 3,
    MAX_FROST_TOWERS: 2,
    MAX_POISON_TOWERS: 2,
    HEALING_TOWER_INTERVAL: 2000,
    HEALING_TOWER_AMOUNT: 1,
    TURRET_DAMAGE: 5,
    TURRET_RANGE: 300,
    TURRET_ATTACK_SPEED: 1.0,
    FROST_TOWER_SLOW_PERCENT: 0.3,
    FROST_TOWER_RADIUS: 150,
    FROST_TOWER_INTERVAL: 1000,
    POISON_TOWER_DAMAGE: 3,
    POISON_TOWER_RADIUS: 150,
    POISON_TOWER_INTERVAL: 1000,
    LANDMINE_DAMAGE: 50,
    LANDMINE_RADIUS: 60,
    
    // Messages
    MAX_VISIBLE_MESSAGES: 5,
    MESSAGE_DURATION: 2500,
    
    // Save
    AUTO_SAVE_INTERVAL: 30000,
    
    // Purchase limits (max buys for permanent items)
    PURCHASE_LIMITS: {
        vampireTeeth: 3,
        bloodContract: 3,
        runicPlate: 1,
        guardianAngel: 1,
        damageOrb: 6,
        speedBoots: 6,
        healthUpgrade: 6,
        berserkerRing: 3,
        ninjaScroll: 2,
        alchemistStone: 5,
        thornsArmor: 4,
        windCharm: 6,
        critGloves: 3,
        reloadCharm: 3,
        goldRing: 4,
        healthRegen: 4,
        armorPlate: 3,
        lifestealRing: 3,
        explosiveRounds: 2,
        knockbackForce: 2,
        fireImbue: 2,
        poisonImbue: 2,
        frostImbue: 2,
        piercingRounds: 2,
        doubleShot: 2
    },
    
    // Difficulty multipliers
    DIFFICULTY: {
        easy: {
            playerDamage: 1.15,
            monsterHealth: 0.85,
            monsterDamage: 0.8,
            monsterCountMultiplier: 0.7,
            goldGain: 1.25,
            extraMonsters: -2
        },
        normal: {
            playerDamage: 1.0,
            monsterHealth: 1.0,
            monsterDamage: 1.0,
            monsterCountMultiplier: 1.0,
            goldGain: 1.0,
            extraMonsters: 0
        },
        impossible: {
            playerDamage: 0.9,
            monsterHealth: 1.1,
            monsterDamage: 1.2,
            monsterCountMultiplier: 1.3,
            goldGain: 0.5,
            extraMonsters: 3
        }
    },
    
    // Hitbox sizes (percentage of visual size)
    HITBOX: {
        PLAYER: 0.6,
        MONSTER: 0.7,
        BOSS: 0.8,
        MIN_SEPARATION: 5
    },
    
    // Arena
    ARENA: {
        BOUNDARY_PADDING: 30,
        WALL_THICKNESS: 4
    },
    
    // Consumable effects
    CONSUMABLES: {
        HEALTH_POTION_PERCENT: 0.25,
        RAGE_POTION_DAMAGE_MULT: 1.3,
        RAGE_POTION_DURATION: 10000,
        SPEED_POTION_SPEED_MULT: 1.3,
        SPEED_POTION_DURATION: 10000,
        SHIELD_POTION_DURATION: 3000,
        FIRE_BOMB_DAMAGE: 10,
        FIRE_BOMB_DURATION: 2000,
        FREEZE_POTION_DURATION: 2000,
        POISON_VIAL_DAMAGE: 5,
        POISON_VIAL_DURATION: 3000,
        SPIKE_TRAP_CALTRIPS: 5,
        SPIKE_TRAP_DAMAGE: 10
    },
    
    // Permanent upgrade effects (percentages)
    PERMANENT_UPGRADES: {
        DAMAGE_ORB_PERCENT: 0.05,
        SPEED_BOOTS_PERCENT: 0.05,
        HEALTH_UPGRADE_PERCENT: 0.05,
        VAMPIRE_TEETH_PERCENT: 0.02,
        NINJA_SCROLL_PERCENT: 0.05,
        ALCHEMIST_STONE_PERCENT: 0.05,
        THORNS_ARMOR_PERCENT: 0.05,
        WIND_CHARM_PERCENT: 0.05,
        CRIT_GLOVES_PERCENT: 0.03,
        RELOAD_CHARM_PERCENT: 0.10,
        GOLD_RING_PERCENT: 0.05,
        HEALTH_REGEN_PERCENT: 0.005,
        ARMOR_PLATE_PERCENT: 0.03,
        LIFESTEAL_RING_PERCENT: 0.01
    },
    
    // Weapon specific configs
    WEAPON_CONFIGS: {
        FAN_KNOCKBACK: 15,
        FAN_WIND_RANGE: 200,
        FAN_WIND_SPEED: 8,
        SHURIKEN_BOUNCE_RANGE: 150,
        SHURIKEN_BOUNCE_COUNT: 3,
        CALTROPS_RADIUS: 40,
        CALTROPS_DAMAGE: 20,
        CALTROPS_INTERVAL: 500,
        CALTROPS_RELOAD_TIME: 2000
    }
};

const GAME_STATE = {
    START: 'start',
    WAVE: 'wave',
    SHOP: 'shop',
    STAT_SELECT: 'statSelect',
    GAMEOVER: 'gameover',
    WIN: 'win'
};

const DIFFICULTY = {
    EASY: 'easy',
    NORMAL: 'normal',
    IMPOSSIBLE: 'impossible'
};
