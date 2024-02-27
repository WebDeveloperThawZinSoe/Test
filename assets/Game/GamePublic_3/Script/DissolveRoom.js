
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_BtSure:cc.Node,
        m_BtCancel:cc.Node,
        m_BtClose:cc.Node,
        m_ClockNode:cc.Node,
        m_LabTips:cc.Label,
        m_LabTime:cc.Label,
        m_FirstUserNode:cc.Node,
        m_UserNode:cc.Node,
        m_atlas:cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor :function () {
        this.m_UserArr = new Array();
        this.m_EndTime = null;
    },
    SetDissolveInfo:function(UserID, ChooseArr, CntDown,LockArr,allCntDown){
        this.m_BtClose.active = false;

        this.m_DisUserID = UserID;
        if(this.DisUserCtrl == null) this.DisUserCtrl = this.$('UserCtrl@DisUserPre');
        //默认数据
        this.m_LockArr = LockArr;
        this.m_UserArr = ChooseArr;
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(this.m_UserArr[i] == null) this.m_UserArr[i] = 0;
        }
        //玩家状态信息
        this.UpdateTableUser();
        //提示信息
        var kernel = gClientKernel.get();
        var MeSelfInfo = kernel.GetMeUserItem();
        if(this.m_DisUserID == MeSelfInfo.GetUserID() || ChooseArr[MeSelfInfo.GetChairID()] != 0 || !LockArr[MeSelfInfo.GetChairID()]){
            this.m_BtSure.active = false;
            this.m_BtCancel.active = false;
            this.m_LabTips.string = '等待其他玩家选择！'
        }else if(ChooseArr[MeSelfInfo.GetChairID()] == 0){
            this.m_BtSure.active = true;
            this.m_BtCancel.active = true;
            this.m_LabTips.string = '是否同意解散？'
        }
        //倒计时
        this.m_ClockNode.active = true;
        this.m_LabTime.string = CntDown;
        this.m_EndTime = new Date().getTime() + CntDown*1000;
        
        if(allCntDown){
            this.$('LabDis@Label',this.m_FirstUserNode).string = `玩家【             】申请解散房间，请等待其他玩家选择（超过${allCntDown}秒未做选择则默认该玩家同意）`;
        }
    },
    UpdateTableUser:function(){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'DisUserPre', this);
        
        //玩家界面
        for(var i=0;i<GameDef.GAME_PLAYER;i++){
            if(!this.m_LockArr[i]) continue;       //跳过未锁定玩家
            var UserItem = this.m_Hook.GetClientUserItem(i);
            if(UserItem == null) continue
        
            if(this.m_DisUserID == UserItem.GetUserID()) { 
                this.DisUserCtrl.SetPreInfo([this.m_DisUserID]);
            }else{
                this.m_ListCtrl.InsertListInfo(0, [UserItem.GetUserID(),UserItem.GetChairID(), this.m_UserArr]);
            }
        }
    },
    SetUserChoose:function(wChairID, byRes){
        var bNoIn = true;
        this.m_UserArr[wChairID] = byRes;
        this.UpdateTableUser();
        return
        for(var i =1;i< this.m_UserArr.length; i++){
            if(this.m_UserArr[i].GetChairID() == wChairID) {
                bNoIn = false;
                this.m_UserArr[i].SetUserState( byRes );
            }
        }
        if(bNoIn){
            var UserItem = this.m_Hook.GetClientUserItem(wChairID);
            if(UserItem == null) return
            for(var i =1;i< this.m_UserArr.length; i++){
                if(this.m_UserArr[i].GetChairID() == 0xff) {
                    this.m_UserArr[i].node.active = true;
                    this.m_UserArr[i].SetUser(UserItem.GetUserID(),UserItem.GetChairID());
                    this.m_UserArr[i].SetUserState( byRes );
                    break;
                }
            }
        }
    },
    SetDisRes:function(byRes){
        this.m_BtSure.active = false;
        this.m_BtCancel.active = false;
        this.m_ClockNode.active = false;
        this.m_BtClose.active = true;
        this.m_LabTips.string = byRes?"投票通过，游戏解散！":"投票未通过，游戏继续！";
        this.m_EndTime = null;
        this.m_LabTime.string = '';
        if(byRes==0) {
            this.ShowAlert("投票未通过，游戏继续！");
            this.scheduleOnce(this.OnHide,2);
        }
    },
    OnBtClickChoose:function(Tag, byRes){
        this.m_BtSure.active = false;
        this.m_BtCancel.active = false;
        var UserChoose = new CMD_GF_UserChoose();
        UserChoose.byChoose = byRes == 1 ? 1 : 0;
        this.m_Hook.sendClass(MDM_GF_CARDROOM, SUB_GF_USER_CHOOSE, UserChoose);
    },
    update (dt) {
        if(this.m_EndTime == null) return
        var TimeLeft = this.m_EndTime - new Date().getTime();
        this.m_LabTime.string = TimeLeft < 0 ? '' : parseInt(TimeLeft / 1000);//+'秒后结束投票！无人拒绝自动解散';
    },
    OnHide:function(){
        this.unschedule(this.OnHide);
        this.node.active = false;
        this['m_JsAlert'] && this['m_JsAlert'].HideView();
    },
    OnHideView:function(){
        this.unschedule(this.OnHide);
        var JsAlert = this['m_JsAlert'];
        if(JsAlert != null && JsAlert.node != null) JsAlert.HideView();
        if(this.m_Hook.m_RoomEnd) this.m_Hook.RealShowEndView();
        else this.node.active = false;
    },
});
