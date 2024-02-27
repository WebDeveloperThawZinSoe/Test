var RulesKey = QPName + '_Rules_';
var RulesKey2 = QPName + '_S_Rules_';
cc.Class({
    extends: cc.SubRoomRules,

    properties: {
        m_RoomCaedLabel: cc.Label,

    },
    //1000-1031 服务器规则  1050-1099 对应规则
    //1000 =>AA付           1050 =>房主付
    //1001 =>代开           1051 =>房主进入
    //1002 =>积分房间       1003 =>金币房间       1052 =>练习房间
    onLoad: function() {

    },

    ctor: function () {
        this.m_bNeedUpdate = false;
        this.m_bFirstShow = true;

        //对立规则 非计算索引需 大于 32
        this.m_CheckMap = new Object();
        this.m_CheckMap[10003] = new Array(
            [3,33],//8/10 人
            [4,34],//倍数牛牛X4/ 牛牛X3
        );
        this.m_CheckMap[6] = new Array(
            // [12,33],
        );
        this.m_CheckMap2 = [
            [100, 150],
            [101, 100],
            [102, 152],
            [103, 152]];

        this.m_GuoDiArr = [10, 20, 30, 50];//Normal; Special need multiply 10


        if ( this.m_BtDropDownBG) {
            this.m_BtDropDownBG.height = 40;
        }

      
    },
    //添加对立规则数组索引
    CheckToggle: function(ArrIndex, JS) {
        for (var i in this.m_CheckMap) {
            for (var j in this.m_CheckMap[i]) {
                if (JS.node.name == this.m_CheckMap[i][j][1]) this.m_CheckMap[i][j][2] = ArrIndex;
            }
        }
        // for (var i in this.m_CheckMap2) {
        //     if (JS.node.name == this.m_CheckMap2[i][1]) this.m_CheckMap2[i][2] = ArrIndex;
        // }
    },
    OnShowView: function () {
        //初始化数据
        if (this.m_togArr == null) {
            this.m_togArr = this.node.getComponentsInChildren(cc.Toggle);
            for (var i in this.m_togArr) {
                this.CheckToggle(i, this.m_togArr[i]);
            }
        }
        var rules = cc.sys.localStorage.getItem(RulesKey + this.m_KindID);
        var rules2 = cc.sys.localStorage.getItem(RulesKey2 + this.m_KindID);
        this.m_bNeedUpdate = true;
        this.m_bFirstShow = false;
        return
        //还原选项
        // for (var i in this.m_togArr) {
        //     if (rules == null || !this.m_bFirstShow) break;
        //     var rulesIndex = parseInt(this.m_togArr[i].node.name);
        //     if (rulesIndex < 32) {
        //         //游戏规则
        //         if (rules & (1 << rulesIndex)) {
        //             this.m_togArr[i].check();
        //         } else {
        //             if (this.m_togArr[i].toggleGroup == null || this.m_togArr[i].toggleGroup.allowSwitchOff) { //复选框
        //                 this.m_togArr[i].isChecked = false;
        //             } else if (this.m_CheckMap[this.m_KindID] != null) { //对立规则勾选
        //                 for (var j in this.m_CheckMap[this.m_KindID]) {
        //                     if (this.m_CheckMap[this.m_KindID][j][0] == rulesIndex) {
        //                         this.m_togArr[this.m_CheckMap[this.m_KindID][j][2]].check();
        //                     }
        //                 }
        //             }
        //         }
        //     } else if (rulesIndex >= 100 && rulesIndex < 150) {
        //         //服务器规则
        //         if (rules2 & (1 << (rulesIndex - 100))) {
        //             this.m_togArr[i].check();
        //         } else {
        //             if (this.m_togArr[i].toggleGroup == null || this.m_togArr[i].toggleGroup.allowSwitchOff) { //复选框
        //                 this.m_togArr[i].isChecked = false;
        //             } else { //对立规则勾选
        //                 // for (var j in this.m_CheckMap2) {
        //                 //     if (this.m_CheckMap2[j][0] == rulesIndex) {
        //                 //         this.m_togArr[this.m_CheckMap2[j][2]].check();
        //                 //     }
        //                 // }
        //             }
        //         }
        //     }
        // }

    },
    OnHideView: function () {
        this.getServerRules();
        this.node.active = false;
    },
    SetClubView: function (RoomType,Hook) {
       //this.node.getChildByName('ScrollView/view/content/Senior').active = RoomType;
       this.m_bNeedUpdate = true;
       this.m_Hook = Hook;
    },
    OnToggleClick: function (Tag, Data) {
        this.m_bNeedUpdate = true;

    },
    getRulesEx:function(bLog){
        var rules = [0,0,0,0,0,0];
        for(var i in this.m_togArr){
            if(this.m_togArr[i].node.active && this.m_togArr[i].isChecked){
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                //if(bLog&&LOG_NET_DATA)console.log(rulesIndex+" ==> "+this.$('Label@Label',this.m_togArr[i].node).string);
                if(rulesIndex>=1000){
                    if(rulesIndex <= 1031) rules[5] += 1 << (rulesIndex-1000);
                }else{
                    var rIndex = parseInt(rulesIndex/100);
                    var rValue = parseInt(rulesIndex%100);
                    if(rValue<=31) rules[rIndex] += 1 << rValue;
                }
            }
        }
        if(this.$('ScrollView/view/content/Senior')&&this.$('ScrollView/view/content/Senior').active){
            return;
            var winner = parseFloat(this.m_MaxFixedScore.string);
            var AA = parseFloat(this.m_MaxFixedAAScore.string);
            var winnerPercentage = parseInt(this.m_MaxPercentageScore.string);

            if(winner > 0) {} else {winner = 0};
            if(AA > 0) {} else {AA = 0};
            if(winnerPercentage > 0) {} else {winnerPercentage = 0};
            winner *= 10;
            AA *= 10;
            rules[2] = (winner)|(AA<<8)|(winnerPercentage<<16);
         
            var BottomScore = parseFloat(this.m_BottomScore.string);//底分
            var TuoGuanTime = parseInt(this.m_TuoGuanTime.string);//托管时间
           // var OutScore = parseInt(this.m_OutScore.string);//离场分数
            //var IntoScore = parseInt(this.m_IntoScore.string);//入场分数
            BottomScore *= 100;
            rules[3] = BottomScore;
            rules[1] |= (TuoGuanTime<<8);

            if(rules[2] == NaN) rules[2] = 0;
            if(rules[3] == NaN) rules[3] = 0;
         }
       
        cc.sys.localStorage.setItem(RulesKey + this.m_KindID, JSON.stringify(rules));
        return rules;
    },

    getSeniorRulesEx:function(){
        return;
        var rules = [0,0,0,0,0,0];
         rules[0] = parseInt(this.m_OutScore.string);//离场分数
         rules[1] = parseInt(this.m_IntoScore.string);//入场分数
        return rules;
    },
    getServerRules:function(){
        var rules = 0;
        for(var i in this.m_togArr){
            if(this.m_togArr[i].node.active && this.m_togArr[i].isChecked){
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                if(rulesIndex < 1000 || rulesIndex >= 1050) continue;
                 console.log(rulesIndex + ' ==> ' + this.m_togArr[i].node.getChildByName('Label').getComponent(cc.Label).string);
                rulesIndex -= 1000;
                rules += 1 << rulesIndex;
            }
        }
        cc.sys.localStorage.setItem(RulesKey2 + this.m_KindID, rules);

        return rules;
    },
    update: function (dt) {
        if (this.m_bNeedUpdate) {
            this.m_bNeedUpdate = false;
        } else {
            return;
        }


        this.SetGray();
        this.UpdateZMZ();  
        for (var i in this.m_togArr) {
            if (!this.m_togArr[i].node.active) continue;
            var color = this.m_togArr[i].isChecked ?/*cc.color(219,179,157)*/cc.color(208, 185, 239) : cc.color(208, 185, 239);
            // this.m_togArr[i].node.getChildByName('Label').color = color;
        }

    },


    UpdateZMZ: function () {
        if (this.m_KindID != 33301) return;
        if (this.$('ScrollView/view/content/GameCount/1011@Toggle').isChecked) 
            this.m_RoomCaedLabel.string = '（4钻石）';
        else 
            this.m_RoomCaedLabel.string = '（8钻石）';    
            
            var Path = "ScrollView/view/content/";
            if (this.$(Path+'GameRules3/23@Toggle').isChecked) {
                this.$(Path+'GameRules6/24').active = true; 
                this.$(Path+'GameRules6/277').active = true; 
            } else {
                this.$(Path+'GameRules6/24').active = false; 
                this.$(Path+'GameRules6/277').active = false; 
            }
            if (this.$(Path+'GameRules3/19@Toggle').isChecked) {
                this.$(Path+'GameRules4/20').active = true; 
                this.$(Path+'GameRules4/211').active = true; 
            } else {
                this.$(Path+'GameRules4/20').active = false; 
                this.$(Path+'GameRules4/211').active = false; 
            }
            if (this.$(Path+'GameRules3/21@Toggle').isChecked) {
                this.$(Path+'GameRules5/22').active = true; 
                this.$(Path+'GameRules5/244').active = true; 
            } else {
                this.$(Path+'GameRules5/22').active = false; 
                this.$(Path+'GameRules5/244').active = false; 
            }
    },

    SetGray: function () {
        for (var i in this.m_togArr) {
            if (!this.m_togArr[i].node.active) continue;
            for (var j in this.m_togArr[i].children)
                this.m_togArr[i].children[j].color = this.m_togArr[i].interactable ? cc.color(208, 185, 239) : cc.color(208, 185, 239);
        }
    },
//=========

    onBtDropDown:function(){

    },
    onBtDropDownJu:function(){

    },
    OnToggleClick:function(Tag, Data){
        this.m_bNeedUpdate = true;

        var NdChild = this.$('NdChild');
        if(NdChild){
            for(var i=0;i<NdChild.childrenCount;i++){
                NdChild.children[i].setPositionX(2000);
            }
        }
  
    },
    getLiChangScore:function(){
        //return parseInt(4*this.m_LiChangRuleScore*this.m_LiChangJuScore);
    },

    OnClick_ShowChildNode:function(Tag){
        var NdChild = this.$('ScrollView/view/content/NdChild');
        if(NdChild){
            for(var i=0;i<NdChild.childrenCount;i++){
                if(NdChild.children[i].name == Tag.currentTarget.name) NdChild.children[i].setPositionX(-20);
            }
        }
    },

    OnClick_ShowClubNode:function(Tag){
        this.$('ScrollView/view/content/ClubNode').active = false;
    },
});
