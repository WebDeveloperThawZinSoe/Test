cc.Class({
    extends: cc.Component,

    properties: {
        m_typeAni:cc.Node,
        
    },
    SetCardType:function(type){
        if(type == null || type == undefined){
            this.node.active = false; 
            this.m_typeAni.active = false;
            return;
         }
         if (this.m_typeAni.active)return;
 
         this.m_typeAni.active = true;
         
         this.node.active = true; 
             
         var ani = this.m_typeAni.getComponent(dragonBones.ArmatureDisplay);
         switch (type)
         {
             case GameDef.CT_SINGLE:
                 ani.armatureName = 'danpai';
                 break;
            case GameDef.CT_ONE_LONG:
                    ani.armatureName = 'yidui';
                    break;
            case GameDef.CT_TWO_LONG:
                 ani.armatureName = 'liangdui';
                 break;
            case GameDef.CT_THREE_TIAO:
                 ani.armatureName = 'santiao';
                 break;
            case GameDef.CT_SHUN_ZI:
                 ani.armatureName = 'shunzi';
                 break;
            case GameDef.CT_TONG_HUA:
                 ani.armatureName = 'tonghua';
                 break;
            case GameDef.CT_HU_LU:
                 ani.armatureName = 'hulu';
                 break;
            case GameDef.CT_TIE_ZHI:
                 ani.armatureName = 'sitiao';
                 break;
            case GameDef.CT_TONG_HUA_SHUN:
                    ani.armatureName = 'tonghuashun';
                    break;
            case GameDef.CT_KING_TONG_HUA_SHUN:
                 ani.armatureName = 'huangjiatonghuashun';
                 break;
         }
         ani.playAnimation ('newAnimation',1);
         //this.getComponent(cc.Widget).updateAlignment();
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
