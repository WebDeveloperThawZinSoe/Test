cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    ctor:function(){
        this._Time = 0;
    },

    onLoad:function(){
    },

    OnShowView:function(){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'AndroidRecordItem',this);
        this.onGetRecordInfo();
    },

    OnBtShowTime:function(){
        this.$('Time').x = 0;
    },
    OnBtHideTime:function(){
        this.$('Time').x = 2000;
    },
    OnClick_Tag:function(_,data){
        this.OnBtHideTime();
        var str = '今天';
        if(data == 0 ){
            str = '今天';
        }else if(data == 2 ){
            str = '2天';
        }else if(data == 3){
            str = '3天';
        }else if(data == 5){
            str = '5天';
        }else if(data == 7){
            str = '7天';
        }else if(data == 30){
            str = '1个月';
        }else{
            str = '全部';
        }
        this.$('Sub/BtTime/Background/Label@Label').string = str;
        if(data<7){
            this._Time = parseInt(data);
        }else if(data == 7){
            this._Time = 10;
        }else if(data == 30){
            this._Time = 100;
        }else{
            this._Time = 1000;
        }
        this.onGetRecordInfo();
    },
    onGetRecordInfo:function(){
        this.m_ListCtrl.InitList(0, 'AndroidRecordItem',this);
        var ClubID = g_ShowClubInfo.dwClubID;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/ClubAndroid.php?&GetMark=3&dwUserID='+pGlobalUserData.dwUserID;
        webUrl += '&dwClubID='+ClubID;
        webUrl += '&dwTime='+this._Time;
        
        WebCenter.GetData(webUrl, null, function (data) {
            var RecordArr = JSON.parse(data);
            this.m_ListCtrl.InsertListInfoArr(0,RecordArr);
            
            var AllWin = 0;
            var AllDraw = 0;
            var AllScore1 = 0;
            var AllScore2 = 0;
            var AllScore3 = 0;
            for (const i in RecordArr) {
                AllWin += RecordArr[i][1];
                AllDraw += RecordArr[i][2];
                AllScore1 += RecordArr[i][3];
                AllScore2 += RecordArr[i][4];
                AllScore3 += parseInt(RecordArr[i][5]);
            }
            
            this.onSetAllInfo(AllWin,AllDraw,AllScore1,AllScore2,AllScore3);
        }.bind(this));

    },
    
    onSetAllInfo:function(AllWin,AllDraw,AllScore1,AllScore2,AllScore3){
        this.$('Sub/AllLab/AllWin@Label').string = AllWin;
        this.$('Sub/AllLab/AllDraw@Label').string = AllDraw;
        this.$('Sub/AllLab/AllScore1@Label').string = Score2Str(parseInt(AllScore1));
        this.$('Sub/AllLab/AllScore2@Label').string = Score2Str(parseInt(AllScore2));
        this.$('Sub/AllLab/AllScore3@Label').string = Score2Str(parseInt(AllScore3));
    }
});
