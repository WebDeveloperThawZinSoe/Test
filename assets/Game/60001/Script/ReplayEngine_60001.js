cc.Class({
    extends: cc.RePlayEngine,

    properties: {

    },

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//调用接口
    CustomGameData:function(GameIndex, TempData, DataIndex){
        switch(TempData.wSubCmdID){
            case GameDef.SUB_S_GAME_START:{
                //if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_GameStart();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameStart SizeErr ")
                    return false;
                }
                if(this.m_GameBase.InfoHead.wLookChair == null) this.m_GameBase.InfoHead.wLookChair = 0;
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
                TempData.pStruct = GameDef.CMD_S_GameEnd();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_GameEnd SizeErr ")
                    return false;
                }
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

    CustomGameDataParseEnd: function (index) {
        var StartCardData = new Array();
        for (var i = 0; i < this.GameData[index].length; i++) {
            if (this.GameData[index][i].wSubCmdID == GameDef.SUB_S_GAME_START) {
                if (this.m_GameBase.InfoHead.wLookChair == this.GameData[index][i].wChairID) {
                    this.GameData[index][i].StartCardData = StartCardData;
                    StartCardData.push(this.GameData[index][i]);
                } else {
                    StartCardData.push(this.GameData[index][i]);
                }
            }
        }

        for (var i = 0; i < this.GameData[index].length;) {
            if (this.GameData[index][i].wSubCmdID == GameDef.SUB_S_GAME_START &&
                this.m_GameBase.InfoHead.wLookChair != this.GameData[index][i].wChairID) {
                this.GameData[index].splice(i, 1);
            } else {
                i++
            }
        }
    },

    ShowIndexCustom:function(wShowIndex){
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        if(pMsg.wMainCmdID == MDM_GF_GAME){
	        if(pMsg.wSubCmdID == GameDef.SUB_S_GAME_START) {
                this.m_GameEngine.m_CardDataAll = new Array(GameDef.GAME_PLAYER);
                this.m_GameEngine.m_CardCountAll = new Array(GameDef.GAME_PLAYER);

                var startData = pMsg.StartCardData;
                for (var i = 0; i < startData.length; i++) {
                    var wChairID = startData[i].wChairID;
                    var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                    this.m_GameEngine.m_CardCountAll[wChairID] = GameDef.GetMaxCardCount(this.m_GameEngine.m_dwRules);
                    this.m_GameEngine.m_CardDataAll[wChairID] = clone(startData[i].pStruct.cbCardData);
                    GameLogic.SortCardList(this.m_GameEngine.m_CardDataAll[wChairID], this.m_GameEngine.m_CardCountAll[wChairID]);
                    this.m_GameView.m_UserCardCtrl[wViewID].SetCardData(this.m_GameEngine.m_CardDataAll[wChairID], this.m_GameEngine.m_CardCountAll[wChairID]);
                }
            } else if(pMsg.wSubCmdID == GameDef.SUB_S_OUT_CARD) {
                var pOutCard = pMsg.pStruct;
                var wOutUser = pOutCard.wOutCardUser;
                if (wOutUser != this.m_GameBase.InfoHead.wLookChair) {
                    var wViewID = this.m_GameEngine.SwitchViewChairID(wOutUser);
                    GameLogic.RemoveCardList(pOutCard.cbCardData, pOutCard.cbCardCount, this.m_GameEngine.m_CardDataAll[wOutUser], this.m_GameEngine.m_CardCountAll[wOutUser]);
                    this.m_GameEngine.m_CardCountAll[wOutUser] -= pOutCard.cbCardCount;
                    this.m_GameView.m_UserCardCtrl[wViewID].SetCardData(this.m_GameEngine.m_CardDataAll[wOutUser], this.m_GameEngine.m_CardCountAll[wOutUser]);
                }
            }
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
            case GameDef.SUB_S_PASS_CARD:{
                var ViewID = this.m_GameEngine.SwitchViewChairID(pStuck.wPassUser);
                this.m_GameView.SetUserState(ViewID, 'Pass');
                break
            }
        }
    },

    // update (dt) {},
});
