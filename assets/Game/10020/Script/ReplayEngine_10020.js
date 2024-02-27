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
            case GameDef.SUB_S_ADD_SCORE:{
                TempData.pStruct = GameDef.CMD_S_AddScore();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_AddScore SizeErr ")
                    return false;   
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_GIVE_UP:{
                TempData.pStruct = GameDef.CMD_S_GiveUp();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GiveUp SizeErr ")   
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_GAME_END:{
                TempData.pStruct = GameDef.CMD_S_GameEnd();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameEnd SizeErr ")   
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                //手牌
                var GameIndex=0;
                var CardData = new Array();
                for(var i=0;i< this.GameData[GameIndex].user.length;i++){
                    CardData[this.GameData[GameIndex].user[i].dwUserID] = new Array();
                    for(var j=0;j<GameDef.MAX_COUNT;j++){
                        var CardInde = this.GameData[GameIndex].user[i].wChairID*GameDef.MAX_COUNT + j;
                        CardData[this.GameData[GameIndex].user[i].dwUserID][j] = TempData.pStruct.cbCardData[CardInde];
                    }
                }
                this.GameData.CardData = CardData;
                this.GameData.CardCnt = GameDef.MAX_COUNT;
                break
            }
            case GameDef.SUB_S_COMPARE_CARD:{
                TempData.pStruct = GameDef.CMD_S_CompareCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_CompareCard SizeErr ")   
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_LOOK_CARD:{
                TempData.pStruct = GameDef.CMD_S_LookCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_LookCard SizeErr ")  
                    return false; 
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                if(TempData.pStruct.cbCardData[0] != 0) this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_NEXT_READY:{
                break
            }
            case GameDef.SUB_S_COMPARE_FINISH:{
                TempData.pStruct = GameDef.CMD_S_CompareFinish();
                if(gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_CompareFinish SizeErr ")   
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            default:{
                if(LOG_NET_DATA)console.log("MDM_GF_GAME skip msg "+TempData.wSubCmdID)
            }
        }
        return true;
    },

    ShowIndexCustom:function(wShowIndex){
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        if(pMsg.wMainCmdID == MDM_GF_GAME){
            if(pMsg.wSubCmdID == GameDef.SUB_S_GAME_START) this.SetCardData();
        }
    },
    ShowEndIndexCustom:function(wShowIndex){
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        if(pMsg.wMainCmdID == MDM_GF_GAME && pMsg.wSubCmdID == GameDef.SUB_S_GAME_END) return
        this.SetUserJet(wShowIndex);
    },

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////  
//私有接口
    SetCardData:function(){
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
    SetUserJet:function(wShowIndex){
        var ScoreArr = new Array();
        for(var i = 0; i<=wShowIndex; i++){
            var pMsg = this.GameData[this.m_PGIndex][i];
            if(pMsg.wMainCmdID != MDM_GF_GAME) continue

            if( pMsg.wSubCmdID == GameDef.SUB_S_GAME_START){
                for(var j = 0; j<=GameDef.GAME_PLAYER; j++){
                    ScoreArr[j] = pMsg.pStruct.cbPlayStatus[j]? pMsg.pStruct.llBaseScore:0;
                }
            }

            if( pMsg.wSubCmdID == GameDef.SUB_S_ADD_SCORE){
                ScoreArr[pMsg.pStruct.wAddScoreUser] += pMsg.pStruct.llAddScoreCount;
            }
        }
      
        for(var i = 0; i<GameDef.GAME_PLAYER; i++){
            if(ScoreArr[i] == 0) continue;
            var ViewID = this.m_GameEngine.SwitchViewChairID(i);
            var score = this.m_GameView.m_lTableScore[ViewID];
            if(score == null) score = 0;
            if(score > ScoreArr[i]) this.m_GameView.UserGetJet(score - ScoreArr[i], ViewID);
            if(score < ScoreArr[i]) this.m_GameView.UserAddJet(ScoreArr[i] - score, ViewID);
        }

    },

    // update (dt) {},
});
