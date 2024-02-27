cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_atlas:[cc.SpriteAtlas],
    },
    // SetCardType:function(type1, type2, Score1, Score2){
    //     if(type1 == null){
    //         this.$("BGType").active = false; 
    //     }else{
    //         this.$("BGType").active  = true; 
    //         this.$("BGType/Sprite1@Sprite").spriteFrame = this.m_atlas.getSpriteFrame('typeSG'+parseInt(type1));
    //         this.$("BGType/Sprite2@Sprite").spriteFrame = this.m_atlas.getSpriteFrame('typeJH'+parseInt(type2));
    //         if(Score1 == null) {
    //             this.$("BGType/Lb1@Label").string = '';
    //             this.$("BGType/Lb2@Label").string = '';
    //             return;
    //         }
    //         if(Score1 >= 0){
    //             this.$("BGType/Lb1@Label").string = '+'+ Score1;
    //             this.$("BGType/Lb1").color = cc.color(255,198,1);
    //         }else{
    //             this.$("BGType/Lb1@Label").string = Score1;
    //             this.$("BGType/Lb1").color = cc.color(255,255,255);
    //         }
    //         if(Score2 >= 0){
    //             this.$("BGType/Lb2@Label").string = '+'+ Score2;
    //             this.$("BGType/Lb2").color = cc.color(255,198,1);
    //         }else{
    //             this.$("BGType/Lb2@Label").string = Score2;
    //             this.$("BGType/Lb2").color = cc.color(255,255,255);
    //         }
    //     }
    // },

     //椅子号、规则、分数
    SetCardType: function (index, score) {

        if(index == null){
            this.$("CardType").active = false; 
        }else{
            this.$("CardType").active = true;
            // if(index == 1)
            // {
            //     if(score >200 && score<400) score =210; //对子
            // }
            this.$('CardType@Sprite').spriteFrame = this.m_atlas[index].getSpriteFrame('CardType' + index + '_' + score);
        }
        
    },

    SetFinish:function(bFinish){
        // this.$("spFinish").active = bFinish; 
    },
    HideType:function(){
        this.$("CardType").active = false; 
    },
    //基准位置
    SetScale:function (scale){
        this.node.scale = scale;
    },
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos){
        this.node.setPosition(nXPos,nYPos);
    },
    // update (dt) {},
});
