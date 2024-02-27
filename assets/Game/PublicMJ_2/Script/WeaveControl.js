
cc.Class({
    extends: cc.Component,

    properties: {
        m_WeaveParent:[cc.Node],
        m_WeavePrefab:cc.Prefab,
        m_WeaveItem:cc.Prefab,
    },
    ctor:function(){
        this.m_WeaveArray = new Array();
        this.m_wCardCount = 0;
    },
    Init:function(state){
        for (var i = 0; i < 4; i++) {
            if(this.m_WeaveArray[i] == null){
                var Weave = cc.instantiate(this.m_WeavePrefab);
                Weave.active = false;
                this.m_WeaveParent[i].addChild(Weave);
                this.m_WeaveArray[i] = Weave.getComponent('WeaveItem');
            }
        
            this.m_WeaveArray[i].BuildCard(state,this.m_WeaveItem);
        }
    },
    SetWeaveData:function(index,cbCardData,wCardCount){
        this.m_WeaveArray[index].node.active = true;
        this.m_WeaveArray[index].SetWeaveData(cbCardData,wCardCount);
    },
    SetWeaveState:function(index,State, bEnd){
        this.m_WeaveArray[index].SetWeaveState(State, bEnd);
    },
    ResetData:function(){
        for (var i = 0; i < this.m_WeaveArray.length; i++) {
            this.m_WeaveArray[i].node.active = false;
        }
    },


    // update (dt) {},
});
