
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_UserScore:cc.Label,
        m_Progress:cc.ProgressBar,
        m_BankerFlag:cc.Sprite,
        m_UserEndScore:cc.Label,
        m_SitNum:cc.Label,
        m_FirstPlayer:cc.Sprite,
        m_Atlas:cc.SpriteAtlas,
        m_FontArr:[cc.Font],

    },
    ctor :function () {
        this.m_dwUserID = 0;
    },
    // use this for initialization
    start :function() {
        this.m_BankerFlag.node.active = false;
    },
    Init:function(View, Chair) {
        this.m_Hook = View;
        this.m_ChairID = Chair;
        this.m_ViewStr = (this.m_ChairID > 4)?'UserInfo1':'UserInfo';
        this.$('UserInfo').active = false;
        this.$('UserInfo1').active = false;
        this.$(this.m_ViewStr).active = true;
        
    },

    updateShow:function(bshow){
        this.$(this.m_ViewStr).active = bshow;
    },

    SetUserItem:function(pUserItem, TableScore) {
        this.node.active = true;
        this.m_pUserItem = pUserItem;
        this.m_dwUserID = pUserItem.GetUserID();
        this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
        if(this.m_Hook.m_GameClientEngine.m_GameEnd == null)
            this.SetUserScore(pUserItem.GetUserScore(), 0);
    },
    UserLeave:function(pUserItem) {
        if(pUserItem.GetUserID() == this.m_dwUserID){
            this.m_dwUserID = 0;
            this.$(this.m_ViewStr+'@UserCtrl').SetUserByID(this.m_dwUserID);
            this.$(this.m_ViewStr+'/Score@Label').string = '';
            this.m_pUserItem = null;
            
        }
    },
    OnBtClickedUser:function(){
        if(this.m_dwUserID == 0) { //换坐
            
            this.chooseChairID = (this.m_Hook.m_GameClientEngine.GetMeChairID()+(8-GameDef.MYSELF_VIEW_ID+this.m_ChairID)%8)%8;
            this.m_Hook.m_GameClientEngine.OnBtChooseSit(null, this.chooseChairID);
            return
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_dwUserID == pGlobalUserData.dwUserID){
            this.m_Hook.OnGetCardTestInfo(2);
            return;
        }
        if(this.m_Hook.m_FaceExCtrl)this.m_Hook.m_FaceExCtrl.SetShowInfo(this.m_dwUserID, this.m_ChairID,this.m_pUserItem.GetUserIP());
    },
    SetOffLine:function(bOffLine) {
        this.$(this.m_ViewStr+'/OffLine').active = bOffLine;
    },
    
    UpdateScore:function(pUserItem, TableScore) {
        if(pUserItem.GetUserID() == this.m_dwUserID && this.m_Hook.m_GameClientEngine.m_GameEnd == null){
            this.SetUserScore(pUserItem.GetUserScore(), 0);
        }
    },

    SetUserScore:function (Score, TableScore) {
        var ClubScore = Score2Str(Score);

        if( ClubScore >= 0){
            this.$(this.m_ViewStr+'/Score@Label').font = this.m_FontArr[0];
        }else{
            this.$(this.m_ViewStr+'/Score@Label').font = this.m_FontArr[1];
        }
        this.$(this.m_ViewStr+'/Score@Label').string = ClubScore;

    },
    
    SetBanker:function (bBanker) {
        if(bBanker == null) bBanker = false;
        
        this.$(this.m_ViewStr+'/UserBanker').active = bBanker;

    },
    ShowClock:function (bShow) {
        this.$(this.m_ViewStr+'/Head/BGTimer').active = bShow;
    },
    SetClockNum:function (CntDown) {
        this.$(this.m_ViewStr+'/Head/BGTimer@ProgressBar').progress = CntDown;
    },
    SetEndScore:function (Score) {
        var str = (Score);
        if(Score != ''){
            if((Score) > 0)str='+'+(Score);
        }
        this.$(this.m_ViewStr+'/EndScore@Label').string = str;  
    },

    SetStatusBanker:function(type){
        if(type == null){
            this.$(this.m_ViewStr+'/Status').active = false;
            return
        }
    },

    SetStatusScore:function(type){
        if(type == null){
            this.$(this.m_ViewStr+'/AddScore').active = false;
            return
        }
        this.$(this.m_ViewStr+'/AddScore@Label').string = 'x'+type;
        this.$(this.m_ViewStr+'/AddScore').active = true;

    },

    UpdateAddScore:function(Score){
        if(Score[0] >= 0){
            this.$(this.m_ViewStr+'/xiazhu2/tou@Label').string = Score[0];
            this.$(this.m_ViewStr+'/xiazhu2/zhong@Label').string = Score[1];
            this.$(this.m_ViewStr+'/xiazhu2/wei@Label').string = Score[2];
        }
        


    },
});
