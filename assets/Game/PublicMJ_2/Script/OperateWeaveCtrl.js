cc.Class({
    extends: cc.Component,

    properties: {
        m_tipChi:cc.Node,
        m_tipPeng:cc.Node,
        m_tipGang:cc.Node,
        m_tipGangBu:cc.Node,
        m_tipHaiDi:cc.Node,
        m_tipHu:cc.Node,
        m_tipMenHu:cc.Node,
        m_tipTing:cc.Node,
        m_tipGuo:cc.Node,
        m_WeaveCardPrefab:cc.Node,
        m_WeaveCardItem:cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        if(this.bLoad == false) {
            this.m_tipChi.active = false;
            this.m_tipPeng.active = false;
            this.m_tipGang.active = false;
            this.m_tipGangBu.active = false;
            this.m_tipHaiDi.active = false;
            this.m_tipHu.active = false;
            this.m_tipMenHu.active = false;
            this.m_tipTing.active = false;
            // this.m_tipDanHu.active = false;
            this.m_tipGuo.active = false;
            this.WeaveCard = this.m_WeaveCardPrefab.getComponent('WeaveItem');
            this.WeaveCard.BuildCard(GameDef.HAND_BOTTOM,this.m_WeaveCardItem);
            this.WeaveCard.SetCardItemColor();
            this.WeaveCard.m_bSelfCard = true;
            this.WeaveCard.m_bDisplayItem = true;
            this.bLoad =true;
            this.node.width = 300;
            this.node.height = 120;
        }
    },
    ctor: function (){
        //this.WeaveCard = null;
        this.bLoad =false;
        this.wOperateCode = 0;
        this.cbWeaveCardData = new Array();
        this.cbExtraCount = new Array();
    },
    SetWeaveInfo:function(pCtrl, WeaveInfo){
        this.pCtrl=pCtrl;
        GameDef.g_GameEngine.m_GameClientView.m_CardView.ChangeCardBack(this.node,GameDef.g_GameEngine.m_CardBack);
        this.cbCardCont = WeaveInfo.cbCardCount;
        this.wOperateCode = WeaveInfo.wWeaveKind;
        if(this.bLoad == false) this.onLoad();
        
        this.m_tipChi.active = false;
        this.m_tipPeng.active = false;
        this.m_tipGang.active = false;
        this.m_tipGangBu.active = false;
        this.m_tipHaiDi.active = false;
        this.m_tipHu.active = false;
        this.m_tipMenHu.active = false;
        this.m_tipTing.active = false;
        // this.m_tipDanHu.active = false;
        this.m_tipGuo.active = false;
        this.WeaveCard.node.active = true;
        switch(this.wOperateCode)
        {
            case GameDef.WIK_NULL:
            {
                this.m_tipGuo.active = true;
                this.WeaveCard.node.active = false;
                
                this.node.width = 100;
                this.node.height = 120;
                break;
            }
            case GameDef.WIK_LEFT:
            case GameDef.WIK_CENTER:
            case GameDef.WIK_RIGHT:
            case GameDef.WIK_CAI_ZFB:
            {
                this.m_tipChi.active = true;
                break;
            }
            case GameDef.WIK_PENG:
            {
                this.m_tipPeng.active = true;
                break;
            }
            case GameDef.WIK_GANG:
            case GameDef.WIK_GANG_XI:
            case GameDef.WIK_ADD_ZFB:
            {
                this.m_tipGang.active = true;
                break;
            }
            case GameDef.WIK_GANG_BU:
            {
                this.m_tipGangBu.active = true;
                break;
            }
            case GameDef.WIK_HAI_DI:
            {
                this.m_tipHaiDi.active = true;
                this.WeaveCard.node.active = false;
                break;
            }
            case GameDef.WIK_JIA_HU:
            case GameDef.WIK_CHI_HU:
            {
                this.m_tipHu.active = true;
                this.WeaveCard.node.active = false;
                break;
            }
            case GameDef.WIK_MEN_HU:
            {
                this.m_tipMenHu.active = true;
                this.WeaveCard.node.active = false;
                break;
            }
            case GameDef.WIK_LISTEN:
            {
                this.m_tipTing.active = true;
                this.WeaveCard.node.active = false;
                break;
            }
        }
        if(typeof(WeaveInfo)!='number'){
            for (var i = 0; i < 4; i++) {
                WeaveInfo.cbCardData[i]= (WeaveInfo.cbCardCount>i)?WeaveInfo.cbCardData[i]:0;
                this.cbWeaveCardData[i]= WeaveInfo.cbCardData[i];
                if( WeaveInfo.cbExtraCount != null )
                    this.cbExtraCount[i]=WeaveInfo.cbExtraCount[i]; 
            }

            this.WeaveCard.SetWeaveData(WeaveInfo.cbCardData,WeaveInfo.cbCardCount,INVALID_CHAIR,true);
            this.WeaveCard.SetWeaveState(WeaveInfo);
            this.WeaveCard.SetWeaveNumber(WeaveInfo.cbExtraCount);
        }
        else 
        {
            this.WeaveCard.node.active = false;
        }

        
    },
    subClickBtn:function(){
        if( this.wOperateCode == GameDef.WIK_GANG_XI){
            for (var i = 0; i < 4; i++) {
                if( this.cbExtraCount[i]>0)
                {
                    this.cbWeaveCardData[3] = 0x35+i;
                    break;
                }
                
            }
            this.cbCardCont = 4;
        }

        this.pCtrl.subClickBtn(this.wOperateCode,this.cbWeaveCardData,this.cbCardCont);
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
