cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_groupNode: cc.Node,
        m_rulesNode: cc.Node,
        m_text: cc.Label,
    },
    ctor: function () {
        this.m_bFirstShow = true;
        this.m_KindIDArr = [10012, 62016, 40107, 500, 52081, 10013, 21060, 60001, 10011, 50000, 60014,21201,62005,52160,33301,501];
    },
    OnShowView: function () {
        if (this.m_FirstCtrl == null) {
            this.OnHideAllChild();
            this.m_FirstCtrl = this.$('K0@Toggle', this.m_groupNode);
            this.m_FirstCtrl.isChecked = false;
            this.m_FirstCtrl.check();
        }
        ShowO2I(this.node);
    },

    OnHideView: function(){
        HideI2O(this.node);
    },
    OnHideAllChild: function () {
        for (var i = 0; i < this.m_groupNode.childrenCount; i++) {
            for (var j = 1; j < this.m_groupNode.children[i].childrenCount; j++) {
                this.m_groupNode.children[i].children[j].active = false;
            }
        }
    },
    OnClick_HideKindChild: function (Tag) {
        console.log('OnClick_HideKindChild', Tag)
        this.m_TagKindChild = null;
        var NdList = Tag.currentTarget.parent.parent;// mark .. Background .. k?
        if (NdList == null || NdList.children[1] == null) return
        var bShow = !NdList.children[1].active;
        for (var i = 1; i < NdList.childrenCount; i++) {
            NdList.children[i].active = bShow;
        }
    },
    OnClick_ShowKindChild: function (Tag, Data) {
        console.log('OnClick_ShowKindChild', Tag)
        this.OnHideAllChild();
        this.OnToggleSelGame(Tag, Data);

        var FirstCtrl = null;
        this.m_TagKindChild = Tag;
        this.m_KindChildIndex = 1;
        this.m_nNeedUpdate = 1;

        for (var i = 1; i < Tag.node.childrenCount; i++) {
            var TogCtrl = this.$('@Toggle', Tag.node.children[i]);
            if (FirstCtrl == null) FirstCtrl = TogCtrl;
            if (TogCtrl) TogCtrl.node.active = false;
        }

        // if (FirstCtrl) {
        //     FirstCtrl.isChecked = false;
        //     FirstCtrl.check();
        // }
    },
    update: function(){
        if(this.m_nNeedUpdate > 0) {
            this.m_nNeedUpdate --;
        } else {
            return;
        }
        if(this.m_TagKindChild && this.m_KindChildIndex < this.m_TagKindChild.node.childrenCount) {
            var TogCtrl = this.$('@Toggle', this.m_TagKindChild.node.children[this.m_KindChildIndex]);
            if (TogCtrl) {
                TogCtrl.node.active = true;
                if (this.m_KindChildIndex == 1) {
                    TogCtrl.isChecked = false;
                    TogCtrl.check();
                }
            }
            this.m_KindChildIndex ++;
            this.m_nNeedUpdate = 1;
        }
    },
    OnToggleSelGame: function (Tag, Data) {
        this.$('NotFind').active = false;
        if (Tag.node.name.indexOf('K') >= 0) this.OnHideAllChild();
        for (var i = 0; i < this.m_rulesNode.childrenCount; i++) {
            this.m_rulesNode.children[i].active = false;
        }
        var NdRules = this.$('Sub_' + Data, this.m_rulesNode);
        if (NdRules) {
            NdRules.active = true;
        } else {
            this.$('NotFind').active = true;
        }
    },
});
