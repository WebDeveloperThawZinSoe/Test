cc.Class({
    extends: cc.BaseControl,

    properties: {
        m_ItemNd:cc.Node,
        m_Atlas:cc.SpriteAtlas,
    },

    onLoad:function(){
        this.Init();
    },

    Init:function(){
        if(this.m_BaseItemNd == null)this.m_BaseItemNd = this.$('BaseItem'); 
        for(var i = 0;i < GameDef.MAX_CARD_KIND;i++){
            var Toggle = this.CopyItem(this.m_BaseItemNd,this.m_ItemNd).getComponent(cc.Toggle);
            Toggle.node.name = `${window.SetKey_Card_Back}_${i}`;
            var cstr = '255_'+i;
            this.$('BG@Sprite',Toggle.node).spriteFrame = this.m_Atlas.getSpriteFrame(cstr);
        }
    },

    OnShowView :function(){
    },

    CopyItem:function(tagNode,ParentNode){
        if(!tagNode) return;
        var tagItem = cc.instantiate(tagNode);
        ParentNode.addChild(tagItem);
        tagItem.active = true;
        return tagItem;
    },

    OnToggleClick:function (Tag,Data){
        cc.gSoundRes.PlaySound('Button');
        this.m_Toggle  = Tag;
        this.m_bNeedUpdate = true;
  
    },
    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }

        var pair = this.GetPair(this.m_Toggle);
        window.SaveSetting(pair.key, pair.value, this.m_GameDef.KIND_ID);
        this.m_Toggle = null;
    },

    SetGame: function (GameDef) {
        this.m_GameDef = GameDef;
    },

    Load: function() {
        if (!this.m_ToggleArr) {
            this.m_ToggleArr = new Array();
            this.TraverseToggle(this.node, this.m_ToggleArr);
        }
        for(var i in this.m_ToggleArr) {
            var pair = this.GetPair(this.m_ToggleArr[i]);
            if(!pair) continue;
            this.m_ToggleArr[i].isChecked = (pair.value == window.g_GameSetting[this.m_GameDef.KIND_ID][pair.key]);
        }
    }
    
});
