cc.Class({
    extends: cc.BaseControl,

    properties: {
    },

    ctor: function () {
        this.m_nNeedUpdate = 0;
        this.m_GameDef = null;
    },

    OnShowView: function () {
    },


    OnToggleClicked: function (Tag, Data) {
        cc.gSoundRes.PlaySound('Button');
        this.m_Toggle = Tag;
        this.m_nNeedUpdate = 1;
    },

    update: function(){
        if(this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate--;
        } else {
            return;
        }
        var pair = this.GetPair(this.m_Toggle);
        window.SaveSetting(pair.key, pair.value, this.m_GameDef.KIND_ID);
        this.m_Toggle = null;
    },

    //////////////////////////////////////////////////

    SetGame: function (GameDef) {
        this.m_GameDef = GameDef;
    },

    Load: function() {
        if (!this.m_ToggleArr) {
            this.m_ToggleArr = new Array();
            this.TraverseToggle(this.node, this.m_ToggleArr);
        }
        for(var i in this.m_ToggleArr) {
            var pair = this.GetPair(this.m_ToggleArr[i]);
            if(!pair) continue;
            this.m_ToggleArr[i].isChecked = (pair.value == window.g_GameSetting[this.m_GameDef.KIND_ID][pair.key]);
        }
    },
});
