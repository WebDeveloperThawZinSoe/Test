CGlobalClubInfo = cc.Class({
    ctor:function(){
        this._ClubInfoList = {};
        this._ClubInfoList.length = 0;
    },
    onClear:function(){
        this._ClubInfoList = {};
        this._ClubInfoList.length = 0;
    },
    onInsertClubInfo:function(clubInfo){
        if(clubInfo == null) return;
        if(this._ClubInfoList[`${clubInfo.dwClubID}`]){
            this.onUpdateClubInfo(clubInfo);
            return;
        }
        !this._ClubInfoList[`${clubInfo.dwClubID}`] && this._ClubInfoList.length++;
        this._ClubInfoList[`${clubInfo.dwClubID}`] = clubInfo;
    },
    onDeleteClubInfo:function(dwClubID){
        if(this._ClubInfoList[`${dwClubID}`] == null) return;
        this._ClubInfoList.length--;
        delete this._ClubInfoList[`${dwClubID}`];
    },
    onUpdateClubInfo:function(clubInfo){
        this._ClubInfoList[`${clubInfo.dwClubID}`] && clubInfo && gCByte.StrSameMemCopy(this._ClubInfoList[`${clubInfo.dwClubID}`],clubInfo);
    },
    onUpdateClubLevel:function(dwClubID,cbClubLevel){
        if(this._ClubInfoList[`${dwClubID}`]){
            this._ClubInfoList[`${dwClubID}`].cbClubLevel = cbClubLevel;
        } 
    },
    onUpdateClubScore:function(dwClubID,lScore){
        if(this._ClubInfoList[`${dwClubID}`]){
            this._ClubInfoList[`${dwClubID}`].llScore = lScore;
        } 
    },
    //更新桌子数量 0+ 1-
    onUpdateClubTableCnt:function(dwClubID,type){
        if(this._ClubInfoList[`${dwClubID}`]){
            type == 1 && this._ClubInfoList[`${dwClubID}`].wTableCount--;
            type == 0 && this._ClubInfoList[`${dwClubID}`].wTableCount++;
        } 
    },
    onGetClubInfo:function(dwClubID){
        return this._ClubInfoList[`${dwClubID}`];
    },
    onGetClubRules:function(dwClubID){
        if(this._ClubInfoList[`${dwClubID}`] == null) return 0;
        return this._ClubInfoList[`${dwClubID}`].dwRules;
    },
    onGetClubInfoList:function(){
        return this._ClubInfoList;
    },
    onModifyClubInfo:function(Obj){
        if(this._ClubInfoList[`${Obj.dwClubID}`] == null) return;
        this._ClubInfoList[`${Obj.dwClubID}`].szClubName = Obj.szClubName;
        this._ClubInfoList[`${Obj.dwClubID}`].cbJoinLimit = Obj.cbJoinLimit;
        this._ClubInfoList[`${Obj.dwClubID}`].dwRules = Obj.dwRules;
        this._ClubInfoList[`${Obj.dwClubID}`].szNotice = Obj.szNotice;
        this._ClubInfoList[`${Obj.dwClubID}`].szNotice2 = Obj.szNotice2;
        this._ClubInfoList[`${Obj.dwClubID}`].cbCloseStatus= Obj.cbCloseStatus;
    }
});

g_GlobalClubInfo = new CGlobalClubInfo();
