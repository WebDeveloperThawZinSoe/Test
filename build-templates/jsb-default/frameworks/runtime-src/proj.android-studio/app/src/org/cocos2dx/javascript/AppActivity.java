/****************************************************************************
Copyright (c) 2015 Chukong Technologies Inc.
 
http://www.cocos2d-x.org

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
****************************************************************************/
package org.cocos2dx.javascript;

import org.cocos2dx.lib.Cocos2dxActivity;
import org.cocos2dx.lib.Cocos2dxGLSurfaceView;
import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;
//import org.cocos2dx.javascript.SDKWrapper;
import org.cocos2dx.javascript.Constants;

import java.io.ByteArrayOutputStream;
import java.io.ByteArrayInputStream;

import java.io.File;
import java.io.IOException;

import java.io.BufferedReader;    
import java.io.InputStream;    
import java.io.InputStreamReader;    

import java.net.URL;

import android.Manifest;
import android.content.pm.ActivityInfo;
import android.content.BroadcastReceiver;
import android.content.IntentFilter;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.BatteryManager;

import android.os.Bundle;
import android.os.Environment;
import android.os.Looper;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;

import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Bitmap.Config;
import android.graphics.Matrix;
import android.graphics.Canvas;
import android.graphics.Rect;

import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.text.ClipboardManager;

import com.sy.mingju.R;
import com.sy.mingju.R.string;

import com.umeng.socialize.UMAuthListener;
import com.umeng.socialize.UMShareListener;
import com.umeng.socialize.bean.SHARE_MEDIA;
import com.umeng.commonsdk.utils.UMUtils;

import org.json.JSONObject;
import org.json.JSONException;
import java.util.Iterator;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.regex.PatternSyntaxException;
import java.util.Timer;
import java.util.TimerTask;

import android.widget.Toast;
import android.view.KeyEvent;
import android.view.WindowManager;

import android.net.ConnectivityManager;
import android.net.NetworkInfo;
import android.net.Uri;

import android.util.Log;

////////////////////////////////
import android.database.Cursor;

import java.io.BufferedOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;

import android.provider.MediaStore;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.os.Build;

import android.os.PowerManager;
import android.os.PowerManager.WakeLock;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.UnsupportedEncodingException;

import java.lang.reflect.Method;
import java.math.BigInteger;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;

import android.content.ContentResolver;

////////////////////////////////

public class AppActivity extends Cocos2dxActivity {
    private Handler m_hHandler = null;
    private String strUpLoadUrl = "";

    public static Context sContext;
    public static AppActivity app;

    private static UpdateManager mUpdateManager;

    private static final int THUMB_SIZE = 100;
    private static final String LOG_TAG="jswrapper ";

    public static BatteryChangedReceiver batteryChangedReceiver;
    public static float mBatLv=1;
	
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
		// Workaround in https://stackoverflow.com/questions/16283079/re-launch-of-activity-on-home-button-but-only-the-first-time/16447508
        if (!isTaskRoot()) {
            // Android launched another instance of the root activity into an existing task
            //  so just quietly finish and go away, dropping the user back into the activity
            //  at the top of the stack (ie: the last state of this task)
            // Don't need to finish it again since it's finished in super.onCreate .
            Log.d(LOG_TAG,"原生AppActivity 初始化日志之前  !isTaskRoot() 跪了");
            return;
        }
        // DO OTHER INITIALIZATION BELOW
        getWindow().setFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON, WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        sContext = getApplicationContext();
        app = this;

        Log.d(LOG_TAG,"原生AppActivity 初始化日志");
      
        //初始化地图
        EasyThirdParty.getInstance().init(this);
        mUpdateManager = new UpdateManager(this);
        batteryChangedReceiver=new BatteryChangedReceiver();
        IntentFilter intentFilter=getFilter();
        registerReceiver(batteryChangedReceiver,intentFilter);

        //timer to poll
        /*TimerTask task = new TimerTask() {
            public void run() {
                Message message = new Message();
                message.what = 1;
                handler.sendMessage(message);
            }
        };

        Timer timer = new Timer(true);
        timer.schedule(task, 500, 500);*/

        initHandler();
        Toast.makeText(AppActivity.sContext, "正在启动游戏,请稍候..." ,Toast.LENGTH_SHORT ).show();
    }
    ///获取IntentFilter对象
    private IntentFilter getFilter() {
        IntentFilter filter = new IntentFilter();
        filter.addAction(Intent.ACTION_BATTERY_CHANGED);
        filter.addAction(Intent.ACTION_BATTERY_OKAY);
        return filter;
    }

    public class BatteryChangedReceiver extends BroadcastReceiver {
        @Override
        public void onReceive(Context context, Intent intent) {
            // 电池当前的电量, 它介于0和 EXTRA_SCALE之间
            float lv = intent.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
            if(lv > 0)  mBatLv = lv/intent.getIntExtra(BatteryManager.EXTRA_SCALE, -1);
        
            //充电
            //boolean status = intent.getIntExtra(BatteryManager.EXTRA_STATUS, -1) == BatteryManager.BATTERY_STATUS_CHARGING;  
        }
    }

  
    @Override
    public Cocos2dxGLSurfaceView onCreateView() {
        Cocos2dxGLSurfaceView glSurfaceView = new Cocos2dxGLSurfaceView(this);
        // TestCpp should create stencil buffer
        glSurfaceView.setEGLConfigChooser(5, 6, 5, 0, 16, 8);

      //  SDKWrapper.getInstance().setGLSurfaceView(glSurfaceView);
        return glSurfaceView;
    }
    public static String GetBatteryLv() {
        return String.valueOf(mBatLv);
    }

    public static void getAddress()
    {
		if(!AppActivity.app._isGpsOPen()) {
			app.runOnGLThread(new Runnable() {
				@Override
				public void run() {
					Cocos2dxJavascriptJavaBridge.evalString("CallOpenGPS("+0+")");
				}
			});
		}
        if(!AppActivity.requestPermission(301)) return;
        AppActivity.app._getAddress(false);
    }

    public static void getAddressInLobby()
    {
		if(!AppActivity.app._isGpsOPen()) {
			app.runOnGLThread(new Runnable() {
				@Override
				public void run() {
					Cocos2dxJavascriptJavaBridge.evalString("CallOpenGPS("+1+")");
				}
			});
		}
        if(!AppActivity.requestPermission(300)) return;
        AppActivity.app._getAddress(true);
    }

    public boolean _isGpsOPen() {
        LocationManager locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        // 通过GPS卫星定位，定位级别可以精确到街（通过24颗卫星定位，在室外和空旷的地方定位准确、速度快）
        boolean bOpen = locationManager.isProviderEnabled(LocationManager.GPS_PROVIDER);
        return bOpen;
    }
	
    public void _getAddress (boolean bInLobby)
    {
        if(bInLobby) {
            EasyThirdParty.getInstance().requestLocation(new EasyThirdParty.OnLocationCallBack() {
                @Override
                public void onLocationResult(boolean bSuccess, int errorCode,final String backMsg) {

                    app.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge.evalString("CallLobbyFunc('UpdateGPS','"+backMsg+"')");
                        }
                    });
                    Log.d(LOG_TAG,"定位"+bSuccess + "\n" + errorCode + "\n" + backMsg);
                }
            });
        } else {
            EasyThirdParty.getInstance().requestLocation(new EasyThirdParty.OnLocationCallBack() {
                @Override
                public void onLocationResult(boolean bSuccess, int errorCode,final String backMsg) {
                    app.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge.evalString("CallTableFunc('UpdateGPS','"+backMsg+"')");
                        }
                    });
                    Log.d(LOG_TAG,"定位"+bSuccess + "\n" + errorCode + "\n" + backMsg);
                }
            });
        }
    }

	public static String StringFilter(String str) throws PatternSyntaxException { 
        String temp = (str.replaceAll("\"", "").replaceAll("\\\\", ""));
        return temp;
	} 
    //微信登录
    public static void sendWXLogin()
    {
        new Thread(new Runnable() {
   		    public void run() { 
                Looper.prepare();
                Toast.makeText(AppActivity.sContext, "正在请求微信登录,请稍候...",Toast.LENGTH_SHORT ).show();

			    EasyThirdParty.getInstance().login(SHARE_MEDIA.WEIXIN, new UMAuthListener() {
                @Override
                public void onStart(SHARE_MEDIA share_media) {

                }

                @Override
                public void onComplete(SHARE_MEDIA share_media, int i, Map<String, String> map) {
                    try {
                        final JSONObject jObject = new JSONObject();
                        jObject.put("openid", map.get("openid"));
                        jObject.put("nickname", StringFilter(map.get("name")));
                        jObject.put("sex",  map.get("gender"));
                        jObject.put("headimgurl",  map.get("profile_image_url"));
                       // strLogin = jObject.toString();
                        Toast.makeText(AppActivity.sContext, "授权成功", Toast.LENGTH_SHORT).show();

                        app.runOnGLThread(new Runnable() {
                            @Override
                            public void run() {
                                Cocos2dxJavascriptJavaBridge.evalString("CallLoginFunc('onWXCode','"+jObject.toString()+"')");
                            }
                        });
                    } catch (JSONException e) {
                        e.printStackTrace();
                    }
                }
               
                    //返回信息如下
        //  E/unionid:
        //  E/screen_name:           
        //  E/accessToken: 13_G3bOK8xC8N16zIiKzpAmkmZAjXsDgUwsrsiNXDMps3h5GIwz4Euf-jjLORkr50zGlcko5DbOU2KlFqmMqx1NaLW-hydsxnSj_35S9GTO5l8
        //  E/refreshToken: 13_EzEYPovD5_8Hhk4pbpMXIO-ww4mkSDKrzkMYefhHmbDOCQA-4rj3chQHoT6ER1FmWjzjvMcx4TayJfBmCgi4vReYO41fgbpNh1UxklAS_vo
        //  E/gender: 0
        //  E/openid:
        //  E/profile_image_url: http://thirdwx.qlogo.cn/mmopen/vi_32/nrYibkhtIpScnZJNH039Y3ujpmDDMHjnz9kuzuzvYltPaGjpiaAG1tdxlRznW9lMfbVkzk2UJzEERr2JTfRoe3pg/132
        //  E/access_token: 13_G3bOK8xC8N16zIiKzpAmkmZAjXsDgUwsrsiNXDMps3h5GIwz4Euf-jjLORkr50zGlcko5DbOU2KlFqmMqx1NaLW-hydsxnSj_35S9GTO5l8
        //  E/iconurl: http://thirdwx.qlogo.cn/mmopen/vi_32/nrYibkhtIpScnZJNH039Y3ujpmDDMHjnz9kuzuzvYltPaGjpiaAG1tdxlRznW9lMfbVkzk2UJzEERr2JTfRoe3pg/132
        //  E/name:           
        //  E/uid:
        //  E/expiration: 1536637954286
        //  E/language: zh_CN
        //  E/expires_in: 1536637954286
        //  E/AndroidRuntime: FATAL EXCEPTION: main
                   

                    @Override
                    public void onError(SHARE_MEDIA share_media, int i, Throwable throwable) {
                        Toast.makeText(AppActivity.sContext, "未知的操作", Toast.LENGTH_SHORT).show();
                        app.runOnGLThread(new Runnable() {
                            @Override
                            public void run() {
                                Cocos2dxJavascriptJavaBridge.evalString("CallLoginFunc('onWXCode','')");
                            }
                        });
                    }

                    @Override
                    public void onCancel(SHARE_MEDIA share_media, int i) {
                        Toast.makeText(AppActivity.sContext, "取消微信登陆", Toast.LENGTH_SHORT).show();
                        app.runOnGLThread(new Runnable() {
                            @Override
                            public void run() {
                                Cocos2dxJavascriptJavaBridge.evalString("CallLoginFunc('onWXCode','')");
                            }
                        });
                    }
                }); 
	   		    Looper.loop();
   		    }  
   		}).start();
    }
   
    //微信分享
    public static void WXShareTex(final String path,final String IsTimeLine)
    { 
        Bitmap bmp = null;
        if(path.startsWith("http")){
            try{
                bmp = BitmapFactory.decodeStream(new URL(path).openStream());
            } catch(Exception e) {
                e.printStackTrace();
            }
        }else{
            bmp = BitmapFactory.decodeFile(path);
        }
        
        EasyThirdParty.getInstance().shareImage(IsTimeLine.equals("1")?SHARE_MEDIA.WEIXIN_CIRCLE:SHARE_MEDIA.WEIXIN, "", bmp, new UMShareListener() {
            @Override
            public void onStart(SHARE_MEDIA share_media) {
                Toast.makeText(AppActivity.sContext, "微信分享图片中" ,Toast.LENGTH_SHORT ).show();
            }
    
            @Override
            public void onResult(SHARE_MEDIA share_media) {
                Toast.makeText(AppActivity.sContext, "微信分享图片完成" ,Toast.LENGTH_SHORT ).show();
                if( IsTimeLine.equals("1")){
                    app.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge.evalString("CallLobbyFunc('CheckShareFunc','')");
                        }
                    });
                }
            }
    
            @Override
            public void onError(SHARE_MEDIA share_media, Throwable throwable) {
                Toast.makeText(AppActivity.sContext, "微信分享图片异常" ,Toast.LENGTH_SHORT ).show();
            }
    
            @Override
            public void onCancel(SHARE_MEDIA share_media) {
                Toast.makeText(AppActivity.sContext, "微信分享图片取消" ,Toast.LENGTH_SHORT ).show();
            }
        });
    }

    //微信分享
    public static void WXShare(final String szTitle,final String szDesrc,final String szRedirectUrl,final String IsTimeLine)
    {                 
        EasyThirdParty.getInstance().shareUrl(IsTimeLine.equals("1")?SHARE_MEDIA.WEIXIN_CIRCLE:SHARE_MEDIA.WEIXIN, 
            szTitle, szDesrc,szRedirectUrl, com.sy.mingju.R.mipmap.ic_launcher, new UMShareListener() {
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
        });
    }
    //打开url
    public static void OpenUrl(final String url)
    {                 
		Intent intent = new Intent();
		intent.setAction("android.intent.action.VIEW");
		Uri content_url = Uri.parse(url);
		intent.setData(content_url);
		app.startActivity(intent);
    }

    
    public static AppActivity getIstance() {
        AppActivity activityObj = null;

        if (activityObj == null){// 有些手机需要通过自定义目录
            activityObj = new AppActivity();
        }

        return activityObj;
    }

    public static void updateVerion(final String url, final String apkName, final String ver){
  		new Thread(new Runnable() { 
  		  public void run() { 
  		    Looper.prepare(); 
  		        mUpdateManager.checkUpdateInfo(url, apkName, ver);
  		    Looper.loop();
  		  } 
  		}).start(); 
  	}
	public static void OnUpdateProgress(final int progress)
	{
		app.runOnGLThread(new Runnable() {
			@Override
			public void run() {
				Cocos2dxJavascriptJavaBridge.evalString("CallUpdateProgress('"+progress+"')");
			}
		});
	}
	
    public static void GameClose(){
        System.exit(0);
    }
    public static void CopyClipper(final String str){
        new Thread(new Runnable() { 
  		   
  		  public void run() { 
            Looper.prepare(); 
  		        ClipboardManager cm = (ClipboardManager) AppActivity.app.getSystemService(AppActivity.sContext.CLIPBOARD_SERVICE);
                // 将文本内容放到系统剪贴板里。
                cm.setText(str);
                //Toast.makeText(AppActivity.sContext, "复制成功!!!" ,Toast.LENGTH_SHORT ).show();
            Looper.loop();
  		  } 
  		}).start(); 
    }

    public static boolean requestPermission(int requestCode) {
        switch (requestCode) {
            case 100:
            case 101:
            {
                if (ContextCompat.checkSelfPermission(AppActivity.app, android.Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(AppActivity.app, new String[]{android.Manifest.permission.WRITE_EXTERNAL_STORAGE}, requestCode);
                    return false;
                } else {
                    return true;
                }
            }
            case 200:
            {
                if (ContextCompat.checkSelfPermission(AppActivity.app, android.Manifest.permission.RECORD_AUDIO) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(AppActivity.app, new String[]{android.Manifest.permission.RECORD_AUDIO}, requestCode);
                    return false;
                } else {
                    return true;
                }
            }
            case 300:
            case 301:
            {
                if (ActivityCompat.checkSelfPermission(AppActivity.app, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED){
                    ActivityCompat.requestPermissions(AppActivity.app, new String[]{Manifest.permission.ACCESS_COARSE_LOCATION}, requestCode);
                    return false;
                }else{
                    return true;
                }
            }
        }

        return true;
    }
	
    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        switch (requestCode) {
			case 100:
            case 101:
            {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED){
                    Toast.makeText(AppActivity.sContext, "获取到存储权限", Toast.LENGTH_SHORT).show();
                    if(requestCode == 101) {
                        new Thread(new Runnable() {
                            public void run() {
                                Looper.prepare();
                                mUpdateManager.RecheckUpdateInfo();
                                Looper.loop();
                            }
                        }).start();
                    }
                } else {
                    Toast.makeText(AppActivity.sContext, "用户拒绝了存储权限", Toast.LENGTH_SHORT).show();
                }
                break;
            }
            case 200:
            {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(AppActivity.sContext, "获取到语音权限", Toast.LENGTH_SHORT).show();
                } else{
                    Toast.makeText(AppActivity.sContext, "用户拒绝了语音权限", Toast.LENGTH_SHORT).show();
                }
                break;
            }
            case 300:
            case 301:
            {
                if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                    Toast.makeText(AppActivity.sContext, "获取到定位权限", Toast.LENGTH_SHORT).show();
                    _getAddress(requestCode == 300 ? true : false);
                } else{
                    Toast.makeText(AppActivity.sContext, "用户拒绝了定位权限", Toast.LENGTH_SHORT).show();
                }
                break;
            }
        }
    }

    private static boolean isWifi() {  
        ConnectivityManager connectivityManager = (ConnectivityManager) AppActivity.sContext  
                .getSystemService(Context.CONNECTIVITY_SERVICE);  
        NetworkInfo activeNetInfo = connectivityManager.getActiveNetworkInfo();  
        if (activeNetInfo != null  && activeNetInfo.getType() == ConnectivityManager.TYPE_WIFI) {  
            return true;  
        }  
        return false;  
    } 

    public boolean dispatchKeyEvent(KeyEvent event) {
        if (event.getKeyCode()==KeyEvent.KEYCODE_BACK) {
            app.runOnGLThread(new Runnable() {
                @Override
                public void run() {
                    Cocos2dxJavascriptJavaBridge.evalString("CallSystemBack()");
                }
            });
            return true;
        }
        return super.dispatchKeyEvent(event);
    }

    @Override
    protected void onResume() {
        super.onResume();
        // SDKWrapper.getInstance().onResume();
    }

    @Override
    protected void onPause() {
        super.onPause();
        // SDKWrapper.getInstance().onPause();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        // SDKWrapper.getInstance().onDestroy();
        unregisterReceiver(batteryChangedReceiver);
    }

    //@Override
    //protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    //    super.onActivityResult(requestCode, resultCode, data);
    // SDKWrapper.getInstance().onActivityResult(requestCode, resultCode, data);
    //}

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        //  SDKWrapper.getInstance().onNewIntent(intent);
    }

    @Override
    protected void onRestart() {
        super.onRestart();
        // SDKWrapper.getInstance().onRestart();
    }

    @Override
    protected void onStop() {
        super.onStop();
        // SDKWrapper.getInstance().onStop();
    }
        
    @Override
    public void onBackPressed() {
        //  SDKWrapper.getInstance().onBackPressed();
        super.onBackPressed();
    }

    @Override
    public void onConfigurationChanged(Configuration newConfig) {
        //    SDKWrapper.getInstance().onConfigurationChanged(newConfig);
        super.onConfigurationChanged(newConfig);
    }

    @Override
    protected void onRestoreInstanceState(Bundle savedInstanceState) {
        //   SDKWrapper.getInstance().onRestoreInstanceState(savedInstanceState);
        super.onRestoreInstanceState(savedInstanceState);
    }

    @Override
    protected void onSaveInstanceState(Bundle outState) {
        //    SDKWrapper.getInstance().onSaveInstanceState(outState);
        super.onSaveInstanceState(outState);
    }

    @Override
    protected void onStart() {
        //  SDKWrapper.getInstance().onStart();
        super.onStart();
    }

    //////////////////////////////////////////////////////////////////////////////

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (RESULT_OK == resultCode) {
            switch (requestCode) {
                case Constants.RES_PICKIMG_END: {
                    photoClip((Uri) data.getData());
                }
                break;
                case Constants.RES_CLIPEIMG_END: {
                    photoClipEnd(data.getExtras());
                }
                break;
                case Constants.RES_PICKIMG_END_NOCLIP: {
                    photoPickEnd((Uri) data.getData());
                }
                break;
                default:
                    break;
            }
        }
        super.onActivityResult(requestCode, resultCode, data);
        //ThirdParty.getInstance().onActivityResult(requestCode, resultCode, data);
    }


    public void sendMessage(int what) {
        Message msgMessage = Message.obtain();
        msgMessage.what = what;

        m_hHandler.sendMessage(msgMessage);
    }

    public void sendMessageWith(Message msg) {
        m_hHandler.sendMessage(msg);
    }

    public void sendMessageWithObj(int what, Object obj) {
        Message msgMessage = Message.obtain();
        msgMessage.what = what;
        msgMessage.obj = obj;

        m_hHandler.sendMessage(msgMessage);
    }

    private void initHandler() {
        m_hHandler = new Handler() {
            @Override
            public void handleMessage(Message msg) {
                switch (msg.what) {
                    case Constants.MSG_START_PICKIMG: {
                        strUpLoadUrl = (String) msg.obj;
                        Intent intent = new Intent(Intent.ACTION_PICK, null);
                        intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
                        startActivityForResult(intent, Constants.RES_PICKIMG_END);
                    }
                    break;
                    case Constants.MSG_PICKIMG_END: {
                        final String path = (String) msg.obj;
						
                        File file = new File(path);
                        new RequestHandler().request(strUpLoadUrl, file, file.getName(), new RequestHandler.OnUpLoadImageLister() {
                            @Override
                            public void onSucess(String s) {
                                //todo 成功
                                //iv.setImageBitmap(bitmap);
                                Log.i(LOG_TAG, "onSucess: ");
                            }

                            @Override
                            public void onFail(Exception s) {
                                //todo 失败
                                Log.i(LOG_TAG, "onFail: "+s);
                            }
                        });
                        //toLuaFunC(app.m_nPickImgCallFunC, path);
                    }
                    break;
                    case Constants.MSG_START_PICKIMG_NOCLIP: {
                        strUpLoadUrl = (String) msg.obj;
                        Intent intent = new Intent(Intent.ACTION_PICK, null);
                        intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
                        startActivityForResult(intent, Constants.RES_PICKIMG_END_NOCLIP);
                    }
                    break;

                    case Constants.MSG_OPEN_BROWSER: {
                        String url = (String) msg.obj;
                        if (url != "") {
                            Intent intent = new Intent();
                            intent.setAction("android.intent.action.VIEW");
                            Uri content_url = Uri.parse(url);
                            intent.setData(content_url);
                            startActivity(intent);
                        }
                    }
                    break;
                    case Constants.MSG_COPY_CLIPBOARD: {
                        String str = (String) msg.obj;
                        ClipboardManager myClipboard = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                        myClipboard.setText(str);
                    }
                    break;
                    default:
                        break;
                }
            }
        };
    }

    //图片裁剪
    private void photoClip(Uri uri) {
        Log.v("photo", "clip start");
        Intent intent = new Intent("com.android.camera.action.CROP");
        intent.setDataAndType(uri, "image/*");
        intent.putExtra("crop", "true");
        intent.putExtra("aspectX", 1);
        intent.putExtra("aspectY", 1);
        intent.putExtra("outputX", 96);
        intent.putExtra("outputY", 96);
        intent.putExtra("return-data", true);
        startActivityForResult(intent, Constants.RES_CLIPEIMG_END);
    }

    private void photoClipEnd(Bundle extras) {
        Log.v("photo", "clip end");
        if (null != extras) {
            Bitmap mBitmap = extras.getParcelable("data");
            try {
                String imgName = "/@ci_" + this.getPackageName() + ".png";
                String savePath = this.getFilesDir().getPath();
                String path = savePath + imgName;

                File myCaptureFile = new File(savePath, imgName);
                BufferedOutputStream bos = new BufferedOutputStream(
                        new FileOutputStream(myCaptureFile));
                mBitmap.compress(Bitmap.CompressFormat.PNG, 100, bos);
                bos.flush();
                bos.close();

                sendMessageWithObj(Constants.MSG_PICKIMG_END, path);
            } catch (Exception e) {
                e.printStackTrace();
                Log.e("Head", "保存头像错误");
            }
        }
    }
	
    /**
     * 通过Uri返回File文件
     * 注意：通过相机的是类似content://media/external/images/media/97596
     * 通过相册选择的：file:///storage/sdcard0/DCIM/Camera/IMG_20150423_161955.jpg
     * 通过查询获取实际的地址
     *
     * @param uri s
     * @return s
     */
    @SuppressWarnings("ConstantConditions")
    public File getFileByUri(Uri uri) {
        String path = null;
        if ("file".equals(uri.getScheme())) {
            path = uri.getEncodedPath();
            if (path != null) {
                path = Uri.decode(path);
                ContentResolver cr = getContentResolver();
                Cursor cur = cr.query(MediaStore.Images.Media.EXTERNAL_CONTENT_URI,
                        new String[]{MediaStore.Images.ImageColumns._ID, MediaStore.Images.ImageColumns.DATA},
                        "(" + MediaStore.Images.ImageColumns.DATA + "=" + "'" + path + "'" + ")",
                        null, null);
                int index = 0;
                int dataIdx;
                for (cur.moveToFirst(); !cur.isAfterLast(); cur.moveToNext()) {
                    index = cur.getColumnIndex(MediaStore.Images.ImageColumns._ID);
                    index = cur.getInt(index);
                    dataIdx = cur.getColumnIndex(MediaStore.Images.ImageColumns.DATA);
                    path = cur.getString(dataIdx);
                }
                cur.close();
                if (index != 0) {
                    Uri u = Uri.parse("content://media/external/images/media/" + index);
                    System.out.println("temp uri is :" + u);
                }
            }
            if (path != null) {
                return new File(path);
            }
        } else if ("content".equals(uri.getScheme())) {
            // 4.2.2以后
            String[] proj = {MediaStore.Images.Media.DATA};
            Cursor cursor = getContentResolver().query(uri, proj, null, null, null);
            if (cursor.moveToFirst()) {
                int columnIndex = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
                path = cursor.getString(columnIndex);
            }
            cursor.close();

            return new File(path);
        } else {
            Log.i("getFileByUri", "Uri Scheme:" + uri.getScheme());
        }
        return null;
    }

    //图片选择
    private void photoPickEnd(Uri uri) {
        String[] proj = {MediaStore.Images.Media.DATA};
        Cursor cursor = managedQuery(uri, proj, null, null, null);
        int column_index = cursor.getColumnIndexOrThrow(MediaStore.Images.Media.DATA);
        cursor.moveToFirst();
        String path = cursor.getString(column_index);
        Log.i("path", path);
			
        onPhotoPickEndResult(path);
		
		String url = "http://192.168.0.234:10004/uploadImg.php";
		File file = getFileByUri(uri);
		new RequestHandler().request(strUpLoadUrl, file, file.getName(), new RequestHandler.OnUpLoadImageLister() {
            @Override
            public void onSucess(String s) {
                //todo 成功
                //iv.setImageBitmap(bitmap);
                Log.d(LOG_TAG, "onSucess: ");
				app.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						Cocos2dxJavascriptJavaBridge.evalString("CallUploadSuccess();");
					}
				});
            }

            @Override
            public void onFail(Exception s) {
                //todo 失败
                Log.d(LOG_TAG, "onFail: "+s);
				app.runOnGLThread(new Runnable() {
					@Override
					public void run() {
						Cocos2dxJavascriptJavaBridge.evalString("CallUploadFaild();");
					}
				});
            }
        });
    }

    private void onPhotoPickEndResult(final String szPath)
    {
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                Cocos2dxJavascriptJavaBridge.evalString("CallLobbyFunc('OnPhotoPickEnd','" + szPath + "');");
            }
        });
    }
    //
    public static void pickImg(final String strUrl, final String szNeedChip) {
        if(!AppActivity.requestPermission(100)) return;
        if (szNeedChip.equals("1"))
        {
            app.sendMessageWithObj(Constants.MSG_START_PICKIMG, strUrl);
        }
        else
        {
            app.sendMessageWithObj(Constants.MSG_START_PICKIMG_NOCLIP, strUrl);
        }
    }

    ////////////////////////////////////////////////////////////////////////////////
	
    public static Bitmap compressImage(Bitmap image) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        image.compress(Bitmap.CompressFormat.JPEG, 50, baos);//质量压缩方法，这里100表示不压缩，把压缩后的数据存放到baos中
        int options = 40;
        while (baos.toByteArray().length / 1024 > 32) {  //循环判断如果压缩后图片是否大于100kb,大于继续压缩
            baos.reset();//重置baos即清空baos
            image.compress(Bitmap.CompressFormat.JPEG, options, baos);//这里压缩options%，把压缩后的数据存放到baos中
            options -= 10;//每次都减少10
        }
        ByteArrayInputStream isBm = new ByteArrayInputStream(baos.toByteArray());//把压缩后的数据baos存放到ByteArrayInputStream中
        Bitmap bitmap = BitmapFactory.decodeStream(isBm, null, null);//把ByteArrayInputStream数据生成图片
        return bitmap;
    }

    public static Bitmap getimage(String srcPath) {
        BitmapFactory.Options newOpts = new BitmapFactory.Options();
        //开始读入图片，此时把options.inJustDecodeBounds 设回true了
        newOpts.inJustDecodeBounds = true;
        Bitmap bitmap = BitmapFactory.decodeFile(srcPath, newOpts);//此时返回bm为空

        newOpts.inJustDecodeBounds = false;
        //newOpts.outWidth = 1024;
        //newOpts.outHeight = 576;
        //现在主流手机比较多是800*480分辨率，所以高和宽我们设置为
        //float hh = 512f;//这里设置高度为800f
        //float ww = 288f;//这里设置宽度为480f
        //缩放比。由于是固定比例缩放，只用高或者宽其中一个数据进行计算即可
        // int be = 1;//be=1表示不缩放
        // if (w > h && w > ww) {//如果宽度大的话根据宽度固定大小缩放
        //     be = (int) (newOpts.outWidth / ww);
        // } else if (w < h && h > hh) {//如果高度高的话根据宽度固定大小缩放
        //    be = (int) (newOpts.outHeight / hh);
        // }
        //if (be <= 0)
        //be = 1;
        newOpts.inSampleSize = 2;//设置缩放比例
        //重新读入图片，注意此时已经把options.inJustDecodeBounds 设回false了
        bitmap = BitmapFactory.decodeFile(srcPath, newOpts);
        return AppActivity.compressImage(bitmap);//压缩好比例大小后再进行质量压缩
    }

    public static String buildTransaction(final String type) {
        return (type == null) ? String.valueOf(System.currentTimeMillis()) : type + System.currentTimeMillis();
    }

    public byte[] getWXShareThumbImage_ByAppIcon() {
        Bitmap bmp = BitmapFactory.decodeResource(sContext.getResources(), com.sy.mingju.R.mipmap.ic_launcher);
        Bitmap thumbBmp = Bitmap.createScaledBitmap(bmp, THUMB_SIZE, THUMB_SIZE, true);
        bmp.recycle();
        return Util.bmpToByteArray(thumbBmp, true);
    }

    public static void changeOrientation(final int type)
    {
        app.runOnGLThread(new Runnable() {
            @Override
            public void run() {
                if (type == 1)
                {
                    app.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);
                }
                else
                {
                    app.setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
                }
            }
        });
    }
}
