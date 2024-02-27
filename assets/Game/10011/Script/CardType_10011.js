cc.Class({
    extends: cc.Component,

    properties: {
        m_typeSpr:cc.Node,
        m_completeSign:cc.Node,
        m_LabSGScore:cc.Label,
        m_LabJHScore:cc.Label,
        m_FontArr:[cc.Font],
    },

    SetCompleteSign:function(bShow,isAni){
        this.node.active = bShow; 
        this.m_completeSign.active = bShow;
        this.m_typeSpr.active = false;
        if (isAni){
            this.m_completeSign.scale = 0;
            this.m_completeSign.runAction(cc.scaleTo(0.1,1));
        }
        else
            this.m_completeSign.scale = 1;
    },

    SetCardType:function(SGType,JHType){
        if(SGType == null || SGType == undefined){
           this.node.active = false; 
           this.m_completeSign.active = false;
           this.m_typeSpr.active = false;
           return;
        }

        this.node.active = true; 
        this.m_completeSign.active = false;
        this.m_typeSpr.active = true;
        
        
        cc.gPreLoader.LoadRes('Image_CardType_typeJH' + JHType, '10011', function(sf, Param){
            this.m_typeSpr.getChildByName('JHType').getComponent(cc.Sprite).spriteFrame = sf;
        }.bind(this), {Index: JHType});
        
        cc.gPreLoader.LoadRes('Image_CardType_typeSG' + SGType, '10011', function(sf, Param){
            this.m_typeSpr.getChildByName('SGType').getComponent(cc.Sprite).spriteFrame = sf;
        }.bind(this), {Index: SGType});
    },
    //基准位置
    SetScale:function (scale){
        this.node.scale = scale;
    },
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos,widget){
        this.node.setPosition(nXPos,nYPos);
        
        this.getComponent(cc.Widget).isAlignLeft = widget[0] != 0;
        this.getComponent(cc.Widget).left = widget[0];

        this.getComponent(cc.Widget).isAlignRight = widget[1] != 0;
        this.getComponent(cc.Widget).right = widget[1];
        
        this.getComponent(cc.Widget).isAlignTop = widget[2] != 0;
        this.getComponent(cc.Widget).top = widget[2];
        
        this.getComponent(cc.Widget).isAlignBottom = widget[3] != 0;
        this.getComponent(cc.Widget).bottom = widget[3];

        this.getComponent(cc.Widget).updateAlignment();
    },
    // update (dt) {},
});
