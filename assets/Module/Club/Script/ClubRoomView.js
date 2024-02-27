cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    ctor: function () {
        this._showIndex = 0;
        this.m_RoomKind = 0;             //游戏类型筛选
        this.m_SelClubInfo = null;          //当前俱乐部信息
        this.m_RoomInfoMap = null;          //俱乐部房间
        this.m_Tag = 0;
        this._autoClick = true;
        this._tableMap = {};
        this._markMap = {};
        this._markCntMap = {};
        this._GameTagCntMap = {};
        this.m_RoomKindMap = {
            '10012': 'K1', '60001': 'K2', '10013': 'K3', '10011': 'K4', '50000': 'K5', '40107': 'K6', '21060': 'K7',
            '21201': 'K8', '52081': 'K9', '60014': 'K10', '500': 'K11', '62016': 'K12', '62005': 'K13', '52160': 'K14',
            '33301': 'K15', '21050': 'K16', '22201': 'K17', '501': 'K18', '63000': 'K19', '64000': 'K20', '10015': 'K21',
            '21070': 'K22', '21061': 'K7', '21062': 'K7', '21063': 'K23', '62007': 'K24', '21202': 'K25', '50001': 'K26','63504': 'K27',
            '10020': 'K28','63500': 'K29',
        };
    },
    onLoad() {
        //界面初始化
        this._vMarkList = this.$('MarkTagList@VirtualList');
        this._vTableList = this.$('@VirtualList');
        this.m_tagBtnNode = this.$('GameTagList/view/content');
        this.m_markBtnNode = this.$('MarkTagList/view/content');
        this._gameTagAll = this.$('GameTagList/view/content/K0@Toggle');
        this._markTagAll = this.m_markBtnNode._children[1].getComponent(cc.Toggle);
    },

    InitRoomView: function (ClubInfo) {
        if (ClubInfo == null) return;
        this.m_SelClubInfo = ClubInfo;
        this.onSwitchCreateRoomBG();
    },

    //俱乐部房间
    LoadRoomInfo: function (RoomList) {
        if (this.m_SelClubInfo == null) return
        this._showIndex = 0;
        this.m_RoomKind = 0;
        this._tableMap = {};
        this._markMap = {};
        this._markCntMap = {};
        this._GameTagCntMap = {};
        this._vTableList.Init(2, this.scrollTableListCallBack.bind(this), this);
        this._vMarkList.Init(2, this.scrollMarkListCallBack.bind(this), this);

        if (RoomList) {
            this.m_RoomInfoMap = RoomList;
            g_Lobby.m_ClubRoomCnt[RoomList.dwClubID] = RoomList.wRoomCnt;
            this._autoClick = true;
        }

        if (this.m_RoomInfoMap.RoomInfo == null) {
            this.m_RoomInfoMap.RoomInfo = new Array();
        }

        this._initTable();
        this._inittMark();
        this._initGameTag();
    },

    _initTable: function () {
        if (this.m_RoomInfoMap && this.m_RoomInfoMap.RoomInfo) {
            for (var i in this.m_RoomInfoMap.RoomInfo) {
                let roomInfo = this.m_RoomInfoMap.RoomInfo[i];
                this._insertTable(roomInfo);
            }
        }
    },

    _inittMark: function () {
        if (!this.m_RoomInfoMap) return;
        for (var i in this.m_RoomInfoMap.RoomInfo) {
            this._insertMark(this.m_RoomInfoMap.RoomInfo[i]);
        }
    },

    _initGameTag: function () {
        if (!this.m_RoomInfoMap) return;
        this._GameTagCntMap = {};
        for (var i in this.m_RoomInfoMap.RoomInfo) {
            let item = this.m_RoomInfoMap.RoomInfo[i];
            if (this._GameTagCntMap[item.wKindID]) {
                this._GameTagCntMap[item.wKindID]++;
                continue;
            }
            this._GameTagCntMap[item.wKindID] = 1;
        }
        this._updateGameTag();
    },

    _filter: function (roomInfo) {
        let bShow = true;
        if (this.m_RoomKind && this.m_RoomKind != 0) {
            if (this.m_RoomKind == 21060) {
                if (roomInfo.wKindID != 21060 && roomInfo.wKindID != 21061 && roomInfo.wKindID != 21062) bShow = false;
            }
            else {
                if (roomInfo.wKindID != this.m_RoomKind) bShow = false;
            }
        }
        if (this.m_Tag != 0 && roomInfo.szTag != this.m_Tag) bShow = false;
        return bShow;
    },

    _insertTable: function (roomInfo) {
        roomInfo.bShow = this._filter(roomInfo);
        if (roomInfo.bShow) this._showIndex++;
        this._vTableList.InsertListData([roomInfo, this._showIndex]);
    },

    _insertMark: function (roomInfo) {
        if (roomInfo.szTag == '') return;
        let bShow = true;
        if (this._markCntMap[roomInfo.szTag]) {
            this._markCntMap[roomInfo.szTag].Cnt++;
            this._markCntMap[roomInfo.szTag].kindID.push(roomInfo.wKindID);
            return;
        }
        this._markCntMap[roomInfo.szTag] = { Cnt: 1, kindID: [roomInfo.wKindID] };
        if (this.m_RoomKind != 0 && roomInfo.wKindID != this.m_RoomKind) bShow = false;
        this._vMarkList.InsertListData([roomInfo.szTag, roomInfo.wKindID, bShow]);
    },

    scrollTableListCallBack: function (o) {
        this._tableMap[o.data[0].dwRoomID] = o;
        o.item.active = o.data[0].bShow;
    },

    scrollMarkListCallBack: function (o) {
        this._markMap[o.data[0]] = o;
        o.item.active = o.data[2];
    },
    _updateTableIndex: function (index) {
        this._showIndex = 0;
        this._vTableList.ForEachCtrl((js) => {
            this._showIndex++;
            js.SetIndex(this._showIndex);
        });
    },
    _updateGameTag: function () {
        for (var i in this.m_tagBtnNode._children) {
            if (i == 0) continue;
            this.m_tagBtnNode._children[i].active = false;
        }
        for (let i in this._GameTagCntMap) {
            this.$(`${this.m_RoomKindMap[i]}`, this.m_tagBtnNode).active = true;
        }
    },

    _updateMark: function () {
        for (let i in this._markMap) {
            if (this.m_RoomKind != 0) {
                let bShow = false;
                for (let k = 0; k < this._markCntMap[i].Cnt; k++) {
                    if (this._markCntMap[i].kindID[k] == this.m_RoomKind) {
                        bShow = true;
                        break;
                    }
                }
                this._markMap[i].item.active = bShow;
            } else {
                this._markMap[i].item.active = true;
            }
        }
    },

    _deleteMark: function (mark,kindID) {
        if(mark=='') return;
        let bUpdateTable = false;
        this._markCntMap[mark].Cnt--;
        let index = -1;
        for (var i in this._markCntMap[mark].kindID) {
            if (this._markCntMap[mark].kindID[i] == kindID) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            bUpdateTable = true;
            this._markCntMap[mark].kindID.splice(index, 1)
        }

        if (this._markCntMap[mark].Cnt == 0) {
            this.m_Tag = 0;
            this._markTagAll.isChecked = true;
            bUpdateTable = true;
            this._vMarkList.RecycleItem(this._markMap[mark].item);
            delete this._markCntMap[mark];
            delete this._markMap[mark];
        }
        return bUpdateTable;
    },
    //插入新房间
    InsertRoomInfo: function (RoomInfo) {
        if (this.m_RoomInfoMap && RoomInfo && this.m_SelClubInfo.dwClubID == RoomInfo.dwClubID) {
            this._insertTable(RoomInfo);
            this._insertMark(RoomInfo);
            let kindID = RoomInfo.wKindID;
            if (kindID == 21061 && kindID == 21062) kindID = 21060;
            if (this._GameTagCntMap[kindID]) {
                this._GameTagCntMap[kindID]++;
            } else {
                this._GameTagCntMap[kindID] = 1;
            }
            this._updateGameTag();

            this.m_RoomInfoMap.RoomInfo.push(RoomInfo);
            var cnt = ++this.m_RoomInfoMap.wRoomCnt;
            g_Lobby.m_ClubRoomCnt[RoomInfo.dwClubID] = this.m_RoomInfoMap.wRoomCnt;
        }
    },

    //更新桌子上玩家
    UpdateUserState: function (userInfo) {
        if (!this.m_RoomInfoMap) return;
        let table = this._tableMap[userInfo.dwRoomID];
        if (!table) return;
        table.js.UpdateUserState(userInfo);

        var userItem = this.m_RoomInfoMap.UserList.UserInfo[`${userInfo.dwUserID}`];
        if (userItem) {
            if (userInfo.cbUserStatus <= US_FREE) {
                delete this.m_RoomInfoMap.UserList.UserInfo[`${userInfo.dwUserID}`];
                table.js.UpdateUser(userInfo);
            } else {
                this.m_RoomInfoMap.UserList.UserInfo[`${userInfo.dwUserID}`] = userInfo;
            }
        } else {
            if (userInfo.cbUserStatus <= US_FREE) return;
            this.m_RoomInfoMap.UserList.UserInfo[`${userInfo.dwUserID}`] = userInfo;
            table.js.UpdateUser(userInfo);
        }
    },
    onUpdateRoomInfo: function (roomInfo) {

    },
    //解散房间
    DisRoom: function (disRoom) {
        if (this.m_SelClubInfo == null) return;
        if (this.m_RoomInfoMap == null) return;
        var roomInfo = this.m_RoomInfoMap.RoomInfo;
        var index = -1;
        let bUpdateTable = false;
        if (this._tableMap[disRoom.dwRoomID]) {
            this._vTableList.RecycleItem(this._tableMap[disRoom.dwRoomID].item);
            let wKindID = this._tableMap[disRoom.dwRoomID].data[0].wKindID;
            let mark = this._tableMap[disRoom.dwRoomID].data[0].szTag;

            this._GameTagCntMap[wKindID]--;
            if (this._GameTagCntMap[wKindID] == 0) {
                this.m_RoomKind = 0;
                this._gameTagAll.isChecked = true;
                bUpdateTable = true;
                delete this._GameTagCntMap[wKindID];
            }
            bUpdateTable = this._deleteMark(mark,wKindID);
            delete this._tableMap[disRoom.dwRoomID];
        }

        this._updateTableIndex();
        this._updateGameTag();
        if (bUpdateTable) this._filterTable();

        for (var i in roomInfo) {
            if (roomInfo[i].dwRoomID == disRoom.dwRoomID) {
                index = i;
                break;
            }
        }

        if (index != -1) {
            roomInfo.splice(index, 1)
            this.m_RoomInfoMap.wRoomCnt--;
        }
    },
    //俱乐部房间玩家信息
    SetRoomUserInfo: function (UserList) {
        this.m_RoomInfoMap.UserList = UserList;
        if (UserList.dwClubID == this.m_SelClubInfo.dwClubID) {
            for (var i in UserList.UserInfo) {
                if (UserList.UserInfo[i] == null) continue;
                let item = this._tableMap[UserList.UserInfo[i].dwRoomID];
                if (!item) continue;
                item.js.UpdateRoomUser();
            }
        }
    },
    //进入俱乐部房间
    OnEnterRoom: function (RoomID) {
        if (this.m_SelClubInfo.cbCloseStatus == 1) return g_Lobby.ShowTips('已经打烊，不能进入房间');
        g_Lobby.OnQueryRoom(RoomID, this.m_SelClubInfo.dwClubID);
    },
    //解散俱乐部房间
    OnDissolveRoom: function (RoomID, CreaterID, Force, view) {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        if (pGlobalUserData.dwUserID != CreaterID && this.m_SelClubInfo.cbClubLevel < 8) {
            g_Lobby.ShowTips("您不是房主，无法解散房间！");
            return;
        }
        g_Lobby.ShowAlert("确认解散房间？", Alert_YesNo, function (Res) {
            if (Res) {
                if (view) view.HideView();
                var QueryDCR = new CMD_GP_C_DissClubRoom();
                QueryDCR.dwRoomID = RoomID;
                QueryDCR.dwUserID = pGlobalUserData.dwUserID;
                QueryDCR.dwClubID = this.m_SelClubInfo.dwClubID;
                QueryDCR.dwLeagueID = this.m_SelClubInfo.dwLeagueID;
                QueryDCR.byForce = Force;
                //var LoginMission = new CGPLoginMission(this, MDM_GP_GET_SERVER, SUB_GP_DISS_CLUB_ROOM, QueryDCR);
                window.gClubClientKernel.OnSendDissClubRoom(this, QueryDCR);
            }
        }.bind(this));
    },
    //
    OnClubRoomDisolve: function (UserList) {
        g_Lobby.ShowAlert("解散成功！", Alert_Yes, function (Res) {
            //this.UpdateRoomList(null, this.m_SelClubInfo);
        }.bind(this));
    },

    //创建/加入/解散 失败信息
    OnQueryFailed: function (FailedRes) {
        g_Lobby.ShowTips(FailStr[FailedRes.byRes]);
    },

    _filterTable: function () {
        for (var i in this._tableMap) {
            let t = this._tableMap[i];
            t.item.active = this._filter(t.data[0]);
        }
        this._updateTableIndex();
        this._vTableList.RefushList();
    },

    //按游戏类型显示列表
    OnClick_ShowRoomKind: function (Tag, KindID) {
        if (!this._autoClick) cc.gSoundRes.PlaySound('Button');
        this._autoClick = false;
        this.m_RoomKind = KindID;
        this._markTagAll.isChecked = true;
        this.m_Tag = 0;
        this._filterTable();
        this._updateMark();
    },
    //根据标签显示房间
    OnTagClick: function (_, Tag) {
        if (!this._autoClick) cc.gSoundRes.PlaySound('Button');
        this.m_Tag = Tag;
        this._filterTable();
    },

    OnShowQuickJoin: function () {
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('ClubQuickJoin', this.m_Hook.node, function (Js) {
            Js.onSetRoomInfo(this.m_RoomInfoMap);
        }.bind(this));
    },

    ModifyRoomInfor: function (Res) {

        if (this._tableMap[Res.dwRoomID]) {
            this._tableMap[Res.dwRoomID].js.UpdateRoomInfor(Res);
            let bUpdateTable = false;
            let roomInfo = this._tableMap[Res.dwRoomID].data[0];
            if (roomInfo.szTag != Res.szTag) {
                if (this._markMap[roomInfo.szTag]) {
                    bUpdateTable = this._deleteMark(roomInfo.szTag,roomInfo.wKindID);
                } 
            }
            if (bUpdateTable) this._filterTable();

            roomInfo.llSitScore = Res.llSitScore;							//参与分
            roomInfo.llStandScore = Res.llStandScore;						//淘汰分

            roomInfo.dwBigRevRules = Res.dwBigRevRules;						//大局表情规则
            roomInfo.dwBigMinScore = Res.dwBigMinScore;						//大局表情起曾分
            roomInfo.dwBigCnt = Res.dwBigCnt;							//大局百分比或固定数量

            roomInfo.dwSmallRevRules = Res.dwSmallRevRules;					//小局表情规则
            roomInfo.dwSmallMinScore = Res.dwSmallMinScore;					//小局表情起曾分
            roomInfo.dwSmallCnt = Res.dwSmallCnt;						//小局百分比或固定数量

            roomInfo.cbReturnType = Res.cbReturnType;						//反水类型
            roomInfo.bNegativeScore = Res.bNegativeScore;						//反水类型
            roomInfo.dwMagnification = Res.dwMagnification;					//倍率
            roomInfo.szTag = Res.szTag;					//标签

            if(Res.szTag!=''){
                this._insertMark(roomInfo);
            }
        }

    },
    OnSwitchTableBG: function (index) {
        return ;
        this._vTableList.ForEachCtrl(function (Js) {
            Js.OnSwitchTableBG(index);
        })
        this.onSwitchCreateRoomBG(index);
    },
    onSwitchCreateRoomBG: function (index) {
        return ;
        if (index == null) index = window.g_Setting[window.SetKey_CLUB_TABLE_COLOR];
        cc.gPreLoader.LoadRes(`Image_ClubDLG_Table${index}4`, 'Club', function (res) {
            this.$('view/content/BtCreateRoom/BGTable@Sprite').spriteFrame = res;
        }.bind(this));
    },
});
