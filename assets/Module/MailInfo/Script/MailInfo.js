cc.Class({
    extends: cc.BaseClass,

    ShowView:function(){
        if(!this._ListCtrl)this._ListCtrl = this.$('@CustomListCtrl');
        this._ListCtrl.InitList(0,'MailItemPre',this);
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/Mail.php?&GetMark=0&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, 0, function (data) {
            if(data == null || data == '') return;
            var Res = JSON.parse(data);
            for(var i = 0; i < Res.length;i++){
                this._ListCtrl.InsertListInfo(0, Res[i]);
            }
        }.bind(this));
        this.node.active = true;
    },
    
    update:function(){
        if(!this._Update) return;
        this._Update = false;
        this.ShowView();
    },

});
