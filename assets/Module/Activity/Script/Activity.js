cc.Class({
    extends: cc.BaseClass,

    properties: {},
    ctor: function () {
        this.m_ImgArr = new Array();
        this.m_nNeedUpdate = 0;
    },

    OnClicked_Toggle: function (Tag) {
        cc.gSoundRes.PlaySound('Button');
        this.m_nNeedUpdate = 1;
    },

    onLoad: function () {
        if (!this.m_Toggle) this.m_Toggle = this.$('Toggle@Toggle');
        if (this.m_Toggle) this.m_Toggle.node.active = false;
    },

    update: function () {
        if (this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate--;
        } else {
            return;
        }
        if (this.m_Toggle.isChecked) {
            cc.sys.localStorage.setItem(window.Key_ActivityPop, new Date().getTime());
        } else {
            cc.sys.localStorage.setItem(window.Key_ActivityPop, 0);
        }

    },

    OnShowData: function (LeagueID, ClubID, KindID) {
        if (this.m_Toggle) {
            if(LeagueID || ClubID || KindID) {
                this.m_Toggle.node.active = false;
            } else {
                this.m_Toggle.node.active = true;
                var ActivityPop = parseInt(cc.sys.localStorage.getItem(window.Key_ActivityPop));
                if (!ActivityPop) {
                    this.m_Toggle.isChecked = false;
                } else {
                    var last = new Date(ActivityPop);
                    var cur = new Date();
                    if (last.getFullYear() != cur.getFullYear() || last.getMonth() != cur.getMonth() || last.getDay() != cur.getDay()) {
                        this.m_Toggle.isChecked = false;
                    }
                }
            }
        }

        if (this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'Activity', this);
        var webUrl = `${window.PHP_HOME}/Activity.php?LeagueID=${LeagueID}&ClubID=${ClubID}`;
        WebCenter.GetData(webUrl, 60, function (data) {
            if(data == null || data == '') return;
            var DataList = JSON.parse(data);
            for (var i = 0; i < DataList.length; i++) {
                DataList[i][0] = i;
                this.m_ListCtrl.InsertListInfo(0, DataList[i]); //.push(i == 0)
            }
            //设置俱乐部公告标签
            if (ClubID) {
                var strTag = KindID > 1 ? '联盟公告' : '俱乐部公告';
                var DataArr = [100, strTag, ClubID, '', 100];
                this.m_ListCtrl.InsertListInfo(0, DataArr); //.push(i == 0)
            }
            if (KindID) {
                var DataArr = [101, '专属公告', ClubID, '', 100];
                this.m_ListCtrl.InsertListInfo(0, DataArr); //.push(i == 0)
            }
        }.bind(this));
    },
    OnChangeView: function (Url, Type) {
        if (Type == 0) {
            this.$('ScrollView/view/content/RichText').active = true;
            this.$('ScrollView/view/content/Sprite').active = false;
            this.$('ScrollView/view/content/RichText@RichText').string = Url;
        } else {
            this.$('ScrollView/view/content/RichText').active = false;
            this.$('ScrollView/view/content/Sprite').active = true;
            var ImgUrl = window.PHP_HOME + '/HeadImage.php?url=' + Url;
            this.$('ScrollView/view/content/Sprite@CustomImage').SetImageUrl(ImgUrl);
        }
    },
    OnShowClubNotice: function (ClubID, type) {
        this.$('ScrollView/view/content/Sprite').active = false;
        this.ShowPrefabDLG("ClubNotice", null, function (Js) {
            Js.OnShowNotice(ClubID, type);
        });
    },
    ///////////////////////////////////////////////////////////////////
    //Pre js
    InitPre: function () {},
    SetPreInfo: function (ParaArr) { //
        this.m_DataArr = ParaArr;
        this.$('Background/Label@Label').string = ParaArr[1];
        this.$('Background/checkmark/Label@Label').string = ParaArr[1];
        if (ParaArr[0] == 0) {
            this.$('@Toggle').isChecked = false;
            this.$('@Toggle').check();
        }
    },
    OnClick_ShowData: function () {
        //加载联盟公告
        if (this.m_DataArr[4] == 100) {
            this.m_Hook.OnShowClubNotice(this.m_DataArr[2], this.m_DataArr[0] == 100 ? 0 : 1);
            return;
        }
        if (this.m_Hook['m_JsClubNotice']) this.m_Hook['m_JsClubNotice'].node.active = false;
        var ViewIndex = 2;
        if (this.m_DataArr[4] == 0) ViewIndex = 3;
        this.m_Hook.OnChangeView(this.m_DataArr[ViewIndex], this.m_DataArr[4]);
    },
});
