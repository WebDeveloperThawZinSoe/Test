var QueueEngine = cc.Class({
    extends: cc.Component,

    ctor () {
        this.List = new Array();
        this.Action = cc.director.getActionManager(); 
    },
   
    _QueneType : function () {
        var Obj = new Object();
        Obj.func = null; 
        Obj.pra = null;
        Obj.delay = 0;
        Obj.end = null;
        return Obj;
    },

    onLoad () {
    },

    start () {
    },

    //delay 为空 && fun 返回值为空时 延迟时间为0s
    //delay 不为空, 时间以delay为准
    //delay 为空时, fun 返回值为空时, 时间以fun 返回值为准
    push : function (fun, pra, delay) {
        console.log('push start')
        var Obj = this._QueneType();
        Obj.func = fun;
        Obj.pra = deepClone(pra);
        Obj.delay = delay;
        Obj.end = null;
        
        this.List.push(Obj);
        if (this.List.length == 1) {
            console.log('push');
            this._run();
        }
        console.log('push end')
    },

    _run : function () {
        console.log('_run start');
        var Obj = this.List[0];
        if (Obj == null) return;
        var delay = Obj.func(Obj.pra);
        if (delay != null && null == Obj.delay) {
           Obj.delay = delay; 
        }
        if (null == Obj.delay) Obj.delay = 0;
        this.scheduleOnce(function () {
            this.List.shift();
            console.log('callFunc ' + this.List.length);
            if (this.List.length > 0) {
                console.log('this._run');
                this._run();
            }
        }.bind(this), Obj.delay);
        // var action = cc.sequence(cc.delayTime(Obj.delay), cc.callFunc(function(){
        //     this.List.shift();
        //     console.log('callFunc ' + this.List.length);
        //     if (this.List.length > 0) {
        //         console.log('this._run');
        //         this._run();
        //     }
        // },this));
        // this.Action.addAction(action, this, false);
        console.log('_run end');
    },

    clean : function () {
        this.List = new Array();
    },

    // update (dt) {},
});
