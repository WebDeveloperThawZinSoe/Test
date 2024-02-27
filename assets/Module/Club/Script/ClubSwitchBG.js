cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    onLoad: function () {
        //window.LoadSetting();
        for (var i = 0; i < 3; i++) {
            this.$(`Layout/${i}`).on('toggle', this.onTogClicked, this);
        }
        for (var i = 0; i < 3; i++) {
            this.$(`Layout2/${i}`).on('toggle', this.onTogColorClicked, this);
        }
    },
    start: function () {
        this.$(`Layout/${window.g_Setting[window.SetKey_CLUB_BG]}@Toggle`).isChecked = true;
        this.$(`Layout2/${window.g_Setting[window.SetKey_CLUB_TABLE_COLOR]}@Toggle`).isChecked = true;
    },
    SetHook: function (hook) {
        this.m_Hook = hook;
    },
    onTogClicked: function (tog) {
        this.m_Hook.onSwitchBG(tog.node.name);
        window.SaveSetting(window.SetKey_CLUB_BG, parseInt(tog.node.name));
    },
    onTogColorClicked:function(tog){
        this.m_Hook.onSwitchTableBG(tog.node.name);
        window.SaveSetting(window.SetKey_CLUB_TABLE_COLOR, parseInt(tog.node.name));
    }
});
