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
                    console.error("SUB_S_GAME_START SizeErr ")
                    return false;
                }

                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }

            // case GameDef.SUB_S_SHOW_ALONE:{
            //    TempData.pStruct = GameDef.CMD_S_MESSAGE();
            //     if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
            //         console.error("SUB_S_SHOW_ALONE SizeErr ")
            //         return false;
            //     }
            //     TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
            //     this.GameData[GameIndex].push(TempData);
            //     break
            // }
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
            case GameDef.SUB_S_DIVEDEGROUP:{
                TempData.pStruct = GameDef.CMD_S_DivideGroup();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_DIVEDEGROUP SizeErr ")
                    return false;
                }
                if(TempData.pStruct.wChairID == INVALD_CHAIR)  break;
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            // case GameDef.SUB_S_SHOWDIRECTION:{
            //     TempData.pStruct = GameDef.CMD_S_MESSAGE();
            //     if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
            //         console.error("SUB_S_SHOWDIRECTION SizeErr ")
            //         return false;
            //     }
            //     TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
            //     this.GameData[GameIndex].push(TempData);
            //     break
            // }
            // case GameDef.SUB_S_SHOWCARDOPERATOR:{
            //     TempData.pStruct = GameDef.CMD_S_MESSAGE();
            //     if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
            //         console.error("SUB_S_SHOWCARDOPERATOR SizeErr ")
            //         return false;
            //     }
            //     TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
            //     this.GameData[GameIndex].push(TempData);
            //     break
            // }
            // case GameDef.SUB_S_SENDHINTMESSAGE:{
            //     TempData.pStruct = GameDef.CMD_S_MESSAGE();
            //     if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
            //         console.error("SUB_S_SENDHINTMESSAGE SizeErr ")
            //         return false;
            //     }
            //     TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
            //     this.GameData[GameIndex].push(TempData);
            //     break
            // }
            case GameDef.SUB_S_CLEANSHOWCARD:{
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }

            case GameDef.SUB_S_SHOW_CARD:{
                TempData.pStruct = GameDef.CMD_S_ShowCard();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_SHOW_CARD SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_UPDATEAWARD:{
                TempData.pStruct = GameDef.CMD_S_UpdataAward();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_UPDATEAWARD SizeErr ")
                    return false;
                }
                TempData.ByteData = this.m_PlayData.slice( DataIndex , DataIndex + TempData.wDataSize)
                this.GameData[GameIndex].push(TempData);
                break
            }
            case GameDef.SUB_S_CONTROLLIGHT:{
                TempData.pStruct = GameDef.CMD_S_MESSAGE();
                if(gCByte.Bytes2Str(TempData.pStruct , this.m_PlayData, DataIndex) != TempData.wDataSize){
                    console.error("SUB_S_CONTROLLIGHT SizeErr ")
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
            default:{
                if(window.LOG_NET_DATA)console.log("MDM_GF_GAME skip msg "+TempData.wSubCmdID)
            }
        }
        return true;
    },
    CustomGameDataParseEnd:function(index){
    /*    for (var i = 0; i < this.GameData[index].length; ){
            if( this.GameData[index][i].wSubCmdID == GameDef.SUB_S_SEND_CARD && this.GameData[index][i-1] != null ){
                if( this.GameData[index][i-1].UpdateCard == null ){
                    this.GameData[index][i-1].UpdateCard = new Array();
                }
                if( this.GameData[index][i].UpdateCard != null ){
                    for (var j = 0; j < this.GameData[index][i].UpdateCard.length; j++) {
                        this.GameData[index][i-1].UpdateCard.push(this.GameData[index][i].UpdateCard[j]);
                    }
                }
                this.GameData[index][i-1].UpdateCard.push(this.GameData[index][i]);
                this.GameData[index].splice(i,1);
            }else{
                i++
            }

        }*/
        var SelfStartIndex = -1;
        var StartCardData = new Array();
        var GroupValue=new Array();
        for (var i = 0; i < this.GameData[index].length;i++ ){
            if( this.GameData[index][i].wSubCmdID == GameDef.SUB_S_SEND_CARD){
                console.log(this.GameData[index][i]);
                if( this.m_GameBase.InfoHead.wLookChair == this.GameData[index][i].wChairID ){
                    this.GameData[index][i].StartCardData = StartCardData;
                }else{
                    StartCardData.push(this.GameData[index][i]);
                }
            }
            if(this.GameData[index][i].wSubCmdID==GameDef.SUB_S_DIVEDE_GROUP){
                if( this.m_GameBase.InfoHead.wLookChair == this.GameData[index][i].wChairID ){
                    this.GameData[index][i].pStruct.bArrayDivideGroup = GroupValue;
                }else{
                    GroupValue.push(this.GameData[index][i]);
                }
            }
        }


        for (var i = 0; i < this.GameData[index].length; ){
            if( this.GameData[index][i].wSubCmdID == GameDef.SUB_S_SEND_CARD &&
                this.m_GameBase.InfoHead.wLookChair != this.GameData[index][i].wChairID){
                this.GameData[index].splice(i,1);
            }else{
                i++
            }
        }

        for (var i = 0; i < this.GameData[index].length; ){
            console.log("this.GameData[index][i].wSubCmdID",this.GameData[index][i].wSubCmdID);
            if( this.GameData[index][i].wSubCmdID == GameDef.SUB_S_DIVEDE_GROUP &&
                this.m_GameBase.InfoHead.wLookChair != this.GameData[index][i].wChairID){
                this.GameData[index].splice(i,1);
            }else{
                i++
            }
        }

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
        console.log("私有接口");
       var pData = this.GameData[this.m_PGIndex];
        for(var i = 0; i<pData.length; i++){
            if( pData[i].wSubCmdID == GameDef.SUB_S_SEND_CARD){
                console.log(pData[i]);
            }

        }

    }

     /*  this.m_GameClientView.m_MyCardCtrl.m_Card[0].getComponent('CardPrefab').SetData(CMD.cbCardData[0]);
       var index = 1;
       var count = parseInt(CMD.cbcount);
       this.schedule(function () {
           var CardPrefab = cc.instantiate(this.m_GameClientView.m_MyCardCtrl.m_Card[0].node);
           CardPrefab.getComponent('CardPrefab').SetData(CMD.cbCardData[index]);
           this.m_GameClientView.m_MyCardCtrl.m_Card[0].node.parent.addChild(CardPrefab);
           this.m_GameClientView.m_MyCardCtrl.m_Card[index] = CardPrefab.getComponent('CardPrefab');
           index++;
           cc.gSoundRes.PlaySound('sendcard');
       }, 0.05*/

       /* for(var i = 0; i<pData.length; i++){
            if( pData[i].wSubCmdID == GameDef.SUB_S_SEND_CARD){
                for (var j = 0; j < GameDef.GAME_PLAYER; j++) {
                    if(pData[i].pStruct.cbPlayStatus[j] == 0) continue
                    var ViewID = this.m_GameEngine.SwitchViewChairID(j);
                   // this.m_GameView.m_UserCardControl[ViewID].SetCardData([0,0,0], GameDef.MAX_COUNT);
                      this.m_GameView.m_MyCardCtrl.setCard(pData[i].pStruct.cbListCardData)
                }
            }*/
          /*  if( pData[i].wSubCmdID == GameDef.SUB_S_LOOK_CARD){
                if( pData[i].pStruct.cbCardData[0] != 0){
                    var ViewID = this.m_GameEngine.SwitchViewChairID(pData[i].pStruct.wLookCardUser);
                    this.m_GameView.m_UserCardControl[ViewID].SetCardData(pData[i].pStruct.cbCardData, GameDef.MAX_COUNT);
                }
            }*/
            /*if( pData[i].wSubCmdID == GameDef.SUB_S_GAME_END){
                for (var j = 0; j < GameDef.GAME_PLAYER; j++) {
                    var ViewID = this.m_GameEngine.SwitchViewChairID(j);
                    var card = pData[i].pStruct.cbCardData.slice(j*GameDef.MAX_COUNT, j*GameDef.MAX_COUNT+GameDef.MAX_COUNT);
                    if( card[0] != 0) this.m_GameView.m_UserCardControl[ViewID].SetCardData(card, GameDef.MAX_COUNT);
                }
            }*/
        //}
   // },

    // update (dt) {},
});
