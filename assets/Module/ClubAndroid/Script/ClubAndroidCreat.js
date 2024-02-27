cc.Class({
    extends: cc.BaseClass,

    properties: {
       
    },
    ctor:function(){
        
    },
    onLoad:function(){
        
    },
    OnShowView:function(){
        this.m_KindID = 0;
        this.m_RoomID = 0;
        this.ResetView();
    },
    OnSetInfo:function(info){
        this.$('Sub/t1/Name@Label').string = window.GameList[info.wKindID];
        this.m_KindID = info.wKindID;
        this.m_RoomID = info.dwRoomID;
        var GameDef = new window['CMD_GAME_' + info.wKindID]();
        this._MaxplayCnt = GameDef.GetPlayerCount(info.dwServerRules, info.dwRules);
        this.$('Sub/t2/PlayCnt@Label').string = this._MaxplayCnt;
    },
    OnClick_CreatAndroid:function(){
        var path = 'Sub/'
        var playingTableCnt = this.$(path+'t3/EdPlayingTableCnt@EditBox').string;
        if(parseInt(playingTableCnt) == 0 || parseInt(playingTableCnt) == NaN){
            this.ShowTips('同时开桌数非法，请重新设置');
            return;
        }
        
        var totalTableCnt = this.$(path+'t6/EdTotalTableCnt@EditBox').string;
        if(parseInt(totalTableCnt) == 0 || parseInt(totalTableCnt) == NaN){
            this.ShowTips('总消耗桌数，请重新设置');
            return;
        }
        var sitCnt = this.$(path+'t7/EdSitCnt@EditBox').string;
        if(parseInt(sitCnt) == 0||parseInt(sitCnt) == NaN){
            this.ShowTips('单桌最大人数，请重新设置');
            return;
        }

        if(sitCnt>this._MaxplayCnt){
            this.ShowTips('设置非法，超过房间最大人数');
            return;
        }

        window.gClubClientKernel.onSendCreatAndroidGroup(this,g_ShowClubInfo.dwClubID,this.m_KindID,this.m_RoomID,totalTableCnt,playingTableCnt,sitCnt);

    },
    ResetView:function(){
        var path = 'Sub/'
        this.$(path+'t3/EdPlayingTableCnt@EditBox').string = '';
        this.$(path+'t6/EdTotalTableCnt@EditBox').string = '';
        this.$(path+'t7/EdSitCnt@EditBox').string = '';
    },
    OnClick_Back:function(){
        this.m_SubNode.children[0].active = true;
        this.m_SubNode.children[1].active = false;
    },
    OnClick_ShowCreat:function(){
        this.m_SubNode.children[0].active = false;
        this.m_SubNode.children[1].active = true;
    },
    OnClick_GameKindClose:function(){
        this.m_GameKind.x = 2000;
    },
    OnClick_GameKindTag:function(tag){
        this.m_GameKind.x = 2000;
        var path = 'Sub/Sub_2/';
        this.$(path+'t1/btGamekind/Background/Label@Label').string = window.GameList[tag.node.name];
        this.m_Kind = parseInt(tag.node.name);
    },
    onCreatRes:function(code){
        if(code == 1){
            g_CurScene.ShowTips('权限不足');
        }else if(code == 2){
            g_CurScene.ShowTips('机器人数量不足');
        }else if(code == 3){
            g_CurScene.ShowTips('房间不存在');
        }else if(code == 4){
            g_CurScene.ShowTips('已存在相同机器人组');
        }else{
            g_CurScene.ShowTips('创建成功');
        }
        if(code == 0)  this.HideView();
        else this.ResetView();
    },
});
