cc.Class({
    extends: cc.BaseClass,

    properties: {
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad:function () {
        this.m_UserArr = new Array();
        this.m_LabIp = new Array();
        this.m_LabAddr = new Array();
        
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            this.m_UserArr[i] = this.node.getChildByName('UserCtrl'+i).getComponent('UserCtrl');
            this.m_LabIp[i] = this.m_UserArr[i].node.getChildByName('IP').getComponent(cc.Label);
            this.m_LabAddr[i] = this.m_UserArr[i].node.getChildByName('Addr').getComponent(cc.Label);
        }
        this.node.active = false;
    },

    SetUserInfo :function(UserArr) {
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(UserArr[i] == null){
                this.m_UserArr[i].SetUserByID(0);
                this.m_UserArr[i].m_LabNick.string = '';
                this.m_LabIp[i].string = '';
                this.m_LabAddr[i].string = ''
            }else{
                this.m_UserArr[i].node.active = true;
                this.m_UserArr[i].SetUserByID(UserArr[i].GetUserID() );
                this.m_LabIp[i].string = 'IP:'+UserArr[i].GetUserIP();
                this.m_LabAddr[i].string = '正在获取位置信息！'
            }
        }   
    },
    SetUserAddress :function(UserArr, GPSArr){
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(UserArr[i] == null) continue;
            for(var j in GPSArr){
                if(UserArr[i].m_UserInfo.dwUserID == GPSArr[j].dwUserID){
                    this.m_LabAddr[i].string = GPSArr[j].byHide ?'用户隐藏了信息！': GPSArr[j].szAddress;
                }
            }   
            
        }
        for(var i = 0;i<GameDef.GAME_PLAYER;i++){
            if(GPSArr[i] == null) continue;
            for (var j in GPSArr) {
                if( i == j )continue;
                //if( 0 != GPSInfo[i].dlongitude && 0 != GPSInfo[j].dlongitude)
                {
                    var fromID = this.GetUserChairID(GPSArr[i].dwUserID);
                    var toID = this.GetUserChairID(GPSArr[j].dwUserID);
                    if( fromID == INVALD_CHAIR || toID == INVALD_CHAIR )continue;
                    fromID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(fromID);
                    toID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(toID);
                    var dis = this.GetDistance(GPSArr[i].dlatitude, GPSArr[i].dlongitude, GPSArr[j].dlatitude, GPSArr[j].dlongitude);
                    if(dis < 0.05)
                    {
                        this.m_Hook.ShowDistance(2, fromID, toID);
                    }
                    else if(dis < 1)
                    {
                        this.m_Hook.ShowDistance(1, fromID, toID);
                    }
                    //console.log("距离:"+''+fromID+'to'+toID+'  ==>'+dis);
                    // this.m_DirLineArray[''+fromID+'to'+toID].string = dis + ' km';
                    // this.m_DirLineArray[''+fromID+'to'+toID].node.parent.active = true;
                }
            }
        }
    },
    GetUserChairID:function(UserID){
        var kernel = gClientKernel.get();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var pIClientUserItem = kernel.GetTableUserItem(i);
            if( pIClientUserItem != null ){
                if( pIClientUserItem.GetUserID() == UserID ){
                    return pIClientUserItem.GetChairID();
                }
            }
        }
        return INVALD_CHAIR;
    },
    _Rad :function(d){
        return d * Math.PI / 180.0;//经纬度转换成三角函数中度分表形式。
    },
    //计算距离，参数分别为第一点的纬度，经度；第二点的纬度，经度
    GetDistance : function (lat1,lng1,lat2,lng2) {
        var radLat1 = this._Rad(lat1);
        var radLat2 = this._Rad(lat2);
        var a = radLat1 - radLat2;
        var  b = this._Rad(lng1) - this._Rad(lng2);
        var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a/2),2) +
        Math.cos(radLat1)*Math.cos(radLat2)*Math.pow(Math.sin(b/2),2)));
        s = s *6378.137 ;// EARTH_RADIUS;
        s = Math.round(s * 10000) / 10000; //输出为公里
        return s;
    },
    // update (dt) {},
});
