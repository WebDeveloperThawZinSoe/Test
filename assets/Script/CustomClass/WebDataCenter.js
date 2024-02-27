WebDataCenter = cc.Class({
    ctor:function  () {
        this.m_LinkCount = 0;
        this.m_WaitLinkArr = new Array();
        this.m_DataMap = new Object();
    },
    //保存数据结构
    GetDataObj:function(Url, NewData) {
        if( this.m_DataMap[Url] == null)  this.m_DataMap[Url] = new Object();
        this.m_DataMap[Url].Time = new Date().getTime();
        this.m_DataMap[Url].Data = NewData;
    },
    SetDataOutTime:function(KeyWord) {
        for(var i in this.m_DataMap){
            if( i.indexOf(KeyWord) >= 0 ) this.m_DataMap[i].Time = 0;
        }
    },
    //OutTime :null无需保存数据
    GetData:function(WebUrl, OutTime, CallBack) {
        var Now = new Date().getTime();

        //不保存，无旧数据，或旧数据过期 需要重新加载
        if(OutTime == null || this.m_DataMap[WebUrl] == null || this.m_DataMap[WebUrl].Time + OutTime*1000 < Now){
            //正在连接达到上限
            if( this.m_LinkCount >= 10) this.m_WaitLinkArr.push([WebUrl,OutTime,CallBack]);
            else this.LinkWeb([WebUrl, OutTime, CallBack]);
        }else{
            //已有数据
            if(window.LOG_WEB_DATA)console.log("HttpLink "+WebUrl)
            if(window.LOG_WEB_DATA)console.log("HttpReq "+this.m_DataMap[WebUrl].Data)
            CallBack(this.m_DataMap[WebUrl].Data);
        }
    },

    LinkWeb:function (Arr) {
        try {
            this.httpGets(Arr[0], function (data) {
                //保存数据
                if(Arr[1] != null) this.GetDataObj(Arr[0], data);
                //完成回调
                Arr[2](data);
                //队列执行
                if(this.m_WaitLinkArr.length > 0) this.LinkWeb(this.m_WaitLinkArr.shift());
            }.bind(this));
        } catch (error) {
            if(this.m_WaitLinkArr.length > 0) this.LinkWeb(this.m_WaitLinkArr.shift());
        }
    },

    httpGets:function (Url, CallBack) {
        this.m_LinkCount++;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                this.m_LinkCount--;
                var respone = decodeURI(xhr.responseText);
                if(window.LOG_WEB_DATA)console.log("HttpLink "+Url);
                respone = respone.replace(/\s+\r\n/g,'');
                while(respone != '' && respone[0].charCodeAt() == 65279){//口或？开头 原因不明
                    var end1 = respone.lastIndexOf("}");
                    var end2 = respone.lastIndexOf("]");
                    var end = Math.max(end1, end2)
                    end = end>=0?end+1:respone.length;
                    respone = respone.substring(1, end );
                }
                if(window.LOG_WEB_DATA)console.log("HttpReq "+respone)
                CallBack(respone);
            }
        }.bind(this);

        // if (cc.sys.isNative) {
        //     xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        // }

        xhr.timeout = 5000;// 5 seconds for timeout
        xhr.open("GET", encodeURI(Url), true);
        xhr.send();
    },
    httpPosts:function (Url, CallBack) {
        this.m_LinkCount++;
        var xhr = cc.loader.getXMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && (xhr.status >= 200 && xhr.status < 400)) {
                this.m_LinkCount--;
                var respone = xhr.responseText;
                if(window.LOG_WEB_DATA)console.log("HttpLink "+Url)
                while(respone != '' && respone[0].charCodeAt() == 65279){//口或？开头 原因不明
                    var end1 = respone.lastIndexOf("}");
                    var end2 = respone.lastIndexOf("]");
                    var end = Math.max(end1, end2)
                    end = end>=0?end+1:respone.length;
                    respone = respone.substring(1, end );
                }
                if(window.LOG_WEB_DATA)console.log("HttpReq "+respone)
                CallBack(respone);
            }
        }.bind(this);

        if (cc.sys.isNative) {
            xhr.setRequestHeader("Accept-Encoding", "gzip,deflate");
        }

        xhr.timeout = 5000;// 5 seconds for timeout
        xhr.open("POST", Url, true);
        xhr.send();
    }
});
WebCenter = new WebDataCenter();