cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_EdPhone: cc.EditBox,
        m_EdCode: cc.EditBox,
        m_BtGetCode: cc.Button,
    },

    ctor: function () {
        this.m_nNeedUpdate = 0;
        this.m_cbCheckState = 1; // 需要的手机绑定状态 1:需要校验输入手机号没有绑定 2:需要校验手机号已绑定 3:需要校验与当前账号绑定相同手机号
        this.m_BindPNum = 0; // 当前绑定手机
        this.m_keyPhoneCode = window.Key_PhoneCode;
        this.m_keyPhoneCodeTime = window.Key_PhoneCodeTime;
    },

    onLoad: function () {

    },

    OnShowView: function () {
        ShowO2I(this.node);
    },

    OnHideView: function () {
        HideI2O(this.node);
    },

    SetHook: function (Hook, callFunc) {
        this.m_Hook = Hook;
        this.m_callFunc = callFunc;
    },

    SetKey: function(Key) {
        this.m_keyPhoneCode = `${window.Key_PhoneCode}_${Key}`;
        this.m_keyPhoneCodeTime = `${window.Key_PhoneCodeTime}_${Key}`;
    },

    SetCheckState: function(cbState) {
        this.m_cbCheckState = cbState;
    },

    SetPhoneNum: function(PhoneNum) {
        this.m_EdPhone.string = PhoneNum;
    },

    CheckPhoneBind: function (Callback) {
        var resPhone = this._CheckInput_Phone();
        if(resPhone.code != 0) return false;
        var webUrl = `${window.PHP_HOME}/UserFunc.php?GetMark=29&PhoneNum=${resPhone.PhoneNum}`;
        WebCenter.GetData(webUrl, 3, function (data) {
            var res = JSON.parse(data);
            if(Callback) Callback(res.UserID);
        }.bind(this));
        return true;
    },

    GetAllowTimeOfVerificationCode: function(Key) {
        if(window.VCODE_GET) {
            var now = new Date().getTime();
            var codeTime = parseInt(cc.sys.localStorage.getItem(Key));
            var cntdown = (60000 + codeTime - now) / 1000
            if (codeTime != null && cntdown > 0) {
                this.m_Hook.ShowTips('操作频繁，请在等待' + parseInt(cntdown) + '秒');
                return cntdown;
            }
        }
        return 0;
    },

    GetVerificationCode: function(CallBack) {
        var resPhone = this._CheckInput_Phone();
        if(resPhone.code != 0) {
            this.m_Hook.ShowTips(resPhone.describe);
            return;
        }
        if(this.GetAllowTimeOfVerificationCode(this.m_keyPhoneCodeTime) > 0) return;
        this.CheckPhoneBind(function(UserID) {
            if(this.m_cbCheckState == 1) { // 需要校验输入手机号没有绑定
                if(UserID > 0) {
                    this.m_Hook.ShowTips('该手机号已被占用!');
                    return;
                }
            } else if(this.m_cbCheckState == 2) { // 需要校验手机号已绑定
                if(UserID == 0) {
                    this.m_Hook.ShowTips('该手机未绑定任何账号!');
                    return;
                }
            } else if(this.m_cbCheckState == 3) { // 需要校验与当前账号绑定相同手机号
                var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
                if(UserID > 0) {
                    if(UserID != pGlobalUserData.dwUserID) {
                        this.m_Hook.ShowTips('手机号输入错误!');
                        return;
                    }
                } else {
                    this.m_Hook.ShowTips('该手机未绑定任何账号!');
                    return;
                }
            }

            if(window.VCODE_GET) {
                var webUrl = window.PHP_HOME + '/UserFunc.php?&GetMark=3&Phone=' + resPhone.PhoneNum;
                WebCenter.GetData(webUrl, null, function (data) {
                    if (this.m_Hook) this.m_Hook.StopLoading();
                    if (data === -1) {
                        this.m_Hook.ShowTips('请检查网络!');
                    } else {
                        var res = JSON.parse(data);
                        this.SetNewCode(res.code, res.code == 0 ? res.cmscode : null, res.info);
                        if(CallBack) CallBack(res.code == 0 ? res.cmscode : null);
                    }
                }.bind(this));
            } else {
                this.SetNewCode(0, 1234, '');
            }

        }.bind(this));
    },

    SetNewCode: function (code, PhoneCode, describe) {
        if(code == 0) {
            if (window.LOG_NET_DATA) console.log('SetNewCode' + PhoneCode)
            cc.sys.localStorage.setItem(this.m_keyPhoneCode, PhoneCode);
            cc.sys.localStorage.setItem(this.m_keyPhoneCodeTime, new Date().getTime());
            this.m_Hook.ShowTips("验证码已发送到您的手机");
            return;
        }
        this.m_Hook.ShowAlert((!describe || describe == '') ? "输入手机号不正确!" : str);
        this.Clear();
    },

    OnClicked_GetCode: function () {
        this.GetVerificationCode();
    },

    OnEditBoxInput_Began: function (pEditBox) {
        this.m_TargetEB = pEditBox;
    },

    OnEditBoxInput_Changed: function (pEditBox) {
        if (this.m_TargetEB == this.m_EdPhone) {
            this.m_nNeedUpdate = 1;
        } else if (this.m_TargetEB == this.m_EdCode) {
            this.OnCheckInputVCode();
        }
    },

    OnEditBoxInput_Ended: function (strText) {
        if (this.m_TargetEB == this.m_EdPhone) {
            // this.m_nNeedUpdate = 1;
        } else if (this.m_TargetEB == this.m_EdCode) {
            this.OnCheckInputVCode();
        }
    },

    OnEditBoxInput_Return: function (pEditBox) {

    },

    _CheckInput_Phone: function() {
        if (this.m_EdPhone.string.length < 11) {
            return {code:1, describe: "请填写正确手机号码!", PhoneNum: null};
        }
        return {code:0, describe: "手机号码正确!", PhoneNum: this.m_EdPhone.string};
    },

    _CheckInput_Code: function() {
        var now = new Date().getTime();
        var pcode = cc.sys.localStorage.getItem(this.m_keyPhoneCode);
        var codeTime = cc.sys.localStorage.getItem(this.m_keyPhoneCodeTime);
        if (!pcode == null) {
            return {code:2, describe: "请先获取验证码!", PhoneCode: null};
        }
        if (now - codeTime > 3600000) {
            return {code:3, describe: "操作超时，请重新获取!", PhoneCode: null};
        }

        if (this.m_EdCode.string < this.m_EdCode.string.length) {
            return {code:4, describe: "请输入验证码!", PhoneCode: null};
        }

        if (pcode != this.m_EdCode.string) {
            return {code:5, describe: "验证码错误，请重新输入!", PhoneCode: null};
        }

        return {code:0, describe: "验证码正确!", PhoneCode: pcode};
    },

    OnCheckInputVCode: function () {
        if (this.m_Hook && this.m_callFunc) this.m_callFunc(false);
        var resCode = this._CheckInput_Code();
        if (resCode.code != 0) {
            if(resCode.code == 5) {
                this.m_Hook.ShowTips(resCode.describe);
            }
            return false;
        }
        if (this.m_Hook && this.m_callFunc) this.m_callFunc(true);
        return true;
    },

    Check: function (bReset) {
        var res = {code:0, describe: "", PhoneNum: 0, PhoneCode: 0};
        var resPhone = this._CheckInput_Phone();
        if (resPhone.code != 0) {
            res.code = resPhone.code;
            res.describe = resPhone.describe;
            this.m_Hook.ShowTips(res.describe);
            return res;
        }
        var resCode = this._CheckInput_Code();
        if (resCode.code != 0) {
            res.code = resCode.code;
            res.describe = resCode.describe;
            this.m_Hook.ShowTips(res.describe);
            return res;
        }
        res.code = 0;
        res.describe = "填写正确";
        res.PhoneNum = resPhone.PhoneNum;
        res.PhoneCode = resCode.PhoneCode;
        if (bReset) this.Reset();
        return res;
    },

    Reset: function () {
        //重置界面
        this.m_EdPhone.string = '';
        this.m_EdCode.string = '';
    },

    Clear: function() {
        cc.sys.localStorage.setItem(this.m_keyPhoneCode, null);
    },

});
