var enXLeft = 1; //左对齐
var enXCenter = 2; //中对齐
var enXRight = 3; //右对
cc.Class({
    extends: cc.RePlayEngine,

    properties: {

    },

    ctor: function () {
        this.m_HandCard = new Array();
        this.m_HandCardCopy = new Array();
        this.m_HandCnt = new Array();
        this.m_HandCtrl = new Array();
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
                if (this.m_HandCardCopy[GameIndex] == null) {
                    this.m_HandCardCopy[GameIndex] = new Array();
                    this.m_HandCnt[GameIndex] = new Array();
                }
                this.m_HandCardCopy[GameIndex][TempData.wChairID] = TempData.pStruct.cbCardData;
                this.m_HandCnt[GameIndex][TempData.wChairID] = this.m_HandCardCopy[GameIndex][TempData.wChairID].length;
                if(this.m_GameBase.InfoHead.wLookChair == null) this.m_GameBase.InfoHead.wLookChair = 0;
                if (TempData.wChairID != this.m_GameBase.InfoHead.wLookChair) {
                    return true;
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
            case GameDef.SUB_S_USER_SHOWCARD:{
                TempData.pStruct = GameDef.CMD_S_ShowCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_ShowCard SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break;
            }
            case GameDef.SUB_S_USER_LETCARD:{
                TempData.pStruct = GameDef.CMD_S_LetCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("CMD_S_LetCard SizeErr ")
                    return false;
            }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
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
          // if(pMsg.wSubCmdID == GameDef.SUB_S_GAME_START && pMsg.wChairID != this.m_GameEngine.GetMeChairID())  this.PlayNext();
          this.m_GameView.HideAllGameButton();
          if (pMsg.wSubCmdID == GameDef.SUB_S_GAME_START) {
              this.resetView();
            //   this.scheduleOnce(this.SetStartView, 3);
              this.SetStartView();
          }
          if (pMsg.wSubCmdID == GameDef.SUB_S_OUT_CARD) {
              this.DelHandCard(pMsg.pStruct);
          }
          if (pMsg.wSubCmdID == GameDef.SUB_S_GAME_BANKER) {
              if (!(this.m_GameEngine.m_dwRules & GameDef.GAME_TYPE_ENABLE_DOUBLE))
                  this.SetBankView(pMsg.pStruct);
          }
          if (pMsg.wSubCmdID == GameDef.SUB_S_USER_DOUBLE) {
              if (pMsg.pStruct.bStartPlay)
                  this.SetBankView(pMsg.pStruct);
          }
          if (pMsg.wSubCmdID == GameDef.SUB_S_PASS_CARD) {
              if (pMsg.pStruct.wPassCardUser == this.m_GameEngine.GetMeChairID()) {
                  this.m_GameView.SetUserState(GameDef.MYSELF_VIEW_ID, 'SelfNoHave');
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
resetView: function () {
    this.unschedule(this.SetStartView);

    for (var i = 0; i < GameDef.GetMaxPlayerCount(); i++) {

        if (this.m_HandCtrl[i]) {
            if (this.m_HandCtrl[i].node) this.m_HandCtrl[i].node.removeFromParent(true);
            this.m_HandCtrl[i] = null;
        }
        this.m_HandCtrl[i] = cc.instantiate(this.m_GameView.m_CardCtrlPrefab).getComponent('CardCtrl_40107');
        this.m_GameView.m_cardNode.addChild(this.m_HandCtrl[i].node);
        this.m_HandCtrl[i].SetScale(0.35);
    }
    if(GameDef.GetMaxPlayerCount()==2){

        this.m_HandCtrl[0].SetCardDistance(100);
        this.m_HandCtrl[0].SetScale(0.30);

        this.m_HandCtrl[0].SetBenchmarkPos(380, 135, enXRight);
        this.m_HandCtrl[1].SetBenchmarkPos(-50, -1300, enXLeft);
        this.m_GameView.m_UserCardControl[0].SetBenchmarkPos(300, 28, enXRight);
        this.m_GameView.m_UserCardControl[1].SetBenchmarkPos(-311, -120, enXLeft);
    } else {
        this.m_HandCtrl[0].SetBenchmarkPos(-357, -3, enXLeft);
        this.m_HandCtrl[1].SetBenchmarkPos(-50, -1300, enXLeft);
        this.m_HandCtrl[2].SetBenchmarkPos(467, 227, enXRight);

        this.m_GameView.m_UserCardControl[0].SetBenchmarkPos(-350, 107, enXLeft);
        this.m_GameView.m_UserCardControl[1].SetBenchmarkPos(-311, -120, enXLeft);
        this.m_GameView.m_UserCardControl[2].SetBenchmarkPos(295, 113, enXRight);
    }

    this.m_Hook.m_BtNext.interactable = false;
},

SetStartView: function () {
    this.m_HandCard = JSON.parse(JSON.stringify(this.m_HandCardCopy));
    for (var i =0;i<GameDef.GetMaxPlayerCount();i++) {
        this.m_HandCnt[this.m_PGIndex][i] = GameDef.NORMAL_COUNT;
        this.m_GameEngine.m_GameLogic.SortCardList(this.m_HandCard[this.m_PGIndex][i], this.m_HandCard[this.m_PGIndex][i].length);
        this.m_HandCtrl[this.m_GameEngine.SwitchViewChairID(i)].SetCardData(this.m_HandCard[this.m_PGIndex][i], this.m_HandCard[this.m_PGIndex][i].length);
    }
    this.m_Hook.m_BtNext.interactable = true;
},

SetBankView: function (cmd) {
    var wChair = this.m_GameEngine.m_wBankerUser;
    var wView = this.m_GameEngine.SwitchViewChairID(wChair);

    this.m_HandCard[this.m_PGIndex][wChair] = this.m_HandCard[this.m_PGIndex][wChair].concat(
        cmd.cbBankerCard);
    this.m_HandCnt[this.m_PGIndex][wChair] += GameDef.BACK_COUNT;

    this.m_GameEngine.m_GameLogic.SortCardList(this.m_HandCard[this.m_PGIndex][wChair],
        this.m_HandCnt[this.m_PGIndex][wChair]);
    this.m_HandCtrl[wView].SetCardData(this.m_HandCard[this.m_PGIndex][wChair],
        this.m_HandCnt[this.m_PGIndex][wChair]);
},

DelHandCard: function (cmd) {
    //获取扑克
    var cbCardData = cmd.cbCardData;
    var cbCardCount = cmd.cbCardCount;

    //排列扑克
    var wChairID = cmd.wOutCardUser;

    this.m_GameEngine.m_GameLogic.SortCardList(cbCardData, cbCardCount);

    if (!this.m_GameEngine.m_GameLogic.RemoveCardList(cbCardData, cbCardCount,
            this.m_HandCard[this.m_PGIndex][wChairID], this.m_HandCnt[this.m_PGIndex][wChairID])) {
        return false;
    }
    this.m_HandCnt[this.m_PGIndex][wChairID] -= cbCardCount;

    if (cmd.wOutCardUser == this.m_GameEngine.GetMeChairID()) {
        this.m_GameView.m_UserCardControl[GameDef.MYSELF_VIEW_ID].SetCardData(
            cbCardData, cbCardCount);
        this.m_GameView.m_HandCardCtrl.SetCardData(this.m_HandCard[this.m_PGIndex][wChairID],
            this.m_HandCnt[this.m_PGIndex][wChairID]);
    } else {
        var wView = this.m_GameEngine.SwitchViewChairID(wChairID);
        this.m_HandCtrl[wView].SetCardData(this.m_HandCard[this.m_PGIndex][wChairID],
            this.m_HandCnt[this.m_PGIndex][wChairID]);
    }
},

SetUserState: function (wShowIndex) {
    this.m_GameView.SetUserState(INVALID_CHAIR);

    var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
    var pStuck = pMsg.pStruct;
    switch (pMsg.wSubCmdID) {
        case GameDef.SUB_S_LAND_SCORE:
            {
                //效验参数
                var CurScore = this.m_GameView.m_lCellScore.string;
                var wViewChairID = this.m_GameEngine.SwitchViewChairID(pStuck.wCallScoreUser);

                //设置玩家动作
                var CallScore = pStuck.cbUserCallScore;
                if (this.m_GameEngine.m_BankerMode && CallScore == 5) CallScore = pStuck.cbCurrentScore < 1 ? 255 : 6;
                if (this.m_GameEngine.m_BankerMode && CallScore != 6 && CallScore != 255) CallScore = pStuck.cbCurrentScore <= 1 ? 4 : 5;

                this.m_GameView.SetUserState(wViewChairID, CallScore);
                break
            }

        case GameDef.SUB_S_PASS_CARD:
            {
                var ViewID = this.m_GameEngine.SwitchViewChairID(pStuck.wPassCardUser);
                this.m_GameView.SetUserState(ViewID, 'Pass');
                break
            }
        case GameDef.SUB_S_USER_DOUBLE:
            {
                if (pStuck.wCallUser == INVALID_CHAIR) break
                var wViewChairID = this.m_GameEngine.SwitchViewChairID(pStuck.wCallUser);

                if (this.m_GameEngine.m_BankerMode) { //加倍
                    this.m_GameView.SetUserState(this.m_GameEngine.SwitchViewChairID(pStuck.wCallUser), pStuck.bDouble ? 'Double' : 'NoDouble');
                } else {
                    this.m_GameView.SetUserState(this.m_GameEngine.SwitchViewChairID(pStuck.wCallUser), pStuck.bDouble ? 'Double' : 'NoDouble');
                    //默认踢
                    // if (pStuck.bDouble && pStuck.wCallUser != this.m_GameEngine.m_wBankerUser) {
                    //     for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                    //         if (i == this.m_GameEngine.m_wBankerUser) continue;
                    //         this.m_GameView.SetUserState(this.m_GameEngine.SwitchViewChairID(i), 'Double');
                    //     }
                    // }
                }
                break
            }
    }
},

    // update (dt) {},
});
