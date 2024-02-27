cc.Class({
    extends: cc.BaseClass,

    InitPre:function(){
        this._Title = this.$('Title@Label');
        this._status0 = this.$('status0');
        this._status1 = this.$('status1');
        this._btLook = this.$('Layout/BtLook');
        this._btDel = this.$('Layout/BtDel');
        this._Title.string = '';
        this._status0.active = false;
        this._status1.active = false;
        //this._btLook.active = false;
        this._btDel.active = false;
    },
    SetPreInfo:function(Info){
        this._dwID = Info[0];
        this._Msg = Info[2];
        this._Title.string = Info[1];
        this._status0.active = Info[4] == 0;
        this._status1.active = Info[4] == 1;
        //this._btLook.active = Info[4] == 0;
        this._btDel.active = Info[4] == 1;
    },

    OnBtLookClick:function(){
        this.m_Hook.ShowPrefabDLG('MailDetails',null,function(Js){
            Js.OnSetInfo(this._Title.string,this._Msg,this);
        }.bind(this));
        this.onSendRead();
    },

    OnBtDelClick:function(){
        g_CurScene.ShowAlert('确定删除此邮件',Alert_YesNo,function(Res){
            if(Res){
                this.onSendDel();
            }
        }.bind(this));
    },
    onSendDel:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/Mail.php?&GetMark=1&dwID='+this._dwID;
        webUrl += '&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&Operate=2'
        WebCenter.GetData(webUrl, 0, function (data) {
            this.m_Hook._Update = true;
        }.bind(this));
    },
    onSendRead:function(){
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/Mail.php?&GetMark=1&dwID='+this._dwID;
        webUrl += '&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&Operate=1'
        WebCenter.GetData(webUrl, 0, function (data) {
            this.m_Hook._Update = true;
            g_CurScene&&g_CurScene.OnCheckLobbyShow&&g_CurScene.OnCheckLobbyShow();
        }.bind(this));
    }
});
