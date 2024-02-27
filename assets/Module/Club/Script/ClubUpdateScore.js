cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabGold:cc.Label,
    },
    ctor:function () {

    },
    onLoad:function(){
        
    },
    
    OnShowClubUser:function(UserID, Score,type){
        this.m_UserID = UserID;
        this.$('UserNode@UserCtrl').SetUserByID(UserID);
        this.m_LabGold.string = type == 0 ?'赠送'+ (Score/window.PLATFORM_RATIO)+'积分':'撤销'+(Score/window.PLATFORM_RATIO)+'积分';
    },
});
