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
                if(TempData.wChairID != this.m_GameBase.InfoHead.wLookChair)  break;
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_SHOW_CARD:{
                TempData.pStruct = GameDef.CMD_S_ShowCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_ShowCard SizeErr ")
                    return false;
                }
                //if(TempData.pStruct.wCurrentUser != this.m_GameBase.InfoHead.wLookChair)  break;
                if(TempData.pStruct.cbFrontCard[0] == 0)  break;
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_COMPARE_CARD:{
                TempData.pStruct = GameDef.CMD_S_CompareCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_COMPARE_CARD SizeErr ")
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
            case GameDef.SUB_S_CUT_USER:{
                TempData.pStruct = GameDef.CMD_S_CutUser();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_CUT_USER SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_CUT_CARD:{
                TempData.pStruct = GameDef.CMD_S_CutCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_CUT_CARD SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_OP_ROBE_BANK:{
                TempData.pStruct = null;
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_ROBE_BANK:{
                TempData.pStruct = GameDef.CMD_S_RobeBank();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_ROBE_BANK SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_ROBE_RES:{
                TempData.pStruct = GameDef.CMD_S_RobeResult();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_ROBE_RES SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_AUTO_PUT:{
                TempData.pStruct = GameDef.CMD_S_AutoPut();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_AUTO_PUT SizeErr ")
                    return false;
                }
                if(TempData.wChairID != this.m_GameBase.InfoHead.wLookChair)  break;
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            default:{
                if(window.LOG_NET_DATA)console.log("MDM_GF_GAME skip msg "+TempData.wSubCmdID)
            }
        }
        return true;
    },

    ShowIndexCustom:function(wShowIndex){
        return
    },
    ShowEndIndexCustom:function(wShowIndex){
        var pData = this.GameData[this.m_PGIndex];
        var pMsg = pData[wShowIndex];
        return
    },

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//私有接口


    // update (dt) {},
});
