// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_CardPre:cc.Node,
        m_CardNode:cc.Node,
        m_SetNode:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},
    ctor :function () {
        this.m_CardArr = new Array();
        this.m_CardCtrlArr = new Array( );
        this.m_CardCount = new Array();
    },
    start () {

    },
    GetCardPre:function(cbCardData) {
        var CardCtrl = cc.instantiate(this.m_CardPre).getComponent('SupperPre_52081');
        CardCtrl.node.active = true;
        CardCtrl.SetData(cbCardData);
        CardCtrl.m_Hook = this;
        return CardCtrl;
    },
    InitCtrl:function(wChairID,Cnt, CardArr){
        this.m_CardArr = CardArr;
        this.m_CardNode.removeAllChildren();
        this.m_CardCtrlArr = new Array();
        for(var i=0;i<Cnt;i++){
            if(CardArr[i] == null) continue;
            if(this.m_CardCtrlArr[i] == null){
                this.m_CardCtrlArr[i] = this.GetCardPre(CardArr[i]);
                this.m_CardNode.addChild(this.m_CardCtrlArr[i].node);
                this.m_CardCount[i] = 1;
            }
        }
        this.m_SetNode.removeAllChildren();
    },

    OnBtSelCard :function(node){
        if(this.m_SetNode.childrenCount >= GameDef.MAX_COUNT) return;
        var CardValue = parseInt(node.name)
        for(var i=0;i<this.m_CardArr.length;i++){
            if(this.m_CardArr[i] != CardValue) continue;
            if(this.m_CardCount[i] > 0){
                this.m_CardCount[i]--;
                var temp = this.GetCardPre(this.m_CardArr[i]);
                this.m_SetNode.addChild(temp.node);
              //  temp.node.setPositionY(0)
            }else continue;
            break;
        }
    },


    OnBtSureChangeCard:function(node){
        if(this.m_SetNode.childrenCount !=  GameDef.MAX_COUNT) return;
        var TempCardArr = new Array();
        for(var i=0;i<this.m_SetNode.childrenCount; i++){
            TempCardArr[i] = this.m_SetNode.children[i].name;
        }
        this.m_Hook.OnBtClickedSuperOK(TempCardArr,this.m_SetNode.childrenCount);
        this.HideView();
    },
});
