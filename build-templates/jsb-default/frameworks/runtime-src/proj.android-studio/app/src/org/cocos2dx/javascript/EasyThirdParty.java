package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.app.Activity;
import android.graphics.Bitmap;
import android.os.Handler;
import android.os.Message;
import android.text.TextUtils;
import android.util.Log;
import android.widget.Filter;
import android.widget.Toast;
import android.content.Context;

import com.alipay.sdk.app.PayTask;
import com.amap.api.location.AMapLocation;
import com.amap.api.location.AMapLocationClient;
import com.amap.api.location.AMapLocationClientOption;
import com.amap.api.location.AMapLocationListener;
import com.tencent.gcloud.voice.GCloudVoiceEngine;
import com.tencent.gcloud.voice.IGCloudVoiceNotify;
import com.tencent.mm.opensdk.constants.Build;
import com.tencent.mm.opensdk.modelpay.PayReq;
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;
import com.umeng.commonsdk.UMConfigure;
import com.umeng.socialize.PlatformConfig;
import com.umeng.socialize.ShareAction;
import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareAPI;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.socialize.editorpage.ShareActivity;
import com.umeng.socialize.media.UMImage;
import com.umeng.socialize.media.UMWeb;
import com.umeng.socialize.UMShareConfig;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.util.Map;

/**
 * 执念
 */
public class EasyThirdParty {
    public static final String WEIXIN_APP_ID = "wx9254cc73caa15129";
    public static final String WEIXIN_SECRET = "04b1686c4219335c013b463ada0c08e5";
    public static final String UMENG_KEY = "5d5b5e310cafb23bde0008f7";
    public static final String GVOICE_APPID = "1648589497";;
    public static final String GVOICE_APPKEY = "242c6ff9a2258c4d3c8c3d2f3bae3688";

    private Activity mContext = null;

    //高德
    private AMapLocationClient locationClient = null;
    // 定位监听
    private AMapLocationListener locationListener = null;
    // 定位结果回调
    private EasyThirdParty.OnLocationCallBack mLocationCallback = null;


    private static EasyThirdParty mEasyThirdParty;

    private EasyThirdParty() {
    }

    /*
    调用示例
    EasyThirdParty.getInstance().init(this);
         EasyThirdParty.getInstance().requestLocation(new EasyThirdParty.OnLocationCallBack() {
         @Override
         public void onLocationResult(boolean bSuccess, int errorCode, String backMsg) {
             Log.e("定位", bSuccess + "\n" + errorCode + "\n" + backMsg);
         }
     });*/
    public static EasyThirdParty getInstance() {
        if (mEasyThirdParty == null) {
            mEasyThirdParty = new EasyThirdParty();
        }
        return mEasyThirdParty;
    }

    public void init(Activity context) {
        mContext = context;

        //配置高德地图
        doConfigAMAP();

        //配置友盟
        doConfigUM();
    }

//--------------------------------------------------定位相关（高德）---------------------------------------------------------------
    /*定位Manifest.xml 配置

权限

        <!-- 设置key -->
       <application
         android:icon="@drawable/icon"
         android:label="@string/app_name" >
         <meta-data
            android:name="com.amap.api.v2.apikey"
            android:value="请输入您的用户Key"/>
            ……
</application>
        <!-- 定位需要的服务 -->
        <service android:name="com.amap.api.location.APSService"></service>*/


    // 请求单次定位
    public void requestLocation(EasyThirdParty.OnLocationCallBack mLocationCallback) {
        this.mLocationCallback = mLocationCallback;
        if (null != locationClient && null != locationListener) {
            locationClient.stopLocation();
            // 设置定位监听
            locationClient.setLocationListener(locationListener);
            // 定位请求
            locationClient.startLocation();
        } else {
            mLocationCallback.onLocationResult(false, -1, "定位服务初始化失败!");
        }
    }

    // 停止定位
    public void stopLocation() {
        locationClient.stopLocation();
    }

    public void destroy() {
        destroyLocation();
    }

    /**
     * 销毁定位
     *
     * @author hongming.wang
     * @since 2.8.0
     */
    public void destroyLocation() {
        if (null != getInstance().locationClient) {
            /**
             * 如果AMapLocationClient是在当前Activity实例化的，
             * 在Activity的onDestroy中一定要执行AMapLocationClient的onDestroy
             */
            getInstance().locationClient.onDestroy();
            getInstance().locationClient = null;
            getInstance().locationClient = null;
        }
    }

    //配置高德地图
    private void doConfigAMAP() {
        AMapLocationClientOption locationOption = new AMapLocationClientOption();
        locationOption.setLocationMode(AMapLocationClientOption.AMapLocationMode.Hight_Accuracy);//可选，设置定位模式，可选的模式有高精度、仅设备、仅网络。默认为高精度模式
        locationOption.setGpsFirst(false);//可选，设置是否gps优先，只在高精度模式下有效。默认关闭
        locationOption.setHttpTimeOut(30000);//可选，设置网络请求超时时间。默认为30秒。在仅设备模式下无效
        locationOption.setInterval(2000);//可选，设置定位间隔。默认为2秒
        locationOption.setNeedAddress(true);//可选，设置是否返回逆地理地址信息。默认是true
        locationOption.setOnceLocation(true);//可选，设置是否单次定位。默认是false
        locationOption.setOnceLocationLatest(false);//可选，设置是否等待wifi刷新，默认为false.如果设置为true,会自动变为单次定位，持续定位时不要使用
        AMapLocationClientOption.setLocationProtocol(AMapLocationClientOption.AMapLocationProtocol.HTTP);//可选， 设置网络请求的协议。可选HTTP或者HTTPS。默认为HTTP
        locationOption.setSensorEnable(false);//可选，设置是否使用传感器。默认是false
        // locationOption.setWifiScan(true); //可选，设置是否开启wifi扫描。默认为true，如果设置为false会同时停止主动刷新，停止以后完全依赖于系统刷新，定位位置可能存在误差
        //locationOption.setLocationCacheEnable(true); //可选，设置是否使用缓存定位，默认为true
        //locationOption.setGeoLanguage(AMapLocationClientOption.GeoLanguage.DEFAULT);//可选，设置逆地理信息的语言，默认值为默认语言（根据所在地区选择语言）


        // 定位监听
        locationListener = new AMapLocationListener() {
            @Override
            public void onLocationChanged(AMapLocation loc) {
                boolean bRes = false;
                int errorCode = -1;
                String backMsg = "";
                if (null != loc) {
//定位结果信息
                    /*if (location.getErrorCode() == 0) {
                        sb.append("定位成功" + "\n");
                        sb.append("定位类型: " + location.getLocationType() + "\n");
                        sb.append("经    度    : " + location.getLongitude() + "\n");
                        sb.append("纬    度    : " + location.getLatitude() + "\n");
                        sb.append("精    度    : " + location.getAccuracy() + "米" + "\n");
                        sb.append("提供者    : " + location.getProvider() + "\n");

                        sb.append("速    度    : " + location.getSpeed() + "米/秒" + "\n");
                        sb.append("角    度    : " + location.getBearing() + "\n");
                        // 获取当前提供定位服务的卫星个数
                        sb.append("星    数    : " + location.getSatellites() + "\n");
                        sb.append("国    家    : " + location.getCountry() + "\n");
                        sb.append("省            : " + location.getProvince() + "\n");
                        sb.append("市            : " + location.getCity() + "\n");
                        sb.append("城市编码 : " + location.getCityCode() + "\n");
                        sb.append("区            : " + location.getDistrict() + "\n");
                        sb.append("区域 码   : " + location.getAdCode() + "\n");
                        sb.append("地    址    : " + location.getAddress() + "\n");
                        sb.append("兴趣点    : " + location.getPoiName() + "\n");
                        //定位完成的时间
                        // sb.append("定位时间: " + Utils.formatUTC(location.getTime(), "yyyy-MM-dd HH:mm:ss") + "\n");
                    } else {
                        //定位失败
                        sb.append("定位失败" + "\n");
                        sb.append("错误码:" + location.getErrorCode() + "\n");
                        sb.append("错误信息:" + location.getErrorInfo() + "\n");
                        sb.append("错误描述:" + location.getLocationDetail() + "\n");
                    }
                    sb.append("***定位质量报告***").append("\n");
                    sb.append("* WIFI开关：").append(location.getLocationQualityReport().isWifiAble() ? "开启" : "关闭").append("\n");
                    sb.append("* GPS状态：").append(getGPSStatusString(location.getLocationQualityReport().getGPSStatus())).append("\n");
                    sb.append("* GPS星数：").append(location.getLocationQualityReport().getGPSSatellites()).append("\n");
                    sb.append("* 网络类型：" + location.getLocationQualityReport().getNetworkType()).append("\n");
                    sb.append("* 网络耗时：" + location.getLocationQualityReport().getNetUseTime()).append("\n");
                    sb.append("****************").append("\n");*/
                    //解析定位结果

                    errorCode = loc.getErrorCode();
                    if (0 == loc.getErrorCode()) {
                        JSONObject jObject = new JSONObject();
                        try {
                            bRes = true;
                            jObject.put("berror", false);
                            jObject.put("code", errorCode);
                            jObject.put("msg", loc.getErrorInfo());
                            jObject.put("latitude", loc.getLatitude());
                            jObject.put("longitude", loc.getLongitude());
                            jObject.put("address", loc.getAddress());
                            backMsg = jObject.toString();
                        } catch (JSONException e) {
                            backMsg = "定位数据解析异常!" + loc.getErrorInfo();
                            e.printStackTrace();
                        }
                    } else {
                        JSONObject jObject = new JSONObject();
                        try {
                            bRes = true;
                            jObject.put("berror", true);
                            jObject.put("code", errorCode);
                            jObject.put("msg", loc.getErrorInfo());
                            backMsg = jObject.toString();
                        } catch (JSONException e) {
                            backMsg = "定位数据解析异常!" + loc.getErrorInfo();
                            e.printStackTrace();
                        }
                        locationClient.stopLocation();
                    }
                } else {
                    backMsg = "定位异常!";
                }

                if (null != mLocationCallback) {
                    mLocationCallback.onLocationResult(bRes, errorCode, backMsg);
                }
                locationClient.stopLocation();
            }
        };


        // 初始化client
        locationClient = new AMapLocationClient(mContext.getApplicationContext());
        // 设置定位参数
        locationClient.setLocationOption(locationOption);
    }


    /* */

    /**
     * 获取GPS状态的字符串
     *
     * @param //statusCode GPS状态码
     * @return
     *//*
    private String getGPSStatusString(int statusCode) {
        String str = "";
        switch (statusCode) {
            case AMapLocationQualityReport.GPS_STATUS_OK:
                str = "GPS状态正常";
                break;
            case AMapLocationQualityReport.GPS_STATUS_NOGPSPROVIDER:
                str = "手机中没有GPS Provider，无法进行GPS定位";
                break;
            case AMapLocationQualityReport.GPS_STATUS_OFF:
                str = "GPS关闭，建议开启GPS，提高定位质量";
                break;
            case AMapLocationQualityReport.GPS_STATUS_MODE_SAVING:
                str = "选择的定位模式中不包含GPS定位，建议选择包含GPS定位的模式，提高定位质量";
                break;
            case AMapLocationQualityReport.GPS_STATUS_NOGPSPERMISSION:
                str = "没有GPS定位权限，建议开启gps定位权限";
                break;
        }
        return str;
    }*/


    public static interface OnLocationCallBack {
        //bSuccess  定位回调状态
        //errorCode错误码  -1为初始化失败  0成功 参考 https://lbs.amap.com/api/android-location-sdk/guide/utilities/errorcode
        public void onLocationResult(boolean bSuccess, int errorCode, String backMsg);
    }


    //---------------------------------------------------------友盟三方登录分享------------------------------------------------------------------


    //友盟开发文档 https://developer.umeng.com/docs/66632/detail/66639
    // 1、在包名目录下创建wxapi文件夹，新建一个名为WXEntryActivity的activity继承WXCallbackActivity。
    //2、AndroidManifest.xml添加
    // <activity
    //            android:name=".wxapi.WXEntryActivity"
    //            android:configChanges="keyboardHidden|orientation|screenSize"
    //            android:exported="true"
    //            android:theme="@android:style/Theme.Translucent.NoTitleBar" />

    private void doConfigUM() {
        PlatformConfig.setWeixin(WEIXIN_APP_ID, WEIXIN_SECRET);
        UMConfigure.init(mContext, UMENG_KEY, "umeng", UMConfigure.DEVICE_TYPE_PHONE, "");
        UMConfigure.setLogEnabled(true);
    }

    /*调用示例
    EasyThirdParty.getInstance().login(SHARE_MEDIA.WEIXIN, new UMAuthListener() {
         @Override
         public void onStart(SHARE_MEDIA share_media) {

         }

         @Override
         public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
             for (String key : map.keySet()) {
                 String value = map.get(key);
                 Log.e(key, value);
             }
             //data.get("name")获取昵称
             //data.get("profile_image_url")获取头像
             //返回信息如下
             09-11 09:52:34.553 9351-9351/com.seven.tl E/unionid:
09-11 09:52:34.553 9351-9351/com.seven.tl E/screen_name:           
09-11 09:52:34.553 9351-9351/com.seven.tl E/accessToken: 13_G3bOK8xC8N16zIiKzpAmkmZAjXsDgUwsrsiNXDMps3h5GIwz4Euf-jjLORkr50zGlcko5DbOU2KlFqmMqx1NaLW-hydsxnSj_35S9GTO5l8
09-11 09:52:34.553 9351-9351/com.seven.tl E/refreshToken: 13_EzEYPovD5_8Hhk4pbpMXIO-ww4mkSDKrzkMYefhHmbDOCQA-4rj3chQHoT6ER1FmWjzjvMcx4TayJfBmCgi4vReYO41fgbpNh1UxklAS_vo
09-11 09:52:34.553 9351-9351/com.seven.tl E/gender: 0
09-11 09:52:34.563 9351-9351/com.seven.tl E/openid:
09-11 09:52:34.563 9351-9351/com.seven.tl E/profile_image_url: http://thirdwx.qlogo.cn/mmopen/vi_32/nrYibkhtIpScnZJNH039Y3ujpmDDMHjnz9kuzuzvYltPaGjpiaAG1tdxlRznW9lMfbVkzk2UJzEERr2JTfRoe3pg/132
09-11 09:52:34.563 9351-9351/com.seven.tl E/access_token: 13_G3bOK8xC8N16zIiKzpAmkmZAjXsDgUwsrsiNXDMps3h5GIwz4Euf-jjLORkr50zGlcko5DbOU2KlFqmMqx1NaLW-hydsxnSj_35S9GTO5l8
09-11 09:52:34.563 9351-9351/com.seven.tl E/iconurl: http://thirdwx.qlogo.cn/mmopen/vi_32/nrYibkhtIpScnZJNH039Y3ujpmDDMHjnz9kuzuzvYltPaGjpiaAG1tdxlRznW9lMfbVkzk2UJzEERr2JTfRoe3pg/132
09-11 09:52:34.563 9351-9351/com.seven.tl E/name:           
09-11 09:52:34.563 9351-9351/com.seven.tl E/uid:
09-11 09:52:34.563 9351-9351/com.seven.tl E/expiration: 1536637954286
09-11 09:52:34.563 9351-9351/com.seven.tl E/language: zh_CN
09-11 09:52:34.563 9351-9351/com.seven.tl E/expires_in: 1536637954286
09-11 09:52:37.906 9351-9351/com.seven.tl E/AndroidRuntime: FATAL EXCEPTION: main
         }

         @Override
         public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {

         }

         @Override
         public void onCancel(SHARE_MEDIA share_media, int i) {

         }
     });*/


    //登录
    public void login(SHARE_MEDIA platform, final UMAuthListener umAuthListener) {
        UMShareConfig config = new UMShareConfig();
        config.isNeedAuthOnGetUserInfo(true);
        UMShareAPI.get(mContext).setShareConfig(config);

        UMShareAPI mShareAPI = UMShareAPI.get(mContext);

        if (!mShareAPI.isInstall(mContext, platform)) {
            unInstallToast(mContext, platform);
            return;
        }

        mShareAPI.getPlatformInfo(mContext, platform, umAuthListener);
    }

    private void unInstallToast(Activity mContext, SHARE_MEDIA platform) {
        if (platform == SHARE_MEDIA.WEIXIN) {
            //微信未安装
        } else if (platform == SHARE_MEDIA.QQ) {
            //QQ未安装
        }
    }

    /*分享示例
    EasyThirdParty.getInstance().shareImage(SHARE_MEDIA.WEIXIN, "title", new File(""), new UMShareListener() {
        @Override
        public void onStart(SHARE_MEDIA share_media) {

        }

        @Override
        public void onResult(SHARE_MEDIA share_media) {

        }

        @Override
        public void onError(SHARE_MEDIA share_media, Throwable throwable) {

        }

        @Override
        public void onCancel(SHARE_MEDIA share_media) {

        }
    });*/

    // EasyThirdParty.getInstance().shareImage(SHARE_MEDIA.WEIXIN, "title", "description","url", R.drawable.ic_launcher, new UMShareListener() {
    public void shareUrl(SHARE_MEDIA platform, String title, String description, String url, int thumbRes, final UMShareListener shareListener) {
        //压缩
        UMImage thumb = new UMImage(mContext, thumbRes);
        UMWeb web = new UMWeb(url);
        web.setTitle(title);//标题
        web.setThumb(thumb);  //缩略图
        web.setDescription(description);//描述

        new ShareAction(mContext)
                .setPlatform(platform)
                .withMedia(web)
                .setCallback(shareListener)
                .share();
    }

    //分享图片 文字
    public void shareImage(SHARE_MEDIA platform, String text, Object imageObj, final UMShareListener shareListener) {
        UMShareAPI mShareAPI = UMShareAPI.get(mContext);
        if (!mShareAPI.isInstall(mContext, platform)) {
            unInstallToast(mContext, platform);
            return;
        }
        if (imageObj == null) {
            new ShareAction(mContext)
                    .setPlatform(platform)
                    .withText(text)
                    .setCallback(shareListener)
                    .share();
            return;
        }

       /* UMImage image = new UMImage(ShareActivity.this, "imageurl");//网络图片
        UMImage image = new UMImage(ShareActivity.this, file);//本地文件
        UMImage image = new UMImage(ShareActivity.this, R.drawable.xxx);//资源文件
        UMImage image = new UMImage(ShareActivity.this, bitmap);//bitmap文件
        UMImage image = new UMImage(ShareActivity.this, byte[]);//字节流*/
        UMImage image = null;
        if (imageObj instanceof String) {
            image = new UMImage(mContext, (String) imageObj);
        } else if (imageObj instanceof File) {
            image = new UMImage(mContext, (File) imageObj);
        } else if (imageObj instanceof Integer) {
            image = new UMImage(mContext, (int) imageObj);
        } else if (imageObj instanceof Bitmap) {
            image = new UMImage(mContext, (Bitmap) imageObj);
        } else if (imageObj instanceof byte[]) {
            image = new UMImage(mContext, (byte[]) imageObj);
        }
        new ShareAction(mContext)
                .setPlatform(platform)
                .withText(text)
                .withMedia(image)
                .setCallback(shareListener)
                .share();

    }


    //------------------------------------------------支付-------------------------------------------------------------------------


    private OnPayListener mOnPayListener;
    private static final int SDK_PAY_FLAG = 1;

    //支付监听
    public static interface OnPayListener {
        public void onPaySuccess(String msg);

        public void onPayFail(String msg);
    }

    public void onPayResult(boolean bSuccess, String msg) {
        if (null != mOnPayListener) {
            if (bSuccess) {
                mOnPayListener.onPaySuccess(msg);
            } else {
                mOnPayListener.onPayFail(msg);
            }
        }
        mOnPayListener = null;
    }

    //微信支付
    private void doWeChatPay(final JSONObject info, OnPayListener onPayListener) {
        if (null == mContext) {
            onPayResult(false, "未初始化");
            return;
        }

        mOnPayListener = onPayListener;

        IWXAPI msgApi = WXAPIFactory.createWXAPI(mContext, WEIXIN_APP_ID);
        msgApi.registerApp(WEIXIN_APP_ID);
        if (msgApi.getWXAppSupportAPI() >= Build.PAY_SUPPORTED_SDK_INT) {
            try {
                PayReq request = new PayReq();
                request.appId = info.getString("appid");
                request.partnerId = info.getString("partnerid");
                request.prepayId = info.getString("prepayid");
                request.packageValue = info.getString("package");
                request.nonceStr = info.getString("noncestr");
                request.timeStamp = info.getString("timestamp");
                request.sign = info.getString("sign");
                msgApi.sendReq(request);
            } catch (JSONException e) {
                e.printStackTrace();
                onPayResult(false, "订单数据解析异常");
            }
        } else {
            onPayResult(false, "未安装微信或微信版本过低");
        }
    }

    //支付宝支付示例
   /* EasyThirdParty.getInstance().doAliPay(str, new EasyThirdParty.OnPayListener() {
        @Override
        public void onPaySuccess(String msg) {
            showPayDialog(true, "");
        }

        @Override
        public void onPayFail(String msg) {
            showPayDialog(false, msg);
        }
    });*/
    //支付宝支付
    private void doAliPay(final String orderInfo, OnPayListener onPayListener) {
        if (null == mContext) {
            onPayResult(false, "未初始化");
            return;
        }

        mOnPayListener = onPayListener;

        Runnable payRunnable = new Runnable() {

            @Override
            public void run() {
                PayTask alipay = new PayTask(mContext);
                Map<String, String> result = alipay.payV2(orderInfo, true);
                Log.i("msp", result.toString());

                Message msg = new Message();
                msg.what = SDK_PAY_FLAG;
                msg.obj = result;
                mHandler.sendMessage(msg);
            }
        };

        Thread payThread = new Thread(payRunnable);
        payThread.start();
    }


    @SuppressLint("HandlerLeak")
    private Handler mHandler = new Handler() {
        @SuppressWarnings("unused")
        public void handleMessage(Message msg) {
            switch (msg.what) {
                case SDK_PAY_FLAG: {
                    @SuppressWarnings("unchecked")
                    PayResult payResult = new PayResult((Map<String, String>) msg.obj);
                    /**
                     对于支付结果，请商户依赖服务端的异步通知结果。同步通知结果，仅作为支付结束的通知。
                     */
                    //String resultInfo = payResult.getResult();// 同步返回需要验证的信息
                    String resultStatus = payResult.getResultStatus();
                    // 判断resultStatus 为9000则代表支付成功
                    if (TextUtils.equals(resultStatus, "9000")) {
                        // 该笔订单是否真实支付成功，需要依赖服务端的异步通知。
                        onPayResult(true, "支付成功");
                        Toast.makeText(mContext, "支付成功", Toast.LENGTH_SHORT).show();
                    } else {
                        // 该笔订单真实的支付结果，需要依赖服务端的异步通知。
                        onPayResult(false, payResult.getResult());
                        Toast.makeText(mContext, "支付失败", Toast.LENGTH_SHORT).show();
                    }
                    break;
                }
                default:
                    break;
            }
        }
    };

    class PayResult {
        private String resultStatus;
        private String result;
        private String memo;

        public PayResult(Map<String, String> rawResult) {
            if (rawResult == null) {
                return;
            }

            for (String key : rawResult.keySet()) {
                if (TextUtils.equals(key, "resultStatus")) {
                    resultStatus = rawResult.get(key);
                } else if (TextUtils.equals(key, "result")) {
                    result = rawResult.get(key);
                } else if (TextUtils.equals(key, "memo")) {
                    memo = rawResult.get(key);
                }
            }
        }

        @Override
        public String toString() {
            return "resultStatus={" + resultStatus + "};memo={" + memo
                    + "};result={" + result + "}";
        }

        /**
         * @return the resultStatus
         */
        public String getResultStatus() {
            return resultStatus;
        }

        /**
         * @return the memo
         */
        public String getMemo() {
            return memo;
        }

        /**
         * @return the result
         */
        public String getResult() {
            return result;
        }
    }


    //----------------------------------------腾讯云语音（离线语音、实时语音）--------------------------------------------
    // https://gcloud.qq.com/document/5923b83582fb561c1b3024b5

    private GCloudVoiceEngine engine;

    /**
     * @param openId 唯一标识区分用户
     * @param mode   RealTime实时语音  0
     *               Messages 离线语音   1
     *               Translation   2
     *               HighQuality   4
     * @param notify 回调
     */
    public void doConfigGCloudVoice(Context context, Activity activity, String openId, IGCloudVoiceNotify notify, int key) {
        GCloudVoiceEngine.getInstance().init(context, activity);

        engine = GCloudVoiceEngine.getInstance();

        engine.SetAppInfo(GVOICE_APPID, GVOICE_APPKEY, openId);

        engine.Init();

        engine.SetMode(2);

        engine.SetNotify(notify);

        engine.ApplyMessageKey(key);

    }

    /**
     * @param mode RealTime实时语音  0
     *             Messages 离线语音   1
     *             Translation   2
     *             HighQuality   4
     * @return
     */
    public int setMode(int mode) {
        return engine.SetMode(mode);
    }

    /*
        //设置回调
        public int setNotify(IGCloudVoiceNotify notify) {
            return engine.SetNotify(notify);
        }*/
    public void Resume() {
        engine.Resume();
    }

    public void Pause() {
        engine.Pause();
    }

    /**
     * 加入国战房间
     * @param roomName
     * @param role     角色 1, // member who can open microphone and say
     *                  Audience,   // member who can only hear anchor's voice
     * @param msTimeout
     * @return
     */
    public int JoinNationalRoom(String roomName, int role, int msTimeout) {
        return engine.JoinNationalRoom(roomName, role, msTimeout);
    }

    /**
     * 加入小队语音房间
     *
     * @param roomName
     * @param msTimeout
     * @return
     */
    public int JoinTeamRoom(String roomName, int msTimeout) {
        return engine.JoinTeamRoom(roomName, msTimeout);
    }

    /**
     * 退出房间
     *
     * @param roomName
     * @param msTimeout
     * @return
     */
    public int QuitRoom(String roomName, int msTimeout) {
        return engine.QuitRoom(roomName, msTimeout);
    }

    //打开麦克风
    public int OpenMic() {
        return engine.OpenMic();
    }

    //关闭麦克风
    public int CloseMic() {
        return engine.CloseMic();
    }

    // 打开扬声器
    public int OpenSpeaker() {
        return engine.OpenSpeaker();
    }

    //关闭扬声器
    public int CloseSpeaker() {
        return engine.CloseSpeaker();
    }


    // -----------------------------------------语音消息---------------------------------
    //在语音消息的模式下，可以限制最大语音消息的长度，目前默认是2min，最大不超过2min。
    //timeOut  超时时间  毫秒

    /**
     * 开始录音
     *
     * @param recordingPath 录音文件保存路径
     * @return
     */
    public int StartRecording(String recordingPath) {
        return engine.StartRecording(recordingPath);
    }

    /**
     * 停止录音
     *
     * @return
     */
    public int StopRecording() {
        return engine.StopRecording();
    }

    /**
     * 上传录音文件
     *
     * @param recordingPath 录音保存路径
     * @param msTimeout     超时时间
     * @return
     */
    public int UploadRecordedFile(String recordingPath, int msTimeout) {
        return engine.UploadRecordedFile(recordingPath, msTimeout);
    }

    /**
     * 下载指定语音文件
     *
     * @param fileId       OnUploadFile中取到
     * @param downloadPath 下载路径
     * @param msTimeout    超时时间
     * @return
     */
    public int DownloadRecordedFile(String fileId, String downloadPath, int msTimeout) {
        return engine.DownloadRecordedFile(fileId, downloadPath, msTimeout);
    }

    /**
     * 播放下载后的语音文件
     *
     * @param downloadPath
     * @return
     */
    public int PlayRecordedFile(String downloadPath) {
        return engine.PlayRecordedFile(downloadPath);
    }

    /**
     * 停止播放语音文件
     *
     * @return
     */
    public int StopPlayFile() {
        return engine.StopPlayFile();
    }

    public void Poll() {
        if (engine != null)
            engine.Poll();
    }
}
