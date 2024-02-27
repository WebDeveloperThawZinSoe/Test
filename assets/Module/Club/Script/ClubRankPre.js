cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    InitPre:function(){
        if(this.m_UserCtrl == null) this.m_UserCtrl = this.$('UserCtrl@UserCtrl');
        if(this.m_LbInfo == null) this.m_LbInfo = this.$('Cnt@Label');
        if(this.m_Ltype == null) this.m_Ltype = this.$('Type@Label');
        if(this.m_LOperate == null) this.m_LOperate = this.$('Operate@Label');
        if(this.m_LTime == null) this.m_LTime = this.$('Time@Label');

        if(this.m_LbIndex == null) this.m_LbIndex = this.$('LabRank@Label');
        if(this.m_SpTop3 == null) this.m_SpTop3 = this.$('TexRank@Sprite');
        if(this.m_SpBG == null) this.m_SpBG = this.$('BG@Sprite');
        if(this.m_LTScore == null) this.m_LTScore = this.$('TScore@Label');
        if(this.m_LCScore == null) this.m_LCScore = this.$('CScore@Label');
        if(this.m_LChou == null) this.m_LChou = this.$('Chou@Label');
        if(this.m_LCChou == null) this.m_LCChou = this.$('CChou@Label');
        this.node.active = false;
    },
    SetPreInfo:function(ParaArr){//[i+1,Res[i][0],Res[i][1], RandType]);  index userid cnt type
        this.m_Hook = ParaArr[1][2];
        switch(ParaArr[1][1]){
            case 0:this.OnShowScoreInfor(ParaArr[1][0]);return;
            case 1:this.OnShowScoreRecord(ParaArr[1][0]);return;
            case 2:this.OnShowWinnerRecord(ParaArr[1][0]);return;
            case 3:this.OnShowRichRecord(ParaArr[1][0]);return;
            case 4:this.OnShowCNTRecord(ParaArr[1][0]);return;
            case 5:this.OnShowExitRecord(ParaArr[1][0]);return;
            default:return;
        }
    },
    OnShowScoreInfor:function(arr){
        this.m_UserCtrl.SetUserByID(arr[0]);
        this.m_LbInfo.string = Score2Str(parseInt(arr[2]));
        this.m_UserID = arr[0];
        this.node.active = true;
    },
    OnShowScoreRecord:function(arr){
        this.m_UserCtrl.SetUserByID(arr[0]);
        this.m_LbInfo.string = Score2Str(parseInt(arr[2]));
        this.m_Ltype.string = arr[2]>0?'增加':'减少';
        this.m_LOperate.string = arr[1]==CLUB_LEVEL_OWNER ?'老板':(arr[1]==CLUB_LEVEL_MANAGER ?'管理员':(arr[1]==CLUB_LEVEL_PARTNER ?'合伙人':"会员"));
        this.m_LTime.string = arr[3].replace(/ /,'\n');
        this.$('GameID@Label').string = arr[5];
        this.node.active = true;
    },
    OnShowWinnerRecord:function(arr){
        this.m_UserCtrl.SetUserByID(arr[0]);
        this.m_LbInfo.string = arr[1];
        this.node.active = true;
    },
    OnShowRichRecord:function(arr){
        this.m_UserCtrl.SetUserByID(arr[0]);
        this.m_LbInfo.string = arr[1];
        this.node.active = true;
    },
    OnShowCNTRecord:function(arr){
        this.m_LTScore.string = Score2Str(parseInt(arr[0]))+'/'+Score2Str(parseInt(arr[1]));
        this.m_LCScore.string = Score2Str(parseInt(arr[2]))+'/'+Score2Str(parseInt(arr[3]));
        this.m_LChou.string =  Score2Str(parseInt(arr[4]));
        this.m_LCChou.string =  Score2Str(parseInt(arr[5]))+'/'+Score2Str(parseInt(arr[6]));
        this.node.active = true;
    },
    OnShowExitRecord:function(arr){
        this.m_UserCtrl.SetUserByID(arr[1]);
        
        this.$('Cnt1@Label').string =Score2Str(parseInt(arr[4]));
        this.$('Cnt2@Label').string =arr[2]; 
        this.$('Cnt3@Label').string =arr[1] == arr[0]?'自己':(arr[5]==CLUB_LEVEL_OWNER?'老板':'管理员');
        this.$('Cnt4@Label').string =arr[3].replace(/ /,'\n');
        this.$('Cnt5@Label').string =arr[6];
        this.node.active = true;
    },

    OnShowPersonalInfo:function(){
        cc.gSoundRes.PlaySound('Button');
        this.m_Hook.ShowPrefabDLG('ClubPersonalInfo',this.m_Hook.node,function(Js){
            Js.OnSetBaseInfo(this.m_UserID);
        }.bind(this));
    },
    OnBtClickOpenUpdateUserScoreNode:function(){
        cc.gSoundRes.PlaySound('Button');
        this.m_Hook.OnBtClickOpenUpdateUserScoreNode(this.m_UserID);
    },


    // update (dt) {},
});
