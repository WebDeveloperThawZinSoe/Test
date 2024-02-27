cc.Class({
    extends: cc.BaseClass,

    ctor: function () {
        this.m_LastIndex = 0;
        this.m_LastRotation = 0;
        this.m_BaseTurns = 5;
        this.m_BaseRate = 60;
        this.m_BaseItemCnt = 6;
        this.m_CurIndex = 0;

        this.m_TotalCnt = 0;
        this.m_UserCnt = 0;
        this.m_ResInfo = null;
    },
    onLoad: function () {
        this.m_BasicSound = new Array();
        this.m_BasicSound[0] = ['TURN','Audio/turn'];
        this.m_BasicSound[1] = ['AWARD','Audio/award'];

        this.m_TurnNode = this.$('TurnNode');
        this.m_LabShareInfo = this.$('OperateNode/ShareInfo@Label');
        this.m_LabSignInfo = this.$('OperateNode/SignInfo@Label');
        this.m_LabGameCntInfo = this.$('OperateNode/GameCntInfo@Label');
        this.m_LabCnt = this.$('OperateNode/LeftCnt@Label');
        this.m_BtTurn = this.$('OperateNode/BtTurn@Button');
        this.m_AwardRes = this.$('AwardNode');

        this.m_itemImgArr = [];
        this.m_itemLabArr = [];

        for (var i = 0; i < 6; i++) {
            this.m_itemImgArr[i] = this.$(`TurnNode/item${i}@Sprite`);
            this.m_itemLabArr[i] = this.$(`TurnNode/Info${i}@Label`);
        }
        cc.gSoundRes.LoadSoundArr(this.m_BasicSound,'TurnTable');
    },
    ShowView: function () {
        this.m_TotalCnt = 0;
        var webUrl = window.PHP_HOME + '/Lottery.php?&GetMark=0';
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        webUrl += '&dwUserID=' + pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 0, function (data) {
            var res = JSON.parse(data);
            console.log(res);
            this.m_TotalCnt += res.IsShare == 0 ? 0 : 1;
            this.m_TotalCnt += res.IsSign == 0 ? 0 : 1;
            this.m_TotalCnt += res.GameCnt == 0 ? 0 : Math.floor(res.GameCnt / 10);
            this.m_TotalCnt += res.FreeCnt ? res.FreeCnt : 0;
            this.m_UserCnt = res.UserCnt;
            this.initView(res);
        }.bind(this));
        this.node.active = true;
        this.m_AwardRes.active = false;
        //this.TurnAcion();

    },
    initView: function (res) {
        this.m_LabShareInfo.node.color = res.IsShare == 0 ? cc.color(166, 71, 29) : cc.color(0, 255, 0);
        this.m_LabSignInfo.node.color = res.IsSign == 0 ? cc.color(166, 71, 29) : cc.color(0, 255, 0);
        this.m_LabGameCntInfo.node.color = Math.floor(res.GameCnt / 10) == 0 ? cc.color(166, 71, 29) : cc.color(0, 255, 0);
        this.m_LabShareInfo.string = res.IsShare != 0 ? '1、每日分享一次游戏，可参与一次转盘抽奖√' : '1、每日分享一次游戏，可参与一次转盘抽奖';
        this.m_LabSignInfo.string = res.IsSign != 0 ? '2、每日签到一次，可参与一次转盘抽奖√' : '2、每日签到一次，可参与一次转盘抽奖';
        this.m_LabGameCntInfo.string = Math.floor(res.GameCnt / 10) != 0 ? `3、每日任意进行10局游戏，可参与一次转盘抽奖(${res.GameCnt}局)√` : `3、每日任意进行10局游戏，可参与一次转盘抽奖(${res.GameCnt}局)`;

        this.m_LabCnt.string = (this.m_TotalCnt - this.m_UserCnt)<=0 ? 0+'次':(this.m_TotalCnt - this.m_UserCnt) +'次';
        this.m_BtTurn.interactable = (this.m_TotalCnt - this.m_UserCnt) > 0;


        for (var i in res.ItemArr) {
            this.m_itemLabArr[res.ItemArr[i][0]].string = res.ItemArr[i][1] == 0 ? '谢谢参与' : '钻石x' + res.ItemArr[i][2];
        }

    },
    onBtTurn: function () {
        if (this.m_TotalCnt - this.m_UserCnt == 0) {
            this.ShowAlert('次数已用完，不能抽奖');
            return;
        }
        this.m_BtTurn.interactable = false;

        var webUrl = window.PHP_HOME + '/Lottery.php?&GetMark=1';
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        webUrl += '&dwUserID=' + pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 0, function (data) {
            var res = JSON.parse(data);
            if (res.resCode == 1) {
                this.ShowAlert('抽奖失败，请联系管理员');
                return;
            }
            this.m_ResInfo = res.resLottery;
            console.log(res);
            this.m_CurIndex = res.resLottery[0];
            this.TurnAcion();
            this.m_UserCnt++;
            this.m_LastIndex = this.m_CurIndex;
            
        }.bind(this));
    },

    TurnAcion: function () {

        console.log('m_LastIndex:'+this.m_LastIndex);
        console.log('m_LastIndex:'+this.m_CurIndex);
        var totalRotation = 360 * this.m_BaseTurns;
        var offsetR = 0;
        if (this.m_CurIndex > this.m_LastIndex) {
            offsetR = this.m_BaseItemCnt + this.m_LastIndex - this.m_CurIndex ;
        }
        else {
            offsetR = this.m_LastIndex - this.m_CurIndex;
        }

        console.log('offsetR:'+offsetR);

        totalRotation += offsetR * this.m_BaseRate;
        cc.gSoundRes.PlaySound('TURN');
        cc.tween(this.m_TurnNode).by(5, { rotation: totalRotation }, { easing: 'quadInOut' })
            .call(function () {
                console.log('finish!!!');
                this.m_LabCnt.string = this.m_TotalCnt - this.m_UserCnt;
                var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
                pGlobalUserData.llUserIngot = parseInt(pGlobalUserData.llUserIngot) + parseInt(this.m_ResInfo[2]);
                this.m_Hook.OnUpdateCard();
                this.onShowAward();
            }.bind(this)).start();
    },
    onShowAward: function () {
        this.m_AwardRes.active = true;
        var ani = this.$('AwardNode/AniNode').getComponent(dragonBones.ArmatureDisplay);
        cc.gSoundRes.PlaySound('AWARD');
        if (this.m_ResInfo[1] == 0) {
            ani.armatureName = 'xiexiecanyu';
            this.$('AwardNode/AwardItem').active = false;
            this.$('AwardNode/AwardInfo').active = false;
            this.$('AwardNode/NoAwardInfo').active = true;

        } else {
            ani.armatureName = 'gognxihuode';
            var Item = this.$('AwardNode/AwardItem@Sprite');
            var LabInfo = this.$('AwardNode/AwardInfo@Label');
            this.$('AwardNode/NoAwardInfo').active = false;
            cc.gPreLoader.LoadRes('Image_Item' +(this.m_ResInfo[0]+1) ,'TurnTable', function (sf) {
                Item.spriteFrame = sf;
                Item.node.active = true;
            }.bind(this));

            LabInfo.node.active = true;
            LabInfo.string = `恭喜您获得"${this.m_ResInfo[2]}钻石"`;
        }
        ani.playAnimation('newAnimation', 1);

        this.m_BtTurn.interactable = (this.m_TotalCnt - this.m_UserCnt) > 0;
    },
    OnBtAwardHide: function () {
        this.m_AwardRes.active = false;
    },
});
