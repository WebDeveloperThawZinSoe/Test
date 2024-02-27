var RulesKey = QPName+'_Rules_'
var RulesKey2 = QPName+'_S_Rules_'
cc.Class({
    extends: cc.SubRoomRules,

    properties: {      
        m_sitScore:cc.EditBox,
    },
    //100-131 服务器规则  150-199 对应规则
    //100 =>AA付            150 =>房主付
    //101 =>代开            151 =>房主进入
    //102 =>积分房间        103 =>金币房间       152 =>练习房间
    //104 =>百人积分房间     105 =>百人金币房间 
    ctor:function(){
        this.m_bNeedUpdate = false;
        this.m_bFirstShow = true;

        //对立规则 非计算索引需 大于 32
        this.m_CheckMap = new Object();
        this.m_CheckMap[10020] = new Array(
            [3,33],//8/10 人
            [4,34],//倍数牛牛X4/ 牛牛X3
        );
        this.m_CheckMap2 =  new Array(
            [100,150],
            [101,151],
            [102,152],
            [103,152],
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
    getRulesEx:function(bLog){
        var rules = [0,0,0,0,0];
        var ruleshistory = new Array();
        for(var i in this.m_togArr){
            if(this.m_togArr[i].node.active && this.m_togArr[i].isChecked){
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                ruleshistory.push(rulesIndex);
                if(bLog&&LOG_NET_DATA)console.log(rulesIndex+" ==> "+this.$('Label@Label',this.m_togArr[i].node).string);
                if(rulesIndex<1000){
                    var rIndex = parseInt(rulesIndex/100);
                    var rValue = parseInt(rulesIndex%100);
                    if(rValue<=31&&rIndex<5) rules[rIndex] += 1 << rValue;
                }
            }
        }
        this.GetCustomRules(rules);
        cc.sys.localStorage.setItem(this.m_KeyStr, JSON.stringify(ruleshistory));
        rules[2] = this.m_sitScore.string;
        if(rules[2]>0){}else{rules[2] = 0}
        return rules;
    },
    OnShowView:function(){
        //初始化数据
        if(this.m_togArr == null){
            this.m_togArr = this.node.getComponentsInChildren(cc.Toggle);
            for(var i in this.m_togArr){
                this.CheckToggle(i, this.m_togArr[i]);
            }
        }
        var rules = cc.sys.localStorage.getItem(RulesKey + this.m_KindID);
        var rules2 = cc.sys.localStorage.getItem(RulesKey2 + this.m_KindID);
        // //还原选项
        // for(var i in this.m_togArr){
        //     if(rules == null || !this.m_bFirstShow) break;
        //     var rulesIndex =　parseInt(this.m_togArr[i].node.name);
        //     if(rulesIndex < 32){  
        //         //游戏规则
        //         if(rules & (1 << rulesIndex)){
        //             this.m_togArr[i].check();
        //         }else{
        //             if( this.m_togArr[i].toggleGroup == null || this.m_togArr[i].toggleGroup.allowSwitchOff){ //复选框
        //                 this.m_togArr[i].isChecked = false;
        //             }
        //             //   else if (this.m_CheckMap[this.m_KindID] != null){ //对立规则勾选
        //             //      for(var j in this.m_CheckMap[this.m_KindID]){
        //             //          if( this.m_CheckMap[this.m_KindID][j][0] == rulesIndex){
        //             //              this.m_togArr[this.m_CheckMap[this.m_KindID][j][2]].check();
        //             //          }
        //             //      }
        //             //  }
        //         }
        //     }else if(rulesIndex >= 100 &&　rulesIndex < 150){ 
        //         //服务器规则
        //         if(rules2 & (1 << (rulesIndex - 100) )){
        //             this.m_togArr[i].check();
        //         }else{
        //             if( this.m_togArr[i].toggleGroup == null || this.m_togArr[i].toggleGroup.allowSwitchOff){ //复选框
        //                 this.m_togArr[i].isChecked = false;
        //             } 
        //             else { //对立规则勾选
        //                 for(var j in this.m_CheckMap2){
        //                     if( this.m_CheckMap2[j][0] == rulesIndex){
        //                         this.m_togArr[this.m_CheckMap2[j][2]].check();
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }
        this.m_bNeedUpdate = true;
        this.m_bFirstShow = false;
    },
    OnHideView:function(){
        this.getRules();
        this.getServerRules();
        this.node.active = false;
    },
    SetClubView:function(RoomType){
        this.$('ClubNode').active = RoomType == 1;
        this.m_bNeedUpdate = true;
    },
    OnToggleClick:function(Tag, Data){
        this.m_bNeedUpdate = true;
    },
    getRules:function(bLog){
        var rules = 0;
        for(var i in this.m_togArr){
            if(this.m_togArr[i].node.active && this.m_togArr[i].isChecked){
                var rulesIndex = parseInt(this.m_togArr[i].node.name);
                //if(bLog)if(LOG_NET_DATA)console.log(rulesIndex+" ==> "+this.m_togArr[i].node.getChildByName("Label").getComponent(cc.Label).string)
                if(rulesIndex <= 32) rules += 1 << rulesIndex;
            }
        }
        cc.sys.localStorage.setItem(RulesKey + this.m_KindID, rules);
        return rules;
    },
    // getServerRules:function(){
    //     var rules = 0;
    //     for(var i in this.m_togArr){
    //         if(this.m_togArr[i].node.active && this.m_togArr[i].isChecked){
    //             var rulesIndex = parseInt(this.m_togArr[i].node.name);
    //             if(rulesIndex < 100 || rulesIndex >= 150) continue;
    //             rulesIndex -= 100;
    //             rules += 1 << rulesIndex;
    //         }
    //     }
    //     cc.sys.localStorage.setItem(RulesKey2 + this.m_KindID, rules);
        
    //     return rules;
    // },

    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }

        // for(var i in this.m_togArr){
        //     if(!this.m_togArr[i].node.active) continue;
        //     var color = this.m_togArr[i].isChecked?cc.color(172,63,40):cc.color(175, 118, 86);
        //     this.m_togArr[i].node.getChildByName("Label").color = color
        // }

        this.CheckDel();
    },
    CheckDel:function(){
        
    },

});
