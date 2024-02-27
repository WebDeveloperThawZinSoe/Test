
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    InitPre: function () {
        this.m_LbIndex = this.$('LbIndex@Label');
        this.m_LbGameName = this.$('LbGameName@Label');
        this.m_LbPlayCnt = this.$('LbPlayCnt@Label');
        this.m_LbTableCnt1 = this.$('LbTableCnt1@Label');
        this.m_LbTableCnt2 = this.$('LbTableCnt2@Label');
        this.m_LbTableCnt3 = this.$('LbTableCnt3@Label');
        this.m_LbMaxAndroidCnt = this.$('LbMaxAndroidCnt@Label');
        this._GroupID = 0;
    },

    SetPreInfo: function (arr) {
        this._GroupID = arr[1].dwGroupID;
        this.m_LbIndex.string = parseInt(arr[0]) +1;
        this.m_LbGameName.string = window.GameList[arr[1].dwKindID];
        this.m_LbPlayCnt.string = arr[1].wAndroidCount;
        this.m_LbTableCnt1.string = arr[1].wTotalTimes;
        this.m_LbTableCnt2.string = arr[1].wMaxPlayingTable;
        this.m_LbTableCnt3.string = arr[1].wCompleteCnt;
        this.m_LbMaxAndroidCnt.string = arr[1].wMaxSitCount;
    },

    OnClicked_Del: function() {
        if(this._GroupID == 0) return ;
        window.gClubClientKernel.onSendDelAndroidGroup(this.m_Hook,g_ShowClubInfo.dwClubID,this._GroupID);
    },

});
