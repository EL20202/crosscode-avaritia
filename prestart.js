const icons = new ig.Font("media/font/el-item-icon-infinity.png", 16, ig.MultiFont.ICON_START);

const fontIndex = sc.fontsystem.font.iconSets.length;

sc.fontsystem.font.pushIconSet(icons);

sc.fontsystem.font.setMapping({
    "item-default-infinity": [fontIndex, 0],
    "item-helm-infinity": [fontIndex, 1],
    "item-sword-infinity": [fontIndex, 2],
    "item-belt-infinity": [fontIndex, 3],
    "item-shoe-infinity": [fontIndex, 4],
    "item-items-infinity": [fontIndex, 5],
    "item-key-infinity": [fontIndex, 6],
    "item-trade-infinity": [fontIndex, 7],
    "item-toggle-infinity": [fontIndex, 8],
    "item-singularity-infinity": [fontIndex, 9]
})

sc.ITEMS_RARITY.RAINBOW = 584 //a random number only to reduce any chance of conflict

sc.Inventory.inject({
    getRaritySuffix(rarity) {
        if (rarity === sc.ITEMS_RARITY.RAINBOW) return "-infinity"
        else return this.parent(rarity)
    }
})

Object.assign(sc.MODIFIERS, {
    EL_AVAR_INFINITE_DASH: {
        altSheet: "media/gui/modifiers/avaritia.png",
        offX: 12 * 0,
        offY: 0,
        icon: -1,
        order: 0,
        noPercent: true
    },

    EL_AVAR_INFINITY_POWER: {
        altSheet: "media/gui/modifiers/avaritia.png",
        offX: 12 * 2,
        offY: 0,
        icon: -1,
        order: 0,
        noPercent: false
    },

    EL_AVAR_POWER_SHIELD: {
        altSheet: "media/gui/modifiers/avaritia.png",
        offX: 12 * 4,
        offY: 0,
        icon: -1,
        order: 0,
        noPercent: false
    }
})

ig.ENTITY.Player.inject({
    getMaxDashes() {
        return this.params.getModifier("EL_AVAR_INFINITE_DASH") ? Infinity : this.parent();
    }
})

sc.EquipMenuMiddleIcon.inject({
    rainbowEquipGfx: new ig.Image("media/gui/avaritia-gui.png"),
    rainbowEquipIcon: null,
    
    init() {
        this.parent();
        this.rainbowEquipIcon = new ig.ImageGui(this.rainbowEquipGfx, 0, 0, 11, 12);
        this.rainbowEquipIcon.hook.transitions = this.equipIcon.hook.transitions;
        this.rainbowEquipIcon.setPos(14, 14)
        this.addChildGui(this.rainbowEquipIcon);
    },

    setEquip(rarity, equipType, level, skipAnim) {
        if(rarity == sc.ITEMS_RARITY.RAINBOW) {
            this.rainbowEquipIcon.doStateTransition("HIDDEN", true);
            this.rainbowEquipIcon.offsetY = this.getTypeIndex(equipType) * 12;
            this.rainbowEquipIcon.doStateTransition("DEFAULT", skipAnim);
        } else this.rainbowEquipIcon.doStateTransition("HIDDEN", true);
        this.parent(rarity, equipType, level, skipAnim)
    }
})

sc.CombatParams.inject({
    getModifier(modifier) {
        let parentValue = this.parent(modifier);

        if(this.combatant && this.combatant.isPlayer && !sc.model.player.getCore(sc.PLAYER_CORE.MODIFIER) || sc.arena.isStatusModifierBlocked(modifier)) return parentValue;

        let modifiersActive = {
            superShield: this.parent("EL_AVAR_POWER_SHIELD")
        }

        switch(modifier) {
            case "GUARD_AREA":
            case "PERFECT_GUARD_RESET":
                return parentValue + (modifiersActive.superShield ? 2 : 0)
            case "PERFECT_GUARD_WINDOW":
            case "GUARD_STRENGTH":
                return modifiersActive.superShield ? Infinity : parentValue

        }
        return parentValue;
    }
})

let origFunction = sc.MenuHelper.drawLevel;
let infinityImg = new ig.Image("media/gui/avaritia-gui.png")

sc.MenuHelper.drawLevel = function(level, a, e, numberGfx, isScalable) {
    if(level == 99.919) {
        a = 13;
        e = e - 7;

        sc.options.get("level-letter-display") && infinityImg.draw(0, e, 12, 0, 5, 7);

        infinityImg.draw(4, e, 17, 0, 10, 7)

    } else origFunction(level, a, e, numberGfx, isScalable);
}

sc.CombatantShieldConnection.inject({
    isPerfect() {
        return this.combatant.params.getModifier("EL_AVAR_POWER_SHIELD") ? true : this.parent()
    }
})