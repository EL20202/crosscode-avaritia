const icons = new ig.Font("media/font/el-item-icon-rainbow.png", 16, ig.MultiFont.ICON_START);

const fontIndex = sc.fontsystem.font.iconSets.length;

sc.fontsystem.font.pushIconSet(icons);

sc.fontsystem.font.setMapping({
    "item-default-rainbow": [fontIndex, 0],
    "item-helm-rainbow": [fontIndex, 1],
    "item-sword-rainbow": [fontIndex, 2],
    "item-belt-rainbow": [fontIndex, 3],
    "item-shoe-rainbow": [fontIndex, 4],
    "item-items-rainbow": [fontIndex, 5],
    "item-key-rainbow": [fontIndex, 6],
    "item-trade-rainbow": [fontIndex, 7],
    "item-toggle-rainbow": [fontIndex, 8]
})

sc.ITEMS_RARITY.RAINBOW = 584 //a random number only to reduce any chance of conflict

sc.Inventory.inject({
    getRaritySuffix(rarity) {
        if (rarity === sc.ITEMS_RARITY.RAINBOW) return "-rainbow"
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
    }
})

ig.ENTITY.Player.inject({
    getMaxDashes() {
        return this.params.getModifier("EL_AVAR_INFINITE_DASH") ? Infinity : this.parent();
    }
})