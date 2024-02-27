cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_MsgBg: cc.Sprite,
        m_LabMsg: cc.Label
    },
    ctor: function () {
        this.m_MsgMap = new Object();
        this.m_TurnArr = new Array();
        this.m_bFrist = true;
        this.m_bPlayTurn = false;
    },
    start: function () {
        //设置定时
        // this.m_MsgBg.enabled = false;
        this.UpdateMsg();
        this.schedule(this.UpdateMsg, 120);
        // this.schedule(this.CheckMsgLine, 5);
    },

    UpdateMsg: function () {
        var Arr = new Array();
        for (var i in this.m_MsgMap) Arr.push(i);

        var webUrl = window.PHP_HOME + '/UserFunc.php?GetMark=8&Arr=' + JSON.stringify(Arr);
        WebCenter.GetData(webUrl, null, function (data) {
            var Ud = JSON.parse(data);
            for (var i in Ud.New) {
                this.m_MsgMap[i] = new Array();
                this.m_MsgMap[i].Rate = Ud.New[i].Rate * 1000; //分钟 ->毫秒
                this.m_MsgMap[i].Msg = Ud.New[i].Msg;
                this.m_MsgMap[i].LPT = 0; //last play time
            }
            for (var i in Ud.Del) {
                delete this.m_MsgMap[Ud.Del[i]];
            }
            // if (this.m_TurnArr.length == 0) this.CheckMsgLine();

            if(Object.keys(this.m_MsgMap).length > 0 && (this.m_bFrist || this.m_TurnArr.length == 0)) {
                this.m_bFrist = false;
                this.CheckMsgLine();
                // this.unschedule(this.CheckMsgLine);
                // this.schedule(this.CheckMsgLine, 10);
            }
        }.bind(this));
    },

    CheckMsgLine: function () {
        var Data = new Date().getTime();
        var TempArr = new Array();
        for (var i in this.m_MsgMap) {
            if (Data - this.m_MsgMap[i].LPT > this.m_MsgMap[i].Rate) {
                this.m_TurnArr.push(i);
                this.m_MsgMap[i].LPT = Data;
            }
        }
        //if(!this.m_MsgBg.enabled ) this.ShowMsg();
        if (!this.m_bPlayTurn && this.m_TurnArr.length > 0) this.ShowMsg();
    },

    ShowMsg: function () {
        var MsgStr = null;
        while (this.m_TurnArr.length > 0 && MsgStr == null) {
            var msgInfo = this.m_MsgMap[this.m_TurnArr.shift()];
            if (msgInfo) MsgStr = msgInfo.Msg;
        }
        if (MsgStr == null) {
            this.m_bPlayTurn = false;
            this.CheckMsgLine();
            //this.m_MsgBg.enabled = false;
            return;
        }
        this.m_bPlayTurn = true;
        //this.m_MsgBg.enabled = true;
        this.m_LabMsg.node.stopAllActions();
        this.m_LabMsg.string = MsgStr;
        this.m_LabMsg.node.x = (this.$('Mark').width);

        this.scheduleOnce(function() {
            var act = cc.sequence(cc.moveTo(0, cc.v2(this.$('Mark').width, 0)), cc.moveTo((this.m_LabMsg.node.width + this.$('Mark').width) / 160, cc.v2(-this.m_LabMsg.node.width, 0)));
            var callback = cc.callFunc(this.ShowMsg.bind(this))
            this.m_LabMsg.node.runAction(cc.sequence(act, cc.delayTime(10), callback));
        }.bind(this), 0.0001);
    },

});
