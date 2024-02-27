cc.Class({
    extends: cc.RePlayEngine,

    properties: {

    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //调用接口
    CustomGameData: function (GameIndex, TempData, DataIndex) {
        switch (TempData.wSubCmdID) {
            case GameDef.SUB_S_GAME_START: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break;
                TempData.pStruct = GameDef.CMD_S_GameStart();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("CMD_S_GameStart SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize);
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_TING_TIP: {
                if (TempData.wChairID != this.m_GameBase.InfoHead.wLookChair) break;
                TempData.pStruct = GameDef.CMD_S_TingTipHead();
                // var wOffsket = gCByte.Bytes2Str(pTingTipHead, pData);

                // if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                //     console.error("SUB_S_TING_TIP SizeErr ")
                //     return false;
                // }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize + TempData.pStruct.wItemSize * TempData.pStruct.wCount)
                TempData.fSpeed = 0.01;
                this.GameData[GameIndex].push(TempData);

                // ///////////////////////////////////

                // var pTingTipHead = GameDef.CMD_S_TingTipHead();
                // var wOffset = gCByte.Bytes2Str(pTingTipHead, pData);
                // if((pTingTipHead.wCount * pTingTipHead.wItemSize + wOffset) != wDataSize) {
                //     console.log('(pTingTipHead.wCount * pTingTipHead.wItemSize + wOffset) != wDataSize'
                //     + '【'+
                //         (pTingTipHead.wCount * pTingTipHead.wItemSize + wOffset) + ' != ' + wDataSize
                //     + '】' );
                //     return false;
                // }
                // var TingTipArray = new Array();
                // for(var i = 0; i < pTingTipHead.wCount; ++ i) {
                //     var pTingTip = GameDef.CMD_S_TingTip();
                //     gCByte.Bytes2Str(pTingTip, pData, wOffset + i * pTingTipHead.wItemSize);
                //     TingTipArray.push(pTingTip);
                // }
                // this.SetTingTip(TingTipArray, pTingTipHead.cbCurrentCard, pTingTipHead.bNeedOutCard);

                break;
            }
            case GameDef.SUB_S_TRUSTEE: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_Trustee();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_TRUSTEE SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 0.01;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_USER_TI_CARD: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break;
                TempData.pStruct = GameDef.CMD_S_UserTiCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_USER_TI_CARD SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.5;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_USER_PAO_CARD: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break;
                TempData.pStruct = GameDef.CMD_S_UserPaoCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_USER_PAO_CARD SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.5;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_USER_WEI_CARD: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_UserWeiCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_USER_WEI_CARD SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.5;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_USER_PENG_CARD: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_UserPengCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_USER_PENG_CARD SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.5;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_USER_CHI_CARD: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_UserChiCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_USER_CHI_CARD SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.5;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_OUT_CARD: {
                if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_OutCard();
                // gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex);
                // TempData.pStruct.cbCardData = new Array(TempData.pStruct.cbCardCount);
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("CMD_S_OutCard SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_SEND_CARD: {
                TempData.pStruct = GameDef.CMD_S_SendCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_SEND_CARD SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break
            }

            case GameDef.SUB_S_OPERATE_NOTIFY: {
                // if(TempData.wChairID !=  this.m_GameBase.InfoHead.wLookChair) break
                TempData.pStruct = GameDef.CMD_S_OperateNotify();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_OPERATE_NOTIFY SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break
            }

            case GameDef.SUB_S_OUT_CARD_NOTIFY: {
                break;
                TempData.pStruct = GameDef.CMD_S_OutCardNotify();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_OUT_CARD_NOTIFY SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_CHOU_CARD: {
                break;
                TempData.pStruct = GameDef.CMD_S_ChouCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_CHOU_CARD SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break
            }

            case GameDef.SUB_S_DISCARD_CARD: {
                TempData.pStruct = GameDef.CMD_S_DiscardCard();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("SUB_S_DISCARD_CARD SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            case GameDef.SUB_S_GAME_END: {
                TempData.pStruct = GameDef.CMD_S_GameEnd();
                if (gCByte.Bytes2Str(TempData.pStruct, this.m_PlayData, DataIndex) != TempData.wDataSize) {
                    console.error("CMD_S_GameEnd SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice(DataIndex, DataIndex + TempData.wDataSize)
                TempData.fSpeed = 1.0;
                this.GameData[GameIndex].push(TempData);
                break;
            }

            default: {
                if (window.LOG_NET_DATA) console.log("MDM_GF_GAME skip msg " + TempData.wSubCmdID)
            }
        }
        return true;
    },

    /////////////////////////////////////////////////////////////////////////////

    CustomGameDataParseEnd: function (index) {
        // return;

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

    SetTableCardData: function(TableCardCtrl, cbCardIndex) {
        var cbCardData = new Array(GameDef.MAX_CARD_COUNT);
        var cbCardCount = GameLogic.SwitchToCardData1(cbCardIndex, cbCardData, cbCardData.length);
        TableCardCtrl.SetCardData(cbCardData, cbCardCount, 1, true);
    },

    ShowIndexCustom: function (wShowIndex) {
        return;
        var pData = this.GameData[this.m_PGIndex];
        if (!pData) return;
        var pMsg = pData[wShowIndex];
        if (!pMsg) return;

        if (pMsg.wSubCmdID == GameDef.SUB_S_GAME_START) {

            for(var i = 0; i < GameDef.GAME_PLAYER; ++ i) {
                var wViewID = this.m_GameEngine.SwitchViewChairID(i);
                this.m_GameView.m_TableCardCtrl[wViewID].node.active = (i != this.m_GameBase.InfoHead.wLookChair);
            }

            this.m_GameEngine.m_CardIndexAll = new Array(GameDef.GAME_PLAYER);
            var startData = pMsg.StartCardData;
            for (var i = 0; i < startData.length; i++) {
                var wChairID = startData[i].wChairID;
                var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                this.m_GameEngine.m_CardIndexAll[wChairID] = new Array(GameDef.MAX_INDEX);
                this.m_GameEngine.m_CardIndexAll[wChairID].fill(0);
                this.m_GameEngine.m_CardIndexAll[wChairID] = clone(startData[i].pStruct.cbCardData);
                var cbCardCount = (wChairID == startData[i].pStruct.m_wBankerUser) ? GameDef.MAX_CARD_COUNT : (GameDef.MAX_CARD_COUNT - 1);
                GameLogic.SwitchToCardIndex1(startData[i].pStruct.cbCardData, cbCardCount, this.m_GameEngine.m_CardIndexAll[wChairID]);
                this.SetTableCardData(this.m_GameView.m_TableCardCtrl[wViewID], this.m_GameEngine.m_CardIndexAll[wChairID]);
            }

        } else if (pMsg.wSubCmdID == GameDef.SUB_S_GAME_END) {

        } else if (pMsg.wSubCmdID == GameDef.SUB_S_OUT_CARD) {
            var pOutCard = pMsg.pStruct;
            var wChairID = pOutCard.wOutCardUser;
            if (wChairID != this.m_GameBase.InfoHead.wLookChair) {
                var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                GameLogic.RemoveCard2(this.m_GameEngine.m_CardIndexAll[wChairID], pOutCard.cbOutCardData);
                this.SetTableCardData(this.m_GameView.m_TableCardCtrl[wViewID], this.m_GameEngine.m_CardIndexAll[wChairID]);
            }
        }
        else if (pMsg.wSubCmdID == GameDef.SUB_S_USER_TI_CARD) {
            var pUserTiCard = pMsg.pStruct;
            var wChairID = pUserTiCard.wActionUser;
            if (wChairID != this.m_GameBase.InfoHead.wLookChair) {
                var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                var cbCardList = [pUserTiCard.cbActionCard, pUserTiCard.cbActionCard, pUserTiCard.cbActionCard, pUserTiCard.cbActionCard];
                GameLogic.RemoveCard3(this.m_GameEngine.m_CardIndexAll[wChairID], cbCardList, pUserTiCard.cbRemoveCount);
                this.SetTableCardData(this.m_GameView.m_TableCardCtrl[wViewID], this.m_GameEngine.m_CardIndexAll[wChairID]);
            }
        }

        else if (pMsg.wSubCmdID == GameDef.SUB_S_USER_PAO_CARD) {
            // pUserPaoCard.wActionUser, pUserPaoCard.cbActionCard, pUserPaoCard.cbRemoveCount, pUserPaoCard.cbHuxi

            var pUserPaoCard = pMsg.pStruct;
            var wChairID = pUserPaoCard.wActionUser;
            if (wChairID != this.m_GameBase.InfoHead.wLookChair) {
                var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                var cbCardList = [pUserPaoCard.cbActionCard, pUserPaoCard.cbActionCard, pUserPaoCard.cbActionCard, pUserPaoCard.cbActionCard];
                GameLogic.RemoveCard3(this.m_GameEngine.m_CardIndexAll[wChairID], cbCardList, pUserPaoCard.cbRemoveCount);
                this.SetTableCardData(this.m_GameView.m_TableCardCtrl[wViewID], this.m_GameEngine.m_CardIndexAll[wChairID]);
            }
        }

        else if (pMsg.wSubCmdID == GameDef.SUB_S_USER_WEI_CARD) {
            // pUserWeiCard.wActionUser, pUserWeiCard.cbActionCard, pUserWeiCard.bChou, pUserWeiCard.cbHuxi
            var pUserWeiCard = pMsg.pStruct;
            var wChairID = pUserWeiCard.wActionUser;
            if (wChairID != this.m_GameBase.InfoHead.wLookChair) {
                var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                var cbCardList = [pUserWeiCard.cbActionCard, pUserWeiCard.cbActionCard];
                GameLogic.RemoveCard3(this.m_GameEngine.m_CardIndexAll[wChairID], cbCardList, cbCardList.length);
                this.SetTableCardData(this.m_GameView.m_TableCardCtrl[wViewID], this.m_GameEngine.m_CardIndexAll[wChairID]);
            }

        }

        else if (pMsg.wSubCmdID == GameDef.SUB_S_USER_PENG_CARD) {
            var pUserPengCard = pMsg.pStruct;
            var wChairID = pUserPengCard.wActionUser;
            if (wChairID != this.m_GameBase.InfoHead.wLookChair) {
                var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                var cbCardList = [pUserPengCard.cbActionCard, pUserPengCard.cbActionCard];
                GameLogic.RemoveCard3(this.m_GameEngine.m_CardIndexAll[wChairID], cbCardList, cbCardList.length);
                this.SetTableCardData(this.m_GameView.m_TableCardCtrl[wViewID], this.m_GameEngine.m_CardIndexAll[wChairID]);
            }
        }

        else if (pMsg.wSubCmdID == GameDef.SUB_S_USER_CHI_CARD) {
            var pUserChiCard = pMsg.pStruct;
            var wChairID = pUserChiCard.wActionUser;
            if (wChairID != this.m_GameBase.InfoHead.wLookChair) {
                var wViewID = this.m_GameEngine.SwitchViewChairID(wChairID);
                var cbDebarCard = pUserChiCard.cbActionCard;
                for (var k = 0; k < pUserChiCard.cbResultCount; k++) {
                    for (var l = 0; l < 3; l++) {
                        var cbRemoveCard = pUserChiCard.cbCardData[k][l];
                        if (cbRemoveCard == cbDebarCard) cbDebarCard = 0;
                        else this.m_GameEngine.m_CardIndexAll[wChairID][GameLogic.SwitchToCardIndex(cbRemoveCard)]--;
                    }
                }
                this.SetTableCardData(this.m_GameView.m_TableCardCtrl[wViewID], this.m_GameEngine.m_CardIndexAll[wChairID]);
            }
        }

    },

    ShowEndIndexCustom: function (wShowIndex) {
        var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        //if(pMsg.wMainCmdID == MDM_GF_GAME && pMsg.wSubCmdID == GameDef.SUB_S_GAME_END) return
        this.SetUserState(wShowIndex);
    },

    ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    //私有接口
    SetUserState: function (wShowIndex) {
        // this.m_GameView.SetUserState(INVALID_CHAIR);

        // var pMsg = this.GameData[this.m_PGIndex][wShowIndex];
        // var pStuck = pMsg.pStruct;
        // switch(pMsg.wSubCmdID){

        //     case GameDef.SUB_S_PASS_CARD:{
        //         var ViewID = this.m_GameEngine.SwitchViewChairID(pStuck.wPassUser);
        //         this.m_GameView.SetUserState(ViewID, 'Pass');
        //         break
        //     }
        // }
    },
});
