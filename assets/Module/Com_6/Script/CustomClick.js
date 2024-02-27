
cc.Class({
    extends: cc.BaseClass,
    properties: {
        m_ClickAni:cc.Prefab,
    },
    
    onLoad: function() {
        this.m_Pool = new cc.NodePool('ClickAni');
        var initCount = 10;
        for (var i = 0; i < initCount; ++i) {
            var ani = cc.instantiate(this.m_ClickAni); // 创建节点
            this.m_Pool.put(ani); // 通过 put 接口放入对象池
        }
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.node._touchListener.setSwallowTouches(false);
    },

    getClickAni: function (parentNode) {
        let ani = null;
        if (this.m_Pool.size() > 0) { // 通过 size 接口判断对象池中是否有空闲的对象
            ani = this.m_Pool.get(this);
        } else { // 如果没有空闲对象，也就是对象池中备用对象不够时，我们就用 cc.instantiate 重新创建
            this.m_Pool.put(cc.instantiate(this.m_ClickAni));
            ani = this.m_Pool.get(this);
        }
        ani.parent = parentNode; // 将生成的敌人加入节点树
        return ani;
    },
    onClickAniKilled: function (ani) {
        // ani 应该是一个 cc.Node
        this.m_Pool.put(ani); // 和初始化时的方法一样，将节点放进对象池，这个方法会同时调用节点的 removeFromParent
    },
    Copy: function(pos) {
        var pNode =this.getClickAni(g_CurScene.node);
        pNode.x = pos.x;
        pNode.y = pos.y;
    },
    //触摸事件
    onTouchBegan: function (event) {
        this.Copy(this.node.convertToNodeSpaceAR(event.getLocation()));
        return false;
    },
});
