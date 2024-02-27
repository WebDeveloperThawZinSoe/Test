cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabGameID:cc.Label,
        m_LabIP:cc.Label,
        m_LabDistance:cc.Label,
        m_LabAddr:cc.Label,
        m_UserNd:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {

    },

    start:function(){
        this.Init();
    },

    Init:function(){
        if(!this.m_UserCtrl){
            this.m_UserCtrl = this.m_UserNd.getComponent('UserCtrl');
            if(this.m_LabIP) this.m_LabIP.string = "";
            if(this.m_LabDistance) this.m_LabDistance.string = "";
            if(this.m_LabAddr) this.m_LabAddr.string = "";
        }
    },

    SetUserID:function(UserID){
        if(!this.m_UserCtrl) return;
        this.m_UserCtrl.SetUserByID(UserID);
    },

    SetUserIP:function(ip){
        if(!this.m_LabIP) return;
        this.m_LabIP.string = ip;
    },

    SetUserDistance:function(distance){
        if(!this.m_LabDistance) return;
        this.m_LabDistance.string = distance;
    },

    SetUserAddr:function(Addr,active){
        if(!this.m_LabAddr) return;
        this.m_LabAddr.string = Addr;
        if(active) this.m_LabAddr.node.active = active;
    },

    SetLabPos:function(GameIDPos,IPPos,DistancePos,AddrPos){
        if(GameIDPos)   this.m_LabGameID.node.setPosition(GameIDPos);
        if(IPPos)       this.m_LabIP.node.setPosition(IPPos);
        if(DistancePos) this.m_LabDistance.node.setPosition(DistancePos);
        if(AddrPos)     this.m_LabAddr.node.setPosition(AddrPos);
    },

});