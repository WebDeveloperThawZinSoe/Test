cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_SliderMusic: cc.Node,
        m_SliderSound: cc.Node,
    },

    ctor: function () {
        this.m_nNeedUpdate = 0;
        this.m_GameDef = null;
    },

    OnShowView: function () {
        try {
            if (!this.m_Ctrl) {
                this.m_Ctrl = new Object();
                this.m_Ctrl[window.SetKey_Music] = this.$('Page/0/Music@SettingMusic');
                this.m_Ctrl[window.SetKey_Sound] = this.$('Page/0/Sound@SettingSound');
                this.m_Ctrl[window.SetKey_Table_BG] = this.$('Page/0/TableBG@SettingTableBG');
                this.m_SelPageNode = this.$('ToggleContainer');
                if (this.m_SelPageNode) this.m_SelPageNode.active = false;
            }
            ShowO2I(this.node);
        } catch (e) {
            if (window.LOG_DEBUG) console.log(` GameSetting: OnShowView error => ${e}`);
        }
    },

    OnHideView: function () {
        HideI2O(this.node);
    },

    SetGame: function (GameDef) {
        this.m_GameDef = GameDef;
        for (var i in this.m_Ctrl) {
            if (this.m_Ctrl[i] && this.m_Ctrl[i].SetGame) this.m_Ctrl[i].SetGame(GameDef);
        }

        try {
            if (this.m_GameDef) {
                // 查找游戏设置
                var bExist = cc.gPreLoader.Exist_Prefab(`Setting_${this.m_GameDef.KIND_ID}`);
                if (bExist) {
                    if (this.m_SelPageNode) this.m_SelPageNode.active = true;
                } else {
                    if (this.m_SelPageNode) this.m_SelPageNode.active = false;
                }
            }
        } catch (e) {
            if (window.LOG_DEBUG) console.log(` GameSetting: SetGame error => ${e}`);
        }
    },

    OnChangePage: function (Index, PageNode) {
        try {
            if (Index == 0) {
                if (!this.m_GameDef) return;
                window.LoadSetting();
                window.LoadSetting(this.m_GameDef.KIND_ID);
                if (this.m_Ctrl[window.SetKey_Music].Load) this.m_Ctrl[window.SetKey_Music].Load();
                if (this.m_Ctrl[window.SetKey_Sound].Load) this.m_Ctrl[window.SetKey_Sound].Load();
                if (this.m_Ctrl[window.SetKey_Table_BG].Load) this.m_Ctrl[window.SetKey_Table_BG].Load();
            } else if (Index == 1) {
                if (!this.m_GameDef) return;
                window.LoadSetting();
                window.LoadSetting(this.m_GameDef.KIND_ID);
                this.ShowPrefabDLG(`Setting_${this.m_GameDef.KIND_ID}`, PageNode, function (Js) {
                    this.m_Ctrl[this.m_GameDef.KIND_ID] = Js;
                    if (this.m_Ctrl[this.m_GameDef.KIND_ID]) {
                        if (this.m_Ctrl[this.m_GameDef.KIND_ID].SetGame) this.m_Ctrl[this.m_GameDef.KIND_ID].SetGame(this.m_GameDef);
                        if (this.m_Ctrl[this.m_GameDef.KIND_ID].Load) this.m_Ctrl[this.m_GameDef.KIND_ID].Load();
                    }
                }.bind(this));

            } else if (Index == 2) {
                window.LoadSetting();
                window.LoadSetting(this.m_GameDef.KIND_ID);
            }
        } catch (e) {
            if (window.LOG_DEBUG) console.log(` GameSetting: OnChangePage error => ${e}`);
        }
    },
});
