cc.Class({
    extends: cc.Component,

    properties: {
        m_Card:[cc.Sprite],
        m_Atlas:cc.SpriteAtlas,
        m_HandShow:[cc.Node],
        m_HandState:cc.Integer,
        m_labNumber:cc.Label,
        m_HunPaiTip:[cc.Node],
        m_ProvideUser:cc.Node,
        m_CardItemBack:[cc.Sprite],
        m_TingTip:cc.Node,
        m_JiPaiTip:[cc.Node],
        m_Mash:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor:function(){
        this.bShoot = false;
        this.m_LastClickTime = 0;
        this.m_Click = false;
        this.m_MoveIng = false;
        this.m_Provide = 0;
        this.m_bCanOut = true;
        this.m_State = 0;

        this.m_colorArr = new Array(new cc.color(255,255,255),new cc.color(226,255,200));
    },
    onLoad () {
        this.SetState(GameDef.HAND_STATE_STAND);
        this.SetHunPai(false);
        this.SetJiPai(false);
        this.m_BasePos = this.node.getPosition();
        if( this.m_ProvideUser != null )
            this.m_ProvideUser.active = false;

        GameDef.m_AllCardItem.push( this );
    },

    start:function () {
    },
    SetProvideType(type){
        this.m_Provide = type;
    },
    SetState:function(state){
        this.m_State = state;
        if( this.m_HandShow == null )return;
        for (var i = 0; i < this.m_HandShow.length; i++) {
            this.m_HandShow[i].active = false;
        }
        if( this.m_HandShow[state] != null ){
            this.m_HandShow[state].active = true;
        }

    },


    ChangeColor:function(bChange){
        if(this.m_State == GameDef.HAND_STATE_STAND && this.m_HandState != GameDef.HAND_BOTTOM || this.m_State == GameDef.HAND_STATE_SHOW_BACK) return;
        if( bChange ){
            this.SetColor(cc.color(220,255,175));
        }
        else{
            this.SetColor(cc.color(255,255,255));
        }
    },
    //投影显示不显示
    SetShadowShow:function(bShow){
        if( this.m_HandShow == null) return;

        for (var i = 0; i < this.m_HandShow.length; i++) {
            if( bShow ){
                this.m_HandShow[i].getComponent(cc.Sprite).spriteFrame = this.m_Atlas.getSpriteFrame('Shadow');
            }
            else{
                this.m_HandShow[i].getComponent(cc.Sprite).spriteFrame = null;
            }
        }
    },
    SetColor:function(color){
        if( this.m_CardItemBack == null ) return;

        for (var i = 0; i < this.m_CardItemBack.length; i++) {
            if( this.m_CardItemBack[i] == null ){
                continue;
            }
            if( this.m_CardItemBack[i].node != null )
                this.m_CardItemBack[i].node.color = color;
        }

    },
    SetCardData:function(cbCardData, bLookOnMode){
        this.SetColor(this.m_colorArr[0]);
        if( cbCardData == 0 ){
            for (var i = 0; i < this.m_Card.length; i++) {
                this.m_Card[i].spriteFrame = null;
            }
            this.SetState(GameDef.HAND_STATE_STAND);
            this.SetHunPai(false);
            this.SetJiPai(false);
            return;
        }

        if(bLookOnMode){
            this.SetState(GameDef.HAND_STATE_SHOW_BACK);
        }
        for (var i = 0; i < this.m_Card.length; i++) {
            this.m_Card[i].spriteFrame = this.m_Atlas.getSpriteFrame(''+cbCardData);
        }
        this.cbCardData = cbCardData;
        this.SetShoot(false);
        this.SetNumber(0);

        var bShowHun = false;
        bShowHun = GameDef.m_cbMagicData != 0 && GameDef.m_cbMagicData == cbCardData;
        this.SetHunPai(bShowHun);

        var bJiPai = GameDef.IsJiPai(cbCardData);
        this.SetJiPai(bJiPai);

        //手里有定缺的花色
        if(GameDef.m_bHasQue == true && this.m_HandState == GameDef.HAND_BOTTOM && this.m_State == GameDef.HAND_STATE_STAND)
        {
            var cbColor = cbCardData & GameDef.MASK_COLOR;
            if(cbColor == GameDef.g_GameEngine.m_cbQueColor[0] || cbColor == GameDef.g_GameEngine.m_cbQueColor[1])
            {
                this.SetMash(false);
            }
            else
            {
                this.SetMash(true);
            }
        }
        else
    {
            this.SetMash(false);
        }
        
        this.node.setPosition(this.m_BasePos);
        if( this.m_ProvideUser )  this.m_ProvideUser.active = false;
    },
    SetLiangCardData:function(cbCardData){
        this.SetColor(this.m_colorArr[0]);
        if( cbCardData == 0 ){
            for (var i = 0; i < this.m_Card.length; i++) {
                this.m_Card[i].spriteFrame = null;
            }
            this.SetState(GameDef.HAND_STATE_STAND);
            this.SetHunPai(false);
            return;
        }

        for (var i = 0; i < this.m_Card.length; i++) {
            this.m_Card[i].spriteFrame = this.m_Atlas.getSpriteFrame(''+cbCardData);
        }
        this.cbCardData = cbCardData;
        this.SetState(GameDef.HAND_STATE_SHOW);
        this.SetShoot(false);
        this.SetNumber(0);
        
        var bShowHun = false;
        bShowHun = GameDef.m_cbMagicData != 0 && GameDef.m_cbMagicData == cbCardData;
        this.SetHunPai(bShowHun);
        this.node.setPosition(this.m_BasePos);
        if( this.m_ProvideUser )  this.m_ProvideUser.active = false;
    },
    SetBasePos:function(){
        this.node.stopAllActions();
        this.node.setPosition(this.m_BasePos);
        var sql =cc.moveTo(0.1,cc.v2(this.node.x,this.m_BasePos.y));
        this.node.runAction(sql);
        this.bShoot = false;
    },
    SetProvide:function(provide){
        if( this.m_ProvideUser == null ) return;

        if( this.m_Provide == GameDef.ITEM_PROVIDE_DIR){
            this.m_ProvideUser.active = true;
            this.m_ProvideUser.angle = 270 - provide*90;
        }else{
            this.SetColor(this.m_colorArr[1]);
        }
    },
    SetShow:function(show){
        this.node.active = show;
    },
    GetCardData:function(){
        return this.cbCardData;
    },
    SetShoot:function(bShoot,anim){
        this.bShoot = bShoot;
        if( anim != null && anim ){
            var sql;
            this.node.stopAllActions();
            if(this.bShoot){
                sql = cc.moveTo(0.1,cc.v2(this.node.x,this.m_BasePos.y+24));
            }else{
                sql =cc.moveTo(0.1,cc.v2(this.node.x,this.m_BasePos.y));
            }
            this.node.runAction(sql);
        }else{

            if(this.bShoot){
                this.node.y = 24;
            } else {
                this.node.y = 0;
            }
        }
    },
    GetShoot:function(){
        return this.bShoot;
    },
    SetCardID:function(CardID){
        this.m_CardID = CardID;
    },
    // 注册触摸
    RegisterTouchOn: function(ResponseObj, cbCardID)
    {
    },
    // 开始
    OnTouch: function(event)
    {
    },
    SetNumber:function(count){
        if( this.m_labNumber == null ) return;

        this.m_labNumber.string = '';
        if( count > 0 ){
            this.m_labNumber.node.active = true;
            this.m_labNumber.string = 'x'+count;
        }
    },
    update:function(dt){
    },
    SetHunPai:function(bShow){
        if( this.m_HunPaiTip == null )return;
        for (var i = 0; i < this.m_HunPaiTip.length; i++) {
            this.m_HunPaiTip[i].active = bShow;
        }
    } ,
    SetJiPai:function(bShow)
    {
        if(this.m_JiPaiTip == null) return;
        for (var i = 0; i < this.m_JiPaiTip.length; i++) {
            this.m_JiPaiTip[i].active = bShow;
        }
    },
    SetTingTip:function(bShow){
        if(GameDef.g_GameEngine && GameDef.g_GameEngine.m_ReplayMode) return;
        if (this.m_TingTip!= null ) {
            this.m_TingTip.active = bShow;
        }
    },
    SetLockTips:function(bShow)
    {
        if(this.m_LockTips != null)
        {
            this.m_LockTips.active = bShow;
            this.SetCanOut(!bShow);
        }
    },
    SetCanOut:function(bCanOut)
    {
        this.m_bCanOut = bCanOut;
    },
    GetCanOut:function()
    {
        if(this.m_Mash != null)
        {
            return this.m_bCanOut && this.m_Mash.active == false;
        }
        else
        {
            return this.m_bCanOut;
        }
    },
    
    SetMash:function(bShow)
    {
        if(this.m_Mash != null) this.m_Mash.active = bShow;
    },
    SetTingMask:function(Active){
        if(this.m_TingMask)this.m_TingMask.active = Active;
    },
});
