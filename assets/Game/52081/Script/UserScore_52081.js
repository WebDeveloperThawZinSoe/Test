cc.Class({
    extends: cc.Component,

    properties: {
        m_NdScore:cc.Node,
        m_LbScoreTou:cc.Label, 
        m_LbScoreLia:cc.Label,    
        m_LbScoreSan:cc.Label,    

    },
    SetTableScore:function(AddScore){
        if(AddScore == null){
            this.m_NdScore.active = false;
        }else{
            this.m_NdScore.active = true;
            this.m_LbScoreTou.string = AddScore[0];
            this.m_LbScoreLia.string = AddScore[1];
            this.m_LbScoreSan.string = AddScore[2];
        }
    },
    //基准位置
    SetBenchmarkPos:function (nXPos, nYPos){
        this.node.setPosition(nXPos,nYPos);
    },
    // update (dt) {},
});
