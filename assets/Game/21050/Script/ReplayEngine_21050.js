cc.Class({
    extends: cc.RePlayEngine,

    properties: {

    },

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//调用接口
    CustomGameData:function(GameIndex, TempData, DataIndex){
        switch(TempData.wSubCmdID){
            case GameDef.SUB_S_GAME_START:{
                TempData.pStruct = GameDef.CMD_S_GameStart();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameStart SizeErr ");
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_GAME_END:{
                TempData.pStruct = GameDef.CMD_S_GameEnd();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameEnd SizeErr ");
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_SEND_START_CARD:
            {
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_NEW_TURN:
            {
                if(TempData.wChairID != this.m_GameBase.InfoHead.wLookChair) break;
                TempData.pStruct = GameDef.CMD_S_NewTurn();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_NewTurn SizeErr ");
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_USER_ACTION:
            {
                TempData.pStruct = GameDef.CMD_S_UserAction();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_UserAction SizeErr ");
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_LOOK_CARD:
            {
                TempData.pStruct = GameDef.CMD_S_LookCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_LookCard SizeErr ");
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_OPEN_CARD:
            {
                TempData.pStruct = GameDef.CMD_S_OpenCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_OpenCard SizeErr ");
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_GAME_DRAW:
            {
                TempData.pStruct = GameDef.CMD_S_GameDraw();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameDraw SizeErr ");
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize);
                this.GameData[GameIndex].push(TempData);
                break;
            }

            default:{
                if(window.LOG_NET_DATA)console.log("MDM_GF_GAME skip msg "+TempData.wSubCmdID)
            }
        }
        return true;
    },

    ShowIndexCustom:function(wShowIndex){
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        if(pMsg.wMainCmdID == MDM_GF_GAME){
          // if(pMsg.wSubCmdID == GameDef.SUB_S_GAME_START && pMsg.wChairID != this.m_GameEngine.GetMeChairID());

        }
    },
    ShowEndIndexCustom:function(wShowIndex){
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        //if(pMsg.wMainCmdID == MDM_GF_GAME && pMsg.wSubCmdID == GameDef.SUB_S_GAME_END) return
        this.SetUserState(wShowIndex);
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //私有接口
    SetUserState:function(wShowIndex){
        // this.m_GameView.SetUserState(INVALID_CHAIR);
        // var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        // var pStuck = pMsg.pStruct;
        // switch(pMsg.wSubCmdID){

        // }
    },

    // update (dt) {},
});
