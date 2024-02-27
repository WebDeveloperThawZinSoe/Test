cc.Class({
    extends: cc.Component,

    properties: {
        m_WeaveCtrlPrefab:cc.Prefab,
        m_OperateLayout:cc.Layout,
        m_TingTip:cc.Layout,
        m_TingItemPrefab:cc.Prefab,
    },

    // use this for initialization
    onLoad: function () {
        this.m_TingTip.node.active = false;     
    },
    ctor: function(){
        this.bFirst = false;
        this.WeaveCtrl = new Array();
        this.OptCount = 0;
        this.m_TingTipData = new Array();
    },

    SetWeaveInfo:function(WeaveInfo,cbWeaveCount){
        this.cbWeaveCount = cbWeaveCount;
        this.WeaveInfo = WeaveInfo;
        // var bHu = false;
        // for(var i=0;i<cbWeaveCount; i++)
        // {
        //     if(WeaveInfo[i].wWeaveKind == GameDef.WIK_CHI_HU)
        //     {
        //         bHu = true;
        //         break;
        //     }
        // }

        if(this.bFirst == false){
            this.m_OptPrefab = cc.instantiate(this.m_WeaveCtrlPrefab);
            var ctrl = this.m_OptPrefab.getComponent('OperateWeaveCtrl');
            this.m_OperateLayout.node.addChild(this.m_OptPrefab);
            var SelectInfo = new Array();
            SelectInfo.cbCardCount = 0;
            SelectInfo.wWeaveKind = GameDef.WIK_NULL;
            SelectInfo.cbCardData = new Array();
            ctrl.SetWeaveInfo(this,SelectInfo);
            // OptPrefab.setPosition(cc.v2(200,0));
            this.bFirst = true;
            // if(bHu == true)
            // {
            //     this.m_OptPrefab.active = false;
            // }
        }else{
            //if(bHu == false) 
            this.m_OptPrefab.active = true;
        }
        for(var i=0;i<cbWeaveCount;++i){
            if(this.OptCount<=i){
                //创建新节点
                var OptPrefab = cc.instantiate(this.m_WeaveCtrlPrefab);
                this.WeaveCtrl[i] = OptPrefab.getComponent('OperateWeaveCtrl');
                this.m_OperateLayout.node.addChild(OptPrefab);
                //OptPrefab.setPosition(cc.v2(-250*((i+1)%4),parseInt((i+1)/4)*120));
                // OptPrefab.setPosition(cc.v2(-240*(i%3),parseInt(i/3)*120));
                this.OptCount++;
            }
            this.WeaveCtrl[i].node.active = true;
            this.WeaveCtrl[i].SetWeaveInfo(this,WeaveInfo[i]);
        }
        if(cbWeaveCount<this.OptCount){
            for(var i =cbWeaveCount;i<this.OptCount;++i){
                this.WeaveCtrl[i].node.active=false;
            }
        }
    },
    subClickBtn:function(wOperateCode,cbOperateCard,cbCardCount){
        this.m_OptPrefab.active = false;
        for(var i =0;i<this.WeaveCtrl.length;++i){
            this.WeaveCtrl[i].node.active=false;
        }
        GameDef.g_GameEngine.OnCardOperate(wOperateCode,cbOperateCard,cbCardCount);
    },

});
