
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabNum:cc.Label,
    },
    OnShowView:function(){
        this.m_Input = null;
        this.m_LabNum.string = '';
    },
    OnBtInputNum:function(Tag, Data){
        var add = parseInt(Data);
        if(this.m_Input == null) this.m_Input = 0;
        this.m_Input = this.m_Input*10 + add;
        this.m_LabNum.string = this.m_Input;
    },
    OnBtDel:function(){
        if(this.m_Input == null)return
        this.m_Input = parseInt(this.m_Input/10);
        if(this.m_Input == 0){
            this.m_Input = null;
            this.m_LabNum.string = ''
        } else {
            this.m_LabNum.string = this.m_Input
        }
    },
    OnBtReSet:function(){
        this.m_Input = null;
        this.m_LabNum.string = '';
    },
    OnBtSure:function(){
        if(this.m_Input != null)this.m_Hook.SetInput(this.m_Input);
        this.HideView();
    },
});
