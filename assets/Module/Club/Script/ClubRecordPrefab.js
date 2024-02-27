cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_LabIndex:cc.Label,
        m_LabRoom:cc.Label,
        m_LabTime:cc.Label,
        m_LabGameCount:cc.Label,
        m_LabGameKind:cc.Label,
        m_LabGameRules:cc.Label,
        m_UserLayout:cc.Node,
        m_atlas:cc.SpriteAtlas
    },
    ctor:function(){
        this.m_MaxChair = 10;
    },
    InitPre:function(){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.node.getComponent('CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'ClubRecordUserItem', this);
    },
    SetPreInfo:function(ParaArr){
        this.node.active = false;
        this.SetRecord(ParaArr[1][1], ParaArr[1][0]);
    },
    SetRecord:function(wIndex, ID, bSelfShow) {
        this.m_RecordID = ID;
        this.m_Index = parseInt(wIndex);
        if(this.m_LabIndex)this.m_LabIndex.string = pad(this.m_Index, 3);

        var webUrl = window.PHP_HOME+'/GameRecord.php?&GetMark=3&RecordID='+ID;
        WebCenter.GetData(webUrl, 24*60*60, function (data) {
            g_Lobby.StopLoading();
            var Json = JSON.parse(data);
            this.SetInfo(Json)
        }.bind(this));
    },
    SetInfo:function(Info, bSelfShow) {
        this.m_Info = Info;
        this.m_LabTime.string = Time2Str(this.m_Info[6]);//6 CreateTime Key
        
        try {
            var gamedef = new window['CMD_GAME_'+this.m_Info[3]]();//3 KindID
            var str = gamedef.GetProgress(this.m_Info[7], this.m_Info[5], this.m_Info[9]);// 4  Rules  7 Progress  5 ServerRules   9 RulesArr
            if(str!='') str = str.substring(1, str.length-1)//去掉 第 和 局
            this.m_LabGameCount.string = str;
        } catch (error) {
            if(window.LOG_NET_DATA)console.log(this.m_Info[3]+'游戏未实装 ID '+this.m_Info[0])
            return;
        }

        this.node.active = true;
        this.m_LabRoom.string = this.m_Info[2];//2 RoomID
        //5  ServerRules
        if(this.m_LabGameKind) this.m_LabGameKind.string = window.GameList[this.m_Info[3]];
        // if(this.m_LabGameKind) this.m_LabGameKind.string = gamedef.GetGameMode(this.m_Info[5], this.m_Info[9]);
        if(this.m_LabGameRules) this.m_LabGameRules.string = gamedef.GetRulesStr(this.m_Info[5], this.m_Info[9]);

        //var UserIndex = 0;
        var sortIDArr = this.SortUserIndexByScore(this.m_Info);
        var iIndex = 0;
        for(var i in this.m_Info[8]){ // 8  UserScore
            this.m_ListCtrl.InsertListInfo(0, [sortIDArr[iIndex], this.m_Info, gamedef, this.m_RecordID]); //this.m_Info[8][i]
            iIndex++;
        }
    },
    SortUserIndexByScore:function(info){
        var indexArr = new Array();
        var scoreArr = new Array();
        var totalCnt = 0;
        for(var i in info[8]){
            indexArr[totalCnt] = i;
            scoreArr[totalCnt] = info[8][i];
            totalCnt++;
        }
        for (var i = 0 ; i < totalCnt - 1 ; i++)
        {
            for (var j = i + 1 ; j < totalCnt ; j++)
            {
                if (scoreArr[i] < scoreArr[j])
                {
                    var score = scoreArr[i];
                    scoreArr[i] = scoreArr[j];
                    scoreArr[j] = score;
                    
                    var index = indexArr[i];
                    indexArr[i] = indexArr[j];
                    indexArr[j] = index;
                }
            }
        }
        return indexArr;
    },
    OnBtReplay:function() {
        this.m_Hook.OnRePlayGame( this.m_RecordID, this.m_Info[3]);
    },
    OnBtShowGameInfoAll:function() {
        this.m_Hook.OnShowGameInfoAll(this.m_RecordID, this.m_Info[3], this.m_Info[8]);
    },
    OnBtGetShareText:function() {
        var gamedef = new window['CMD_GAME_'+this.m_Info[3]]();//3 KindID
        var NextLine = '\r\n';
        var str = '【'+window.GameList[this.m_Info[3]]+'】';
        str += NextLine+'房间号：'+this.m_Info[2];
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();

        var ReplayCode = 0;
        for(var i in this.m_Info[8]){ // 8  UserScore
            if(i == pGlobalUserData.dwUserID){
                ReplayCode = this.m_Info[8][i][1];
                break;
            }
        }

        str += NextLine+'回放码：'+ReplayCode;

        //str += NextLine+gamedef.GetGameMode(this.m_Info[5], this.m_Info[9]);

        // var tempstr = gamedef.GetProgress(this.m_Info[7], this.m_Info[5], this.m_Info[9]);
        // if(tempstr!='') tempstr = tempstr.substring(1, tempstr.length-1)
        // str += NextLine+'局数：'+tempstr;
        // str += NextLine+this.m_LabTime.string;
        str += NextLine+'====战绩====';

        var TempNd = this.$('BGRecord/Layout');
        for(var i=0; i<TempNd.childrenCount; i++){
            if(TempNd.children[i].active == false) continue
            str += NextLine;
            str +=NextLine+ '【'+this.$('Nick@Label',TempNd.children[i]).string+'】';
            // str +=NextLine+'ID：'+ this.$('ID/id@Label',TempNd.children[i]).string;
            // str +=NextLine+'抢庄次数：'+ this.$('qiang/qiang@Label',TempNd.children[i]).string;
            // str +=NextLine+'坐庄次数：'+ this.$('zhuang/zhuang@Label',TempNd.children[i]).string;
            // str +=NextLine+'推注次数：'+ this.$('tui/tui@Label',TempNd.children[i]).string;
            str +=NextLine+'战绩：'+ this.$('Score@Label',TempNd.children[i]).string;
        }

        ThirdPartyCopyClipper(str);
        this.m_Hook.ShowTips('回放信息已复制到剪切板')
        return str;

    },
});
