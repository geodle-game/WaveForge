// ============================================
// WAVEFORGE - Weapon Upgrade Definitions
// ============================================

const WEAPON_UPGRADES = [
    // === MELEE UPGRADES ===
    { id: 'sword_poison', name: 'Toxic Edge', description: 'Sword applies poison (5 dmg/sec for 3s)', icon: '☠️', weaponId: 'sword', effect: { poisonDamage: 5, poisonDuration: 3000 } },
    { id: 'sword_fire', name: 'Flaming Blade', description: 'Sword leaves fire on ground (10 dmg/sec)', icon: '🔥', weaponId: 'sword', effect: { fireDamage: 10, fireDuration: 2000 } },
    { id: 'axe_bleed', name: 'Serrated Edge', description: 'Axe causes bleeding (8 dmg/sec for 4s)', icon: '🩸', weaponId: 'axe', effect: { bleedDamage: 8, bleedDuration: 4000 } },
    { id: 'dagger_speed', name: 'Shadow Strike', description: 'Dagger attacks 30% faster', icon: '💨', weaponId: 'dagger', effect: { attackSpeedMult: 1.3 } },
    { id: 'dual_crits', name: 'Precision Blades', description: 'Dual daggers gain +15% crit chance', icon: '🎯', weaponId: 'dual_daggers', effect: { critChance: 0.15 } },
    { id: 'hammer_stun', name: 'Concussive Blow', description: 'Hammer stuns enemies for 1 second', icon: '💫', weaponId: 'hammer', effect: { stunDuration: 1000 } },
    { id: 'spear_return', name: 'Loyal Trident', description: 'Trident returns to you after thrusting', icon: '🔱', weaponId: 'spear', effect: { returningWeapon: true } },
    { id: 'spear_lightning', name: 'Channeling Trident', description: 'Trident pierce removed, but strikes lightning on hit', icon: '⚡', weaponId: 'spear', effect: { lightningStrike: true, removePierce: true } },
    
    // === RANGED UPGRADES ===
    { id: 'handgun_double', name: 'Double Tap', description: 'Handgun fires 2 bullets per shot', icon: '🔫🔫', weaponId: 'handgun', effect: { pelletCount: 2, spreadAngle: 15 } },
    { id: 'shotgun_choke', name: 'Choke Mod', description: 'Shotgun spread reduced by 50%', icon: '🔧', weaponId: 'shotgun', effect: { spreadMult: 0.5 } },
    { id: 'shotgun_slug', name: 'Slug Rounds', description: 'Shotgun fires a single powerful slug (+40 dmg)', icon: '🎯', weaponId: 'shotgun', effect: { slugMode: true, slugDamage: 40 } },
    { id: 'machinegun_pierce', name: 'Armor Piercing', description: 'Machine gun pierces through 2 enemies', icon: '🔩', weaponId: 'machinegun', effect: { pierceCount: 2 } },
    { id: 'laser_fork', name: 'Prism Lens', description: 'Laser splits into 2 when hitting an enemy', icon: '💎', weaponId: 'laser', effect: { forkLaser: true } },
    { id: 'laser_fire', name: 'Fire Imbue', description: 'Energy Gun burns enemies (5 dmg/sec)', icon: '🔥', weaponId: 'laser', effect: { fireDamage: 5, fireDuration: 2000 } },
    { id: 'laser_poison', name: 'Poison Imbue', description: 'Energy Gun poisons enemies (3 dmg/sec)', icon: '☠️', weaponId: 'laser', effect: { poisonDamage: 3, poisonDuration: 3000 } },
    { id: 'laser_frost', name: 'Frost Imbue', description: 'Energy Gun slows enemies for 1 second', icon: '❄️', weaponId: 'laser', effect: { stunDuration: 1000 } },
    { id: 'boomerang_double', name: 'Twin Boomerangs', description: 'Throw 2 boomerangs instead of 1', icon: '🪃🪃', weaponId: 'boomerang', effect: { doubleThrow: true } },
    { id: 'boomerang_orbital', name: 'Orbital Path', description: 'Boomerang orbits around you after returning', icon: '🪐', weaponId: 'boomerang', effect: { orbitalMode: true } },
    { id: 'knives_ricochet', name: 'Ricochet Blades', description: 'Throwing knives bounce to 1 extra target', icon: '🔪', weaponId: 'throwing_knives', effect: { bounceCount: 1, bounceRange: 150 } },
    { id: 'knives_fire', name: 'Fire Imbue', description: 'Throwing knives burn enemies (5 dmg/sec)', icon: '🔥', weaponId: 'throwing_knives', effect: { fireDamage: 5, fireDuration: 2000 } },
    { id: 'knives_poison', name: 'Poison Imbue', description: 'Throwing knives poison enemies (3 dmg/sec)', icon: '☠️', weaponId: 'throwing_knives', effect: { poisonDamage: 3, poisonDuration: 3000 } },
    { id: 'shuriken_double', name: 'Twin Shurikens', description: 'Throw 2 shurikens at once', icon: '𖣘𖣘', weaponId: 'shuriken', effect: { pelletCount: 2, spreadAngle: 20 } },
    { id: 'shuriken_fire', name: 'Fire Imbue', description: 'Shurikens burn enemies (5 dmg/sec)', icon: '🔥', weaponId: 'shuriken', effect: { fireDamage: 5, fireDuration: 2000 } },
    { id: 'shuriken_poison', name: 'Poison Imbue', description: 'Shurikens poison enemies (3 dmg/sec)', icon: '☠️', weaponId: 'shuriken', effect: { poisonDamage: 3, poisonDuration: 3000 } },
    { id: 'sniper_explosive', name: 'Explosive Rounds', description: 'Sniper shots explode on impact (30 dmg AOE)', icon: '💥', weaponId: 'sniper', effect: { explosiveShot: true, explosiveDamage: 30, explosiveRadius: 60 } },
    { id: 'sniper_fast', name: 'Quick Scope', description: 'Sniper attacks 40% faster', icon: '⚡', weaponId: 'sniper', effect: { attackSpeedMult: 1.4 } },
    { id: 'crossbow_triple', name: 'Triple Shot', description: 'Crossbow fires 3 bolts in a spread', icon: '🏹🏹🏹', weaponId: 'crossbow', effect: { tripleShot: true } },
    { id: 'crossbow_explosive', name: 'Blasting Bolts', description: 'Crossbow bolts explode on impact', icon: '🧨', weaponId: 'crossbow', effect: { explosiveShot: true, explosiveDamage: 25, explosiveRadius: 50 } },
    { id: 'fan_fire', name: 'Fire Imbue', description: 'Fan gusts burn enemies (5 dmg/sec)', icon: '🔥', weaponId: 'fan', effect: { fireDamage: 5, fireDuration: 2000 } },
    { id: 'fan_poison', name: 'Poison Imbue', description: 'Fan gusts poison enemies (3 dmg/sec)', icon: '☠️', weaponId: 'fan', effect: { poisonDamage: 3, poisonDuration: 3000 } },
    { id: 'fan_strong', name: 'Powerful Gust', description: 'Fan gusts knockback 50% further', icon: '💨', weaponId: 'fan', effect: { knockbackMult: 1.5 } },
    { id: 'caltrops_slow', name: 'Sticky Caltrops', description: 'Caltrops slow enemies by 30%', icon: '🕸️', weaponId: 'caltrops', effect: { slowEffect: true } },
    { id: 'caltrops_big', name: 'Big Caltrops', description: 'Caltrops are 50% larger', icon: '🔵', weaponId: 'caltrops', effect: { caltropRadiusMult: 1.5 } }
];
