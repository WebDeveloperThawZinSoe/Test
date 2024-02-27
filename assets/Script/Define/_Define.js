window.LEN_NICKNAME //Define.js
cc.VERSION_PLAZA     =   0x6070001;

LOGIN_SERVER_PORT = 8600;
AndroidBUG = 'NoHttps';
ShowLobbyClub = 0;
g_ShowClubInfo = null;

Alert_Yes = 1;
Alert_YesNo = 3;
Alert_All = 7;

//动态滚动数量
window.DYNAMIC_SCROLL_CNT = 20

//场景资源预加载
window.gGameBG=null;

//重新登录
gReLogin = false;

g_Login = null;
g_Launch = null;
g_Lobby = null;
g_Table = null;
g_CurScene = null;
g_UpdateManager = null;
cc.game.on(cc.game.EVENT_HIDE, function(event){
    if(window.LOG_NET_DATA)console.log("切换后台");
    if(!cc.share.IsH5_WX()) {
        if (g_Table && g_Table.m_ServerItem &&　g_Table.m_ServerItem.mInterval == null) {
            g_Table.m_ServerItem.CloseSocket();
        }
        window.gClubClientKernel.shutdown();
    }
});
cc.game.on(cc.game.EVENT_SHOW, function(event){
    if(window.LOG_NET_DATA)console.log("切换前台");
    if(!cc.share.IsH5_WX()) {
        try {
            //重连
            if (g_Table && g_Table.m_ServerItem && g_Table.m_ServerItem.mInterval == null){
                g_Table.OnGFServerReLink();
            }
            //刷新用户信息
            if(g_Lobby && g_Lobby.OnBtRefeshRoomCard) {
                g_Lobby.OnBtRefeshRoomCard();
            }
            // setTimeout(()=>{
               if(window.gClubClientKernel._InitiateClose) window.gClubClientKernel.connect();
            // },1.0);
        } catch (error) {
            if(window.LOG_DEBUG) console.log(error)
        }
    }
});
//////////////////////////////////////////////////////////////////////////////////

enXLeft                      =       1;						//左对齐
enXCenter				     =       2;		                //中对齐
enXRight				     =		 3;                       //右对齐

//////////////////////////////////////////////////////////////////////////////////
FILTER_MENU_PAGE             =       0x01
FILTER_MENU_DAY             =       0x02
FILTER_MENU_TYPE             =       0x04
FILTER_MENU_KIND             =       0x08
FILTER_MENU_LEVEL             =       0x10

//数值定义
MAX_PATH = 260;  //最大路径
MAX_CLUB_ROOM = 50;//俱乐部最大房间
MAX_DK_ROOM = 20;
INVALD_CHAIR = 0xFFFF;

CARD_WIGTH             =               177;
CARD_HEIGHT            =               241;

//头像大小
FACE_CX = 48; //头像宽度
FACE_CY = 48; //头像高度

//长度定义
LEN_LESS_ACCOUNTS=			6;									//最短帐号
LEN_LESS_NICKNAME=			6;									//最短昵称
LEN_LESS_PASSWORD=			6;									//最短密码

//人数定义
MAX_CHAIR	=				100;									//最大椅子
MAX_TABLE	=				512;									//最大桌子
MAX_COLUMN	=				32;									//最大列表
MAX_ANDROID	=				256;									//最大机器
MAX_PROPERTY	=			128;									//最大道具
MAX_WHISPER_USER		=	16;									//最大私聊

//列表定义
MAX_KIND			=		128;									//最大类型
MAX_SERVER			=		1024;								//最大房间

//参数定义
INVALID_CHAIR		=		0xFFFF;								//无效椅子
INVALID_TABLE		=		0xFFFF;								//无效桌子

//税收定义
REVENUE_BENCHMARK	=		0;								    //税收起点
REVENUE_DENOMINATOR	=		1000;								//税收分母

LinkInfo = null;
function getLinkInfo() { //输入参数名称
    if(LinkInfo == null){
        LinkInfo = new Object();
        var state = getQueryString("state");//
        if(state && state != ''){
            var obj = JSON.parse(state);
            if(obj.LinkRoom) LinkInfo.LinkRoom = obj.LinkRoom.split(',');
        }
        if(LinkInfo.LinkRoom == null) LinkInfo.LinkRoom = [0,0,0];
    }
}



SERVER_RULES_AA				=0X00000001	;						//AA支付
SERVER_RULES_DK				=0X00000002	;						//代开房间
SERVER_RULES_SCORE			=0X00000004	;						//积分房间
SERVER_RULES_GOLD			=0X00000008	;						//金币房间
//////////////////////////////////////////////////////////////////////////////////
//系统参数

//游戏状态
GAME_STATUS_FREE	=		0;									//空闲状态
GAME_STATUS_PLAY	=		100;									//游戏状态
GAME_STATUS_WAIT	=		200;									//等待状态

//系统参数
LEN_USER_CHAT		=		128;									//聊天长度
TIME_USER_CHAT		=		1;									    //聊天间隔
TRUMPET_MAX_CHAR     =      128;									//喇叭长度

//////////////////////////////////////////////////////////////////////////////////
//索引质数

//列表质数
PRIME_TYPE		=			11;									//种类数目
PRIME_KIND		=			53;								//类型数目
PRIME_NODE		=			101;								//节点数目
PRIME_PAGE		=			53;									//自定数目
PRIME_SERVER	=			1009;								//房间数目

//人数质数
PRIME_SERVER_USER	=		503;								//房间人数
PRIME_ANDROID_USER	=		503;								//机器人数
PRIME_PLATFORM_USER	=		100003;							    //平台人数

//////////////////////////////////////////////////////////////////////////////////
//数据长度

//资料数据
window.LEN_MD5				=		33;									//加密密码
LEN_USERNOTE		=		32;									//备注长度
window.LEN_ACCOUNTS		=		32;									//帐号长度
window.LEN_NICKNAME		=		32;									//昵称长度
window.LEN_PASSWORD		=		33;									//密码长度
window.LEN_GROUP_NAME		=		32;									//社团名字
window.LEN_UNDER_WRITE		=		32;									//个性签名
window.LEN_IP              =       16;
//数据长度
LEN_QQ				=		16;									//Q Q 号码
LEN_EMAIL			=		33;									//电子邮件
LEN_USER_NOTE		=		256;									//用户备注
LEN_SEAT_PHONE		=		33;									//固定电话
LEN_MOBILE_PHONE	=		12;									//移动电话
LEN_PASS_PORT_ID	=		19;									//证件号码
LEN_COMPELLATION	=		16;									//真实名字
LEN_DWELLING_PLACE	=		128;									//联系地址
LEN_WEEK			=		7									//星期长度

//机器标识
LEN_NETWORK_ID		=		13;									//网卡长度
LEN_MACHINE_ID		=		33;									//序列长度

//列表数据
LEN_TYPE			=		32;									//种类长度
LEN_KIND			=		32;									//类型长度
LEN_NODE			=		32;									//节点长度
LEN_PAGE			=		32;									//定制长度
LEN_SERVERADDR		=		32;									//房间地址场地
LEN_SERVER			=		32;									//房间长度
LEN_PROCESS			=		32;									//进程长度
LEN_NAME			=		32;

//////////////////////////////////////////////////////////////////////////////////

//用户关系
CP_NORMAL		=			0;									//未知关系
CP_FRIEND		=			1;									//好友关系
CP_DETEST		=			2;									//厌恶关系
CP_SHIELD		=		    3;									//屏蔽聊天

//////////////////////////////////////////////////////////////////////////////////

//性别定义
GENDER_FEMALE		=		0;									//女性性别
GENDER_MANKIND		=		1;									//男性性别

//////////////////////////////////////////////////////////////////////////////////

//游戏模式
GAME_GENRE_GOLD		=		0x0001;								//金币类型
GAME_GENRE_SCORE	=		0x0002;								//点值类型
GAME_GENRE_MATCH	=		0x0004;								//比赛类型
GAME_GENRE_EDUCATE	=		0x0008;								//训练类型
GAME_GENRE_PERSONAL =       0x0010;
GAME_GENRE_PERSONAL_S    =       0x0020;
GAME_GENRE_PERSONAL_G    =       0x0040;

//////////////////////////////////////////////////////////////////////////////////

//用户状态
US_NULL			=			0x00;								//没有状态
US_FREE			=			0x01;								//站立状态
US_SIT			=			0x02;								//坐下状态
US_READY		=			0x03;								//同意状态
US_LOOKON		=			0x04;								//旁观状态
US_PLAYING		=			0x05;								//游戏状态
US_OFFLINE		=			0x06;								//断线状态
//////////////////////////////////////////////////////////////////////////////////

//用户作弊
UR_GAME_TEST_USER	=		0x20000000;
USER_CARD_TEST = true;
//////////////////////////////////////////////////////////////////////////////////

//比赛状态
MS_NULL			=			0x00;								//没有状态
MS_SIGNUP		=			0x01;								//报名状态
MS_MATCHING		=			0x02;								//比赛状态
MS_OUT			=			0x03;								//淘汰状态

//////////////////////////////////////////////////////////////////////////////////

//房间规则
SRL_LOOKON		=			0x00000001;							//旁观标志
SRL_OFFLINE		=			0x00000002;							//断线标志
SRL_SAME_IP		=			0x00000004;							//同网标志

//房间规则
SRL_ROOM_CHAT		=		0x00000100;							//聊天标志
SRL_GAME_CHAT		=		0x00000200;							//聊天标志
SRL_WISPER_CHAT		=		0x00000400;							//私聊标志
SRL_HIDE_USER_INFO	=		0x00000800;							//隐藏标志

//////////////////////////////////////////////////////////////////////////////////
//数据库定义

DB_ERROR 			=		-1;  								//处理失败
DB_SUCCESS 			=		0;  									//处理成功
DB_NEEDMB 			=		18; 									//处理失败


//////////////////////////////////////////////////////////////////////////////////
//设备类型
DEVICE_TYPE_PC          =     0x00;                                //PC
DEVICE_TYPE_ANDROID     =     0x10;                                //Android
DEVICE_TYPE_ITOUCH      =     0x20;                                //iTouch
DEVICE_TYPE_IPHONE      =     0x40;                                //iPhone
DEVICE_TYPE_IPAD        =     0x80;                                //iPad

/////////////////////////////////////////////////////////////////////////////////
//手机定义

//视图模式
VIEW_MODE_ALL		=		0x0001;								//全部可视
VIEW_MODE_PART		=		0x0002;								//部分可视

//信息模式
VIEW_INFO_LEVEL_1		=	0x0010;								//部分信息
VIEW_INFO_LEVEL_2		=	0x0020;								//部分信息
VIEW_INFO_LEVEL_3		=	0x0040;								//部分信息
VIEW_INFO_LEVEL_4		=	0x0080;								//部分信息

//其他配置
RECVICE_GAME_CHAT		=	0x0100;								//接收聊天
RECVICE_ROOM_CHAT		=	0x0200;								//接收聊天
RECVICE_ROOM_WHISPER	=	0x0400;								//接收私聊

//行为标识
BEHAVIOR_LOGON_NORMAL     =  0x0000;                              //普通登录
BEHAVIOR_LOGON_IMMEDIATELY=  0x1000;                              //立即登录

/////////////////////////////////////////////////////////////////////////////////
//处理结果
RESULT_ERROR 			=		-1;  								    //处理错误
RESULT_SUCCESS 			=		0;  									//处理成功
RESULT_FAIL 			=		1;  									//处理失败

/////////////////////////////////////////////////////////////////////////////////

ServiceStatus_Unknow = 0;			//未知状态
ServiceStatus_Entering = 1;			//进入状态
ServiceStatus_Validate = 2;			//验证状态
ServiceStatus_RecvInfo = 3;			//读取状态
ServiceStatus_ServiceIng = 4;		//服务状态
ServiceStatus_NetworkDown = 5;		//中断状态

/////////////////////////////////////////////////////////////////////////////////
//无效数值
INVALID_BYTE = 0xFF;					//无效数值
INVALID_WORD = 0xFFFF;					//无效数值
INVALID_DWORD = 0xFFFFFFFF;				//无效数值

//扣费类型
MATCH_FEE_TYPE_GOLD = 0x00;             //扣费类型
MATCH_FEE_TYPE_MEDAL = 0x01;            //扣费类型

//比赛类型
MATCH_TYPE_LOCKTIME = 0x00;             //定时类型
MATCH_TYPE_IMMEDIATE = 0x01;            //即时类型

window.g_NetResponseTime = 0;           //服务器心跳时间
//用户属性
tagUserAttribute = cc.Class({
    ctor :function() {
        //用户属性
        this.dwUserID = 0;							                 //用户标识
        this.wTableID = 0;                                             //桌子号码
        this.wChairID = 0;                                             //椅子号码
        //权限属性
        this.dwUserRight = 0;                                         //用户权限
        this.dwMasterRight = 0;                                       //管理权限
    },

});

//游戏属性
tagGameAttribute = cc.Class({
    ctor :function () {
        this.wKindID = 0;							                 //类型标识
        this.wChairCount = 0;                                     //椅子数目
        this.dwClientVersion = 0;                                //游戏版本
        this.szGameName = "";                                    //游戏名字
        this.len_szGameName = LEN_KIND*cc.TCHAR_SIZE;                              //游戏名字
    },
});

//用户属性
tagUserAttrib = cc.Class({
    ctor :function () {
        this.cbCompanion = 0;							             //用户关系
    },
});

$_GET = (function(){
    if(cc.sys.isBrowser){
        var url = document.location.href.toString();
        var u = url.split("?");
        if(typeof(u[1]) == "string"){
            u = u[1].split("&");
            var get = {};
            for(var i in u){
                var j = u[i].split("=");
                get[j[0]] = j[1];
            }
            return get;
        } else {
            return {};
        }
    }
})();

function getQueryString(name) { //输入参数名称
    if(cc.sys.isBrowser){//
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); //根据参数格式，正则表达式解析参数

        var r = window.location.search.substr(1).match(reg);

        if (r != null) return unescape(r[2]); return null; //返回参数值
    }
}

function pad(num, n, s) {
    var str = '' + num;
    while (str.length < n) {
        str = s ? '' + s + str : '0' + str;
    }
    return str;
}

function insertStr(soure, p, s) {
    return `${soure.slice(0, p)}${s}${soure.slice(p)}`;
}

function TransitionScore(lScore) {
    return Number(Number(lScore) / window.PLATFORM_RATIO)
}

function Score2Str(lScore){
    if(lScore === '') return lScore;
    lScore = Number(lScore)/window.PLATFORM_RATIO;
    return lScore>=0? `${cutscore(lScore)}`:`-${cutscore(-lScore)}`;
}

// function Score2Str(lScore, bShowFull) {
//     if(lScore === '') return lScore;
//     if (!window.PLATFORM_RATIO || window.PLATFORM_RATIO < 10 || typeof (lScore) != 'number') return `${cutscore(Number(lScore))}`;
//     var num = Math.abs(Number(lScore));
//     if (num == 0) return `${num}`;
//     var len = `${window.PLATFORM_RATIO}`.length - 1;
//     var str = `${pad(num, len, '0')}`;
//     str = insertStr(str, str.length - len, '.');
//     if(num < window.PLATFORM_RATIO) str = `0${str}`;
//     if(!bShowFull) {
//         for(var i = str.length - 1; i >= 0; --i) {
//             var s = str[i];
//             if(s != '0' && s != '.') break;
//             str = str.slice(0, i);
//             if(s == '.') break;
//         }
//     }
//     if(Number(lScore) < 0) return `-${cutscore(Number(str))}`;
    
//     return cutscore(Number(str));
// }

function Time2Str(dwTime) {
    var rDate = new Date();
    rDate.setTime(dwTime * 1000);
    var str = rDate.getFullYear()+'-'+pad(rDate.getMonth()+1,2)+'-'+pad(rDate.getDate(),2);
    str += ' '+pad(rDate.getHours(), 2)+':'+pad(rDate.getMinutes(), 2)+':'+pad(rDate.getSeconds(), 2);
    return str;
}
function DifDay(time1, time2) {
    var rDate1 = new Date();
    rDate1.setTime(time1);
    var rDate2 = new Date();
    rDate2.setTime(time2);
    if(rDate1.getFullYear() != rDate2.getFullYear()) return true;
    if(rDate1.getMonth() != rDate2.getMonth()) return true;
    if(rDate1.getDate() != rDate2.getDate()) return true;
    return false;
}
function cutscore(Num) {
    var str_cut = "";
    if(Num < 10000){//不到10W直接显示
        str_cut = Num;
    }else if(Num < 100000000){//10W ~ 1亿
        str_cut = Math.floor(Num/10000*100)/100 +'万'
        str_cut = str_cut.replace('.00','');
    }else{
        str_cut = Math.floor(Num/100000000*100)/100 + '亿'
        str_cut = str_cut.replace('.00','');
    }
    return str_cut;
}
function cutstr(str, len) {
    var str_length = 0;
    var str_cut = "";

    for (var i = 0; i < str.length; i++) {
        var a = str.charAt(i);
        str_cut += a;
        if (escape(a).length > 4) str_length+=2;//中文
        else str_length++;
        if (str_length + 1>= len*2 && str.length - i > 1) {
            str_cut = str_cut + "...";
            return str_cut;
        }
    }

    return str_cut;
}

function deepClone(obj){
    if (obj == null) return null;
    var objClone = JSON.parse(JSON.stringify(obj));
    return objClone;
}

function FormatNember(Num){
    return Math.floor(parseInt(Num)/10);
}
function clone(obj) {
    // Handle the 3 simple types, and null or undefined
    if (null == obj || "object" != typeof obj) return obj;

    // Handle Date
    if (obj instanceof Date) {
        var copy = new Date();
        copy.setTime(obj.getTime());
        return copy;
    }

    // Handle Array
    if (obj instanceof Array) {
        var copy = [];
        var len = obj.length;
        for (var i = 0; i < len; ++i) {
            copy[i] = clone(obj[i]);
        }
        return copy;
    }

    // Handle Object
    if (obj instanceof Object) {
        var copy = {};
        for (var attr in obj) {
            if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
        }
        return copy;
    }
    throw new Error("Unable to copy obj! Its type isn't supported." + typeof(obj));
}

function ASSERT(bCondition, sErrorMsg) {
    if (!bCondition) {
        // alert(sErrorMsg);
        console.log(sErrorMsg);
        /* throw */ new Error(sErrorMsg);
    }
}

function cutPhone(strPhone) {
    if (strPhone.length < 11) return strPhone;
    return strPhone.substring(0, 3) + '****' + strPhone.substring(7, strPhone.length);
}

function cutGameID(GameID) {
    GameID = GameID.toString();
    if(GameID == '') return GameID;
    return GameID.substring(0, 2) + '**' + GameID.substring(4, GameID.length);
}

function cutNickName(nickName) {
    if (nickName.length < 2) return nickName;
    var tmpNick = '';
    for(var i =2;i<nickName.length;i++){
        tmpNick += '*';
    }
    return nickName.substring(0, 2) +tmpNick;
}

function saveImage() {
    if(!jsb) return;
    let node = new cc.Node();
    node.parent = cc.director.getScene();
    node.width = cc.view.getVisibleSize().width;
    node.height = cc.view.getVisibleSize().height;
    node.x = node.width/2;
    node.y = node.height/2;
    let camera = node.addComponent(cc.Camera);
    camera.cullingMask = 0xffffffff;
    let texture = new cc.RenderTexture();
    texture.initWithSize(node.width, node.height);
    camera.targetTexture = texture;
    node.parent.scaleY = -1;
    camera.render();
    node.parent.scaleY = 1
    let data = texture.readPixels();
    let width = texture.width;
    let height = texture.height;
    let fileName = "result_share.jpg";
    let fullPath = jsb.fileUtils.getWritablePath() + fileName;
    if (jsb.fileUtils.isFileExist(fullPath)) {
        jsb.fileUtils.removeFile(fullPath);
    }
    let success = jsb.saveImageData(data, width, height, fullPath);
    return success ? fullPath : '';
}

function CompareVersion(versionA, versionB) {
    if(window.LOG_NET_DATA)console.log(`JS Custom Version Compare: version A is ${versionA}, version B is ${versionB}`);
    var vA = versionA.split('.');
    var vB = versionB.split('.');
    for(var i in vA) { vA[i] = parseInt(vA[i]) }
    for(var i in vB) { vB[i] = parseInt(vB[i]) }
    if(vA[0] < vB[0]) return true;
    else if(vA[1] < vB[1]) return true;
    return false;
};

window.Vertical = 0;
window.Horizontal = 1;
window.changeOrientationH = function (horizontal, callFunc) {
    let bChanged = false;
    let w = cc.view.getFrameSize().width;
    let h = cc.view.getFrameSize().height;
    if (horizontal && w > h) {
        // console.log("已经是横屏,无需修改!",w ,h);
        return callFunc && callFunc(bChanged);
    } else if (!horizontal && w < h) {
        // console.log("已经是竖屏,无需修改!",w ,h);
        return callFunc && callFunc(bChanged);
    }

    if(horizontal) {
        SCENE_WIGHT = SCENE_WIGHT_BASE;
        SCENE_HEIGHT = SCENE_HEIGHT_BASE;
    } else {
        SCENE_WIGHT = SCENE_HEIGHT_BASE;
        SCENE_HEIGHT = SCENE_WIGHT_BASE;
    }

    bChanged = true;
    cc.view.setFrameSize(SCENE_WIGHT, SCENE_HEIGHT);
    if (cc.sys.os == cc.sys.OS_IOS) {
        jsb.reflection.callStaticMethod('AppController', "changeOrientation:", horizontal);
    } else if (cc.sys.os == cc.sys.OS_ANDROID) {
        jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "changeOrientation", "(I)V", horizontal);
    }

    if (horizontal) cc.view.setOrientation(cc.macro.ORIENTATION_LANDSCAPE);
    else cc.view.setOrientation(cc.macro.ORIENTATION_PORTRAIT);
    cc.view.setDesignResolutionSize(SCENE_WIGHT, SCENE_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);

    callFunc && setTimeout(function () {
        callFunc(bChanged);
    }, 500);
}

window.HorV = function(Name) {
    return window.Horizontal;
    // 添加游戏ID 切换竖屏
    // if(Name == 'Table' && g_ServerListDataLast && g_ServerListDataLast.wKindID == 99999) {
    //     return window.Vertical;
    // } else {
    //     return window.Horizontal;
    // }
}

function ChangeScene(Name) {
    if(window.gClubClientKernel && window.gClubClientKernel.onSetClubSink) window.gClubClientKernel.onSetClubSink(null,null);
    let bAct = false;
    let cbHV = window.HorV(Name);
    if(g_CurScene == g_Table) bAct = false;
    else if(g_CurScene == g_Launch) bAct = false;
    else bAct = true;
    cc.director.preloadScene(Name, null, function() {
        if(bAct) {
            HideI2O(g_CurScene.node, function () {
                changeOrientationH(cbHV, function() {
                    cc.director.loadScene(Name, function(){
                        cc.view.setDesignResolutionSize(SCENE_WIGHT, SCENE_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);
                    });

                });
            }, 0.1, true);
        } else {
            changeOrientationH(cbHV, function() {
                cc.director.loadScene(Name, function(){
                    cc.view.setDesignResolutionSize(SCENE_WIGHT, SCENE_HEIGHT, cc.ResolutionPolicy.FIXED_HEIGHT);
                });
            });
        }
    }.bind(g_CurScene));


}
