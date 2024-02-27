cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdPSW: cc.EditBox,
        m_EdPSW2: cc.EditBox,
        m_VeriNode: cc.Node,

    },
    ctor: function () {

    },
    OnShowView: function () {
        this.$('BindPhone').active = false;
        this.$('RebindPhone').active = false;

        if (!this.m_VeriCtrl) {
            this.m_VeriCtrl = this.$('BindPhone@VerificationCtrl');
            this.m_VeriCtrl.SetHook(this, null);
            this.m_VeriCtrl.SetKey('BindPhone');
            this.m_VeriCtrl.SetCheckState(1);
        }
        this.m_VeriCtrl.Reset();

        if (!this.m_VeriCtrlOld) {
            this.m_VeriCtrlOld = this.$('RebindPhone/Old@VerificationCtrl');
            this.m_VeriCtrlOld.SetHook(this, null);
            this.m_VeriCtrlOld.SetKey('BindPhoneOld');
            this.m_VeriCtrlOld.SetCheckState(3);
        }
        this.m_VeriCtrlOld.Reset();

        if (!this.m_VeriCtrlNew) {
            this.m_VeriCtrlNew = this.$('RebindPhone/New@VerificationCtrl');
            this.m_VeriCtrlNew.SetHook(this, null);
            this.m_VeriCtrlNew.SetKey('BindPhoneNew');
            this.m_VeriCtrlNew.SetCheckState(1);
        }
        this.m_VeriCtrlNew.Reset();
    },

    SetBindMode: function (bFirst) {
        this.m_bFirst = bFirst;
        if (this.m_bFirst) {
            this.$('BindPhone').active = true;
            this.$('RebindPhone').active = false;
        } else {
            this.$('BindPhone').active = false;
            this.$('RebindPhone').active = true;
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            // 检查绑定手机
            var webUrl = window.PHP_HOME + '/UserFunc.php?GetMark=19&dwUserID=' + pGlobalUserData.dwUserID;
            WebCenter.GetData(webUrl, 3, function (data) {
                if (data == "") {
                } else {
					var Phone = JSON.parse(data);
                    this.m_VeriCtrlOld.SetPhoneNum(Phone);

                    var pLabel = this.$('LabPNum@Label', this.m_VeriCtrlOld.node);
                    if(pLabel) {
                        pLabel.string = cutPhone(Phone+'');
                    }
                }
            }.bind(this));
        }
    },

    OnClick_BtNext: function () {
        cc.gSoundRes.PlaySound('Button');
        var res = this.m_VeriCtrl.Check();
        if (res.code != 0) {
            return;
        }
        this.$('NdPhone').active = false;
        this.$('NdPsw').active = true;
    },

    OnClicked_Submit: function () {
        cc.gSoundRes.PlaySound('Button');
        if (this.m_bFirst) {
            var resFirst = this.m_VeriCtrl.Check();
            if (resFirst.code != 0) {
                return;
            }
            //提交
            var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
            // var webUrl = window.PHP_HOME + '/UserFunc.php?&GetMark=2&dwUserID=' + pGlobalUserData.dwUserID;
            // webUrl += '&strPsw=' + hex_md5(pGlobalUserData.szPassword);
            // webUrl += '&Phone=' + this.m_EdPhone.string + '&Code=' + this.m_EdCode.string

            var webUrl = `${window.PHP_HOME}/UserFunc.php?&GetMark=2&dwUserID=${pGlobalUserData.dwUserID}&strPsw=${pGlobalUserData.szPassword}&Phone=${resFirst.PhoneNum}&Code=${resFirst.PhoneCode}`;

            WebCenter.GetData(webUrl, null, function (data) {
                if (this.m_Hook) this.m_Hook.StopLoading();
                if (data === -1) {
                    this.ShowTips('请检查网络！');
                } else {
                    var res = JSON.parse(data);
                    if (res.Res == 0) cc.sys.localStorage.setItem(window.Key_PhoneCode, '');

                    this.ShowAlert(res.Describe, Alert_Yes, function (Res) {
                        if (res.Res == 0 && Res) {
                            if(this.m_Hook && this.m_Hook.OnBindSuccess) this.m_Hook.OnBindSuccess(resFirst.PhoneNum);
                            if (this.m_Hook.OnBtRefeshRoomCard) this.m_Hook.OnBtRefeshRoomCard();
                            this.HideView();
                        }
                    }.bind(this))
                }
            }.bind(this));
            this.m_VeriCtrl.Reset();
            return;
        }

        var resOld = this.m_VeriCtrlOld.Check();
        if (resOld.code != 0) return;
        var resNew = this.m_VeriCtrlNew.Check();
        if (resNew.code != 0) return;

        //提交
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = `${window.PHP_HOME}/UserFunc.php?&GetMark=30&dwUserID=${pGlobalUserData.dwUserID}&strPsw=${pGlobalUserData.szPassword}&PhoneNumOld=${resOld.PhoneNum}&PhoneNumNew=${resNew.PhoneNum}&Code=${resNew.PhoneCode}`;

        WebCenter.GetData(webUrl, null, function (data) {
            if (this.m_Hook) this.m_Hook.StopLoading();
            if (data === -1) {
                this.ShowTips('请检查网络！');
            } else {
                var res = JSON.parse(data);
                if (res.Res == 0) {
                    this.m_VeriCtrlOld.Clear();
                    this.m_VeriCtrlNew.Clear();
                }
                this.ShowAlert(res.Describe, Alert_Yes, function (Res) {
                    if (res.Res == 0 && Res) {
                        if(this.m_Hook && this.m_Hook.OnBindSuccess) this.m_Hook.OnBindSuccess(resNew.PhoneNum);
                        if (g_CurScene.OnBtRefeshRoomCard) g_CurScene.OnBtRefeshRoomCard();
                        var platform = cc.sys.localStorage.getItem(window.Key_LoginPlatform);
                        if(platform == window.PLATFORM_PHONE) {
                            cc.sys.localStorage.setItem('LoginAcc', resNew.PhoneNum);
                        }
                        this.HideView();
                    }
                }.bind(this))
            }
        }.bind(this));
        // this.m_VeriCtrlOld.Reset();
        // this.m_VeriCtrlNew.Reset();
    },

});


