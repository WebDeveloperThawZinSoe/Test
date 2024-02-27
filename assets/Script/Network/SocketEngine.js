cc.SIZE_TCP_BUFFER = 16384;
cc.TCP_INFO_SIZE = 4;
cc.TCP_COMMACN_SIZE = 4;
cc.TCP_HEAD_SIZE = 8;
cc.SIZE_PACK_INFO = 4;
cc.DWORD_SIZE = 4;
cc.WORD_SIZE = 2;
cc.TCHAR_SIZE = 2;

//网络版本
cc.SOCKET_VER = 0x01;

//网络命令
var TCP_Info = cc.Class({
    ctor :function () {
        this.cbDataKind  = 0;						//数据类型
        this.cbCheckCode = 0;						//效验字段
        this.wPacketSize = 0;						//数据大小
    },
});
//网络命令
var TCP_Command = cc.Class({
    ctor :function () {
        this.wMainCmdID  = 0;							//主命令码
        this.wSubCmdID   = 0;							//子命令码
    },
});

//网络包头
var TCP_Head = cc.Class({
    ctor :function () {
        this.TCPInfo     = new TCP_Info();							//基础结构
        this.CommandInfo = new TCP_Command();						//命令信息
    },
});

//加密密钥
var g_dwPacketKey = 0xA55AA55A;

cc.CSocketEngine = cc.Class({
    ctor :function () {
        //设置回调接口
        this.mISocketEngineSink = arguments[0];
        if(window.LOG_NET_DATA)console.log('创建网络.........');
        this.mSocket = null;
        this.m_cbSendRound = 0;
    },

    isAlive:function (){
        if(this.mSocket==null)return false;
        return this.mSocket.isAlive();
    },

    /** 链接网络 **/
    connect :function(url, port){
        this.mSocket = new cc.CSocket(this);

        this.m_cbSendRound = 0;
        this.m_cbRecvRound = 0;
        this.m_dwSendXorKey = 0x12345678;
        this.m_dwRecvXorKey = 0x12345678;

        this.m_dwSendPacketCount = 0;
        // 接收长度
        this.mBufRecieve = new Uint8Array(cc.SIZE_TCP_BUFFER*10);
        this.mBufRevLength = 0;
        this.mSocket.connect(url, port);
        return this.isAlive();
    },

    /** 关闭网络 **/
    disconnect:function () {
        // 接收长度
        this.m_cbSendRound = 0;
        this.m_cbRecvRound = 0;
        this.m_dwSendXorKey = 0;
        this.m_dwRecvXorKey = 0;
        this.m_dwSendPacketCount = 0;
        if(this.mSocket!=null)this.mSocket.disconnect();
        this.mSocket = null;
        return true;
    },
    closesocket:function () {
        // 接收长度
        this.m_cbSendRound = 0;
        this.m_cbRecvRound = 0;
        this.m_dwSendXorKey = 0;
        this.m_dwRecvXorKey = 0;
        this.m_dwSendPacketCount = 0;
        if(this.mSocket!=null)this.mSocket.disconnect();
        this.mSocket = null;
        if(this.mISocketEngineSink!=null)this.mISocketEngineSink = null;
        return true;
    },
    onSocketError:function(){
        if(this.mISocketEngineSink && this.mSocket)this.mISocketEngineSink.OnErr();
    },
    CheckSocket:function(){
        if(this.mSocket==null)return false;
         this.mSocket.isAlive();
        if (!this.isAlive()){
            if(window.LOG_NET_DATA)console.log("数据发送失败,网络不可用!");
            this.onSocketError();
            this.mISocketEngineSink = null;
            if(this.mSocket!=null) this.mSocket.disconnect();
            return false;
        }
        return true;
    },

    //发送数据
    sendClass:function(main, sub, Obj){
        if(!this.CheckSocket()){
            if(window.LOG_NET_DATA)console.log("sendClass scoker err "+main+" "+sub);
            return false;
        }
        var objSize = 0;
        if(Obj) objSize = gCByte.GetSize(Obj);
        var SendData = new Uint8Array(cc.TCP_HEAD_SIZE + objSize);

        //填写信息头
        var tcpHead = new TCP_Head();
        tcpHead.TCPInfo.cbDataKind = cc.SOCKET_VER;
        tcpHead.TCPInfo.wPacketSize = SendData.length;
        tcpHead.CommandInfo.wMainCmdID = main;
        tcpHead.CommandInfo.wSubCmdID = sub;

        gCByte.Str2Bytes(tcpHead, SendData);
        if(objSize)gCByte.Str2Bytes(Obj, SendData,cc.TCP_HEAD_SIZE);

        //加密数据
        var wSendSize = this.EncryptBufferS(SendData, SendData.length);
        this.mSocket.send(SendData);
    },
    //发送数据
    send:function (main, sub, pData, wDataSize){
        if(!this.CheckSocket()){
            if(window.LOG_NET_DATA)console.log(" err "+main+" "+sub)
            return false;
        }
        //效验大小
        if (wDataSize > cc.SIZE_TCP_BUFFER) return false;

        var tcpHead = new TCP_Head();
        var SendData = new Uint8Array(cc.TCP_HEAD_SIZE+wDataSize);

        //填写信息头
        tcpHead.TCPInfo.cbDataKind = cc.SOCKET_VER;
        tcpHead.TCPInfo.wPacketSize = SendData.length;
        tcpHead.CommandInfo.wMainCmdID = main;
        tcpHead.CommandInfo.wSubCmdID = sub;

        gCByte.Str2Bytes(tcpHead,SendData);

        for(var i = 0;i < wDataSize;i++){
            SendData[i+cc.TCP_HEAD_SIZE] = pData[i];
        }

        //加密数据
        var wSendSize = this.EncryptBufferS(SendData, SendData.length);

        this.mSocket.send(SendData);

        return true;
    },
    //加密数据
    EncryptBufferS:function (pcbDataBuffer,wBufferSize){
        //效验码与字节映射
        var cbCheckCode = 0;
        for (var i = cc.TCP_INFO_SIZE; i<wBufferSize; i++){
            cbCheckCode += pcbDataBuffer[i];
            pcbDataBuffer[i] = gQPCipher.MapSendByteS(pcbDataBuffer,i);
        }

        //填写信息头
        gCByte.w1( pcbDataBuffer,1,~cbCheckCode + 1);

        //设置变量
        this.m_dwSendPacketCount++;
        return wBufferSize;
    },
    //解密数据
    CrevasseBufferS :function(pcbDataBuffer,wBufferSize){
        //效验码与字节映射
        var cbCheckCode = new Uint8Array(1);
        cbCheckCode[0] = pcbDataBuffer[1];
        for (var i = cc.TCP_INFO_SIZE; i<wBufferSize; i++){
            var cbRecvRound = new Uint8Array(1);
            pcbDataBuffer[i] = gQPCipher.MapRecvByteS(pcbDataBuffer,i);
            cbCheckCode[0] += pcbDataBuffer[i];
        }
        if (cbCheckCode[0] != 0) if(window.LOG_NET_DATA)console.log('CheckCode Error.');
    },
    //加密数据
    EncryptBuffer :function(pcbDataBuffer,wDataSize,wBufferSize){
        //调整长度
        var wEncryptSize = wDataSize - cc.TCP_COMMACN_SIZE, wSnapCount = 0;
        if ((wEncryptSize%cc.DWORD_SIZE) != 0){
            wSnapCount = cc.DWORD_SIZE-wEncryptSize%cc.DWORD_SIZE;
        }

        //效验码与字节映射
        var cbCheckCode = 0;
        for (var i = cc.TCP_INFO_SIZE; i<wDataSize; i++){
            cbCheckCode += pcbDataBuffer[i];
            var cbSendRound = new Uint8Array(1);
            cbSendRound[0] = this.m_cbSendRound;
            pcbDataBuffer[i] = gQPCipher.MapSendByteS(pcbDataBuffer,i, cbSendRound);
            this.m_cbSendRound = cbSendRound[0];
        }
        //填写信息头
        //cbDataKind
        gCByte.w1(pcbDataBuffer,0,cc.SOCKET_VER);
        //cbCheckCode
        gCByte.w1( pcbDataBuffer,1,~cbCheckCode + 1);
        //wPacketSize
        gCByte.w2(pcbDataBuffer,2,wDataSize);

        //创建密钥
        var dwXorKey = this.m_dwSendXorKey;
        if (this.m_dwSendPacketCount == 0){
            //生成第一次随机种子
            dwXorKey = 99999;
            dwXorKey ^= 1;
            dwXorKey ^= 1;
            dwXorKey ^= 1;
            dwXorKey ^= 1;

            //随机映射种子
            dwXorKey = this.SeedRandMap(dwXorKey&0xFFFF);
            dwXorKey |= (this.SeedRandMap((dwXorKey >> 16)&0xFFFF)&0xFFFFFFFF) << 16;
            dwXorKey ^= g_dwPacketKey;
            this.m_dwSendXorKey = dwXorKey;
            this.m_dwRecvXorKey = dwXorKey;
        }

        //加密数据
        var wEncrypCount = (wEncryptSize + wSnapCount) / cc.DWORD_SIZE;
        var t = 0;
        var tt = 0;
        for (var i = 0; i<wEncrypCount; i++){
            gCByte.w4(pcbDataBuffer,cc.TCP_INFO_SIZE+tt,gCByte.r4(pcbDataBuffer,cc.TCP_INFO_SIZE+tt)&0xFFFFFFFF ^ (dwXorKey&0xFFFFFFFF));
            tt+=cc.DWORD_SIZE;
            dwXorKey = this.SeedRandMap(gCByte.r2(pcbDataBuffer,cc.TCP_INFO_SIZE+t));
            t+=cc.WORD_SIZE;
            dwXorKey |= (this.SeedRandMap(gCByte.r2(pcbDataBuffer,cc.TCP_INFO_SIZE+t))&0xFFFFFFFF) << 16;
            t+=cc.WORD_SIZE;
            dwXorKey ^= g_dwPacketKey;
        }

        //插入密钥
        if (this.m_dwSendPacketCount == 0) {
            for(var i = wDataSize+wSnapCount;i>cc.TCP_HEAD_SIZE;i--){
                pcbDataBuffer[i+cc.DWORD_SIZE-1] = pcbDataBuffer[i-1];
            }

            gCByte.w4(pcbDataBuffer,cc.TCP_HEAD_SIZE,this.m_dwSendXorKey);
            gCByte.w2(pcbDataBuffer,2,gCByte.r2(pcbDataBuffer,2)+cc.DWORD_SIZE);
            wDataSize += cc.DWORD_SIZE;
        }
        //设置变量
        this.m_dwSendPacketCount++;
        this.m_dwSendXorKey = dwXorKey;

        return wDataSize;
    },

    //解密数据
    CrevasseBuffer:function (pcbDataBuffer,wDataSize){
        //调整长度
        var wSnapCount = 0;
        if ((wDataSize%cc.DWORD_SIZE) != 0) {
            wSnapCount = cc.DWORD_SIZE-wDataSize%cc.DWORD_SIZE;
            for(var i=0;i<wSnapCount;i++){
                pcbDataBuffer[wDataSize+i] = 0;
            }
        }
        //解密数据
        var dwXorKey = this.m_dwRecvXorKey;
        var wEncrypCount = (wDataSize + wSnapCount - cc.TCP_INFO_SIZE) / 4;
        var t = 0;
        var tt = 0;
        for (var i = 0; i<wEncrypCount; i++){
            if ((i == (wEncrypCount - 1)) && (wSnapCount>0)){
                var pcbKey = new Uint8Array(cc.DWORD_SIZE);
                gCByte.w4(pcbKey,0,this.m_dwRecvXorKey);
                var cbKey = new Uint8Array(cc.DWORD_SIZE);
                var j=0;
                for(var ts=cc.DWORD_SIZE-wSnapCount;ts<cc.DWORD_SIZE;ts++){
                    cbKey[j++] = pcbKey[ts];
                }
                for(var ts=0;ts<wSnapCount;ts++){
                    pcbDataBuffer[wDataSize+ts] = cbKey[ts];
                }
            }

            dwXorKey = this.SeedRandMap(gCByte.r2(pcbDataBuffer,cc.TCP_INFO_SIZE+t));
            t+=cc.WORD_SIZE;
            dwXorKey |= (this.SeedRandMap(gCByte.r2(pcbDataBuffer,cc.TCP_INFO_SIZE+t))&0xFFFFFFFF) << 16;
            t+=cc.WORD_SIZE;
            dwXorKey ^= g_dwPacketKey;
            gCByte.w4(pcbDataBuffer,cc.TCP_INFO_SIZE+tt,gCByte.r4(pcbDataBuffer,cc.TCP_INFO_SIZE+tt)&0xFFFFFFFF ^ (this.m_dwRecvXorKey&0xFFFFFFFF));
            tt+=cc.DWORD_SIZE;
            this.m_dwRecvXorKey = dwXorKey;
        }

        //效验码与字节映射
        var cbCheckCode = new Uint8Array(1);
        cbCheckCode[0] = pcbDataBuffer[1];
        for (var i = cc.TCP_INFO_SIZE; i<wDataSize; i++){
            var cbRecvRound = new Uint8Array(1);
            cbRecvRound[0] = this.m_cbRecvRound;
            pcbDataBuffer[i] = gQPCipher.MapRecvByte(pcbDataBuffer,i, cbRecvRound);
            this.m_cbRecvRound = cbRecvRound[0];
            cbCheckCode[0] += pcbDataBuffer[i];
        }
        if (cbCheckCode[0] != 0) if(window.LOG_NET_DATA)console.log('CheckCode Error.');
    },

    //随机映射
    SeedRandMap:function (wSeed){
        var dwHold = wSeed;
        return ((dwHold = dwHold * 241103 + 2533101) >> 16)&0xFFFF;
    },

    onSocketLink:function (event) {
        if (this.mISocketEngineSink) this.mISocketEngineSink.onEventTCPSocketLink(event);
    },

    onSocketShut:function () {
        this.m_cbSendRound = 0;
        this.m_cbRecvRound = 0;
        this.m_dwSendXorKey = 0;
        this.m_dwRecvXorKey = 0;
        this.m_dwSendPacketCount = 0;
        if (this.mISocketEngineSink != null)
            this.mISocketEngineSink.onEventTCPSocketShut();
    },

    onSocketData:function (data){
        var dataArray = new Uint8Array(data);

        for(var i=0;i<dataArray.length;i++){
            this.mBufRecieve[this.mBufRevLength+i] = dataArray[i];
        }
        // 接收长度增加
        this.mBufRevLength += dataArray.length;

        // 尝试解包
        var iUnpackIndex = 0;
        var iDstLength = cc.SIZE_PACK_INFO;

        while (this.mBufRevLength >= cc.TCP_HEAD_SIZE  && (this.mBufRevLength < 65262)) {
            iDstLength = gCByte.r2(this.mBufRecieve,2);
            if (this.mBufRevLength < iDstLength) return ;
            var cbDataBuffer = this.mBufRecieve.slice(0,iDstLength);
            this.mBufRevLength -= iDstLength;
            for(var i=0;i<this.mBufRevLength;i++){
                this.mBufRecieve[i] = this.mBufRecieve[iDstLength + i];
            }

            // 解包数据并通知调用
            if (!this.unpack(cbDataBuffer, iUnpackIndex, iDstLength)) {
                this.disconnect();
                return;
            }
        }
    },

    unpack:function (data,start,length){
        // 解密
        if ((data[start] & gQPCipher.getCipherMode()) > 0){
            var wRealySize = this.CrevasseBufferS(data, length);
        }

        //填写信息头
        var tcpHead = new TCP_Head();
        gCByte.Bytes2Str(tcpHead,data);
        var cbData = new Uint8Array(length-cc.TCP_HEAD_SIZE);
        for(var i=0;i<length-cc.TCP_HEAD_SIZE;i++){
            cbData[i] = data[i + cc.TCP_HEAD_SIZE];
        }
        if (tcpHead.CommandInfo.wMainCmdID == 0){
            if(tcpHead.CommandInfo.wSubCmdID == 1) {
                this.send(0, 1, data, length);
            }else if(tcpHead.CommandInfo.wSubCmdID == SUB_KN_CLIENT_HEART){
                if (this.mISocketEngineSink != null) this.mISocketEngineSink.OnSocketHeart();
            }
        }else{
            if (this.mISocketEngineSink != null){
                var bHandle = this.mISocketEngineSink.onEventTCPSocketRead(tcpHead.CommandInfo.wMainCmdID,tcpHead.CommandInfo.wSubCmdID,  cbData, cbData.length);
                if(bHandle == null || !bHandle) if(window.LOG_NET_DATA)console.log("onEventTCPSocketRead "+tcpHead.CommandInfo.wMainCmdID+" -- "+tcpHead.CommandInfo.wSubCmdID)
                return bHandle;
            }
        }
        return true;
    }
});