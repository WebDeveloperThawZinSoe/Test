//调整铺满屏幕
function FitSize(node) {
    // return;
    // if(cc.sys.isNative){
    //     cc.view.setDesignResolutionSize(window.SCENE_WIGHT, window.SCENE_HEIGHT, cc.ResolutionPolicy.EXACT_FIT);
    // }else{
    //     var nWp = 0, nHp = 0;
    //     nWp = document.body.clientWidth / window.SCENE_WIGHT;
    //     nHp = document.body.clientHeight / window.SCENE_HEIGHT;
    //     cc.view.setDesignResolutionSize(document.body.clientWidth, document.body.clientHeight, cc.ResolutionPolicy.EXACT_FIT);
    //     node.setScale(nWp, nHp);
    // }

    // let c = node.getComponent(cc.Canvas);
    // if(c == undefined || c == null){
    //     return;
    // }
    // c.fitHeight = true;
    // c.fitWidth = false;

    // node.setScale(cc.winSize.width / window.SCENE_WIGHT, 1);
}

//Left to Center
function ShowL2C(ActNode) {
    ActNode.active = true;
    ActNode.stopAllActions();
    ActNode.setPosition(-window.SCENE_WIGHT,0);
    ActNode.runAction( cc.moveTo(0.5,cc.v2(0,0)).easing(cc.easeBounceOut()) );
}
//Center to Left
function HideC2L(ActNode, CallBack) {
    ActNode.runAction( cc.sequence( cc.moveTo(0.1,cc.v2(-window.SCENE_WIGHT,0)), cc.callFunc(function(){
        if(CallBack){
            CallBack();
        }else{
            ActNode.active = false;
        }
    }) ) );
}
//Left to Center
function ShowR2C(ActNode, dt) {
    ActNode.active = true;
    ActNode.stopAllActions();
    ActNode.setPosition(window.SCENE_WIGHT,0);
    ActNode.runAction(cc.moveTo(dt ? dt : 0.1,cc.v2(0,0)));
}
//Center to Left
function HideC2R(ActNode, CallBack) {
    ActNode.runAction( cc.sequence( cc.moveTo(0.1,cc.v2(window.SCENE_WIGHT,0)), cc.callFunc(function(){
        if(CallBack){
            CallBack();
        }else{
            ActNode.active = false;
        }
    }) ) );
}
//Small to Normal
function ShowS2N(ActNode, dt, dt2) {
    ActNode.active = true;
    ActNode.stopAllActions();
    ActNode.setScale(0);
    ActNode.opacity = 0;
    var act = cc.scaleTo(dt ? dt : 0.5, 1, 1).easing(cc.easeBounceOut());
    ActNode.runAction( cc.spawn(act, cc.fadeIn(dt2 ? dt2 : 0.3)) );
    //ActNode.runAction( act );
}

//Small to Normal
function ShowS2N2(ActNode, bBounce, dt, dt2) {
    ActNode.active = true;
    ActNode.stopAllActions();
    ActNode.setScale(0);
    ActNode.opacity = 0;
    var act = null;
    if(bBounce) act = cc.scaleTo(dt ? dt : 0.5, 1, 1).easing(cc.easeBounceOut());
    else act = cc.scaleTo(dt ? dt : 0.5, 1, 1);
    ActNode.runAction( cc.spawn(act, cc.fadeIn(dt2 ? dt2 : 0.3)) );
    //ActNode.runAction( act );
}

//Normal to Small
function HideN2S(ActNode, CallBack) {
    //ActNode.runAction( cc.sequence( cc.scaleTo(0.1, 0, 0), cc.callFunc(CallBack) ) );
    ActNode.runAction( cc.sequence( cc.scaleTo(0.1, 0, 0), cc.callFunc(function(){
        ActNode.active = false;
    } ) ) );
}

// Show Out to In
function ShowO2I(ActNode, dt) {
    ActNode.active = true;
    ActNode.stopAllActions();
    ActNode.opacity = 0;
    ActNode.runAction(cc.fadeIn(dt? dt : 0.1));
}

// Hide In to Out
function HideI2O(ActNode, CallBack, dt, bActive) {
    ActNode.runAction( cc.sequence( cc.fadeOut(dt? dt : 0.1), cc.callFunc(function() {
        if(CallBack) CallBack();
        ActNode.active = bActive ? true : false;
    } ) ) );
}

// 上漂后销毁
function FlyDestroy(ActNode) {
    if (!ActNode) return;
    ActNode.active = true;
    ActNode.stopAllActions();
    ActNode.opacity = 255;
    ActNode.setScale(0);

    ActNode.runAction(cc.sequence(
        cc.spawn(cc.scaleTo(0.5, 1, 1).easing(cc.easeBounceOut()), cc.delayTime(1)),
        cc.spawn(cc.fadeOut(1.5), cc.moveBy(1.5, cc.v2(0, 80))),
        cc.delayTime(0.5), cc.removeSelf(true)
    ));
}


