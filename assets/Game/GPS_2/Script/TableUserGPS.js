var actTime = 0.1;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_UserPrefab:cc.Prefab,
    },
    start:function(){
         this.Init();
    },

    Init:function(){
        if(!this.m_UserPosGPSArr){
            this.m_UserPosGPSArr = new Array();
        }
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad: function () {
        this.node.active = false;
        this.m_CenterChairID = null;
        if(window.LOG_NET_DATA)console.log("gps onload")
        this.m_UserNode = this.$('UserNode');
        this.m_BGSize = this.$('BGB/BGSize').getContentSize();
        this.m_WidthScale = (this.m_BGSize.width * 0.95)/cc.winSize.width;
        this.m_HeightScale = (this.m_BGSize.height * 0.95)/cc.winSize.height;
    },

    SetGPSUserPos:function(UserInfo){
        this.Init();
        if(!UserInfo) return this.ShowTips('GPS用户初始节点错误!');
        for(var i =0;i<GameDef.GAME_PLAYER;i++){
            var vUserPos = UserInfo[i].node.convertToWorldSpaceAR(cc.v2(0,0));
            var vPos2 = this.node.convertToNodeSpaceAR(vUserPos);
            vPos2 = cc.v2(vPos2.x * this.m_WidthScale,vPos2.y * this.m_HeightScale);
            //var vPos2 = cc.v2(UserInfo[i].node.getPosition().x * this.m_WidthScale,UserInfo[i].node.getPosition().y * this.m_HeightScale);
            this.m_UserPosGPSArr.push(vPos2);
        }
    },

    InitUser:function(){
        this.Init();
        if(!this.m_GPSUserInfo){
            this.m_GPSUserInfo = new Array();
            for(var i =0;i<GameDef.GAME_PLAYER;i++){
                this.m_GPSUserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefabGPS');
                this.m_UserNode.addChild(this.m_GPSUserInfo[i].node);
                this.m_GPSUserInfo[i].node.active = false;
            }
        }
        this.m_IsMove = false;
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            this.m_GPSUserInfo[i].InitGps(this,i);
            this.m_GPSUserInfo[i].node.stopAllActions();
            var v2Pos = this.m_UserPosGPSArr[i];
            if(!v2Pos) v2Pos = cc.v2(-317, 48);
            this.m_GPSUserInfo[i].node.setPosition(v2Pos.x,v2Pos.y);
            this.m_GPSUserInfo[i].SetUserDistance('');
            this.m_GPSUserInfo[i].ShowUserAddr(false);
            this.m_GPSUserInfo[i].ShowUserIP(false);
        }
    },

    OnShowView() {
        this.InitUser();
        ShowO2I(this.node);
    },

    OnHideView() {
        HideI2O(this.node);
    },

    SetUserInfo: function (UserArr) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (UserArr[i]) {
                this.m_GPSUserInfo[i].node.active = true;
                this.m_GPSUserInfo[i].SetUserItem(UserArr[i]);
                this.m_GPSUserInfo[i].SetUserIP(UserArr[i].GetUserIP());
                this.m_GPSUserInfo[i].SetUserAddr('正在获取位置信息！');
            } else{
                this.m_GPSUserInfo[i].node.active = false;
            }
        }
    },
    SetUserAddress: function (UserItem) {
        var viewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(UserItem.GetChairID());
        this.m_UserArr[viewID].node.active = true;
        this.m_UserArr[viewID].SetUserByID(UserItem.GetUserID());
        if(UserItem.GetUserIP) this.m_LabIp[viewID].string = 'IP:' + UserItem.GetUserIP();
    },
    UpdateUserData: function () {
        this.SetUserCount(GameDef.GameMaxPlayerCount());
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserArr[i].InitUser();
            this.m_LabIp[i].string = '';
        }
        var kernel = gClientKernel.get();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var pIClientUserItem = kernel.GetTableUserItem(i);
            if (pIClientUserItem != null) {
                this.SetUserAddress(pIClientUserItem);
            }
        }
    },
    UpdateAddress: function (hook, GPSInfo) {
        this.m_Hook = hook
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (GPSInfo[i] == null) continue;
            var wChairID = this.GetUserChairID(GPSInfo[i].dwUserID);
            var wViewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(wChairID);

            if(true)console.log('GPS:UserID=' + GPSInfo[i].dwUserID + ' wChairID=' + wChairID + ' wViewID=' + wViewID);
            if (wChairID < GameDef.GAME_PLAYER) {
                if (GPSInfo[i].dlongitude != 0) {
                    this.m_GPSUserInfo[wViewID].SetUserAddr(GPSInfo[i].szAddress);
                } else {
                    this.m_GPSUserInfo[wViewID].SetUserAddr('无法获取到GPS信息!',false);
                }
            }
            this.m_GPSUserInfo[wViewID].SetJingWeiDu(GPSInfo[i].dlatitude,GPSInfo[i].dlongitude);
        }
    },

    GetUserChairID: function (UserID) {
        var kernel = gClientKernel.get();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var pIClientUserItem = kernel.GetTableUserItem(i);
            if (pIClientUserItem != null) {
                if (pIClientUserItem.GetUserID() == UserID) {
                    return pIClientUserItem.GetChairID();
                }
            }
        }
        return INVALD_CHAIR;
    },
    SetUserCount: function (Count) {
        this.m_nCount = Count;
        for (var i in this.m_DirLineArray) {
            this.m_DirLineArray[i].node.parent.active = false;
        }
        if (Count == 2) {
            this.m_UserArr[0].node.active = true;
            this.m_UserArr[1].node.active = false;
            this.m_UserArr[2].node.active = true;
            this.m_UserArr[3].node.active = false;
        } else {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserArr[i].node.active = i < Count;
            }
        }
    },
    OnClick_Select:function(wChairID){
        if(this.m_IsMove) return false;
        this.m_IsMove = true;

        if(this.m_SelUser) {
            this.Move(this.m_SelUser, actTime, this.m_UserPosGPSArr[this.m_CenterChairID], this.m_CenterChairID);
        }
        this.m_CenterChairID = wChairID;
        this.m_SelUser = this.m_GPSUserInfo[wChairID];
        this.Move(this.m_SelUser, actTime, cc.v2(0,0), wChairID);
        return true;
    },

    Move: function(pUser, fTime, ptTo, wChairID) {
        if(!pUser) return false;
        var act = cc.sequence(cc.moveTo(fTime, ptTo), cc.callFunc(this.OnUserMoveFinish, this, wChairID));
        pUser.node.stopAllActions();
        pUser.node.runAction(act);
    },

    OnUserMoveFinish:function(tag,wChairID){
        this.m_IsMove = false;
        if(wChairID==this.m_CenterChairID){
            this.m_GPSUserInfo[wChairID].ShowCurrent(true);
            this.m_GPSUserInfo[wChairID].SetUserDistance('');
            this.m_GPSUserInfo[wChairID].ShowUserAddr(true);
            this.m_GPSUserInfo[wChairID].ShowUserIP(true);

            var CenterJingWei = this.m_GPSUserInfo[this.m_CenterChairID].GetJingWeiDu();
            for(var i in this.m_GPSUserInfo){
                if(i==this.m_CenterChairID) continue;
                if(this.m_GPSUserInfo[i].node.active){
                    var OtherJingWei = this.m_GPSUserInfo[i].GetJingWeiDu();
                    var dwDistance = this.GetDistance(CenterJingWei.dlatitude,CenterJingWei.dlongitude,OtherJingWei.dlatitude,OtherJingWei.dlongitude);
                    this.m_GPSUserInfo[i].SetUserDistance(dwDistance);
                    this.m_GPSUserInfo[i].ShowUserAddr(false);
                    this.m_GPSUserInfo[i].ShowUserIP(false);

                    if(dwDistance*1000 < 500){
                        this.$("BtGPSRed").active = true;
                        this.m_GPSUserInfo[i].OnDangerHeadBG();
                    }else{
                        this.$("BtGPSGreen").active = true;
                        this.m_GPSUserInfo[i].OnSafeHeadBG();
                    }
                }
            }
        }else{
            this.m_GPSUserInfo[wChairID].SetCenter(false);
            this.m_GPSUserInfo[wChairID].ShowCurrent(false);
            this.m_GPSUserInfo[wChairID].SetUserDistance('');
        }

    },

    _Rad: function (d) {
        return d * Math.PI / 180.0; //经纬度转换成三角函数中度分表形式。
    },
    //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    GetDistance: function (lat1, lng1, lat2, lng2) {
        var radLat1 = this._Rad(lat1);
        var radLat2 = this._Rad(lat2);
        var a = radLat1 - radLat2;
        var b = this._Rad(lng1) - this._Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137; // EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        return s;
    },
    // update (dt) {},
});