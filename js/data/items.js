// ============================================
// WAVEFORGE - Item Definitions
// ============================================

const ITEM_DATA = [
    // === CONSUMABLES ===
    { id: 'health_potion', name: 'Health Potion', icon: '❤️', type: 'consumable', cost: 50, description: 'Restore 25% of max health' },
    { id: 'ammo_pack', name: 'Ammo Pack', icon: '📦', type: 'consumable', cost: 40, description: 'Fully reload all ranged weapons' },
    { id: 'rage_potion', name: 'Rage Potion', icon: '🔥', type: 'consumable', cost: 60, description: '+30% damage for 10 seconds' },
    { id: 'bomb', name: 'Bomb', icon: '💣', type: 'consumable', cost: 75, description: 'Large area explosion' },
    { id: 'exp_scroll', name: 'Experience Scroll', icon: '📜✨', type: 'consumable', cost: 500, description: 'Upgrade a random weapon' },
    { id: 'speed_potion', name: 'Speed Potion', icon: '💨', type: 'consumable', cost: 55, description: '+30% speed for 10 seconds' },
    { id: 'shield_potion', name: 'Shield Potion', icon: '🛡️', type: 'consumable', cost: 70, description: 'Invulnerable for 3 seconds' },
    { id: 'fire_bomb', name: 'Fire Bomb', icon: '🔥💣', type: 'consumable', cost: 90, description: 'Creates fire on the ground (10 dmg/sec)' },
    { id: 'freeze_potion', name: 'Freeze Potion', icon: '❄️', type: 'consumable', cost: 80, description: 'Freezes all enemies for 2 seconds' },
    { id: 'poison_vial', name: 'Poison Vial', icon: '☠️', type: 'consumable', cost: 65, description: 'Poisons all enemies for 3 seconds (5 dmg/sec)' },
    { id: 'spike_trap', name: 'Spike Trap', icon: '🔺', type: 'consumable', cost: 85, description: 'Lays down 5 caltrops around you (10 dmg)' },
    
    // === TOWERS ===
    { id: 'healing_tower', name: 'Healing Tower', icon: '🏥', type: 'tower', cost: 50, maxPerGame: 3, description: 'Auto-deploys each wave, heals 1 HP/2s' },
    { id: 'landmine', name: 'Landmine', icon: '💥', type: 'tower', cost: 75, maxPerGame: 5, description: 'Deals 50 damage when triggered' },
    { id: 'turret', name: 'Turret', icon: '🔫', type: 'tower', cost: 80, maxPerGame: 3, description: 'Auto-targets enemies (5 dmg)' },
    { id: 'frost_tower', name: 'Frost Tower', icon: '❄️', type: 'tower', cost: 100, maxPerGame: 2, description: 'Slows enemies in range' },
    { id: 'poison_tower', name: 'Poison Tower', icon: '☠️', type: 'tower', cost: 110, maxPerGame: 2, description: 'Poisons enemies in range (3 dmg/sec)' },
    
    // === PERMANENT UPGRADES (All have max buys) ===
    { id: 'damage_orb', name: 'Damage Orb', icon: '💎', type: 'permanent', cost: 100, description: 'Permanently +5% damage', maxPurchases: 6, effect: { damagePercent: 0.05 } },
    { id: 'speed_boots', name: 'Speed Boots', icon: '👟', type: 'permanent', cost: 80, description: 'Permanently +5% speed', maxPurchases: 6, effect: { speedPercent: 0.05 } },
    { id: 'health_upgrade', name: 'Health Upgrade', icon: '🛡️', type: 'permanent', cost: 140, description: 'Permanently +5% max health', maxPurchases: 6, effect: { maxHealthPercent: 0.05 } },
    { id: 'vampire_teeth', name: 'Vampire Teeth', icon: '🦷', type: 'permanent', cost: 320, description: 'Permanently +2% life steal', maxPurchases: 3, effect: { lifeSteal: 0.02 } },
    { id: 'berserker_ring', name: 'Berserker Ring', icon: '💍', type: 'permanent', cost: 250, description: 'Damage increases as health decreases (up to +10%)', maxPurchases: 3, effect: { berserkerRing: true } },
    { id: 'ninja_scroll', name: 'Ninja Scroll', icon: '📜', type: 'permanent', cost: 145, description: '+5% chance to dodge attacks', maxPurchases: 2, effect: { dodgeChance: 0.05 } },
    { id: 'alchemist_stone', name: 'Alchemist Stone', icon: '🪨', type: 'permanent', cost: 150, description: 'Earn 5% more gold', maxPurchases: 5, effect: { goldMultiplier: 0.05 } },
    { id: 'thorns_armor', name: 'Thorns Armor', icon: '🌵', type: 'permanent', cost: 120, description: 'Reflect 5% of damage', maxPurchases: 4, effect: { thornsDamage: 0.05 } },
    { id: 'wind_charm', name: 'Wind Charm', icon: '🍃', type: 'permanent', cost: 110, description: '+5% attack speed', maxPurchases: 6, effect: { attackSpeedMultiplier: 0.05 } },
    { id: 'runic_plate', name: 'Runic Plate', icon: '🔰', type: 'permanent', cost: 260, description: 'First hit each wave deals 50% less', maxPurchases: 1, effect: { firstHitReduction: true } },
    { id: 'guardian_angel', name: 'Guardian Angel', icon: '😇', type: 'permanent', cost: 200, description: 'Survive fatal damage once', maxPurchases: 1, effect: { guardianAngel: true } },
    { id: 'blood_contract', name: 'Blood Contract', icon: '📜🩸', type: 'permanent', cost: 150, description: '+1% lifesteal per stack, lose 1% HP/sec', maxPurchases: 3, effect: { bloodContract: true } },
    { id: 'crit_gloves', name: 'Crit Gloves', icon: '🧤', type: 'permanent', cost: 180, description: '+3% critical hit chance', maxPurchases: 3, effect: { criticalChance: 0.03 } },
    { id: 'reload_charm', name: 'Reload Charm', icon: '🕐', type: 'permanent', cost: 130, description: 'Reload weapons 10% faster', maxPurchases: 3, effect: { reloadSpeedMultiplier: 0.10 } },
    { id: 'gold_ring', name: 'Gold Ring', icon: '💍💰', type: 'permanent', cost: 220, description: 'Earn 5% more gold', maxPurchases: 4, effect: { goldMultiplier: 0.05 } },
    { id: 'health_regen', name: 'Health Regen', icon: '💚', type: 'permanent', cost: 160, description: 'Regenerate 0.5% HP per second', maxPurchases: 4, effect: { healthRegenPercent: 0.005 } },
    { id: 'armor_plate', name: 'Armor Plate', icon: '🛡️', type: 'permanent', cost: 190, description: 'Reduce damage taken by 3%', maxPurchases: 3, effect: { damageReduction: 0.03 } },
    { id: 'lifesteal_ring', name: 'Lifesteal Ring', icon: '🩸', type: 'permanent', cost: 280, description: 'Heal for 1% of damage dealt', maxPurchases: 3, effect: { lifeSteal: 0.01 } },
    { id: 'fire_imbue', name: 'Fire Imbue', icon: '🔥', type: 'permanent', cost: 300, description: 'Attacks have 5% chance to burn (3 dmg/sec)', maxPurchases: 2, effect: { fireImbue: true } },
    { id: 'poison_imbue', name: 'Poison Imbue', icon: '☠️', type: 'permanent', cost: 300, description: 'Attacks have 5% chance to poison (2 dmg/sec)', maxPurchases: 2, effect: { poisonImbue: true } },
    { id: 'frost_imbue', name: 'Frost Imbue', icon: '❄️', type: 'permanent', cost: 300, description: 'Attacks have 5% chance to slow enemies', maxPurchases: 2, effect: { frostImbue: true } },
    { id: 'piercing_rounds', name: 'Piercing Rounds', icon: '🔩', type: 'permanent', cost: 320, description: 'All projectiles pierce 1 enemy', maxPurchases: 2, effect: { piercingRounds: true } },
    { id: 'double_shot', name: 'Double Shot', icon: '🔫🔫', type: 'permanent', cost: 380, description: 'All weapons fire 2 projectiles', maxPurchases: 2, effect: { doubleShot: true } }
];

const STAT_BUFFS = [
    { id: 'health_boost', name: 'Health Boost', description: 'Increase max health by 10%', icon: '❤️', effect: { maxHealthPercent: 0.1 } },
    { id: 'damage_boost', name: 'Damage Boost', description: 'Increase damage by 10%', icon: '⚔️', effect: { damagePercent: 0.1 } },
    { id: 'speed_boost', name: 'Speed Boost', description: 'Increase speed by 10%', icon: '👟', effect: { speedPercent: 0.1 } },
    { id: 'life_steal', name: 'Life Steal', description: 'Heal for 1% of damage dealt', icon: '🦇', effect: { lifeSteal: 0.01 } },
    { id: 'critical_chance', name: 'Lucky Charm', description: '+5% critical hit chance', icon: '🍀', effect: { criticalChance: 0.05 } },
    { id: 'gold_bonus', name: 'Gold Bonus', description: 'Earn 10% more gold', icon: '💰', effect: { goldMultiplier: 0.1 } },
    { id: 'regen', name: 'Health Regen', description: 'Regenerate 1% HP per second', icon: '🔄', effect: { healthRegenPercent: 0.01 } },
    { id: 'armor', name: 'Armor', description: 'Reduce damage taken by 3%', icon: '🛡️', effect: { damageReduction: 0.03 } },
    { id: 'reload_speed', name: 'Quick Hands', description: 'Reload weapons 15% faster', icon: '⚡', effect: { reloadSpeedMultiplier: 0.15 } }
];
