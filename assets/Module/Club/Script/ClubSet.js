cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_TabNode:cc.Node,
        m_SubNode:cc.Node,
    },
    ctor:function(){
        this.m_nNeedUpdate = 0;
        this.SHOW_RANK = 4;
        this.HIDE_ID = 1;
        this.NORMAL_GAME = 2;
    },

    OnShowView:function(){
        this.$('NoUse').active = this.m_Hook.m_SelClubInfo.cbClubLevel<=CLUB_LEVEL_MEMBER;
        this.$('Sub/Sub_0').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_PARTNER;

        this.$('Sub/Sub_0/ClubName').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('Sub/Sub_0/ClubRank').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('Sub/Sub_0/ClubCheck').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('Sub/Sub_0/ClubNoitce1').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('Sub/Sub_0/ClubClose').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('Sub/Sub_0/ClubSecret').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;

        this.$('Sub/Sub_0/ClubNoitce2').active = this.m_Hook.m_SelClubInfo.wKindID > CLUB_KIND_0 && this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_PARTNER;
        this.$('Sub/Sub_0/BtNode/BtRemit').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_PARTNER;

        this.$('Sub/Sub_0/BtNode/BtLeaveClub').active = this.m_Hook.m_SelClubInfo.wKindID<CLUB_KIND_2;
        this.$('Sub/Sub_0/BtNode/BtLeaveLeague').active = this.m_Hook.m_SelClubInfo.wKindID==CLUB_KIND_2;

        if(this.m_Hook.m_SelClubInfo.cbClubLevel == CLUB_LEVEL_OWNER){
            cc.gPreLoader.LoadRes('Image_ClubSet_BtDissClub','Club',function(sprFrame){
                this.$('Sub/Sub_0/BtNode/BtLeaveClub@Sprite').spriteFrame = sprFrame;
            }.bind(this));
            cc.gPreLoader.LoadRes('Image_ClubSet_BtDissClub2','Club',function(sprFrame){
                this.$('Sub/Sub_0/BtNode/BtLeaveLeague@Sprite').spriteFrame = sprFrame;
            }.bind(this));
        }
        else{
            cc.gPreLoader.LoadRes('Image_ClubSet_BtExitClub','Club',function(sprFrame){
                this.$('Sub/Sub_0/BtNode/BtLeaveClub@Sprite').spriteFrame = sprFrame;
            }.bind(this));
            cc.gPreLoader.LoadRes('Image_ClubSet_BtExitClub2','Club',function(sprFrame){
                this.$('Sub/Sub_0/BtNode/BtLeaveLeague@Sprite').spriteFrame = sprFrame;
            }.bind(this));
        }
        
        this.$('ToggleContainer/1').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;
        this.$('ToggleContainer/2').active = this.m_Hook.m_SelClubInfo.cbClubLevel>=CLUB_LEVEL_MANAGER;

        this.$('ToggleContainer/0/Background/Label@Label').string = this.m_Hook.m_SelClubInfo.wKindID<CLUB_KIND_2 ? '俱乐部设置':'联盟设置';
        this.$('ToggleContainer/0/checkmark/Label@Label').string = this.m_Hook.m_SelClubInfo.wKindID<CLUB_KIND_2 ? '俱乐部设置':'联盟设置';

        this.$('BG/TClubSet').active = this.m_Hook.m_SelClubInfo.wKindID==CLUB_KIND_2;
        this.$('BG/TClubSet2').active = this.m_Hook.m_SelClubInfo.wKindID<CLUB_KIND_2;
        this.$('Sub/Sub_0/ClubNoitce2@Label').string = this.m_Hook.m_SelClubInfo.wKindID==CLUB_KIND_2?'联盟公告':'俱乐部公告';
        this.$('Sub/Sub_0/ClubNoitce2/EditBox/PLACEHOLDER_LABEL@Label').string = this.m_Hook.m_SelClubInfo.wKindID==CLUB_KIND_2?'请输入联盟公告':'请输入俱乐部公告';

        this.m_EdClubName = this.$('Sub/Sub_0/ClubName/EditBox@EditBox');
        if(this.m_EdClubName) this.m_EdClubName.string = this.m_Hook.m_SelClubInfo.szClubName;
        this.m_EdClubNoitce = this.$('Sub/Sub_0/ClubNoitce1/EditBox@EditBox');
        if(this.m_EdClubNoitce) this.m_EdClubNoitce.string = this.m_Hook.m_SelClubInfo.szNotice;
        this.m_EdClubNoitce2 = this.$('Sub/Sub_0/ClubNoitce2/EditBox@EditBox');
        if(this.m_EdClubNoitce2) this.m_EdClubNoitce2.string = this.m_Hook.m_SelClubInfo.szNotice2;
        this.TgNoChat = this.$('ToggleNoChat@Toggle');

        if(!this.m_BlockedUser) {
            this.m_BlockedUser = this.$('Sub/1@BlockedUser');
            this.m_BlockedUser.m_Hook = this.m_Hook;
        }
        if(!this.m_ClubGroup) {
            this.m_ClubGroup = this.$('Sub/2@ClubGroup');
            this.m_ClubGroup.m_Hook = this.m_Hook;
        }
        this.m_nNeedUpdate = 1;

        this.$('Sub/Sub_0/ClubClose/toggle1@Toggle').isChecked = this.m_Hook.m_SelClubInfo.cbCloseStatus;
        this.$('Sub/Sub_0/ClubCheck/toggle1@Toggle').isChecked = this.m_Hook.m_SelClubInfo.cbJoinLimit;
        this.$('Sub/Sub_0/ClubRank/toggle1@Toggle').isChecked = ( this.m_Hook.m_SelClubInfo.dwRules & this.SHOW_RANK);
        this.$('Sub/Sub_0/ClubSecret/toggle1@Toggle').isChecked = ( this.m_Hook.m_SelClubInfo.dwRules & this.HIDE_ID);
        this.$('Sub/3@ClubSwitchBG').SetHook(this.m_Hook);
    },

    OnToggleClicked: function() {
        this.m_nNeedUpdate=1;
    },

    update: function() {
        if(this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate--;
        } else {
            return;
        }
        for(var i in this.$('ToggleContainer').children) {
            var pNode = this.$('ToggleContainer').children[i];
            var pToggle = this.$('@Toggle', pNode);
            if(!pToggle) continue;
            if(pToggle.isChecked) {
                if(this.$('Sub').children[i]) this.$('Sub').children[i].active = true;
            } else {
                if(this.$('Sub').children[i]) this.$('Sub').children[i].active = false;
            }
        }
        if(this.m_BlockedUser.node.active) {
            this.m_BlockedUser.Refresh();
        } else if(this.m_ClubGroup.node.active) {
            this.m_ClubGroup.Refresh();
        }
    },

    OnBtSure:function(){
        var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if ( this.m_EdClubName.string.length < 1 || !reg.test( this.m_EdClubName.string )) {
            this.ShowAlert("请输入有效名称！");
            return;
        }

        var TempRules = this.m_Hook.m_SelClubInfo.dwRules;
        if(this.$('Sub/Sub_0/ClubRank/toggle1@Toggle').isChecked){
            TempRules = (TempRules|this.SHOW_RANK);
        }else{
            if( TempRules & this.SHOW_RANK ) TempRules -= this.SHOW_RANK;
        }
        
        if(this.$('Sub/Sub_0/ClubSecret/toggle1@Toggle').isChecked){
            TempRules = (TempRules|this.HIDE_ID);
        }else{
            if( TempRules & this.HIDE_ID ) TempRules -= this.HIDE_ID;
        }
        
        var Joinlimit = 0;
        if(this.$('Sub/Sub_0/ClubCheck/toggle1@Toggle').isChecked){
            Joinlimit = 1;
        }

        var CloseStatus = 0;
        if(this.$('Sub/Sub_0/ClubClose/toggle1@Toggle').isChecked){
            CloseStatus = 1;
        }

        if(this.m_EdClubName.string == this.m_Hook.m_SelClubInfo.szClubName &&
            this.m_EdClubNoitce.string == this.m_Hook.m_SelClubInfo.szNotice &&
            this.m_EdClubNoitce2.string == this.m_Hook.m_SelClubInfo.szNotice2 &&
            this.m_Hook.m_SelClubInfo.dwRules == TempRules &&
            Joinlimit == this.m_Hook.m_SelClubInfo.cbJoinLimit &&
            CloseStatus == this.m_Hook.m_SelClubInfo){

                g_Lobby.ShowTips('没有修改，不能保存');
                return;
        }

        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var Obj = new CMD_GC_SaveClubSet();
        Obj.dwUserID = pGlobalUserData.dwUserID;
        Obj.szPassWord = pGlobalUserData.szPassword;
        Obj.dwClubID = this.m_Hook.m_SelClubInfo.dwClubID;			//俱乐部ID
        Obj.szClubName = this.m_EdClubName.string;//[31];		//俱乐部名字
        Obj.cbJoinLimit = Joinlimit;		//
        Obj.dwRules = TempRules;			//
        Obj.szNotice = this.m_EdClubNoitce.string;//[256];		//俱乐部公告	
        Obj.szNotice2 = this.m_EdClubNoitce2.string;//[256];		//专属公告
        Obj.cbCloseStatus = CloseStatus;
        window.gClubClientKernel.onSendSaveClubSet(this,Obj);

    },

    OnClick_ComNoChat:function(){
        this.m_Hook.OnOpNoChat( this.TgNoChat.isChecked );
        this.HideView();
    },

    OnChangeClubSet:function(){
        this.m_Hook.SendClubConfig( this.m_Toggle[0].isChecked,this.m_Toggle[1].isChecked);
        this.HideView();
    },
    OnClick_ClubJoinLimit:function(){

    },
    OnClick_SetHideRank:function(){
       
    },
    OnClick_SetHideID:function(){
       
    },
    OnClick_SetNormalGame:function(){
        
    },
    OnClick_ExitClub:function(){
        this.m_Hook.OnBtExitClub();
    },
    OnClick_ClubClose:function(target){
        
    },

});
