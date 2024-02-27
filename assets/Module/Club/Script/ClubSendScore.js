cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    OnShowView:function () {
        this.$('Label@Label').string = '积分数量:'+Score2Str(parseInt(this.m_Hook.m_SelClubInfo.llScore));
        this.$('SendTo/InputBG/EditBox@EditBox').string = '';
        this.$('SendScore/InputBG/EditBox@EditBox').string = '';
        this.$('Remark/InputBG/EditBox@EditBox').string = '';
    },
    OnClick_BtSend:function(){
        var EdGameID = this.$('SendTo/InputBG/EditBox@EditBox');
        var EdScore = this.$('SendScore/InputBG/EditBox@EditBox');
        var EdRemark = this.$('Remark/InputBG/EditBox@EditBox');

        var GameID = parseInt(EdGameID.string);
        if( GameID > 100000 && GameID < 1000000){ } else { return this.ShowTips('请输入有效ID') };

        var SendScore = Number(EdScore.string);
        if(SendScore > 0) { } else { return this.ShowTips('请输入有效数量') };
       
        var webUrl = window.PHP_HOME+'/UserFunc.php?GetMark=13&dwGameID='+GameID;
        WebCenter.GetData(webUrl, null, function (data) {
            var UserInfo = JSON.parse(data);
            if(UserInfo.UserID == null){
                return this.ShowTips('用户查询失败');
            }else{
                this.OnSureDo(UserInfo.UserID, SendScore, UserInfo.NickName,EdRemark.string);
            }
        }.bind(this));
    },
    OnSureDo:function(UserID, Score, Nick,Remark){
        this.ShowAlert('确定赠送【'+Nick+'】 '+Score+' 积分?', Alert_YesNo, function(Res) {
            if(Res) {
                this.m_Hook.OnGiveScore(UserID, 1, Score,Remark);
                this.HideView();
            }
        }.bind(this) )
    },
    OnSetLeaderID:function(leaderID){
        this.$('SendTo/InputBG/EditBox@EditBox').string = leaderID;
    },
    // update (dt) {},
});
