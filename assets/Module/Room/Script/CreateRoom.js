var SelGame = window.QPName+'_C_G'
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_groupNode:cc.Node,
        m_rulesNode:cc.Node,
        m_BtCreate:cc.Node,
        m_LabLoadTip:cc.Label,
    },
    ctor:function(){
        this.m_GameViewArr = new Array();
        this.m_RoomType = 0;// 0普通  1俱乐部
        this.m_nNeedUpdate = 0;
        this.m_RoomInfo = null;
        this.m_FirstCtrl = null;

        this.m_ClubView = new Array();
        this.m_ClubView.push('K0/3');
    },

    OnShowView:function(){
        if(this.m_FirstCtrl == null){
            this.OnHideAllChild();
            this.m_FirstCtrl = this.$('K1@Toggle',this.m_groupNode);
            this.m_FirstCtrl.isChecked = false;
            this.m_FirstCtrl.check();
        }
        return
    },
    OnHideAllChild:function(){
        this.m_TagKindChild = null;
        for(var i=0; i<this.m_groupNode.childrenCount; i++){
            for(var j=1; j<this.m_groupNode.children[i].childrenCount; j++ ){
                this.m_groupNode.children[i].children[j].active = false;
            }
        }
    },
    OnClick_HideKindChild:function(Tag){
        var NdList = Tag.currentTarget.parent.parent;// mark .. Background .. k?
        if(NdList == null || NdList.children[1] == null) return
        var bShow = !NdList.children[1].active;
        for(var i=1; i<NdList.childrenCount; i++){
            NdList.children[i].active = bShow;
        }
    },
    OnClick_ShowKindChild:function(Tag){
        this.OnHideAllChild();
        var FirstCtrl = null;
        this.m_TagKindChild = Tag;
        this.m_KindChildIndex = 1;
        this.m_nNeedUpdate = 1;

        for(var i=1; i<Tag.node.childrenCount; i++){
            var TogCtrl = this.$('@Toggle',Tag.node.children[i]);
            if(FirstCtrl == null ) FirstCtrl = TogCtrl;
            if(TogCtrl) TogCtrl.node.active = false;
        }

        if(this.m_RoomType == 0){
            for(var i in this.m_ClubView){
                this.$(this.m_ClubView[i], this.m_groupNode).active = false;
            }
        }

        // if(FirstCtrl){
        //     FirstCtrl.isChecked = false;
        //     FirstCtrl.check();
        // }
    },

    update: function(){
        if(this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate --;
        } else {
            return;
        }
        if(this.m_TagKindChild && this.m_KindChildIndex < this.m_TagKindChild.node.childrenCount) {
            var TogCtrl = this.$('@Toggle', this.m_TagKindChild.node.children[this.m_KindChildIndex]);
            if (TogCtrl) {
                TogCtrl.node.active = true;
                if (this.m_KindChildIndex == 1) {
                    TogCtrl.isChecked = false;
                    TogCtrl.check();
                }
            }
            this.m_KindChildIndex ++;
            this.m_nNeedUpdate = 1;
        }
    },

    OnClubAutoView:function(RoomType){
        this.m_RoomType = RoomType;
        //this.$('4',this.m_groupNode).active = this.m_RoomType == 1;
        this.m_FirstCtrl.isChecked = false;
        this.m_FirstCtrl.check();
    },

    OnToggleSelGame:function(Tag, Data){
        if(Tag.node.name.indexOf('K') >=0 ) this.OnHideAllChild();
        this.m_RoomInfo = Data.split('_');
        //console.log('OnToggleSelGame ', Data,this.m_RoomInfo[0]);
        this.OnShowSubGameView(this.m_RoomInfo[0], this.m_RoomInfo[1]);
    },
    OnShowSubGameView:function(KindID, ViewIndex){
        try {
            var gamedef = new window['CMD_GAME_'+KindID]();
        } catch (error) {
            for(var i in this.m_GameViewArr){
                this.m_GameViewArr[i].node.active = false;
            }
            this.$('NdGame').active = false;
            this.$('NotFind').active = true;
            return;
        }
        this.$('NdGame').active = true;
        this.$('NotFind').active = false;
        //刷新当前界面
        for(var i in this.m_GameViewArr){
            this.m_GameViewArr[i].node.active = false;
        }
        this.m_BtCreate.interactable = false;
        this.m_LabLoadTip.node.active = true;
        this.ShowGamePrefab('SubRoom',KindID,this.node,function(Js){//1020*500
            this.m_GameViewArr[KindID] = Js;
            this.m_GameViewArr[KindID].InitView(KindID, ViewIndex, this.m_RoomType);
            //刷新当前界面
            for(var i in this.m_GameViewArr){
                this.m_GameViewArr[i].node.active = (i == this.m_RoomInfo[0]);
            }
            this.m_BtCreate.interactable = true;
            this.m_LabLoadTip.node.active = false;
        }.bind(this));
    },
    OnBtCreate:function(){
        cc.gSoundRes.PlaySound('Button');
        if(this.m_RoomInfo == null || window.GameList[this.m_RoomInfo[0]] == null){
            this.ShowTips("游戏暂未开放！")
            return
        }
        var KindID = this.m_RoomInfo[0];
        this.m_GameViewArr[KindID]
        var dwRules = this.m_GameViewArr[KindID].getRulesEx(1);
        var dwServerRules = this.m_GameViewArr[KindID].getServerRules();
        if(this.m_RoomType) dwServerRules = dwServerRules|4; //俱乐部模式金币场
        var Name = '快来玩呀';
        if(this.m_EdRoomName) Name = this.m_EdRoomName.string;
        if(this.m_Hook) this.m_Hook.OnCreateRoom(KindID, dwRules, dwServerRules, Name, 0, 0);
        this.HideView();
    },
});
