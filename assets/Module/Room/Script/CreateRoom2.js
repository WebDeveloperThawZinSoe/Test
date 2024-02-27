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

        this._GameListInfo = {};
        this._GameListInfo['10011'] = [['明牌抢庄','10011_0'],['轮庄模式','10011_1'],['自由抢庄','10011_2']];
        this._GameListInfo['10012'] = [['明牌抢庄','10012_0'],['轮庄模式','10012_1'],['自由抢庄','10012_2'],['固定庄家','10012_3'],['无花抢庄','10012_4'],['明牌通比','10012_5'],['通比模式','10012_6']];
        this._GameListInfo['10013'] = [['明牌抢庄','10013_0'],['轮庄模式','10013_1'],['自由抢庄','10013_2'],['大吃小','10013_3'],['明牌大吃小','10013_4']];
        this._GameListInfo['21060'] = [['经典玩法','21060'],['闷胡血流','21061'],['两丁一房','21062_2'],['两丁两房','21062_3'],['三丁两房','21062_4']];
    },

    OnShowView:function(){
        // if(this.m_FirstCtrl == null){
        //     this.m_FirstCtrl = this.$('K1@Toggle',this.m_groupNode);
        //     this.m_FirstCtrl.isChecked = false;
        //     this.m_FirstCtrl.check();
        // }
        if(this._ListCtrl== null){
            this._ListCtrl = this.$('@CustomListCtrl');
            this._ListCtrl.InitList(0,'GamePlayItem',this);
        }
        return
    },
    OnSetGameID:function(KindID){
        this._ListCtrl.InitList(0,'GamePlayItem',this);
        this.$('BGB').active = !(this._GameListInfo[KindID] == null);
        this.$('NdGame').x = (this._GameListInfo[KindID] == null)?-95:0;
        if(this._GameListInfo[KindID]){
            for(var i =0;i<this._GameListInfo[KindID].length;i++){
                this._ListCtrl.InsertListInfo(0,[i,this._GameListInfo[KindID][i]]);
            }
        }else{
            this.OnToggleSelGame(null,KindID.toString());
        }
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
        // this.m_FirstCtrl.isChecked = false;
        // this.m_FirstCtrl.check();
    },

    OnToggleSelGame:function(Tag, Data){
        // if(Tag.node.name.indexOf('K') >=0 ) this.OnHideAllChild();
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
            if(this.$('BGB').active == false) Js.node.x = -80; else Js.node.x = 30;
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
