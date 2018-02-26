const app = getApp()
let volcanoId = null;
let countdown;
let timer;
let timer2;
let AccessToken = null;
let CODE;
let encryptedData;
let iv;
let userId;
let platformUid;
let phone = "";
let auth = "";
let authTimer;
let isJoin = false;
var Util = require('../../utils/util.js');
var MD5 = require('../../utils/MD5.js');
var CusBase64 = require('../../utils/Base64.js'); 
function getEncrypts(str) {
  return CusBase64.CusBASE64.encoder(str);
};

//检测微信是否绑定
function checkBinding(obj, type) {
  // console.log("AccessToken:" + AccessToken);
  var that = this;
  var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(CODE + encryptedData + iv + "H5" + "2" + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
  wx.request({
    url: 'https://xiaochegnxu.xsawe.top/v2/login/loginSelective',
    data: Util.json2Form({
      accessToken: CODE,
      content: encryptedData,
      iv: iv,
      platformMark: "H5",
      platformType: "2"
    }),
    method: "POST",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
      // 'content-type': 'application/json'
      'versionmoli': '2.5.0',
      'phonetype': 'H5',
      'platformmoli': 'H5',
      'phoneid': 'H5',
      'sign': sign,
      'uid': '0'
    },
    success: function (res) {
      // console.log(res);
      if (res.data.code == 10000) {
        var binner = res.data.res.resMap.binner;
        AccessToken = res.data.res.resMap.accessToken;
        userId = res.data.res.resMap.user.id;
        app.globalData.binner = binner;
        app.globalData.userId = userId;
        obj.setData({
          binner: binner
        })
        if (type == 0) {
          obj.setData({
            register: false,
            binner: false
          })
        }
        createVolcano(obj);
      } else if (res.data.code == 123700) {
        //未注册用户弹出绑定窗口
        obj.setData({
          register: true,
          binner: false
        })
        app.globalData.platformOpenId = res.data.res.platformuserobj.id,
          app.globalData.platformUid = res.data.res.platformuserobj.unionid;
      }
    }
  })
}

var userId_ = null;

//创建一个火山createVolcano
function createVolcano(obj){
  wx.request({
    url: 'https://xiaochegnxu.xsawe.top/v3/volcano/entryVolcano',
    data: {
      userId: app.globalData.userId,
      volcanoId: "0"
    },
    method: "GET",
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      // console.log(res);
      var da = res.data.res;
      if (res.data.code == "10000") {
        var recordList = da.recordList;
        volcanoId = recordList[0].teamId;
        countdown = recordList[0].creatTime;
        var emptyArry = new Array();
        if (recordList.length > 0 && recordList.length < 4) {
          for (var i = 0; i < 4 - recordList.length; i++) {
            emptyArry.push("");
          }
        }
        if (recordList.length > 0) {
          for (var i = 0; i < recordList.length; i++) {
            if (recordList[i].userId == userId) {
              isJoin = true;
            }
          }
        }
        obj.setData({
          recordList: recordList,
          emptyArry: emptyArry,
          isJoin: isJoin,
          showResult: false,
          moneyResult: 0
        })
        //火山倒计时
        timer = setInterval(function () {
          var now = new Date();
          if (new Date(countdown + 86400000) - new Date() <= 0) {
            clearInterval(timer);
          }
          var countdown_ = new Date(countdown + 86400000) - new Date();
          obj.setData({
            countdown: Util.countdown(countdown_)
          })
        }, 1000)
      } else if (res.data.code == "200009") {
        wx.showModal({
          title: "",
          content: "您还有未完成点火山红包",
          showCancel: false,
          success: function (res) {
            if (res.confirm) {
            }
          }
        })
        return false;
      }
    },
    fail: function (err) {
      console.log(err)
    }
  })
}

var datas = [{
  money: 27,
  name: "匿名用户",
  time: 29
}, {
  money: 31,
  name: "匿名用户",
  time: 29
}, {
  money: 14,
  name: "追狍子",
  time: 29
}, {
  money: 38,
  name: "把你惯坏了",
  time: 28
}, {
  money: 31,
  name: "卓洛",
  time: 28
}, {
  money: 26,
  name: "匿名用户",
  time: 28
}, {
  money: 14,
  name: "sunnuan",
  time: 28
}, {
  money: 34,
  name: "随风",
  time: 28
}, {
  money: 20,
  name: "霸气的豆豆鞋",
  time: 27
}, {
  money: 44,
  name: "匿名用户",
  time: 27
}, {
  money: 28,
  name: "昂昂昂昂",
  time: 27
}, {
  money: 29,
  name: "带刀小猫",
  time: 26
}, {
  money: 19,
  name: "渺渺清空",
  time: 26
}, {
  money: 45,
  name: "陈刚",
  time: 25
}, {
  money: 35,
  name: "鸡糟的黄医桑",
  time: 25
}, {
  money: 26,
  name: "匿名用户",
  time: 24
}, {
  money: 22,
  name: "图腾sure",
  time: 24
}, {
  money: 29,
  name: "Ligo",
  time: 23
}, {
  money: 43,
  name: "蝶舞",
  time: 23
}, {
  money: 35,
  name: "SilverGrey",
  time: 23
}, {
  money: 40,
  name: "匿名用户",
  time: 23
}, {
  money: 26,
  name: "鹅蛋脸大湿",
  time: 22
}, {
  money: 31,
  name: "初伟",
  time: 22
}, {
  money: 36,
  name: "里耐斯",
  time: 22
}, {
  money: 41,
  name: "匿名用户",
  time: 22
}, {
  money: 46,
  name: "秋叶",
  time: 22
}, {
  money: 42,
  name: "crystal",
  time: 22
}, {
  money: 16,
  name: "匿名用户",
  time: 22
}, {
  money: 31,
  name: "MChAo",
  time: 21
}, {
  money: 49,
  name: "邹怂怂",
  time: 21
}, {
  money: 35,
  name: "匿名用户",
  time: 21
}, {
  money: 32,
  name: "高逼格内裤",
  time: 20
}, {
  money: 48,
  name: "安德烈·戈麦斯",
  time: 20
}, {
  money: 32,
  name: "我去前面探探路",
  time: 19
}, {
  money: 39,
  name: "YYK",
  time: 19
}, {
  money: 49,
  name: "厄尔聂斯特",
  time: 18
}, {
  money: 11,
  name: "匿名用户",
  time: 18
}, {
  money: 14,
  name: "飞翔的梅利号",
  time: 18
}, {
  money: 37,
  name: "刘苏",
  time: 17
}, {
  money: 45,
  name: "张小九",
  time: 16
}, {
  money: 43,
  name: "匿名用户",
  time: 16
}, {
  money: 28,
  name: "萩女士",
  time: 16
}, {
  money: 42,
  name: "余生",
  time: 15
}, {
  money: 14,
  name: "江南叨客",
  time: 15
}, {
  money: 11,
  name: "熊是熊猫的猫",
  time: 15
}, {
  money: 33,
  name: "朱某",
  time: 15
}, {
  money: 34,
  name: "以梦为马",
  time: 15
}, {
  money: 16,
  name: "真假",
  time: 14
}, {
  money: 24,
  name: "匿名用户",
  time: 14
}, {
  money: 10,
  name: "匿名用户",
  time: 14
}, {
  money: 32,
  name: "工藤叶",
  time: 13
}, {
  money: 47,
  name: "skytraveler",
  time: 13
}, {
  money: 14,
  name: "匿名用户",
  time: 13
}, {
  money: 14,
  name: "gaogao",
  time: 13
}, {
  money: 16,
  name: "弱智",
  time: 12
}, {
  money: 45,
  name: "TOO洋图森破",
  time: 12
}, {
  money: 45,
  name: "匿名用户",
  time: 11
}, {
  money: 17,
  name: "松鼠闯江湖",
  time: 10
}, {
  money: 34,
  name: "刘梓牧",
  time: 9
}, {
  money: 32,
  name: "小二",
  time: 9
}, {
  money: 48,
  name: "匿名用户",
  time: 9
}, {
  money: 43,
  name: "Ashespa",
  time: 8
}, {
  money: 24,
  name: "匿名用户",
  time: 8
}, {
  money: 42,
  name: "匿名用户",
  time: 8
}, {
  money: 44,
  name: "六点起",
  time: 7
}, {
  money: 36,
  name: "陈晨",
  time: 7
}, {
  money: 43,
  name: "家有春天1234",
  time: 7
}, {
  money: 15,
  name: "朱医生",
  time: 6
}, {
  money: 41,
  name: "任意门27",
  time: 6
}, {
  money: 30,
  name: "C姑娘",
  time: 6
}, {
  money: 26,
  name: "笑央",
  time: 5
}, {
  money: 33,
  name: "匿名用户",
  time: 5
}, {
  money: 12,
  name: "二郎真菌",
  time: 4
}, {
  money: 12,
  name: "张有钱",
  time: 4
}, {
  money: 30,
  name: "子非鱼",
  time: 4
}, {
  money: 34,
  name: "匿名用户",
  time: 3
}, {
  money: 11,
  name: "童谣",
  time: 3
}, {
  money: 44,
  name: "Gary Wu",
  time: 3
}, {
  money: 48,
  name: "天天",
  time: 2
}, {
  money: 28,
  name: "吉吉猪",
  time: 2
}, {
  money: 31,
  name: "杨依依",
  time: 1
}, {
  money: 19,
  name: "林芝木",
  time: 1
}, {
  money: 33,
  name: "匿名用户",
  time: 1
}, {
  money: 16,
  name: "匿名用户",
  time: 1
}, {
  money: 44,
  name: "言午",
  time: 0
}, {
  money: 29,
  name: "少年",
  time: 0
}, {
  money: 31,
  name: "jason",
  time: 0
}, {
  money: 11,
  name: "Easy",
  time: 0
}, {
  money: 49,
  name: "zhouaokai",
  time: 0
}, {
  money: 20,
  name: "落清影",
  time: 0
}];
Page({
  data: {
    isShow: false,
    recordList: null,
    emptyArry: null,
    countdown: "00:00:00",
    tip1: "吉吉猪…刚刚抢到20元现金红包",
    tip2: "TOO洋…刚刚抢到32元现金红包",
    start: false,
    binner: app.globalData.binner,
    register: app.globalData.register,
    authTip: "获取验证码",
    userId_: "0",
    showResult: false,
    isSharePage: false
  },
  bindMyMoneyTap: function () {
    wx.navigateTo({
      url: '../myMoney/myMoney'
    })
  },
  showRule: function(){
    this.setData({
      isShow: true
    })
  },
  close: function(){
    this.setData({
      isShow: false
    })
  },
  onShow: function (){
    // clearInterval(timer);
    clearTimeout(timer2);
    this.setData({
      userId: app.globalData.userId
    })
    // var that = this;
    // //火山倒计时
    // timer = setInterval(function () {
    //   var now = new Date();
    //   if (new Date(countdown + 86400000) - new Date() <= 0) {
    //     clearInterval(timer);
    //   }
    //   var countdown_ = new Date(countdown + 86400000) - new Date();
    //   that.setData({
    //     countdown: Util.countdown(countdown_)
    //   })
    // }, 1000)
  },
  //初始化
  onLoad: function (options){
    // console.log("app.globalData.userId:" + app.globalData.userId);
    // console.log("options:" + options.userId);
    var that = this;
    if (options.gameType) {
      that.setData({
        showResult: true,
        moneyResult: app.globalData.moneyResult
      })
    }

    if (!options.userId && app.globalData.userId ==""){
      that.setData({
        recordList: new Array(),
        emptyArry: new Array()
      })
      return false;
    }

    //查询火山
    var id = null;
    if (options.userId) {
      userId_ = options.userId;
      id = options.userId;
      that.setData({
        isSharePage:true
      })
    } else {
      id = app.globalData.userId;
    }
    console.log(userId_);
    var that = this;
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/v3/volcano/selectVolcanoInfo',
      data: {
        userId: id,
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res);
        var da = res.data.res;
        if (res.data.code == "10000") {
          var recordList = new Array();
          var emptyArry = new Array();
          // if (da.volcanoStatus != 0){
            recordList = da.recordList;
            volcanoId = recordList[0].teamId;
            countdown = recordList[0].creatTime;
            emptyArry = new Array();
            if (recordList.length > 0 && recordList.length < 4) {
              for (var i = 0; i < 4 - recordList.length; i++) {
                emptyArry.push("");
              }
            }
            if (recordList.length > 0) {
              for (var i = 0; i < recordList.length; i++) {
                if (recordList[i].userId == id || app.globalData.userId == userId_) {
                  isJoin = true;
                }
                if (recordList[i].userId != app.globalData.userId && userId_ != null){
                  isJoin = false;
                }
              }
            }
          // }

          that.setData({
            recordList: recordList,
            emptyArry: emptyArry,
            isJoin: isJoin
          })
          //火山倒计时
          timer = setInterval(function () {
            var now = new Date();
            if (new Date(countdown + 86400000) - new Date() <= 0) {
              clearInterval(timer);
              that.setData({
                recordList: new Array(),
                emptyArry: new Array(),
                isJoin: false
              })
            }else{
              var countdown_ = new Date(countdown + 86400000) - new Date();
              that.setData({
                countdown: Util.countdown(countdown_)
              })
            }
          }, 1000)
        } else if (res.data.code == "200009"){
          that.setData({
            recordList: new Array(),
            emptyArry: new Array(),
            isJoin: false
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
    
    //授权
    // wx.login({
    //   success: res => {
    //     CODE = res.code;
    //     wx.getUserInfo({
    //       data: {
    //         withCredentials: true
    //       },
    //       success: function (res) {
    //         encryptedData = encodeURI(res.encryptedData);
    //         iv = encodeURI(res.iv);
    //         //验证是否注册
    //         var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(CODE + encryptedData + iv + "H5" + "2" + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
    //         // var that = this;
    //         wx.request({
    //           url: 'https://xiaochegnxu.xsawe.top/v2/login/loginSelective',
    //           data: Util.json2Form({
    //             accessToken: CODE,
    //             content: encryptedData,
    //             iv: iv,
    //             platformMark: "H5",
    //             platformType: "2"
    //           }),
    //           method: "POST",
    //           header: {
    //             'content-type': 'application/x-www-form-urlencoded',
    //             // 'content-type': 'application/json'
    //             'versionmoli': '2.5.0',
    //             'phonetype': 'H5',
    //             'platformmoli': 'H5',
    //             'phoneid': 'H5',
    //             'sign': sign,
    //             'uid': '0'
    //           },
    //           success: function (res) {
    //             if (res.data.code == 10000) {
    //               var binner = res.data.res.resMap.binner;
    //               AccessToken = res.data.res.resMap.accessToken;
    //               userId = res.data.res.resMap.user.id;
    //               app.globalData.binner = binner;
    //               app.globalData.userId = userId;
                  

    //             } else if (res.data.code == 123700) {
    //               //未注册用户弹出绑定窗口
    //               that.setData({
    //                 register: true
    //               })
    //               app.globalData.platformOpenId = res.data.res.platformuserobj.id,
    //               app.globalData.platformUid = res.data.res.platformuserobj.unionid;
    //             }
    //           }
    //         })
    //       }
    //     })
    //   }
    // })
  },
  onHide: function(){
    clearTimeout(timer2);
  },
  onReady: function(){
    var that = this;
    //滚动信息
    var index = 0;
    function scrollInfo() {
      index++;
      if (index > 90) {
        index = 0;
      }
      var tip1 = datas[index];
      var tip2 = datas[index + Math.ceil(Math.random() * 10)];
      setTimeout(function(){
        that.setData({
          start: false
        })
        that.setData({
          tip1: tip1.name.substring(0, 4) + "…刚刚抢到" + tip1.money + "元现金红包",
          tip2: tip2.name.substring(0, 4) + "…刚刚抢到" + tip2.money + "元现金红包",
          start: true
        })
      },1000)

      setTimeout(scrollInfo, 3000);
      
    }

    timer2 = setTimeout(function () {
      scrollInfo();
    }, 1000)
  },
  //创建一个火山createVolcano
  getUserInfo:function(e){
    var that = this;
    console.log(e.detail.userInfo);
    if (e.detail.userInfo != undefined){
      app.globalData.userInfo = e.detail.userInfo
      //重新授权
      wx.login({
        success: res => {
          CODE = res.code;
          wx.getUserInfo({
            data: {
              withCredentials: true
            },
            success: function (res) {
              encryptedData = encodeURI(res.encryptedData);
              iv = encodeURI(res.iv);
              checkBinding(that,0);
            }
          })
        }
      })
      this.setData({
        userInfo: e.detail.userInfo,
        hasUserInfo: true
      })
    }
    // return false;
    // clearInterval(timer);
    
    // var that = this;
    // wx.request({
    //   url: 'https://xiaochegnxu.xsawe.top/v3/volcano/entryVolcano',
    //   data: {
    //     userId: app.globalData.userId,
    //     volcanoId: "0"
    //   },
    //   method: "GET",
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   success: function (res) {
    //     // console.log(res);
    //     var da = res.data.res;
    //     if (res.data.code == "10000") {
    //       var recordList = da.recordList;
    //       volcanoId = recordList[0].teamId;
    //       countdown = recordList[0].creatTime;
    //       var emptyArry = new Array();
    //       if (recordList.length > 0 && recordList.length < 4) {
    //         for (var i = 0; i < 4 - recordList.length; i++) {
    //           emptyArry.push("");
    //         }
    //       }
    //       if (recordList.length > 0) {
    //         for (var i = 0; i < recordList.length; i++) {
    //           if (recordList[i].userId == userId) {
    //             isJoin = true;
    //           }
    //         }
    //       }
    //       that.setData({
    //         recordList: recordList,
    //         emptyArry: emptyArry,
    //         isJoin: isJoin,
    //         showResult: false,
    //         moneyResult: 0
    //       })
    //       //火山倒计时
    //       timer = setInterval(function () {
    //         var now = new Date();
    //         if (new Date(countdown + 86400000) - new Date()<=0) {
    //           clearInterval(timer);
    //         }
    //         var countdown_ = new Date(countdown + 86400000) - new Date();
    //         that.setData({
    //           countdown: Util.countdown(countdown_)
    //         })
    //       }, 1000)
    //     } else if (res.data.code == "200009"){
    //       wx.showModal({
    //         title: "",
    //         content: "您还有未完成点火山红包",
    //         showCancel: false,
    //         success: function (res) {
    //           if (res.confirm) {
    //           }
    //         }
    //       })
    //       return false;
    //     }
    //   },
    //   fail: function (err) {
    //     console.log(err)
    //   }
    // })
  },
  //加入火山抢红包
  entryVolcano:function(){
    var that = this;
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/v3/volcano/entryVolcano',
      data: {
        userId: app.globalData.userId,
        volcanoId: volcanoId
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var da = res.data.res;
        // console.log(res);
        if (res.data.code == 10000) {
          var recordList = da.recordList;
          volcanoId = recordList[0].teamId;
          var emptyArry = new Array();
          if (recordList.length > 0 && recordList.length < 4) {
            for (var i = 0; i < 4 - recordList.length; i++) {
              emptyArry.push("");
            }
          }
          
          if(recordList.length > 0) {
            for (var i = 0; i < recordList.length; i++) {
              if (recordList[i].userId == app.globalData.userId) {
                isJoin = true;
              }
            }
          }
          that.setData({
            recordList: recordList,
            emptyArry: emptyArry,
            isJoin: isJoin
          })

          if (recordList.length == 4) {
            wx.navigateTo({
              url: '../game/game?voiceId=' + volcanoId
            })
          }
        } else if (res.data.code == 200009){
          wx.showModal({
            title: '',
            content: '您还有未完成点火山红包',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
          return false;
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  //立刻激活火山
  openVolcano:function(){
    var that = this;
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/v3/volcano/openVolcano',
      data: {
        userId: app.globalData.userId,
        volcanoId: volcanoId
      },
      method: "GET",
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 10000) {
          app.globalData.money = res.data.res.redPackageMoney.money;
          wx.navigateTo({
            url: '../game/game?volcanoId=' + volcanoId
          })
        } else if (res.data.code == 200013){
          wx.showModal({
            title: '',
            content: '红包雨只能抢一次哦！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
          return false;
        }
      }
    })
  },
  confirm: function (e) {
    var that = this;
    //注册
    if (phone == "" || auth == "" || phone.length < 11 || auth.length < 4) {
      var content;
      if (phone == "") {
        content = "手机号码不能为空";
      } else if (phone.length < 11) {
        content = "手机号码格式错误";
      } else if (auth == "") {
        content = "验证码不能为空";
      } else if (auth.length < 4) {
        content = "验证码格式错误";
      }
      wx.showModal({
        title: "",
        content: content,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            
          }
        }
      })
      return false;
    }else{
      //注册
      var avatarUrl = app.globalData.userInfo.avatarUrl;
      if (avatarUrl == ""){
        avatarUrl = "http://file.xsawe.top/user/userboy_01.png";
      }
      var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(CODE + avatarUrl + auth + app.globalData.userInfo.nickName + phone + app.globalData.platformOpenId + "2" + app.globalData.platformUid + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
      var that = this;
      wx.request({
        url: 'https://xiaochegnxu.xsawe.top/v2/login/registerByPhoneSelective',
        data: Util.json2Form({
          accessToken: CODE,
          avatarUrl: avatarUrl,
          authNum: auth,
          nickName: app.globalData.userInfo.nickName,
          phone: phone,
          platformOpenId: app.globalData.platformOpenId,
          platformType: "2",
          platformUid: app.globalData.platformUid
        }),
        method: "POST",
        header: {
          'content-type': 'application/x-www-form-urlencoded',
          'versionmoli': '2.5.0',
          'phonetype': 'H5',
          'platformmoli': 'H5',
          'phoneid': 'H5',
          'sign': sign,
          'uid': '0'
        },
        success: function (res) {
          console.log(res);
          var content = "";
          if (res.data.code == 10000) {
            wx.showModal({
              title: "",
              content: "注册成功",
              showCancel: false,
              success: function (res) {

                that.setData({
                  register: false
                })
                if (res.confirm) {
                  // wx.navigateTo({
                  //   url: '../redPackets/redPackets'
                  // })
                }
              }
            })
            app.globalData.userId = res.data.res.resMap.user.id;
          } else if (res.data.code == 123400) {
            wx.showModal({
              title: "",
              content: "验证码失效，请重新输入",
              showCancel: false,
              success: function (res) {
                if (res.confirm) {
                }
              }
            })
          }
          // this.setData({
          //   modalStatus: true
          // })
        }
      })
    }
    //重新授权
    // wx.login({
    //   success: res => {
    //     CODE = res.code;
    //     wx.getUserInfo({
    //       data: {
    //         withCredentials: true
    //       },
    //       success: function (res) {
    //         encryptedData = encodeURI(res.encryptedData);
    //         iv = encodeURI(res.iv);
    //       }
    //     })
    //   }
    // })
  },
  bindPhoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
    phone = e.detail.value;
  },
  bindAuthInput: function (e) {
    auth = e.detail.value
  },
  //获取验证码
  getPhoneAuth: function (e) {
    console.log(e);
    var phone = e.currentTarget.dataset.phone;
    if (phone == undefined || phone.length < 11) {
      var content;
      if (phone == undefined) {
        content = "手机号码不能为空！"
      } else if (phone.length < 11) {
        content = "手机号码格式错误！"
      }
      wx.showModal({
        title: "",
        content: content,
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
          }
        }
      })
      return false;
    }

    var that = this;
    var times = 60;
    authTimer = setInterval(function () {
      times--;
      if (times <= 0) {
        clearInterval(authTimer);
        that.setData({
          authTip: "重新发送"
        })
      } else {
        that.setData({
          authTip: "重新发送(" + times + "s)",
          authStatus: "off"
        })
      }
    }, 1000)

    var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts("0" + phone + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
    var that = this;
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/v2/login/getPhoneAuth',
      data: Util.json2Form({
        functionType: "0",
        phone: phone
      }),
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'versionmoli': '2.5.0',
        'phonetype': 'H5',
        'platformmoli': 'H5',
        'phoneid': 'H5',
        'sign': sign,
        'uid': '0'
      },
      success: function (res) {
        console.log(res);
        if (res.data.code = 10000) {

        } else if (res.data.code = 123500) {
          wx.showModal({
            title: '',
            content: '该手机号已经注册',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
        } else if (res.data.code = 122800) {
          wx.showModal({
            title: '',
            content: '验证码发送失败,1分钟内不重新发送!',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
        } else if (res.data.code = 100906) {
          wx.showModal({
            title: '',
            content: '频繁操作，请稍后重试！',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
        } else if (res.data.code = 100903) {
          console.log("今日获取短信验证码次数已达上限!")
          wx.showModal({
            title: '',
            content: '今日获取短信验证码次数已达上限',
            showCancel: false,
            success: function (res) {
              if (res.confirm) {
                // console.log('用户点击确定')
              }
            }
          })
        }
      }
    })
  },
  //分享火山
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    var shareId = null;
    if (userId_ != null){
      shareId = userId_;
    }else{
      shareId = app.globalData.userId;
    }
    return {
      title: res.target.dataset.sharetitle,
      path: "/pages/redPackets/redPackets?userId=" + shareId,
      imageUrl: res.target.dataset.shareimg,
      success: function (res) {
        // 转发成功
        // console.log(res);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  getMoney: function (e) {
    wx.navigateTo({
      url: '../myMoney/myMoney'
    })
  },
  goto_index: function(e){
    console.log(e.detail.formId);
    var that = this;
    var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(e.detail.formId + userId + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/v3/volcano/addFormIds',
      data: Util.json2Form({
        formId: e.detail.formId,
        userId: userId
      }),
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'versionmoli': '2.5.0',
        'phonetype': 'H5',
        'platformmoli': 'H5',
        'phoneid': 'H5',
        'sign': sign,
        'uid': '0'
      },
      success: function (res) {
        console.log(res);
      }
    })
  },
  targetHome: function(){
    wx.redirectTo({
      url: '../index/index'
    })
  }
})