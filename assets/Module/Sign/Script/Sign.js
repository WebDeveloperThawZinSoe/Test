cc.Class({
    extends: cc.BaseClass,

    properties: {
    },
    // onLoad () {},
    OnShowView:function(){
        this.BindButtonInit();
        this.$('NoClick').setContentSize(10000, 10000);
        this.OnUpdateSignView31();
    },
    OnClick_BtSign:function(){
        cc.gSoundRes.PlaySound('Button');
        console.log('OnClicked_BtSign')
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/SignIn.php?&GetMark=1&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl, null, function (data) {
            var Res = JSON.parse(data);
            this.ShowAlert(Res.Desc);
            this.OnShowView(true);
            WebCenter.SetDataOutTime('GetMark=5');
            this.m_Hook.OnBtRefeshRoomCard();
        }.bind(this));
    },
    OnUpdateSignView31:function(){
        this.m_NdView = this.$('BG');
        var TempData = new Date();
        cc.log("当前时间：  "+TempData);
        this.$("BG/Month@Label").string = TempData.getMonth()+1;
        this.$('BG/Time@Label').string = TempData.getFullYear()+'年';//+(TempData.getMonth()+1)+'月'+TempData.getDate()+'日' ;
        var Today = TempData.getDate();
        var day = new Date(TempData.getFullYear(),TempData.getMonth()+1,0).getDate(); //本月天数
        TempData.setDate(1)                                                         //本月首日
        var LastDay = this.GetLastMonthDays();                                      //上月天数
        var StartIndex = TempData.getDay();//0-6 周日-周6
        //周期转化为周1-周日
        // if(StartIndex == 0) StartIndex = 7;
        // StartIndex = StartIndex - 1
        //结束索引
        var EndIndex = StartIndex + day;
        var pGlobalUserData = g_GlobalUserInfo.GetGlobalUserData();
        var webUrl = window.PHP_HOME+'/SignIn.php?&GetMark=0&dwUserID='+pGlobalUserData.dwUserID;
        WebCenter.GetData(webUrl,0, function (data) {
            var SignArr = JSON.parse(data);
            var SignCnt = 0;
            for(var i=1;i<=31;i++){
                if(SignArr[i] == null) SignArr[i] = 0;
                else SignCnt++;
            }
            this.$('BG/BtSign@Button').interactable = (!SignArr[Today]);
            this.$('BG/Num/Num@Label').string = SignCnt+' ';
            //console.log('OnUpdateSignView31 0 ', day,LastDay,StartIndex,EndIndex )
            for(var i=0;i<37;i++){
                var Day = '';
                if(i < StartIndex) {
                    //上月
                    Day = LastDay - StartIndex + i + 1;
                    this.$('BG/content/'+i+'/today').active = false;
                    this.$('BG/content/'+i+'/ok').active = false;
                    this.$('BG/content/'+i+'/NoLight').active = true;
                    this.$('BG/content/'+i+'/day').color = cc.color(205,166,137);
                }else if(i >= EndIndex){
                    //下月
                    Day = i - StartIndex + 1 - day;
                    this.$('BG/content/'+i+'/today').active = false;
                    this.$('BG/content/'+i+'/ok').active = false;
                    this.$('BG/content/'+i+'/NoLight').active = true;
                    this.$('BG/content/'+i+'/day').color = cc.color(205,166,137);
                }else {
                    //当月
                    Day = i - StartIndex + 1;
                    this.$('BG/content/'+i+'/today').active = Today==Day;
                    //this.$('content/'+i+'/SignBG_p' ,this.m_NdView).active = (Today>Day && SignArr[Day]==0)
                    if(SignArr[Day] > 0){
                        this.$('BG/content/'+i+'/ok').active = true;
                        this.$('BG/content/'+i+'/day').color = cc.color(39,149,0);
                    }else{
                        if(i<parseInt(Today+StartIndex-1)){
                           // this.$('BG/content/'+i+'/no').active = true;
                           this.$('BG/content/'+i+'/day').color = cc.color(132,111,96);
                        }
                    }
                    this.$('BG/content/'+i+'/NoLight').active = false;
                }
                this.$('BG/content/'+i+'/day@Label').string = Day;
                if(Today==Day){
                    this.$('BG/content/'+i+'/day').color = cc.color(147,29,15);

                }
                // }else if(SignArr[Day] > 0){
                //     this.$('BG/content/'+i+'/day').color = cc.color(76,187,40);
                // }else{
                //     this.$('BG/content/'+i+'/day').color = cc.color(189,70,52);
                // }

            }
        }.bind(this));
    },
    GetLastMonthDays:function(){
        var TempData = new Date();
        var day;
        if(TempData.getMonth() > 1){
            day = new Date(TempData.getFullYear(),TempData.getMonth(),0)
        }else{
            day = new Date(TempData.getFullYear()-1,12,0)
        }
        return day.getDate();
    },
    // update (dt) {},
});
