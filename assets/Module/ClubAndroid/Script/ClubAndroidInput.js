
cc.Class({
    extends: cc.BaseClass,

    properties: {
        
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    // start () {

    // },

    // update (dt) {},
    OnShowView:function(){
        this.$('num@Label').string = '';
    },
    onSetType:function(type,hook){
        this._type = type;
        this.m_Hook = hook;
        this.$('btNode/-').active = type == 1;
        this.$('btNode/reset').active = type == 0;

        cc.gPreLoader.LoadRes('Image_AndroidInput_t'+type,'ClubAndroid',function(sprFrame){
            this.$('Title@Sprite').spriteFrame = sprFrame;
        }.bind(this));

    },
    OnBtInput:function(_,data){
        var strNum = this.$('num@Label').string;
        strNum+=data;
        this.$('num@Label').string = strNum;
    },

    OnBtDel:function(){
        var strNum = this.$('num@Label').string;
        strNum = strNum.substr(0,strNum.length-1);
        this.$('num@Label').string = strNum;
    },
    OnBtReset:function(){
        this.$('num@Label').string = '';
    },
    OnBtSure:function(){
        if(this._type == 0)this.m_Hook.onCreatAndroid(parseInt(this.$('num@Label').string));
        if(this._type == 1)this.m_Hook.onSetAndroidScore(parseInt(this.$('num@Label').string));
    },
});
