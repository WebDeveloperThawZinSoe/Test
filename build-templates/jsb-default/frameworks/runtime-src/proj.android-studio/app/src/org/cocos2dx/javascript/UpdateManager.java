package org.cocos2dx.javascript;


import java.io.File;  
import java.io.FileOutputStream;  
import java.io.IOException;  
import java.io.InputStream;  
import java.net.HttpURLConnection;  
import java.net.MalformedURLException;  
import java.net.URL; 
import android.app.AlertDialog;  
import android.app.Dialog;  
import android.app.AlertDialog.Builder;
import android.content.ActivityNotFoundException;
import android.content.Context;
import android.content.DialogInterface;  
import android.content.Intent;  
import android.content.DialogInterface.OnClickListener;  
import android.net.Uri;
import android.os.Build;
import android.os.Handler;
import android.os.Message;
import android.support.v4.content.FileProvider;
import android.view.LayoutInflater;
import android.view.View;  
import android.widget.ProgressBar;  

public class UpdateManager {  
	private Context mContext;  

	//提示语 
	private String updateMsg = "有最新的软件包哦，亲快下载吧~,下载后才能登陆哦~";  
	
	//返回的安装包url  
	private String _ServerUrl = "http://222.186.34.204:8080/hot-update/";
	private String _gameName = "hyhy.apk";
	private String _apkUrl = _ServerUrl + _gameName;
	private Dialog noticeDialog; 
	private Dialog noSDCardDialog; 
	private Dialog downloadDialog;

	/* 下载包安装路径 */
	private static final String _savePath = "/sdcard/com.sy.mingju";
	private String _saveFileName = _savePath + "/" + _gameName;

	/* 进度条与通知ui刷新的handler和msg常量 */
	private ProgressBar mProgress;
	private static final int DOWN_UPDATE = 1;
	private static final int DOWN_OVER = 2;
	private int progress;
	private Thread downLoadThread;
	private boolean interceptFlag = false;
	private Handler mHandler = new Handler(){
		public void handleMessage(Message msg) {
			switch (msg.what) {
				case DOWN_UPDATE:
					//mProgress.setProgress(progress);
					AppActivity.OnUpdateProgress(progress);
					
					break;
				case DOWN_OVER:
					AppActivity.OnUpdateProgress(100);
					installApk();
					break;
				default:
					break;
			}
		};
	};

	public UpdateManager(Context context) {
		this.mContext = context;
	}

	//外部接口让主Activity调用
	public void checkUpdateInfo(final String url, final String apkName, final String ver){
		this._ServerUrl = url;
		this._gameName = apkName;
		this._apkUrl = this._ServerUrl + this._gameName;
		this._saveFileName = this._savePath + "/" + this._gameName;
		if (!AppActivity.requestPermission(101)) return;
		
		// showNoticeDialog();
		downloadApk();
	}
	
	//外部接口让主Activity调用
	public void RecheckUpdateInfo(){
		downloadApk();
		//showNoticeDialog();
	}
	
	private void showNoticeDialog(){
		AlertDialog.Builder builder = new Builder(mContext);
		builder.setTitle("游戏更新");
		builder.setMessage(updateMsg);
		builder.setPositiveButton("立即下载", new OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				dialog.dismiss();
				showDownloadDialog();
			}
		});
		builder.setNegativeButton("退出", new OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				dialog.dismiss();
				System.exit(0);
			}
		});
		noticeDialog = builder.create();
		noticeDialog.show();
	}
	
	private void showNoSDCardDialog(){
		AlertDialog.Builder builder = new Builder(mContext);
		builder.setTitle("没有安装SD卡");
		builder.setMessage("没有安装SD卡");
		builder.setPositiveButton("确定", new OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				dialog.dismiss();
			}
		});
		noSDCardDialog = builder.create();
		noSDCardDialog.show();
	}
	
	private void showDownloadDialog(){
		if (android.os.Environment.getExternalStorageState().equals(android.os.Environment.MEDIA_MOUNTED)==false)
		{
			showNoSDCardDialog();
			return;
		}
		AlertDialog.Builder builder = new Builder(mContext);
		builder.setTitle("更新中,请稍候...");
		
		final LayoutInflater inflater = LayoutInflater.from(mContext);
		View v = inflater.inflate(com.sy.mingju.R.layout.progress, null);
		mProgress = (ProgressBar)v.findViewById(com.sy.mingju.R.id.progress);
		builder.setView(v);
		/*
		builder.setNegativeButton("取消", new OnClickListener() {
			public void onClick(DialogInterface dialog, int which) {
				dialog.dismiss();
				interceptFlag = true;
			}
		});
		*/
		
		downloadDialog = builder.create();
		downloadDialog.show();
		downloadApk();
	}

	private Runnable mdownApkRunnable = new Runnable() {
		public void run() {
			try {
				URL url = new URL(_apkUrl+"?r="+System.nanoTime());
				HttpURLConnection conn = (HttpURLConnection)url.openConnection();
				conn.connect();
				int length = conn.getContentLength();
				InputStream is = conn.getInputStream();

				File file = new File(_savePath);
				if(!file.exists()){
					file.mkdir();
				}
				String apkFile = _saveFileName;
				File ApkFile = new File(apkFile);
				FileOutputStream fos = new FileOutputStream(ApkFile);
				int count = 0;
				byte buf[] = new byte[1024];
				do{
					int numread = is.read(buf);
					count += numread;
					progress =(int)(((float)count / length) * 100);
					
					//更新进度
					mHandler.sendEmptyMessage(DOWN_UPDATE);
					if(numread <= 0){
						//下载完成通知安装
						mHandler.sendEmptyMessage(DOWN_OVER);
						break;
					}
					fos.write(buf,0,numread);
				}while(!interceptFlag);//点击取消就停止下载.
				
				fos.close();
				is.close();
			} catch (MalformedURLException e) {
				e.printStackTrace();
			} catch(IOException e){
				e.printStackTrace();
			}
		}
	};
	
	/**
	 * 下载apk
	 * @param url
	 */
	private void downloadApk(){
		downLoadThread = new Thread(mdownApkRunnable);
		downLoadThread.start();
	}
	
	
	
	private static Uri getUriForFile(Context context, File file) {
		if (context == null || file == null) {
			throw new NullPointerException();
		}
		Uri uri;
		if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) {
			uri = FileProvider.getUriForFile(context, "com.sy.mingju.fileProvider", file);
		} else {
			uri = Uri.fromFile(file);
		}
		return uri;
	}

	/**
	 * 安装apk
	 */
	private void installApk(){
		try {
			File apkfile = new File(_saveFileName);
			if (!apkfile.exists()) {
				return;
			}
			Intent intent = new Intent(Intent.ACTION_VIEW);
			intent.setFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
			if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.N) intent.addFlags(Intent.FLAG_GRANT_READ_URI_PERMISSION);
			intent.setDataAndType(getUriForFile(mContext,apkfile), "application/vnd.android.package-archive");
			mContext.startActivity(intent);
		}catch (ActivityNotFoundException e){
			//Log.i("error", "installApkFailed: "+e);
		}
	}

} 

