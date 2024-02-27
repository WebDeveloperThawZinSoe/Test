cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CreatNode:cc.Node,
        m_JoinNode:cc.Node,
        m_ClubNameEdit:cc.EditBox,
    },

    ctor:function () {
        this.m_RecordArr = new Array();
        this.m_numArr = '';
        this.m_numLabArr = [];
        this.m_numInidex = 0;
        this.m_Authority = 0;
    },
    ShowKind:function (Kind) {
        
        if(Kind)this.m_ClubKind = Kind

        this.$('BGB/Club').active = this.m_ClubKind < CLUB_KIND_2 ;
        this.$('BGB/Club1').active = this.m_ClubKind >= CLUB_KIND_2;
        this.$('BGB/BGNoClub/spNoClub').active = this.m_ClubKind < CLUB_KIND_2;
        this.$('BGB/BGNoClub/spNoClub1').active = this.m_ClubKind >= CLUB_KIND_2;

        this.$('@ClubList&Pre').m_Hook = this;
        this.$('@ClubList&Pre').OnUpdateList(null, this.m_ClubKind);

        for (let i = 0; i < 6; i++) {
            this.m_numLabArr.push(this.$(`JoinClub/NumBG/n${i}@Label`));
            this.m_numLabArr[i].string = '';
        }

    },
    OnBtClickNum:function(Tag,Data){
        if( this.m_ClubNum ) return

        if(Data == 'Reset'){        //重置
            this.m_ClubNum = 0;
            this.m_numArr ='';
            this.m_numInidex = 0;
            for (let i = 0; i < 6; i++) {
                this.m_numLabArr[i].string = '';
            }
        }else if(Data == 'Del'){    //删除
            if(this.m_numArr.length){
                this.m_numArr = this.m_numArr.slice(0,this.m_numArr.length-1)
                this.m_numLabArr[--this.m_numInidex].string = '';
            }
        }else{                      //0-9
            this.m_numArr += Data;
            this.m_numLabArr[this.m_numInidex++].string = Data;
        }
        //6位完成
        if(this.m_numArr.length >= 6){
            this.m_ClubNum = parseInt(this.m_numArr);
            this.OnBtJoinSure();
            this.m_numArr = '';
            this.m_numInidex = 0;
            for (let i = 0; i < 6; i++) {
                this.m_numLabArr[i].string = '';
            }
        }
    },
    //显示 创建/加入二级框
    OnBtShowCreat:function () {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+ '/League.php?GetMark=39&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, null, function (data) {
            this.m_Authority = parseInt(data);
        }.bind(this));
        this.m_ClubNameEdit.string = '';
        this.m_ClubKind = CLUB_KIND_0;
        if(this.m_CreatNode.active){
            this.m_CreatNode.active = false;
        }else{
            this.m_CreatNode.active = true;
            this.$('CreateNode/kind/normal@Toggle').check();
            this.$('CreateNode/kind').active = true;
            this.$('CreateNode/BGM/TCreat').active = true;
            this.$('CreateNode/BGM/TCreat1').active = false;
            this.$('CreateNode/BGM/Label@Label').string = '创建俱乐部需要100钻石';
        }
    },
      //显示 创建/加入二级框
    OnBtShowCreat1:function () {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+ '/League.php?GetMark=39&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, null, function (data) {
            this.m_Authority = parseInt(data);
        }.bind(this));
        this.m_ClubNameEdit.string = '';
        this.m_ClubKind = CLUB_KIND_2;
        if(this.m_CreatNode.active){
            this.m_CreatNode.active = false;
        }else{
            this.m_CreatNode.active = true;
            this.$('CreateNode/kind').active = false;
            this.$('CreateNode/BGM/TCreat').active = false;
            this.$('CreateNode/BGM/TCreat1').active = true;
            this.$('CreateNode/BGM/Label@Label').string = '创建联盟需要100钻石';
        }
    },
    OnBtShowJoin:function (Tag, Para) {
        this.m_ClubNum = 0;
        this.m_ClubNameEdit.string = '';

        this.m_numArr ='';
        this.m_numInidex = 0;

        for (let i = 0; i < 6; i++) {
            this.m_numLabArr[i].string = '';
        }

        if(Para){
            this.$('JoinClub/BGM/TJoin').active = false;
            this.$('JoinClub/BGM/TJoin1').active = true;
        }else{
            this.$('JoinClub/BGM/TJoin').active = true;
            this.$('JoinClub/BGM/TJoin1').active = false;
        }

        if(this.m_JoinNode.active){
            this.m_JoinNode.active = false;
        }else{
            this.m_JoinNode.active = true;
        }
    },

    OnBtCreateSure:function () {

        if(this.m_ClubKind == CLUB_KIND_2 && (this.m_Authority & 0x04)==0){
            this.ShowTips('权限不足，请联系管理员.');
            return;
        }

        if(this.m_ClubKind == CLUB_KIND_1 && (this.m_Authority & 0x02)==0){
            this.ShowTips('权限不足，请联系管理员.');
            return;
        }

        //创建
        var reg = /^(?!_)(?!.*?_$)[a-zA-Z0-9_\u4e00-\u9fa5]+$/;
        if( !reg.test(this.m_ClubNameEdit.string) || this.m_ClubNameEdit.string.length < 1 ){
            this.ShowAlert("请输入有效名称！");
            return;
        }

        window.gClubClientKernel.onSendCreateClub(0,this.m_ClubNameEdit.string,this.m_ClubKind,(this.m_ClubKind>CLUB_KIND_0?6:0));

        this.ResetView();
    },
    OnBtJoinSure:function () {
        window.gClubClientKernel.onSendJoinClub(this,this.m_ClubNum);
    },


    //检查网络
    ShowLoading:function(){
        if(this.m_Hook) this.m_Hook.ShowLoading();
    },
    StopLoading:function(){
        if(this.m_Hook) this.m_Hook.StopLoading();
    },

    OnBtShowDlg:function(Tag,Data){
        cc.gSoundRes.PlaySound('Button');
        if(this.m_SelClubInfo == null) return;
        this.ShowPrefabDLG(Data);
    },

    OnHideView:function(){
        // g_Lobby.$('@ClubList&Pre').OnUpdateList();
        if(g_Lobby.m_LeagueList) g_Lobby.m_LeagueList.$('@ClubList&Pre').OnUpdateList();
        this.node.active = false;
        this.$('BGB/FliterNode').active = false;
    },
    OnChangeClub:function(Club){
        g_Lobby.OnChangeClub(Club);
        this.node.active = false;
        this.HideView();
    },

    OnCheckToggle:function(tag,Data){
        this.m_ClubKind = parseInt(Data);
    },
    OnMsgRes:function(szMsg){
        this.m_ClubNum = 0;
        this.ShowTips(szMsg);
    },
    JoinClubRes:function(Res){
        this.m_JoinNode.active = false;
        if(Res.cbRes ==1){
            g_Lobby.ShowTips('申请加入成功，等待审核。');
        }else{
            g_Lobby.ShowTips('加入成功');
            this.$('@ClubList&Pre').OnUpdateList(null, this.m_ClubKind);
        }
    },
    ResetView:function(){
        this.m_CreatNode.active = false;
        this.m_ClubNameEdit.string = '';
        this.m_JoinNode.active = false;
    },
    UpdateView:function(dwClubID){
        this.$('@ClubList&Pre').OnUpdateTableCnt(dwClubID);
    }
});
