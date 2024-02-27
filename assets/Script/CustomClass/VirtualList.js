cc.Class({
    extends: cc.Component,

    properties: {
        content:cc.Node,
        item:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:

    ctor:function(){
        this._disPlayItem = {};
        this._dataArr = [];
        this._cb = null;
        this._hook = null;
        this._keepCnt = 0;
    },

    onLoad () {
        this._pool = new cc.NodePool();
        this.item.active = false;
        this._view = this.node.getChildByName('view');
        this._viewWidth = this._view.getContentSize().width;
        this._viewHeight = this._view.getContentSize().height;
        this._viewTop = this._view.y + this._view.anchorY*this._viewHeight;
        this._viewBottom = this._view.y - (1-this._view.anchorY)*this._viewHeight;
        this._viewLeft = this._view.x - this._view.anchorX*this._viewWidth;
        this._viewRight = this._view.x + (1-this._view.anchorX)*this._viewWidth;

        this._scroll = this.getComponent(cc.ScrollView);
    },
    
    Init:function(keepCnt,cb,hook){
        while (this.content._children.length > keepCnt){
            let item = this.content._children[this.content._children.length-1];
            this._pool.put(item);
        }
        this._cb = cb;
        this._hook = hook;
        this._keepCnt = keepCnt;
    },

    InsertListData:function(data){
        this._dataArr.push(data);
    },
    
    ForEachCtrl:function(Call){
        for(var i in this.content._children){
            if(this._keepCnt>i) continue;
            let item = this.content._children[i];
            if(!item.active) continue;
            Call(item._children[0].getComponent(item._children[0].name));
        }
    },
    RecycleItem:function(item){
        this._pool.put(item);
    },

    GetAllItem:function(){
        return this.content._children;
    },

    update (dt) {
        if(this._dataArr.length <= 0) return;
        let data = this._dataArr.shift();
        let item = this._getItem();
        let js = item._children[0].getComponent(item._children[0].name);
        js.Init();
        js.m_Hook = this._hook;
        js.node.active = true;
        js.SetData(data);
        item.setContentSize(js.node.getContentSize());
        item.parent = this.content;
        if(this._cb) this._cb({data:data,item:item,js:js});
        this._filterDisplayItem();
    },

    onEnable:function(){
        this.node.on('scrolling',this._scrolling,this,true);
    },

    onDisable:function(){
        this.node.off('scrolling',this._scrolling,this,true);
    },

    destory:function(){
        this._pool.clear();
    },

    _scrolling:function(e){
        this._filterDisplayItem();
    },

    RefushList:function(){
        this.scheduleOnce(()=>{
            this._filterDisplayItem();
        },0.1);
    },
    
    _convertToViewPos:function(item){
        return this._view.convertToNodeSpaceAR(item.parent.convertToWorldSpaceAR(item.getPosition()));   
    },

    _filterDisplayItem:function(){
        // let cs = this.content.getContentSize();
        // if(this._scroll.vertical){
        //     if(cs.height <= this._viewHeight) return; 
        // }else{
        //     if(cs.width <= this._viewWidth) return; 
        // }
        
        this._disPlayItem = {};
        for(var i in this.content._children){
            if(!this.content._children[i].active) continue;
            let item = this.content._children[i];
            let s = item.getContentSize();
            let p = this._convertToViewPos(item);

            let top = p.y+s.height + item.anchorY * s.height;
            let bottom = p.y-s.height + (1-item.anchorY) * s.height;

            let left = p.x-s.width + item.anchorX * s.width;
            let right = p.x+s.width + (1-item.anchorX) * s.width;
            
            if(this._scroll.vertical){
                if(bottom <= this._viewTop && top>=this._viewBottom){
                    this._disPlayItem[i] = item;
                }
            }else{
                if(right >= this._viewLeft && left<=this._viewRight){
                    this._disPlayItem[i] = item;
                }
            }
        } 
        this._disPlayShow();
    },

    _disPlayShow:function(){
        for(var i in this.content._children){
            if(i == 0) continue
            this.content._children[i]._children[0].active = !!this._disPlayItem[i];
        }
    },

    _getItem:function(){
        let item = this._pool.get();
        if(item == null){
            let t = cc.instantiate(this.item);
            t.x = 0;
            t.y = 0;
            //let s = t.getContentSize();
            item = new cc.Node();
            t.parent = item;
            //item.setContentSize(s);
        }
        return item;
    },
    
});
