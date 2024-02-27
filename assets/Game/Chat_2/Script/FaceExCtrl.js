cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_SelNode:cc.Node,
    },
    ctor :function(){
        this.m_AniArr = new Array(
            'beer',
            'egg',
            'shot',
            'kiss',
            'woshou',
            'rose',
            'bomb',
        );
        this.m_GameSound = new Array(
            ['shot', 'Audio/shot'],
            ['rose', 'Audio/rose'],
            ['egg', 'Audio/egg'],
            ['beer', 'Audio/beer'],
            ['bomb', 'Audio/bomb'],
            ['kiss', 'Audio/kiss'],
        );
    },
    onLoad:function () {
        cc.gPreLoader.LoadPrefab("FaceExAni");
        //this.m_AniPool = new cc.NodePool('FaceExAniPool');
        cc.gSoundRes.LoadSoundArr(this.m_GameSound, 'Chat_2');
        this.m_AniPreArr = new Array();
        this.m_SelNode.active = false;
    },
    PlayAni:function (CallBack) {
        //���и���
        for(var i=0;i<this.m_AniPreArr.length;i++){
            if(!this.m_AniPreArr[i].node.active){
                this.m_AniPreArr[i].node.active = true;
                return CallBack(this.m_AniPreArr[i])
            }
        }
        var AniIndex = this.m_AniPreArr.length;
        cc.gPreLoader.LoadPrefab("FaceExAni", function(Js){
            this.node.addChild(Js.node);
            this.m_AniPreArr[AniIndex] = Js;
            this.m_AniPreArr[AniIndex].Init(this);
            this.m_AniPreArr[AniIndex].node.active = true;
            CallBack(this.m_AniPreArr[AniIndex])
        }.bind(this));
    },

    SetShowInfo:function(UserID, ChairID, IP){
        this.m_SelNode.active = true;
        this.$('SelNode/UserCtrl@UserCtrl').SetUserByID(UserID);

        this.TagUser = UserID;
        this.TagChairID = ChairID;
        this.$('SelNode/UserCtrl/IP/Label@Label').string = IP;

        /*var webUrl = 'http://ip-api.com/json/?lang=zh-CN';
        WebCenter.GetData(webUrl, null, function (data) {
            var res = JSON.parse(data);
            this.$('SelNode/UserCtrl/Adress/adress@Label').string = res.city
            //this.$('SelNode/UserCtrl/IP/Label@Label').string = res.query
        }.bind(this));
        var webUrl2 = window.PHP_HOME+'/UserFunc.php?&GetMark=18&dwUserID='+UserID;
        WebCenter.GetData(webUrl2, 10, function (data) {
            var res = JSON.parse(data);
            this.$('SelNode/UserCtrl/JuShu/jushu@Label').string = res.GameCnt;
            this.$('SelNode/UserCtrl/Time/time@Label').string = res.Time;

        }.bind(this));*/
    },
    OnHideSelNode:function(){
        this.m_SelNode.active = false;
    },
    OnBtClickedFaceEx:function(Tag, Data){
        this.m_Hook.m_GameClientEngine.OnSendPhrase(parseInt(Data)+2000, this.TagUser)
        this.OnHideSelNode();
    },
    OnSendFaceEx:function(SendUser, TagUser, AniIndex){
        if(AniIndex < 2000 || AniIndex > 3000) return;
        var realIndex = AniIndex-2000-1;

        this.PlayAni(function(AniPre){
            AniPre.node.setPosition( this.m_Hook.m_UserFaceArr[SendUser]);
            AniPre.PlayAni(this.m_AniArr[realIndex], this.m_Hook.m_UserFaceArr[TagUser]);
            cc.gSoundRes.PlaySound(this.m_AniArr[realIndex]);
        }.bind(this));
    },
    AniFinish:function (Js) {
        Js.node.active = false;
    },
});
