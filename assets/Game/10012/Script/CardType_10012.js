cc.Class({
    extends: cc.Component,

    properties: {
        m_typeAni:cc.Node,
        m_completeSign:cc.Node
    },

    SetCompleteSign:function(bShow,isAni){
        this.node.active = bShow; 
        this.m_completeSign.active = bShow;
        this.m_typeAni.active = false;
        if (isAni){
            this.m_completeSign.scale = 0;
            this.m_completeSign.runAction(cc.scaleTo(0.1,0.6));
        }
        else
            this.m_completeSign.scale = 1;

            
        var ani = this.m_typeAni.getComponent(dragonBones.ArmatureDisplay);
        ani.playAnimation ('newAnimation',1);
    },

    SetCardType:function(type,times){
        if(type == null || type == undefined){
           this.node.active = false; 
           this.m_completeSign.active = false;
           this.m_typeAni.active = false;
           return;
        }
        if (this.m_typeAni.active)return;

        this.m_completeSign.active = false;
        this.m_typeAni.active = true;
        
        this.node.active = true; 
            
        var ani = this.m_typeAni.getComponent(dragonBones.ArmatureDisplay);
        switch (type)
        {
            case GameDef.OX_VALUE_0:
                ani.armatureName = 'WN';
                break;
            case GameDef.OX_VALUE_1:
            case GameDef.OX_VALUE_2:
            case GameDef.OX_VALUE_3:
            case GameDef.OX_VALUE_4:
            case GameDef.OX_VALUE_5:
            case GameDef.OX_VALUE_6:
            case GameDef.OX_VALUE_7:
            case GameDef.OX_VALUE_8:
            case GameDef.OX_VALUE_9:
                if (times > 1)
                    ani.armatureName = 'N' + type + 'X' + times;
                else
                    ani.armatureName = 'N' + type;
                break;
            case GameDef.OX_VALUE_10:
                ani.armatureName = 'NNX' + times;
                break;
            case GameDef.OX_VALUE_LINE:
                ani.armatureName = 'SZNX' + times;
                break;
            case GameDef.OX_VALUE_FIVE:
                ani.armatureName = 'WHNX' + times;
                break;
            case GameDef.OX_VALUE_COLOR:
                ani.armatureName = 'THNX' + times;
                break;
            case GameDef.OX_VALUE_3D2:
                ani.armatureName = 'HLNX' + times;
                break;
            case GameDef.OX_VALUE_FORTY:
                ani.armatureName = 'SSNX' + times;
                break;
            case GameDef.OX_VALUE_BOMB:
                ani.armatureName = 'ZDNX' + times;
                break;
            case GameDef.OX_VALUE_SMALL:
                ani.armatureName = 'WXNX' + times;
                break;
            case GameDef.OX_VALUE_HAPPY:
                ani.armatureName = 'THSX' + times;
                break;
        }
        ani.playAnimation ('newAnimation',1);
        this.getComponent(cc.Widget).updateAlignment();
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
