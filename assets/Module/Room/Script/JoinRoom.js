cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor:function(){
        this.m_numInidex = 0;
        this.m_numLabArr = [];
        this.m_numArr = '';
    },

    OnBtClickNum:function(Tag,Data){
        cc.gSoundRes.PlaySound('Button');
        if( this.m_JoinNum = null) return

        if(Data == 'Reset'){        //重置
            this.m_JoinNum = null;
            this.m_numArr ='';
            this.m_numInidex = 0;
            for (let i = 0; i < 6; i++) {
                this.m_numLabArr[i].string = '';
            }
        }else if(Data == 'Del'){    //删除
            if(this.m_numArr.length){
                this.m_numArr = this.m_numArr.slice(0,this.m_numArr.length-1)
                this.m_numLabArr[--this.m_numInidex].string = '';
            }
        }else{                      //0-9
            this.m_numArr += Data;
            this.m_numLabArr[this.m_numInidex++].string = Data;
        }
        //6位完成
        if(this.m_numArr.length >= 6){
            this.m_JoinNum = parseInt(this.m_numArr);
            this.OnEnterRoom();
            this.m_numArr = '';
            this.m_numInidex = 0;
            for (let i = 0; i < 6; i++) {
                this.m_numLabArr[i].string = '';
            }
        }
    },
    OnEnterRoom:function(){
        this.unschedule(this.OnEnterRoom)
        if(this.m_Hook) this.m_Hook.OnQueryRoom(this.m_JoinNum, 0);
        this.HideView();
        this.m_JoinNum = 0;
    },
    OnShowView:function(){
        for (let i = 0; i < 6; i++) {
            this.m_numLabArr.push(this.$(`TextBG/n${i}@Label`));
            this.m_numLabArr[i].string = '';
        }
    },
    OnEditInput:function(){
        this.OnBtClickNum(null, this.m_EdNum.string)
    },
});
