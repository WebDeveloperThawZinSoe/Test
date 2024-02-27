cc.Class({

    extends: cc.BaseControl,

    properties: {
        m_HOOK: cc.Component,
        m_ResponseNode: cc.Node,
        m_ResponseComName: cc.String,
        m_WoShiFenGeXian: cc.String,
        ////////////////////////////////////////////
        m_LabCustom: [cc.Label],
        m_Label: cc.Label,
        m_EditBox: cc.EditBox,
        m_WoShiFenGeXian1: cc.String,

        ////////////////////////////////////////////
        m_btClose: cc.Button,
        m_btOK: cc.Button,
        m_btNO: cc.Button,
        m_btNoClick: cc.Button,
        m_WoShiFenGeXian2: cc.String,

        ////////////////////////////////////////////
        m_SwitchToggleNode: cc.Node,
        m_SwitchToggleArray: [cc.Toggle],

        m_SwitchButtonNode: cc.Node,
        m_SwitchButtonArray: [cc.Button],

        m_SwitchPageNode: cc.Node,
        m_PageArray: [cc.Node],
    },

    ctor: function () {},

    onLoad: function () {

    },

    start: function () {
        var cbIndex = 0;
        if (this.m_SwitchToggleNode) {
            this.m_SwitchToggleArray = new Array();
            this.TraverseNode({
                ContentArray: this.m_SwitchToggleArray,
                SouceNode: this.m_SwitchToggleNode,
                SearchCom: cc.Toggle,
                HandlerComponet: null,
                HandlerFunc: null,
                CustomData: null,
            });
        }
        for (var i = 0; i < this.m_SwitchToggleArray.length; ++i) {
            this.AddClickHandler(this.m_SwitchToggleArray[i], this.node, 'CustomPage', 'OnButtonClickedSwitchPage', cbIndex);
            ++cbIndex;
        }

        if (this.m_SwitchButtonNode) {
            this.m_SwitchButtonArray = new Array();
            this.TraverseNode({
                ContentArray: this.m_SwitchButtonArray,
                SouceNode: this.m_SwitchButtonNode,
                SearchCom: cc.Button,
                HandlerComponet: null,
                HandlerFunc: null,
                CustomData: null,
            });
        }
        for (var i = 0; i < this.m_SwitchButtonArray.length; ++i) {
            this.AddClickHandler(this.m_SwitchButtonArray[i], this.node, 'CustomPage', 'OnButtonClickedSwitchPage', cbIndex);
            ++cbIndex;
        }

        if (this.m_SwitchPageNode) {
            this.m_PageArray = new Array();
            for (var i = 0; i < this.m_SwitchPageNode.childrenCount; ++i) {
                this.m_PageArray[i] = this.m_SwitchPageNode.getChildByName('' + i);
            }
        }

        if (this.m_SwitchToggleArray.length > 0) this.UpdateSwitchPage(0, 0);
        if (this.m_SwitchButtonArray.length > 0) this.UpdateSwitchPage(0, 0);
    },

    SetAttribute2: function () {
        // SetOK: {
        //     _active: true,
        //     _enable: true,
        //     _valid: true,
        //     _hook: this,
        //     _callback: null,
        //     _event: {
        //         _target: null,
        //         _component: null,
        //         _handler: null,
        //         _CustomData: null
        //     }
        // },

        if (this.m_btClose) {
            if (this.m_Attribute.SetClose) {
                this.AddClickHandler(this.m_btClose, this.node, 'CustomPage', 'OnButtonClickedClose');
                if (this.m_Attribute.SetClose._event && this.m_Attribute.SetClose._event._target &&
                    this.m_Attribute.SetClose._event._component && this.m_Attribute.SetClose._event._handler) {
                    this.AddClickHandler(this.m_btClose, this.m_Attribute.SetClose._event._target,
                        this.m_Attribute.SetClose._event._component, this.m_Attribute.SetClose._event._handler);
                }
                if (this.m_Attribute.SetClose._active) this.m_btClose.node.active = true;
                else this.m_btClose.node.active = false;
            } else {}
        }
        if (this.m_btOK) {
            if (this.m_Attribute.SetOK) {
                this.AddClickHandler(this.m_btOK, this.node, 'CustomPage', 'OnButtonClickedOK');
                if (this.m_Attribute.SetOK._event && this.m_Attribute.SetOK._event._target &&
                    this.m_Attribute.SetOK._event._component && this.m_Attribute.SetOK._event._handler) {
                    this.AddClickHandler(this.m_btOK, this.m_Attribute.SetOK._event._target,
                        this.m_Attribute.SetOK._event._component, this.m_Attribute.SetOK._event._handler,
                        this.m_Attribute.SetOK._event._customData
                        );
                }
                if (this.m_Attribute.SetOK._active) this.m_btOK.node.active = true;
                else
                    this.m_btOK.node.active = false;
            } else {}
        }
        if (this.m_btNO) {
            if (this.m_Attribute.SetNO) {
                this.AddClickHandler(this.m_btNO, this.node, 'CustomPage', 'OnButtonClickedNO');
                if (this.m_Attribute.SetNO._event && this.m_Attribute.SetNO._event._target &&
                    this.m_Attribute.SetNO._event._component && this.m_Attribute.SetNO._event._handler) {
                    this.AddClickHandler(this.m_btNO, this.m_Attribute.SetNO._event._target,
                        this.m_Attribute.SetNO._event._component, this.m_Attribute.SetNO._event._handler);
                }
                if (this.m_Attribute.SetNO._active) this.m_btNO.node.active = true;
                else this.m_btNO.node.active = false;
            } else {}
        }
        if (this.m_btNoClick) {
            if (this.m_Attribute.SetBGClose) {
                this.m_btNoClick.node.active = true;
                this.AddClickHandler(this.m_btNoClick, this.node, 'CustomPage', 'OnButtonClickedBG');
                if (this.m_Attribute.SetBGClose._event && this.m_Attribute.SetBGClose._event._target &&
                    this.m_Attribute.SetBGClose._event._component && this.m_Attribute.SetBGClose._event._handler) {
                    this.AddClickHandler(this.m_btNoClick, this.m_Attribute.SetBGClose._event._target,
                        this.m_Attribute.SetBGClose._event._component, this.m_Attribute.SetNO._event._handler);
                }
                if (this.m_Attribute.SetBGClose._active) this.m_btNoClick.node.active = true;
                else this.m_btNoClick.node.active = false;
            } else {

            }
        }
    },

    SetString: function (szText) {
        console.log(szText);
        this.m_Label.string = szText;
    },

    GetEditBoxString: function () {
        if (this.m_EditBox) return this.m_EditBox.string;
        return '';
    },

    OnButtonClickedClose: function () {
        this.HidePage();
    },

    OnButtonClickedOK: function () {
        if(this.m_Attribute.SetOK._valid) this.HidePage();

        if (this.m_HOOK && this.m_HOOK.OnOKCallback) {
            this.m_HOOK.OnOKCallback(this);
        }
        if (this.m_Attribute.SetOK._hook && this.m_Attribute.SetOK._hook[this.m_Attribute.SetOK._callback]) {
            this.m_Attribute.SetOK._hook[this.m_Attribute.SetOK._callback](this);
        }
    },

    OnButtonClickedNO: function () {
        this.HidePage();
    },

    OnButtonClickedBG: function (event, customData) {
        if (customData == 1 || this.m_Attribute.SetBGClose._valid) {
            this.HidePage();
        }
    },

    HidePage: function () {
        if (this.m_ResponseNode instanceof cc.Node) {
            var pCom = this.$('@' + this.m_ResponseComName, this.m_ResponseNode);
            if(pCom && pCom.HideView) pCom.HideView();
            else this.m_ResponseNode.active = false;
        } else {
            this.node.active = false;
        }
    },

    ///////////////////////////////////////////////////

    SetCustomText: function (szText, ColorArray, ActiveArray) {

        if (!this.m_LabCustom) return;

        for (var i = 0; i < this.m_LabCustom.length; ++i) {

            this.m_LabCustom[i].string = ''

            if (Array.isArray(szText)) this.m_LabCustom[i].string = szText[i];

            else this.m_LabCustom[i].string = szText;

            if (ColorArray && ColorArray[i]) {

                this.m_LabCustom[i].node.color = ColorArray[i];
            }

            if (ActiveArray) {

                this.m_LabCustom[i].node.active = ActiveArray[i];
            }
        }
    },

    ///////////////////////////////////////////////////

    OnButtonClickedSwitchPage: function (event, customData) {
        this.UpdateSwitchPage(event, customData);
    },
    UpdateSwitchPage: function (event, customData) {
        if (!this.m_PageArray || !Array.isArray(this.m_PageArray)) return;
        for (var i = 0; i < this.m_PageArray.length; ++i) {
            if (this.m_PageArray[i]) {
                if (customData == i) {
                    this.m_PageArray[i].active = true;
                    this.ButtonCheck(event.target, true);
                    if(this.m_HOOK && this.m_HOOK.OnChangePage) this.m_HOOK.OnChangePage(i, this.m_PageArray[i]);
                } else {
                    this.m_PageArray[i].active = false;
                    this.ButtonCheck(event.target, false);
                }
            }
        }
    },

    ButtonCheck: function(target, bCheck) {
        for(var i in this.m_SwitchButtonArray) {
            if (this.m_SwitchButtonArray[i] && this.m_SwitchButtonArray[i].node == target) {
                var pCheck = this.m_SwitchButtonArray[i].node.getChildByName('check');
                if (pCheck) pCheck.active = bCheck;
            }
        }
    },
    ///////////////////////////////////////////////////
});
