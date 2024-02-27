cc.Class({
    extends: cc.RePlayEngine,

    properties: {

    },

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //调用接口
    CustomGameData:function(GameIndex, TempData, DataIndex){
        switch(TempData.wSubCmdID){
            case GameDef.SUB_S_GAME_START:{
                if(TempData.wChairID != this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_GameStart();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameStart SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_OUT_CARD:{
                TempData.pStruct = GameDef.CMD_S_OutCard();
                gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex);
                TempData.pStruct.cbCardData = new Array(TempData.pStruct.cbCardCount);
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_OutCard SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_PASS_CARD:{
                TempData.pStruct = GameDef.CMD_S_PassCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_PassCard SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_GAME_END:{
                TempData.pStruct = GameDef.CMD_S_GameConclude();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameConclude SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }

            case GameDef.SUB_S_LAND_SCORE:{
                TempData.pStruct = GameDef.CMD_S_CallScore();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_CallScore SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_USER_DOUBLE:{
                TempData.pStruct = GameDef.CMD_S_Double();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_Double SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_GAME_BANKER:{
                TempData.pStruct = GameDef.CMD_S_BankerInfo();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_BankerInfo SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_GAME_OUTCARD:{
                TempData.ByteData = null;
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
          // if(pMsg.wSubCmdID == GameDef.SUB_S_GAME_START && pMsg.wChairID != this.m_GameEngine.GetMeChairID())  this.PlayNext();

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
        this.m_GameView.SetUserState(INVALID_CHAIR);

        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        var pStuck = pMsg.pStruct;
        switch(pMsg.wSubCmdID){
            case GameDef.SUB_S_LAND_SCORE:{
                //效验参数
                var CurScore = this.m_GameView.m_lCellScore.string;
                var wViewChairID = this.m_GameEngine.SwitchViewChairID(pStuck.wCallScoreUser);

                //设置玩家动作
                var CallScore = pStuck.cbUserCallScore;
                if(this.m_GameEngine.m_BankerMode && CallScore == 5) CallScore = pStuck.cbCurrentScore < 1 ? 255 : 6;
                if(this.m_GameEngine.m_BankerMode && CallScore != 6 && CallScore != 255) CallScore =  pStuck.cbCurrentScore <= 1?4:5;

                this.m_GameView.SetUserState(wViewChairID, CallScore);
                break
            }

            case GameDef.SUB_S_PASS_CARD:{
                var ViewID = this.m_GameEngine.SwitchViewChairID(pStuck.wPassCardUser);
                this.m_GameView.SetUserState(ViewID, 'Pass');
                break
            }
            case GameDef.SUB_S_USER_DOUBLE:{
                if(pStuck.wCallUser == INVALID_CHAIR)  break
                var wViewChairID = this.m_GameEngine.SwitchViewChairID(pStuck.wCallUser);

                if(this.m_GameEngine.m_BankerMode){//加倍
                    this.m_GameView.SetUserState(this.m_GameEngine.SwitchViewChairID(pStuck.wCallUser), pStuck.bDouble?'Double':'NoDouble');
                }else{
                    this.m_GameView.SetUserState(this.m_GameEngine.SwitchViewChairID(pStuck.wCallUser), pStuck.bDouble?'Kick':'NoKick');
                    //默认踢
                    if(pStuck.bDouble && pStuck.wCallUser != this.m_GameEngine.m_wBankerUser){
                        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
                            if(i == this.m_GameEngine.m_wBankerUser) continue;
                            this.m_GameView.SetUserState(this.m_GameEngine.SwitchViewChairID(i), 'Kick');
                        }
                    }
                }
                break
            }
        }
    },

    // update (dt) {},
});
