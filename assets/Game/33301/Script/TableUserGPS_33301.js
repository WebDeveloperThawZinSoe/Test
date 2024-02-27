cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_DirLine: [cc.Node],
        m_Distance: [cc.Label],
    },

    ctor: function () {
        this.m_bInit = false;
    },

    onLoad: function () {
        if (this.m_bInit) return;

        this.Init();
        this.m_bInit = true;
    },

    Init: function () {
        this.node.active = false;
        console.log('gps onload');
        this.m_UserArr = new Array();
        this.m_LabIp = new Array();
         this.m_LabAddr = new Array();


        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserArr[i] = this.node.getChildByName('UserCtrl' + i).getComponent('UserCtrl');
            //this.m_UserInfo[i] = cc.instantiate(this.m_UserPrefab).getComponent('UserPrefab_' + GameDef.KIND_ID);
            //this.m_UserArr[i] = this.m_UserInfo[i].getChildByName('UserCtrl' + i).getComponent('UserCtrl');
            //this.m_LabIp[i] = this.m_UserArr[i].node.getChildByName('IP').getComponent(cc.Label);
             this.m_LabAddr[i] = this.m_UserArr[i].node.getChildByName('Addr').getComponent(cc.Label);
        }

        var DisNode = this.node.getChildByName('Distance');

        this.m_DirLineArray = {};
        this.m_DirLineArray['0to1'] = DisNode.getChildByName('LTRTop1').getComponent(cc.Label);
        this.m_DirLineArray['1to0'] = DisNode.getChildByName('LTRTop1').getComponent(cc.Label);


        this.m_DirLineArray['0to2'] = DisNode.getChildByName('LTRTop2').getComponent(cc.Label);
        this.m_DirLineArray['2to0'] = DisNode.getChildByName('LTRTop2').getComponent(cc.Label);



        this.m_DirLineArray['2to1'] = DisNode.getChildByName('LTRTop3').getComponent(cc.Label);
        this.m_DirLineArray['1to2'] = DisNode.getChildByName('LTRTop3').getComponent(cc.Label);

    },

    SetUserInfo: function (UserArr) {
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            if (UserArr[i] == null) {
                this.m_UserArr[i].SetUserByID(0);
                this.m_UserArr[i].m_LabNick.string = '';
                //this.m_LabIp[i].string = '';
                 this.m_LabAddr[i].string = ''
            } else {
                this.m_UserArr[i].node.active = true;
                this.m_UserArr[i].SetUserByID(UserArr[i].GetUserID());
                //this.m_LabIp[i].string = 'IP:' + UserArr[i].GetUserIP();
                this.m_LabAddr[i].string = '正在获取位置信息！'
            }
        }
    },

    SetUserAddress: function (UserItem) {
        var viewID = this.m_Hook.SwitchViewChairID(UserItem.GetChairID());

        this.m_UserArr[viewID].node.active = true;
        this.m_UserArr[viewID].SetUserByID(UserItem.GetUserID());
        //this.m_LabIp[viewID].string = 'IP:' + UserItem.GetUserIP();
    },

    UpdateUserData: function () {
        this.SetUserCount(GameDef.GetPlayerCount());
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserArr[i].InitUser();
            //this.m_LabIp[i].string = '';
        }
        var kernel = gClientKernel.get();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var pIClientUserItem = kernel.GetTableUserItem(i);
            if (pIClientUserItem != null) {
                this.SetUserAddress(pIClientUserItem);
            }
        }
    },
    UpdateAddress: function (GPSInfo) {

        for (var i = 0; i < 10; i++) {
            if (GPSInfo[i] == null) continue;
            var viewID = this.GetUserChairID(GPSInfo[i].dwUserID);

            // console.log('GPS:UserID=' + GPSInfo[i].dwUserID + ' viewID=' + viewID);
            if (viewID != INVALD_CHAIR) {
                if (GPSInfo[i].dlongitude != 0) {
                    viewID = this.m_Hook.SwitchViewChairID(viewID);
                    this.m_LabAddr[viewID].string = '' + GPSInfo[i].szAddress;
                } else {
                    this.m_LabAddr[viewID].string = '无法获取到GPS信息!';
                }
            }
            for (var j in GPSInfo) {
                if (i == j) continue;
                // if( GPSInfo[i].byHide == 0 || GPSInfo[j].byHide == 0 )continue;
                //if( 0 != GPSInfo[i].dlongitude && 0 != GPSInfo[j].dlongitude)
                {
                    var fromID = this.GetUserChairID(GPSInfo[i].dwUserID);
                    var toID = this.GetUserChairID(GPSInfo[j].dwUserID);
                    if (fromID == INVALD_CHAIR || toID == INVALD_CHAIR) continue;
                 
                    fromID = this.m_Hook.SwitchViewChairID(fromID);
                    toID = this.m_Hook.SwitchViewChairID(toID);

                    var dis = this.GetDistance(GPSInfo[i].dlatitude, GPSInfo[i].dlongitude,
                        GPSInfo[j].dlatitude, GPSInfo[j].dlongitude) + ' km';
                    // console.log('距离:' + '' + fromID + 'to' + toID + '  ==>' + dis);

                    if (this.m_DirLineArray) {
                        this.m_DirLineArray['' + fromID + 'to' + toID].string = dis;
                        this.m_DirLineArray['' + fromID + 'to' + toID].node.parent.active = true;
                        break;
                    } else this.Init();


                }
            }
        }
        this.m_Distance.active = true;

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
        if (!this.m_bInit) {
            this.Init();
            this.m_bInit = true;
        }

        this.m_nCount = Count;
        for (var i in this.m_DirLineArray) {
            this.m_DirLineArray[i].node.parent.active = false;
        }
        if (Count == 2) {
            this.m_UserArr[0].node.active = true;
            this.m_UserArr[1].node.active = false;
            this.m_UserArr[2].node.active = true;
            this.m_UserArr[3].node.active = false;
            this.m_UserArr[4].node.active = true;
        } else {
            for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
                this.m_UserArr[i].node.active = i < Count;
            }
        }
    },
    _Rad: function (d) {
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    },
    //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    GetDistance: function (lat1, lng1, lat2, lng2) {
        var radLat1 = this._Rad(lat1);
        var radLat2 = this._Rad(lat2);
        var a = radLat1 - radLat2;
        var b = this._Rad(lng1) - this._Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) +
            Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
        s = s * 6378.137;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        return s;
    },
    // update (dt) {},
});