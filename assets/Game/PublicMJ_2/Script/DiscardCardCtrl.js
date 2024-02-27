cc.Class({
    extends: cc.Component,

    properties: {
        m_NodePos:[cc.Node],
        m_CardItem:[cc.Prefab],
        m_SingleRow:cc.Integer, //单行牌数 //11
        m_Arrow:cc.Node,
    },

    // LIFE-CYCLE CALLBACKS:
    ctor:function(){
        this.m_CardData = new Array();
        for (var i = 0; i < 4; i++) {
            this.m_CardData[i] = new Array();

        }
        this.m_DiscardCount = new Array(0,0,0,0);
        this.m_cbViewType = false;//false横向，true纵向
        this.m_SingleRow = parseInt(this.m_SingleRow);
    },
    onLoad:function () {
        for(var j = 0 ;j<4;j++){
            var posX = 0 ,posY = 0;
            for (var i = 0; i < 2*this.m_SingleRow; i++) {
                var card = cc.instantiate(this.m_CardItem[j]);
                if(GameDef.HAND_BOTTOM == j){ //0
                    posX = i%this.m_SingleRow*card.width;
                    if(parseInt( i/this.m_SingleRow) >=1 ){
                        posY = -97;
                    }
                }
                else if(GameDef.HAND_TOP == j)
                {
                    posX = ((this.m_SingleRow - 1) - i%this.m_SingleRow)*card.width;
                    if(parseInt( i/this.m_SingleRow) >=1 ){
                        posY = -97;
                    }
                }
                else if(GameDef.HAND_LEFT == j){ //1
                    posY = i%this.m_SingleRow*card.height*-1;
                    if(parseInt( i/this.m_SingleRow) >=1 ){
                        posX = 56
                    }
                }
                else if(GameDef.HAND_RIGHT == j)
                {
                    posY = ((this.m_SingleRow - 1) - i%this.m_SingleRow)*card.height*-1;
                    if(parseInt( i/this.m_SingleRow) >=1 ){
                        posX = 56
                    }
                    card.zIndex = this.m_SingleRow-i;
                }
                var ShowShoadow = false;
                if(GameDef.HAND_TOP == j|| GameDef.HAND_BOTTOM == j){
                    ShowShoadow = (i == 0 || i == 11);
                }
                else if(GameDef.HAND_LEFT == j){
                    ShowShoadow = (i <11);
                }
                else if(GameDef.HAND_RIGHT == j){
                    ShowShoadow = (i >= this.m_SingleRow);
                }
                card.setPosition(posX,posY);
                this.m_NodePos[j].addChild(card);
                card = card.getComponent('CardItem');
                card.SetShadowShow(ShowShoadow);
                this.m_CardData[j][i] = card;
                card.SetState(GameDef.HAND_STATE_SHOW);
                card.node.active = false;
            }
        }
        var seq1=cc.sequence(cc.moveBy(0.5,0,20),cc.moveBy(0.5,0,-20));
        var seq2=cc.sequence(cc.scaleTo(0.5,1.5),cc.scaleTo(0.5,1));
        var spawn = cc.spawn(seq1,seq2);
        this.m_Arrow.runAction(cc.repeatForever(spawn));

        this.m_Arrow.active = false;
    },

    start () {

    },

    SetCardData:function(viewID,cbCardData,cbCardCount,cbTingHouOut){
        if(cbCardData == 0||cbCardData == null)return;
        for (var i = 0; i < this.m_CardData[viewID].length; i++) {
            this.m_CardData[viewID][i].node.active = false;
        }

        var index = 0;
        if(cbCardCount > this.m_CardData[viewID].length)
        {
            index = cbCardCount - this.m_CardData[viewID].length;
        }
        for(var i= 0;i<this.m_CardData[viewID].length;i++){
            if( this.m_CardData[viewID][i] == null)
            {
                console.log('SetCardData this.m_CardData[viewID][i] 越界:',i);
                continue;
            }
            if(cbCardData[i + index] > 0)
            {
                this.m_CardData[viewID][i].node.active = true;
                this.m_CardData[viewID][i].SetCardData(cbCardData[i + index]);
                this.m_CardData[viewID][i].SetState(GameDef.HAND_STATE_SHOW);
            }
            //报听的那张扣着
            if(cbTingHouOut != null && cbTingHouOut[i+index] >0)
            {
                this.m_CardData[viewID][i].SetState(GameDef.HAND_STATE_SHOW_BACK); 
            }
        }
        if(cbCardCount > this.m_SingleRow*2 && this.m_UserCount > 2)
        {
            this.m_DiscardCount[viewID] = this.m_SingleRow*2;
        }
        else
        {
            this.m_DiscardCount[viewID] = cbCardCount;
        }
    },
    GetCardNode:function(viewID, CardID){

        return  this.m_CardData[viewID][CardID];
    },
    GetNextDiscardNode:function(viewID){
        var index = this.m_DiscardCount[viewID];
        if(index >= this.m_CardData[viewID].length)
        {
            for(var i = 0; i < this.m_CardData[viewID].length-1; i++)
            {
                this.m_CardData[viewID][i].SetCardData(this.m_CardData[viewID][i+1].GetCardData());
            }
            var nMaxIndex = this.m_CardData[viewID].length - 1;
            this.m_CardData[viewID][nMaxIndex].node.active = false;
            return this.m_CardData[viewID][nMaxIndex];
        }

        return this.m_CardData[viewID][index];
    },
    GetScale:function(viewID){
        return this.m_NodePos[viewID].scale;
    },
    AddDiscard:function(viewID,cbCardData,bShowArrow,wTingCard){
        if(cbCardData == 0||cbCardData == null)return;
        // if(this.m_DiscardCount[viewID] >= 2*this.m_SingleRow)return;

        var CardData = this.m_CardData[viewID][this.m_DiscardCount[viewID]];
        if( CardData == null ){
            //this.m_DiscardCount[viewID] =1;
            CardData = this.m_CardData[viewID][this.m_CardData[viewID].length - 1];
        }
        CardData.node.active = true;
        CardData.SetCardData(cbCardData);
        if(wTingCard != null && wTingCard != 0)
        {
            CardData.SetState(GameDef.HAND_STATE_SHOW_BACK); 
        }
        else
        {
            CardData.SetState(GameDef.HAND_STATE_SHOW); 
        }
        //CardData.SetState(GameDef.HAND_STATE_SHOW);
        if(this.m_UserCount == 2)
        {
            this.m_DiscardCount[viewID]++;
        }
        else
        {
            if(this.m_DiscardCount[viewID] < this.m_SingleRow*2)
            {
                this.m_DiscardCount[viewID]++;
            }
        }
        if( bShowArrow != null && bShowArrow )
            this.ShowArrow(viewID);
    },
    GetLastCardData:function(viewID){
        if(this.m_DiscardCount[viewID]<=0)return 0;
        var CardData = this.m_CardData[viewID][this.m_DiscardCount[viewID]];
        return CardData.GetCardData();
    },
    RemoveDiscard:function(viewID){
        if(this.m_DiscardCount[viewID]<=0)return;
        this.m_CardData[viewID][--this.m_DiscardCount[viewID]].node.active = false;
        if( this.m_Arrow.active )
        {
            this.m_Arrow.active = false;
        }
    },
    Reset:function(){
        for(var j = 0 ;j<4;j++){
            this.m_DiscardCount[j] = 0;
            for (const i in this.m_CardData[j]) {
                this.m_CardData[j][i].node.active = false;
                this.m_CardData[j][i].SetCardData(0);
            }
        }
    },
    ShowArrow:function(viewID){

        if( viewID < 0 ||  viewID > 4 || this.m_DiscardCount[viewID] == 0 ){
            this.m_Arrow.active = false;
            return;
        }

        this.m_Arrow.active = true;
        // this.m_Arrow.parent = this.m_NodePos[viewID];
        var arrowIndex = this.m_DiscardCount[viewID]-1;
        if(arrowIndex > this.m_CardData[viewID].length - 1)
        {
            arrowIndex = this.m_CardData[viewID].length - 1;
        }
        var pos = this.m_CardData[viewID][arrowIndex].node.convertToWorldSpaceAR(cc.v2(0,0));

        pos = this.node.convertToNodeSpaceAR(pos);
        if(viewID == GameDef.HAND_LEFT ||
            viewID == GameDef.HAND_RIGHT){

                pos.y += 20;
            }
        else{
            pos.y += 30;
        }
        this.m_Arrow.setPosition(pos);

    },


    setUserCount:function(wUserCount){
        this.m_UserCount = wUserCount;

        //2人
        if( wUserCount == 2 ){
            // this.m_NodePos[0].x -= 20;
            // this.m_NodePos[1].x -= 20;
            // this.m_NodePos[2].x += 20;
            // this.m_NodePos[3].x += 20;
            var posX = 0 ,posY = 0;
            for (var j = 0; j < 4; j++) {
                if( j == 1 || j == 3 ) continue;

                for (var i = 2*this.m_SingleRow,c=0; i<65; i++,c++) {
                    var index = 0;
                    if( 0 == j ){
                        index = GameDef.HAND_LEFT;
                    }
                    else if( 2 == j ){
                        index = GameDef.HAND_RIGHT;
                    }
                    if( this.m_CardData[j][i] != null ) continue;
                    var card = cc.instantiate(this.m_CardItem[index]);
                    if(0 == j){ //1
                        posX = parseInt(c/this.m_SingleRow)*card.width*-1
                        posY = parseInt( c%this.m_SingleRow)*card.height*-1;
                        posX += 40;

                    }else if(2 == j){ //3
                        posX = parseInt(c/this.m_SingleRow)*card.width;
                        posY = parseInt( c%this.m_SingleRow)*card.height*-1;
                        posX += 5;
                    }
                    // if(j == 0 || j == 1 ){
                    //     posX -= 20;
                    // }
                    // else{
                    //     posX += 20;
                    // }
                    card.setPosition(cc.v2(posX,posY));
                    // card.setPosition(posX,posY);
                    this.m_NodePos[index].addChild(card);
                    card = card.getComponent('CardItem');
                    this.m_CardData[j][i] = card;
                    card.SetState(GameDef.HAND_STATE_SHOW);
                    card.node.active = false;
                }
            }
        }
        // if( wUserCount == 3 ){
        //     // var width = this.m_CardData[0][0].node.width;
        //     // this.m_NodePos[0].x += width;
        //     // this.m_NodePos[1].x += width-20;
        //     // this.m_NodePos[2].x += width;
        //     var posX =0;
        //     var posY =0;
        //     for (var j = 0; j < 3; j++) {
        //         this.m_NodePos[j].removeAllChildren();
        //         this.m_CardData[j] = new Array();
        //         for (var i = 0; i < 3*this.m_SingleRow; i++) {
        //             if( this.m_CardData[j][i] != null ) continue;
        //             var card = cc.instantiate(this.m_CardItem[j]);

        //             if(GameDef.HAND_LEFT == j){
        //                 posX = parseInt( i/this.m_SingleRow )*card.width;
        //                 posY = parseInt( i%this.m_SingleRow )*card.height*-1;
        //             }
        //             else if(GameDef.HAND_TOP == j){ //0
        //                 var value = 15;
        //                 posX = (i%value)*card.width;
        //                 posY =  (parseInt( i/value) -1)*card.height*-1;
        //                 posY -= card.height
        //                 posX += card.width

        //             }else if( GameDef.HAND_BOTTOM == j){ //2
        //                 var value = 15;
        //                 posX = (i%value)*card.width;
        //                 posY = (parseInt( i/value) -1)*card.height*-1;

        //                 posX += card.width
        //                 posY -= card.height
        //                 if( i >= 30 ){
        //                     posY +=card.height*3;
        //                 }
        //             }

        //             var ShowShoadow = false;
        //             if(GameDef.HAND_TOP == j|| GameDef.HAND_BOTTOM == j){
        //                 ShowShoadow = (i == 0 || i == 15);
        //             }
        //             else if(GameDef.HAND_LEFT == j){
        //                 ShowShoadow = (i <11);
        //             }


        //             card.setPosition(posX,posY);
        //             this.m_NodePos[j].addChild(card);
        //             card = card.getComponent('CardItem');
        //             this.m_CardData[j][i] = card;
        //             card.SetState(GameDef.HAND_STATE_SHOW);
        //             card.SetShadowShow(ShowShoadow);
        //             card.node.active = false;

        //         }
        //     }

        // }
    },
    // update (dt) {},
});
