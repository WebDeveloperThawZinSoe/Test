cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_SpNet:cc.Sprite,
        m_SpPower:cc.Sprite,
        m_LabTime:cc.Label,
        m_atlas:cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad :function() {
        this.CheckMacInfo();
        this.schedule(this.CheckMacInfo, 3);
    },
    CheckMacInfo:function () {
        //时间 
        var date = new Date();
        this.m_LabTime.string = pad(date.getHours(),2) +':'+pad(date.getMinutes(),2);

        //网络
        var strN = 'signal'
        if(window.g_NetResponseTime>800 || window.g_NetResponseTime < 0) strN+='1';
        else if(window.g_NetResponseTime>500) strN+='2';
        else if(window.g_NetResponseTime>200)strN+='3';
        else if(window.g_NetResponseTime>100)strN+='4';
        else if(window.g_NetResponseTime<=100)strN+='5';
        this.m_SpNet.spriteFrame = this.m_atlas.getSpriteFrame(strN);     

        //电量
        var pLv = ThirdPartyGetBattery();
        var strP = 'power'
        if(pLv<0.4) strP+='1';
        else if(pLv<0.6) strP+='2';
        else if(pLv<0.8) strP+='3';
        else if(pLv>=0.8) strP+='4';
        this.m_SpPower.spriteFrame = this.m_atlas.getSpriteFrame(strP);
    },

    // update (dt) {},
});
