
var ID_CHI = 0;
var ID_PENG = 1;
var ID_WUFU = 2;
var ID_HU = 3;
var ID_BI = 4;
var ID_PASS = 5;

cc.Class({
    extends: cc.BaseControl,

    properties: {
        m_btOperate: [cc.Button],
    },

    ctor: function() {
        this.m_cbCurrentCard = 0;
    },

    onLoad: function () {
        this.SetControlInfo(0, 0);
    },

    start: function () {
    },

    SetAttribute2: function () {
    },

    SetControlInfo: function (cbCurrentCard, cbOperateCode){
        // console.log(' ######### SetControlInfo cbCurrentCard=' + cbCurrentCard + ';cbOperateCode=' +cbOperateCode);

        this.m_cbCurrentCard = cbCurrentCard;
        for(var i = 0; i < this.m_btOperate.length; ++ i) {
            if(this.GetActionByID(i) & cbOperateCode) {
                this.m_btOperate[i].node.active = true;
            } else {
                this.m_btOperate[i].node.active = false;
            }
        }
        if(cbOperateCode > 0) {
            this.node.active = true;
            this.m_btOperate[i - 1].node.active = true;

            // 有胡必胡
            // if(this.m_Attribute._ClientEngine.m_dwRules & GameDef.GAME_TYPE_WAN_FA_2) {
                if(cbOperateCode & GameDef.ACK_CHIHU) {
                    // this.m_Attribute._ClientEngine.OnMessageOperate(cbAction, this.m_cbCurrentCard);
                    this.m_btOperate[i - 1].node.active = false;
                }
            // }
        } else {
            this.node.active = false;
        }
    },

    // update (dt) {},
    OnButtonClicked: function(event, customData) {
        var cbAction = this.GetActionByID(Number(customData));
        if(cbAction == GameDef.ACK_ZHANG) {

        } else {
            if(this.m_Attribute._ClientEngine && this.m_Attribute._ClientEngine.OnMessageOperate) {
                this.m_Attribute._ClientEngine.OnMessageOperate(cbAction, this.m_cbCurrentCard);
            }
        }
    },

    GetActionByID: function(cbID) {
        switch(cbID) {
            case ID_CHI: return GameDef.ACK_CHI;
            case ID_PENG: return GameDef.ACK_PENG;
            case ID_WUFU: return GameDef.ACK_LISTEN_WUFU;
            case ID_HU: return GameDef.ACK_CHIHU;
            case ID_BI: return GameDef.ACK_ZHANG;
            case ID_PASS: return GameDef.ACK_NULL;
            default: GameDef.ACK_NULL;
        }
    }
});
