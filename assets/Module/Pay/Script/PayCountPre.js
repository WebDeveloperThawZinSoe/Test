cc.Class({

    extends: cc.BaseClass,

    properties: {
        m_groupNode:cc.Node,
        m_rulesNode:cc.Node,
    },
    ctor:function(){
        this.m_KindIDArr = new Array(0,1,2);
    },
    OnShowView:function(){
        if( this.m_SelToggle == null ){
            this.m_SelToggle = new Array();
            for(var i in this.m_KindIDArr ){
                this.m_SelToggle[i] = this.m_groupNode.getChildByName(''+i).getComponent(cc.Toggle);
            }
        }
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'PayItem', this);
        this.m_bNeedUpdate = true;
    },
    OnToggleSelGame:function(Tag, Data){
        this.m_bNeedUpdate = true;
    },
    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }
        for(var i=0; i<this.m_rulesNode.childrenCount; i++){
            this.m_rulesNode.children[i].active = false;
        }
        var gIndex = 0;
        for(var i in this.m_SelToggle ){
            if( this.m_SelToggle[i].isChecked){
                gIndex=i;
                break;
            }
        }
        var tempNode = this.m_rulesNode.getChildByName("ScrollView"+gIndex);
        if(tempNode) tempNode.active = true;

        if(gIndex == 2){
            this.m_ListCtrl.InitList(0, 'PayItem', this);
            var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=21&dwUserID='+g_GlobalUserInfo.GetGlobalUserData().dwUserID;
            WebCenter.GetData(webUrl, 1, function (data) {
                var IDArr = JSON.parse(data);
                if(data == "[]"){
                    this.$('ScrollView/ScrollView2/NoRecord').active = true;
                }
                for(var i in IDArr)this.m_ListCtrl.InsertListInfo(0, IDArr[i]);
            }.bind(this));
        }
    },
    SetData: function (DataArr) {
        this.m_PayData = DataArr;
        return
        if(this.m_PayData == null) this.m_PayData = new Array();
        for(var i=0;i<8;i++){
            if( this.m_PayData[i] == null){
                this.m_PayData[i] = new Object();
                this.m_PayData[i].RoomCard = i+1;
                this.m_PayData[i].Money = i+1;
            }
            var tempNode = this.node.getChildByName('Layout').getChildByName(i+'');
            tempNode.getChildByName('Label').getComponent(cc.Label).string =  this.m_PayData[i].RoomCard+'钻石';
            tempNode.getChildByName('BtPay').getChildByName('Label').getComponent(cc.Label).string = this.m_PayData[i].Money;
        }
    },

    OnBtPay: function (tag, Money) {
        this.ShowTips('如需充值，请联系客服!');
        return;
        this.ShowPrefabDLG('PayModePre', this.node, function (Js) {
            Js.setMoney(Money, g_GlobalUserInfo.GetGlobalUserData().dwGameID);
        }.bind(this))
    },
    //代充
    OnBtPayOther: function (tag, pra) {
        this.m_SelMoney = pra;
        this.ShowPrefabDLG('PayUser');
    },
    OnSurePayOther: function (GameID) {
        this.ShowPrefabDLG('PayModePre', this.node, function (Js) {
            Js.setMoney(this.m_SelMoney, GameID);
        }.bind(this))
    },
    OnClick_BtShowService: function () {
        this.m_Hook.onClick_Bt_shop();
    },
    OnClick_BtBind: function () {
        //this.m_Hook.OnBtNewPlayer();
        var pUserInfo = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME + '/UserFunc.php?GetMark=15&dwUserID=' + pUserInfo.dwUserID;
        webUrl += '&LogonPass=' + pUserInfo.szPassword;
        if( this.m_Hook.m_CheckNewPlayer == null)  this.m_Hook.m_CheckNewPlayer = 0;
        var self = this;
        WebCenter.GetData(webUrl, this.m_Hook.m_CheckNewPlayer, function (data) {
            self.m_Hook.m_CheckNewPlayer = 999999;
            var UserInfo = JSON.parse(data);
            if (UserInfo.Status == null) return
            if (1 == UserInfo.Status) {
                self.ShowPrefabDLG('NewPlayer',null, function (Js){
                    self.m_Hook.m_NewPlayer = Js;
                    Js.m_Hook = self.m_Hook;
                });
            }else{
                self.m_Hook.ShowAlert('您已经完成了绑定！');
            }
        });
    },
    OnBtSearch:function(){
        var searchText = this.$("ScrollView/ScrollView2/SearchBG/EditBox@EditBox").string;
        if(searchText == ""){
            this.m_Hook.ShowTips('搜索内容不能为空');
            return;
        }
        for(var i=0;i<this.m_ListCtrl.m_CtrlArr[0].length;i++){
            this.m_ListCtrl.m_CtrlArr[0][i].node.active = this.m_ListCtrl.m_CtrlArr[0][i].timeText.string == searchText;
        }
    }
});
