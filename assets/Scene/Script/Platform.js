
window.g_bInit = false;
window.APP_VERSION = `1.0.0.0`;
window.APK_NAME = 'QQJNHDD'
window.LOCAL_DEBUG = 0;
window.VCODE_GET = 1;
window.LOG_NET_DATA = 0;
window.LOG_WEB_DATA = 0;
window.LOG_DEBUG = 0;
window.POP_NOTICE = 1;
window.PHP_PORT = 8080;
window.WEB_PORT = 8081;
window.CLUB_PORT = 0;
window.LOGIN_SERVER_IP = '47.57.7.198';// 正式服
//window.LOGIN_SERVER_IP = '47.92.54.154';// 测试服

window.START_ANIMATION = false; //启动动画

window.DOMAIN_NAME = window.LOGIN_SERVER_IP;
//分页数量
window.PAGE_ITEM_CNT = 10;

if(window.LOCAL_DEBUG) { // 本地测试配置
    // if(cc.sys.isBrowser)
        window.LOGIN_SERVER_IP = '127.0.0.1';//本地
    // if(cc.sys.isNative) {
    //     window.LOGIN_SERVER_IP = "192.168.191.1";//本地
    // }
	window.LOG_NET_DATA = 10;
	window.LOG_WEB_DATA = 10;
	window.LOG_DEBUG = 10;
    window.VCODE_GET = 0;
    window.PHP_PORT = 8080;
    window.WEB_PORT = 8081;
    window.POP_NOTICE = 0;
    window.DOMAIN_NAME = window.LOGIN_SERVER_IP;
}

window.WEB_HEAD = 'http://';
window.PHP_HOME = `${window.WEB_HEAD}${window.LOGIN_SERVER_IP}:${window.PHP_PORT}`;
window.SHARE_URL = `${window.PHP_HOME}/Share.php`;
window.PHP_UPLOAD_URL = `${window.PHP_HOME}/UploadImg.php`;
window.UPDATE_URL = `${window.PHP_HOME}/hot-update/`;

window.WX_SERVICE = 'XXXXXXXX';
window.SCENE_WIGHT_BASE = 1664;
window.SCENE_HEIGHT_BASE = 750;
window.SCENE_WIGHT = window.SCENE_WIGHT_BASE;
window.SCENE_HEIGHT = window.SCENE_HEIGHT_BASE;
window.PLATFORM_RATIO = 1;

window.QPName = 'HYHYCS';
window.HUversion = true;//Hot Update
window.Key_HUVerKey = window.QPName+'_VER';
window.Key_HUKey = window.QPName+'_sub_';

window.Key_TableColor = 'TColor';//0绿   1蓝   2紫
window.Key_TableBGM   = 'TBGM00';//
window.Key_CardColor  = 'TCardC';//0:BLUE   1:Green

window.Key_ShowGPS   = `${window.QPName}_${window.LOGIN_SERVER_IP}_SGPS`;
window.Key_ShareTime = `${window.QPName}_${window.LOGIN_SERVER_IP}_Share`;
window.Key_PhoneCode = `${window.QPName}_${window.LOGIN_SERVER_IP}_PhoneCode`;
window.Key_PhoneCodeTime = `${window.QPName}_${window.LOGIN_SERVER_IP}_PhoneCodeTime`;
window.Key_AgreeMent = `${window.QPName}_${window.LOGIN_SERVER_IP}_AgreeMent`;
window.Key_GameRulesText = `${window.QPName}_${window.LOGIN_SERVER_IP}_Rules`;
window.Key_LoginPlatform = `${window.QPName}_${window.LOGIN_SERVER_IP}_LoginPlatform`;
window.Key_ABVersion = `${window.QPName}_${window.LOGIN_SERVER_IP}_ABVersion`;
window.Key_HUVersionA = `${window.QPName}_${window.LOGIN_SERVER_IP}_HUVersionA`;
window.Key_HUVersionB = `${window.QPName}_${window.LOGIN_SERVER_IP}_HUVersionB`;
window.Key_ActivityPop = `${window.QPName}_${window.LOGIN_SERVER_IP}_ActivityPop`;

window.PLATFORM_WX = 1;
window.PLATFORM_PHONE = 2;
window.PLATFORM_TEST = 3;

window.g_CntGameGPS = 0;

window.ClubPara = null;
window.ClubLvStr = new Array("路人","黑名单","申请中","会员","4","5","合伙人","超级合伙人","管理","老板","大盟主");

//场景资源预加载
window.gGameBG=null;
window.GameList = new Object();
window.GameList[62016] = '炸金花';//**-+++
window.GameList[40107] = '斗地主';//**-+++
window.GameList[21050] = '填大坑';//**-+++
window.GameList[10011] = '三公比金花';//**-+++
window.GameList[10012] = '牛牛';//**-+++
window.GameList[10013] = '三公';//**-+++
window.GameList[10015] = '斗红牛';//**-+++
window.GameList[52081] = '牌九';//**-
window.GameList[500] = '十三水';//**-+++
// window.GameList[21060] = '贵州麻将';
// window.GameList[21061] = '贵州麻将';//闷胡血流
// window.GameList[21062] = '贵州麻将';//两丁一房 两丁两房 三丁两房
// window.GameList[21063] = '普定麻将';
// window.GameList[21070] = '扣点点麻将';
window.GameList[60001] = '跑得快';//**-+++
// window.GameList[62005] = '血战麻将';
// window.GameList[62007] = '襄阳卡五星';
// window.GameList[21201] = '红中麻将';
// window.GameList[21202] = '长沙麻将';
window.GameList[50000] = '510K';//**+++
window.GameList[50001] = '二八杠';//**-+++
window.GameList[60014] = '跑胡子';//**-++
// window.GameList[52160] = '划水麻将';
window.GameList[33301] = '捉麻子';//**-+++
// window.GameList[22201] = '十点半';
window.GameList[501] = '比鸡';//**-+++
// window.GameList[63000] = '福建十三水';
// window.GameList[64000] = '浙江十三水';
window.GameList[63504] = '麻将牛牛';//**-+++
window.GameList[63500] = '德州扑克';//**-++
window.GameList[10020] = '翻三皮';//**-+++

window.GameList_PHZ = [60014];
window.GameList_MJ = [21060, 21061, 21062, 21063, 21070, 21201,52160,62007,21202,50001];
window.GameList_MJ_New = [62005];
// 默认负分游戏
window.GameMinusMarkList = [62005, 21060, 21061, 21062, 21063, 21070,21201,21202,62007,52160,60014];

////////////////////////////////////////////////////////////////////////////

window.Key_Setting_Head = `${window.QPName}_${window.LOGIN_SERVER_IP}_Setting`;
window.SetKey_Music = 'Music';
window.SetKey_Sound = 'Sound';
window.SetKey_Lobby_Music = 'LobbyMusic';
window.SetKey_Lobby_BG = 'LobbyBG';
window.SetKey_Table_BG = 'TableBG';
window.SetKey_Table_BGM = 'TableBGM';
window.SetKey_Card_Color = 'CardColor';
window.SetKey_Card_Back = 'CardBack';
window.SetKey_Card_Typeface = 'CardTypeface';
window.SetKey_Card_Shape = 'CardShape';
window.SetKey_Card_Scale = 'CardScale';
window.SetKey_Card_Speed = 'CardSpeed';
window.SetKey_Ting_Tip = 'TingTip';
window.SetKey_Faces = 'Faces';
window.SetKey_Chat = 'Chat';
window.SetKey_VIEW_3D = 'View3D';
window.SetKey_CLUB_BG = 'ClubBG';
window.SetKey_CLUB_DEF1 = 'ClubDef1';
window.SetKey_CLUB_DEF2 = 'ClubDef2';
window.SetKey_CLUB_TABLE_COLOR = 'ClubTableColor';

window.g_DefValue = new Object();
window.g_DefValue[window.SetKey_Music] = 1;
window.g_DefValue[window.SetKey_Sound] = 1;
window.g_DefValue[window.SetKey_Lobby_Music] = 0;
window.g_DefValue[window.SetKey_Lobby_BG] = 0;
window.g_DefValue[window.SetKey_Table_BG] = 0;
window.g_DefValue[window.SetKey_Table_BGM] = 0;
window.g_DefValue[window.SetKey_Card_Color] = 0;
window.g_DefValue[window.SetKey_Card_Back] = 0;
window.g_DefValue[window.SetKey_Card_Typeface] = 0;
window.g_DefValue[window.SetKey_Card_Shape] = 0;
window.g_DefValue[window.SetKey_Card_Scale] = 0;
window.g_DefValue[window.SetKey_Card_Speed] = 1;
window.g_DefValue[window.SetKey_Ting_Tip] = 1;
window.g_DefValue[window.SetKey_Faces] = 1;
window.g_DefValue[window.SetKey_Chat] = 1;
window.g_DefValue[window.SetKey_VIEW_3D] = 0;
window.g_DefValue[window.SetKey_CLUB_BG] = 0;
window.g_DefValue[window.SetKey_CLUB_DEF1] = 0;
window.g_DefValue[window.SetKey_CLUB_DEF2] = 0;
window.g_DefValue[window.SetKey_CLUB_TABLE_COLOR] = 0;

window.g_Setting = new Object();
window.g_Setting[window.SetKey_Music] = window.g_DefValue[window.SetKey_Music];
window.g_Setting[window.SetKey_Sound] = window.g_DefValue[window.SetKey_Sound];
window.g_Setting[window.SetKey_Lobby_BG] = window.g_DefValue[window.SetKey_Lobby_BG];
window.g_Setting[window.SetKey_Lobby_Music] = window.g_DefValue[window.SetKey_Lobby_Music];
window.g_Setting[window.SetKey_CLUB_BG] = window.g_DefValue[window.SetKey_CLUB_BG];
window.g_Setting[window.SetKey_CLUB_DEF1] = window.g_DefValue[window.SetKey_CLUB_DEF1];
window.g_Setting[window.SetKey_CLUB_DEF2] = window.g_DefValue[window.SetKey_CLUB_DEF2];
window.g_Setting[window.SetKey_CLUB_TABLE_COLOR] = window.g_DefValue[window.SetKey_CLUB_TABLE_COLOR];

window.g_GameSetting = new Object();

window.LoadSetting = function (wKindID) {
    if(wKindID && !isNaN(Number(wKindID))) {
        wKindID = Number(wKindID);
        if(!window.g_GameSetting[wKindID]) {
            window.g_GameSetting[wKindID] = new Object();
            for(var i in window.g_DefValue) {
                window.g_GameSetting[wKindID][i] = window.g_DefValue[i];
            }
        }
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var key = `${Key_Setting_Head}_${wKindID}_[${(pGlobalUserData.dwUserID ? pGlobalUserData.dwUserID : '-')}]_`;
        for (var i in window.g_GameSetting[wKindID]) {
            var res = cc.sys.localStorage.getItem(`${key}${i}`);
            if (res && !isNaN(Number(res)) ) {
                window.g_GameSetting[wKindID][i] = Number(res);
            } else {
                if(typeof(window.g_DefValue[i]) != 'undefined') window.g_GameSetting[wKindID][i] = window.g_DefValue[i];
            }
        }
    } else {
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var key = `${Key_Setting_Head}_[${(pGlobalUserData.dwUserID ? pGlobalUserData.dwUserID : '-')}]_`;
        for (var i in window.g_Setting) {
            var res = cc.sys.localStorage.getItem(key + i);
            if (res && !isNaN(Number(res))) {
                window.g_Setting[i] = Number(res);
            } else {
                if(typeof(window.g_DefValue[i]) != 'undefined') window.g_Setting[i] = window.g_DefValue[i];
            }
        }
    }
}

window.SaveSetting = function (szKey, Value, wKindID) {
    if(wKindID) {
        if (typeof (window.g_GameSetting[wKindID][szKey]) == 'undefined') return;
        window.g_GameSetting[wKindID][szKey] = Value;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var key = `${Key_Setting_Head}_${wKindID}_[${(pGlobalUserData.dwUserID ? pGlobalUserData.dwUserID : '-')}]_${szKey}`;
        cc.sys.localStorage.setItem(key, Value);
    } else {
        if (typeof (window.g_Setting[szKey]) == 'undefined') return;
        window.g_Setting[szKey] = Value;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var key = `${Key_Setting_Head}_[${(pGlobalUserData.dwUserID ? pGlobalUserData.dwUserID : '-')}]_${szKey}`;
        cc.sys.localStorage.setItem(key, Value);
    }
}

// function IsSettingEnabled(szKey, pBaseNode, bShowTips) {
//     if (typeof (window.g_Setting[szKey]) != 'undefined' && !window.g_Setting[szKey]) {
//         if (pBaseNode && bShowTips && pBaseNode.ShowTips) {
//             var szText = '';
//             if (Key_Faces == szKey) szText = '互动表情';
//             if (Key_Ting_Tip == szKey) szText = '听牌提示';
//             if (Key_Chat == szKey) szText = '聊天';
//             pBaseNode.ShowTips(szText + '已关闭，请在设置中开启！');
//         }
//         return false;
//     }
//     return true;
// }

////////////////////////////////////////////////////////////////////////////
window.Has3DView = function(wKindID) {
    for(var i in window.GameList_MJ_New) {
        if(window.GameList_MJ_New[i] == wKindID) return true;
    }
    return false;
}
/*
    @Param wKindID 游戏种类
    @Param BGIndex 桌布索引
    @Param defBGIndex 默认桌布索引（如果目标不存在 则使用默认）
    @Param bSave 是否保存配置（如果不存在 则不保存）
*/
window.Path_GameBG = function(wKindID, BGIndex, defBGIndex, bSave) {
    if(!!!wKindID) return null;
    if(!!!window.g_GameSetting[wKindID]) {
        window.LoadSetting(wKindID);
    }
    var szPath = `Image_BG_BG${BGIndex}`;
    if(window.Has3DView(wKindID)) {
        if(window.g_GameSetting[wKindID][window.SetKey_VIEW_3D] == 1) {
            szPath = `Image_BG_3D_${BGIndex}`;
        }
    }
    var bExist = cc.gPreLoader.Exist_Res(wKindID, szPath);
    if(!bExist && defBGIndex != null) {
        return window.Path_GameBG(wKindID, defBGIndex, null, bSave);
    } else {
        if(bExist && bSave) window.SaveSetting(window.SetKey_Table_BG, BGIndex, wKindID);
        return {
            exist: bExist,
            path: szPath,
            BGIndex: BGIndex
        };
    }
};

////////////////////////////////////////////////////////////////////////////
//获取配置信息
window.GetConfig = function (StatusName, Param) {
    if(!StatusName) return false;
    var webUrl = PHP_HOME + "/UserFunc.php?&GetMark=300&Name=" + StatusName;
    WebCenter.GetData(webUrl, null, function (data) {
        if(!data) {
            if(Param.error) Param.error();
            return ;
        }
        var res = JSON.parse(data);
        if(Param.success) Param.success(res);
    }.bind(this));
    return true;
}
