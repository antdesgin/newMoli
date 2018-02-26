const app = getApp()
let historyAudio = null;
let historyNum = null;
let commentHistory = null;
let index_ = 0;
let index_2 = 0;
let timer;
let timer2;
let _commentIndex = null;
let AccessToken = null;
let ServerTime = null;
let Versionmoli = '2.5.0';
let Phonetype = 'H5';
let Platformmoli = 'H5';
let Phoneid = 'H5';
let story = null;
var playCountTime;
var playTimer;
var Util = require('../../utils/util.js');
var MD5 = require('../../utils/MD5.js');
var CusBase64 = require('../../utils/Base64.js');
let commengList = null;
//加密参数 
function getEncrypts(str) {
  return CusBase64.CusBASE64.encoder(str);
};

//初始化加密
function startEncrypt() {
  var userId = "0";
  if (app.globalData.userId != ""){
    userId = app.globalData.userId;
  }
  wx.request({
    url: 'https://xiaochegnxu.xsawe.top/v2/login/refreshAccessToken?userId=' + userId,
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
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    isPlay: false,
    percent: 0
  },
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      // console.log(res.target)
    }
    return {
      title: res.target.dataset.sharetitle,
      path: "/pages/detail/detail?voiceId=" + res.target.dataset.voiceid,
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
  onShow: function(){
    startEncrypt();
    if (historyAudio != null) {
      this.audioCtx = wx.createAudioContext('comment_' + historyAudio);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
    }
    if (commentHistory != null) {
      this.audioCtx = wx.createAudioContext('comment_' + commentHistory);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
    }
    historyAudio = null;
    historyNum = null;
    commentHistory = null;
    index_ = 0;
    index_2 = 0;
    this.setData({
      positionStatus: 0,
    })
    _commentIndex = null;
    clearInterval(timer);
    clearInterval(timer2);
    clearInterval(playTimer);
  },
  onLoad: function (options){
    var id = options.voiceId;
    var userId_ = options.userId;
    if (app.globalData.userId != ""){
      userId_ = app.globalData.userId;
    }
    var that = this;
    //主贴详情
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/moli_audio_consumer/v2/story/selectStoryInfo',
      data: {
        id: id,
        userId: userId_
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'versionmoli': '2.5.0',
        'phonetype': 'H5',
        'platformmoli': 'H5',
        'phoneid': 'h5',
        'sign': "sign",
        'uid': "0"
      },
      success: function (res) {
        console.log(res);
        var da = res.data.res;
        if (res.data.code == 10000) {
          story = da.story;
          story.sample = story.sample.split(",");
          if (story.image != "") {
            story.image = story.image.split(",");
          }
          that.setData({
            story: story
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
    //回帖详情 pageNum pageSize typeId type:"story"
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/moli_audio_consumer/v2/comment/selectPageCommentList',
      data: {
        pageNum: "1",
        pageSize: "10",
        typeId: id,
        type: "story"
      },
      method: "GET",
      header: {
        'content-type': 'application/json',
        'versionmoli': '2.5.0',
        'phonetype': 'H5',
        'platformmoli': 'H5',
        'phoneid': 'h5',
        'sign': "sign",
        'uid': '0'
      },
      success: function (res) {
        var da = res.data.res;
        if (res.data.code == 10000) {
          commengList = da.commentPageList.result;
          if (commengList.length > 0){
            for (var i = 0; i < commengList.length;i++){
              //格式化回复时间并格式化
              commengList[i].createTime = Util.setTime(commengList[i].createTime)
            }
          }
          that.setData({
            commengList: commengList
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })

  },
  previewImage: function (e) {
    var current = e.target.dataset.src;
    var imgalist = e.target.dataset.imgalist;
    wx.previewImage({
      current: current, // 当前显示图片的http链接  
      urls: imgalist // 需要预览的图片http链接列表  
    })
  },
  play: function (e) {
    clearInterval(playTimer);
    if(commentHistory != null){
      this.setData({
        _commentIndex: null
      })
      this.audioCtx = wx.createAudioContext('comment_' + commentHistory);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
      commentHistory = null;
      _commentIndex = null;
    }
    if (historyAudio == e.target.dataset.num) {
      this.audioCtx = wx.createAudioContext('music_' + historyAudio);
      this.audioCtx.pause();
      historyAudio = null;
      historyNum = e.target.dataset.num;
      clearInterval(timer);
      this.setData({
        _num: null
      })
      var that = this;
      if (index_ + 5.5 <= 340) {
        that.setData({
          positionX: index_ + "rpx"
        })
      } else {
        clearInterval(timer2);
        that.setData({
          positionX2: "-" + index_2 + "rpx"
        })
      }
    } else {
      var timeObj = e.target.dataset.time.split(":");
      playCountTime = parseInt(timeObj[0]) * 60 + parseInt(timeObj[1]);
      this.setData({
        _num: e.target.dataset.num,
        positionStatus: e.target.dataset.num,
        playCountTime: Util.formatSeconds(playCountTime)
      })
      this.audioCtx = wx.createAudioContext('music_' + e.target.dataset.num);
      this.audioCtx.play();
      historyAudio = e.target.dataset.num;
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
  audioStart: function(){
    // console.log("audioStart");
  },
  audioEnd: function (e) {
    clearInterval(playTimer);
    clearInterval(timer2);
    _commentIndex = 0;
    commentHistory = 0;
    this.setData({
      _num: null,
      positionStatus: 0,
      positionX: "0",
      positionX2: "0",
      _commentIndex: _commentIndex
    })

    var timeObj = commengList[_commentIndex].time.split(":");
    playCountTime = parseInt(timeObj[_commentIndex]) * 60 + parseInt(timeObj[1]);
    console.log(playCountTime);
    this.audioCtx = wx.createAudioContext('comment_0');
    this.audioCtx.play();

    // 音频播放倒计时
    var that = this;
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
  },
  commentPlay: function(e){
    clearInterval(playTimer);
    this.setData({
      _num: null,
      positionStatus: 0,
      positionX: "0",
      positionX2: "0",
      _commentIndex: e.currentTarget.dataset.num,
      playCountTime: commengList[e.currentTarget.dataset.num].time
    })
    this.audioCtx = wx.createAudioContext('music_' + historyAudio);
    this.audioCtx.pause();
    this.audioCtx.seek(0);
    index_ = 0;
    historyAudio = null;
    clearInterval(timer);
    clearInterval(timer2);

    if (commentHistory == null && _commentIndex == null){
      commentHistory = e.currentTarget.dataset.num;
      this.audioCtx = wx.createAudioContext('comment_' + e.currentTarget.dataset.num);
      this.audioCtx.play();
      _commentIndex = e.currentTarget.dataset.num;

      //音频播放倒计时
      var that = this;
      var timeObj = commengList[_commentIndex].time.split(":");
      playCountTime = parseInt(timeObj[0]) * 60 + parseInt(timeObj[1]);
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
    } else if (commentHistory != null && commentHistory != e.currentTarget.dataset.num){
      this.audioCtx = wx.createAudioContext('comment_' + commentHistory);
      this.audioCtx.pause();
      this.audioCtx.seek(0);
      this.audioCtx = wx.createAudioContext('comment_' + e.currentTarget.dataset.num);
      this.audioCtx.play();
      _commentIndex = e.currentTarget.dataset.num;
      commentHistory = e.currentTarget.dataset.num;

      //音频播放倒计时
      var that = this;
      var timeObj = commengList[_commentIndex].time.split(":");
      playCountTime = parseInt(timeObj[0]) * 60 + parseInt(timeObj[1]);
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
    } else if (_commentIndex == e.currentTarget.dataset.num){
      if (commentHistory != null && e.currentTarget.dataset.num != commentHistory){
        this.audioCtx = wx.createAudioContext('comment_' + commentHistory);
        this.audioCtx.pause();
        this.audioCtx.seek(0);
      } else if (commentHistory != null && e.currentTarget.dataset.num != commentHistory){
        this.audioCtx = wx.createAudioContext('comment_' + e.currentTarget.dataset.num);
        this.audioCtx.play();
        commentHistory = e.currentTarget.dataset.num;
      } else if (e.currentTarget.dataset.num == commentHistory){
        this.audioCtx = wx.createAudioContext('comment_' + commentHistory);
        this.audioCtx.pause();
        this.audioCtx.seek(0);
        this.audioCtx = wx.createAudioContext('comment_' + e.currentTarget.dataset.num);
        this.audioCtx.pause();
        this.setData({
          _commentIndex: null
        })
        _commentIndex = null;
        commentHistory = null;
      }
    }

    
  },
  formSubmit: function (e) {
    console.log('form发生了submit事件，fromId为：', e.detail.formId)
    this.setDate({
      formId: e.detail.formId
    })
  },
  commentAudioEnd: function(){
    clearInterval(playTimer);
    _commentIndex = parseInt(_commentIndex) + 1;
    this.setData({
      _commentIndex: _commentIndex
    })
    this.audioCtx = wx.createAudioContext('comment_' + _commentIndex);
    this.audioCtx.play();
    commentHistory = _commentIndex;
    console.log(_commentIndex);
    var that = this;
    var timeObj = commengList[_commentIndex].time.split(":");
    playCountTime = parseInt(timeObj[0]) * 60 + parseInt(timeObj[1]);
    console.log(playCountTime);
    that.setData({
      playCountTime: commengList[_commentIndex].time
    })
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
  },
  //点赞
  bindLikeTap: function (e) {
    if (app.globalData.userId == "") {
      return false;
    }
    var voiceId = e.currentTarget.dataset.voiceid;
    var dataType = e.currentTarget.dataset.type;
    var that = this;
    var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts("agree" + "story" + voiceId + app.globalData.userId + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/moli_audio_consumer/v2/action/insertAction',
      method: "POST",
      data: Util.json2Form({
        actionType: "agree",
        typeId: voiceId,
        type: "story",
        userId: app.globalData.userId,
      }),
      header: {
        'content-type': 'application/x-www-form-urlencoded',
        'versionmoli': '2.5.0',
        'phonetype': 'H5',
        'platformmoli': 'H5',
        'phoneid': 'H5',
        'sign': sign,
        'uid': app.globalData.userId
      },
      success: function (res) {
        console.log(res);
        if (res.data.code == 10000) {
          var isAgree = e.currentTarget.dataset.isagree;
          var agreeCount;
          if (dataType != 0){
            agreeCount = story.agreeCount;
            if (isAgree == "false") {
              isAgree = "true";
              agreeCount = agreeCount + 1;
            } else {
              isAgree = "false";
              agreeCount = agreeCount - 1;
            }

            story.isAgree = isAgree;
            story.agreeCount = agreeCount;
            that.setData({
              story: story
            })
          }else{
            agreeCount = commengList[e.currentTarget.dataset.index].agreeCount;
            if (isAgree == "false") {
              isAgree = "true";
              agreeCount = agreeCount + 1;
            } else {
              isAgree = "false";
              agreeCount = agreeCount - 1;
            }
            
            commengList[e.currentTarget.dataset.index].isAgree = isAgree;
            commengList[e.currentTarget.dataset.index].agreeCount = agreeCount;
            that.setData({
              commengList: commengList
            })
          }
        }
      },
      fail: function (err) {
        console.log(err)
      }
    })
  }
})