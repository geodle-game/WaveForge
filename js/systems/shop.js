// ============================================
// WAVEFORGE - Shop System
// ============================================

const Shop = {
    items: [],
    init() { this.items = []; },

    generateItems() {
        this.items = [];
        let availWeapons = WEAPON_DATA.filter(w => w.id !== 'handgun' && !Player.weapons.some(pw => pw.id === w.id && pw.tier >= 5));
        for (let i = 0; i < 2; i++) {
            if (availWeapons.length) {
                const idx = Math.floor(Math.random() * availWeapons.length);
                const weaponData = availWeapons[idx];
                let tier = 1;
                if (Game.wave >= 20 && Math.random() < 0.15) tier = 3;
                else if (Game.wave >= 10 && Math.random() < 0.3) tier = 2;
                this.items.push({ type: 'weapon', data: weaponData, tier: tier, instance: WeaponBase.create(weaponData, tier) });
                availWeapons.splice(idx, 1);
            }
        }
        let availItems = [...ITEM_DATA].filter(it => {
            if (it.id === 'landmine' && Towers.landmines.count >= Towers.landmines.max) return false;
            if (it.id === 'healing_tower' && Towers.healingTowers.count >= Towers.healingTowers.max) return false;
            if (it.id === 'turret' && Towers.turrets.count >= Towers.turrets.max) return false;
            if (it.id === 'frost_tower' && Towers.frostTowers.count >= Towers.frostTowers.max) return false;
            if (it.id === 'poison_tower' && Towers.poisonTowers.count >= Towers.poisonTowers.max) return false;
            if (it.id === 'runic_plate' && Game.purchasedItems.runicPlate) return false;
            if (it.id === 'guardian_angel' && Game.purchasedItems.guardianAngel) return false;
            if (it.id === 'vampire_teeth' && (Game.purchasedItems.vampireTeeth || 0) >= CONFIG.PURCHASE_LIMITS.vampireTeeth) return false;
            if (it.id === 'blood_contract' && (Game.purchasedItems.bloodContract || 0) >= CONFIG.PURCHASE_LIMITS.bloodContract) return false;
            if (it.id === 'damage_orb' && (Game.purchasedItems.damageOrb || 0) >= CONFIG.PURCHASE_LIMITS.damageOrb) return false;
            if (it.id === 'speed_boots' && (Game.purchasedItems.speedBoots || 0) >= CONFIG.PURCHASE_LIMITS.speedBoots) return false;
            if (it.id === 'health_upgrade' && (Game.purchasedItems.healthUpgrade || 0) >= CONFIG.PURCHASE_LIMITS.healthUpgrade) return false;
            if (it.id === 'berserker_ring' && (Game.purchasedItems.berserkerRing || 0) >= CONFIG.PURCHASE_LIMITS.berserkerRing) return false;
            if (it.id === 'ninja_scroll' && (Game.purchasedItems.ninjaScroll || 0) >= CONFIG.PURCHASE_LIMITS.ninjaScroll) return false;
            if (it.id === 'alchemist_stone' && (Game.purchasedItems.alchemistStone || 0) >= CONFIG.PURCHASE_LIMITS.alchemistStone) return false;
            if (it.id === 'thorns_armor' && (Game.purchasedItems.thornsArmor || 0) >= CONFIG.PURCHASE_LIMITS.thornsArmor) return false;
            if (it.id === 'wind_charm' && (Game.purchasedItems.windCharm || 0) >= CONFIG.PURCHASE_LIMITS.windCharm) return false;
            if (it.id === 'crit_gloves' && (Game.purchasedItems.critGloves || 0) >= CONFIG.PURCHASE_LIMITS.critGloves) return false;
            if (it.id === 'reload_charm' && (Game.purchasedItems.reloadCharm || 0) >= CONFIG.PURCHASE_LIMITS.reloadCharm) return false;
            if (it.id === 'gold_ring' && (Game.purchasedItems.goldRing || 0) >= CONFIG.PURCHASE_LIMITS.goldRing) return false;
            if (it.id === 'health_regen' && (Game.purchasedItems.healthRegen || 0) >= CONFIG.PURCHASE_LIMITS.healthRegen) return false;
            if (it.id === 'armor_plate' && (Game.purchasedItems.armorPlate || 0) >= CONFIG.PURCHASE_LIMITS.armorPlate) return false;
            if (it.id === 'lifesteal_ring' && (Game.purchasedItems.lifestealRing || 0) >= CONFIG.PURCHASE_LIMITS.lifestealRing) return false;
            if (it.id === 'explosive_rounds' && (Game.purchasedItems.explosiveRounds || 0) >= CONFIG.PURCHASE_LIMITS.explosiveRounds) return false;
            if (it.id === 'knockback_force' && (Game.purchasedItems.knockbackForce || 0) >= CONFIG.PURCHASE_LIMITS.knockbackForce) return false;
            if (it.id === 'fire_imbue' && (Game.purchasedItems.fireImbue || 0) >= CONFIG.PURCHASE_LIMITS.fireImbue) return false;
            if (it.id === 'poison_imbue' && (Game.purchasedItems.poisonImbue || 0) >= CONFIG.PURCHASE_LIMITS.poisonImbue) return false;
            if (it.id === 'frost_imbue' && (Game.purchasedItems.frostImbue || 0) >= CONFIG.PURCHASE_LIMITS.frostImbue) return false;
            if (it.id === 'piercing_rounds' && (Game.purchasedItems.piercingRounds || 0) >= CONFIG.PURCHASE_LIMITS.piercingRounds) return false;
            if (it.id === 'double_shot' && (Game.purchasedItems.doubleShot || 0) >= CONFIG.PURCHASE_LIMITS.doubleShot) return false;
            return true;
        });
        for (let i = 0; i < 2; i++) {
            if (availItems.length) {
                const idx = Math.floor(Math.random() * availItems.length);
                this.items.push({ type: 'item', data: availItems[idx] });
                availItems.splice(idx, 1);
            }
        }
        this.items.sort(() => Math.random() - 0.5);
        HUD.updateShop();
    },

    refresh() {
        if (Game.gold < Game.refreshCost) { Messages.show(`Not enough gold! Need ${Game.refreshCost}g`); return; }
        Game.gold -= Game.refreshCost;
        Game.refreshCount++;
        Game.refreshCost = CONFIG.SHOP_REFRESH_BASE_COST + Game.refreshCount * CONFIG.SHOP_REFRESH_COST_INCREMENT;
        this.generateItems();
        Messages.show(`Shop refreshed! Cost increased to ${Game.refreshCost}g`);
        HUD.updateStats();
    },

    purchase(index) {
        if (index < 0 || index >= this.items.length || !this.items[index]) return;
        const shopItem = this.items[index], data = shopItem.data;
        let cost = data.cost;
        if (shopItem.type === 'weapon') cost = shopItem.instance.getShopCost();
        if (Game.gold < cost) { Messages.show(`Not enough gold! Need ${cost}, have ${Game.gold}`); return; }
        if (shopItem.type === 'weapon') {
            const existingWeapon = Player.weapons.find(w => w.id === data.id && w.tier === (shopItem.tier || 1) && w.tier < 5);
            if (existingWeapon) {
                const mergeCost = existingWeapon.getMergeCost(shopItem.instance), totalCost = cost + mergeCost;
                if (Game.gold < totalCost) { Messages.show(`Not enough gold! Need ${totalCost}g (includes merge cost)`); return; }
                Game.gold -= totalCost;
                const merged = existingWeapon.merge(shopItem.instance);
                const idx = Player.weapons.indexOf(existingWeapon);
                Player.weapons[idx] = merged;
                Messages.show(`Auto-merged to ${merged.getDisplayName()}!`);
                this.items[index] = null; HUD.updateAll(); HUD.updateConsumables(); return;
            }
            if (Player.weapons.length >= CONFIG.MAX_WEAPON_SLOTS) { Messages.show('No empty weapon slots!'); return; }
            Game.gold -= cost;
            Player.addWeapon(data, shopItem.tier || 1);
            Messages.show(`Purchased ${data.name} Tier ${shopItem.tier || 1}!`);
        } else {
            Game.gold -= cost;
            this.applyItemEffect(data);
            Messages.show(`Purchased ${data.name}!`);
        }
        this.items[index] = null; HUD.updateAll(); HUD.updateConsumables();
    },

    applyItemEffect(item) {
        // Consumables
        if (item.type === 'consumable') {
            const existing = Player.consumables.find(c => c.id === item.id);
            if (existing) existing.count++;
            else Player.consumables.push({ id: item.id, name: item.name, icon: item.icon, description: item.description, count: 1 });
            HUD.updateConsumables(); return;
        }
        switch (item.id) {
            // === PERMANENT UPGRADES ===
            case 'damage_orb': Player.damageMultiplier += CONFIG.PERMANENT_UPGRADES.DAMAGE_ORB_PERCENT; Game.purchasedItems.damageOrb = (Game.purchasedItems.damageOrb || 0) + 1; break;
            case 'speed_boots': Player.speedMultiplier += CONFIG.PERMANENT_UPGRADES.SPEED_BOOTS_PERCENT; Player.speed = Player.baseSpeed * Player.speedMultiplier; Game.purchasedItems.speedBoots = (Game.purchasedItems.speedBoots || 0) + 1; break;
            case 'health_upgrade': const oldMax = Player.maxHealth; Player.maxHealth = Math.floor(oldMax * (1 + CONFIG.PERMANENT_UPGRADES.HEALTH_UPGRADE_PERCENT)); Player.health += Player.maxHealth - oldMax; Game.purchasedItems.healthUpgrade = (Game.purchasedItems.healthUpgrade || 0) + 1; break;
            case 'vampire_teeth': if ((Game.purchasedItems.vampireTeeth || 0) >= CONFIG.PURCHASE_LIMITS.vampireTeeth) { Messages.show('Max vampire teeth!'); Game.gold += item.cost; return; } Player.lifeSteal += CONFIG.PERMANENT_UPGRADES.VAMPIRE_TEETH_PERCENT; Game.purchasedItems.vampireTeeth = (Game.purchasedItems.vampireTeeth || 0) + 1; break;
            case 'berserker_ring': if ((Game.purchasedItems.berserkerRing || 0) >= CONFIG.PURCHASE_LIMITS.berserkerRing) { Messages.show('Max berserker rings!'); Game.gold += item.cost; return; } Player.berserkerRing = true; Game.purchasedItems.berserkerRing = (Game.purchasedItems.berserkerRing || 0) + 1; break;
            case 'ninja_scroll': if ((Game.purchasedItems.ninjaScroll || 0) >= CONFIG.PURCHASE_LIMITS.ninjaScroll) { Messages.show('Max ninja scrolls!'); Game.gold += item.cost; return; } Player.dodgeChance += CONFIG.PERMANENT_UPGRADES.NINJA_SCROLL_PERCENT; Game.purchasedItems.ninjaScroll = (Game.purchasedItems.ninjaScroll || 0) + 1; break;
            case 'alchemist_stone': if ((Game.purchasedItems.alchemistStone || 0) >= CONFIG.PURCHASE_LIMITS.alchemistStone) { Messages.show('Max alchemist stones!'); Game.gold += item.cost; return; } Player.goldMultiplier += CONFIG.PERMANENT_UPGRADES.ALCHEMIST_STONE_PERCENT; Game.purchasedItems.alchemistStone = (Game.purchasedItems.alchemistStone || 0) + 1; break;
            case 'thorns_armor': if ((Game.purchasedItems.thornsArmor || 0) >= CONFIG.PURCHASE_LIMITS.thornsArmor) { Messages.show('Max thorns armor!'); Game.gold += item.cost; return; } Player.thornsDamage += CONFIG.PERMANENT_UPGRADES.THORNS_ARMOR_PERCENT; Game.purchasedItems.thornsArmor = (Game.purchasedItems.thornsArmor || 0) + 1; break;
            case 'wind_charm': if ((Game.purchasedItems.windCharm || 0) >= CONFIG.PURCHASE_LIMITS.windCharm) { Messages.show('Max wind charms!'); Game.gold += item.cost; return; } Player.attackSpeedMultiplier += CONFIG.PERMANENT_UPGRADES.WIND_CHARM_PERCENT; Game.purchasedItems.windCharm = (Game.purchasedItems.windCharm || 0) + 1; break;
            case 'runic_plate': if (Game.purchasedItems.runicPlate) { Messages.show('Already purchased!'); Game.gold += item.cost; return; } Player.firstHitReduction = true; Player.firstHitActive = true; Game.purchasedItems.runicPlate = true; break;
            case 'guardian_angel': if (Game.purchasedItems.guardianAngel) { Messages.show('Already purchased!'); Game.gold += item.cost; return; } Player.guardianAngel = true; Game.purchasedItems.guardianAngel = true; break;
            case 'blood_contract': if ((Game.purchasedItems.bloodContract || 0) >= CONFIG.PURCHASE_LIMITS.bloodContract) { Messages.show('Max blood contracts!'); Game.gold += item.cost; return; } if (!Player.bloodContract) { Player.bloodContract = true; Player.bloodContractStacks = 1; Player.lifeSteal += 0.02; if (Player.bloodContractInterval) clearInterval(Player.bloodContractInterval); Player.bloodContractInterval = setInterval(() => { if (Game.state === GAME_STATE.WAVE) { const dmg = Math.max(1, Math.floor(Player.maxHealth * 0.01 * Player.bloodContractStacks)); if (Player.health > dmg) Player.takeDamage(dmg); } }, 1000); } else { Player.bloodContractStacks++; Player.lifeSteal += 0.02; } Game.purchasedItems.bloodContract = (Game.purchasedItems.bloodContract || 0) + 1; break;
            case 'crit_gloves': if ((Game.purchasedItems.critGloves || 0) >= CONFIG.PURCHASE_LIMITS.critGloves) { Messages.show('Max crit gloves!'); Game.gold += item.cost; return; } Player.criticalChance += CONFIG.PERMANENT_UPGRADES.CRIT_GLOVES_PERCENT; Game.purchasedItems.critGloves = (Game.purchasedItems.critGloves || 0) + 1; break;
            case 'reload_charm': if ((Game.purchasedItems.reloadCharm || 0) >= CONFIG.PURCHASE_LIMITS.reloadCharm) { Messages.show('Max reload charms!'); Game.gold += item.cost; return; } Player.reloadSpeedMultiplier += CONFIG.PERMANENT_UPGRADES.RELOAD_CHARM_PERCENT; Game.purchasedItems.reloadCharm = (Game.purchasedItems.reloadCharm || 0) + 1; break;
            case 'gold_ring': if ((Game.purchasedItems.goldRing || 0) >= CONFIG.PURCHASE_LIMITS.goldRing) { Messages.show('Max gold rings!'); Game.gold += item.cost; return; } Player.goldMultiplier += CONFIG.PERMANENT_UPGRADES.GOLD_RING_PERCENT; Game.purchasedItems.goldRing = (Game.purchasedItems.goldRing || 0) + 1; break;
            case 'health_regen': if ((Game.purchasedItems.healthRegen || 0) >= CONFIG.PURCHASE_LIMITS.healthRegen) { Messages.show('Max health regen!'); Game.gold += item.cost; return; } Player.healthRegenPercent += CONFIG.PERMANENT_UPGRADES.HEALTH_REGEN_PERCENT; Game.purchasedItems.healthRegen = (Game.purchasedItems.healthRegen || 0) + 1; break;
            case 'armor_plate': if ((Game.purchasedItems.armorPlate || 0) >= CONFIG.PURCHASE_LIMITS.armorPlate) { Messages.show('Max armor plates!'); Game.gold += item.cost; return; } Player.damageReduction += CONFIG.PERMANENT_UPGRADES.ARMOR_PLATE_PERCENT; Game.purchasedItems.armorPlate = (Game.purchasedItems.armorPlate || 0) + 1; break;
            case 'lifesteal_ring': if ((Game.purchasedItems.lifestealRing || 0) >= CONFIG.PURCHASE_LIMITS.lifestealRing) { Messages.show('Max lifesteal rings!'); Game.gold += item.cost; return; } Player.lifeSteal += CONFIG.PERMANENT_UPGRADES.LIFESTEAL_RING_PERCENT; Game.purchasedItems.lifestealRing = (Game.purchasedItems.lifestealRing || 0) + 1; break;
            case 'explosive_rounds': if ((Game.purchasedItems.explosiveRounds || 0) >= CONFIG.PURCHASE_LIMITS.explosiveRounds) { Messages.show('Max explosive rounds!'); Game.gold += item.cost; return; } Player.explosiveKills = true; Game.purchasedItems.explosiveRounds = (Game.purchasedItems.explosiveRounds || 0) + 1; break;
            case 'knockback_force': if ((Game.purchasedItems.knockbackForce || 0) >= CONFIG.PURCHASE_LIMITS.knockbackForce) { Messages.show('Max knockback force!'); Game.gold += item.cost; return; } Player.knockback = true; Game.purchasedItems.knockbackForce = (Game.purchasedItems.knockbackForce || 0) + 1; break;
            case 'fire_imbue': if ((Game.purchasedItems.fireImbue || 0) >= CONFIG.PURCHASE_LIMITS.fireImbue) { Messages.show('Max fire imbue!'); Game.gold += item.cost; return; } Player.fireImbue = true; Game.purchasedItems.fireImbue = (Game.purchasedItems.fireImbue || 0) + 1; break;
            case 'poison_imbue': if ((Game.purchasedItems.poisonImbue || 0) >= CONFIG.PURCHASE_LIMITS.poisonImbue) { Messages.show('Max poison imbue!'); Game.gold += item.cost; return; } Player.poisonImbue = true; Game.purchasedItems.poisonImbue = (Game.purchasedItems.poisonImbue || 0) + 1; break;
            case 'frost_imbue': if ((Game.purchasedItems.frostImbue || 0) >= CONFIG.PURCHASE_LIMITS.frostImbue) { Messages.show('Max frost imbue!'); Game.gold += item.cost; return; } Player.frostImbue = true; Game.purchasedItems.frostImbue = (Game.purchasedItems.frostImbue || 0) + 1; break;
            case 'piercing_rounds': if ((Game.purchasedItems.piercingRounds || 0) >= CONFIG.PURCHASE_LIMITS.piercingRounds) { Messages.show('Max piercing rounds!'); Game.gold += item.cost; return; } Player.piercingRounds = true; Game.purchasedItems.piercingRounds = (Game.purchasedItems.piercingRounds || 0) + 1; break;
            case 'double_shot': if ((Game.purchasedItems.doubleShot || 0) >= CONFIG.PURCHASE_LIMITS.doubleShot) { Messages.show('Max double shot!'); Game.gold += item.cost; return; } Player.doubleShot = true; Game.purchasedItems.doubleShot = (Game.purchasedItems.doubleShot || 0) + 1; break;
            
            // === TOWERS ===
            case 'landmine': if (!Towers.purchaseTower('landmine')) { Messages.show('Max landmines!'); Game.gold += item.cost; return; } break;
            case 'healing_tower': if (!Towers.purchaseTower('healing_tower')) { Messages.show('Max healing towers!'); Game.gold += item.cost; return; } break;
            case 'turret': if (!Towers.purchaseTower('turret')) { Messages.show('Max turrets!'); Game.gold += item.cost; return; } break;
            case 'frost_tower': if (!Towers.purchaseTower('frost_tower')) { Messages.show('Max frost towers!'); Game.gold += item.cost; return; } break;
            case 'poison_tower': if (!Towers.purchaseTower('poison_tower')) { Messages.show('Max poison towers!'); Game.gold += item.cost; return; } break;
        }
    },

    getCost(shopItem) { if (shopItem.type === 'weapon') return shopItem.instance.getShopCost(); return shopItem.data.cost; }
};
