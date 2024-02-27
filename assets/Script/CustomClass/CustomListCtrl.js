cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_NdLayoutArr:[cc.Node],
    },

    ctor:function(){
        this.m_CtrlArr = new Array();
        this.m_IndexArr = new Array();
        this.m_CtrlName = new Array();
        this.m_TempAddArr = new Array();
        this.m_NdDefult = new Array();
        this.m_HookArr = new Array();
        this.m_ListInfoArr = {};
        this.m_ListInfoCnt = {};
    },
    onLoad:function(){
        for (const i in this.m_NdLayoutArr) {
            if(this.m_NdLayoutArr[i] == null) continue;
            var scrollViewEventHandler = new cc.Component.EventHandler();
            scrollViewEventHandler.target = this.node; // 这个 node 节点是你的事件处理代码组件所属的节点
            scrollViewEventHandler.component = "CustomListCtrl";// 这个是代码文件名
            scrollViewEventHandler.handler = "onScrollCallBack";
            scrollViewEventHandler.customEventData = `${i}`;

            var scrollview = this.m_NdLayoutArr[i].parent.parent.getComponent(cc.ScrollView);
            if(scrollview) scrollview.scrollEvents.push(scrollViewEventHandler);
        }
    },

    onScrollCallBack:function(scrollview, eventType, customEventData){

        if((eventType == cc.ScrollView.EventType.SCROLL_TO_BOTTOM  && scrollview.vertical )
        || (eventType == cc.ScrollView.EventType.SCROLL_TO_LEFT && scrollview.horizontal)
        ||(eventType == cc.ScrollView.EventType.BOUNCE_BOTTOM && scrollview.vertical) 
        ||(eventType == cc.ScrollView.EventType.BOUNCE_RIGHT && scrollview.horizontal)){
            var ListIndex = parseInt(customEventData);
            if(this.m_ListInfoArr[ListIndex] == null) return;
            if(this.m_ListInfoCnt[ListIndex] >= this.m_ListInfoArr[ListIndex].length) return;
            var tempArr = this.m_ListInfoArr[ListIndex].slice(this.m_ListInfoCnt[ListIndex],this.m_ListInfoCnt[ListIndex]+window.DYNAMIC_SCROLL_CNT);
            for(var i in tempArr){
                this.InsertListInfo(ListIndex,[this.m_ListInfoCnt[ListIndex]++,tempArr[i]]);
            }
        }
    },
    //初始化列表
    InitList:function(ListIndex, JsName, Hook){
        this.m_CtrlName[ListIndex] = JsName;
        this.m_HookArr[ListIndex] = Hook;
        if(this.m_CtrlArr[ListIndex] == null) this.m_CtrlArr[ListIndex] = new Array();
        if(this.m_TempAddArr[ListIndex] == null) this.m_TempAddArr[ListIndex] = new Array();
        this.RemoveListPre(ListIndex);
        //样本节点
        if( this.m_NdDefult[ListIndex] == null)  {
            this.m_NdDefult[ListIndex] = this.m_NdLayoutArr[ListIndex].children[0];
            this.m_NdDefult[ListIndex].active = false;
        }
    },
    ForEachCtrl:function(ListIndex, Call){
        for (var i = 0; this.m_CtrlArr && this.m_CtrlArr[ListIndex] && i < this.m_CtrlArr[ListIndex].length; i++) {
            if (this.m_CtrlArr[ListIndex][i].node.active) {
                Call(this.m_CtrlArr[ListIndex][i]);
            }
        }
    },
    //列表数据
    InsertListInfo:function(ListIndex, Info){
        this.m_TempAddArr[ListIndex].push(Info);
    },
    //数据数组
    InsertListInfoArr:function(ListIndex, InfoArr){
        this.m_ListInfoArr[ListIndex] = InfoArr;
        this.m_ListInfoCnt[ListIndex] = 0;
        var tempArr = this.m_ListInfoArr[ListIndex].slice(this.m_ListInfoCnt[ListIndex],window.DYNAMIC_SCROLL_CNT);
        for(var i in tempArr ){
            this.InsertListInfo(ListIndex,[this.m_ListInfoCnt[ListIndex]++,tempArr[i]]);
        }
    },
    //清理列表
    RemoveListPre:function (ListIndex) {
        this.m_ListInfoArr = {};
        this.m_ListInfoCnt = {};
        this.m_IndexArr[ListIndex] = 0;
        this.m_TempAddArr[ListIndex].splice(0, this.m_TempAddArr[ListIndex].length);
        for(var i in this.m_CtrlArr[ListIndex]) this.m_CtrlArr[ListIndex][i].node.active = false;
    },
    //列表子项
    GetListPre:function(ListIndex){
        //队列数量
        var CurIndex = this.m_IndexArr[ListIndex];
        this.m_IndexArr[ListIndex]++;
        //复制节点
        if( this.m_CtrlArr[ListIndex][CurIndex] == null){
            this.m_CtrlArr[ListIndex][CurIndex] = cc.instantiate(this.m_NdDefult[ListIndex]).getComponent(this.m_CtrlName[ListIndex]);
            if(this.m_CtrlArr[ListIndex][CurIndex] == null) console.log(this.m_CtrlName[ListIndex]+' is not find!!!')
            this.m_NdLayoutArr[ListIndex].addChild(this.m_CtrlArr[ListIndex][CurIndex].node);
        }
        //返回挂载脚本
        this.m_CtrlArr[ListIndex][CurIndex].node.active = true;
        return this.m_CtrlArr[ListIndex][CurIndex];
    },

    update :function(dt) {
        //已有项设置
        for(var i in this.m_TempAddArr){
            while(this.m_TempAddArr[i].length > 0 && this.m_IndexArr[i] < this.m_CtrlArr[i].length){
                var Info = this.m_TempAddArr[i].shift();
                var Js = this.GetListPre(i);
                Js.InitPre();
                if(Js.SetHook && this.m_HookArr[i])Js.SetHook(this.m_HookArr[i]);
                Js.SetPreInfo(Info);
            }
        }
        //新创建项处理
        for(var i in this.m_TempAddArr){
            if(this.m_TempAddArr[i].length){
                var Info = this.m_TempAddArr[i].shift();
                var Js = this.GetListPre(i);
                Js.InitPre();
                if(Js.SetHook && this.m_HookArr[i]) Js.SetHook(this.m_HookArr[i]);
                Js.SetPreInfo(Info);
            }
        }
    },
});
