cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_BtSwitch: cc.Button,
        m_SliderMusic: cc.Node,
        m_SliderSound: cc.Node,
        m_AgreeNode: cc.Node,
    },
    onLoad: function() {
        this.$('BtSwitchAcc').active = !cc.share.IsH5_WX();
    },
    OnShowView: function () {
        window.LoadSetting();
        if (!this.m_CumMusic) this.m_CumMusic = this.$('Music@SettingMusic');
        if (!this.m_CumSound) this.m_CumSound = this.$('Sound@SettingSound');
        this.m_CumMusic.Load();
        this.m_CumSound.Load();
    },

    OnBtSwitchAcc: function () {
        cc.gSoundRes.PlaySound('Button');
        gReLogin = true;
        if (this.m_Hook.OnSwitchAcc) this.m_Hook.OnSwitchAcc();
        gClientKernel.destory();
        ChangeScene('Launch');
        window.gClubClientKernel.shutdown();
    },

    OnBtExit: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowAlert("确认退出游戏？", Alert_YesNo, function (Res) {
            if (Res) ThirdPartyExitGame();
            window.gClubClientKernel.shutdown();
        });
    },

    OnShowAgreeNode: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('AgreeMent');
    },

});
