cc.Class({
    extends: cc.BaseClass,

    properties: {

    },

    onLoad: function () {
        this.m_strInput = '';
        this.m_strShowInput = '';
        this.m_LabInput = this.$('BGInput/Label@Label');
        var arr = this.$('Layout').children;
        for (var i = 0; i < arr.length; i++) {
            arr[i].on('click', this.onBtClicked, this);
        }
    },
    onEnable: function () {
        this.m_LabInput.string = '';
        this.m_strInput = '';
        this.m_strShowInput = '';
    },
    SetHook: function (hook) {
        this.m_Hook = hook;
    },
    onBtClicked: function (tag) {
        console.log(tag.node.name);

        var strFmt = '     ';
        if (tag.node.name == 'del') {
            if (this.m_strInput.length > 0) {
                this.m_strInput = this.m_strInput.slice(0, this.m_strInput.length - 1);
                this.m_strShowInput = this.m_strShowInput.slice(0, this.m_strShowInput.length - 6);
            }
        } else if (tag.node.name == 'Reset') {
            this.m_LabInput.string = '';
            this.m_strInput = '';
            this.m_strShowInput = '';
        } else {
            this.m_strInput += tag.node.name;
            if (this.m_strShowInput.length == 0) {
                this.m_strShowInput += tag.node.name;
            } else {
                this.m_strShowInput += strFmt + tag.node.name;
            }
        }

        this.m_LabInput.string = this.m_strShowInput;

        if (this.m_strInput.length >= 6) {
            var webUrl = window.PHP_HOME + '/GameRecord.php?&GetMark=8&ReplayCode=' + this.m_strInput;
            WebCenter.GetData(webUrl, 30, function (data) {
                var Arr = JSON.parse(data);
                if (Arr.length == 0) {
                    this.m_LabInput.string = '';
                    this.m_strInput = '';
                    this.m_strShowInput = '';
                    g_CurScene.ShowTips('回放码错误，请输入正确的');
                    return;
                } else {
                    var UserInfo = new Object();
                    UserInfo.dwUserID = Arr[1]
                    this.m_Hook.m_Hook.OnRePlayGame(Arr[0], Arr[2], UserInfo);
                    this.node.active = false;
                }
            }.bind(this));
        }
    },
});
