cc.Class({
    extends: cc.BaseClass,

    properties: {
 
    },
    onLoad:function() {

    },
    OnBtShare:function() {
        var ShareInfo = g_Lobby.GetShareTex();
        ThirdPartyShareImg(ShareInfo, 1);
        g_Lobby.CheckFirstShare();
    },
});
