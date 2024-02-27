cc.Class({
    extends: cc.BaseClass,

    properties:
    {
        m_ChatEditbox: cc.EditBox,
        m_SendNode: cc.Node,
        m_ViewNode:cc.Node,
        m_PhraseNode:cc.Node,
        m_PhraseArr:[cc.Node],
        m_FacesNode:cc.Node,
        m_FacesArr:[cc.Node],
        m_UserChatNode:cc.Node,
        m_UserFacesNode:cc.Node,
        // m_atlas:cc.SpriteAtlas,
    },

    ctor :function(){
        // 默认快捷短语文字
        this.m_szDefText = new Array(
            '不好意思，来个电话',
            '出门没洗手，要啥啥没有',
            '都别走，我们决战到天亮',
            '干啥呢，别墨迹',
            '就是娱乐别那么认真',
            '快点吧，一趟北京都回来了',
            '说啥都没用，就是闯',
            '我去，这牌都没赢到你',
            '我说朋友，你是偷的网吗？',
            '我这也是真幸，要啥来啥呀',
            '要牌，要快，别墨迹',
            '这牌也真是没谁了',
        );
        this.m_szText = new Array();
        this.m_CntDownArr = new Array();
        this.m_UserChat = new Array();
        this.m_UserFaces = new Array();
        this.m_GameClientEngine = null;
    },
    onLoad:function() {
        for(var i=0;i < GameDef.GAME_PLAYER; i++){
            this.m_CntDownArr[i] = 0;
        }
        this.schedule(this.CheckShow, 1);
    },
    CheckShow:function() {
        for(var i=0;i < GameDef.GAME_PLAYER; i++){
            if(this.m_UserChat[i]==null) return
            if(this.m_CntDownArr[i] > 0){
                this.m_CntDownArr[i]--;
            }else{
                this.m_UserChat[i].active = false;
                this.m_UserFaces[i].node.active = false;
            }
        }
    },
    InitHook :function(Hook){
        if(this.m_GameClientEngine != null) return;
        this.m_Hook = Hook;
        this.m_GameClientEngine = Hook.m_GameClientEngine;

        if(this.m_GameClientEngine.m_szText) this.m_szText = this.m_GameClientEngine.m_szText;
        else this.m_szText = this.m_szDefText;

        this.InitPhraseList();
        this.m_bNeedUpdate = true;
        this.m_SendNode.active = false;
    },

    InitPhraseList:function(){
        //快捷短语
        if(this.m_PhraseArr.length == 1){
            for(var i=0; i<this.m_szText.length; i++){
                if(this.m_PhraseArr[i] == null){
                    this.m_PhraseArr[i] = cc.instantiate(this.m_PhraseArr[0]);
                    this.m_PhraseNode.addChild(this.m_PhraseArr[i]);
                }
                this.m_PhraseArr[i].getComponent(cc.Button).clickEvents[0].customEventData = i+1;
                this.m_PhraseArr[i].getChildByName('Label').getComponent(cc.Label).string = cutstr(this.m_szText[i], 13);
            }
        }
        //表情
        if(this.m_FacesArr.length == 1){
            for(var i=0; i<27; i++){
                if(this.m_FacesArr[i] == null){
                    this.m_FacesArr[i] = cc.instantiate(this.m_FacesArr[0]);
                    this.m_FacesNode.addChild(this.m_FacesArr[i]);
                }
                this.m_FacesArr[i].getComponent(cc.Button).clickEvents[0].customEventData = 1000+i;
                // this.m_FacesArr[i].getChildByName('Sprite').getComponent(cc.Sprite).spriteFrame = this.m_atlas.getSpriteFrame('faces'+i);
                cc.gPreLoader.LoadRes('Image_faces'+i, 'Chat_2', function(sf, Param){
                    var Index = Param.Index;
                    this.m_FacesArr[Index].getChildByName('Sprite').getComponent(cc.Sprite).spriteFrame = sf;
                }.bind(this), {Index: i});
            }
        }
        //聊天气泡
        if(this.m_UserChat[0] == null){
            this.m_UserChat[0] = this.m_UserChatNode.getChildByName('0');
            this.m_UserFaces[0] = this.$('0@AniPrefab', this.m_UserFacesNode);
            this.m_UserFaces[0].Init(this);
            this.m_UserFaces[0].node.active = false;

            for(var i = 1; i < GameDef.GAME_PLAYER; i++ ){
                this.m_UserChat[i] = cc.instantiate(this.m_UserChat[0]);
                this.m_UserChatNode.addChild(this.m_UserChat[i]);
                //表情动画节点
                var NdTemp = cc.instantiate(this.m_UserFaces[0].node);
                this.m_UserFacesNode.addChild(NdTemp);
                this.m_UserFaces[i] = this.$('@AniPrefab',NdTemp);
                this.m_UserFaces[i].Init(this);
            }
        }
    },
    // 关闭
    OnButtonClickedClose:function (event, szCustom){
        cc.gSoundRes.PlaySound('Button');
        this.m_SendNode.active = false;
    },

    // 快捷短语
    OnButtonClickedShortcutPhrase :function(event, szCustom){
        cc.gSoundRes.PlaySound('Button');

        if( this.m_CntDownArr[GameDef.MYSELF_VIEW_ID] > 0){
            this.ShowTips("请不要频繁说话！")
            return;
        }

        this.m_GameClientEngine.OnSendPhrase(Number(szCustom), 0);
        this.m_ChatEditbox.string = '';
        this.ShowSendChat(false);
    },

    // 发送聊天
    OnButtonClickedSendChat:function (){
        cc.gSoundRes.PlaySound('Button');

        if( this.m_CntDownArr[GameDef.MYSELF_VIEW_ID] > 0){
            this.ShowTips("请不要频繁说话！")
            return;
        }

        var szText = '';
        szText = this.m_ChatEditbox.string;

        if(szText.length <= 0)  return;

        if(this.m_GameClientEngine)
            this.m_GameClientEngine.OnSendChat(szText);
        this.m_ChatEditbox.string = '';
        this.ShowSendChat(false);
    },

    ShowSendChat:function (bShow){
        this.m_SendNode.active = bShow;
    },

    // 显示泡泡
    ShowBubblePhrase :function(wViewChairID, wItemIndex, sex){
        if(wViewChairID < 0 || wViewChairID >= GameDef.GAME_PLAYER) return false;
        this.m_CntDownArr[wViewChairID] = 3;
        // 短语声音
        if(wItemIndex < 1000){
            cc.gSoundRes.PlaySoundPhrase(wItemIndex, sex, this.m_GameClientEngine.m_szText != null);
            this.ShowBubble(wViewChairID, this.m_szText[wItemIndex-1]);
        }else if(wItemIndex < 2000){
            this.ShowFaces(wViewChairID, wItemIndex-1000);
        }

        return true;
    },

    // 显示泡泡
    ShowBubbleChat :function(wViewChairID, szText){
        if(wViewChairID < 0 || wViewChairID >= GameDef.GAME_PLAYER) return false;
        this.m_CntDownArr[wViewChairID] = 3;
        this.ShowBubble(wViewChairID, szText);
        return true;
    },
    ShowFaces :function(ViewID, index){
        //this.m_UserFaces[ViewID].getComponent(cc.Sprite).spriteFrame = this.m_atlas.getSpriteFrame('faces'+index);
        this.m_UserFaces[ViewID].node.setPosition(this.m_Hook.m_UserFaceArr[ViewID]);
        this.m_UserFaces[ViewID].node.active = true;
        var pScaleTo = cc.scaleTo(0.1, 1, 1);
        this.m_UserFaces[ViewID].node.setScale(0, 0);
        this.m_UserFaces[ViewID].node.runAction(pScaleTo);
        this.m_UserFaces[ViewID].PlayAni('bq'+(index+1),1)
        return true;
    },

    ShowBubble :function(ViewID, szText){
        this.m_UserChat[ViewID].getChildByName('Label').getComponent(cc.Label).string = szText;
        var scalex = this.m_Hook.m_UserChatArr[ViewID].x >= 200?-1:1;
        this.m_UserChat[ViewID].setPosition(this.m_Hook.m_UserChatArr[ViewID]);
        this.m_UserChat[ViewID].children[0].setScale(scalex, 1);
        this.m_UserChat[ViewID].active = true;
        var pScaleTo = cc.scaleTo(0.1, scalex, 1);
        this.m_UserChat[ViewID].setScale(0, 0);
        this.m_UserChat[ViewID].runAction(pScaleTo);
        return true;
    },
    OnToggleSelView:function(){
        this.m_bNeedUpdate = true;
    },
    update:function(){
        if( this.m_bNeedUpdate ){
            this.m_bNeedUpdate = false;
        }else{
            return;
        }

        this.m_PhraseNode.parent.active = this.m_ViewNode.getChildByName('0').getComponent(cc.Toggle).isChecked;
        this.m_FacesNode.parent.active = this.m_ViewNode.getChildByName('1').getComponent(cc.Toggle).isChecked;
    },
    AniFinish:function(){
        this.m_Hook.AniFinish(this);
    },
});
