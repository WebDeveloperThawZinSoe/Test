cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    // onLoad () {},

    ctor: function  () {
        this.m_Money = 0;
    },

    setMoney: function (pra, pra2) {
       this.m_Money = pra;
       this.m_GameID = pra2;
    },

    OnBtPay: function (tag, pra) {
        //http://39.104.203.23/hugu/Index.aspx?iscard=1&money=68&gameid=100101&paytype=1
        //iscard：1 房卡充值 0 金币
        //money：支付金额
        //gameid：游戏ID
        //paytype：支付类型 1微信 2支付宝 3银联
        var webUrl = window.WEB_HEAD + window.LOGIN_SERVER_IP + '/hugu/Index.aspx?iscard=1&paytype=' + pra;
        webUrl += '&gameid=' + this.m_GameID;//g_GlobalUserInfo.GetGlobalUserData().dwGameID
        webUrl += '&money=' + this.m_Money;
        //webUrl += '&paytype=' +(this.m_Money%10 == 0?0:1);
        ThirdPartyOpenUrl(webUrl);
    },

    // update (dt) {},
});
