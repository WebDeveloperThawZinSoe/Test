cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CreaterNode:cc.Node,
        m_LabClubName:cc.Label,
        m_LabClubID:cc.Label,
        m_LabTime:cc.Label,
        m_LabState:cc.Label,
    },
    ctor:function(){

    },

    SetRecordInfo:function(InfoArr){
        var UserCtrl = this.m_CreaterNode.getComponent("UserCtrl");
        UserCtrl.SetUserByID(InfoArr[1]);
        this.m_LabClubID.string = InfoArr[0];
        this.m_LabClubName.string = InfoArr[2];

        var strtime = InfoArr[4].date;
        this.m_LabTime.string = strtime.slice(0,strtime.indexOf('.'));

        if(InfoArr[3] == 0){
            this.m_LabState.string = '已拒接';
            this.m_LabState.node.color = cc.color(146,10,10);
        }else if(InfoArr[3] == 2){
            this.m_LabState.string = '等待通过';
            this.m_LabState.node.color = cc.color(173,71,31);
        }else if(InfoArr[3] >= 3){
            this.m_LabState.string = '已同意';
            this.m_LabState.node.color = cc.color(10,146,61);
        }
    },
    
    // update (dt) {},
});
