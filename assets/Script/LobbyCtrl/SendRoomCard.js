cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Lab:[cc.Label],
    },
    ctor:function(){
        this.m_CntArr = new Array();
    },
    OnShowView:function(){
        this.m_Input = null;
        this.m_Lab[0].string = '输入好友ID';
        this.m_Lab[1].string = '输入钻石数';
    },
    OnBtInput:function(Tag, Data){
        this.m_Input = parseInt(Data);
        this.m_InputCtrl = this.m_LabID;
        this.ShowPrefabDLG('SelfInput');
    },
    SetInput:function(Num){
        this.m_Lab[this.m_Input].string = Num;
        this.m_CntArr[this.m_Input] = Num;
    },
    BtSend:function(){
        //验证
        if(  this.m_Lab[0].string == '输入好友ID' || this.m_CntArr[0] < 100000) {
            this.ShowTips('请输入有效ID！');
            return
        }
        if(  this.m_Lab[1].string == '输入钻石数' || this.m_CntArr[1] == 0) {
            this.ShowTips('请输入有效钻石数！');
            return
        }
        //发送协议
        this.m_Hook.OnGetUsingCard();
        this.m_Hook.ShowLoading();
    },
    SetUsingCard:function(Card){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=4&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&strPsw='+ pGlobalUserData.szPassword + '&TagID=' + this.m_CntArr[0];
        webUrl += '&TakeCount='+Card+'&CardCount='+this.m_CntArr[1];
        var self = this;

        WebCenter.GetData(webUrl, null, function (data) {
            if(self.m_Hook)self.m_Hook.StopLoading();
            if (data === -1){
                self.ShowTips('请检查网络！');
            }else{
                var res = JSON.parse(data);
                self.m_Hook.ShowTips(res.Describe)
                self.m_Hook.OnBtRefeshRoomCard();

                self.m_CntArr[0] = 0;
                self.m_CntArr[1] = 0;
                if(res.Res == 0) self.HideView();
            }
        });
    },
});
