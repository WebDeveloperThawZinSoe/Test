cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },
    ctor:function(){
       this._AndroidGroupArr = []; 
    },

    // onLoad:function(){
    // },

    OnShowView:function(){
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'AndroidGroupItem',this);
        window.gClubClientKernel.onSendGetAndroidList(this,g_ShowClubInfo.dwClubID);
        this._AndroidGroupArr = []; 
    },
    onAndroidGroupList:function(androidGroup){
        this._AndroidGroupArr.push(androidGroup);
    },
    onAndroidGroupListEnd:function(){
        this.m_ListCtrl.InsertListInfoArr(0,this._AndroidGroupArr);
        // for (const i in this._AndroidGroupArr) {
        //     this.m_ListCtrl.InsertListInfo(0,[i,this._AndroidGroupArr[i]]);
        // }
    },
    onDelAndroidGroupRes:function(code){
        if(code == 1){
            g_CurScene.ShowTips('权限不足');
        }else if(code == 2){
            g_CurScene.ShowTips('不存在此组机器人');
        }else{
            this.node.runAction(cc.sequence(cc.delayTime(0.001), cc.callFunc(function(){
                this.OnShowView();
            }.bind(this))));
            // this.m_ListCtrl.InitList(0, 'AndroidGroupItem',this);
            // window.gClubClientKernel.onSendGetAndroidList(this,g_ShowClubInfo.dwClubID);
            // this._AndroidGroupArr = []; 
        }
    },
});
