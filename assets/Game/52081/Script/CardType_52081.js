cc.Class({
    extends: cc.Component,

    properties: {
        m_Rank_0:cc.Sprite,
        m_Rank_1:cc.Sprite,
        m_atlas:cc.SpriteAtlas
    },
    SetCardType:function(rank,index,IsBankerChair){
        if(rank == null){
            this.node.active = false; 
            this.m_Rank_0.spriteFrame = null;
            this.m_Rank_1.spriteFrame = null;
        }else{
            this.node.active = true; 
            var type ='Img_Rank';
            type+=parseInt(rank[index]);
            if(index==0){
                this.m_Rank_0.spriteFrame = this.m_atlas.getSpriteFrame(type);
            }else if(index==1){
                this.m_Rank_1.spriteFrame = this.m_atlas.getSpriteFrame(type);
            }else{
                this.node.active = false; 
            }
        }
    },
    //基准位置
    SetScale:function (scale){
        this.node.scale = scale;
    },
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos){
        this.node.setPosition(nXPos,nYPos);
    },
    //大小牌位置
    SetEndCardPos:function(leftRight){
        if(leftRight)
            this.node.getComponent(cc.Layout).horizontalDirection = 1;
        else
            this.node.getComponent(cc.Layout).horizontalDirection = 0;

    },

    SetSpacingX:function(nXDistance){
        this.node.getComponent(cc.Layout).spacingX = nXDistance;

    },

    SetGameType(bShow){
        this.m_Rank_1.node.active = bShow;
    },
    // update (dt) {},
});
