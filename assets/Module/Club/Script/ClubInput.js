cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdNum:cc.EditBox,
        m_LabNum:cc.Label,
        m_LabTips:cc.Label,
    },
    ctor:function () {
        this.m_TipsStr = '请输入ID';
    },
    OnShowView:function(){
        this.m_EdNum.string = '';
        this.m_LabNum.string = '';
    },  
    OnBtClickNum:function(Tag, Data){
        if(Data == 'Reset'){        //重置
            this.m_EdNum.string = '';
            this.m_LabNum.string = '';
            this.m_LabTips.string = this.m_TipsStr;
        }else{      
            if(this.m_LabNum.string.length >= 6) return                //0-9
            this.m_LabNum.string += Data;   
            this.m_LabTips.string = ''; 
        }
        this.m_EdNum.string = this.m_LabNum.string;
    },
    OnSetRetunIndex:function(type,TipsStr, CallFunc){
        this.m_CallFunc = CallFunc;
        if(TipsStr) this.m_TipsStr = '请输入'+TipsStr;
        else this.m_TipsStr = '请输入ID';
        this.m_LabTips.string = this.m_TipsStr;
        cc.gPreLoader.LoadRes('Image_ClubInput_t'+type,'Club',function(sprFrame){
            this.$('BGM/BGT/TInput@Sprite').spriteFrame = sprFrame;
        }.bind(this));
        
    },
    OnEditInput:function(){
        this.m_LabNum.string = '';
        this.OnBtClickNum(null, this.m_EdNum.string)
    },
    OnBtSure:function(){
        var InputNum = parseInt(this.m_LabNum.string);
        if(InputNum > 0){
            this.m_CallFunc(InputNum);
            this.HideView();
        }else{
            this.ShowTips('请输入有效值！');
        }
    },
});
