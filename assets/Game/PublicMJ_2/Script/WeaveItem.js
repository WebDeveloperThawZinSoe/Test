
cc.Class({
    extends: cc.Component,

    properties: {
        m_CardNodeTB:[cc.Node],
        m_CardNodeLR:[cc.Node],
    },

    // LIFE-CYCLE CALLBACKS:
    ctor:function(){
        this.m_CardArray = new Array();
        this.m_cbCardData = new Array();
    },
    onLoad () {

    },
    BuildCard:function(state,cardPrefab){
        var node;
        var offsetY = 0;
        this.m_HandState = state;
        if( state == GameDef.HAND_TOP ||
            state == GameDef.HAND_BOTTOM){
            node = this.m_CardNodeTB;
        }else if(state == GameDef.HAND_LEFT){
            node = this.m_CardNodeLR;
            offsetY = -10;
        }else if(state == GameDef.HAND_RIGHT){
            node = this.m_CardNodeLR;
            offsetY = 10;
        }
        for (var i = 0; i < node.length; i++) {
            this.m_CardArray[i] = cc.instantiate(cardPrefab);
            node[i].addChild(this.m_CardArray[i]);
            this.m_CardArray[i].y += offsetY;
            this.m_CardArray[i] = this.m_CardArray[i].getComponent('CardItem');
            this.m_CardArray[i].SetState(GameDef.HAND_STATE_SHOW);
        }
    },
    SortCardData:function(cbCardData,wCardCount){
        for(var i =0;i<wCardCount;++i)
        {
            for(var j=i+1;j<wCardCount;++j)
            {
                if(cbCardData[i]>cbCardData[j])
                {
                    var tmp = cbCardData[i];
                    cbCardData[i] = cbCardData[j];
                    cbCardData[j] = tmp;
                }
            }
        }
    },
    SetCardItemColor:function(){
        for (var i = 0; i < this.m_CardArray.length; i++) {
            this.m_CardArray[i].SetProvideType(GameDef.ITEM_PROVIDE_COLOR);
        }
    },
    SetWeaveData:function(cbCardData,wCardCount){
        this.m_wCardCount = wCardCount;
        for (var i =this.m_wCardCount; i <  this.m_CardArray.length; i++) {
            this.m_CardArray[i].node.active = false;
        }
        this.SortCardData(cbCardData,wCardCount)
        for(var i=0;i<wCardCount;++i)
        {
            if(i<wCardCount)
            {
                this.m_cbCardData[i] = cbCardData[i];
            }
            else {
                this.m_cbCardData[i] = 0;
            }
            this.m_CardArray[i].node.active=true;
            this.m_CardArray[i].SetCardData(this.m_cbCardData[i]);
            this.m_CardArray[i].SetState(GameDef.HAND_STATE_SHOW);
        }
        
    },
    SetWeaveNumber:function(cbExtraCount){
        if( cbExtraCount == null) return;
        for (var i = 0; i < 4; i++) {
            if( cbExtraCount[i] != null && cbExtraCount[i] >0){
                this.m_CardArray[i].SetNumber(cbExtraCount[i]);
            }
        }
    },
    SetWeaveState:function(arg, bEnd){
        if( typeof arg == 'object'){
            this.__setWeaveStateObj(arg, bEnd);
        }
        else{
            this.__setWeaveState(arg);
        }
    },
    __setWeaveStateObj:function(obj, bEnd){
        var WeaveState = GameDef.GANG_THREE_SHOW;
        var cbCardData = obj.cbCenterCard;
        var wWeaveKind = obj.wWeaveKind;
        var cbWeaveCardCount=GameDef.g_GameLogic.GetWeaveCard(wWeaveKind,cbCardData,obj.cbCardData);
        if( cbWeaveCardCount == 4 && !obj.cbPublicCard){
            WeaveState = GameDef.GAME_THREE_BACK_SELF;
            // var wProViewID = GameDef.g_GameEngine.SwitchViewChairID(obj.wProvideUser);
            // var wSelfID = GameDef.g_GameEngine.SwitchViewChairID(GameDef.g_GameEngine.GetMeChairID());
            // if( this.m_HandState == wProViewID && this.m_HandState == wSelfID ){
            //     WeaveState = GameDef.GAME_THREE_BACK_SELF;
            // }
            // else{
            //     WeaveState = GameDef.GAME_THREE_BACK;
            // }
        }
        
        if( obj.cbExtraCount != null){

            for (var i = 0; i < 4; i++) {
                if( obj.cbExtraCount[i] >0){
                    this.m_CardArray[i].SetNumber(obj.cbExtraCount[i]);
                }
            }
        }
        this.__setWeaveState(WeaveState);

        if(obj.wProvideUser != null && 
            obj.wProvideUser != INVALD_CHAIR && 
            (obj.wProvideUser != GameDef.g_GameEngine.GetMeChairID() || this.m_HandState != GameDef.HAND_BOTTOM || bEnd))
        {
            var wProViewID = GameDef.g_GameEngine.SwitchViewChairID(obj.wProvideUser);
            if( wWeaveKind == GameDef.WIK_LEFT || wWeaveKind == GameDef.WIK_PENG){
                this.m_CardArray[0].SetProvide(wProViewID);
            }
            if( wWeaveKind == GameDef.WIK_RIGHT){
                this.m_CardArray[2].SetProvide(wProViewID);
            }
            if( wWeaveKind == GameDef.WIK_CENTER){
                this.m_CardArray[1].SetProvide(wProViewID);
            }
            if( wWeaveKind == GameDef.WIK_CAI_ZFB){

                this.m_CardArray[cbCardData-0x35].SetProvide(wProViewID);
            }
            if( wWeaveKind == GameDef.WIK_GANG){
                this.m_CardArray[3].SetProvide(wProViewID);
            }
        }
    },
    __setWeaveState:function(state){

            //普通杠牌,1张牌摞起来,全部显示
            if( state == GameDef.GANG_THREE_SHOW){

                for (var i = 0; i < 4; i++) {
                    this.m_CardArray[i].SetState(GameDef.HAND_STATE_SHOW);
                }
            }
            else if( state == GameDef.GAME_THREE_BACK){

                for (var i = 0; i < 4; i++) {
                    this.m_CardArray[i].SetState(GameDef.HAND_STATE_SHOW_BACK);
                }
            }
            else if( state == GameDef.GAME_THREE_BACK_SELF){

                for (var i = 0; i < 4; i++) {
                    this.m_CardArray[i].SetState(GameDef.HAND_STATE_SHOW_BACK);
                }
                this.m_CardArray[3].SetState(GameDef.HAND_STATE_SHOW);
            }
    },
    // update (dt) {},
});
