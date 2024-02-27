cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_atlas:cc.SpriteAtlas,
        m_FontArr:[cc.Font],
    },
    ctor:function(){
        this.m_UserInfo = new Array();
    },
  
    SetEndInfo:function(pEndInfo){
        this.m_pEndInfo = pEndInfo;
        var wWinner = INVALID_CHAIR;
        var lWinScore = 0;
        
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if( pEndInfo.llTotalScore[i] > lWinScore){
                lWinScore = pEndInfo.llTotalScore[i];
                wWinner = i;
            }
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'GameEndView_'+GameDef.KIND_ID);

        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(pEndInfo.UserID[i] == null) continue;
            this.m_ListCtrl.InsertListInfo(0, [i, pEndInfo, wWinner, pGlobalUserData.dwUserID == pEndInfo.UserID[i]]);
        }
    },

    //分享信息
    GetShareInfo: function() {
        var ShareInfo = new Object();
        ShareInfo.title = '【对局记录】';
        ShareInfo.desc = '';
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(this.m_pEndInfo.UserID[i] == null) continue;
            if(ShareInfo.desc != '') ShareInfo.desc += '/'
            ShareInfo.desc += '【'+ g_GlobalUserInfo.m_UserInfoMap[this.m_pEndInfo.UserID[i]].NickName+'】';
            ShareInfo.desc += (this.m_pEndInfo.llTotalScore[i] >= 0?'+':'')+this.m_pEndInfo.llTotalScore[i];
        }
        ShareInfo.link = SHARE_URL
        return ShareInfo;
    },

/////////////////////////////////////////////////////////////////////// 
//pre
    InitPre: function() {
       
    },
    SetPreInfo: function(ParaArr) {
        this.SetUserEndInfo(ParaArr[0],ParaArr[1],ParaArr[2],ParaArr[3]);
    },
    SetUserEndInfo:function(wChair, EndInfo, Winner, bSelf) {
        this.$('@UserCtrl').SetUserByID(EndInfo.UserID[wChair]);
        this.$('@UserCtrl').SetShowFullName(false, 6);
        var StrScore = '';
        if( EndInfo.llTotalScore[wChair] >= 0) StrScore = '+';
        StrScore += Score2Str(EndInfo.llTotalScore[wChair]);

        if( EndInfo.llTotalScore[wChair] >= 0){
            //this.$('Score@Label').string = '+';
            this.$('Score@Label').font = this.m_FontArr[0];
        }else{
            //this.$('Score@Label').string = ''
            this.$('Score@Label').font = this.m_FontArr[1];
        }

        this.$('Score@Label').string = StrScore;
        //大赢家
        this.$('bigWinner').active = wChair == Winner;
        //输赢次数
        this.$('loseNum@Label').string = EndInfo.cbLoseCount[wChair];
        this.$('winNum@Label').string = EndInfo.cbWinCount[wChair];

        // if( EndInfo.llTotalScore[wChair] >= 0)this.$("BGEnd1@Sprite").spriteFrame = this.m_atlas.getSpriteFrame('EndInfoWin');
        // else this.$("BGEnd1@Sprite").spriteFrame = this.m_atlas.getSpriteFrame('EndInfoLose');

    },
/////////////////////////////////////////////////////////////////////// 
});
