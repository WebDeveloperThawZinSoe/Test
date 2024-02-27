var QueueEngine = require('QueueEngine');
var CGameLogic = require("GameLogic_50000");


cc.Class({
    extends: cc.GameEngine,

    properties: {

    },

    start: function () {
        this.Queue = new QueueEngine();
        this.m_GameLogic = new CGameLogic();    //游戏逻辑
    },
    ctor: function () {
        this.m_SoundArr = new Array(
            ['BGM', 'BGM'], //.mp3
            ['GAME_OVER', 'gameover'],
            ['GAME_WIN', 'gamewin'],
            ['CARD_CLOSE', 'carderclose'],
            ['CARD_OPEN', 'carderopen'],
            ['PK', 'pk'],
            ['PKBG', 'sd'],
            ['M_READY', 'm/zhunbei'],
            ['W_READY', 'w/zhunbei'],
            ['LEFT_WARN','LEFT_WARN'],
            ['M_BUYAO','m/buyao'],
            ['W_BUYAO','w/buyao'],
            ['M_ZHADAN','m/zhadan'],
            ['W_ZHADAN','w/zhadan'],
            ['M_LIANDUI','m/liandui'],
            ['W_LIANDUI','w/liandui'],
            ['M_FEIJI','m/feiji'],
            ['W_FEIJI','w/feiji'],
        );

        for (var i = 1; i < 16; ++i)
            this.m_SoundArr[this.m_SoundArr.length] = [''+i, ''+i]; //+'.mp3'

        for (var i = 21; i < 30; ++i)
            this.m_SoundArr[this.m_SoundArr.length] = [''+i, ''+i]; //+'.mp3'

        for (var i = 210; i < 214; ++i)
            this.m_SoundArr[this.m_SoundArr.length] = [''+i, ''+i]; //+'.mp3'

        this.m_DoubleSound = new Array( '0', '21', '22', '23', '24', '25', '26', '27', '28', '29', '210', '211', '212', '213', '0', '0', );

        for (var i = 0; i < 5; ++i) {
            this.m_SoundArr[this.m_SoundArr.length] = ['M_' + i, 'act_m' + i]; //+'.mp3'
            this.m_SoundArr[this.m_SoundArr.length] = ['W_' + i, 'act_w' + i];
        }
        //短语声音
        for (var i = 1; i <= 14; ++i) {
            var FileName = i < 10 ? '0' + i : i;
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_m' + i, 'm/phrase/' + FileName];
            this.m_SoundArr[this.m_SoundArr.length] = ['Phrase_w' + i, 'w/phrase/' + FileName];
        }

        this.ClientCardData = new Array(4);
        for (var i in this.ClientCardData) {
            this.ClientCardData[i] = new Array(GameDef.MAX_COUNT);
        }

        this.m_szText = new Array(
            '各位观众，我要开牌了',
            '时间就是金钱，我的朋友',
            '我是庄家来点刺激的吧',
            '下的多吃火锅，下的少吃水饺',
            '一点小钱，拿去喝茶吧',
            '有没有天理，有没有王法，这牌也输',
            '哎哟我滴吗呀'
        );

        this.HintMessage = [
            'Tguize', //提示
            'Tdayu',//没有牌大过上家
            'Tdaguo',//牌必须大过上家
            'Tfenhuo',//分伙
        ];

        this.Winorder = [
            'yiyou',
            'eryou',
            'sanyou',
            'xitongliangpai',
        ];
        //游戏变量
        this.wCurrentBanker = 0;
        this.EndInfoArray = new Array(9);
        this.m_cbTrustee = new Array();
        this.m_viewID = INVALID_CHAIR;
        this.time = 15;
        this.m_bPlayStatus = new Array(4);
        this.m_ChairCtrl = new Array();
        this.m_Banker=INVALID_CHAIR;
        return;
    },

    //网络消息
    OnEventGameMessage: function (wSubCmdID, pData, wDataSize) {
        switch (wSubCmdID) {
            case GameDef.SUB_S_SEND_SECONDS: //倒计时
                    return this.OnSubTimerSeconds(pData, wDataSize);
            case GameDef.SUB_S_GAME_START://游戏开始
                    return this.OnSubGameStart(pData, wDataSize);
            case GameDef.SUB_S_SHOW_ALONE://独牌
                    return this.OnShowAloneButton(pData, wDataSize);
            case GameDef.SUB_S_SEND_CARD: //发牌
                    return this.OnSendCardData(pData, wDataSize);
            case GameDef.SUB_S_DIVEDEGROUP: //发牌
                    return this.OnShowDivideGroup(pData, wDataSize);
            case GameDef.SUB_S_SHOWDIRECTION://显示方向
                    return this.OnShowDirection(pData, wDataSize);
            case GameDef.SUB_S_SHOWCARDOPERATOR://出牌操作
                    return this.OnShowCardOperator(pData,wDataSize);
            case GameDef.SUB_S_SENDHINTMESSAGE: //发送提示
                    return this.OnSendHintMessage(pData, wDataSize);
            case GameDef.SUB_S_CLEANSHOWCARD://清空牌堆
                     return this.OnCleanShowCard(pData, wDataSize);
            case GameDef.SUB_S_SHOW_CARD:   //出牌
                     return this.OnShowCardData(pData, wDataSize);
            case GameDef.SUB_S_UPDATEAWARD: //更新奖分
                     return this.OnUpdataAwardScore(pData, wDataSize);
            case GameDef.SUB_S_CONTROLLIGHT:
                     return this.OnControlPassLight(pData, wDataSize);
            case GameDef.SUB_S_GAME_END:
                     return this.OnSubGameConclude(pData, wDataSize);
            case GameDef.SUB_S_GETROOMENDDATA:
                     return this.OnGetRooMEndData(pData, wDataSize);
            case GameDef.SUB_S_HINK_CARD:
                      return this.OnHinkCard(pData, wDataSize);
            case GameDef.SUB_S_LIGHTWINSEQUE:
                     return this.OnLightWinSqeue(pData, wDataSize);
            case GameDef.SUB_S_LOOKTEAMCARD:
                     return this.OnLookTeamCard(pData, wDataSize);
            case GameDef.SUB_S_SHOWCHICKCARD:
                     return this.OnShowChickCard(pData, wDataSize);
            case GameDef.SUB_S_TRUSTEE: // 玩家托管
                     return this.OnSubTrustee(pData, wDataSize);

        }
        return true;
    },

    //看队友牌
    OnLookTeamCard(pData, wDataSize){
        var CMD = GameDef.CMD_S_SendCard();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        this.m_GameClientView.m_MyCardCtrl.m_Card[0].node.getComponent('CardPrefab_50000').SetData( CMD.cbCardData[0]);
        this.m_GameClientView.m_MyCardCtrl.m_Card[0] = this.m_GameClientView.m_MyCardCtrl.m_Card[0].node.getComponent('CardPrefab_50000')
        for(var i=1;i<CMD.cbcount;i++){
            var CardNode= cc.instantiate(this.m_GameClientView.m_MyCardCtrl.m_Card[0].node);
            CardNode.getComponent('CardPrefab_50000').SetData( CMD.cbCardData[i]);
            this.m_GameClientView.m_MyCardCtrl.m_Card[0].node.parent.addChild(CardNode);
            this.m_GameClientView.m_MyCardCtrl.m_Card[i] = CardNode.getComponent('CardPrefab_50000');
        }
        //允许点牌
        this.m_GameClientView.m_MyCardCtrl.m_TouchLock = false;
        return true;
    },

    //亮出牌顺序
    OnLightWinSqeue(pData, wDataSize){
        var CMD = GameDef.CMD_S_MESSAGE();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        var view=this.SwitchViewChairID(CMD.wChair);
        this.m_GameClientView.m_UserInfo[view].$('Sqeue@Sprite').spriteFrame=this.m_GameClientView.m_Atlas.getSpriteFrame(this.Winorder[CMD.cbValue]);
        this.m_GameClientView.m_UserInfo[view].$('Sqeue').active=true;
        if(this.GetMeChairID()==CMD.wChair){
            if(CMD.block) this.m_GameClientView.$('GameButton/OnShowCard').active=true;
            this.m_GameClientView.$('GameButton/OnLoadLabel@Label').string='等待中';
            this.m_GameClientView.$('GameButton/OnLoadLabel').active=true;
        }
        return true;
    },

    //更新奖分
    OnUpdataAwardScore(pData, wDataSize){
        var CMD = GameDef.CMD_S_UpdataAward();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        var viewID=this.SwitchViewChairID(CMD.wChair);
        this.m_GameClientView.m_UserInfo[viewID].$('ScoreTitle/Award@Label').string= Score2Str(CMD.llArrayawardScore[CMD.wChair]);
        //this.m_GameClientView.m_UserInfo[viewID].$('ScoreTitle/Award@Label').string= CMD.llArrayawardScore[CMD.wChair];
        var move = cc.instantiate(this.m_GameClientView.m_UserInfo[viewID].$('Movenode'));
        move.getComponent('cc.Label').string= Score2Str(CMD.llArratAddScore[CMD.wChair]);
        move.setPosition(cc.v2(0, 40));
        this.m_GameClientView.m_UserInfo[viewID].$('Movenode').parent.addChild(move);
        move.active = true;
        var action = cc.sequence(cc.moveTo(0.2,cc.v2(0, 70)), cc.delayTime(3), cc.removeSelf(true));
        move.runAction(action);
       // this.m_GameClientView.m_SoundCom.getComponent(cc.AudioSource).play();
        return true;
    },

     //出牌
     OnShowCardData: function (pData, wDataSize) {
        var CMD = GameDef.CMD_S_ShowCard();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        //关闭出牌按钮
        this.m_GameClientView.$('GameButton/Opera/Hint').active=false;
        this.m_GameClientView.$('GameButton/Opera/Show').active=false;
        this.m_GameClientView.$('GameButton/Opera/Pass').active=false;
        var viewID = this.SwitchViewChairID(CMD.wChair);
        //去掉出牌时间
        this.m_GameClientView.$('ClockNode/Clock_'+viewID).active =false;
        this.unschedule(this.SetTime);
        //出牌玩家显示出的牌
        this.m_GameClientView.m_CardCtrl[viewID].AddChildCard(CMD.cbCardData, CMD.cbCount, viewID);

        var kernel = gClientKernel.get();
        if(kernel.IsLookonMode())
            this.m_GameClientView.m_UserInfo[viewID].$('Pass').active=false;

        //重新赋值剩下的手牌
        if ((viewID == GameDef.MYSELF_VIEW_ID) &&  (!kernel.IsLookonMode())) {
            this.m_GameClientView.m_MyCardCtrl.ClearSetCard(CMD.cbRecarddata, CMD.cbRecount);
            for(var i =0; i < CMD.cbRecount;i++)
            {
                if(this.m_GameClientView.m_MyCardCtrl.m_Card[i].GetData()==CMD.cbchicken)
                   this.m_GameClientView.m_MyCardCtrl.m_Card[i].SetColor();
            }
        }

        if( this.m_ReplayMode ){
            this.m_GameClientView.m_RePlayCardNode.active=true;
            this.m_GameClientView.m_RePlayCard[viewID].ClearSetCard(CMD.cbRecarddata, CMD.cbRecount)
        }


        if(CMD.wFriend==this.GetMeChairID() && CMD.bLook){
            this.m_GameClientView.m_MyCardCtrl.ClearSetCard(CMD.cbRecarddata, CMD.cbRecount);
            this.m_GameClientView.m_MyCardCtrl.m_TouchLock = false;
            for(var i =0; i < CMD.cbRecount;i++)
            {
                if(this.m_GameClientView.m_MyCardCtrl.m_Card[i].GetData()==CMD.cbchicken)
                   this.m_GameClientView.m_MyCardCtrl.m_Card[i].SetColor();
            }
        }
        //this.m_GameClientView.m_UserInfo[viewID].$('Count/Label@Label').string = CMD.cbRecount;
        //小于5张提示
        if (CMD.cbRecount < 5 && viewID!=GameDef.MYSELF_VIEW_ID) {
            //cc.gSoundRes.PlayGameSound('warning');
            cc.gSoundRes.PlayGameSound('LEFT_WARN');
            this.m_GameClientView.m_UserInfo[viewID].m_warning.node.active = true;
            this.m_GameClientView.m_UserInfo[viewID].m_warning.playAnimation('newAnimation', 0);
            this.m_GameClientView.m_UserInfo[viewID].$('Count').active=true;
            this.m_GameClientView.m_UserInfo[viewID].$('Count/Label@Label').string = CMD.cbRecount;
            if (CMD.cbRecount == 0) {
                this.m_GameClientView.m_UserInfo[viewID].$('Count/Label@Label').string = "";
                this.m_GameClientView.m_UserInfo[viewID].$('Count').active=false;
                this.m_GameClientView.m_UserInfo[viewID].m_warning.node.active = false;
            }
        }
        var typevalue = parseInt(CMD.cbCardtype);
        // if (typevalue == 11) typevalue = 10;
        // if (typevalue == 20) typevalue = 19;
         //如果是炸弹显示炸弹特效
        if (typevalue > 14) {
            //cc.gSoundRes.PlayGameSound('W_ZHADAN');
            //this.m_GameClientView.m_boom.getComponent(cc.Animation).play();
        }
        //if (typevalue == 2) cc.gSoundRes.PlayGameSound('shunzi');
        if (typevalue == 3) cc.gSoundRes.PlayGameSound( this.m_DoubleSound[''+CMD.cbSoundtype]);
        //if (typevalue == 4) cc.gSoundRes.PlayGameSound('W_LIANDUI');
        //if (typevalue == 5) cc.gSoundRes.PlayGameSound('sandaier');
        //if (typevalue == 6) cc.gSoundRes.PlayGameSound('W_FEIJI');
        if (typevalue == 1) cc.gSoundRes.PlayGameSound(''+CMD.cbSoundtype);
        return true;
    },

    //清空牌堆
    OnCleanShowCard(pData, wDataSize) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var view = this.SwitchViewChairID(i);
            this.m_GameClientView.m_CardCtrl[view].ClearChildCard();
            //this.m_GameClientView.m_CardType[view].active = false;
        }
        return true;
    },

    //倒计时
    OnSubTimerSeconds: function (pData, wDataSize) {
        var m_CmdSeconds = GameDef.CMD_S_SECONDS();
        if (wDataSize != gCByte.Bytes2Str(m_CmdSeconds, pData)) return false;
        if(m_CmdSeconds.cbSeconds==200){
            this.m_GameClientView.$('ClockNode/Clock').active=false;
            return true;
        }
        var ClockString =this.m_GameClientView.$('ClockNode/Clock/timelabel@Label');
        ClockString.string = m_CmdSeconds.cbSeconds;
        this.m_GameClientView.$('ClockNode/Clock').active=true;
        return true;
    },

    //发牌回调
    CallSetcard:function(){
        var CardNode= cc.instantiate(this.m_GameClientView.m_MyCardCtrl.m_Card[0].node);
        CardNode.getComponent('CardPrefab_50000').SetData( this.CallCardData[this.CallIndex]);
        this.m_GameClientView.m_MyCardCtrl.m_Card[0].node.parent.addChild(CardNode);
        this.m_GameClientView.m_MyCardCtrl.m_Card[this.CallIndex] = CardNode.getComponent('CardPrefab_50000');
        this.CallIndex++;
    },

    //设置庄家
    OnSetBanker:function(chair){
        this.m_Banker=chair;
        for(var i =0;i<GameDef.GAME_PLAYER;i++){
            if(!this.m_bPlayStatus[i]) continue;
            var viewID=this.SwitchViewChairID(i);
            if(i==chair)
                this.m_GameClientView.m_UserInfo[viewID].$('Banker').active=true;
            else
                this.m_GameClientView.m_UserInfo[viewID].$('Banker').active=false;
        }
    },

    //设置伙伴
    OnShowDivideGroup(pData, wDataSize){
        var CMD = GameDef.CMD_S_DivideGroup();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        this.SetDivideGroup(CMD.bDivideGroup);
        this.m_GameClientView.m_Aginrules.getComponent(cc.Sprite).spriteFrame=this.m_GameClientView.m_Atlas.getSpriteFrame(this.HintMessage[3]);
        this.m_GameClientView.m_Aginrules.setPosition(cc.v2(0, 100));
        this.m_GameClientView.m_Aginrules.active = true;
        var self = this;
        var action = cc.sequence(
            cc.moveTo(0.3, cc.v2(0, 150)),
            cc.delayTime(1),
            cc.callFunc(function () {
                self.m_GameClientView.m_Aginrules.active = false;
            }, self)
        );
        this.m_GameClientView.m_Aginrules.stopAllActions(action);
        this.m_GameClientView.m_Aginrules.runAction(action);
        return true;
    },

    //设置伙伴
    SetDivideGroup(DivideGroup){
        for(var i =0;i<GameDef.GAME_PLAYER;i++){
            //if(i==this.GetMeChairID()) continue;
            if(!this.m_bPlayStatus[i])continue;
            if(this.m_Banker==i) continue;
            if(DivideGroup[this.m_Banker]==DivideGroup[i]){
                this.m_GameClientView.m_UserInfo[this.SwitchViewChairID(i)].$('Partner').active=true;
            }
        }
        return true;
    },

     //游戏开始
    OnSubGameStart: function (pData, wDataSize) {
        this.m_GameStart = GameDef.CMD_S_GameStart();
        //效验
        if (wDataSize != gCByte.Bytes2Str(this.m_GameStart, pData)) return false;
        //this.OnMessageStart(null, true);
        this.m_GameClientView.m_BtFriend.active = false;

        this.m_GameEnd = null;
        this.m_bPlayStatus = this.m_GameStart.bPlayStatus;
        this.m_cbTrustee.length = GameDef.GAME_PLAYER
        this.m_cbTrustee.fill(0);
        //设置庄家
        this.OnSetBanker(this.m_GameStart.wCurrentBanker);
        // //显示独牌
        // if(this.GetMeChairID()==this.m_GameStart.wCurrentBanker){
        //     this.m_GameClientView.m_DupaiButton.active=true;
        // }
        // this.m_GameClientView.OnChangeDirection(this.m_GameStart.wCurrentBanker);
        return true;
    },

    //显示方向
    OnShowDirection(pData, wDataSize){
        var CMD = GameDef.CMD_S_MESSAGE();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        var viewID = this.SwitchViewChairID(CMD.wChair);
        this.time =15;
        this.m_GameClientView.$('ClockNode/Clock_'+viewID).active =true;
        this.m_GameClientView.$('ClockNode/Clock_'+viewID+'/timelabel@Label').string = this.time;
        this.m_viewID = viewID;
        this.schedule(this.SetTime,1,14,0);
        this.m_GameClientView.OnChangeDirection(CMD.wChair);
        return true;
    },

    //显示独牌
    OnShowAloneButton:function(pData, wDataSize){
        var CMD = GameDef.CMD_S_MESSAGE();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        if(this.GetMeChairID()==CMD.wChair)
            this.m_GameClientView.m_DupaiButton.active=true;
        else
            this.m_GameClientView.m_DupaiButton.active=false;
        this.m_GameClientView.OnChangeDirection(CMD.wChair);
        return true;
    },

    //点击独牌 value:1独 0不独
    OnclickAloneButton(tag,value){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientView.m_DupaiButton.active=false;
        var CMD = GameDef.CMD_C_CHOOSE();
        CMD.cbCodeValue=value;
        this.SendGameData(GameDef.SUB_C_CHOOSEALONE, CMD)
    },

    //显示出牌
    OnShowCardOperator(pData,wDataSize){
        var CMD = GameDef.CMD_S_MESSAGE();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        if(this.GetMeChairID()==CMD.wChair){
            // if(this.m_wGameProgress==0)
            // {
            //     this.scheduleOnce(function(){
            //         this.m_GameClientView.$('GameButton/Opera/Hint').active=true;
            //         this.m_GameClientView.$('GameButton/Opera/Show').active=true;
            //         this.m_GameClientView.$('GameButton/Opera/Pass').active=CMD.cbValue;
            //     },5)
            // }
            //else{
                this.m_GameClientView.$('GameButton/Opera/Hint').active=true;
                this.m_GameClientView.$('GameButton/Opera/Show').active=true;
                this.m_GameClientView.$('GameButton/Opera/Pass').active=CMD.cbValue;
           // }
        }
        var view=this.SwitchViewChairID(CMD.wChair);
        this.m_GameClientView.m_CardCtrl[view].ClearChildCard();
        this.m_GameClientView.m_UserInfo[view].$('Pass').active=false;
        return true;
    },

    //点击出牌按钮
    OnClickShowCardButton: function () {
        cc.gSoundRes.PlaySound('Button');
        var ShowArray = this.m_GameClientView.m_MyCardCtrl.getShootCard();
        var Godcount = 0; //王的数量
        var CMD = GameDef.CMD_C_ShowCardData();
        for (var i in ShowArray) {
            CMD.cbCardData[i] = ShowArray[i];
            if(this.m_GameLogic.GetCardColor(ShowArray[i])==0x40)
              Godcount++;
        }
        CMD.cbCount = ShowArray.length;
        if (ShowArray.length == 0) return;
        this.SendGameData(GameDef.SUB_C_SHOWCARDDATA, CMD);
    },

    //点击提示按钮
    OnClickHintButton: function () {
        cc.gSoundRes.PlaySound('Button');
        this.SendGameData(GameDef.SUB_C_CLICKHINTBUTTON);
    },

    //点击不要按钮
    OnClickPassButton: function () {
        this.m_GameClientView.$('GameButton/Opera/Pass').active=false;
        this.m_GameClientView.$('GameButton/Opera/Hint').active=false;
        this.m_GameClientView.$('GameButton/Opera/Show').active=false;
        this.m_GameClientView.m_MyCardCtrl.SetCardShootFale();
        this.SendGameData(GameDef.SUB_C_CLICKPASSBUTTON);
    },

    //点击看队友牌
    OnclickLookTameCard:function(){
        cc.gSoundRes.PlaySound('Button');
        this.m_GameClientView.$('GameButton/OnShowCard').active=false;
        this.m_GameClientView.$('GameButton/OnLoadLabel@Label').string='观看队友牌中';
        this.SendGameData(GameDef.SUB_C_CLICKLOOKTEAMCARD);
    },

     //发牌
     OnSendCardData: function (pData, wDataSize) {
        var CMD = GameDef.CMD_S_SendCard();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;

        this.m_GameClientView.m_DupaiButton.active=false;//关闭独牌按钮
        this.m_GameClientView.m_Direction.active=false;//关闭方向


        if( this.m_ReplayMode ) {
            this.m_GameClientView.m_RePlayCardNode.active=true;
            if(CMD.wChairID==this.GetMeChairID()){
                this.m_GameClientView.m_MyCardCtrl.ClearSetCard(CMD.cbCardData,27)
            }

            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                if( i == this.GetMeChairID()) continue;
                var viewID = this.SwitchViewChairID(i);
                this.m_GameClientView.m_RePlayCard[viewID].ClearSetCard(CMD.cbPokerData[i],27)
             }
             return;
        }

        if( gClientKernel.get().IsLookonMode()) return true;


        this.m_GameClientView.m_SendCardCtrl.PlaySendCard(27, this.m_bPlayStatus);//发牌动画
        this.m_GameClientView.m_MyCardCtrl.m_Card[0].getComponent('CardPrefab_50000').SetData(CMD.cbCardData[0]);

        this.CallIndex = 1;
        var count = parseInt(CMD.cbcount)-2;
        this.CallCardData=CMD.cbCardData;
        this.schedule(this.CallSetcard,0.05,count,0);
        this.scheduleOnce(function(){
            if(!CMD.cbAlonecardstate){
                // this.m_GameClientView.$('ChickenCard/CardPrefab@CardPrefab_50000').SetData(CMD.cbChicken);
                // this.m_GameClientView.$('ShowCard@CardPrefab_50000').SetData(CMD.cbChicken);
                // this.m_GameClientView.$('ChickenCard').active=true;
            }
            if(this.GetMeChairID()==this.m_Banker){
                this.m_GameClientView.$('GameButton/Opera/Hint').active=true;
                this.m_GameClientView.$('GameButton/Opera/Show').active=true;
             }
              //时间
            this.time =15;
            var viewID = this.SwitchViewChairID(this.m_Banker);
            if( this.m_GameClientView.$('ClockNode/Clock_'+viewID))
            {
                this.m_GameClientView.$('ClockNode/Clock_'+viewID).active =true;
                this.m_GameClientView.$('ClockNode/Clock_'+viewID+'/timelabel@Label').string = this.time;
                this.m_viewID = viewID;
                this.schedule(this.SetTime,1,14,0);
            }
            //显示独牌
            // if(this.GetMeChairID()==this.m_Banker){
            //     this.m_GameClientView.m_DupaiButton.active=true;
            // }
            this.m_GameClientView.OnChangeDirection(this.m_GameStart.wCurrentBanker);
            //显示牌数
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                if(!this.m_bPlayStatus[i]) continue;
                //var viewID=this.SwitchViewChairID(i);
                //this.m_GameClientView.m_UserInfo[viewID].$('Count').active=false;
                //this.m_GameClientView.m_UserInfo[viewID].$('Count/Label@Label').string=CMD.cbcount;
            }
            //设置方向
            this.m_GameClientView.OnChangeDirection(this.m_Banker)
        }, 5);
        //允许点牌
        this.m_GameClientView.m_MyCardCtrl.m_TouchLock = true;
        return true;
    },

    OnShowChickCard(pData, wDataSize){
        var CMD = GameDef.CMD_S_MESSAGE();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        //顺序改了所以要延迟显示
        this.scheduleOnce(function(){
            this.m_GameClientView.$('ChickenCard/CardPrefab@CardPrefab_50000').SetData(CMD.cbValue);
            this.m_GameClientView.$('ShowCard@CardPrefab_50000').SetData(CMD.cbValue);
            this.m_GameClientView.$('ChickenCard').active=true;
        },2)
        // this.m_GameClientView.$('ChickenCard/CardPrefab@CardPrefab_50000').SetData(CMD.cbValue);
        // this.m_GameClientView.$('ShowCard@CardPrefab_50000').SetData(CMD.cbValue);
        // this.m_GameClientView.$('ChickenCard').active=true;
        this.scheduleOnce(function(){
            if(this.m_GameClientView.$('ChickenCard').active)
                this.m_GameClientView.$('ChickenCard').active=false;

            if(!gClientKernel.get().IsLookonMode()){
                for(var i = 0; i<GameDef.MAX_COUNT;i++)
                {
                    if(this.m_GameClientView.m_MyCardCtrl.m_Card[i].GetData()==CMD.cbValue)
                    this.m_GameClientView.m_MyCardCtrl.m_Card[i].SetColor();
                }
            }
        }, 4);
        return true;
    },

    //不要亮灯
    OnControlPassLight(pData, wDataSize){
        var CMD = GameDef.CMD_S_MESSAGE();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        if (CMD.block) {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                var view = this.SwitchViewChairID(i);
                this.m_GameClientView.m_UserInfo[view].$('Pass').active=false;
            }
        }
        else {
            var view = this.SwitchViewChairID(CMD.wChair);
            this.m_GameClientView.m_UserInfo[view].$('Pass').active=true;
            this.m_GameClientView.m_CardCtrl[view].ClearChildCard();
            cc.gSoundRes.PlayGameSound('W_BUYAO');
            this.m_GameClientView.$('ClockNode/Clock_'+view).active =false;
            if(this.GetMeChairID()==CMD.wChair)
            {
                //关闭出牌按钮
                this.m_GameClientView.$('GameButton/Opera/Hint').active=false;
                this.m_GameClientView.$('GameButton/Opera/Show').active=false;
                this.m_GameClientView.$('GameButton/Opera/Pass').active=false;
            }
            this.unschedule(this.SetTime);
        }
         return true;
    },

    OnHinkCard: function (pData, wDataSize) {
        var CMD = GameDef.CMD_S_HintCardData();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        this.m_GameClientView.m_MyCardCtrl.OnSetHintCard(CMD.cbHintCard);
        return true;
    },

    //发送提示
    OnSendHintMessage: function (pData, wDataSize) {
        var CMD = GameDef.CMD_S_MESSAGE();
        if (wDataSize != gCByte.Bytes2Str(CMD, pData)) return false;
        this.m_GameClientView.m_Aginrules.getComponent(cc.Sprite).spriteFrame=this.m_GameClientView.m_Atlas.getSpriteFrame(this.HintMessage[CMD.cbValue]);
        this.m_GameClientView.m_Aginrules.setPosition(cc.v2(0, 100));
        this.m_GameClientView.m_Aginrules.active = true;
        var self = this;
        var action = cc.sequence(
            cc.moveTo(0.3, cc.v2(0, 150)),
            cc.delayTime(1),
            cc.callFunc(function () {
                self.m_GameClientView.m_Aginrules.active = false;
            }, self)
        );
        this.m_GameClientView.m_Aginrules.stopAllActions(action);
        this.m_GameClientView.m_Aginrules.runAction(action);
       /* if( parseInt(CMD.cbValue)==2){
            this.m_GameClientView.m_OpertorCtrl[0].active = false;
            this.m_GameClientView.m_OpertorCtrl[1].active = false;
            this.m_GameClientView.m_OpertorCtrl[2].active = false;
        }*/
        return true;
    },

    //游戏结束
    OnSubGameConclude: function (pData, wDataSize) {
        this.m_GameEnd = GameDef.CMD_S_GameEnd();
        //效验数据
        if (wDataSize != gCByte.Bytes2Str(this.m_GameEnd, pData)) return false;
        this.m_GameClientView.m_MyCardCtrl.m_TouchLock = false;
        var m_chair=this.m_GameEnd.wOrderchari;
         //游戏结算展示玩家手牌
         for (var i = 0; i < 4; i++) {
            var view = this.SwitchViewChairID(i);
            //亮输的玩家的手牌
            if (this.m_GameEnd.cbCardCount[i]) {
                if (view == GameDef.MYSELF_VIEW_ID) continue;
                this.m_GameClientView.m_CardCtrl[view].ClearChildCard();
                //出牌玩家显示出的牌
                this.m_GameClientView.m_CardCtrl[view].AddChildCard(this.m_GameEnd.cbCardData[i], this.m_GameEnd.cbCardCount[i], view);
            }
        }
        //小结算数据
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            var view = this.SwitchViewChairID(i);
            var userid=this.m_GameClientView.m_UserInfo[view].m_pUserItem.m_UserInfo.dwUserID;
            if (this.m_ChairCtrl[i] == null)
            this.m_ChairCtrl[i] = this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getComponent('UserCtrl_50000');
            this.m_ChairCtrl[i].SetUserByID(userid);
            this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getComponent('UserCtrl_50000').m_Score.string= Score2Str(this.m_GameEnd.llGameScore[i]);
            this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getComponent('UserCtrl_50000').m_Saward.string=Score2Str(this.m_GameEnd.llAwardScore[i]);

            // this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getComponent('UserCtrl_50000').m_Score.string= (this.m_GameEnd.llGameScore[i]);
            // this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getComponent('UserCtrl_50000').m_Saward.string=(this.m_GameEnd.llAwardScore[i]);


            this.m_GameClientView.m_LittleUser[i].getChildByName('cardinfo').getComponent('CardCtrl_50000').ClearChildCard();
            //this.m_GameClientView.m_LittleUser[i].getChildByName('cardinfo').getComponent('CardCtrl_50000').m_Card[0].getComponent('CardPrefab_50000').SetData(this.m_GameEnd.cbCardData[i][0]);
            for(var j=0;j<this.m_GameEnd.cbCardCount[i];j++){
                var CardNode= cc.instantiate( this.m_GameClientView.m_LittleUser[i].getChildByName('cardinfo').getComponent('CardCtrl_50000').m_Card[0].node);
                CardNode.getComponent('CardPrefab_50000').SetData( this.m_GameEnd.cbCardData[i][j]);
                this.m_GameClientView.m_LittleUser[i].getChildByName('cardinfo').getComponent('CardCtrl_50000').m_Card[0].node.parent.addChild(CardNode);
                //this.m_GameClientView.m_LittleUser[i].getChildByName('cardinfo').getComponent('CardCtrl_50000').m_Card[j]=CardNode.getComponent('CardPrefab_50000');
            }
            if(this.m_GameEnd.bDivideGroup[i]==this.m_GameEnd.bDivideGroup[this.GetMeChairID()])
                this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getChildByName('Group').active=true;
            //if(i==this.m_Banker)
        }
        switch(this.m_GameEnd.cbGameEndType) {
            case 0: { this.m_GameClientView.$('LittlerResoult/Winstyle@Label').string='平拱'; break; }
            case 1: { this.m_GameClientView.$('LittlerResoult/Winstyle@Label').string='半拱'; break; }
            case 2: { this.m_GameClientView.$('LittlerResoult/Winstyle@Label').string='直拱'; break; }
            case 3: { this.m_GameClientView.$('LittlerResoult/Winstyle@Label').string='独牌'; break; }
            case 4: { this.m_GameClientView.$('LittlerResoult/Winstyle@Label').string='干直拱';break; }
        }
        for(var index=0;index<3;index++){
            for(var i=0;i<GameDef.GAME_PLAYER;i++){
                if(i==this.m_GameEnd.wArraywinSeque[index]){
                    this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getChildByName('Order').getComponent(cc.Sprite).spriteFrame=this.m_GameClientView.m_Atlas.getSpriteFrame(this.Winorder[index]);
                    this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getChildByName('Order').active=true;
                }
            }
        }
        this.m_GameClientView.m_LittleUser[this.m_Banker].getChildByName('userinfo').getChildByName('Banker').active=true;
        this.scheduleOnce(function () {
            this.m_GameClientView.m_LittleEnd.active = true;//结束时显示小结算
            console.log("GAME IS OVER");
        }, 2.5);

        var kernel = gClientKernel.get();
        if (kernel.IsLookonMode()) {
            this.scheduleOnce(function () {
                this.m_GameClientView.m_LittleEnd.active = false;
                this.OnClearScene();
            }, 5);

        }

        return true;
    },

    //执行结束
    OnTimeIDI_PERFORM_END:function() {
        this.unschedule( this.OnTimeIDI_PERFORM_END );
        this.m_bEnd = true;
        //成绩界面
        this.ShowGamePrefab("LittleResultBG",GameDef.KIND_ID,this.node,function(Js){
            this.m_EndLittleView = Js;
           // this.m_EndLittleView.SetTrustee(this.m_bStustee);
        }.bind(this));
    },

    //清空
    OnClearScene: function () {
        //设置界面
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);
        this.m_GameClientView.resetView();
        //this.Queue.clean();
        if (this.m_REndCtrl) {
            this.m_REndCtrl.OnDestroy();
            this.m_REndCtrl = null;
            this.m_RoomEnd = null;
        }
        for (var i = 0; i < 10; i++) {

        }
        this.m_GameClientView.m_Direction.active=false;//关闭方向
        //删除掉我的手牌
        this.m_GameClientView.m_MyCardCtrl.ClearChildCard();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (!this.m_bPlayStatus[i]) continue;
            var viewId = this.SwitchViewChairID(i);
            //清空奖分
            this.m_GameClientView.m_UserInfo[viewId].$('ScoreTitle/Award@Label').string=0;
            //关闭伙伴图标
            this.m_GameClientView.m_UserInfo[viewId].$('Partner').active=false;
            //关闭不要图标
            this.m_GameClientView.m_UserInfo[viewId].m_Pass.active = false;
            //清空出牌列表
            this.m_GameClientView.m_CardCtrl[viewId].ClearChildCard();
            //关闭旋转动画
            this.m_GameClientView.m_UserInfo[viewId].m_progressbar.node.active = false;
            this.m_GameClientView.m_UserInfo[viewId].m_progressbar.playAnimation('newAnimation', 1);
            this.m_GameClientView.m_UserInfo[viewId].$('Banker').active=false;
            //剩余排数
            this.m_GameClientView.m_UserInfo[viewId].$('Count').active=false;
            //关闭上移分
            //this.m_GameClientView.m_UserInfo[viewId].node.getChildByName('_resultScore').active = false;
            //his.m_GameClientView.m_UserInfo[viewId].node.getChildByName('_resultScore2').active = false;
            this.m_GameClientView.m_UserInfo[viewId].m_warning.node.active = false;
            this.m_GameClientView.m_UserInfo[viewId].$('Sqeue').active=false;
            this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getChildByName('Order').active=false;
            this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getChildByName('Group').active=false;
            this.m_GameClientView.m_LittleUser[i].getChildByName('userinfo').getChildByName('Banker').active=false;
        }
        this.m_GameClientView.$('LittlerResoult/Winstyle@Label').string='';
        //关闭出牌界面
        this.m_GameClientView.m_OpertorCtrl[0].active = false;
        this.m_GameClientView.m_OpertorCtrl[1].active = false;
        this.m_GameClientView.m_OpertorCtrl[2].active = false;
        this.m_GameClientView.$('GameButton/OnShowCard').active=false;
        this.m_GameClientView.$('GameButton/OnLoadLabel').active=false;
        this.m_GameClientView.$('ShowCard').active=false;
    },

    //游戏场景
    OnEventSceneMessage: function (cbGameStatus, bLookonUser, pData, wDataSize) {
        if (window.LOG_NET_DATA) console.log("OnEventSceneMessage cbGameStatus " + cbGameStatus + " size " + wDataSize)
        switch (cbGameStatus) {
            case GameDef.GAME_STATUS_FREE: //空闲状态
                {
                    //效验数据
                    // var pStatusFree = GameDef.CMD_S_StatusFree();
                    // if (wDataSize != gCByte.Bytes2Str(pStatusFree, pData)) return false;
                    //玩家设置
                    var kernel = gClientKernel.get();
                    if (!kernel.IsLookonMode()) {
                        //开始设置
                        var pIClientUserItem = kernel.GetTableUserItem(this.GetMeChairID());
                        if (kernel.GetMeUserItem().GetUserStatus() != US_READY) {
                            if (!this.m_ReplayMode) {
                                // if(this.m_wGameProgress==0)
                                // this.m_GameClientView.OnBnClickedStart();
                                // this.m_GameClientView.m_BtStart.active = true;
                                // this.m_GameClientView.m_BtFriend.active = true;
                                for (var i = 0; i < 10; i++) {
                                }
                            }
                        }
                    }
                     if (this.m_dwRoomID != 0 && this.m_wGameProgress == 0 && !this.m_ReplayMode)
                     //this.m_GameClientView.m_BtFriend.active = true;
                     this.m_cbTrustee.fill(0);//托管
                    return true;
                }
            case GameDef.GAME_SCENT_ALONE:
                {
                     //效验数据
                     var pStatusPlay = GameDef.CMD_S_StatusPlay();
                     if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;
                     //发牌
                    this.m_GameClientView.m_MyCardCtrl.m_Card[0].getComponent('CardPrefab_50000').SetData(pStatusPlay.cbCardData[0]);
                    this.CallIndex = 1;
                    var count = pStatusPlay.cbCardCount[this.GetMeChairID()]-2;
                    this.CallCardData=pStatusPlay.cbCardData;
                    this.schedule(this.CallSetcard,0.05,count,0);
                    //允许点牌
                    this.m_GameClientView.m_MyCardCtrl.m_TouchLock = true;
                    //设置庄家
                    this.OnSetBanker(pStatusPlay.wBanker);

                    //显示牌数
                    for(var i=0;i<GameDef.GAME_PLAYER;i++){
                        if(!pStatusPlay.bPlayStatus[i]) continue;
                        var viewID=this.SwitchViewChairID(i);
                        if(pStatusPlay.cbCardCount[i]<5 && viewID!=GameDef.MYSELF_VIEW_ID){
                            this.m_GameClientView.m_UserInfo[viewID].$('Count').active=true;
                            this.m_GameClientView.m_UserInfo[viewID].$('Count/Label@Label').string=pStatusPlay.cbCardCount[i];
                        }
                    }
                    return true;
                }
            case GameDef.GAME_STATUS_PLAY: //游戏状态
                {
                    //效验数据
                    var pStatusPlay = GameDef.CMD_S_StatusPlay();
                    if (wDataSize != gCByte.Bytes2Str(pStatusPlay, pData)) return false;

                    this.m_bPlayStatus = pStatusPlay.bPlayStatus;
                    this.m_cbTrustee = deepClone(pStatusPlay.cbTrustee);//托管

                    //this.m_GameClientView.m_BtStart.active = true;
                     this.m_GameClientView.m_BtFriend.active = false;
                    var kernel = gClientKernel.get();
                    if(pStatusPlay.cbCardCount[this.GetMeChairID()]>0  && (!kernel.IsLookonMode())){
                        //发牌
                        this.m_GameClientView.m_MyCardCtrl.m_Card[0].getComponent('CardPrefab_50000').SetData(pStatusPlay.cbCardData[0]);
                        this.CallIndex = 1;
                        var count = pStatusPlay.cbCardCount[this.GetMeChairID()]-2;
                        this.CallCardData=pStatusPlay.cbCardData;
                        this.schedule(this.CallSetcard,0.05,count,0);
                        //允许点牌
                        this.m_GameClientView.m_MyCardCtrl.m_TouchLock = true;
                    }

                    if(pStatusPlay.bShowFriendButton){
                        this.m_GameClientView.$('GameButton/OnShowCard').active=true;
                    }
                    //不独牌显示明鸡
                    if(pStatusPlay.bAlonecardstate==false){
                        this.m_GameClientView.$('ShowCard@CardPrefab_50000').SetData(pStatusPlay.bAlonecard);
                    }
                    //设置庄家
                    this.OnSetBanker(pStatusPlay.wBanker);
                    //设置方向
                    this.m_GameClientView.OnChangeDirection(pStatusPlay.wCurrentUser);
                    //设置分伙数据
                    if(pStatusPlay.bPublicGroup){
                        this.SetDivideGroup(pStatusPlay.bDivideGroup);
                    }
                     //显示牌数
                    for(var i=0;i<GameDef.GAME_PLAYER;i++){
                        if(!this.m_bPlayStatus[i]) continue;
                        var viewID=this.SwitchViewChairID(i);
                        if(pStatusPlay.cbCardCount[i]<5 && viewID!=GameDef.MYSELF_VIEW_ID)
                        {
                            this.m_GameClientView.m_UserInfo[viewID].$('Count').active=true;
                            this.m_GameClientView.m_UserInfo[viewID].$('Count/Label@Label').string=pStatusPlay.cbCardCount[i];
                        }
                    }
                    //显示出牌
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        if (i == pStatusPlay.wCurrentUser) continue;
                        var view = this.SwitchViewChairID(i);
                        this.m_GameClientView.m_CardCtrl[view].AddChildCard(pStatusPlay.cbShowCard[i], pStatusPlay.cbShowCount[i], view);
                    }
                    //显示不要
                    for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                        if(pStatusPlay.bArrayPassState[i]){
                            var view=this.SwitchViewChairID(i);
                            this.m_GameClientView.m_UserInfo[view].$('Pass').active=true;
                        }
                    }
                    //托管
                    var wMeChairID = this.GetMeChairID();
                    if(this.m_cbTrustee[wMeChairID])
                    {
                        this.m_GameClientView.m_TrusteeNode.active = true;
                    }
                    for(var i = 0;i<GameDef.GAME_PLAYER;i++)
                    {
                        var wViewID = this.SwitchViewChairID(i);
                        this.m_GameClientView.SetUserTrustee(wViewID, this.m_cbTrustee[i]);

                    }
                    //鸡牌颜色
                    if(pStatusPlay.bAlonecardstate==false){
                        this.scheduleOnce(function(){
                            for(var i = 0; i < pStatusPlay.cbCardCount[this.GetMeChairID()];i++){
                                if( this.m_GameClientView.m_MyCardCtrl.m_Card[i] && this.m_GameClientView.m_MyCardCtrl.m_Card[i].GetData()==pStatusPlay.bAlonecard)
                                {
                                    this.m_GameClientView.m_MyCardCtrl.m_Card[i].SetColor();
                                    break;
                                }
                            }
                        },2)
                    }
                    return true;
                }
        }
        return false;
    },

    OnContinueGame: function () {
         this.m_GameClientView.m_LittleEnd.active = false;
         this.m_GameClientView.m_BtStart.active = true;
         this.m_GameClientView.m_BtFriend.active = true;
         this.OnClearScene();
    },

    OnGetRooMEndData: function (pData, wDataSize) {
        var EndInfo = GameDef.CMD_S_GameCustomInfo();
        if (wDataSize != gCByte.Bytes2Str(EndInfo, pData)) return false;
        this.EndInfoArray = EndInfo.llTotalScore;
        return true;
    },

    OnEventRoomEnd: function (data, datasize) {
        this.m_RoomEnd = GameDef.CMD_S_GameCustomInfo();
        if (datasize != gCByte.Bytes2Str(this.m_RoomEnd, data)) return false;
        this.m_RoomEnd.UserID = new Array();

        //用户成绩
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            //变量定义
            var pIClientUserItem = this.GetClientUserItem(i);
            if (pIClientUserItem == null) continue;
            this.m_RoomEnd.UserID[i] = pIClientUserItem.GetUserID();
            //this.m_RoomEnd.llTotalScore[i] = this.EndInfoArray[i];
        }
        console.log("this,m_roomend", this.m_RoomEnd);
        if (this.m_wGameProgress > 0 || this.m_ReplayMode) {
            this.ShowEndView();
        } else {
            this.ShowAlert("该房间已被解散！", Alert_Yes, function (Res) {
                this.m_pTableScene.ExitGame();
            }.bind(this));
        }

        return true;
    },

    //开始消息
    OnMessageStart: function (wParam, lParam) {
        //设置界面
        this.m_GameClientView.SetUserEndScore(INVALID_CHAIR);

        this.m_GameClientView.m_BtStart.active = false;
        this.OnClearScene();
        //发送消息
        if (!lParam) this.SendFrameData(SUB_GF_USER_READY);
        return 0;
    },

    OnBtgerdismiss: function () {
        this.ShowPrefabDLG('DissolveRoom', this.node, function (Js) {
            this.m_DisCtrl = Js;
            this.m_DisCtrl.SetDissolveInfo(this.m_UserDiss.dwDisUserID, this.m_UserDiss.byChoose, 180, this.m_LockArr);
            if (this.m_DissolveRes) this.m_DisCtrl.SetDisRes(this.m_DissolveRes.bDissolve);
        }.bind(this));
    },

    OnSendSessionRules: function (wxuser) {
        var Cmd = GameDef.CMD_C_SessionRules();
        Cmd.cbSessionRules = wxuser;
        this.SendGameData(GameDef.SUB_C_SESSION_RULES, Cmd);
    },

    //邀请好友分享
    OnFriend: function () {
        if (cc.sys.isNative) {
            this.ShowPrefabDLG("SharePre");
        } else {
            this.ShowPrefabDLG("SharePre");
        }
    },

    OnMessageTrustee: function(customData)
    {
        this.SendGameData(GameDef.SUB_C_TRUSTEE);
    },

    // 玩家托管
    OnSubTrustee: function (pData, wDataSize) {
        var pTrustee = GameDef.CMD_S_Trustee();
        if (wDataSize != gCByte.Bytes2Str(pTrustee, pData)) return false;
        this.m_cbTrustee[pTrustee.wChairID] = pTrustee.cbState;

        this.m_GameClientView.m_TrusteeNode.active = true;
        var wMeChairID = this.GetMeChairID();
        for (var i = 0; i < GameDef.GAME_PLAYER; ++i) {
            var wViewID = this.SwitchViewChairID(i);
            this.m_GameClientView.SetUserTrustee(wViewID, this.m_cbTrustee[i]);
        }
        //this.m_GameClientView.m_BtTrustee.active = (this.m_cbTrustee[wMeChairID] == 1 ? false : true);
        //this.UpdateTrusteeControl();
        return true;
    },

    //设置信息
    SetViewRoomInfo:function (m_dwServerRules,m_dwRulesArr ){
        //this.m_wGameCount = GameDef.GetGameCount(dwRules);
        if( this.m_GameClientView)
            this.m_GameClientView.SetViewRoomInfo(m_dwServerRules,m_dwRulesArr);
    },


    SetTime:function(){
        this.time -= 1;
        this.m_GameClientView.$('ClockNode/Clock_'+this.m_viewID+'/timelabel@Label').string = this.time;

    },

});