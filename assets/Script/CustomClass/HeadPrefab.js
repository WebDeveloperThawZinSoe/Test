cc.Class
({
    extends: cc.BaseClass,

    properties: {

    },
    onLoad:function() {
    },
    SetHook:function(Hook) {
        this.m_Hook = Hook;
    },
    InitDefault:function(){
        if(this.m_headSprite == null) this.m_headSprite = this.node.getComponent(cc.Sprite);

        //保存初始图片和尺寸
        if(this.m_defFrame == null) this.m_defFrame = this.m_headSprite.spriteFrame;
        if(this.m_defSize == null) this.m_defSize = this.node.getContentSize();

        //还原默认图片
        this.m_headSprite.spriteFrame = this.m_defFrame;
    },
    update:function(){
        if(this.m_CheckUserID == null) return;
        this.GetUserHead(this.m_CheckUserID);
    },
    SetUserHead:function(dwUserID, bForceUpdare){
        this.m_bForceUpdare = bForceUpdare;
        this.InitDefault();
        if(dwUserID == null) return;
        this.m_CheckUserID = dwUserID;
        this.m_CheckCnt = 0;
        return true;
    },

    GetUserHead:function(UserID){
        //加载中
        if( g_GlobalUserInfo.m_UserHeadMap[UserID] == 'Loading') return;
        //无效URL 或 加载异常
        if( g_GlobalUserInfo.m_UserHeadMap[UserID] == 'err' && this.m_Hook) this.m_Hook.OnHeadErr();
        if( g_GlobalUserInfo.m_UserInfoMap[UserID].HeadUrl == '' || g_GlobalUserInfo.m_UserHeadMap[UserID] == 'err') {
            this.m_CheckUserID = null;
            return;
        }
        //第一次加载 或 加载完成直接使用
        if(this.m_bForceUpdare || g_GlobalUserInfo.m_UserHeadMap[UserID] == null){
            g_GlobalUserInfo.m_UserHeadMap[UserID] = 'Loading';
            this.SetHeadUrl(g_GlobalUserInfo.m_UserInfoMap[UserID].HeadUrl, UserID);
        } else {
            this.HeadLoadFinish();
        }
    },
    HeadLoadFinish:function(){
        this.m_headSprite.spriteFrame = g_GlobalUserInfo.m_UserHeadMap[this.m_CheckUserID];
        var size = new cc.size(this.m_defSize.width,this.m_defSize.height)
        this.node.setContentSize(size);
        this.m_CheckUserID = null;
        if(this.m_Hook && this.m_Hook.OnHeadFinish) this.m_Hook.OnHeadFinish();
    },
    SetHeadUrl :function(szUrl, UserID){
        if(szUrl != "" ){//&& !cc.sys.isNative
            var name = szUrl.substring(szUrl.lastIndexOf("/")+1)
            if( name.indexOf(".") < 0) szUrl += "?"+name+".jpg"
        }

        this.m_url = szUrl;
        this.m_checkCnt = 0;
        this.DownLoadHead(UserID);
        return true;
    },
    //加载头像
    DownLoadHead:function(UserID, bNoSkip){
        var szUrl = window.PHP_HOME+'/HeadImage.php?url='+this.m_url;
        // if(bNoSkip) szUrl = this.m_url;
        // if(cc.sys.localStorage.getItem(AndroidBUG)) this.m_url = this.m_url.replace('https','http');
        if(this.m_url.indexOf('https') >= 0) szUrl = this.m_url;
        cc.loader.load({'url':szUrl, type: 'jpg'}, function(err, texture){
            if(err) return this.OnLoadErr(err, UserID);
            g_GlobalUserInfo.m_UserHeadMap[UserID] = new cc.SpriteFrame(texture);
            if(UserID == this.m_CheckUserID) this.HeadLoadFinish();
        }.bind(this));
    },

    OnLoadErr:function(err, UserID){
        try {
            if(window.LOG_NET_DATA)console.log("head OnLoadErr:"+this.m_checkCnt +" :"+this.m_url+" err："+err);
        } catch (error) {}

        //android 5.0  加载https 失败
        if(this.m_url.indexOf('https') >= 0) cc.sys.localStorage.setItem(AndroidBUG, 1);
        this.m_checkCnt++;
        //if(this.m_checkCnt++ < 2){
            this.DownLoadHead(UserID, (this.m_checkCnt%2 == 0));
        /*}else{
            g_GlobalUserInfo.m_UserHeadMap[UserID] = 'err';
            if(UserID == this.m_CheckUserID) {
                this.m_CheckUserID = null;
                if(this.m_Hook) this.m_Hook.OnHeadErr();
            }
        }*/
    },
});
