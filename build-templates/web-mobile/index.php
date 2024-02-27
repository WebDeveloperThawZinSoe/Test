<?php
require_once "../define.php";
if(@$_GET["Jump"] == 1){
	$url="https://open.weixin.qq.com/connect/oauth2/authorize?appid=".$WXAppID."&redirect_uri=".$H5Url."&response_type=code&scope=snsapi_userinfo&state="; 
	$url = $url.$_GET["state"]."#wechat_redirect";
	header("Location: ".$url); 
	exit;
} 
else
{
	require_once "../jssdk.php";
	$jssdk = new JSSDK($WXAppID, $WXSecret);
	$signPackage = $jssdk->getSignPackage();
}
?>

<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">

    <title>寰宇</title>

    <!--http://www.html5rocks.com/en/mobile/mobifying/-->
    <meta name="viewport" content="width=device-width,user-scalable=no,initial-scale=1, minimum-scale=1,maximum-scale=1" />

    <!--https://developer.apple.com/library/safari/documentation/AppleApplications/Reference/SafariHTMLRef/Articles/MetaTags.html-->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="format-detection" content="telephone=no">

    <!-- force webkit on 360 -->
    <meta name="renderer" content="webkit" />
    <meta name="force-rendering" content="webkit" />
    <!-- force edge on IE -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
    <meta name="msapplication-tap-highlight" content="no">

    <!-- force full screen on some browser -->
    <meta name="full-screen" content="yes" />
    <meta name="x5-fullscreen" content="true" />
    <meta name="360-fullscreen" content="true" />

    <!-- force screen orientation on some browser -->
    <meta name="screen-orientation" content="" />
    <meta name="x5-orientation" content="">

    <!--fix fireball/issues/3568 -->
    <!--<meta name="browsermode" content="application">-->
    <meta name="x5-page-mode" content="app">

    <!--<link rel="apple-touch-icon" href=".png" />-->
    <!--<link rel="apple-touch-icon-precomposed" href=".png" />-->

    <link rel="stylesheet" type="text/css" href="style-mobile.css" />
    <link rel="icon" href="favicon.ico" />
</head>

<body>
    <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
    <div id="splash">
        <div class="progress-bar stripes">
            <span style="width: 0%"></span>
        </div>
		</div>
    <script src="http://res.wx.qq.com/open/js/jweixin-1.4.0.js" charset="utf-8"></script>
    <script src="src/settings.js?ver=<?php echo time();?>" charset="utf-8"></script>
    <script src="main.js?ver=<?php echo time();?>" charset="utf-8"></script>

    <script type="text/javascript">

        (function () {
            // open web debugger console
            if (typeof VConsole !== 'undefined') {
                window.vConsole = new VConsole();
            }

            var debug = window._CCSettings.debug;
            var splash = document.getElementById('splash');
            splash.style.display = 'block';

            function loadScript(moduleName, cb) {
                function scriptLoaded() {
                    document.body.removeChild(domScript);
                    domScript.removeEventListener('load', scriptLoaded, false);
                    cb && cb();
					window.DOMAIN_NAME = "<?php echo $DomainName;?>";
					window.APK_NAME = window.QPName;
					window.QPName = "<?php echo $QPName;?>";
					if(cc.sys.browserType == cc.sys.BROWSER_TYPE_WECHAT || cc.sys.browserType == cc.sys.BROWSER_TYPE_MOBILE_QQ){
					} else {
						window.location.href = "<?php echo $H5Url;?>"+"/OpenError.php";
					}
                };
                var domScript = document.createElement('script');
                domScript.async = true;
                domScript.src = moduleName;
                domScript.addEventListener('load', scriptLoaded, false);
                document.body.appendChild(domScript);
            }

            loadScript(debug ? 'cocos2d-js.js' : 'cocos2d-js-min.js', function () {
                if (CC_PHYSICS_BUILTIN || CC_PHYSICS_CANNON) {
                    loadScript(debug ? 'physics.js' : 'physics-min.js', window.boot);
                } else {
                    window.boot();
                }
            });
        })();

        wx.config({
            debug: false,
            appId: '<?php echo $signPackage["appId"];?>',
            timestamp: "<?php echo $signPackage["timestamp"];?>",
            nonceStr: '<?php echo $signPackage["nonceStr"];?>',
            signature: '<?php echo $signPackage["signature"];?>',
            jsApiList: [
                'updateAppMessageShareData',
                'updateTimelineShareData',
                'onMenuShareAppMessage',
                'onMenuShareTimeline',
                'showMenuItems',
                'uploadVoice',
                'onVoicePlayEnd',
                'stopVoice',
                'playVoice',
                'onVoiceRecordEnd',
                'stopRecord',
                'downloadVoice',
                'startRecord',
            ]
        });

        wx.ready(function () {

        });
    </script>

    <form style='display:none;' id='form1' name='form1' method='post' action=''>
        <input name='PhpUserName' type='text' value='' />
        <input name='PhpPassword' type='text' value='' />
    </form>
</body>

</html>