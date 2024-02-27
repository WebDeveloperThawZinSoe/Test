cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_stateSprite:cc.Sprite,
        m_atlas:cc.SpriteAtlas,
    },

    onLoad: function () {
        this.m_stateSprite.node.active = false;
    },

    start :function() {
    },

    Init:function(ClientView, wViewChairID, UserPos) {
        this.m_Hook = ClientView;
        this.m_wViewChairID = wViewChairID;
    },


    ShowClock :function(bShow){
        //this.m_clockNode.active = bShow;
    },

    SetClockNum:function(Num){
        //this.m_LabClock.string = Num;
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
        //this.m_GameAction.active = false;
    },

   

    //基准位置
    SetBenchmarkPos:function (Pos){
        this.node.setPosition(Pos);
    },

});
