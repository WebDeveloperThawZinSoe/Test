cc.Class({
    extends: cc.BaseClass,

    properties: {
        m_aniGun: cc.Animation,
        m_aniSpine: [sp.Skeleton],
        m_spType: cc.Sprite,
        m_Atlas: cc.SpriteAtlas,
    },

    // LIFE-CYCLE CALLBACKS:

    ctor() {

        this.m_GunScaleX = [
            [1, 1, 1, 1],
            [-1, 1, 1, 1],
            [-1, -1, 1, -1],
            [-1, -1, 1, 1]];
        this.m_GunRotation = [
            [0, -45, 0, 45],
            [45, 0, 45, 90],
            [0, -45, 0, 45],
            [-45, -90, -45, 0]];
        this.m_GunPosition = [
            cc.v2(-400, -9), cc.v2(-44, 224),
            cc.v2(400, -9), cc.v2(-44, -224)];

        this.m_AniName = [
            'quanleida',        //0
            'liuduiban',        //1
            'qinglong',         //2
            'sanfentianxia',    //3
            'sanshunzi',        //4
            'santonghuashun',   //5
            'sitaosantiao',     //6
            'teshupai',         //7
            'yitiaolong'        //8
        ];
        this.m_TypeIdx = {
            20: '7',
            21: "7",
            22: "7",
            23: "4",
            24: "1",
            25: '7',
            26: "7",
            27: "7",
            28: '3',
            29: '7',
            30: '7',
            31: '7',
            32: '7',
            33: '7',
            34: '7',
            35: '7',
            36: '7',
            37: '7',
            38: '7',
            39: '3',
            40: '5',
            41: '7',
            42: '8',
            43: '8',
            44: '2',
        }

    },

    onLoad() {
        this.m_aniGun.node.active = false;
        for (var i in this.m_aniSpine) {
            this.m_aniSpine[i].node.active = false;
            this.m_aniSpine[i].setCompleteListener(function () {
                let name = arguments[1].animation ? arguments[1].animation.name : '';
                if (name === this.m_AniName[arguments[0]])
                    this.m_aniSpine[arguments[0]].node.active = false;
            }.bind(this, i));
        }
    },

    start() {},

    playGun: function (wViewI, wViewJ) {
        this.m_aniGun.node.setPosition(this.m_GunPosition[wViewI]);
        this.m_aniGun.node.scaleX = this.m_GunScaleX[wViewI][wViewJ];
        this.m_aniGun.node.rotation = this.m_GunRotation[wViewI][wViewJ];
        this.m_aniGun.node.active = true;
        this.m_aniGun.play();
        // this.m_aniGun.playAnimation("newAnimation", 1);
        this.schedule(function () {
            cc.gSoundRes.PlayGameSound('Qiang1');
        }, 0.2, 3);
    },

    playQuanleDa: function () {
        this.m_aniSpine[0].setAnimation(0, 'quanleida', false);
        this.m_aniSpine[0].node.active = true;
    },

    playCardType: function (type) {
        cc.gSoundRes.PlayGameSound('type' + type);
        var index = this.m_TypeIdx[type];
        if (index == '7') {
            this.m_spType.spriteFrame = this.m_Atlas.getSpriteFrame('type' + type);
            this.m_spType.node.parent.active = true;
            this.scheduleOnce(function () {
                this.m_spType.node.parent.active = false;
            }.bind(this), 1.2);
        } else {
            this.m_aniSpine[index].setAnimation(0, this.m_AniName[index], false);
            this.m_aniSpine[index].node.active = true;
        }
    },

    // update (dt) {},
});