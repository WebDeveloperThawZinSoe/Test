var SelGame = window.QPName+'_C_G'
cc.Class({
    extends: cc.BaseClass,

    properties: {
       
    },
    ctor:function(){
        this.m_RoomType = 0;// 0普通  1俱乐部
    },
    onLoad:function(){
        this._Sub = []; 
        this._Sub.push(this.$('NewNode/Sub1'));
        this._Sub.push(this.$('NewNode/Sub2'));
        this._Sub.push(this.$('NewNode/Sub3'));
    },
    OnShowView:function(){
        if(this.m_FirstCtrl == null){
            this.m_FirstCtrl = this.$('NewNode/LeftBG/Layout/T0@Toggle');
            this.m_FirstCtrl.isChecked = false;
            this.m_FirstCtrl.check();
        }
        return
    },
    OnSetRoomType:function(type){
        this.m_RoomType = type;
        this.$('NewNode/Sub2/view/content/63500').active = type>0;
    },
    OnTogClick:function(tag,data){
        console.log('data:'+data);
        for(let i =0;i<3;i++){
            this._Sub[i].active = false;
        }
        this._Sub[data].active = true;
    },
    OnClickButton:function(tag,_){
        this.ShowPrefabDLG('CreateRoom2',null,(Js)=>{
            Js.OnSetGameID(tag.currentTarget.name);
            Js.OnClubAutoView(this.m_RoomType);
        });
    },
    OnCreateRoom:function(KindID, dwRules, dwServerRules, Name){
        this.m_Hook.OnCreateRoom(KindID, dwRules, dwServerRules, Name, 0, 0);
        this.HideView();
    },
});
