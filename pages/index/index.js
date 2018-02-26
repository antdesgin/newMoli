//index.js
//获取应用实例
const app = getApp()
let historyAudio = null;
let historyNum = null;
let index_ = 0;
let index_2 = 0;
let positionStatus = null;
let timer;
let timer2;
let AccessToken = null;
let ServerTime = null;
let Versionmoli = '2.5.0';
let Phonetype = 'H5';
let Platformmoli = 'H5';
let Phoneid = 'H5';
let phone = "";
let auth = "";
let authTimer;
let storyPageList = null;
let CODE;
let encryptedData;
let iv;
let userId;
let platformUid;
var playCountTime;
var playCountTime2;
var playTimer;
var Util = require('../../utils/util.js');
var MD5 = require('../../utils/MD5.js');
var CusBase64 = require('../../utils/Base64.js'); 

//加密参数 
function getEncrypts(str) {
  return CusBase64.CusBASE64.encoder(str); 
};

//初始化加密
function startEncrypt() {
  wx.request({
    url: 'https://xiaochegnxu.xsawe.top/v2/login/refreshAccessToken?userId=0',
    method: "POST",
    success: function (res) {
      AccessToken = res.data.res.accessToken;
      // console.log("AccessToken:" + AccessToken);
    },
    fail: function (err) {
      console.log(err)
    }
  })
};

//检测微信是否绑定
function checkBinding(that,type) {
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
      if (res.data.code == 10000) {
        var binner = res.data.res.resMap.binner;
        AccessToken = res.data.res.resMap.accessToken;
        userId = res.data.res.resMap.user.id;
        app.globalData.binner = binner;
        app.globalData.userId = userId;
        that.setData({
          // binner: binner,
          checkBinding: false
        })
        // if (type == 0){
        //   wx.navigateTo({
        //     url: '../redPackets/redPackets'
        //   })
        //   that.setData({
        //     register: false,
        //     binner: false
        //   })
        // }
      } else if (res.data.code == 123700) {
        //未注册用户弹出绑定窗口
        // that.setData({
        //   register:true,
        //   binner:false
        // })
        // app.globalData.platformOpenId = res.data.res.platformuserobj.id,
        // app.globalData.platformUid = res.data.res.platformuserobj.unionid;
      }
    }
  })
}
function MathRand(count) {
  var Num = "";
  for (var i = 0; i < count; i++) {
    Num += Math.floor(Math.random() * 10);
  }
  return Num;
}
function loadMore(that){
  // console.log("reload");
  wx.request({
    url: 'https://xiaochegnxu.xsawe.top/moli_audio_consumer/v2/story/selectIndexRecommend',
    data: {
      dataType: "new",
      pageNum: "2",
      pageSize: "5",
      appId: MathRand(6)
    },
    method: "GET",
    header: {
      'content-type': 'application/json',
      'versionmoli': '2.5.0',
      'phonetype': 'H5',
      'platformmoli': 'H5',
      'phoneid': 'h5',
      'sign': "sign",
      'uid': 0
    },
    success: function (res) {
      var da = res.data.res;
      // console.log(res);
      if (res.data.code == 10000 && da.storyPageList.result) {
        var list = da.storyPageList.result;
        if (list.length > 0) {
          for (var i = 0; i < list.length; i++) {
            list[i].sample = list[i].sample.split(",");
            if (list[i].image != "") {
              list[i].image = list[i].image.split(",");
            }
            storyPageList.push(list[i]);
          }

          // console.log(storyPageList);
          that.setData({
            storyPageList: storyPageList,
          })
        }
      }
    },
    fail: function (err) {
      console.log(err)
    }
  })
}

function reloadList(that){
  clearInterval(playTimer);
  clearInterval(timer);
  clearInterval(timer2);
  if (historyNum != null){
    that.audioCtx = wx.createAudioContext('music_' + historyNum);
    that.audioCtx.pause();
    that.audioCtx.seek(0);
  }
  if (historyAudio != null) {
    that.audioCtx = wx.createAudioContext('music_' + historyAudio);
    that.audioCtx.pause();
    that.audioCtx.seek(0);
  }
  historyNum = null;
  historyAudio = null;
  index_ = 0;
  index_2 = 0;
  that.setData({
    isPlay: false,
    _num: null,
    positionX: "0",
    positionX2: "0",
    percent: 0,
    playCountTime: null,
    playCountTime2: null
  })
  wx.showNavigationBarLoading(); //在标题栏中显示加载
  wx.stopPullDownRefresh({
    success: function () {
      if (app.globalData.userInfo) {
        that.setData({
          userInfo: app.globalData.userInfo,
          hasUserInfo: true
        })
      } else if (that.data.canIUse) {
        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        // 所以此处加入 callback 以防止这种情况
        app.userInfoReadyCallback = res => {
          that.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      } else {
        // 在没有 open-type=getUserInfo 版本的兼容处理
        wx.getUserInfo({
          success: res => {
            app.globalData.userInfo = res.userInfo
            that.setData({
              userInfo: res.userInfo,
              hasUserInfo: true
            })
          }
        })
      }

      // var that = this;
      wx.request({
        url: 'https://xiaochegnxu.xsawe.top/moli_audio_consumer/v2/story/selectIndexRecommend',
        data: {
          dataType: "new",
          pageNum: "1",
          pageSize: "2",
          appId: MathRand(6)
        },
        method: "GET",
        header: {
          'content-type': 'application/json',
          'versionmoli': '2.5.0',
          'phonetype': 'H5',
          'platformmoli': 'H5',
          'phoneid': 'h5',
          'sign': "sign",
          'uid': 0
        },
        success: function (res) {
          var da = res.data.res;
          // console.log(res);
          if (res.data.code == 10000) {
            storyPageList = da.storyPageList.result;
            if (storyPageList.length > 0) {
              for (var i = 0; i < storyPageList.length; i++) {
                storyPageList[i].sample = storyPageList[i].sample.split(",");
                if (storyPageList[i].image != "") {
                  storyPageList[i].image = storyPageList[i].image.split(",");
                }
              }
              that.setData({
                storyPageList: storyPageList,
                playAvatarUrl: storyPageList[0].userImage,
                playContent: storyPageList[0].content,
                playNickName: storyPageList[0].userName
              })
            }
          }
          wx.hideNavigationBarLoading() //完成停止加载
          wx.stopPullDownRefresh() //停止下拉刷新
        },
        fail: function (err) {
          console.log(err)
        }
      })
    }
  })

  if (historyAudio != null) {
    that.audioCtx = wx.createAudioContext('music_' + historyAudio);
    that.audioCtx.pause();
    that.audioCtx.seek(0);
    index_ = 0;
    index_2 = 0;
    clearInterval(timer);
    clearInterval(timer2);
    that.setData({
      positionX: "0",
      positionX2: "0",
      _num: null,
      isPlay: false
    })
    historyAudio = null;
    historyNum = null;
  }
}

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isPlay: false,
    percent: 0,
    positionX: 0,
    binner: false,
    register: app.globalData.register,
    authTip: "获取验证码",
    checkBinding: true,
    isIphoneX: false,
    loadingHidden: false
  },
  onShow: function () {
    startEncrypt();
    if (historyAudio != null) {
      this.audioCtx = wx.createAudioContext('music_' + historyAudio);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
    }
    historyAudio = null;
    historyNum = null;
    index_ = 0;
    index_2 = 0;
    positionStatus = null;
    clearInterval(timer);
    clearInterval(timer2);
    this.setData({
      positionX: "0",
      positionX2: "0",
      percent: 0,
      _num: null,
      isPlay: false
    })
    clearInterval(authTimer);

    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        if (res.model.indexOf("iPhone X") == 0) {
          that.setData({
            isIphoneX: true
          })
        }
      }
    })
  },
  onLoad: function () {
    
    var that = this;
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
            checkBinding(that);
          },
          fail: function(){
            that.setData({
              checkBinding: false
            })
          }
        })
      }
    })

    // startEncrypt();
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  onReady: function () {
    var that = this;
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/moli_audio_consumer/v2/story/selectIndexRecommend',
      data: {
        dataType: "new",
        pageNum: "1",
        pageSize: "5",
        appId: MathRand(6)
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'versionmoli': '2.5.0',
        'phonetype': 'H5',
        'platformmoli': 'H5',
        'phoneid': 'h5',
        'sign': "sign",
        'uid': 0
      },
      success: function (res) {
        var da = res.data.res;
        console.log(res);
        if (res.data.code == 10000 && da.storyPageList.result) {
          storyPageList = da.storyPageList.result;
          if (storyPageList.length > 0) {
            for (var i = 0; i < storyPageList.length; i++) {
              storyPageList[i].sample = storyPageList[i].sample.split(",");
              if (storyPageList[i].image != "") {
                storyPageList[i].image = storyPageList[i].image.split(",");
              }
            }
            that.setData({
              storyPageList: storyPageList,
              playAvatarUrl: storyPageList[0].userImage,
              playContent: storyPageList[0].content,
              playNickName: storyPageList[0].userName,
              loadingHidden: true
            })
          }
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    reloadList(this);
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // loadMore(this);
    // reloadList(this);
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: res.target.dataset.sharetitle,
      path: "/pages/detail/detail?voiceId=" + res.target.dataset.voiceid + "&userId=" + res.target.dataset.userid,
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
  previewImage: function(e) {
    var current = e.target.dataset.src;
    var imgalist = e.target.dataset.imgalist;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imgalist // 需要预览的图片http链接列表  
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  bindPhoneInput: function(e){
    this.setData({
      phone: e.detail.value
    })
    phone = e.detail.value;
  },
  bindAuthInput: function (e) {
    auth = e.detail.value
  },
  //获取验证码
  getPhoneAuth: function(e){
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
    authTimer = setInterval(function(){
      times--;
      if (times <= 0){
        clearInterval(authTimer);
        that.setData({
          authTip: "重新发送"
        })
      }else{
        that.setData({
          authTip: "重新发送(" + times + "s)",
          authStatus: "off"
        })
      }
    },1000)

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
  bindDetailTap: function(e){
    clearInterval(playTimer);
    clearInterval(timer);
    clearInterval(timer2);
    if (historyNum != null) {
      this.audioCtx = wx.createAudioContext('music_' + historyNum);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
    }
    if (historyAudio != null) {
      this.audioCtx = wx.createAudioContext('music_' + historyAudio);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
    }
    historyNum = null;
    historyAudio = null;
    index_ = 0;
    index_2 = 0;
    this.setData({
      isPlay: false,
      _num: null,
      positionX: "0",
      positionX2: "0",
      percent: 0,
      playCountTime: null,
      playCountTime2: null
    })
    wx.navigateTo({
      url: "/pages/detail/detail?voiceId=" + e.currentTarget.dataset.voiceid + "&userId=" + e.currentTarget.dataset.userid,
    })
  },
  // bindRedPacketsTap: function () {
  //   wx.getSetting({
  //     success: res => {
  //       if (res.authSetting['scope.userInfo']) {
  //         if (app.globalData.userId>0){
  //           wx.navigateTo({
  //             url: '../redPackets/redPackets'
  //           })
  //         }
  //       }
  //     }
  //   })
  // },
  play: function(e){
    clearInterval(playTimer);
    this.setData({
      playAvatarUrl: storyPageList[e.target.dataset.num].userImage,
      playContent: storyPageList[e.target.dataset.num].content,
      playNickName: storyPageList[e.target.dataset.num].userName
    })
    if(historyAudio != null && historyAudio != e.target.dataset.num){
      this.audioCtx = wx.createAudioContext('music_' + historyAudio);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
      index_ = 0;
      index_2 = 0;
      clearInterval(timer);
      clearInterval(timer2);
      this.setData({
        positionX: "0",
        positionX2: "0"
      })
      var timeObj = e.target.dataset.time.split(":");
      playCountTime = parseInt(timeObj[0]) * 60 + parseInt(timeObj[1]);
      playCountTime2 = playCountTime;
    }
    if(historyAudio == e.target.dataset.num){
      this.audioCtx = wx.createAudioContext('music_' + historyAudio);
      this.audioCtx.pause();
      historyAudio = null;
      historyNum = e.target.dataset.num;
      this.setData({
        _num: null,
        isPlay: false
      })
      var that = this;
      if(index_ + 5.5 <= 340){
        clearInterval(timer);
        that.setData({
          positionX: index_ + "rpx"
        })
      }else{
        clearInterval(timer2);
        that.setData({
          positionX2: "-" + index_2 + "rpx"
        })
      }
    }else{
      
      if (historyNum != e.target.dataset.num){
        index_ = 0;
        this.setData({
          positionX: index_ + "rpx"
        })
        var timeObj = e.target.dataset.time.split(":");
        playCountTime = parseInt(timeObj[0]) * 60 + parseInt(timeObj[1]);
        playCountTime2 = playCountTime;
      }
      this.setData({
        _num: e.target.dataset.num,
        positionStatus: e.target.dataset.num,
        isPlay: true,
        playCountTime: Util.formatSeconds(playCountTime),
        playCountTime2: Util.formatSeconds(playCountTime)
      })
      this.audioCtx = wx.createAudioContext('music_' + e.target.dataset.num);
      this.audioCtx.play();
      historyAudio = e.target.dataset.num;
      var that = this;
      timer = setInterval(function(){
        index_ = index_ + 5.5;
        if (index_ > 340){
          clearInterval(timer);
          timer2 = setInterval(function () {
            index_2 = index_2 + 5.5;
            that.setData({
              positionX2: "-" + index_2 + "rpx"
            })
          }, 100)
        }else{
          that.setData({
            positionX: index_ + "rpx"
          })
        }
      },100)

      // 音频播放倒计时
      playTimer = setInterval(function () {
        playCountTime--;
        if (playCountTime <= -1) {
          clearInterval(timer2);
        } else {
          that.setData({
            playCountTime: Util.formatSeconds(playCountTime)
          })
        }
      }, 1000)
    }
  },
  audioStart: function(e){
    var progress = parseInt((e.detail.currentTime / e.detail.duration) * 100);
    if (progress == 100){
      progress = 0;
      clearInterval(timer2);
      this.setData({
        isPlay: false,
        positionX: "0",
        positionX2: "0"
      })
    }
    this.setData({
      percent: progress
    })
  },
  audioEnd: function(e){
    clearInterval(playTimer);
    clearInterval(timer);
    clearInterval(timer2);
    historyNum = historyAudio;
    historyAudio = null;
    index_ = 0;
    index_2 = 0;
    playCountTime = playCountTime2;
    this.setData({
      isPlay: false,
      _num: null,
      positionX: "0",
      positionX2: "0",
      percent: 0
    })
  },
  changePlayStatus: function(e){
    clearInterval(playTimer);
    if (historyAudio != null){
      historyNum = historyAudio;
      this.audioCtx = wx.createAudioContext('music_' + historyAudio);
      this.audioCtx.pause();
      historyAudio = null;
      
      this.setData({
        _num: null,
        isPlay: false
      })
      var that = this;
      if (index_ + 5.5 <= 340) {
        clearInterval(timer);
        that.setData({
          positionX: index_ + "rpx"
        })
      }else{
        clearInterval(timer2);
        that.setData({
          positionX2: "-" + index_2 + "rpx"
        })
      }
    } else if (historyAudio == null && historyNum != null){
      this.audioCtx = wx.createAudioContext('music_' + historyNum);
      this.audioCtx.play();
      historyAudio = historyNum;
      historyNum = null;
      this.setData({
        _num: historyAudio,
        isPlay: true,
        playCountTime: Util.formatSeconds(playCountTime)
      })
      var that = this;
      timer = setInterval(function () {
        index_ = index_ + 5.5;
        if (index_ > 340) {
          clearInterval(timer);
          timer2 = setInterval(function () {
            index_2 = index_2 + 5.5;
            that.setData({
              positionX2: "-" + index_2 + "rpx"
            })
          }, 100)
        } else {
          that.setData({
            positionX: index_ + "rpx"
          })
        }
      }, 100)
      // 音频播放倒计时
      playTimer = setInterval(function () {
        playCountTime--;
        if (playCountTime <= -1) {
          clearInterval(timer2);
        } else {
          that.setData({
            playCountTime: Util.formatSeconds(playCountTime)
          })
        }
      }, 1000)
    } else if (historyAudio == null && historyNum == null){
      var timeObj = e.target.dataset.time.split(":");
      playCountTime = parseInt(timeObj[0]) * 60 + parseInt(timeObj[1]);
      playCountTime2 = playCountTime;
      // console.log(Util.formatSeconds(playCountTime));
      index_ = 0;
      this.setData({
        _num: 0,
        positionStatus: 0,
        isPlay: true,
        positionX: index_ + "rpx",
        playCountTime: Util.formatSeconds(playCountTime),
        playCountTime2: Util.formatSeconds(playCountTime)
      })
      this.audioCtx = wx.createAudioContext('music_0');
      this.audioCtx.play();
      historyAudio = 0;
      var that = this;
      timer = setInterval(function () {
        index_ = index_ + 5.5;
        if (index_ > 340) {
          clearInterval(timer);
          timer2 = setInterval(function () {
            index_2 = index_2 + 5.5;
            that.setData({
              positionX2: "-" + index_2 + "rpx"
            })
          }, 100)
        } else {
          that.setData({
            positionX: index_ + "rpx"
          })
        }
      }, 100)

      // 音频播放倒计时
      playTimer = setInterval(function () {
        playCountTime--;
        if (playCountTime <= -1) {
          clearInterval(timer2);
        } else {
          that.setData({
            playCountTime: Util.formatSeconds(playCountTime)
          })
        }
      }, 1000)
    }
  },
  pasue: function(e){
    this.setData({
      // playType: "play",
      _num: e.target.dataset.num
    })
    console.log("pasue"+e.target.dataset.num);
    // this.audioCtx = wx.createAudioContext('myAudio');
    // this.audioCtx.pause();
  },
  //进入红包活动页
  tatgetRedPacket: function(e) {
    wx.navigateTo({
      url: '../redPackets/redPackets'
    })
    // var that = this;
    // if (e.detail.userInfo != undefined){
    //   app.globalData.userInfo = e.detail.userInfo
    //   //重新授权
    //   wx.login({
    //     success: res => {
    //       CODE = res.code;
    //       wx.getUserInfo({
    //         data: {
    //           withCredentials: true
    //         },
    //         success: function (res) {
    //           encryptedData = encodeURI(res.encryptedData);
    //           iv = encodeURI(res.iv);
    //           checkBinding(that,0);
    //         }
    //       })
    //     }
    //   })
    //   this.setData({
    //     userInfo: e.detail.userInfo,
    //     hasUserInfo: true
    //   })
    // }
  },
  //点赞
  bindLikeTap: function(e){
    if (userId == undefined){
      return false;
    }
    var voiceId = e.currentTarget.dataset.voiceid;
    var that = this;
    var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts("agree" + "story" + voiceId + userId + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/moli_audio_consumer/v2/action/insertAction',
      method: "POST",
      data: Util.json2Form({
        actionType: "agree",
        typeId: voiceId,
        type: "story",
        userId: userId,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'versionmoli': '2.5.0',
        'phonetype': 'H5',
        'platformmoli': 'H5',
        'phoneid': 'H5',
        'sign': sign,
        'uid': userId
      },
      success: function (res) {
        if (res.data.code == 10000) {
          var isAgree = e.currentTarget.dataset.isagree;
          var agreeCount = storyPageList[e.currentTarget.dataset.index].agreeCount;
          if (isAgree == "false"){
            isAgree = "true";
            agreeCount = agreeCount + 1;
          }else{
            isAgree = "false";
            agreeCount = agreeCount - 1;
          }
          storyPageList[e.currentTarget.dataset.index].isAgree = isAgree;
          storyPageList[e.currentTarget.dataset.index].agreeCount = agreeCount;
          that.setData({
            storyPageList: storyPageList
          })
        }
      },
      fail: function (err){
        console.log(err)
      }
    })
  },
  close:function(){
    this.setData({
      binner:false
    })
  },
  confirm: function(e){
    var that = this;
    //注册
    if (phone == "" || auth == "" || phone.length < 11 || auth.length < 4) {
      var content="";
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
    }
    // wx.showToast({
    //   title: '注册中',
    //   icon: 'loading',
    //   duration: 10000
    // })
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
          }
        })
      }
    })
    // console.log(app.globalData.platformOpenId);
    // console.log(app.globalData.platformUid);
    var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(CODE + app.globalData.userInfo.avatarUrl + auth + app.globalData.userInfo.nickName + phone + app.globalData.platformOpenId + "2" + app.globalData.platformUid + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
    var that = this;
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/v2/login/registerByPhoneSelective',
      data: Util.json2Form({
        accessToken: CODE,
        avatarUrl: app.globalData.userInfo.avatarUrl,
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
        if (res.data.code == 10000){
          wx.showModal({
            title: "",
            content: "注册成功",
            showCancel: false,
            success: function (res) {
              // console.log(res);
              that.setData({
                register: false
              })
              if (res.confirm){
                // wx.navigateTo({
                //   url: '../redPackets/redPackets'
                // })
              }
            }
          })
        } else if (res.data.code == 123400){
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
      }
    })
  }
})
