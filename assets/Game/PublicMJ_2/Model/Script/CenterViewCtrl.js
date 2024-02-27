cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_NodeArray: {
            default: [],
            type: cc.Node
        },
        m_Clock: {
            default : [],
            type : cc.Label,
        },
        m_Rotation:[cc.Node],
        m_Back:cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        if(this.node.getChildren().length <= 0) return;
        if(this.m_Clock.length <= 0)return;

        this.OnLoad = true;
        this.m_Clock[0].string = '0';
        this.m_Clock[1].string = '0';

        this.setCurrectUser(this.wCurrectUser);
        
        for (var i = 0; i < 4 ; i++) {
            this.m_Rotation[i].angle = i * 90;
        }

    },
    ctor: function (){
        this.wBankerUser =  INVALID_CHAIR;
        this.wCurrectUser = INVALID_CHAIR;
        this.cbNum = 0;
    },

    updateNorth:function(){
        var UserCount = GameDef.GetPlayerCount();
        if( UserCount == 4 || UserCount == 2){
            var rot = GameDef.g_GameEngine.SwitchViewChairID(0);
            this.m_Back.angle = rot * 90;
            if( UserCount == 2 ){
                this.m_Rotation[1].active =false;
                this.m_Rotation[3].active =false;
            }
        }else if( UserCount == 3 ){
            this.m_Rotation[3].active = false;
                
            for (var i = 0; i < UserCount ; i++) {
                var rot = GameDef.g_GameEngine.SwitchViewChairID(i);
                this.m_Rotation[i].angle = rot * 90;
            }
        }
        

    },
    setCurrectUser:function(wChairID){
        this.wCurrectUser = wChairID;
        if( GameDef.GetPlayerCount() == 2 && wChairID == 1){
            wChairID = 2;
        }else{

        }
        for(var i in this.m_NodeArray){
            this.m_NodeArray[i].active=(i==wChairID);
        }
    },

    setTimerNum:function(bShow,cbNum){
        var cbTmp = (cbNum>0)?1:0;
        //cbNum = parseInt(cbNum/20);
        if(this.cbNum==cbNum)return;
        this.cbNum = cbNum+cbTmp;

        this.m_Clock[0].string = parseInt(cbNum / 10);
        this.m_Clock[1].string = cbNum % 10;
        this.m_Clock[0].node.active = bShow;
        this.m_Clock[1].node.active = bShow;

        return this.cbNum; 
    },


    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
