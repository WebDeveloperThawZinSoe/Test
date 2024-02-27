package org.cocos2dx.javascript;

import android.annotation.SuppressLint;
import android.os.Handler;
import android.os.Message;
import android.util.Log;

import java.io.BufferedReader;
import java.io.DataOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;

import org.json.JSONObject;
import org.json.JSONException;
import java.util.Iterator;

@SuppressWarnings({"StringBufferReplaceableByString", "StringBufferMayBeStringBuilder", "unused"})
public class RequestHandler {

    private OnUpLoadImageLister _onUpLoadImageLister;


    /**
     * @param urlstr              上传地址
     * @param file                上传文件
     * @param fileName            文件名称
     * @param _onUpLoadImageLister 方法回调
     */
    public void request(final String urlstr, final File file, final String fileName, OnUpLoadImageLister onUpLoadImageLister) {
		this._onUpLoadImageLister = onUpLoadImageLister;
        new Thread(new Runnable() {
            @Override
            public void run() {
                upLoad(urlstr, fileName, file);
            }
        }).start();
    }

    @SuppressLint("HandlerLeak")
    private Handler handler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            super.handleMessage(msg);
            if (msg.arg1 == 200) {
                _onUpLoadImageLister.onSucess((String) msg.obj);
            } else {
                _onUpLoadImageLister.onFail((Exception) msg.obj);
            }
        }
    };

    @SuppressWarnings("StringConcatenationInsideStringBufferAppend")
    private void upLoad(String strUrl, String filename, File file) {
        Message message = new Message();
        final String newLine = "\r\n";
        final String boundaryPrefix = "--";
        final String boundary = String.format("=========%s", System.currentTimeMillis());
        HttpURLConnection conn = null;
        OutputStream os;
        FileInputStream is;

        String uploadUrl = "";
        try {
            JSONObject  myJson = new JSONObject(strUrl);
            uploadUrl = myJson.getString("URL");
        } catch ( JSONException je) {

        }

        try {
            URL url = new URL(uploadUrl);
            conn = (HttpURLConnection) url.openConnection();
            conn.setReadTimeout(10 * 1000);
            conn.setConnectTimeout(10 * 1000);
            conn.setDoOutput(true);
            conn.setDoInput(true);
            conn.setUseCaches(false);
            conn.setRequestMethod("POST");
            conn.setRequestProperty("connection", "Keep-Alive");
            conn.setRequestProperty("Charsert", "UTF-8");
            conn.setRequestProperty("Content-Type", "multipart/form-data; boundary=" + boundary);
            os = new DataOutputStream(conn.getOutputStream());

            byte[] parameterLine = (boundaryPrefix + boundary + newLine).getBytes();
            os.write(parameterLine);
            String keyValue = "Content-Disposition: form-data; name=\"%s\"\r\n\r\n%s\r\n";
            byte[] keyValueBytes = String.format(keyValue, "filename", filename).getBytes();
            os.write(keyValueBytes);

            try {
                 JSONObject  myJson = new JSONObject(strUrl);
                 Iterator iterator = myJson.keys();
                 while (iterator.hasNext()) {
                     os.write(parameterLine);

                     String szKey = (String) iterator.next();
                     String szValue = myJson.getString(szKey);
                     String strFormat = "Content-Disposition: form-data; name=\"%s\"\r\n\r\n%s\r\n";
                     byte[] szBytes = String.format(strFormat, szKey, szValue).getBytes();
                     os.write(szBytes);
                 }
             } catch ( JSONException je) {

             }

            StringBuilder sb = new StringBuilder();
            sb.append(boundaryPrefix);
            sb.append(boundary);
            sb.append(newLine);
            sb.append("Content-Disposition: form-data;name=\"file\";filename=\"" + filename + "\"" + newLine);
            sb.append("Content-Type:application/octet-stream");
            sb.append(newLine);
            sb.append(newLine);
            os.write(sb.toString().getBytes());
            is = new FileInputStream(file);
            int bufferSize = 1024 * 10;
            byte[] buffer = new byte[bufferSize];
            int length;
            while ((length = is.read(buffer)) != -1) {
                /* 将资料写入DataOutputStream中 */
                os.write(buffer, 0, length);
            }
            os.write(newLine.getBytes());
            byte[] end_data = (newLine + boundaryPrefix + boundary + boundaryPrefix + newLine).getBytes();
            os.write(end_data);
            is.close();
            os.flush();
            os.close();
            StringBuffer sbOutPut = new StringBuffer();
            InputStreamReader isr = new InputStreamReader(conn.getInputStream());
            BufferedReader reader = new BufferedReader(isr);
            String line;
            while ((line = reader.readLine()) != null) {
                sbOutPut.append(line);
            }
            reader.close();
            isr.close();
            message.obj = sbOutPut.toString();
            message.arg1 = 200;
            handler.sendMessage(message);
        } catch (Exception e) {
            e.printStackTrace();
            message.obj = e;
            message.arg1 = 500;
            handler.sendMessage(message);
        } finally {
            if (conn != null)
                conn.disconnect();
        }
    }

    public interface OnUpLoadImageLister {
        void onSucess(String s);
        void onFail(Exception s);
    }
}
