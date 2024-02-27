var actTime = 0.2;

cc.Class({
    extends: cc.BaseClass,

    properties: {

    },
    onLoad:function(){
        this.m_UserCtrl = new Array();
        this.m_WinNode = new Array();
        for(var i = 0; i < 2; i++){
            this.m_UserCtrl[i] =  this.node.getChildByName('User'+i).getComponent('UserCtrl');
            this.m_WinNode[i] = this.node.getChildByName('ComWin'+i);
        }
    },
    Init:function(Hook){
        this.m_Hook = Hook;
        this.m_AniCtrl = this.node.getChildByName('AniNode').getComponent('AniPrefab');
        this.m_AniCtrl.Init(this);
    },
    SetAct:function(UserArr, wLost){
        this.node.active = true;
        cc.gSoundRes.PlayGameSound('PKBG');
        for(var i = 0; i < 2; i++){
            this.m_WinNode[i].active = false;;
        }
        this.m_UserCtrl[0].SetUserByID(this.m_Hook.m_pIClientUserItem[UserArr[0]].GetUserID());
        this.m_UserCtrl[1].SetUserByID(this.m_Hook.m_pIClientUserItem[UserArr[1]].GetUserID());
        this.m_wLost = wLost;
        
        this.m_WinIndex = this.m_wLost == UserArr[0] ? 1:0;
        this.m_AniCtrl.PlayAni('Armature',1);
        if( this.m_Hook.m_GameClientEngine.m_ReplayMode) this.AniFinish();
         
    },
    AniFinish:function(){
        for(var i = 0; i < 2; i++){
            this.m_WinNode[i].active = this.m_WinIndex == i;;
        }
        this.m_Hook.m_UserCardControl[this.m_wLost].SetLose(); 
        this.m_Hook.HideUserLookCard(this.m_wLost);
        this.m_Hook.m_UserPlay[this.m_wLost] = false;
    },
    // update (dt) {},
});
