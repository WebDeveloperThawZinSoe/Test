cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    
    Init:function(){
        this.InitPre();
    },

    SetData:function(data){
        this.SetPreInfo(data);
    },

    InitPre:function(){
        this.m_lTag = this.$('Label@Label');
        this.m_lTagNode = this.$('Label');
        this.m_typeNode = this.$('TypeNode');
    },
    SetPreInfo:function(ParaArr){//idArr[i], ShowLv, FindID
        this.m_lTag.string = ParaArr[0] == ''?'无标签': ParaArr[0];
        if(this.m_typeNode == null){
            this.node.width = ParaArr[0].length * 50;
            this.m_lTagNode.width = ParaArr[0].length * 40;
        }
    },
    OnBtClick:function(){
        this.m_Hook.OnTagClick(null,this.m_lTag.string)
    },
    IsClick:function(){
        return this.$('Toggle').isClick;
    },
    GetTag:function(){
        return this.m_lTag.string;
    },
});
