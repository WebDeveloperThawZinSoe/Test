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
        this.$(`layout/${window.g_Setting[window.SetKey_Lobby_Music]}@Toggle`).isChecked = true;
    },
    onTogClicked: function (tog) {
        cc.gSoundRes.PlayMusic("BGM" + tog.node.name, false);
        window.SaveSetting(window.SetKey_Lobby_Music, parseInt(tog.node.name));
    },
});
