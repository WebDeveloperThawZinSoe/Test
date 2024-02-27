cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_BtGPS:cc.Node,
        m_LabRoomCard:cc.Label,
        m_LabIP:cc.Label,
        m_SexSprite:cc.Sprite,
        m_atlas:cc.SpriteAtlas
    },
    ctor:function(){
        this.m_CArr = new Array(new cc.color(255,255,255),new cc.color(180,180,180))
    },
    OnShowView:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        this.m_LabRoomCard.string = pGlobalUserData.llUserIngot;
        this.m_LabIP.string = pGlobalUserData.szClientIP;
        this.node.getChildByName('UserCtrl').getComponent('UserCtrl').SetUserByID(pGlobalUserData.dwUserID);
        var bShow = cc.sys.localStorage.getItem(window.Key_ShowGPS);
        if(bShow == null) bShow = 0;
        this.m_BtGPS.color = this.m_CArr[bShow];

        this.m_SexSprite.spriteFrame = this.m_atlas.getSpriteFrame('sex'+pGlobalUserData.cbGender);
    },
    OnBtSendCard:function(){
        this.m_Hook.ShowPrefabDLG('SendRoomCard', this.m_Hook.m_DlgNode,function(Js){
            this.m_SendCardCtrl = Js;
        }.bind(this.m_Hook));
        this.HideView();
    },
    OnBtGPS:function(){
        var bShow = cc.sys.localStorage.getItem(window.Key_ShowGPS);
        if(bShow == null || bShow == 0) bShow = 1;
        else bShow = 0;
        cc.sys.localStorage.setItem(window.Key_ShowGPS,bShow);
        this.m_BtGPS.color = this.m_CArr[bShow];
    },
    OnBtGetCard:function(){
        this.m_Hook.onClick_Bt_stone();
        this.HideView();
    },
    OnBtChangeSex:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var ChangeSex = 1;
        if(pGlobalUserData.cbGender) ChangeSex=0;

        var webUrl = window.PHP_HOME+'/UserFunc.php?&GetMark=6&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += "&Sex="+ChangeSex;
        this.m_Hook.ShowLoading();

        WebCenter.GetData(webUrl, null, function (data) {
            this.m_Hook.StopLoading();
            pGlobalUserData.cbGender = ChangeSex;
            this.m_SexSprite.spriteFrame = this.m_atlas.getSpriteFrame('sex'+pGlobalUserData.cbGender);
        }.bind(this));
    },
});
