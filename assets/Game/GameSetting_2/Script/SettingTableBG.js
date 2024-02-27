cc.Class({
    extends: cc.BaseControl,

    properties: {},

    ctor: function () {
        this.m_GameDef = null;
        this.m_Toggle = null;
    },

    OnShowView: function () {},


    OnToggleClicked: function (Tag, Data) {
        cc.gSoundRes.PlaySound('Button');
        this.m_Toggle = Tag;
    },

    update: function () {
        if (this._view3D != window.g_GameSetting[this.m_GameDef.KIND_ID][window.SetKey_VIEW_3D]) {
            this.Load();
            return;
        }
        if (!!this.m_Toggle) {
            var pair = this.GetPair(this.m_Toggle);
            var pathInfo = window.Path_GameBG(this.m_GameDef.KIND_ID, pair.value, null, true);
            this.m_GameDef.BGPath = pathInfo.path;
            this.m_GameDef.BGIndex = pathInfo.BGIndex;
            window.gGameBG = 'loading';
            this.m_Toggle = null;
        }
    },

    //////////////////////////////////////////////////

    SetGame: function (GameDef) {
        this.m_GameDef = GameDef;
    },

    Load: function () {
        try {
            if (!!!this.m_ToggleArr) {
                this.m_ToggleArr = new Array();
                this.TraverseToggle(this.node, this.m_ToggleArr);
            }
            for (var i in this.m_ToggleArr) {
                this.m_ToggleArr[i].node.active = false;
            }
            if (!!!this.m_GameDef) return;
            var wKindID = this.m_GameDef.KIND_ID;
            for (var i in this.m_ToggleArr) {
                var pair = this.GetPair(this.m_ToggleArr[i]);
                if (!!!pair) continue;
                if (pair.key != window.SetKey_Table_BG) continue;
                var bgInfo = window.Path_GameBG(wKindID, pair.value, null, false);
                if (!bgInfo || !bgInfo.exist) continue;

                this.m_ToggleArr[i].node.active = true;
                cc.gPreLoader.LoadRes(bgInfo.path, `${wKindID}`, function (sf, Param) {
                    var pSp = this.$('Background@Sprite', Param.Tog.node)
                    pSp.spriteFrame = sf;
                }.bind(this), {
                    Tog: this.m_ToggleArr[i],
                    Pair: pair
                });
                this.m_ToggleArr[i].isChecked = (pair.value == window.g_GameSetting[wKindID][window.SetKey_Table_BG]);
                if(this.m_ToggleArr[i].isChecked) {
                    this.m_Toggle = this.m_ToggleArr[i];
                }
            }
            this._view3D = window.g_GameSetting[wKindID][window.SetKey_VIEW_3D];
        } catch (e) {
            if (window.LOG_DEBUG) console.log(` SettingTableBG: Load error => ${e}`);
        }

    },
});
