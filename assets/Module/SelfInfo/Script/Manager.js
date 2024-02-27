var Dir_Up = 1;
var Dir_Down = 2;
var Dir_Left = 4;
var Dir_Right = 8;

var Dir_Left_Up = 5;
var Dir_Right_Up = 9;
var Dir_Left_Down = 6;
var Dir_Right_Down = 10;
cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    ctor: function () {
        this.m_Dir = 0;         //方向
        this.m_TouchStartX = 0; //起始点
        this.m_TouchStartY = 0; //起始点
        this.m_TouchTurnX = 0;  //拐点
        this.m_TouchTurnY = 0;  //拐点
        this.m_ActMarkArr = new Array(4, 10, 5 ,6);//← ↘ ↖ ↙  , 9 ↗
        this.m_MarkIndex  = null;
        this.m_CurAct = null;
        this.m_ActTime = 0;

        this.m_ShowLogArr = new Array();
        this.m_ShowLogArr[1] = '↑'
        this.m_ShowLogArr[2] = '↓'
        this.m_ShowLogArr[4] = '←'
        this.m_ShowLogArr[8] = '→'
        this.m_ShowLogArr[5] = '↖'
        this.m_ShowLogArr[9] = '↗'
        this.m_ShowLogArr[6] = '↙'
        this.m_ShowLogArr[10] = '↘'

    },
    onLoad : function() {
        this.m_BtTouch = this.$('Touch');
        this.m_NdView = this.$('View');
        this.m_spTip = this.$('Touch@Sprite');

        //按钮监听
        this.m_BtTouch.on(cc.Node.EventType.TOUCH_START,this.onTouchBegan.bind(this), this.m_BtTouch);
        this.m_BtTouch.on(cc.Node.EventType.TOUCH_MOVE,this.onTouchMoved.bind(this),this.m_BtTouch);
        this.m_BtTouch.on(cc.Node.EventType.TOUCH_END, this.onTouchOver.bind(this), this.m_BtTouch);
        this.m_BtTouch.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchOver.bind(this), this.m_BtTouch);
        this.m_spTip.enabled = false;
    },

    //触摸事件
    onTouchBegan :function(event){
        event.stopPropagation();
        //滑动起始点
        this.m_TouchStartX = event.touch.getLocation().x;
        this.m_TouchStartY = event.touch.getLocation().y;
        this.m_TouchTurnX = event.touch.getLocation().x;
        this.m_TouchTurnY = event.touch.getLocation().y;
        this.m_spTip.enabled = true;
        this.m_MarkIndex = 0;
        this.m_ActTime = 0;
        this.m_CurAct = null;
        this.m_NdView.setPosition(-2000,0);

        return  true;
    },
    onTouchMoved :function(event){
        if(this.m_MarkIndex == null) return
        //屏幕坐标转节点坐标
        var Now = new Date().getTime();
        var MoveX = this.m_TouchTurnX - event.touch.getLocation().x;
        var MoveY = this.m_TouchTurnY - event.touch.getLocation().y;
        //轨迹判断
        if(this.m_ActTime != 0 && Now - this.m_ActTime > 100){
            this.m_TouchTurnX = event.touch.getLocation().x;
            this.m_TouchTurnY = event.touch.getLocation().y;
            var Mark = 0;
            if(Math.abs(MoveX) > 20) Mark += (MoveX>0?Dir_Left:Dir_Right);
            if(Math.abs(MoveY) > 20) Mark += (MoveY>0?Dir_Down:Dir_Up);

            if(this.m_CurAct == null)  this.m_CurAct = Mark;
            //console.log('###',this.m_MarkIndex, this.m_ShowLogArr[Mark], Mark, Math.abs(MoveX),Math.abs(MoveY) )
            //拐点
            if(this.m_CurAct != Mark && this.m_ActMarkArr.length > this.m_MarkIndex) {
                if(this.m_CurAct != this.m_ActMarkArr[this.m_MarkIndex]){ //失败
                    //console.log('onTouchMoved ',this.m_CurAct, this.m_ActMarkArr[this.m_MarkIndex], this.m_MarkIndex )
                    this.m_MarkIndex = null;
                    this.m_spTip.enabled = false;
                    return
                }else{
                    this.m_MarkIndex++;
                    this.m_CurAct = Mark;
                }
            }
        }   
        this.m_ActTime = Now;
    },
    onTouchOver :function(event) {
        if(this.m_MarkIndex == null) return
        var MoveX = this.m_TouchTurnX - event.touch.getLocation().x;
        var MoveY = this.m_TouchTurnY - event.touch.getLocation().y;
        var MoveX2 = this.m_TouchStartX - event.touch.getLocation().x;
        var MoveY2 = this.m_TouchStartY - event.touch.getLocation().y;

        var Mark = 0;
        if(Math.abs(MoveX) > 20) Mark += (MoveX>0?Dir_Left:Dir_Right);
        if(Math.abs(MoveY) > 20) Mark += (MoveY>0?Dir_Down:Dir_Up);

        if(this.m_CurAct == null)  this.m_CurAct = Mark;
        //console.log('###',this.m_MarkIndex, this.m_ShowLogArr[Mark], Mark, Math.abs(MoveX),Math.abs(MoveY) )
        //console.log('###2 ',Math.abs(MoveX2) , Math.abs(MoveY2)  )
        //拐点
        if(this.m_ActMarkArr.length > this.m_MarkIndex && Math.abs(MoveX2) < 50 && Math.abs(MoveY2) < 50) {
            if(this.m_CurAct == this.m_ActMarkArr[this.m_MarkIndex]) this.m_MarkIndex++;
        }
        
        if(this.m_ActMarkArr.length <= this.m_MarkIndex) this.m_NdView.setPosition(0,0);
        this.m_MarkIndex = null;
        this.m_spTip.enabled = false;
    },

    OnClick_BtWaring:function(Data, bWaring) {
        var QueryW = new CMD_GP_C_Warning();
        QueryW.bWarning = parseInt(bWaring);
        var LoginMission = new CGPLoginMission(this, MDM_GP_MANAGER, SUB_GP_WARNING, QueryW);
    },
    OnClick_BtDestroy:function() {
        this.ShowAlert('确认？', Alert_All, function(Res){
            if(Res){
                var LoginMission = new CGPLoginMission(this, MDM_GP_MANAGER, SUB_GP_DESTROY, {}, 0);
            }
        }.bind(this));
    },
    OnMsgRes:function(Msg){
        this.ShowAlert(Msg);
    },
    // update (dt) {},
});
