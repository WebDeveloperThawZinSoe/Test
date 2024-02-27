
cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    SetRecordData(userArr){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'LastGame_63500', this);
        for(var i = 0; i < GameDef.GAME_PLAYER; i++){
            var ParaArr = new Object();
            if(userArr.wLastUserID[i]==0)continue;
            ParaArr.id = userArr.wLastUserID[i];
            ParaArr.cardData = userArr.cbLastCardData[i];
            ParaArr.bGiveUp = userArr.bLastGiveUp[i];
            this.m_ListCtrl.InsertListInfo(0,ParaArr);

        }
    },

    // update (dt) {},

    //////////////////////////////////////////////////
    InitPre:function(){
        
    },
    SetPreInfo:function(ParaArr){
        
        var cardPre = this.$('CardCtrl').getComponent('CardCtrl_'+GameDef.KIND_ID);
        if(!ParaArr.bGiveUp){
            cardPre.SetCardDistance(-120);
            cardPre.SetCardData(ParaArr.cardData,5);
        }else{
            ParaArr.cardData[0] = 0;
            ParaArr.cardData[1] = 0;
            cardPre.SetCardDistance(-120);
            cardPre.SetCardData(ParaArr.cardData,2);
            cardPre.SetGiveUp();


        }
        
        this.getComponent('UserCtrl').SetUserByID(ParaArr.id);
    },

});
