cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_spImage:cc.Sprite,
        m_defFrame: cc.SpriteFrame,
    },

    ctor: function () {
        this.m_szUrl = '';
    },

    _InitDefault:function(){
        this.m_szUrl = '';
        if(this.m_spImage){
            //保存初始图片和尺寸
            if(this.m_defSize == null) this.m_defSize = this.m_spImage.node.getContentSize();
            //还原默认图片
            if(this.m_defFrame) this.m_spImage.spriteFrame = this.m_defFrame;
            else this.m_spImage.spriteFrame = null;
        }
    },

    SetImageSpriteFrame: function (spriteFrame) {
        this._InitDefault();
        this.m_spImage.spriteFrame = spriteFrame;
    },
    SetImageUrl: function (szUrl, cbRecount, bshow) {
        this._InitDefault();

        this.m_szUrl = szUrl
        this.m_cbRecount = -1;
        if(cbRecount)this.m_cbRecount = cbRecount;
        return true;
    },

    update: function () {
        if(this.m_szUrl!='') this._load(this.m_szUrl);
    },
    // 加载图片
    _load: function () {
        //加载中
        if( g_GlobalUserInfo.m_NetImageMap[this.m_szUrl] == 'Loading') return;
        //无效URL 或 加载异常
        if( g_GlobalUserInfo.m_NetImageMap[this.m_szUrl] == 'err') {
            if(this.m_Hook.onImageLoadErr) this.m_Hook.onImageLoadErr();
            this.m_szUrl = '';
            return;
        }
        if (cc.sys.localStorage.getItem(AndroidBUG)) this.m_szUrl = this.m_szUrl.replace('https', 'http');
        //第一次加载 或 加载完成直接使用
        if( g_GlobalUserInfo.m_NetImageMap[this.m_szUrl] == null){
            g_GlobalUserInfo.m_NetImageMap[this.m_szUrl] = 'Loading';
            this._onLoadImg(this.m_szUrl);
        }else {
            this._onLoadFinish();
        }
    },

    //加载
    _onLoadImg:function(Url){
        var imgUrl = Url;
        if(cc.sys.localStorage.getItem(AndroidBUG)) imgUrl = imgUrl.replace('https','http');
        cc.loader.load({'url':imgUrl, type: 'png'}, function(err, texture){//
            if(err) return this._onLoadError(err, Url);
            g_GlobalUserInfo.m_NetImageMap[Url] = new cc.SpriteFrame(texture);
            if(Url == this.m_szUrl) this._onLoadFinish();
        }.bind(this));
    },

    //成功加载
    _onLoadFinish: function () {
        this.m_spImage.spriteFrame = g_GlobalUserInfo.m_NetImageMap[this.m_szUrl];
        this.m_szUrl = '';
        //this.node.setContentSize(this.m_defSize);
    },

    //加载出错
    _onLoadError: function (err, Url) {
        try {
            if (window.LOG_NET_DATA) console.log(" image _onLoadError : [" + this.m_cbRecount + "] : " + this.m_szUrl + "err ：" + err);
        } catch (error) {}

        //android 5.0  加载https 失败
        if (this.m_szUrl.indexOf('https') >= 0) cc.sys.localStorage.setItem(AndroidBUG, 1);
        if (this.m_cbRecount == -1) return this._onLoadImg(this.m_szUrl);
        if (this.m_cbRecount > 0) {
            // 重新加载
            this.m_cbRecount--;
            this._onLoadImg(this.m_szUrl);
        } else {
            this.m_szUrl = '';
            if (this.m_Hook && this.m_Hook.onImageLoadErr) this.m_Hook.onImageLoadErr();
        }
    },
});
