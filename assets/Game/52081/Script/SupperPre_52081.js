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
        m_Atlas:cc.SpriteAtlas
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    OnBtClickCard :function(){
        this.m_Hook.OnBtSelCard(this.node);
        
    },
    SetData:function (cbCardData){
        this.node.name = cbCardData+'';
        this.node.getComponent(cc.Sprite).spriteFrame = this.m_Atlas.getSpriteFrame('P9Card'+cbCardData);
    },
});
