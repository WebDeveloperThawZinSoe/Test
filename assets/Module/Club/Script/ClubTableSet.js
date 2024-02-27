
cc.Class({
    extends: cc.BaseClass,

    properties: {
        Lab1:cc.Label,
        Lab2:cc.Label,
        Lab3:cc.Label,
        Lab4:cc.Label,
        LabColor:cc.Label,
        Mode1:cc.Node,
        Mode2:cc.Node,
        Mode3:cc.Node,
        Mode4:cc.Node,
        Mode5:cc.Node,
        ED1:cc.EditBox,
        ED2:cc.EditBox,
        ED3:cc.EditBox,
        ED4:cc.EditBox,
        ED5:cc.EditBox,
        ED6:cc.EditBox,
        ED7:cc.EditBox,
        ED8:cc.EditBox,
    },
    onLoad:function () {
        this['1'] = ['大赢家','赢家','所有人'];
        this['2'] = ['固定赠送','比例赠送'];
        this['3'] = ['红色','绿色','蓝色'];
    },
    OnShowView:function(){
        this.ED1.string = '';
        this.ED2.string = '';
        this.ED3.string = '';
        this.ED4.string = '';
        this.ED5.string = '';
        this.ED6.string = '';
        this.ED7.string = '';
        this.ED8.string = '';
    },
    OnSetRuleInfor:function (wKindID,type,RoomInfor) {
        this.$('Node1').active = type>CLUB_KIND_0;
        this.RoomInfor = RoomInfor;
        // 负分显示
        var bMinusMark = false;
        for(var i in window.GameMinusMarkList){
            if(wKindID == window.GameMinusMarkList[i]){
                bMinusMark = true;
            }
        }
  
        this.$('Node1/Layout2').active = !bMinusMark;
        if(!RoomInfor) return;
        this.ED1.string = Score2Str(parseInt(RoomInfor.llSitScore));
        this.ED2.string = Score2Str(parseInt(RoomInfor.llStandScore));
        if(RoomInfor.dwBigRevRules&CLUB_GAME_RULE_1){
            this.OnBtTogClick(null,'1_1_0');
        }else if(RoomInfor.dwBigRevRules&CLUB_GAME_RULE_2){
            this.OnBtTogClick(null,'1_1_1');
        }else{
            this.OnBtTogClick(null,'1_1_2');
        }

        if(RoomInfor.dwBigRevRules&CLUB_GAME_RULE_4){
            this.OnBtTogClick(null,'2_2_0');
            this.ED4.string =Score2Str(parseInt(RoomInfor.dwBigCnt));
        }else{
            this.OnBtTogClick(null,'2_2_1');
            this.ED4.string =RoomInfor.dwBigCnt;
        }

        if(RoomInfor.dwSmallRevRules&CLUB_GAME_RULE_1){
            this.OnBtTogClick(null,'3_1_0');
        }else if(RoomInfor.dwSmallRevRules&CLUB_GAME_RULE_2){
            this.OnBtTogClick(null,'3_1_1');
        }else{
            this.OnBtTogClick(null,'3_1_2');
        }

        if(RoomInfor.dwSmallRevRules&CLUB_GAME_RULE_4){
            this.OnBtTogClick(null,'4_2_0');
            this.ED6.string =Score2Str(parseInt(RoomInfor.dwSmallCnt));
        }else{
            this.OnBtTogClick(null,'4_2_1');
            this.ED6.string =RoomInfor.dwSmallCnt;
        }

        this.ED3.string =Score2Str(parseInt(RoomInfor.dwBigMinScore));
        // this.ED4.string =RoomInfor.dwBigCnt;
        this.ED5.string =Score2Str(parseInt(RoomInfor.dwSmallMinScore));
        // this.ED6.string =RoomInfor.dwSmallCnt;

        if(RoomInfor.cbReturnType == 1){
            this.$('Node1/Layout1/Tog_1@Toggle').check();
        }else if(RoomInfor.cbReturnType == 2){
            this.$('Node1/Layout1/Tog_2@Toggle').check();
        }else{
            this.$('Node1/Layout1/Tog_3@Toggle').check();
        }
        if(RoomInfor.bNegativeScore){
            this.$('Node1/Layout2/Tog_1@Toggle').check();
        }else{
            this.$('Node1/Layout2/Tog_2@Toggle').check();
        }
        this.ED8.string = RoomInfor.dwMagnification;
        this.ED7.string = RoomInfor.szTag;
        
    },
    OnBtShowMode:function(_,Data){
        this['Mode'+Data].active = true;
    },
    OnBtTogClick:function(_,Data){
        var paraArr = Data.split('_');
        if(paraArr.length == 3){
            this['Lab'+paraArr[0]].string = this[paraArr[1]][paraArr[2]];
            this['Mode'+paraArr[0]].active = false;
        }else{
            this.LabColor.string = this[paraArr[0]][paraArr[1]];
            this.Mode5.active = false;
        }
    },
    OnClickClose:function(){
        this.Mode1.active = false;
        this.Mode2.active = false;
        this.Mode3.active = false;
        this.Mode4.active = false;
        this.Mode5.active = false;
    },
    CheckRules:function(){

        // if(this.$('Node1/Layout1/Tog_3@Toggle').isChecked && (this.$('BigMode/Mode/Tog2@Toggle').isChecked == false||this.$('BigWinOrAll/Mode/Tog2@Toggle').isChecked == false)){
        //     this.ShowAlert("输赢平摊模式只支持所有赢家百分比赠送的模式!");
        //     return false;
        // }
        // if(this.$('Node1/Layout1/Tog_3@Toggle').isChecked && (this.$('SmallMode/Mode/Tog2@Toggle').isChecked == false||this.$('SmallWinOrAll/Mode/Tog2@Toggle').isChecked == false)){
        //     this.ShowAlert("输赢平摊模式只支持所有赢家百分比赠送的模式!");
        //     return false;
        // }

        if(this.$('Node1/Layout1/Tog_3@Toggle').isChecked && this.$('BigWinOrAll/Mode/Tog3@Toggle').isChecked){
            this.ShowAlert("所有人不能选择输赢平摊模式!");
            return false;
        }
        if(this.$('Node1/Layout1/Tog_3@Toggle').isChecked && this.$('SmallWinOrAll/Mode/Tog3@Toggle').isChecked){
            this.ShowAlert("所有人不能选择输赢平摊模式!");
            return false;
        }

        if(this.$('BigMode/Mode/Tog2@Toggle').isChecked && this.$('BigWinOrAll/Mode/Tog3@Toggle').isChecked){
            this.ShowAlert("所有人只支持固定赠送!");
            return false;
        }
        if(this.$('SmallMode/Mode/Tog2@Toggle').isChecked && this.$('SmallWinOrAll/Mode/Tog3@Toggle').isChecked){
            this.ShowAlert("所有人只支持固定赠送!");
            return false;
        }
        if(parseInt(this.ED4.string)>0 && parseInt(this.ED6.string)>0){
            this.ShowAlert("大小局不能同时设置！");
            return false;
        }
        return true;
    },

    GetRules:function(){
        if(this.CheckRules() == false) return null;
        var Obj = {};
        Obj.llSitScore = this.ED1.string == ''?0:parseInt(this.ED1.string);        //参与分
        Obj.llStandScore = this.ED2.string == ''?0:parseInt(this.ED2.string);      //淘汰分

        Obj.dwBigRevRules = 0;     //大局表情规则
        if(this.$('BigWinOrAll/Mode/Tog1@Toggle').isChecked){
            Obj.dwBigRevRules |= CLUB_GAME_RULE_1;
        }else if(this.$('BigWinOrAll/Mode/Tog2@Toggle').isChecked){
            Obj.dwBigRevRules |= CLUB_GAME_RULE_2;
        }else{
            Obj.dwBigRevRules |= CLUB_GAME_RULE_3;
        }

        if(this.$('BigMode/Mode/Tog1@Toggle').isChecked){
            Obj.dwBigRevRules |= CLUB_GAME_RULE_4;
        }else{
            Obj.dwBigRevRules |= CLUB_GAME_RULE_5;
        }

        Obj.dwBigMinScore = this.ED3.string == ''?0:parseInt(this.ED3.string);     //大局表情起曾分
        Obj.dwBigCnt = this.ED4.string == ''?0:parseInt(this.ED4.string);          //大局百分比或固定数量

        Obj.dwSmallRevRules = 0;     //小局表情规则
        if(this.$('SmallWinOrAll/Mode/Tog1@Toggle').isChecked){
            Obj.dwSmallRevRules |= CLUB_GAME_RULE_1;
        }else if(this.$('SmallWinOrAll/Mode/Tog2@Toggle').isChecked){
            Obj.dwSmallRevRules |= CLUB_GAME_RULE_2;
        }else{
            Obj.dwSmallRevRules |= CLUB_GAME_RULE_3;
        }

        if(this.$('SmallMode/Mode/Tog1@Toggle').isChecked){
            Obj.dwSmallRevRules |= CLUB_GAME_RULE_4;
        }else{
            Obj.dwSmallRevRules |= CLUB_GAME_RULE_5;
        }

        Obj.dwSmallMinScore = this.ED5.string == ''?0:parseInt(this.ED5.string);     //小局表情起曾分
        Obj.dwSmallCnt = this.ED6.string == ''?0:parseInt(this.ED6.string);          //小局百分比或固定数量

        Obj.cbReturnType = this.$('Node1/Layout1/Tog_1@Toggle').isChecked?1:(this.$('Node1/Layout1/Tog_2@Toggle').isChecked?2:3);        //反水类型
        Obj.bNegativeScore = this.$('Node1/Layout2/Tog_1@Toggle').isChecked;        //负分
        Obj.dwMagnification = this.ED8.string == ''?1:parseInt(this.ED8.string);       //倍率
        Obj.szTag = this.ED7.string;                //标签

        if((Obj.dwBigRevRules&CLUB_GAME_RULE_5) && (Obj.dwBigCnt>100||Obj.dwBigCnt<0)){
            this.ShowAlert("比例赠送，赠送数值不能大于100！");
            return null;
        }
        if((Obj.dwSmallRevRules&CLUB_GAME_RULE_5) && (Obj.dwSmallCnt>100||Obj.dwSmallCnt<0)){
            this.ShowAlert("比例赠送，赠送数值不能大于100！");
            return null;
        }
        return Obj;
    },

    OnSendCulbRule:function(){
        var Rule = this.GetRules();
        if(Rule == null) return;
        if(this.RoomInfor){
            Rule.RoomID = this.RoomInfor.dwRoomID;
            this.m_Hook.OnSendModifyTableRule(Rule);
        }else{
            this.m_Hook.OnSendCreateRoom(Rule);
        }
        this.HideView();
    },

});
