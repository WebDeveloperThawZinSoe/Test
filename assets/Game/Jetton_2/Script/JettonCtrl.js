var actTime = 0.2;

cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Item: cc.Prefab,
    },

    ctor: function () {
        this.m_ValueArr = new Array(100, 50, 20, 10, 5, 2, 1); //筹码数值
        this.m_Pool = new cc.NodePool('JettonPool'); //回收池
        this.m_WaitArr = new Array(); //动作队列
        this.m_WaitDelArr = new Array(); //等待删除队列
        this.m_reSetCnt = 0; //绘制上限
        this.m_ActionItemCnt = 0; //移动中数量
        this.m_TableItem = new Array(); //桌面筹码
        for (var i in this.m_ValueArr) {
            this.m_TableItem[this.m_ValueArr[i]] = new Array();
        }
        this.m_lTableScore = 0;
        this.m_Res = {atlas: null, bundle: null, url: null};
    },

    ////////////////////////////////////////// 外部调用接口

    // 设置资源
    SetRes: function(valueArr, atlas, bundle, url) {
        if(!Array.isArray(valueArr) || valueArr.length == 0) return false;
        if(!atlas && (!bundle || !url)) return false;
        this.m_ValueArr = clone(valueArr);
        this.m_TableItem = new Array(); //桌面筹码
        for (var i in this.m_ValueArr) {
            this.m_TableItem[this.m_ValueArr[i]] = new Array();
        }
        this.m_Res.atlas = atlas ? atlas : null;
        this.m_Res.bundle = bundle ? bundle : null;
        this.m_Res.url = url ? url : null;
    },

    //桌面筹码基准点和范围
    SetBenchmarkPos: function (centerPos, Width, Height) {
        this.m_CenterPos = centerPos;
        this.RandomW = Width;
        this.RandomH = Height;
    },

    //筹码飞出坐标
    SetUserPos: function (PosArr) {
        this.m_UserPos = PosArr;
    },

    OnUserAdd: function (wChair, Score) {
        this._InTable(wChair, Score);
        //无动画立刻刷新
        if (wChair == INVALID_CHAIR) this._UpdateTableScore();
    },

    OnUserGet: function (wChair, Score) {
        if (this.m_ActionItemCnt > 0) {
            this.m_WaitArr.push(['_OutTable', wChair, Score]);
        } else {
            this._OutTable(wChair, Score);
        }
        //无动画立刻刷新
        if (wChair == INVALID_CHAIR) this._UpdateTableScore();
    },

    OnGameSetScore: function (Score) {
        if (this.m_ActionItemCnt > 0) {
            this.m_WaitArr.push(['_SetTableJet', Score, null]);
        } else {
            this._SetTableJet(Score);
        }
    },

    //////////////////////////////////////////

    //桌面筹码随机坐标
    _RandomPos: function () {
        var Pos = cc.v2(0, 0);
        Pos.x = this.m_CenterPos.x + parseInt(Math.random() * 123321) % (this.RandomW * 2) - this.RandomW;
        Pos.y = this.m_CenterPos.y + parseInt(Math.random() * 123321) % (this.RandomH * 2) - this.RandomH;
        return Pos;
    },

    //获取待用筹码
    _GetItem: function (value, score) {
        var TempJet;
        if (this.m_Pool.size()) {
            TempJet = this.m_Pool.get();
        } else {
            TempJet = cc.instantiate(this.m_Item);
        }
        this.node.addChild(TempJet);
        var js = TempJet.getComponent('Jetton');
        js.SetData({value: value, score: score, atlas: this.m_Res.atlas, bundle: this.m_Res.bundle, url: this.m_Res.url});
        this.m_TableItem[value].push(js);
        return js;
    },

    //回收筹码
    _DelItem: function (JetNode) {
        JetNode.parent = null;
        this.m_Pool.put(JetNode);
    },

    _Score2Value: function(Score) {
        return Number(Score / window.PLATFORM_RATIO);
    },

    _Value2Score: function(Value) {
        return Number(Value * window.PLATFORM_RATIO);
    },

    //向桌子添加筹码
    _InTable: function (wChair, Score) {
        var temp = this._Score2Value(Score);
        for (var i in this.m_ValueArr) {
            while (temp >= this.m_ValueArr[i]) {
                temp -= this.m_ValueArr[i];
                var Item = this._GetItem(this.m_ValueArr[i], this._Value2Score(this.m_ValueArr[i]));
                var bAction = (wChair != INVALID_CHAIR);
                if(bAction) {
                    Item.node.setPosition(this.m_UserPos[wChair]);
                    var ptTo = this._RandomPos();
                    Item.Move(ptTo, actTime, 0, function(){this._OnMoveStartCallback();}.bind(this), this._OnMoveEndCallback, this);
                } else {
                    Item.node.setPosition(this._RandomPos());
                }
            }
        }
    },

    //筹码移出桌子
    _OutTable: function (wChair, Score) {
        var temp = this._Score2Value(Score);
        for (var i in this.m_ValueArr) {
            while (temp >= this.m_ValueArr[i] && this.m_TableItem[this.m_ValueArr[i]].length) {
                temp -= this.m_ValueArr[i];
                var Item = this.m_TableItem[this.m_ValueArr[i]].shift();
                var bAction = (wChair != INVALID_CHAIR);
                if(bAction) {
                    Item.Move(this.m_UserPos[wChair], actTime, 0, function(){this._OnMoveStartCallback();}.bind(this), this._OnMoveEndDelCallback, this);
                    this.m_WaitDelArr.push(Item);
                } else {
                    this._DelItem(Item.node);
                }
            }
        }
    },

    _OnMoveStartCallback: function() {
        this.m_ActionItemCnt++;
    },

    _OnMoveEndCallback: function(tag, param) {
        this.m_ActionItemCnt--;
    },

    _OnMoveEndDelCallback: function(tag, param) {
        this.m_ActionItemCnt--;
        if (this.m_ActionItemCnt == 0) {
            //删除筹码
            for (var i in this.m_WaitDelArr) {
                this._DelItem(this.m_WaitDelArr[i].node);
            }
            this.m_WaitDelArr = new Array();
            this._UpdateTableScore();
            //动作队列
            if (this.m_WaitArr.length > 0) {
                var obj = this.m_WaitArr.shift();
                this[obj[0]](obj[1], obj[2]);
            } else {
                this._CheckReSet();
            }
        }
    },

    _UpdateTableScore: function () {
        this.m_lTableScore = this._GetTableScore();
        if (this.m_Hook.SetTableScore) this.m_Hook.SetTableScore(this.m_lTableScore);
    },

    //当前筹码面值
    _GetTableScore: function () {
        var Score = 0;
        for (var i in this.m_TableItem) {
            if(!this.m_TableItem[i][0]) continue;
            Score += this.m_TableItem[i][0].GetData().score * this.m_TableItem[i].length;
        }
        return Score;
    },
    //检查重绘
    _CheckReSet: function () {
        //无需重绘
        if (this.m_reSetCnt == 0) return;
        var Cnt = 0;
        for (var i in this.m_TableItem) {
            Cnt += this.m_TableItem[i].length;
        }

        if (Cnt < this.m_reSetCnt) return;
        var Score = this._GetTableScore();
        this._OutTable(INVALID_CHAIR, Score);
        this._InTable(INVALID_CHAIR, Score);
    },

    //设置桌面筹码
    _SetTableJet: function (Score) {
        if (Score == this._GetTableScore()) return;
        if (Score < this._GetTableScore()) {
            this._OutTable(INVALID_CHAIR, this._GetTableScore() - Score);
        } else {
            this._InTable(INVALID_CHAIR, Score - this._GetTableScore());
        }
        //无动画立刻刷新
        this._UpdateTableScore();
    },
});
