cc.Class({
    extends: cc.SubRoomRules,

    properties: {
    },
    //1000-1031 服务器规则  1050-1099 对应规则
    //1000 =>AA付           1050 =>房主付
    //1001 =>代开           1051 =>房主进入
    //1002 =>积分房间       1003 =>金币房间       1052 =>练习房间
    //添加对立规则数组索引
    SetClubView:function(RoomType){
        if (this.m_togArr == null) {
            this.m_togArr = this.node.getComponentsInChildren(cc.Toggle);
        }
    },
    SetKeyView:function(Key){                                      //牛牛Toggle下的子牛牛
        var Temp = 0;
        if(Key > 0) Temp = parseInt(Key);
        var tempTog = this.$('BankerMode/'+Temp+'@Toggle');
        if(tempTog) {
            tempTog.isChecked = false;
            tempTog.check();
        }
    },

    GetCustomRules:function(rules){                                //俱乐部的选项规则
        if(this.$('ScrollView/view/content/NdView/ClubNode').active){
            rules[2] = parseInt(this.$('ScrollView/view/content/NdView/ClubNode/EnterGame/EditBox@EditBox').string);
            rules[3] = parseInt(this.$('ScrollView/view/content/NdView/ClubNode/Banker/EditBox@EditBox').string);
            if(rules[2] > 0) {} else {rules[2] = 0};
            if(rules[3] > 0) {} else {rules[3] = 0};
        }
        return rules;
    },

    OnClick_ShowChildNode:function(Tag){                           //NdView的点击事件
        var NdChild = this.$('ScrollView/view/content/NdChild');
        if(NdChild){
            for(var i=0;i<NdChild.childrenCount;i++){
                if(NdChild.children[i].name == Tag.currentTarget.name) NdChild.children[i].x = -111;
                else NdChild.children[i].x = 2000;
            }
        }
    },
    OnClick_ShowTipsNode:function(Tag){                            //提示小问号的点击事件
        var NdTips = this.$('ScrollView/view/content/NdTips');
        if(NdTips){
            for(var i=0;i<NdTips.childrenCount;i++){
                if(NdTips.children[i].name == Tag.currentTarget.name) NdTips.children[i].active = true;
            }
        }
    },
    OnToggleClick:function(Tag, Data){
        this.m_bNeedUpdate = true;
        this.m_bNoUpdateChild = Data;
    },
    OnToggleAllCheck:function(Tag, Data){                           //特殊牌型全选按钮点击事件
        var PathStr = 'ScrollView/view/content/NdChild/CardType/CardType/';
        var bChecked = this.$('ScrollView/view/content/NdChild/CardType/10000@Toggle').isChecked;
        this.$(PathStr+'111@Toggle').isChecked = bChecked;
        this.$(PathStr+'112@Toggle').isChecked = bChecked;
        this.$(PathStr+'113@Toggle').isChecked = bChecked;
        this.$(PathStr+'114@Toggle').isChecked = bChecked;
        this.$(PathStr+'115@Toggle').isChecked = bChecked;
        this.$(PathStr+'116@Toggle').isChecked = bChecked;
        this.$(PathStr+'117@Toggle').isChecked = bChecked;
        this.$(PathStr+'118@Toggle').isChecked = bChecked;

        this.m_bNeedUpdate = true;
        this.m_bNoUpdateChild = 1;
    },
    OnToggleAllCheck2:function(Tag, Data){                           //高级选项全选按钮点击事件，加的
        var PathStr = 'ScrollView/view/content/NdChild/Other/Other/';
        var bChecked = this.$('ScrollView/view/content/NdChild/Other/10000@Toggle').isChecked;
        this.$(PathStr+'119@Toggle').isChecked = bChecked;
        this.$(PathStr+'120@Toggle').isChecked = bChecked;
        this.$(PathStr+'121@Toggle').isChecked = bChecked;
        this.$(PathStr+'122@Toggle').isChecked = bChecked;
        this.$(PathStr+'123@Toggle').isChecked = bChecked;
        this.$(PathStr+'124@Toggle').isChecked = bChecked;
        this.$(PathStr+'125@Toggle').isChecked = bChecked;
        this.$(PathStr+'126@Toggle').isChecked = bChecked;

        this.m_bNeedUpdate = true;
        this.m_bNoUpdateChild = 1;
    },
    OnUpdateCustomView:function(){
        //隐藏二级页
        var NdChild = this.$('ScrollView/view/content/NdChild');
        if(NdChild && this.m_bNoUpdateChild == null){
            for(var i=0;i<NdChild.childrenCount;i++){
                NdChild.children[i].x = 2000;
            }
        }
        NdChild.x = 0;
        NdChild.y = -30;

        var NdTips = this.$('ScrollView/view/content/NdTips');
        if(NdTips && this.m_bNoUpdateChild == null){
            for(var i=0;i<NdTips.childrenCount;i++){
                NdTips.children[i].active = false;
            }
        }
        //this.m_bNoUpdateChild = null;

        var PathStr = 'BankerMode/';
        var BankerMode = 0;//0明牌抢庄 1牛牛轮庄 2自由轮庄 3固定庄 4无花抢庄 5明牌通比 6通比牛牛
        if(this.$(PathStr+'0@Toggle').isChecked) BankerMode = 0;
        if(this.$(PathStr+'1@Toggle').isChecked) BankerMode = 1;
        if(this.$(PathStr+'2@Toggle').isChecked) BankerMode = 2;
        if(this.$(PathStr+'3@Toggle').isChecked) BankerMode = 3;
        if(this.$(PathStr+'4@Toggle').isChecked) BankerMode = 4;
        if(this.$(PathStr+'5@Toggle').isChecked) BankerMode = 5;
        if(this.$(PathStr+'30@Toggle').isChecked) BankerMode = 6;

        var PathStr = 'ScrollView/view/content/NdChild/Player/Player/';

        var TempStr = '';
        var GameCnt = 1;
        var PlayerCnt = 1;

        // if (BankerMode == 4 && this.$(PathStr+'1022@Toggle').isChecked)
        //     this.$(PathStr+'1020@Toggle').check();

        //this.$(PathStr+'1022').active = BankerMode != 4;

        //人数
        if(this.$(PathStr+'1020@Toggle').isChecked) PlayerCnt=4;
        if(this.$(PathStr+'1021@Toggle').isChecked) PlayerCnt=6;
        if(this.$(PathStr+'1022@Toggle').isChecked) PlayerCnt=8;

        this.$('ScrollView/view/content/NdView/Player/Label@Label').string = PlayerCnt+'人桌';

        var GameCnt = 1;
        //局数
        if(this.$('ScrollView/view/content/NdChild/GameCnt/GameCnt/1016@Toggle').isChecked) GameCnt=10;
        if(this.$('ScrollView/view/content/NdChild/GameCnt/GameCnt/1017@Toggle').isChecked) GameCnt=15;
        if(this.$('ScrollView/view/content/NdChild/GameCnt/GameCnt/1018@Toggle').isChecked) GameCnt=20;
        this.$('ScrollView/view/content/NdView/GameCnt/Label@Label').string = GameCnt+'局';

        //this.onUpdateBaseScoreRule(BankerMode);
        this.onUpdatePayModeRule(PlayerCnt,GameCnt);
        this.onUpdateStartModeRule(PlayerCnt);
        this.onUpdateAddModeRule(BankerMode);
        //this.onUpdateKingRule();
        this.onUpdatePlayTypeRule(BankerMode);
        this.onUpdateMaxBankerRule(BankerMode);
        this.onUpdateTrunBankerRule(BankerMode);
        this.onUpdateTongBiRule(BankerMode);
        this.onUpdateTimesModeRule(BankerMode);
        this.onUpdateOtherRule(BankerMode);
    },

    //底分
    onUpdateBaseScoreRule:function(GameMode,playType){
        var ruleID = new Array();
        ruleID.push(10); 
        ruleID.push(11); 
        ruleID.push(12); 
        ruleID.push(13); 
        ruleID.push(14); 
        ruleID.push(15); 
        ruleID.push(16); 

        
        var ruleBase = new Array();
        ruleBase.push(1);
        ruleBase.push(2);
        ruleBase.push(5);
        ruleBase.push(10);
        ruleBase.push(20);
        ruleBase.push(50);
        ruleBase.push(100);
        
        var activeState = new Array();
        activeState.push(true);
        activeState.push(true);
        activeState.push(true);
        activeState.push(true);//push(playType == 1 || GameMode == 5 || GameMode == 6);
        activeState.push(true);//push(GameMode == 5 || GameMode == 6);
        activeState.push(true);//push(playType == 2 || GameMode == 5 || GameMode == 6);
        activeState.push(true);

        PathStr = 'ScrollView/view/content/NdChild/BaseScore/BaseScore/';

        var isExitBase = false;
        var checkedIndex = 0;
        for (var i = 0 ; i < ruleBase.length ; i++)
        {
            var tempStr = ''
           
            tempStr = ruleBase[i] + '-' + ruleBase[i] * 2 + '-' + ruleBase[i] * 4;

                
            var PathStr = 'ScrollView/view/content/NdChild/BaseScore/BaseScore/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = tempStr;

            this.$(PathStr).active = activeState[i];
            if(activeState[i] && this.$(PathStr+'@Toggle').isChecked) 
            {
                isExitBase = true;
                checkedIndex = i;
                this.$('ScrollView/view/content/NdView/BaseScore/Label@Label').string = tempStr;
            }
        }

        if (!isExitBase)
        {
            var PathStr = 'ScrollView/view/content/NdChild/BaseScore/BaseScore/' + ruleID[0] + '@Toggle';
            this.$(PathStr).check();
        }
        else{
            this.onUpdateBankerScoreRule(GameMode,ruleBase[checkedIndex]);
        }
    },

    //房费
    onUpdatePayModeRule:function(PlayerCnt,GameCnt){
        var costNum = 1;
        var costAANum = 1;
        switch (PlayerCnt) {
            case 4:
                switch (GameCnt) {
                    case 10:
                        costNum = 4;
                        costAANum = 1;
                        break;
                    case 15:
                        costNum = 8;
                        costAANum = 1;
                        break;
                    case 20:
                        costNum = 16;
                        costAANum = 1;
                        break;
                }
                break;
            case 6:
                switch (GameCnt) {
                    case 10:
                        costNum = 6;
                        costAANum = 1;
                        break;
                    case 15:
                        costNum = 12;
                        costAANum = 1;
                        break;
                    case 20:
                        costNum = 24;
                        costAANum = 1;
                        break;
                }
                break;
            case 8:
                switch (GameCnt) {
                    case 10:
                        costNum = 8;
                        costAANum = 2;
                        break;
                    case 15:
                        costNum = 16;
                        costAANum = 2;
                        break;
                    case 20:
                        costNum = 32;
                        costAANum = 2;
                        break;
                }
                break;
        }
        
        var TempStr='AAX' + costAANum;
        if(this.$('ScrollView/view/content/NdChild/PayMode/PayMode/1000@Toggle').isChecked) this.$('ScrollView/view/content/NdView/PayMode/Label@Label').string=TempStr;
        this.$('ScrollView/view/content/NdChild/PayMode/PayMode/1000/Label@Label').string=TempStr;// +'钻'

        TempStr='房主X'+ costNum;
        if(this.$('ScrollView/view/content/NdChild/PayMode/PayMode/1050@Toggle').isChecked) this.$('ScrollView/view/content/NdView/PayMode/Label@Label').string=TempStr;
        this.$('ScrollView/view/content/NdChild/PayMode/PayMode/1050/Label@Label').string=TempStr;
    },

    //开始模式
    onUpdateStartModeRule:function(PlayerCnt){
        var ruleID = new Array();
        ruleID.push(100); 
        ruleID.push(101); 
        ruleID.push(102); 
        ruleID.push(103); 
        ruleID.push(104); 
        ruleID.push(105); 
        
        var ruleString = new Array();
        ruleString.push('准备开始'); 
        ruleString.push('首位开始'); 
        ruleString.push('满2人开始'); 
        ruleString.push('满'+(PlayerCnt-2)+'人开始'); 
        ruleString.push('满'+(PlayerCnt-1)+'人开始'); 
        ruleString.push('满'+(PlayerCnt)+'人开始'); 

        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/StartMode/StartMode/' + ruleID[i];
            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
                this.$('ScrollView/view/content/NdView/StartMode/Label@Label').string = ruleString[i];
        }
    },

    //推注
    onUpdateAddModeRule:function(GameMode){
        var ruleID = new Array();
        ruleID.push(19);
        ruleID.push(20);
        ruleID.push(21);
        ruleID.push(22);
        ruleID.push(23);
        
        var ruleString = new Array();
        ruleString.push('无'); 
        ruleString.push('2倍'); 
        ruleString.push('3倍'); 
        ruleString.push('5倍'); 
        ruleString.push('10倍'); 

        this.$('ScrollView/view/content/NdView/AddMode').active=(GameMode != 5 && GameMode != 6);
        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/AddMode/AddMode/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
                this.$('ScrollView/view/content/NdView/AddMode/Label@Label').string = ruleString[i];

            this.$(PathStr).active=(GameMode!=5 && GameMode!=6);
        }
    },

    //王赖
    onUpdateKingRule:function(){
        var ruleID = new Array();
        ruleID.push(201);
        ruleID.push(202);
        ruleID.push(203);

        
        var ruleString = new Array();
        ruleString.push('经典'); 
        ruleString.push('经典王赖'); 
        ruleString.push('疯狂王赖'); 


        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/King/King/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
            {
                this.$('ScrollView/view/content/NdView/King/Label@Label').string = ruleString[i];
            }
        }
    },
    
    //玩法
    onUpdatePlayTypeRule:function(GameMode){
        var ruleID = new Array();
        ruleID.push(203);
        ruleID.push(204);
        ruleID.push(205);
        
        var ruleString = new Array();
        ruleString.push('经典'); 
        ruleString.push('经典王赖'); 
        ruleString.push('疯狂王赖'); 


        var typeID = 0;
        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/PlayType/PlayType/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
            {
                typeID = i;
                this.$('ScrollView/view/content/NdView/PlayType/Label@Label').string = ruleString[i];
            }

        }
        this.onUpdateBaseScoreRule(GameMode,typeID);
    },

    //最大抢庄
    onUpdateMaxBankerRule:function(GameMode){
        var ruleID = new Array();
        // ruleID.push(6);
        // ruleID.push(7);
        // ruleID.push(8);
        ruleID.push(9);
        
        var ruleString = new Array();
        // ruleString.push('1倍'); 
        // ruleString.push('2倍'); 
        // ruleString.push('3倍'); 
        ruleString.push('4倍'); 

        var isActive = (GameMode == 0 || GameMode == 4);
        this.$('ScrollView/view/content/NdView/MaxBanker').active = isActive;
        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/MaxBanker/MaxBanker/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];
            this.$(PathStr+'@Toggle').isChecked = true;
            if(this.$(PathStr+'@Toggle').isChecked) 
                this.$('ScrollView/view/content/NdView/MaxBanker/Label@Label').string = ruleString[i];

            this.$(PathStr).active = isActive;
        }
    },

    //轮庄玩法
    onUpdateTrunBankerRule:function(GameMode){
        var ruleID = new Array();
        ruleID.push(28);
        ruleID.push(29);
        ruleID.push(31);
        
        var ruleString = new Array();
        ruleString.push('牛牛上庄'); 
        ruleString.push('轮流坐庄');
        ruleString.push('无牛下庄');

        var isActive = (GameMode == 1);
        this.$('ScrollView/view/content/NdView/TrunBanker').active = isActive;
        //this.$('ScrollView/view/content/NdView/TrunBanker/infoTrun').active = isActive;

        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/TrunBanker/TrunBanker/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
                this.$('ScrollView/view/content/NdView/TrunBanker/Label@Label').string = ruleString[i];

            this.$(PathStr).active = isActive;
        }
    },

    //通比玩法
    onUpdateTongBiRule:function(GameMode){
        var ruleID = new Array();
        ruleID.push(51);
        ruleID.push(127);
        
        var ruleString = new Array();
        ruleString.push('普通玩法');
        ruleString.push('全比玩法');

        var isActive = (GameMode == 5 || GameMode == 6);
        this.$('ScrollView/view/content/NdView/TongBi').active = isActive;
        //this.$('ScrollView/view/content/NdView/TongBi/infoTongBi').active = isActive;
        
        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/TongBi/TongBi/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
                this.$('ScrollView/view/content/NdView/TongBi/Label@Label').string = ruleString[i];

            this.$(PathStr).active = isActive;
        }
    },

    //坐庄分数
    onUpdateBankerScoreRule:function(GameMode,baseScore){
        var ruleID = new Array();
        ruleID.push(24);
        ruleID.push(25);
        ruleID.push(26);
        ruleID.push(27);
        ruleID.push(17);

        
        var ruleString = new Array();
        ruleString.push('无');
        ruleString.push(5000 + '');
        ruleString.push(10000 + '');
        ruleString.push(20000 + '');
        ruleString.push(30000 + '');


        var isActive = (GameMode == 3);
        this.$('ScrollView/view/content/NdView/BankerScore').active = isActive;
        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/BankerScore/BankerScore/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
                this.$('ScrollView/view/content/NdView/BankerScore/Label@Label').string = ruleString[i];

            this.$(PathStr).active = isActive;
        }
    },

    //特殊牌型
    onUpdateCardTypeRule:function(GameMode,TimesMode){
        var ruleID = new Array();
        ruleID.push(111);
        //ruleID.push(112);
        //ruleID.push(113);
        ruleID.push(114);
        ruleID.push(115);
        ruleID.push(116);
        //ruleID.push(117);
        //ruleID.push(118);

        var ruleTimes = new Array();
        switch (TimesMode)
        {
            //牛牛4倍和3倍
            case 1:
                ruleTimes.push('5');
                //ruleTimes.push('5');
                //ruleTimes.push('6');
                ruleTimes.push('6');
                ruleTimes.push('7');
                ruleTimes.push('8');
                //ruleTimes.push('10');
                //ruleTimes.push('7');
                break;
            //牛牛5倍
            case 2:
                ruleTimes.push('5');
                //ruleTimes.push('6');
                //ruleTimes.push('7');
                ruleTimes.push('6');
                ruleTimes.push('7');
                ruleTimes.push('8');
                //ruleTimes.push('10');
                //ruleTimes.push('8');
                break;
            //牛牛10倍
            case 3:
                ruleTimes.push('5');
                //ruleTimes.push('11');
                //ruleTimes.push('12');
                ruleTimes.push('6');
                ruleTimes.push('7');
                ruleTimes.push('8');
                //ruleTimes.push('15');
                //ruleTimes.push('13');
                break;
        }
        
        var ruleString = new Array();
        ruleString.push('顺子牛X');
        //ruleString.push('五花牛X');
        //ruleString.push('同花牛X');
        ruleString.push('葫芦牛X');
        ruleString.push('炸弹牛X');
        ruleString.push('五小牛X');
        //ruleString.push('同花顺X');
        //ruleString.push('四十牛X');

        //是否显示四十牛
        // var isActive = (GameMode == 4);
        // this.$('ScrollView/view/content/NdChild/CardType/CardType/118').active = isActive;
        
        // var showTempStr = '';
        // for (var i=0;i<ruleID.length;i++)
        // {
        //     var PathStr = 'ScrollView/view/content/NdChild/CardType/CardType/' + ruleID[i];

        //     var tempStr = ruleString[i] + ruleTimes[i];

        //     this.$(PathStr + '/Label@Label').string = tempStr;

        //     if(this.$(PathStr).active && this.$(PathStr+'@Toggle').isChecked) 
        //     {
        //         showTempStr += tempStr;
        //         showTempStr += ' ';
        //     }
        // }

        // if (showTempStr == '')showTempStr = '无'
        // this.$('ScrollView/view/content/NdView/CardType/Label@Label').string = showTempStr;
        
        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/CardType/CardType/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i] + ruleTimes[i];

            this.$('ScrollView/view/content/NdView/CardType/Label' + i).active = this.$(PathStr+'@Toggle').isChecked && this.$(PathStr).active;
            this.$('ScrollView/view/content/NdView/CardType/Label' + i +'@Label').string = ruleString[i] + ruleTimes[i];

        }
    },

    //牌型倍数
    onUpdateTimesModeRule:function(GameMode){
        var ruleID = new Array();
        ruleID.push(106);
        ruleID.push(107);
        ruleID.push(108);
        ruleID.push(109);
        ruleID.push(110);
        
        var ruleString = new Array();
        ruleString.push('牛牛4倍 牛九3倍 牛八2倍 牛七2倍');
        ruleString.push('牛牛3倍 牛九2倍 牛八2倍 牛七1倍');
        ruleString.push('牛牛3倍 牛九2倍 牛八2倍 牛七2倍');
        ruleString.push('牛牛5倍 牛九4倍 牛八3倍 牛七2倍');
        ruleString.push('牛一到牛牛分别对应1到10倍');

        var timesMode = new Array();
        timesMode.push(1);
        timesMode.push(1);
        timesMode.push(1);
        timesMode.push(2);
        timesMode.push(3);

        var chooseTimeMode = 1;
        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/TimesMode/ScrollView/view/TimesMode/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
            {
                this.$('ScrollView/view/content/NdView/TimesMode/Label@Label').string = ruleString[i];
                chooseTimeMode = timesMode[i];
            }
        }

        this.onUpdateCardTypeRule(GameMode,chooseTimeMode);
    },

    //高级
    onUpdateOtherRule:function(GameMode){
        var ruleID = new Array();
        ruleID.push(119);
        ruleID.push(120);
        ruleID.push(121);
        ruleID.push(122);
        ruleID.push(123);
        ruleID.push(124);
        ruleID.push(125);
        ruleID.push(126);
        
        var ruleString = new Array();
        ruleString.push('快速模式');
        ruleString.push('中途禁入');
        ruleString.push('禁止搓牌');
        ruleString.push('禁用表情');
        ruleString.push('下注限制');
        ruleString.push('暗抢庄家');
        ruleString.push('下注加倍');
        ruleString.push('禁用语音');

        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/Other/Other/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            this.$('ScrollView/view/content/NdView/Other/Label' + i).active = this.$(PathStr+'@Toggle').isChecked;
            this.$('ScrollView/view/content/NdView/Other/Label' + i +'@Label').string = ruleString[i];

        }
    },

    UpdateSubitemTitleColor: function() {
        for(var i in this.$('ScrollView/view/content/NdView').children) {
            var pNode = this.$('Label', this.$('ScrollView/view/content/NdView').children[i]);
            if(pNode) pNode.color = this.m_Color[0];
            var pNode2 = this.$('ScrollView/view/content/NdView').children[i];
            if(pNode2) pNode2.color = this.m_Color[2];
            
            for (var m =0;m<8;m++)
            {
                var pNodeOther = this.$('Label' + m, this.$('ScrollView/view/content/NdView').children[i]);
                if(pNodeOther) pNodeOther.color = this.m_Color[0];
            }
        }
        for(var i in this.m_togArr){
            if(!this.m_togArr[i].node.active) continue;
            var color = this.m_togArr[i].isChecked?this.m_Color[0]:this.m_Color[1];
            this.m_togArr[i].node.getChildByName("Label").color = color
        }
    },
});
