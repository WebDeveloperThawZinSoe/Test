var RulesKey = window.QPName+'_Rules_'//nzy
var RulesKey2 = window.QPName+'_S_Rules_'
cc.Class({
    extends: cc.SubRoomRules,

    properties: {
    },
    //1000-1031 服务器规则  1050-1099 对应规则
    //1000 =>AA付           1050 =>房主付
    //1001 =>代开           1051 =>房主进入
    //1002 =>积分房间       1003 =>金币房间       1052 =>练习房间
    ctor:function(){
        this.m_bNeedUpdate = false;
        this.m_bFirstShow = true;

        //对立规则 非计算索引需 大于 32
        this.m_CheckMap = new Object();
        this.m_CheckMap[10011] = new Array(
           // [12,33],
        );
        this.m_CheckMap2 =  new Array(
            [1000,1050],
            [1001,1051],
            [1002,1052],
            [1003,1052],
        );
    },
    //添加对立规则数组索引
    CheckToggle(ArrIndex, JS){
        for(var i in this.m_CheckMap){
            for(var j in this.m_CheckMap[i]){
                if(JS.node.name == this.m_CheckMap[i][j][1]) this.m_CheckMap[i][j][2] = ArrIndex;
            }
        }
        for(var i in this.m_CheckMap2){
            if(JS.node.name == this.m_CheckMap2[i][1]) this.m_CheckMap2[i][2] = ArrIndex;
        }
    },
    OnShowView:function(){
        //初始化数据
        if(this.m_togArr == null){
            this.m_togArr = this.node.getComponentsInChildren(cc.Toggle);
            for(var i in this.m_togArr){
                this.CheckToggle(i, this.m_togArr[i]);
            }
        }
        this.m_bNeedUpdate = true;
        this.m_bFirstShow = false;
        return
        var rules = cc.sys.localStorage.getItem(RulesKey + this.m_KindID);
        var rules2 = cc.sys.localStorage.getItem(RulesKey2 + this.m_KindID);
        //还原选项
        for(var i in this.m_togArr){
            if(rules == null || !this.m_bFirstShow) break;
            var rulesIndex =　parseInt(this.m_togArr[i].node.name);
            if(rulesIndex < 32){  
                //游戏规则
                if(rules & (1 << rulesIndex)){
                    this.m_togArr[i].check();
                }else{
                    if( this.m_togArr[i].toggleGroup == null || this.m_togArr[i].toggleGroup.allowSwitchOff){ //复选框
                        this.m_togArr[i].isChecked = false;
                    } else if (this.m_CheckMap[this.m_KindID] != null){ //对立规则勾选
                        for(var j in this.m_CheckMap[this.m_KindID]){
                            if( this.m_CheckMap[this.m_KindID][j][0] == rulesIndex){
                                this.m_togArr[this.m_CheckMap[this.m_KindID][j][2]].check();
                            }
                        }
                    }
                }
            }else if(rulesIndex >= 100 &&　rulesIndex < 150){ 
                //服务器规则
                if(rules2 & (1 << (rulesIndex - 100) )){
                    this.m_togArr[i].check();
                }else{
                    if( this.m_togArr[i].toggleGroup == null || this.m_togArr[i].toggleGroup.allowSwitchOff){ //复选框
                        this.m_togArr[i].isChecked = false;
                    } else { //对立规则勾选
                        for(var j in this.m_CheckMap2){
                            if( this.m_CheckMap2[j][0] == rulesIndex){
                                this.m_togArr[this.m_CheckMap2[j][2]].check();
                            }
                        }
                    }
                }
            }
        }
        this.m_bNeedUpdate = true;
        this.m_bFirstShow = false;
    },
    OnHideView:function(){
        this.getRulesEx();
        this.getServerRules();
        this.node.active = false;
    },
    SetClubView:function(RoomType){
        this.$('ClubNode').active = RoomType == 1;
        var NdEnter = this.$('ClubNode/Enter')
        for(var i=0; i<NdEnter.childrenCount; i++){
            NdEnter.children[i].active = RoomType == 1;
        }
        this.m_bNeedUpdate = true;
    },
    OnToggleClick:function(Tag, Data){
        if(Data != 1)  this.m_bNeedUpdate = true;
    },
    OnToggleClickCard:function(Tag, Data){
        if(Data==0){
            this.$('Base/6@Toggle').isChecked = false;
        }else{
            this.$('Base/5@Toggle').isChecked = false;

        }
    },
    getRulesEx:function(bLog){
        var rules = [0,0,0,0,0,0];
        for(var i in this.m_togArr){
            if(this.m_togArr[i].node.active && this.m_togArr[i].isChecked){
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                if(bLog&&LOG_NET_DATA)console.log(rulesIndex+" ==> "+this.$('Label@Label',this.m_togArr[i].node).string);
                if(rulesIndex>=1000){
                    if(rulesIndex <= 1031) rules[5] += 1 << (rulesIndex-1000);
                }else{
                    var rIndex = parseInt(rulesIndex/100);
                    var rValue = parseInt(rulesIndex%100);
                    if(rValue<=31) rules[rIndex] += 1 << rValue;
                }
            }
        }
    
        cc.sys.localStorage.setItem(RulesKey + this.m_KindID, JSON.stringify(rules));
        return rules;
    },
    getServerRules:function(){
        var rules = 0;
        for(var i in this.m_togArr){
            if(this.m_togArr[i].node.active && this.m_togArr[i].isChecked){
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                if(rulesIndex < 1000 || rulesIndex >= 1050) continue;
                rulesIndex -= 1000;
                rules += 1 << rulesIndex;
            }
        }
        cc.sys.localStorage.setItem(RulesKey2 + this.m_KindID, rules);
        
        return rules;
    },
    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }

        // for(var i in this.m_togArr){
        //     if(!this.m_togArr[i].node.active) continue;
        //     var color = this.m_togArr[i].isChecked?cc.color(208,185,239):cc.color(208,185,239);
        //     this.m_togArr[i].node.getChildByName("Label").color = color
        // }

        if(this.$("Card2/17@Toggle").isChecked){
            this.$("Card2/18").active = true;
            this.$("Card2/19").active = true;
            this.$("Card2/20").active = true;
        }else{
            this.$("Card2/18").active = false;
            this.$("Card2/19").active = false;
            this.$("Card2/20").active = false;
        }
        if(this.$("PayWay/1050@Toggle").isChecked){
            this.$("Game/1020/Label@Label").string = "6局*1钻";
            this.$("Game/1021/Label@Label").string = "12局*12钻";
            this.$("Game/1022/Label@Label").string = "18局*16钻";
            this.$("Game/1023/Label@Label").string = "24局*4钻";
        }else{
            this.$("Game/1020/Label@Label").string = "6局*1钻";
            this.$("Game/1021/Label@Label").string = "12局*4钻";
            this.$("Game/1022/Label@Label").string = "18局*4钻";
            this.$("Game/1023/Label@Label").string = "24局*1钻";
        }
    
    },
});
