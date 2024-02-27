cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    onLoad: function () {
        for (var i = 0; i < 3; i++) {
            this.$(`layout/${i}`).on('toggle', this.onTogClicked, this);
        }
    },
    start: function () {
        this.$(`layout/${window.g_Setting[window.SetKey_Lobby_BG]}@Toggle`).isChecked = true;
    },
    onTogClicked: function (tog) {
        window.SaveSetting(window.SetKey_Lobby_BG, parseInt(tog.node.name));
        if (g_Lobby) {
            g_Lobby.onSwitchBG(tog.node.name);
        }
    },
});
