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
        NdChild.y = 0;

        var NdTips = this.$('ScrollView/view/content/NdTips');
        if(NdTips && this.m_bNoUpdateChild == null){
            for(var i=0;i<NdTips.childrenCount;i++){
                NdTips.children[i].active = false;
            }
        }

        var PathStr = 'ScrollView/view/content/NdChild/Player/Player/';

        var PlayerCnt = 1;

        //人数
        if(this.$(PathStr+'1020@Toggle').isChecked) PlayerCnt=6;
        if(this.$(PathStr+'1021@Toggle').isChecked) PlayerCnt=8;
        if(this.$(PathStr+'1022@Toggle').isChecked) PlayerCnt=10;

        this.$('ScrollView/view/content/NdView/Player/Label@Label').string = PlayerCnt+'人桌';

        this.onUpdateBaseScoreRule();
        this.onUpdateMinBetRule();
        this.onUpdatePayModeRule(PlayerCnt);
        this.onUpdateStartModeRule(PlayerCnt);
        this.onUpdateKingRule();
        this.onUpdateTimesModeRule();
        this.onUpdateOtherRule();
    },

    //锅底
    onUpdateBaseScoreRule:function(){
        var ruleID = new Array();
        ruleID.push(0); 
        ruleID.push(1); 
        ruleID.push(2); 
        ruleID.push(3); 
        ruleID.push(4); 
        ruleID.push(5);
        
        var ruleBase = new Array();
        ruleBase.push(200);
        ruleBase.push(400);
        ruleBase.push(500);
        ruleBase.push(1000);
        ruleBase.push(2000);
        ruleBase.push(4000);
        
        PathStr = 'ScrollView/view/content/NdChild/BaseScore/BaseScore/';

        var isExitBase = false;
        var checkedIndex = 0;
        for (var i = 0 ; i < ruleBase.length ; i++)
        {
            var tempStr = ruleBase[i] + ''

            var PathStr = 'ScrollView/view/content/NdChild/BaseScore/BaseScore/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = tempStr;

            if(this.$(PathStr+'@Toggle').isChecked) 
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
            this.onUpdateBankerScoreRule(ruleBase[checkedIndex]);
        }
    },

    //上庄限制
    onUpdateBankerScoreRule:function(baseScore){
        var ruleID = new Array();
        ruleID.push(24);
        ruleID.push(25);
        ruleID.push(26);
        ruleID.push(27);
        
        var ruleString = new Array();
        ruleString.push(baseScore);
        ruleString.push(baseScore * 2);
        ruleString.push(baseScore * 3);
        ruleString.push(baseScore * 4);

        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/BankerScore/BankerScore/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i];

            if(this.$(PathStr+'@Toggle').isChecked) 
                this.$('ScrollView/view/content/NdView/BankerScore/Label@Label').string = ruleString[i];
        }
    },

    //最小下注
    onUpdateMinBetRule:function(){
        var ruleID = new Array();
        ruleID.push(6); 
        ruleID.push(7); 
        ruleID.push(8); 
        ruleID.push(9); 
        ruleID.push(10); 
        ruleID.push(11);
        ruleID.push(12); 
        ruleID.push(13); 
        ruleID.push(14); 
        
        var ruleBase = new Array();
        ruleBase.push("2%");
        ruleBase.push("3%");
        ruleBase.push("4%");
        ruleBase.push("5%");
        ruleBase.push("6%");
        ruleBase.push("7%");
        ruleBase.push("8%");
        ruleBase.push("9%");
        ruleBase.push("10%");
        
        PathStr = 'ScrollView/view/content/NdChild/MinBetMode/MinBetMode/';

        for (var i = 0 ; i < ruleBase.length ; i++)
        {
            var tempStr = ruleBase[i];

            var PathStr = 'ScrollView/view/content/NdChild/MinBetMode/MinBetMode/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = tempStr;

            if(this.$(PathStr+'@Toggle').isChecked) 
            {
                this.$('ScrollView/view/content/NdView/MinBetMode/Label@Label').string = tempStr;
            }
        }
    },

    //房费
    onUpdatePayModeRule:function(PlayerCnt,GameCnt){
        var costNum = 1;
        var costAANum = 1;
        
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

    //王赖
    onUpdateKingRule:function(){
        var ruleID = new Array();
        ruleID.push(200);
        ruleID.push(201);
        ruleID.push(202);
        
        var ruleString = new Array();
        ruleString.push('无'); 
        ruleString.push('经典'); 
        ruleString.push('疯狂'); 

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
    
    //特殊牌型
    onUpdateCardTypeRule:function(TimesMode){
        var ruleID = new Array();
        ruleID.push(111);
        ruleID.push(112);
        ruleID.push(113);
        ruleID.push(114);
        ruleID.push(115);
        ruleID.push(116);
        ruleID.push(117);
        ruleID.push(118);

        var ruleTimes = new Array();
        switch (TimesMode)
        {
            //牛牛4倍和3倍
            case 1:
                ruleTimes.push('5');
                ruleTimes.push('5');
                ruleTimes.push('6');
                ruleTimes.push('7');
                ruleTimes.push('8');
                ruleTimes.push('10');
                ruleTimes.push('10');
                ruleTimes.push('7');
                break;
            //牛牛5倍
            case 2:
                ruleTimes.push('6');
                ruleTimes.push('6');
                ruleTimes.push('7');
                ruleTimes.push('8');
                ruleTimes.push('9');
                ruleTimes.push('10');
                ruleTimes.push('10');
                ruleTimes.push('8');
                break;
            //牛牛10倍
            case 3:
                ruleTimes.push('11');
                ruleTimes.push('11');
                ruleTimes.push('12');
                ruleTimes.push('13');
                ruleTimes.push('14');
                ruleTimes.push('15');
                ruleTimes.push('15');
                ruleTimes.push('13');
                break;
        }
        
        var ruleString = new Array();
        ruleString.push('顺子牛X');
        ruleString.push('五花牛X');
        ruleString.push('同花牛X');
        ruleString.push('葫芦牛X');
        ruleString.push('炸弹牛X');
        ruleString.push('五小牛X');
        ruleString.push('同花顺X');
        ruleString.push('四十牛X');

        for (var i=0;i<ruleID.length;i++)
        {
            var PathStr = 'ScrollView/view/content/NdChild/CardType/CardType/' + ruleID[i];

            this.$(PathStr + '/Label@Label').string = ruleString[i] + ruleTimes[i];

            this.$('ScrollView/view/content/NdView/CardType/Label' + i).active = this.$(PathStr+'@Toggle').isChecked && this.$(PathStr).active;
            this.$('ScrollView/view/content/NdView/CardType/Label' + i +'@Label').string = ruleString[i] + ruleTimes[i];

        }
    },

    //牌型倍数
    onUpdateTimesModeRule:function(){
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

        this.onUpdateCardTypeRule(chooseTimeMode);
    },

    //高级
    onUpdateOtherRule:function(){
        var ruleID = new Array();
        ruleID.push(119);
        ruleID.push(120);
        ruleID.push(121);
        ruleID.push(122);
        ruleID.push(123);
        
        var ruleString = new Array();
        ruleString.push('快速模式');
        ruleString.push('中途禁入');
        ruleString.push('禁止搓牌');
        ruleString.push('禁用表情');
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
