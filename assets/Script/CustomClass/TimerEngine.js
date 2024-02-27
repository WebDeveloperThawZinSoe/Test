TagTimerInfo = cc.Class({
    ctor :function(){
        this.TimeLen = 0;
        this.EndTime = 0;
        this.CallHandle = null;
        this.CallBack = null;
        this.Param = null;
        this.wChairID = null;
    },
});

TimerEngine = cc.Class({
    extends: cc.Component,
    ctor :function(){
        //可执行多个 时间结束回调
        this.m_TimerMap = new Object();
        //只执行1个 按精度刷新回调
        this.m_GameTimerMap = new Object();

        this.m_RecordPause = null;
        this.m_RecordGamePause = null;
        this.m_bStart = false;
    },
    //检查启动
    CheckStart:function(){
        if(this.m_bStart) return
        this.m_bStart = true;
        this.schedule(this.OnTimer, 0.02);
    },
    //刷新执行
    OnTimer :function(){
        var NowTime = new Date().getTime();
        var RemainTime = 0;
        for(var i in this.m_TimerMap){
            if(this.m_RecordPause != null) break;
            if(this.m_TimerMap[i] == null) continue;
            RemainTime = this.m_TimerMap[i].EndTime - NowTime;
            if(RemainTime <= 0) {
                this.ExecCallBack(this.m_TimerMap[i]);
                this.m_TimerMap[i] = null;
            }
        }
        for(var i in this.m_GameTimerMap){
            if(this.m_RecordGamePause != null) break;
            if(this.m_GameTimerMap[i] == null) continue;
            RemainTime = this.m_GameTimerMap[i].EndTime - NowTime;
            if(RemainTime < 0) RemainTime = 0;
            this.ExecGameCallBack(i, this.m_GameTimerMap[i], RemainTime);
            if(RemainTime == 0) this.m_GameTimerMap[i] = null;
        }
    },
    //普通结束执行
    ExecCallBack:function(TimerInfo){
        try {
            if(TimerInfo.CallHandle != null && TimerInfo.CallBack != null){
                return TimerInfo.CallHandle[TimerInfo.CallBack](TimerInfo.Param);
            }
            if(TimerInfo.CallBack != null){
                return TimerInfo.CallBack(TimerInfo.Param);
            }
        } catch (error) {
            if(window.LOG_NET_DATA)console.log("timerengine err : "+error)
            if(window.LOG_NET_DATA)console.log(JSON.stringify(TimerInfo))
        }
    },
    //游戏刷新执行
    ExecGameCallBack:function(TimerID, TimerInfo, RemainTime){
        try {
            var Progress = RemainTime/TimerInfo.TimeLen;
            if(TimerInfo.CallHandle != null && TimerInfo.CallBack != null){
                return TimerInfo.CallHandle[TimerInfo.CallBack](TimerInfo.wChairID, RemainTime, parseInt(TimerID), Progress);
            }
            if(TimerInfo.CallBack != null){
                return TimerInfo.CallBack(TimerInfo.wChairID, RemainTime, parseInt(TimerID), Progress);
            }
        } catch (error) {
            if(window.LOG_NET_DATA)console.log("timerengine game err,clock close "+TimerID)
            this.m_GameTimerMap[TimerID] = null;
        }
    },
    //设置普通定时器
    SetTimer:function(TimerID, TimerLen, Data, Handle, Call){
        this.CheckStart();
        if(this.m_TimerMap[TimerID] == null){
            this.m_TimerMap[TimerID] = new TagTimerInfo();
        }
        this.m_TimerMap[TimerID].TimeLen = TimerLen;
        this.m_TimerMap[TimerID].EndTime = TimerLen + new Date().getTime();
        this.m_TimerMap[TimerID].CallHandle = Handle;
        this.m_TimerMap[TimerID].CallBack = Call;
        this.m_TimerMap[TimerID].Param = Data;
    },
    //暂停定时器
    PauseTimer:function(){
        this.m_RecordPause = new Date().getTime();
    },
    //继续定时器
    UnPauseTimer:function(){
        if(this.m_RecordPause == null) return;
        var PauseTime = new Date().getTime() - this.m_RecordPause;
        this.m_RecordPause = null;

        for(var i in this.m_TimerMap){
            if(this.m_TimerMap[i] == null) continue;
            this.m_TimerMap[i].EndTime += PauseTime;
        }
    },
    //删除定时器
    KillTimer:function(TimerID){
        this.m_TimerMap[TimerID] = null;
    },
    KillAllTimer:function(){
        this.m_TimerMap = new Object();
    },
    //游戏定时器
    SetGameTimer:function(wChairID, TimerID, TimerLen, Data, Handle, Call){
        this.CheckStart();

        if(this.m_GameTimerMap[TimerID] == null){
            this.m_GameTimerMap[TimerID] = new TagTimerInfo();
        }
        this.m_GameTimerMap[TimerID].TimeLen = TimerLen;
        this.m_GameTimerMap[TimerID].EndTime = TimerLen + new Date().getTime();
        this.m_GameTimerMap[TimerID].CallHandle = Handle;
        this.m_GameTimerMap[TimerID].CallBack = Call;
        this.m_GameTimerMap[TimerID].Param = Data;
        this.m_GameTimerMap[TimerID].wChairID = wChairID;
    },
    KillGameTimer:function(){
        this.m_GameTimerMap = new Object();
    },
    PauseGameTimer:function(){
        this.m_RecordGamePause = new Date().getTime();
    },
    UnPauseGameTimer:function(){
        if(this.m_RecordGamePause == null) return;
        var PauseTime = new Date().getTime() - this.m_RecordGamePause;
        this.m_RecordGamePause = null;

        for(var i in this.m_GameTimerMap){
            if(this.m_GameTimerMap[i] == null) continue;
            this.m_GameTimerMap[i].EndTime += PauseTime;
        }
    },
});

window.g_TimerEngine = new TimerEngine();
