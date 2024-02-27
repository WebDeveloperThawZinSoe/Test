cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_GameAction:cc.Node,
        m_clockNode:cc.Node,
        m_stateSprite:cc.Sprite,
        m_atlas:cc.SpriteAtlas,
    },

    onLoad: function () {
        this.m_LabClock = this.m_clockNode.getChildByName("Label").getComponent(cc.Label);
        this.m_clockNode.active = false;
        this.m_stateSprite.node.active = false;
        this.schedule(this.UpdateView, 1);
    },

    start :function() {
    },

    Init:function(ClientView, wViewChairID, UserPos) {
        this.m_Hook = ClientView;
        this.m_wViewChairID = wViewChairID;

        if(this.m_wViewChairID <= 2) {

            this.node.setPosition(UserPos);
            this.node.setAnchorPoint(0, 0.5);
            this.node.getComponent(cc.Layout).horizontalDirection = 0;

        } else {

            this.node.setPosition(UserPos);
            this.node.setAnchorPoint(1, 0.5);
            this.node.getComponent(cc.Layout).horizontalDirection = 1;
        }

        this.Reset();
    },

    Reset:function(){
        this.HideAction();
        this.HideState();
        this.ShowClock(false);
    },

    ShowClock :function(bShow){
        this.m_clockNode.active = bShow;
    },

    SetClockNum:function(Num){
        this.m_LabClock.string = Num;
    },

    ShowUserState :function(state, second){
        this.stateCntDown = second;
        this.m_stateSprite.node.active = true;
        // this.m_stateSprite.spriteFrame = this.m_atlas.getSpriteFrame('State'+state);
    },
    ShowGameAction: function() {

    },

    //准备
    ShowUserReady : function(bReady){

        this.m_stateSprite.node.active = bReady;

    },

    HideState :function(){
        this.stateCntDown = null;
        this.m_stateSprite.node.active = false;
    },

    HideAction :function(){
        this.m_GameAction.active = false;
    },

    UpdateView:function(){
        //状态
        if(this.stateCntDown > 0){
            this.stateCntDown--;
        }else if(this.stateCntDown == 0){
            this.HideState();
        }
    },

    //基准位置
    SetBenchmarkPos:function (Pos, Mode){
        var stateMode = (Mode - 1) / 2;// 1 2 3 => 0 0.5 1
        this.node.setPosition(Pos);
        this.node.anchorX = stateMode;
        this.node.getComponent(cc.Layout).horizontalDirection = stateMode;
    },

});
