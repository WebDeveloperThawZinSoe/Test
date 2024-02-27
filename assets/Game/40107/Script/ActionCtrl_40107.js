cc.Class({
    extends: cc.Component,

    properties: {
        m_3D1:cc.Node,
        m_3D2:cc.Node,
        m_Spring:cc.Node,
        m_AirPlan:cc.Node,
        m_Line:cc.Node,
        m_Boom:cc.Node,
        m_King:cc.Node,
    },
    ctor: function(){
        this.m_bIsInit = false;
        this.m_dragon3D1 = null; 
        this.m_dragon3D2 = null; 
        this.m_dragonSpring = null; 
        this.m_dragonAirPlan = null; 
        this.m_dragonLine = null;
        this.m_dragonBoom = null;
        this.m_dragonKing = null;
    },
    onLoad: function () {
        
        this.Init();
        
    },
    Init:function()
    {
        if(this.m_bIsInit == true) return;
        this.m_bIsInit = true;

     
        if(this.m_dragon3D1 == null)
        {
            this.m_dragon3D1 = this.m_3D1.getComponent('AniPrefab');
            this.m_dragon3D1.Init(this);
        }
        if(this.m_dragon3D2 == null)
        {
            this.m_dragon3D2 = this.m_3D2.getComponent('AniPrefab');
            this.m_dragon3D2.Init(this);
        }
        if(this.m_dragonSpring == null)
        {
            this.m_dragonSpring = this.m_Spring.getComponent('AniPrefab');
            this.m_dragonSpring.Init(this);
        }
        if(this.m_dragonAirPlan == null)
        {
            this.m_dragonAirPlan = this.m_AirPlan.getComponent('AniPrefab');
            this.m_dragonAirPlan.Init(this);
        }
        if(this.m_dragonLine == null)
        {
            this.m_dragonLine = this.m_Line.getComponent('AniPrefab');
            this.m_dragonLine.Init(this);
        }
        if(this.m_dragonBoom == null)
        {
            this.m_dragonBoom = this.m_Boom.getComponent('AniPrefab');
            this.m_dragonBoom.Init(this);
        }
        if(this.m_dragonKing == null)
        {
            this.m_dragonKing = this.m_King.getComponent('AniPrefab');
            this.m_dragonKing.Init(this);
        }
        
    },
    SetAction:function(cbTurnCardType,wViewChairID){
        this.node.active = true;

        if(this.m_dragon3D1 == null || this.m_dragon3D2 == null || this.m_dragonSpring == null ||
             this.m_dragonAirPlan == null ||this.m_dragonLine == null || this.m_dragonBoom == null || this.m_dragonKing == null)
        {
            this.Init();
        }
        this.OnHideAllNd();
            if(cbTurnCardType==GameDef.CT_THREE_TAKE_ONE)
            {
                this.m_3D1.active = true;
                this.m_dragon3D1.PlayAni('Armature',1)
            }
            if(cbTurnCardType==(GameDef.CT_THREE_TAKE_TWO))
            {
                this.m_3D2.active = true;
                this.m_dragon3D2.PlayAni('Armature',1)
            }
            if(cbTurnCardType==(GameDef.CT_SPRING))
            {
                this.m_Spring.active = true;
                this.m_dragonSpring.PlayAni('chuntian',1)
            }
            if(cbTurnCardType==(GameDef.CT_FANSPRING))
            {
                this.m_Spring.active = true;
                this.m_dragonSpring.PlayAni('fanchuntian',1)
            }
            if(cbTurnCardType==GameDef.CT_AIRPLANE_ONE||cbTurnCardType==GameDef.CT_AIRPLANE_TWO||cbTurnCardType==GameDef.CT_THREE_LINE)
            {
                this.m_AirPlan.active = true;
                this.m_dragonAirPlan.PlayAni('Armature',1)
            }
            if(cbTurnCardType==(GameDef.CT_SINGLE_LINE))
            {
                this.m_Line.active = true;
                this.m_dragonLine.PlayAni('shunzi',1)
            }
            if(cbTurnCardType==(GameDef.CT_DOUBLE_LINE))
            {
                this.m_Line.active = true;
                this.m_dragonLine.PlayAni('liandui',1)
            }
          
           if(cbTurnCardType==(GameDef.CT_BOMB_CARD))
           {
               this.m_Boom.active = true;
               this.m_dragonBoom.PlayAni('baozha',1)
              
           }
           if(cbTurnCardType==(GameDef.CT_MISSILE_CARD))
           {
               this.m_King.active = true;
               this.m_dragonKing.PlayAni('Armature',1)
           }
            
    },
    OnHideAllNd:function(){
        this.m_3D1.active = false;
        this.m_3D2.active = false;
        this.m_Spring.active = false;
        this.m_AirPlan.active = false;
        this.m_Line.active = false;
        this.m_Boom.active = false;
        this.m_King.active = false;
    },
    AniFinish:function(){
        this.node.active = false;
    },
});
