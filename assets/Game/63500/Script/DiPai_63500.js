// Learn cc.Class:
//  - https://docs.cocos.com/creator/manual/en/scripting/class.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        m_diPaiNode:[cc.Node]
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    ShowCenterData:function(cbCenterCardData,cbSendCardCount){
        this.node.active = true;
        for(var i = 0; i < 5; i++){
            if(i < (cbSendCardCount)){
                this.m_diPaiNode[i].getComponent('CardPrefab_63500').SetData(cbCenterCardData[i]); 
            }else{
                this.m_diPaiNode[i].getComponent('CardPrefab_63500').SetData(0);
            }
        }
    },

    HideNode:function(){
        this.node.active = false;

    },

    SetPos:function(pos){
        this.node.setPosition(pos);
    },

    
    SetCardDataAni:function (cbCardData, cbCardCount){
        
        this.node.active = true;
       
        //设置扑克
        
        var actQuene = [];
            
            
        //翻转动画
        var actScale0 = cc.scaleTo(0.15,-0.2,0.5);
        var actScale1 = cc.scaleTo(0.15,0.5,0.5);
        actQuene.push(actScale0);
        actQuene.push(actScale1);
        if(cbCardData[cbCardCount] == 0){
            this.m_diPaiNode[cbCardCount].active = false;
       }else{
            this.m_diPaiNode[cbCardCount].active = true;
       }
        actQuene.push(cc.callFunc(function(tag,Data) {
            
            Data[1].getComponent('CardPrefab_63500').SetData(Data[0]); 
            

        },this, [cbCardData[cbCardCount],this.m_diPaiNode[cbCardCount]]));

        this.m_diPaiNode[cbCardCount].runAction(cc.sequence(actQuene));
        
    },
});
