cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_Card: [cc.Component],
        m_Atlas: cc.SpriteAtlas,
        m_spCardType: cc.Sprite,
        m_Layout: cc.Node,
    },

    start: function () {},


    ctor: function () {
        
    },

    onLoad: function() {
        this.m_TouchLock=false;

        for (var i in this.m_Card) {
            this.m_Card[i].node.active = false;
        }
        this.m_nXDistance = this.m_Card[0].GetCardWidth() + this.m_Layout.getComponent(cc.Layout).spacingX;

        this.m_Layout.on(cc.Node.EventType.TOUCH_START, this.onTouchBegan, this);
        this.m_Layout.on(cc.Node.EventType.TOUCH_MOVE, this.onTouchMoved, this);
        this.m_Layout.on(cc.Node.EventType.TOUCH_END, this.onTouchEnded, this);
        this.m_Layout.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEnded, this);
    },

     //触摸事件
     onTouchBegan: function (event) {
        if(!this.m_TouchLock) return;
        event.stopPropagation();
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        this._startIdx = this._getTouchIndex(calcX);//startidx 是点击的牌的下标
        this.m_Card[this._startIdx].SetSelect(true);//给点击的牌设置灰色
        cc.gSoundRes.PlaySound('Button');
    },

    _getTouchIndex: function (posx) {
        var index = 0;
        var x = this._getStratPosX();
        for (var i in this.m_Card) {
            if (!this.m_Card[i].node.active) continue;
            index++;
            if (posx < (index * this.m_nXDistance + x)) {
                return parseInt(i);
            }
        }
        return this._getLastOne();
    },

    _getStratPosX: function () {
        for (var i in this.m_Card) {
            if (!this.m_Card[i].node.active) continue;
            return this.m_Card[i].node.getPosition().x - this.m_Card[i].GetCardWidth() / 2;
        }
    },

    _getLastOne: function () {
        for (var i = this.m_Card.length - 1; i >= 0; i--) {
            if (!this.m_Card[i].node.active) continue;
            return parseInt(i);
        }
    },
  
    onTouchMoved: function (event) {
        if(!this.m_TouchLock) return;
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        this._endIdx = this._getTouchIndex(calcX);
        for (var i = 0; i < this.m_Card.length; i++) {
            if (this._endIdx > this._startIdx && i >= this._startIdx && i <= this._endIdx ||
                this._endIdx <= this._startIdx && i >= this._endIdx && i <= this._startIdx)
                this.m_Card[i].SetSelect(true)
            else
                this.m_Card[i].SetSelect(false);
        }
    },

    onTouchEnded: function (event) {
        if(!this.m_TouchLock) return;
        var calcX = this.node.convertToNodeSpaceAR(event.touch.getLocation()).x;
        for (var i in this.m_Card) {
            if (!this.m_Card[i].node.active) continue;
            if (this.m_Card[i].selcet) {
                this.m_Card[i].SetCardShoot(!this.m_Card[i].shoot);
                this.m_Card[i].SetSelect(false);
            }
        }
    },

    getShootCard: function () {
        var cbCardData = new Array();
        for (var i in this.m_Card) {
            if (!this.m_Card[i].node.active) continue;
            if (this.m_Card[i].shoot) {
                cbCardData.push(this.m_Card[i].GetData());
            }
        }
        return cbCardData;
    },

    setCard: function (cbCardData) {
        for (var i in this.m_Card) {
            this.m_Card[i].SetData(cbCardData[i]);
            if(this.m_Card[i])
                this.m_Card[i].node.active = true;
        }
    },

    //设置提示
    OnSetHintCard:function(carddata){
        for(var i in this.m_Card){
            this.m_Card[i].SetCardShoot(false);
        }


        for(var i =0;i <carddata.length;i++){
            if(!carddata[i]) continue;
            for(var n in this.m_Card){
                if(this.m_Card[n].GetData()==carddata[i]){
                    if(this.m_Card[n].shoot) continue;
                    this.m_Card[n].SetCardShoot(true);
                    break;
                }
            }
        }

    },

    //取消所有牌
    SetCardShootFale(){
        for(var i in this.m_Card){
            this.m_Card[i].SetCardShoot(false);
        }
    },
    
    //先清空后赋值
    ClearSetCard:function(carddata,count){
        this.ClearChildCard();
        this.m_Card[0].getComponent('CardPrefab_50000').SetData(carddata[0]);
        //this.m_Card[0].SetCardShoot(false);
        for(var index=1; index < count; index++){
            var CardPrefab = cc.instantiate( this.m_Card[0].node);
            CardPrefab.getComponent('CardPrefab_50000').SetData(carddata[index]);
            this.m_Card[0].node.parent.addChild(CardPrefab);
            this.m_Card[index]= CardPrefab.getComponent('CardPrefab_50000');
        }
        for(var i in this.m_Card){
            this.m_Card[i].SetCardShoot(false);
        }
    },

    //清空玩家出的牌
    ClearChildCard:function(){
        for (var i in this.m_Card) {
            this.m_Card[i].node.active = false;
            //this.m_Card[i].SetCardShoot(false);
        }
            
        this.m_Card[0].SetData(0);
        for(var i=this.m_Card[0].node.parent.childrenCount-1;i>0;i--){
            //this.m_Card[i].SetCardShoot(false);
            this.m_Card[0].node.parent.removeChild(this.m_Card[0].node.parent.children[i],true);
            
        }
    },

    
    //添加出的牌以及设置layout
    AddChildCard:function(cbCardData,count,view){
        this.ClearChildCard();
        this.m_Card[0].SetData(cbCardData[0]);
        for(var i=1;i<count;i++){
            var Clonecard= cc.instantiate( this.m_Card[0].node);
            if(!cbCardData[i]) cbCardData[i]=0;
            Clonecard.getComponent('CardPrefab_50000').SetData(cbCardData[i]);
            this.m_Card[0].node.parent.addChild(Clonecard);
            this.m_Card[i]= Clonecard.getComponent('CardPrefab_50000'); 
        }
        if(view>50) return;
        if(count<9){
            switch(view){
                case 0:
                    //居中:用一半的layout长度=总牌宽的一半                
                    this.m_Layout.getComponent('cc.Layout').paddingLeft= 300/2-(78*count-(51*(count-1)))/2;
                    break;
                case 1:
                    //靠右
                    this.m_Layout.getComponent('cc.Layout').paddingLeft=300- (78*count-51*(count-1))
                    break;
                case 2:
                    //靠右
                    this.m_Layout.getComponent('cc.Layout').paddingLeft=300- (78*count-51*(count-1))
                    break;
                case 3:
                    break; 
            }
        }
        else
            this.m_Layout.getComponent('cc.Layout').paddingLeft=0;
         

    },

    sendCard: function (cbCardData) {
        for (var i in this.m_Card) {
            if (!this.m_Card[i].node.active) {
                this.m_Card[i].node.active = true;
                this.m_Card[i].SetData(cbCardData);
                break;
            }
        }
    },

    setPass: function () {
        for (var i in this.m_Card) {
            this.m_Card[i].SetSelect(true);
        }
    },

    resetView: function () {
        for (var i in this.m_Card) {
            this.m_Card[i].node.active = false;
            this.m_Card[i].SetSelect(false);
        }
        this._MeCard = 255;
        //this.node.getChildByName("_labType").active = false;
    },

    setFirstCard: function (cbCard) {
        this._MeCard = cbCard;
    },

    OnClickCard: function () {
        if (this._MeCard == 255) return;
        if (this.m_Card[0].GetData() == 255) {
            this.m_Card[0].SetData(this._MeCard);
        } else {
            this.m_Card[0].SetData(255);
        }
    },

    showCard: function (cbFirst, cbType) {
        this.m_Card[0].SetData(cbFirst ? cbFirst : 255);
        this._labType.$Label.string = CARD_TYPE[cbType-1];
        this._labType.active = true;
    },



});

const CARD_TYPE =  ['乌龙', '对子', '两对', '三条', '顺子', '同花', '葫芦', '铁支', '同花顺'];