
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CardData:cc.Node,
        m_Double:cc.Label,
        m_Count:cc.Label,
    },

    ctor:function(){

    },
    start () {

    },

    onLoad:function(){
        var item = this.m_CardData.getComponent('CardItem');
    },
    SetData:function(pData){
        this.m_CardData.getComponent('CardItem').SetCardData(pData.cbHuCardData);
        if( pData.cbDouble == 99 ){
            this.m_Double.string = '满贯';
        }
        else{

            this.m_Double.string = ''+pData.cbDouble+'倍';
        }
        this.m_Count.string = ''+pData.cbHaveCardCount+'张';
    },
    OnSetEnable:function(state){
        if(!this.m_Toggle) return ;
        this.m_Toggle.interactable  = state;
    },
    OnCheck:function(state){
        if(!this.m_Toggle) return ;
        this.m_Toggle.isChecked = state;
    },
    // update (dt) {},
});
