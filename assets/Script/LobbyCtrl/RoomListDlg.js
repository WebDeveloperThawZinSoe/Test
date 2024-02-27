cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_GameKindLab:cc.Sprite,
        m_BtRoomKind:[cc.Node],
        m_Atlas:cc.SpriteAtlas
    },
    ctor:function(){
        this.m_KindIndex = new Object();
        this.m_KindIndex[40107] = 1;
    },

    SetGameKind:function (ID){
        var index = this.m_KindIndex[ID];
        if(index == null ) return this.ShowTips("undefined GameKindID "+ID);
        this.m_wKindID = ID;
        this.UpdateView(index);
    },
    UpdateView:function(index){
        this.m_GameKindLab.SpriteFrame = this.m_Atlas.getSpriteFrame("GameLab"+index);
    },
    OnBtRoom:function(Tag,RoomKind){
       if(this.m_Hook)this.m_Hook.SendTypeQuery(this.m_wKindID,parseInt(RoomKind));
    },

});
