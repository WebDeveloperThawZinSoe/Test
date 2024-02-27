cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    ctor: function () {

    },

    onLoad: function() {
        this.InitView();
    },

    start: function() {
        this.InitView();
    },

    OnShowView: function () {
        this.InitView();
    },

    InitView: function(){
        if (!this.m_Slider) this.m_Slider = this.$('Slider@CustomSlider');
    },

    OnSlider_Move: function (Tag) {
        window.SaveSetting(window.SetKey_Music, Tag.progress.toFixed(1));
        cc.gSoundRes.UpdateVolume();
    },

    //////////////////////////////////////////////////

    SetGame: function (GameDef) {
        this.m_GameDef = GameDef;
    },

    Load: function() {
        this.InitView();
        this.m_Slider.SetProgress(window.g_Setting[window.SetKey_Music]);
    },

});
