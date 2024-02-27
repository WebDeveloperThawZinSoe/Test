cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    OnShowView:function(){
        this.m_InputID = this.$('InputBG/EditBox@EditBox');
        this.m_InputID.string = '';
    },
    CheckInput:function(){
        if(this.m_InputID.string == ''){
            this.ShowTips("ID输入位空！");
            return false;
        }
        var id = parseInt(this.m_InputID.string);
        if(id>=1000000 || id < 100000){
            this.ShowTips("ID输入错误！");
            return false;
        }
        return true;
    },
    OnClick_BtSure:function(){
        if(!this.CheckInput()) return;
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=13&dwGameID='+this.m_InputID.string;
        WebCenter.GetData(webUrl, null, function (data) {
            if(data == '' ){//|| UserInfo.UserID == null
                this.ShowAlert('用户信息异常！')
            }else{
                var UserInfo = JSON.parse(data);
                this.ShowAlert('是否为玩家：'+UserInfo.NickName+' 代充 '+this.m_Hook.m_SelMoney+' 个钻石？' , Alert_YesNo,function(Res){
                    if(Res)  {
                        this.m_Hook.OnSurePayOther(this.m_InputID.string)
                        this.HideView();
                    }
                }.bind(this))
            }
        }.bind(this));
    },

    // update (dt) {},
});
