cc.Class({
    extends: cc.BaseClass,
 
    properties: {
        m_RoomNumber: cc.Label,
        m_GameRound: cc.Label,
        //m_CardCtrl: cc.Node,
        //m_HuRight: cc.Label,
        //m_HandControlPrefab: cc.Prefab,
        m_atlas:cc.SpriteAtlas,
        m_Rules:cc.Label,
        m_Date:cc.Label,
        m_LabClockBG:cc.Label,
 
    },

    // use this for initialization
    ctor: function()
    {
        
    },
    ResetData: function() {
        this.m_WeaveCard = new Array();
    },
    onLoad: function() {

        // var node = cc.instantiate(this.m_HandControlPrefab);
        // node.setPosition(cc.p(0, 0));
        // this.m_CardCtrl.addChild(node);

        // this.m_UserCard = node.getComponent('CardControl');
        // this.m_WeaveCtrl = node.getComponent('WeaveControl');
        // this.m_WeaveCtrl.Init(GameDef.HAND_BOTTOM);
        // this.m_UserCard.SetPositively(false);
    },

    onClickBack: function() {
        cc.gSoundRes.PlaySound(cc.gSoundRes.button);
        this.m_Hook.checkTotalEnd(true);
        this.HideView();
    },

    onClickShare: function() {
        cc.gSoundRes.PlaySound(cc.gSoundRes.button);
        this.m_Hook.m_GameClientView.OnBnClickedFriend();
    },

    //关闭小结算并准备下一局
    onClickContinue: function() {
        cc.gSoundRes.PlaySound(cc.gSoundRes.button);
        this.m_Hook.checkTotalEnd(true);
        this.HideView();
    },

    OnShowView: function() {
    
        var pGameEnd = this.m_Hook.m_GameConclude;


        if (this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'LittleResultItem_' + GameDef.KIND_ID);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (pGameEnd.dwUserID[i] == 0) continue;
            this.m_ListCtrl.InsertListInfo(0, [i, pGameEnd, this.m_Hook.m_wBankerUser == i, this.m_Hook.m_dwRules]);
        }

        if(pGameEnd.bIsBigResult)
            this.scheduleOnce(function(){
                this.m_Hook.checkTotalEnd(true);
                this.HideView();
            }, 3);
     
            g_TimerEngine.SetGameTimer( 0,0,30*1000, null, this, 'OnTimerMessage');
    },
    OnTimerMessage :function ( wChairID, CountDown, nTimerID) {
        var nElapse = parseInt(CountDown/1000);
        this.m_LabClockBG.string = nElapse;
        if (nElapse <= 0 ) {
            g_TimerEngine.KillGameTimer();
            this.onClickContinue();
        }

        return true;
    },
    //仅关闭小结算
    HideLittle:function()
    {
        HideN2S(this.node);
    },

    FormatDateTime :function(timeStamp) {
        var date = new Date();
        date.setTime(timeStamp);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;
        m = m < 10 ? ('0' + m) : m;
        var d = date.getDate();
        d = d < 10 ? ('0' + d) : d;
        var h = date.getHours();
        h = h < 10 ? ('0' + h) : h;
        var minute = date.getMinutes();
        var second = date.getSeconds();
        minute = minute < 10 ? ('0' + minute) : minute;
        second = second < 10 ? ('0' + second) : second;
        return y + '-' + m + '-' + d +' '+ h + ':' + minute + ':' + second;
    },

});