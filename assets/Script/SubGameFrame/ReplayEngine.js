tagRecordUserInfo = cc.Class({
    ctor:function() {
        this.dwUserID = 0;
        this.dwGameID = 0;
        this.wTableID = 0;
        this.wChairID = 0;
        this.cbGender = 0;
        this.llScore = 0;
    },
});

tagProgressData = cc.Class({
    ctor:function() {
        this.wChairID = 0;
        this.wMainCmdID = 0;
        this.wSubCmdID = 0;
        this.wDataSize = 0;
        this.pStruct = null;
    },
});


tagRecordFileHead = cc.Class({
    ctor:function() {
        this.dwVer = 0;
        this.wUserCount = 0;
    },
});

CMD_GameBase = cc.Class({
    ctor:function() {
        this._name = 'CMD_GameBase'
        this.InfoHead = new tagRecordFileHead();
        this.wInfoSize = 0;						//房主ID
        this.roomInfo = new CMD_GF_RoomInfo();		//52
        this.wSceneSize = 0;						//房主ID
        this.gameScene = 0;
    },
});
RePlayVer = 1;

cc.RePlayEngine = cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    onLoad:function () {

    },
    Init :function (Hook) {
        this.m_Hook = Hook;
        this.m_PlayData = null;
        this.m_GameEngine = null;
        this.m_bInitScene = false;
        this.m_PGIndex = 0;
        this.m_PGProgress = 0;
    },

    SetData:function (Data, LookUser, bOnlyData) {
        this.m_bOnlyData = bOnlyData;
        this.m_PlayData = Data.split(',');
        for(var i in this.m_PlayData) this.m_PlayData[i] = parseInt(this.m_PlayData[i], 16);
        this.m_GameBase = new CMD_GameBase();
        this.m_GameBase.gameScene = GameDef.CMD_S_StatusFree();
        var DataIndex = gCByte.Bytes2Str( this.m_GameBase, this.m_PlayData);

        //游戏开始信息头
        if( this.m_GameBase.InfoHead.dwVer != RePlayVer) {
            if(window.LOG_NET_DATA)console.log("ParseData err dwVer")
            if(window.LOG_NET_DATA)console.log(this.GameData)
            return  this.ShowTips("数据异常！ 1");
        }

        //校验数据
        if(this.m_GameBase.wInfoSize != gCByte.GetSize(this.m_GameBase.roomInfo) || this.m_GameBase.wSceneSize != gCByte.GetSize(this.m_GameBase.gameScene)){
            return this.ShowTips("数据异常！ 0")
        }

        //保存数据
        var StartIndex = gCByte.GetSize(this.m_GameBase.InfoHead) + 2;
        this.m_GameBase.RoomData = this.m_PlayData.slice(StartIndex, StartIndex + this.m_GameBase.wInfoSize);
        StartIndex += this.m_GameBase.wInfoSize + 2;
        this.m_GameBase.SceneData = this.m_PlayData.slice(StartIndex, StartIndex + this.m_GameBase.wSceneSize);

        var kernel = gClientKernel.get();
        if(!this.m_bOnlyData)kernel.OnGFConfigServer(LookUser,null);

        this.GameData = new Array;
        this.ParseData(DataIndex, 0);
        if(this.m_GameEngine) this.ClearScene();
    },

    SetGameEngine:function (GameEngine) {
        this.m_GameEngine = GameEngine;
        this.m_GameEngine.m_ReplayMode = true;
        this.m_GameEngine.LoadSound();
        this.m_GameView = this.m_GameEngine.m_GameClientView;
        var kernel = gClientKernel.get();
        kernel.SetClientKernelSink(this.m_GameEngine);
    },

    IsReady:function(){
        if(this.m_PlayData == null || this.m_GameEngine == null) return false;
        if(this.InitScene()) return true;
        return false;
    },
    //更新按钮状态
    ChangeUIState:function(){
        this.m_Hook.ChangeUIState( this.m_PGIndex, this.m_PGProgress,this.GameData.length - 1,  this.GameData[this.m_PGIndex].length - 1)
    },

    ClearScene:function(){
        this.m_bInitScene = false;
        this.InitScene();
        this.ChangeUIState();
    },
    InitScene:function(){
        if(this.m_bInitScene) return true;
        this.m_bInitScene = true;
        if(window.LOG_NET_DATA) console.log("InitScene")

        var kernel = gClientKernel.get();
        //观看视角
        var tempUser = new tagUserInfo(); //dwUserID == 0
        //本局信息
        for(var i=0;i< this.GameData[this.m_PGIndex].user.length;i++){
            if( this.GameData[this.m_PGIndex].user[i].dwUserID != kernel.mUserAttribute.dwUserID) continue
            gCByte.StrSameMemCopy(tempUser, this.GameData[this.m_PGIndex].user[i]);
        }
        //半路加入 取加入时数据
        if(tempUser.dwUserID == 0){
            for(var i=this.m_PGIndex;i<this.GameData.length;i++){
                if(tempUser.dwUserID != 0) break;
                for(var j=0;j<this.GameData[i].user.length;j++){
                    if( this.GameData[i].user[j].dwUserID != kernel.mUserAttribute.dwUserID) continue
                    gCByte.StrSameMemCopy(tempUser, this.GameData[i].user[j]);
                }
            }
        }
        //非游戏玩家 取首位置初始化
        if(tempUser.dwUserID == 0){
            kernel.OnGFConfigServer(this.GameData[0].user[0], null);
            gCByte.StrSameMemCopy(tempUser, this.GameData[this.m_PGIndex].user[0]);
        }
        //观看视角玩家进入
        kernel.mUserManager.ActiveUserItem(tempUser/*, CustomFaceInfo*/);
        //其他玩家
        for(var i=0;i< this.GameData[this.m_PGIndex ].user.length;i++){
            if( this.GameData[this.m_PGIndex ].user[i].dwUserID == kernel.mUserAttribute.dwUserID) continue
            var tempUser = new tagUserInfo();
            gCByte.StrSameMemCopy(tempUser, this.GameData[this.m_PGIndex].user[i]);
            kernel.mUserManager.ActiveUserItem(tempUser/*, CustomFaceInfo*/);
        }

        //场景还原
        this.m_GameEngine.OnClearScene();
        //初始化场景
        this.m_GameEngine.OnCardRoomMessage(SUB_GF_ROOM_INFO, this.m_GameBase.RoomData, this.m_GameBase.wInfoSize);
        this.m_GameEngine.OnEventSceneMessage(GAME_STATUS_FREE, false, this.m_GameBase.SceneData, this.m_GameBase.wSceneSize) ;
        //进度信息
        if(this.GameData[this.m_PGIndex].RoomStatus) this.m_GameEngine.OnCardRoomMessage(SUB_GF_ROOM_STATUS,  this.GameData[this.m_PGIndex].RoomStatus.ByteData, this.GameData[this.m_PGIndex].RoomStatus.wDataSize);

        this.ShowIndex(0);
    },
    //解析游戏数据
    ParseData:function(DataIndex, GameIndex){
        if(DataIndex >= this.m_PlayData.length) return this.DataParseFinish();
        this.GameData[GameIndex] = new Array();
        //游戏玩家数据
        this.GameData[GameIndex].user = new Array();
        for(var i=0;i< this.m_GameBase.InfoHead.wUserCount;i++){
            this.GameData[GameIndex].user[i] = new tagRecordUserInfo();
        }
        DataIndex += gCByte.Bytes2Str(this.GameData[GameIndex].user, this.m_PlayData, DataIndex);

        if(!this.m_bOnlyData){
            var kernel = gClientKernel.get();
            //其他玩家
            for(var i=0;i< this.GameData[GameIndex].user.length;i++){
                if( this.GameData[GameIndex].user[i].dwUserID == kernel.mUserAttribute.dwUserID) {
                    this.m_GameBase.InfoHead.wLookChair = this.GameData[GameIndex].user[i].wChairID;
                }
            }
        }
        //游戏流程数据
        var tempSize = this.ParseGameData(DataIndex, GameIndex);
        //下一局数据
        if(tempSize != false) this.ParseData(DataIndex+tempSize, GameIndex+1);
    },
    GetUserChairID:function(dwUserID){
        if(this.GameData == null) return INVALID_CHAIR;
        if(this.GameData[0].user == null) return INVALID_CHAIR;
        for(var i in this.GameData[0].user){
            if(this.GameData[0].user[i].dwUserID == dwUserID) return this.GameData[0].user[i].wChairID;
        }
        return INVALID_CHAIR;
    },
    ParseGameData:function(DataIndex, GameIndex){
        var Size = 0;
        //放卡框架消息
        while(DataIndex + Size < this.m_PlayData.length){
            var TempData = new tagProgressData();
            Size += gCByte.Bytes2Str(TempData, this.m_PlayData, DataIndex + Size);

            //单句结束判断
            if(TempData.wMainCmdID == INVALID_WORD && TempData.wSubCmdID == INVALID_WORD) break;

            if(TempData.wMainCmdID == MDM_GF_CARDROOM){
                switch(TempData.wSubCmdID){
                    case SUB_GF_ROOM_INFO: {
                        var pRoomInfo = new CMD_GF_RoomInfo();
                        if(datasize != gCByte.Bytes2Str(pRoomInfo,data) ) return false;

                        if(gCByte.Bytes2Str(pRoomInfo, this.m_PlayData, DataIndex + Size) != TempData.wDataSize){
                            console.error("MDM_GF_CARDROOM SizeErr SubID "+TempData.wSubCmdID)
                            return false;
                        }
                        TempData.ByteData = this.m_PlayData.slice( DataIndex + Size, DataIndex + Size + TempData.wDataSize)
                        break
                    }
                    case SUB_GF_ROOM_STATUS:{
                        TempData.pStruct = new CMD_GF_RoomStatus();
                        TempData.pStruct.bLockArr = new Array(GameDef.GAME_PLAYER);
                        if(gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex + Size) != TempData.wDataSize){
                            console.error("MDM_GF_CARDROOM SizeErr SubID "+TempData.wSubCmdID)
                            return false;
                        }
                        TempData.ByteData = this.m_PlayData.slice( DataIndex + Size, DataIndex + Size + TempData.wDataSize)
                        this.GameData[GameIndex].RoomStatus = TempData;
                        break
                    }
                    case SUB_GF_ROOM_GAME_FINISH:{
                        TempData.pStruct = GameDef.CMD_S_GameCustomInfo();
                        if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex + Size) != TempData.wDataSize){
                            console.error("MDM_GF_CARDROOM SizeErr SubID "+TempData.wSubCmdID)
                            return false;
                        }
                        TempData.ByteData = this.m_PlayData.slice( DataIndex + Size, DataIndex + Size + TempData.wDataSize)
                        this.GameData[GameIndex].push(TempData);
                        //战绩显示数据
                        this.GameData.CustomEnd = TempData.pStruct;
                        break
                    }
                    default:{
                        if(window.LOG_NET_DATA)console.log("MDM_GF_CARDROOM skip msg "+TempData.wSubCmdID)
                    }
                }
            }
            //游戏私有消息
            if(TempData.wMainCmdID == MDM_GF_GAME){
                if(!this.CustomGameData(GameIndex, TempData, DataIndex+Size)) return false;
            }

            Size += TempData.wDataSize;
        }

        if( this.CustomGameDataParseEnd != null ){
            this.CustomGameDataParseEnd(GameIndex);
        }
        return Size
    },


    //解析完成
    DataParseFinish:function(){
        if(window.LOG_NET_DATA)console.log(this.GameData)
        this.m_PGIndex = 0;
        this.m_PGProgress = 0;
        if(!this.m_bOnlyData)this.ChangeUIState();
    },


    PlayNext:function(){
        if(this.m_PGProgress + 1 >= this.GameData[this.m_PGIndex].length) return
        this.ShowIndex(this.m_PGProgress+1)
        this.ChangeUIState();
    },
    PlayLast:function(){
        if(this.m_PGProgress == 0) return
        this.ShowIndex(this.m_PGProgress-1)
        this.ChangeUIState();
    },
    ShowIndex:function(wShowIndex){
        var pData = this.GameData[this.m_PGIndex];
        var StartIndex = this.m_PGProgress;
        if(this.m_PGProgress >= wShowIndex ) {
            this.m_GameEngine.OnClearScene();
            StartIndex = 0;
        }else{
            StartIndex += 1;
        }

        for(var i = StartIndex; i<=wShowIndex; i++){
            var pMsg = pData[i];
            this.m_GameEngine.m_bRollBack = i != wShowIndex;
            if(pMsg.wMainCmdID == MDM_GF_GAME) this.m_GameEngine.OnEventGameMessage(pMsg.wSubCmdID,pMsg.ByteData,pMsg.wDataSize)
            if(pMsg.wMainCmdID == MDM_GF_CARDROOM) this.m_GameEngine.OnCardRoomMessage(pMsg.wSubCmdID,pMsg.ByteData,pMsg.wDataSize);
            if(pMsg.wMainCmdID != MDM_GF_CARDROOM) this.ShowIndexCustom(i);
        }
        if( pData[wShowIndex].wMainCmdID != MDM_GF_CARDROOM) this.ShowEndIndexCustom(wShowIndex);

        this.m_PGProgress = wShowIndex;
    },
});
