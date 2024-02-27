
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
   
    OnShowView:function () {
        if(this.m_ListCtrl == null) this.m_ListCtrl = this.$('@CustomListCtrl');
        this.m_ListCtrl.InitList(0, 'UserCtrl');
        var kernel = gClientKernel.get();
        if(kernel){
            var IDArr = kernel.GetTableLookOnUserArr();
            for(var i in IDArr){
                if(IDArr[i] == 0) continue
                this.m_ListCtrl.InsertListInfo(0, IDArr[i]);
            }
        } 
    },
    
});
