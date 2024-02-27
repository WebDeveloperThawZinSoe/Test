package org.cocos2dx.javascript;

import android.media.AudioManager;
import android.media.MediaPlayer;
import android.media.MediaRecorder;
import android.util.Base64;
import android.widget.Toast;

import org.cocos2dx.lib.Cocos2dxJavascriptJavaBridge;

import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;

import android.util.Log;

public class VoiceCtrl {
    static MediaRecorder mRecorder = null;
    static MediaPlayer mPlayer = null;
    static String mPath = null;
    private static final String LOG_TAG="jswrapper ";
    public static void startRecord() {
        if (!AppActivity.requestPermission(200)) return;
        if (mPath == null) {
            String dir = AppActivity.getContext().getCacheDir().getAbsolutePath();
            File file1 = new File(dir);
            File file2 = new File(file1, "chat.m4a");
            mPath = file2.getAbsolutePath();
        }

        if (mRecorder == null) {
            mRecorder = new MediaRecorder();
            mRecorder.setAudioSource(MediaRecorder.AudioSource.MIC);
            mRecorder.setOutputFormat(MediaRecorder.OutputFormat.MPEG_4);
            mRecorder.setAudioEncoder(MediaRecorder.AudioEncoder.AAC);
            mRecorder.setAudioEncodingBitRate(256);
            mRecorder.setAudioChannels(1);
            mRecorder.setAudioSamplingRate(44100);
            mRecorder.setOutputFile(mPath);
        }
        try {
            mRecorder.prepare();
            mRecorder.start();
        } catch (IllegalStateException e) {
            e.printStackTrace();
        } catch (RuntimeException e) {
            e.printStackTrace();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public static String stopRecord(String data) {
        int i = 0;
        if (mRecorder != null) {
            mRecorder.setOnErrorListener(null);
            mRecorder.setOnInfoListener(null);
            mRecorder.setPreviewDisplay(null);
            try {
                //Thread.sleep(700);
                mRecorder.stop();
                mRecorder.release();
            } catch (IllegalStateException e) {
                e.printStackTrace();
            } catch (RuntimeException e) {
                e.printStackTrace();
            } catch (Exception e) {
                e.printStackTrace();
            }
            if ( data.equals("1") ) i = 1; 
            mRecorder = null;
        }

        if ( i == 0 ) return "";
        return encodeBase64File();
    }
    
    private static String encodeBase64File() {
        String encoded = "";
        try {
            File file = new File(mPath);
            byte[] fileData = new byte[(int) file.length()];
            DataInputStream dis = new DataInputStream(new FileInputStream(file));
            dis.readFully(fileData);
            dis.close();
            encoded = Base64.encodeToString(fileData, Base64.DEFAULT);
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return encoded;
    }

    public static void playVoice(String data) {
        if (mPlayer == null) {
            mPlayer = new MediaPlayer();
            mPlayer.setOnErrorListener(new MediaPlayer.OnErrorListener() {
                @Override
                public boolean onError(MediaPlayer mp, int what, int extra) {
                    Toast.makeText(AppActivity.sContext, "播放异常:what"  + what + " extra:" + extra, Toast.LENGTH_SHORT).show();;
                    mPlayer.reset();
                    return false;
                }
            });
        } else {
            mPlayer.reset();
        }
        String url = "data:audio/mp4;base64," + data;
        try {
            mPlayer.setDataSource(url);
            // mPlayer.setAudioStreamType(AudioManager.STREAM_MUSIC);
            // mPlayer.setVolume(1f, 1f);
            mPlayer.setOnCompletionListener(new MediaPlayer.OnCompletionListener() {
                @Override
                public void onCompletion(MediaPlayer mp) {
                    release();
                    AppActivity.app.runOnGLThread(new Runnable() {
                        @Override
                        public void run() {
                            Cocos2dxJavascriptJavaBridge.evalString("CallTableFunc('OnPlayFinish','1')");
                        }
                    });
                }
            });
            // 通过异步的方式装载媒体资源
            mPlayer.prepareAsync();
            mPlayer.setOnPreparedListener(new MediaPlayer.OnPreparedListener() {
                @Override
                public void onPrepared(MediaPlayer mp) {
                    // 装载完毕回调
                    mPlayer.start();
                }
            });
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private static void release() {
        if (mPlayer != null) {
            mPlayer.stop();
            mPlayer.release();
            mPlayer = null;
        }
        if (mRecorder != null) {
            mRecorder.release();
            mRecorder = null;
        }
    }
}
