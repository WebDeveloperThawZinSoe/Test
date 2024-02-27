cc.Class({
    extends: cc.Component,

    properties: {
        m_lbIP:cc.Label,
        m_lbDistance:cc.Label,
        m_lbAddr:cc.Label,
        m_HeadBG:cc.Sprite,
        m_GreenFrame:cc.SpriteFrame,
        m_RedFrame:cc.SpriteFrame,
    },
    onLoad () {
        this.m_lbAddr.node.active = false;
        this.m_lbIP.node.active = false;
    },

    start () {
    },
    InitGps:function(Hook,ChairID){
        this.m_Hook = Hook;
        this.m_ChairID = ChairID;
    },
    SetUserItem:function(pUserItem, TableScore) {
        this.node.active = true;
        this.m_dwUserID = pUserItem.GetUserID();
        this.m_pUserItem = pUserItem;
        this.node.getComponent('UserCtrl').SetUserByID(this.m_dwUserID);
        
    },
    SetUserDistance:function(distance){
        if(distance){
            this.m_lbDistance.string = distance + "KM";
        }else{
            this.m_lbDistance.string = " ";
        }    },
    SetUserIP:function(ip){
        this.m_lbIP.string=ip;
    },
    ShowUserIP:function(active){
        this.m_lbIP.node.active = active;
    },
    SetUserAddr:function(Addr,active){
        this.m_lbAddr.string=Addr;
        if(active!=null) this.ShowUserAddr(active);;
    },
    ShowUserAddr:function(active){
        this.m_lbAddr.node.active = active;
    },
    SetCenter:function(state){
        this.m_Center = state;
    },
    OnClickTouch:function(){
        if(this.m_Hook.OnClick_Select){
            if(this.m_Hook.OnClick_Select(this.m_ChairID)){
                this.SetCenter(true);
            }
        } 
        return;
    },
    ShowCurrent:function(){

    },
    //设置经纬度(English太长 就用拼音了哈!)
    SetJingWeiDu:function(dlatitude,dlongitude){
        this.m_JingWei = new Array();
        this.m_JingWei.dlatitude = dlatitude;
        this.m_JingWei.dlongitude = dlongitude;
    },
    GetJingWeiDu:function(){
        if(!this.m_JingWei) {
            this.m_JingWei = new Array();
            this.m_JingWei.dlatitude = 0;
            this.m_JingWei.dlongitude = 0;
        }
        return this.m_JingWei;
    },
    OnSafeHeadBG:function(){
        this.m_HeadBG.spriteFrame = this.m_GreenFrame;
    },
    OnDangerHeadBG:function(){
        this.m_HeadBG.spriteFrame = this.m_RedFrame;
    }

    // update (dt) {},
});
