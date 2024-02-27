var RulesKey = QPName + '_Rules_'
var RulesKey2 = QPName + '_S_Rules_'
cc.Class({
    //extends: cc.BaseClass,
    extends: cc.SubRoomRules,
    properties: {
    },
    //100-131 服务器规则  150-199 对应规则
    //100 =>AA付            150 =>房主付
    //101 =>代开            151 =>房主进入
    //102 =>积分房间        103 =>金币房间       152 =>练习房间
    ctor: function () {
        this.m_bNeedUpdate = false;
        this.m_bFirstShow = true;

        //对立规则 非计算索引需 大于 32
        this.m_CheckMap = new Object();
        this.m_CheckMap[50001] = new Array(
        );
        this.m_CheckMap2 = new Array(
            [100, 150],
            [101, 151],
            [102, 152],
            [103, 152],
        );
    },
    SetClubView: function () {
        // this.node.getChildByName('ClubNode').active = true;
        this.m_bNeedUpdate = true;
    },
    update: function () {
        if (this.m_bNeedUpdate) {
            this.m_bNeedUpdate = false;
        } else {
            return;
        }

        // for (var i in this.m_togArr) {
        //     if (!this.m_togArr[i].node.active) continue;
        //     //var color = this.m_togArr[i].isChecked ? cc.color(255, 255, 255) : cc.color(187, 167, 248);
        //     //this.m_togArr[i].node.getChildByName("Label").color = color
        // }

    },  

});
