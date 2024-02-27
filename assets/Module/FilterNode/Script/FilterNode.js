cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    ctor:function(){
        this._page = 1;
        this._totalPage = 1;
        this._day = 0;
        this._Kind = 0;
        this._type = 0;
        this._level = 0;
        this._cb = null;
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._node = this.$('Node');
        this._LabPageCnt = this.$('Node/PageNode/PageCnt@Label');
        this._pageNode = this.$('Node/PageNode');
        this._LabPageCnt.string = `${this._page} / ${this._totalPage}`;

        this._DayNode = this.$('Node/DayNode');
        this._DayMenu = this.$('Node/DayNode/Layout');
        this._BtDayLab = this.$('Node/DayNode/BtDayMenu/Background/Label@Label');

        this._TypeNode = this.$('Node/TypeNode');
        this._TypeMenu = this.$('Node/TypeNode/Layout');
        this._BtTypeLab = this.$('Node/TypeNode/BtTypeMenu/Background/Label@Label');

        this._KindNode = this.$('Node/KindNode');
        this._KindMenu = this.$('Node/KindNode/Layout');
        this._BtKindLab = this.$('Node/KindNode/BtKindMenu/Background/Label@Label');

        this._LevelNode = this.$('Node/LevelNode');
        this._LevelMenu = this.$('Node/LevelNode/Layout');
        this._BtLevelLab = this.$('Node/LevelNode/BtLevelMenu/Background/Label@Label');

        this._closeNode = this.$('CloseNode');

        this._pageNode.active = false;
        this._DayNode.active = false;
        this._TypeNode.active = false;
        this._KindNode.active = false;
        this._LevelNode.active = false;
        this._closeNode.active = false;

        this._DayMenu.active = false; 
        this._TypeMenu.active = false;
        this._KindMenu.active = false;
        this._LevelMenu.active = false;
    },
    /*
    FILTER_MENU_PAGE             =       0x01
    FILTER_MENU_DAY             =       0x02
    FILTER_MENU_TYPE             =       0x04
    FILTER_MENU_KIND             =       0x08
    FILTER_MENU_LEVEL             =       0x10
    */
    SetMode:function(filterMenu,cb,pos){
        this._node.setPosition(pos);
        this.SetMode1(filterMenu);
        this._cb = cb;
        this.execCallBack();
    },
    SetMode1:function(filterMenu){
        this._pageNode.active = filterMenu & FILTER_MENU_PAGE;
        this._DayNode.active = filterMenu & FILTER_MENU_DAY;
        this._TypeNode.active = filterMenu & FILTER_MENU_TYPE;
        this._KindNode.active = filterMenu & FILTER_MENU_KIND;
        this._LevelNode.active = filterMenu & FILTER_MENU_LEVEL;

        if(filterMenu & FILTER_MENU_LEVEL){
            this._LevelMenu = this.$('Node/LevelNode/Layout');
            for (var i in this._LevelMenu._children) {
                if (this._LevelMenu._children[i].name == `BtLevel0`) continue;
                this._LevelMenu._children[i].active = g_ShowClubInfo.cbClubLevel == CLUB_LEVEL_OWNER;
                this._LevelMenu._children[i].active = g_ShowClubInfo.cbClubLevel == CLUB_LEVEL_OWNER;
                this._LevelMenu._children[i].active = g_ShowClubInfo.cbClubLevel >= CLUB_LEVEL_PARTNER;
                this._LevelMenu._children[i].active = g_ShowClubInfo.cbClubLevel >= CLUB_LEVEL_MEMBER;
            }
        }
        this._page = 1;
        this._totalPage = 1;
        this._LabPageCnt.string = `${this._page} / ${this._totalPage}`;
    },

    SetPageTotalCnt:function(cnt,cnt2){
        this._page = cnt2||1;
        this._totalPage = cnt;
        this._LabPageCnt.string = `${this._page} / ${this._totalPage}`;
    },

    OnClick_ChangePage: function (event) {
        if (event.target.name == 'LastPage') {
            if (this._page == 1) return;
            this._page--;
        }
        else {
            if (this._page == this._totalPage) return;
            this._page++;
        }
        this.execCallBack();
    },
    OnClick_btChooseDay: function (event) {
        var day = parseInt(event.target.name.substr(5));
        this._BtDayLab.string = day == 0 ? '今天' : day == 1 ? '昨天' : '前天';
        this._DayMenu.active = false;
        this._closeNode.active = false;
        this._day = day;
        this._page = 1;
        this.execCallBack();
    },
    OnClick_btChooseType: function (event) {
        var t = parseInt(event.target.name.substr(6));
        this._BtTypeLab.string = t == 0 ? '增加' : '减少';
        this._TypeMenu.active = false;
        this._closeNode.active = false;
        this._type = t;
        this._page = 1;
        this.execCallBack();
    },
    OnClick_btChooseKind: function (event) {
        var k = parseInt(event.target.name.substr(6));
        this._BtKindLab.string = k == 0 ? '收取' : '付出';
        this._KindMenu.active = false;
        this._closeNode.active = false;
        this._Kind = k;
        this._page = 1;
        this.execCallBack();
    },

    OnClick_btChooseLevel: function (event) {
        var l = parseInt(event.target.name.substr(7));
        this._BtLevelLab.string = l == 0 ? '全部' :window.ClubLvStr[l];
        this._LevelMenu.active = false;
        this._closeNode.active = false;
        this._level = l;
        this._page = 1;
        this.execCallBack();
    },

    execCallBack:function(){
        if(this._cb)this._cb({d:this._day,t:this._type,k:this._Kind,l:this._level,p:this._page});
    },

    OnClick_btDayMenu: function (event) {
        this._DayMenu.active = !this._DayMenu.active;
        this._closeNode.active = this._DayMenu.active;
    },

    OnClick_btTypeMenu: function (event) {
        this._TypeMenu.active = !this._TypeMenu.active;
        this._closeNode.active = this._TypeMenu.active;
    },

    OnClick_btKindMenu: function () {
        this._KindMenu.active = !this._KindMenu.active;
        this._closeNode.active = this._KindMenu.active;
    },

    OnClick_btLevelMenu: function () {
        this._LevelMenu.active = !this._LevelMenu.active;
        this._closeNode.active = this._LevelMenu.active;
    },

    OnClick_Close: function () {
        this._DayMenu.active = false;
        this._TypeMenu.active = false;
        this._KindMenu.active = false;
        this._LevelMenu.active = false;
        this._closeNode.active = false;
    },

    // update (dt) {},
});
