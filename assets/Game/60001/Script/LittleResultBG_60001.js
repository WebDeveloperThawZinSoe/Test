
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_RoomNumber: cc.Label,
        m_GameRound: cc.Label,
        m_LabTimes: cc.Label,
        m_Win: cc.Node,
        m_Lose: cc.Node,
    },

    ctor: function () {

    },

    onLoad: function () {

    },

    onClickBack: function () {
        cc.gSoundRes.PlaySound(cc.gSoundRes.button);
        this.HideView();
    },

    onClickContinue: function () {
        cc.gSoundRes.PlaySound(cc.gSoundRes.button);
        this.m_Hook.checkTotalEnd(true);
        this.HideView();
    },

    OnHideView: function () {
        HideI2O(this.node);
    },

    OnShowView: function () {
        ShowO2I(this.node);

        this.m_RoomNumber.string = "" + this.m_Hook.m_GameClientView.m_LbTableID.string;
        this.m_GameRound.string = "" + this.m_Hook.m_GameClientView.m_LbGameProgress.string;
        this.m_LabTimes.string = Time2Str(new Date().getTime() / 1000);

        var pGameEnd = this.m_Hook.m_GameEnd;

        // if (pGameEnd.cbCardCount[this.m_Hook.GetMeChairID()] > 0) {
        //     this.m_Win.active = false;
        //     this.m_Lose.active = true;
        // } else {
        //     this.m_Win.active = true;
        //     this.m_Lose.active = false;
        // }

        if (this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'LittleResultItem_' + GameDef.KIND_ID);

        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!pGameEnd.dwUserID[i]) continue;
            this.m_ListCtrl.InsertListInfo(0, {
                wChairID: i,
                pGameEnd: pGameEnd,
                bBanker: this.m_Hook.m_wBankerUser == i,
                dwRules: this.m_Hook.m_dwRules
            });
        }
    },

});
