
cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Layout:cc.Layout,
        m_TingItemPrefab:cc.Prefab,
        m_ScrollView:cc.Node,
    },
    ctor:function(){
        this.m_TingTipData = new Array();
    },
    
    GetTingTipItem:function(index){
        if (this.m_TingTipData[index] == null ) {
            //创建新节点
            var OptPrefab = cc.instantiate(this.m_TingItemPrefab);
            OptPrefab.active = true;
            this.m_TingTipData[this.m_TingTipData.length] = OptPrefab.getComponent('TingItem');
            this.m_Layout.node.addChild(OptPrefab);
            return this.GetTingTipItem(index);
        }
        return this.m_TingTipData[index];
    },
    SetTingTip:function(cbOutData, pData){
        for (var i = 0; i < this.m_TingTipData.length; i++) {
            this.m_TingTipData[i].node.active = false;
        }
        if (pData == null) {
            this.HideView();
        }
        var bShowLayout = pData != null && pData.length > 0 && cbOutData != 0;

        if( !bShowLayout ){
            this.HideView();
            return;
        }
        this.ShowView();
        var index = 0;
        for (var i = 0; i < pData.length; i++) {
            if( pData[i].cbOutCardData == cbOutData ){
                var item = this.GetTingTipItem(index);
                item.node.active = true;
                item.SetData(pData[i]);
                index++;
            }
        }
        if(index == 0)
        {
            this.HideView();
            return;
        }
        if(this.m_TingTipData[0].node.width*index>1280){
            this.m_Layout.parent = this.m_ScrollView;
            this.m_ScrollView.parent.active = true;
        } 
        else{
            this.m_ScrollView.parent.active = false;
            this.m_Layout.parent = this.node;
        }
    },
    
    ShowTingTip:function(pData)
    {
        for (var i = 0; i < this.m_TingTipData.length; i++) {
            this.m_TingTipData[i].node.active = false;
        }
        if (pData == null) 
        {
            this.HideView();
            return;
        }
        
        var bShowLayout = pData != null && pData.length > 0;

        if( !bShowLayout ){
            this.HideView();
            return;
        }
        this.ShowView();
        var index = 0;
        for (var i = 0; i < pData.length; i++) 
        {
            var item = this.GetTingTipItem(index);
            item.node.active = true;
            item.SetData(pData[i]);
            index++;
        }
        if(index > 0 )
        {
            this.node.active = true;
            if(this.m_TingTipData[0].node.width*index>window.SCENE_WIGHT){
                this.m_Layout.node.parent = this.m_ScrollView;
                this.m_ScrollView.parent.active = true;
                this.m_Layout.node.x = 0;
            } 
            else{
                this.m_ScrollView.parent.active = false;
                this.m_Layout.node.parent = this.node;
                this.m_Layout.node.x = 0;
            }
        }
        else
        {
            this.HideView();
        }
    },
    //设置可选择胡口
    SetSelectTingTip:function(cbOutData,pData){
        for (var i = 0; i < this.m_TingTipData.length; i++) {
            this.m_TingTipData[i].node.active = false;
        }
        if (pData == null) {
            this.HideView();
        }
        var bShowLayout = pData != null && pData.length > 0;

        if( !bShowLayout ){
            this.HideView();
            return;
        }
        this.ShowView();
        this.index = 0;
        for (var i = 0; i < pData.length; i++) {
            if( pData[i].cbOutCardData == cbOutData||cbOutData==null ){
                var item = this.GetTingTipItem(this.index);
                item.node.active = true;
                item.SetData(pData[i]);
                item.OnSetEnable(false);
                item.OnCheck(true);
                this.index++;
            }
        }
        if(this.index > 0 && this.m_TingTipData[0].node.width*this.index>1280){
            if(this.m_ScrollView){
                this.m_Layout.parent = this.m_ScrollView;
                this.m_ScrollView.parent.active = true;
            }
        } 
        else{
            if(this.m_ScrollView)this.m_ScrollView.parent.active = false;
            this.m_Layout.parent = this.node;
        }
    },
    //获取选择的胡口
    GetHuKou:function(){
        var cbCardData = new Array();
        for(var i in this.m_TingTipData){
            var Data = this.m_TingTipData[i].GetData();
            if(Data){
                cbCardData.push(Data);
            }
        }
        return cbCardData;
    }
});
