cc.Class({
    extends: cc.BaseClass,

    OnSetInfo:function(title,msg,hook){
        this.$('Title@Label').string = title;
        this.$('ScrollView/view/content@Label').string = msg;
        this.m_Hook = hook;
    },
    OnBtDelClick:function(){
        g_CurScene.ShowAlert('确定删除此邮件',Alert_YesNo,function(Res){
            if(Res){
                this.m_Hook.onSendDel();
                this.node.active = false;
            }
        }.bind(this));
    },
});
