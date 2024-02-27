cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_WXLabel:cc.Label,
        m_QQLabel:cc.Label,
    },
    OnShowView:function () {
        var layout = this.$(`BG/ScrollView/view/Layout`);
        for(var i=0;i<layout.childrenCount;i++){
            layout.children[i].active = false;
        }
        this.m_LabExample = this.$(`BG/ScrollView/view/Layout/WX`);
        this.m_Parent = this.$(`BG/ScrollView/view/Layout`);

        this.m_LabQQExample = this.$(`BG/ScrollView/view/Layout/QQ`);
        this.m_QQParent = this.$(`BG/ScrollView/view/Layout`);

        this.m_Lab24Example = this.$(`BG/ScrollView/view/Layout/24`);
        this.m_24Parent = this.$(`BG/ScrollView/view/Layout`);

        this.m_LabText = [];
        this.Num = 0;
        var webUrl = window.PHP_HOME+'/Services.php?&GetMark=0';
        WebCenter.GetData(webUrl, 0, function (data) {
            if(data == null || data == '') return;
            var Json = JSON.parse(data);
            for(var i=0;i<Json[0].length;i++){
                if(Json[0][i].length > 0){
                    this.Num++;
                    this.$(`BG/ScrollView/view/Layout/WX/Label@Label`).string = Json[0][i];
                    this.m_LabText[this.Num] = this.CopyLabel(this.m_LabExample, this.m_Parent);
                }
            }
            var webUrl1 = window.PHP_HOME+'/Services.php?&GetMark=1';
            WebCenter.GetData(webUrl1, 0, function (data) {
                var Data = JSON.parse(data);
                for(var i=0;i<Data[0].length;i++){
                    if(Data[0][i].length > 0){
                        this.Num++;
                        this.$(`BG/ScrollView/view/Layout/QQ/Label@Label`).string = Data[0][i];
                        this.m_LabText[this.Num] = this.CopyLabel(this.m_LabQQExample, this.m_QQParent);
                    }
                }
                this.m_LabText[this.Num] = this.CopyLabel(this.m_Lab24Example, this.m_24Parent);
            }.bind(this));
        }.bind(this));
    },
    CopyLabel: function(pLabel, Parent) {
        var pLabCopy = cc.instantiate(pLabel);
        Parent.addChild(pLabCopy);
        pLabCopy.name = `${Parent.children.length-1}`;
        pLabCopy.active = true;
        return pLabCopy;
    },
    OnBtWXCopy:function(){
        cc.gSoundRes.PlaySound('Button');
        ThirdPartyCopyClipper(this.m_WXLabel.string);
        this.m_Hook.ShowTips('已复制到剪切板')
    },
    OnBtCallBack:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('CallBack');
    },
    OnBtComplain:function(){
        cc.gSoundRes.PlaySound('Button');
        this.ShowPrefabDLG('Complain');
    }
    // update (dt) {},
});
