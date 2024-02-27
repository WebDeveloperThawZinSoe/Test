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
                    console.error("CMD_S_GameStart SizeErr ") 
                    return false;  
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_CALL_BANKER:{
                TempData.pStruct = GameDef.CMD_S_UserCall();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_CALL_BANKER SizeErr ")
                    return false;   
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_CALL_PLAYER:{
                TempData.pStruct = GameDef.CMD_S_UserCall();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_CALL_PLAYER SizeErr ")   
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_GAME_END:{
                TempData.pStruct = GameDef.CMD_S_GameEnd();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_GAME_END SizeErr ")   
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_OPEN_CARD:{
                TempData.pStruct = GameDef.CMD_S_Open_Card();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_OPEN_CARD SizeErr ")   
                    return false;
                }
                if(TempData.pStruct.wChairID == INVALD_CHAIR)  break;
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_BANKER_USER:{
                TempData.pStruct = GameDef.CMD_S_UserCall();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_BANKER_USER SizeErr ")  
                    return false; 
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_ADD_SCORE:{
                TempData.pStruct = GameDef.CMD_S_AddScore();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_ADD_SCORE SizeErr ")  
                    return false; 
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_SEND_CARD:{
                TempData.pStruct = GameDef.CMD_S_SendCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_SEND_CARD SizeErr ")  
                    return false; 
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_OPEN_CARD:{
                TempData.pStruct = GameDef.CMD_S_Open_Card();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_OPEN_CARD SizeErr ")  
                    return false; 
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_ALL_ADD:{
                TempData.pStruct = GameDef.CMD_S_Alladd();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_ALL_ADD SizeErr ")  
                    return false; 
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            
            case GameDef.SUB_S_NEXT_READY:
            case GameDef.SUB_S_START_CTRL:{
                break
            }
            default:{
                if(LOG_NET_DATA)console.log("MDM_GF_GAME skip msg "+TempData.wSubCmdID)
            }
        }
        return true;
    },

    ShowIndexCustom:function(wShowIndex){
        return
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        if(pMsg.wMainCmdID == MDM_GF_GAME){
            if(pMsg.wSubCmdID == GameDef.SUB_S_GAME_START) this.SetCardData();
        }
    },
    ShowEndIndexCustom:function(wShowIndex){
        return
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        if(pMsg.wMainCmdID == MDM_GF_GAME && pMsg.wSubCmdID == GameDef.SUB_S_GAME_END) return
        this.SetUserJet(wShowIndex);
    },

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
//私有接口
    SetCardData:function(){
        return
        var pData = this.GameData[this.m_PGIndex];
     
        for(var i = 0; i<pData.length; i++){
            if( pData[i].wSubCmdID == GameDef.SUB_S_GAME_START){
                for (var j = 0; j < GameDef.GAME_PLAYER; j++) {
                    if(pData[i].pStruct.cbPlayStatus[j] == 0) continue
                    var ViewID = this.m_GameEngine.SwitchViewChairID(j);
                    this.m_GameView.m_UserCardControl[ViewID].SetCardData([0,0,0], GameDef.MAX_COUNT);
                }
            }
            if( pData[i].wSubCmdID == GameDef.SUB_S_LOOK_CARD){
                if( pData[i].pStruct.cbCardData[0] != 0){
                    var ViewID = this.m_GameEngine.SwitchViewChairID(pData[i].pStruct.wLookCardUser);
                    this.m_GameView.m_UserCardControl[ViewID].SetCardData(pData[i].pStruct.cbCardData, GameDef.MAX_COUNT);
                }
            }
            if( pData[i].wSubCmdID == GameDef.SUB_S_GAME_END){
                for (var j = 0; j < GameDef.GAME_PLAYER; j++) {
                    var ViewID = this.m_GameEngine.SwitchViewChairID(j);
                    var card = pData[i].pStruct.cbCardData.slice(j*GameDef.MAX_COUNT, j*GameDef.MAX_COUNT+GameDef.MAX_COUNT);
                    if( card[0] != 0) this.m_GameView.m_UserCardControl[ViewID].SetCardData(card, GameDef.MAX_COUNT);
                }
            }
        }
    },

    // update (dt) {},
});
