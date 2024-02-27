//调用类型
// var NET_QUENE_UNKONW = 0;
// var NET_QUENE_CONNECT = 1;
// var NET_QUENE_OPEN = 2;
// var NET_QUENE_MESSAGE = 3;
// var NET_QUENE_CLOSE = 4;
// var NET_QUENE_ERROR = 5;
// var NET_QUENE_DISCONNECT = 6;
// var NET_QUENE_SEND = 7;

//网络类型
// var NetQueueType = cc.Class({
//     ctor :function () {
//         this.m_Type = arguments[0];
//         this.m_Prama1 = arguments[1];
//         this.m_Prama2 = arguments[2];
//         this.m_Prama3 = arguments[3];
        
//     },
// });

// //网络列队
// var NetQueue = cc.Class({
//     ctor :function () {
//         this.m_Looping = false;
//         this.m_Queue = new Array();
//     },

//     push :function (Type, SocketHook, Prama2, Prama3) {
//         if(!this.m_Looping){
//             this.m_Looping = true;
//             setInterval(this.process.bind(this), 1);//1000为1秒钟
//         }
//         this.m_Queue.push(new NetQueueType(Type, SocketHook, Prama2, Prama3));
//     },

//     process :function () {
//         if (this.m_Queue.length <= 0)return;
//         if (this.m_Queue[0].m_Prama1==null)return;
//         switch (this.m_Queue[0].m_Type) {
//             case NET_QUENE_CONNECT:
//                 var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
//                 this.m_Queue[0].m_Prama1.mWebSocket = new WebSocket("ws://"+this.m_Queue[0].m_Prama2+":"+this.m_Queue[0].m_Prama3);
//                 this.m_Queue[0].m_Prama1.mWebSocket.binaryType = "arraybuffer";
//                 this.m_Queue[0].m_Prama1.mWebSocket.onopen  = this.m_Queue[0].m_Prama1.onopen;
//                 this.m_Queue[0].m_Prama1.mWebSocket.onmessage = this.m_Queue[0].m_Prama1.onmessage;
//                 this.m_Queue[0].m_Prama1.mWebSocket.onclose = this.m_Queue[0].m_Prama1.onclose;
//                 this.m_Queue[0].m_Prama1.mWebSocket.onerror = this.m_Queue[0].m_Prama1.onerror;
//                 this.m_Queue[0].m_Prama1.mWebSocket.m_Socket = this.m_Queue[0].m_Prama1;
//                 break;
//             case NET_QUENE_OPEN:
//                 this.m_Queue[0].m_Prama1.mSocketSink.onSocketLink(this.m_Queue[0].m_Prama2);
//                 break;
//             case NET_QUENE_MESSAGE:
//                 this.m_Queue[0].m_Prama1.mSocketSink.onSocketData(this.m_Queue[0].m_Prama2.data);
//                 break;
//             case NET_QUENE_CLOSE:
//                 if(LOG_NET_DATA)console.log('关闭网络!');
//                 var SocketID = this.m_Queue[0].m_Prama1.mWebSocket.m_SocketID;
//                 _gLinkArr[SocketID] = null;
//                 this.m_Queue[0].m_Prama1.mWebSocket.close();
//                 this.m_Queue[0].m_Prama1.mSocketSink.onSocketShut();
//                 break;
//             case NET_QUENE_ERROR:
//                 if(LOG_NET_DATA)console.log("网络异常:",this.m_Queue[0].m_Prama2);
//                 var SocketID = this.m_Queue[0].m_Prama1.mWebSocket.m_SocketID;
//                 _gLinkArr[SocketID] = null;
//                 this.m_Queue[0].m_Prama1.mSocketSink.onSocketError(0);
//                 this.m_Queue[0].m_Prama1.mWebSocket = null;
//                 break;
//             case NET_QUENE_DISCONNECT:
//                 if(LOG_NET_DATA)console.log("主动关闭");
//                 if(this.m_Queue[0].m_Prama1.mWebSocket != null){
//                     var WebSocket = this.m_Queue[0].m_Prama1.mWebSocket;
//                     if(_gLinkArr[WebSocket.m_SocketID]) this.m_Queue[0].m_Prama1.mSocketSink.onSocketShut();
//                     _gLinkArr[WebSocket.m_SocketID] = null;
//                     WebSocket.close();
//                 }
//                 break;
//             case NET_QUENE_SEND:
//                 if (this.m_Queue[0].m_Prama1.mWebSocket == null)break;
//                 this.m_Queue[0].m_Prama1.mWebSocket.send(this.m_Queue[0].m_Prama2);
//                 break;
//             default:
//                 if(LOG_NET_DATA)console.log("无效WebScoket包!");
//         }
//         this.m_Queue.shift();
//     }
// });

// var g_NetQuene = new NetQueue();

cc.CSocket = cc.Class({
    ctor :function () {
        this.mSocketSink = arguments[0];
        //this.mWebSocket = null;
        this._WebSocket = null;
    },

    isAlive :function (){
        if(this._WebSocket==null) return false;
        return this._WebSocket.readyState == 1;
    },
    connect :function(url, port){
        var self = this;
        var WebSocket = WebSocket || window.WebSocket || window.MozWebSocket;
        this._WebSocket = new WebSocket("ws://"+url+":"+port);
        this._WebSocket.binaryType = "arraybuffer";
        this._WebSocket.onopen  = (event)=>{
            this.m_SocketID = getFreeSocketID();
            _gLinkArr[this.m_SocketID] = this;
            if(LOG_NET_DATA) console.log("网络连接成功！", this.m_SocketID);
            this.mSocketSink.onSocketLink(event);
        };
        this._WebSocket.onmessage = (event)=>{
            if(_gLinkArr[this.m_SocketID] == null) return;
            this.mSocketSink.onSocketData(event.data);
        };
        this._WebSocket.onclose = (event)=>{
            if(this.readyState != 1)return;
            if(_gLinkArr[this.m_SocketID] == null) return;
            if(LOG_NET_DATA)console.log('关闭网络!');
            var SocketID = this._WebSocket.m_SocketID;
            _gLinkArr[SocketID] = null;
            this._WebSocket.close();
            this.mSocketSink.onSocketShut();
    
            //g_NetQuene.push(NET_QUENE_CLOSE, this.m_Socket, event);
        };
        this._WebSocket.onerror = (event)=>{
            if(LOG_NET_DATA)console.log("网络异常:",this.m_Queue[0].m_Prama2);
            var SocketID = this._WebSocket.m_SocketID;
            _gLinkArr[SocketID] = null;
            this.mSocketSink.onSocketError(0);
            this._WebSocket = null;       
           // g_NetQuene.push(NET_QUENE_ERROR, this.m_Socket, event);
        };
        //g_NetQuene.push(NET_QUENE_CONNECT, this, url, port);
    },
    send :function(data){
        if (this._WebSocket == null)return;
        this._WebSocket.send(data);
        //g_NetQuene.push(NET_QUENE_SEND, this, data);
    },
    disconnect :function(){
        if(LOG_NET_DATA)console.log("主动关闭");
        if(this._WebSocket != null){
            var WebSocket = this._WebSocket;
            if(_gLinkArr[WebSocket.m_SocketID]) this.mSocketSink.onSocketShut();
            _gLinkArr[WebSocket.m_SocketID] = null;
            WebSocket.close();
        }           
       // g_NetQuene.push(NET_QUENE_DISCONNECT, this);
    },
    
//////////////////////////////////////////////////////
//WebSocket
    onopen :function(event){
        this.m_SocketID = getFreeSocketID();
        _gLinkArr[this.m_SocketID] = this;
        if(LOG_NET_DATA) console.log("网络连接成功！", this.m_SocketID);
        this.mSocketSink.onSocketLink(event);
        //g_NetQuene.push(NET_QUENE_OPEN, this.m_Socket, event);
    },
    //监听消息
    onmessage :function(event){
       if(_gLinkArr[this.m_SocketID] == null) return;
       this.mSocketSink.onSocketData(event.data);
       //g_NetQuene.push(NET_QUENE_MESSAGE, this.m_Socket, event);
    },
    //监听Socket的关闭
    onclose :function(event){
        if(this.readyState != 1)return;
        if(_gLinkArr[this.m_SocketID] == null) return;
        if(LOG_NET_DATA)console.log('关闭网络!');
        var SocketID = this._WebSocket.m_SocketID;
        _gLinkArr[SocketID] = null;
        this._WebSocket.close();
        this.mSocketSink.onSocketShut();

        //g_NetQuene.push(NET_QUENE_CLOSE, this.m_Socket, event);
    },
    //监听Socket的异常 
    onerror :function(event){
        if(LOG_NET_DATA)console.log("网络异常:",this.m_Queue[0].m_Prama2);
        var SocketID = this._WebSocket.m_SocketID;
        _gLinkArr[SocketID] = null;
        this.mSocketSink.onSocketError(0);
        this._WebSocket = null;       
       // g_NetQuene.push(NET_QUENE_ERROR, this.m_Socket, event);
    },

   
});
