cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_DirLine:[cc.Node]
    }, 
    ctor:function(){
        this.m_bInit = false;
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad:function () 
    {
        this.Init();
    },
    Init:function()
    {
        if(this.m_bInit == true) return;
        this.m_bInit = true;

        this.node.active = false;
        console.log("gps onload")
        this.m_UserArr = new Array();
        this.m_LabIp = new Array();
        // this.m_LabAddr = new Array();
        
        for(var i = 0;i<4;i++){
            this.m_UserArr[i] = this.node.getChildByName('UserCtrl'+i).getComponent('UserCtrl');
            this.m_LabIp[i] = this.m_UserArr[i].node.getChildByName('IP').getComponent(cc.Label);
            // this.m_LabAddr[i] = this.m_UserArr[i].node.getChildByName('Addr').getComponent(cc.Label);
        }
        var DirNode = this.node.getChildByName('Dir');

        this.m_DirLineArray={};
        this.m_DirLineArray['0to1'] = DirNode.getChildByName('left_up').getChildByName('dir').getComponent(cc.Label);
        this.m_DirLineArray['1to0'] = DirNode.getChildByName('left_up').getChildByName('dir').getComponent(cc.Label);

        this.m_DirLineArray['0to3'] = DirNode.getChildByName('right_up').getChildByName('dir').getComponent(cc.Label);
        this.m_DirLineArray['3to0'] = DirNode.getChildByName('right_up').getChildByName('dir').getComponent(cc.Label);

        this.m_DirLineArray['0to2'] = DirNode.getChildByName('shu').getChildByName('dir').getComponent(cc.Label);
        this.m_DirLineArray['2to0'] = DirNode.getChildByName('shu').getChildByName('dir').getComponent(cc.Label);

        this.m_DirLineArray['1to2'] = DirNode.getChildByName('left_bottom').getChildByName('dir').getComponent(cc.Label);
        this.m_DirLineArray['2to1'] = DirNode.getChildByName('left_bottom').getChildByName('dir').getComponent(cc.Label);

        this.m_DirLineArray['2to3'] = DirNode.getChildByName('right_bottom').getChildByName('dir').getComponent(cc.Label);
        this.m_DirLineArray['3to2'] = DirNode.getChildByName('right_bottom').getChildByName('dir').getComponent(cc.Label);

        this.m_DirLineArray['1to3'] = DirNode.getChildByName('heng').getChildByName('dir').getComponent(cc.Label);
        this.m_DirLineArray['3to1'] = DirNode.getChildByName('heng').getChildByName('dir').getComponent(cc.Label);
    },


    SetUserAddress :function(UserItem){
        var viewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(UserItem.GetChairID());
        this.m_UserArr[viewID].node.active = true;
        this.m_UserArr[viewID].SetUserByID(UserItem.GetUserID() );
        this.m_LabIp[viewID].string = 'IP:'+UserItem.GetUserIP();
    },
    UpdateUserData:function(){
        this.SetUserCount(GameDef.GetPlayerCount());
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            this.m_UserArr[i].InitUser();
            this.m_LabIp[i].string = '';
        }
        var kernel = gClientKernel.get();
        for (var i = 0; i < GameDef.GAME_PLAYER; i++) {
            var pIClientUserItem = kernel.GetTableUserItem(i);
            if( pIClientUserItem != null ){
                this.SetUserAddress(pIClientUserItem);
            }
        }
    },
    UpdateAddress:function(GPSInfo){
        
        for (let i = 0; i < 3; i++) {
            if( GPSInfo[i] == null ) continue;
            var viewID = this.GetUserChairID(GPSInfo[i].dwUserID);
            viewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(viewID);
            if( viewID != INVALD_CHAIR  )
            {
                this.m_LabIp[viewID].string = ''+GPSInfo[i].szAddress;
                // if( GPSInfo[i].dlongitude != 0 ) {
                //     this.m_LabIp[viewID].string = ''+GPSInfo[i].szAddress;
                // }
                // else{
                //     this.m_LabIp[viewID].string = '无法获取到GPS信息!';
                // }
            }
            for (var j in GPSInfo) {
                if( i == j )continue;
                // if( GPSInfo[i].byHide == 0 || GPSInfo[j].byHide == 0 )continue;
                //if( 0 != GPSInfo[i].dlongitude && 0 != GPSInfo[j].dlongitude)
                {
                    var fromID = this.GetUserChairID(GPSInfo[i].dwUserID);
                    var toID = this.GetUserChairID(GPSInfo[j].dwUserID);
                    if( fromID == INVALD_CHAIR || toID == INVALD_CHAIR )continue;
                    fromID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(fromID);
                    toID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(toID);
                    var dis = this.GetDistance(GPSInfo[i].dlatitude, GPSInfo[i].dlongitude, 
                        GPSInfo[j].dlatitude, GPSInfo[j].dlongitude) + ' km';
                    console.log("距离:"+''+fromID+'to'+toID+'  ==>'+dis);
                    this.m_DirLineArray[''+fromID+'to'+toID].string = dis;
                    this.m_DirLineArray[''+fromID+'to'+toID].node.parent.active = true;
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
    SetUserCount:function(Count){
        this.Init();
        this.m_nCount = Count;
        for (var i in this.m_DirLineArray) {
            this.m_DirLineArray[i].node.parent.active = false;
        }
        if ( Count == 2 ){
            this.m_UserArr[0].node.active = true;
            this.m_UserArr[1].node.active = false;
            this.m_UserArr[2].node.active = true;
            this.m_UserArr[3].node.active = false;
        }
        else{
            for (var i = 0; i < 4; i++) 
            {
                var wViewID = this.m_Hook.m_GameClientEngine.SwitchViewChairID(i);
                this.m_UserArr[wViewID].node.active = i < Count;
            }
        }
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
