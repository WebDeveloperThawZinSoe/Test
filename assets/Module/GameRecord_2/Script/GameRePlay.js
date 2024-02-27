cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_UINode:cc.Node,
        m_BtLast:cc.Button,
        m_BtNext:cc.Button,
        m_BtLastGame:cc.Button,
        m_BtNextGame:cc.Button,
        m_BtPlay:cc.Button,
        m_BtStop:cc.Button,
    },
    onLoad:function () {
        this.m_gameNode = this.node.getChildByName("GameNode");
        this.m_BGSprite = this.m_gameNode.getComponent(cc.Sprite);
        this.m_UINode.active = false;
        this.schedule(this.CheckRePlay,1.5);
    },

    //游戏自动播放
    CheckRePlay:function(){
        if(this.m_ReplayEngine == null) return
        if(!this.m_ReplayEngine.IsReady()) return
        if(this.m_FirstOpen) return this.m_FirstOpen = false;
        if(this.m_BtPlay.node.active == false) this.m_ReplayEngine.PlayNext();
    },

    OnHideView:function(){
        if( this.m_GameEngine ) this.m_GameEngine.OnDestroy();
        var kernel = gClientKernel.get();
        if(kernel != null) gClientKernel.destory();

        //播放背景音乐
        var BGMIndex = cc.sys.localStorage.getItem(window.QPName+window.Key_TableBGM);
        if(BGMIndex == null) BGMIndex=0
        cc.gSoundRes.PlayMusic("BGM"+BGMIndex, false);

        this.node.active = false;
    },
    //按钮状态
    ChangeUIState:function(GameIndex,wPorgress,EndIndex,EndProgress){
        this.m_UINode.active = true;
        this.m_BtLast.interactable = wPorgress > 0;
        this.m_BtNext.interactable = wPorgress < EndProgress;
        //this.m_BtLastGame.interactable = GameIndex > 0;
        //this.m_BtNextGame.interactable = GameIndex < EndIndex;
        if(wPorgress >= EndProgress){
            this.m_BtPlay.interactable = false;
            this.m_BtPlay.active = true;
            this.m_BtStop.active = false;

            if(this.m_BtPlay.node.active == false){
                this.m_BtPlay.node.active = true;
                this.m_BtStop.node.active = false;
            }
        }else{
            this.m_BtPlay.interactable = true;
        }
    },
    OnCheckReady:function(){
        if(!this.m_ReplayEngine || !this.m_ReplayEngine.m_bInitScene) return false
        return true;
    },
    //上一步
    OnBtLast:function(){
        if(!this.OnCheckReady()) return
        this.OnBtStop();
        this.m_ReplayEngine.PlayLast();
    },
    //下一步
    OnBtNext:function(){
        if(!this.OnCheckReady()) return
        this.OnBtStop();
        this.m_ReplayEngine.PlayNext();
    },
    //播放
    OnBtPlay:function(){
        if(!this.OnCheckReady()) return
        this.m_BtPlay.node.active = false;
        this.m_BtStop.node.active = true;
    },
    //暂停
    OnBtStop:function(){
        if(!this.OnCheckReady()) return
        this.m_BtPlay.node.active = true;
        this.m_BtStop.node.active = false;
    },
    //上一局
    OnBtLastGame:function(){
        if(!this.OnCheckReady()) return
        this.m_wProgress = parseInt(this.m_wProgress) - 1;
        this.UpdateReplayData();
    },
    //下一局
    OnBtNextGame:function(){
        if(!this.OnCheckReady()) return
        this.m_wProgress = parseInt(this.m_wProgress) + 1;
        this.UpdateReplayData();
    },
    //加载回放&游戏组件
    LoadGameRes:function(wKindID){
        this.m_BGSprite.spriteFrame = null;
        this.m_GameEngine = null;
        this.m_ReplayEngine = null;
        this.m_FirstOpen = true;
        this.m_PlayIndex = 0;
        this.OnBtStop();

        try {
            this.m_ReplayEngine = this.node.getComponent('ReplayEngine_'+wKindID);
            if(this.m_ReplayEngine == null) this.m_ReplayEngine = this.node.addComponent('ReplayEngine_'+wKindID);
        } catch (error) {
            if(window.LOG_NET_DATA)console.log(error)
            return false;
        }
        var kernel = gClientKernel.get();
        if(kernel == null||kernel == 0) kernel = gClientKernel.create();

        this.m_ReplayEngine.Init(this);
        this.unschedule(this.OnTimer_LoadGCE);
        this.scheduleOnce(this.OnTimer_LoadGCE, 0.1);
        return true;
    },

    OnTimer_LoadGCE: function() {

        this.ShowGamePrefab('GameClientEngine',GameDef.KIND_ID,this.m_gameNode,function(Js){
            this.m_GameEngine = Js;
            this.m_ReplayEngine.SetGameEngine(Js);
        }.bind(this));

    },

    //设置回放数据
    LoadRePlayData:function(LookUser, RecordID, wProgress){
        var self = this;
        this.m_PlayID = RecordID;
        this.m_wProgress = wProgress;
        this.m_LookUser = LookUser;
        this.UpdateReplayData();
    },
    UpdateReplayData:function(){
        var self = this;
        g_Lobby.ShowLoading();
        var webUrl = window.PHP_HOME+'/GameRecord.php?&GetMark=1&ID='+this.m_PlayID+'&GameIndex='+this.m_wProgress;
        WebCenter.GetData(webUrl, 999999, function (data) {
            g_Lobby.StopLoading();
            if(data.length < 50){
                self.ShowAlert('回放文件丢失！',Alert_Yes, function() {
                    self.HideView();
                });
                return
            }

            var RecordInfo = JSON.parse(data);
            if(RecordInfo[0] == 0) {
                self.ShowAlert('回放文件读取失败！',Alert_Yes, function() {
                    self.HideView();
                });
                return
            }
            self.m_BtLastGame.interactable = RecordInfo[1] > 0;
            self.m_BtNextGame.interactable = parseInt(RecordInfo[1]) + 1 < RecordInfo[2];
            if(self.m_ReplayEngine) self.m_ReplayEngine.SetData(RecordInfo[3], self.m_LookUser);
        });
    },
    update (dt) {
        if(window.gGameBG == 'loading') {
            window.gGameBG = cc.gPreLoader.LoadRes(`Image_BG_BG${GameDef.BGIndex}`, '' + GameDef.KIND_ID, function(res) {
                this.m_BGSprite.spriteFrame = res;
            }.bind(this));
        }
    },
});
