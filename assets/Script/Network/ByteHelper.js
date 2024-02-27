var gCByteHelper = cc.Class({

    ctor:function(){
        this.m_buffer = new ArrayBuffer(8);
        this.m_view = new DataView(this.m_buffer);
    },
    w1 :function(tag,index,src) {
        tag[index] = src;
    },

    w2 :function(tag,index,src) {
        tag[index] = src;
        tag[index+1] = src>>8;
    },

    w4 :function(tag,index,src) {
        tag[index+0] = src;
        tag[index+1] = src>>8;
        tag[index+2] = src>>16;
        tag[index+3] = src>>24;
    },
    wU4 :function(tag,index,src) {
        tag[index+0] = src;
        tag[index+1] = src>>8;
        tag[index+2] = src>>16;
        tag[index+3] = src>>24;
    },
    w8:function (tag,index,src) {
        var Low = (src&0xffffffff);
        var High = (src - Low) / Math.pow(2,32);
        //if(window.LOG_NET_DATA)console.log("w8 "+Low+" "+High)
        this.w4(tag,index,Low);
        this.w4(tag,index+4,High);
    },

    //写入float类型
    wf4 :function(tag,index,src){
        this.m_view.setFloat32(0, src);
        for(var i = 0;i<4;i++){
            tag[index+i] = this.m_view.getUint8(4-1-i)
        }
    },

    wd8 :function(tag,index,src){
        this.m_view.setFloat64(0, src);
        for(var i = 0;i<8;i++){
            tag[index+i] =  this.m_view.getUint8(8-1-i)
        }
    },
    wStr:function (tag,index,src) {
        for(var i=0;i<=src.length;i++){
            tag[index+i*2] = src.charCodeAt(i)&0xFF;
            tag[index+i*2+1] = src.charCodeAt(i)>>8;
        }
    },

    rStr :function(tag,index){
        var strRlt = "";
        for(var i=0;i<=tag.length-index;i++){
            var wCode = tag[index+i*2] | (tag[index+i*2+1]<<8);
            if(wCode==0)break;
            strRlt += String.fromCharCode(wCode);
        }
        return strRlt;
    },

    r1 :function(tag,index){
        return tag[index];
    },

    r2 :function(tag,index){
        return tag[index]|(tag[index+1]<<8);
    },
    rU4:function (tag,index){
        for(var i = 0;i<4;i++){
            this.m_view.setUint8(i,tag[index + 4-1-i]);
        }

        return  this.m_view.getUint32(0);
    },
    r4:function (tag,index){
        for(var i = 0;i<4;i++){
            this.m_view.setUint8(i,tag[index + 4-1-i]);
        }

        return  this.m_view.getInt32(0);
    },
    rNum:function (tag,index,len){//,bUnum
        var bUnum=arguments[3]?arguments[3]:false;

        for(var i = 0;i<len;i++){
            this.m_view.setUint8(i,tag[index + len-1-i]);
        }
        if(len < 8){
            return this.m_view["getUint"+len*8](0);
        }else{
            var HighNum = this.m_view.getInt32(4) * Math.pow(2,32)
            var LowNum = this.m_view.getInt32(0)
            return HighNum + LowNum;
        }
    },
    r4U:function (tag,index){
        var rel0 = tag[index+0];
        var rel1 = tag[index+1]<<8;
        var rel2 = tag[index+2]<<16;
        var rel3 = tag[index+3]*Math.pow(2,24);
        return rel3+rel2+rel1+rel0;
    },
    //读取float类型  损失精度 .toFixed(2)
    rf4:function (tag,index){
        for(var i = 0;i<4;i++){
            this.m_view.setUint8(i,tag[index + 4-1-i]);
        }

        return  this.m_view.getFloat32(0);
    },

    rd8:function (tag,index){
        for(var i = 0;i<8;i++){
            this.m_view.setUint8(i,tag[index + 8-1-i]);
        }

        return this.m_view.getFloat64(0);
    },

    r8 :function(tag,index){
        var HighNum = this.r4(tag,index+4) * Math.pow(2,32)
        var LowNum = this.rU4(tag,index);
        return HighNum + LowNum;
    },

    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    GetSize:function (Obj) {
        return  this.TraverseStr(null,Obj,null,0);
    },
    Bytes2Str :function(Obj,tag,index) {
        if(index == null) index = 0;
        var len = this.TraverseStr('r',Obj,tag,index);
        if(Obj._name && window.LOG_NET_DATA) {
            Obj._Size = len;
            console.log(JSON.stringify(Obj))
        }
        return len;
    },
    Str2Bytes:function (Obj,tag) {
        if(Obj._name) if(window.LOG_NET_DATA)console.log(JSON.stringify(Obj))
        var index=arguments[2]?arguments[2]:0;
        var needRes = false;
        if (tag == null){
            needRes = true;
            tag = new Uint8Array(this.GetSize(Obj));
        }
        this.TraverseStr('w',Obj,tag,index);
        if(needRes) return tag;
    },
     //遍历结构体入口
    TraverseStr:function (inout,Obj,tag,index) {
        var strlen = 0;
        for(var i in Obj) {
            //跳过属性成员和非自定义成员
            if(i.indexOf("len_") == 0 || i.indexOf("index_") == 0 || i.indexOf("_") == 0) continue;
            //自定义信息
            var info = this.GetMemberInfo(Obj,i);//Obj["len_"+i]
            if(typeof (Obj[i]) == "object") {
                var strFun = 'Traverse';
                strFun += Array.isArray(Obj[i])?'Arr':'Str';
                strlen += this[strFun](inout,Obj[i],tag,index+strlen,info);
            } else {
                strlen += this.BaseRW(inout,Obj,i,tag,index+strlen,info);
            }
        }
        return strlen;
    },
    //遍历数组入口
    TraverseArr:function (inout,Obj,tag,index,info) {
        var arrlen  = 0;
        for(var i =0;i<Obj.length;i++) {
            if(typeof (Obj[i]) == "object") {
                var strFun = 'Traverse';
                strFun += Array.isArray(Obj[i])?'Arr':'Str';
                arrlen += this[strFun](inout,Obj[i],tag,index+arrlen,info);
            } else {
                arrlen += this.BaseRW(inout,Obj,i,tag,index+arrlen,info);;
            }
        }
        return arrlen;
    },
    BaseRW :function(Op,Obj,name,tag,index,info) {
        try {
            if(Op != null) {  // null 为 GetSize 跳过
                //拼写函数名
                var strFun = Op + info.strFun;

                //函数调用
                var Res = this[strFun](tag,index,Obj[name]);
                //读时赋值
                if(Op=='r') Obj[name] = Res;
            }

        } catch (error) {
            if(window.LOG_NET_DATA)console.log(error.toString())
            if(window.LOG_NET_DATA)console.log("BaseRW "+name +" -- "+strFun+" -- "+info.len)
        }
        return info.len;
    },

    GetMemberInfo:function (Obj, name) {
        var info = new Object();
        info.len = 0;//变量长度

        info.strFun = "";//调用方法拼写
        info.bFloat = (name.indexOf("f") == 0);
        info.bDouble = (name.indexOf("d") == 0 && name.indexOf("dw") != 0);
        if(info.bFloat) info.strFun = 'f';
        if(info.bDouble) info.strFun = 'd';
        if(name.indexOf("dw") == 0) info.strFun = 'U';
        //自定义长度
        if(Obj["len_"+name]){
            info.strFun = "Str";
            info.len = Obj["len_"+name];
        }else{
            if(name.indexOf("ll") == 0 || info.bDouble) info.len = 8; //longlong/double
            else if(name.indexOf("cb") == 0 || name.indexOf("b")== 0 || name.indexOf("by")== 0) info.len = 1;//byte
            else if(name.indexOf("w") == 0) info.len = 2;//WORD
            else info.len = 4;//long/DWORD/int
            info.strFun += info.len;
        }
        return info;
    },
    StrSameMemCopy:function(TagObj,SouceObj){
        for(var i in TagObj){
            if(i.indexOf("len_") == 0 || i.indexOf("index_") == 0 || i.indexOf("_") == 0) continue;
            if(SouceObj[i] == null) continue;
            TagObj[i] = SouceObj[i] ;
        }
    },
    //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
});
window.gCByte = new gCByteHelper();
