cc.Class({
    extends: cc.Component,

    properties: {
        // m_atlas: cc.SpriteAtlas,
    },

    onLoad: function () {
        this.Init();
    },

    start: function () {
        this.Init();
    },

    Init: function() {
        if(!this.m_Data) {
            this.m_Data = new Object();
            this.m_Data.value = 0;
            this.m_Data.score = 0;
        }
    },

    SetData: function (Param) {
        this.Init();
        this.m_Data.value = Param.value;
        this.m_Data.score = Param.score;
        this.m_Data.atlas = Param.atlas;
        this.m_Data.bundle = Param.bundle;
        this.m_Data.url = Param.url;
        if(this.m_Data.atlas) {
            this.node.getComponent(cc.Sprite).spriteFrame = this.m_Data.atlas.getSpriteFrame('' + this.m_Data.value);
        } else {
            if(this.m_Data.bundle && this.m_Data.url) {
                cc.gPreLoader.LoadRes(`${this.m_Data.url}_${this.m_Data.value}`, this.m_Data.bundle, function(sf, Param){
                    this.node.getComponent(cc.Sprite).spriteFrame = sf;
                }.bind(this));
            } else {
                cc.gPreLoader.LoadRes(`Image_${this.m_Data.value}`, `Jetton_2`, function(sf, Param){
                    this.node.getComponent(cc.Sprite).spriteFrame = sf;
                }.bind(this));
            }

        }
    },

    Move: function(pos, dt, delay, StartCallback, EndCallback, Hook) {
        StartCallback();
        var act = cc.sequence(cc.delayTime(delay ? delay : 0), cc.moveTo(dt, pos), cc.callFunc(EndCallback, Hook, this));
        this.node.runAction(act);
    },

    GetData: function() {
        return this.m_Data;
    },
});
