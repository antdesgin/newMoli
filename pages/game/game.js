const app = getApp();
let volcanoId = null;
let AccessToken = null;
var Util = require('../../utils/util.js');
var MD5 = require('../../utils/MD5.js');
var CusBase64 = require('../../utils/Base64.js');
function getEncrypts(str) {
  return CusBase64.CusBASE64.encoder(str);
};

function randomInteger(low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low)
}
function randomFloat(low, high) {
  return low + Math.random() * (high - low);
}
function durationValue(value) {
  return value + "s";
}
var getMoney = new Array();
var moneys = 0;
var clicks = 0;
var index = null;
let images = ["http://moli2017.oss-cn-zhangjiakou.aliyuncs.com/weixinApp/flower.png", "http://moli2017.oss-cn-zhangjiakou.aliyuncs.com/weixinApp/red-packet.png"];
var arr = new Array();
Page({
  data: {
    array: arr,
    countdown: 5,
    isCountdown: false,
    gameCountdown: 20
  },
  onShow: function(){
    arr = new Array();
    this.setData({
      array: arr
    })
  },
  onLoad: function (options) {
    volcanoId = options.volcanoId;

    var rpAmount = app.globalData.money;
    var ppCount = 80;
    var rpResult = [];
    var rpRnds = [];
    var rpRndSum = 0;
    for (let i = 0; i < ppCount; i++) { 
      let rnd = Math.random(); 
      rpRndSum += rnd; 
      rpRnds.push(rnd); 
    }
    rpRnds.forEach((rnd) => { rpResult.push(parseFloat((rpAmount * rnd / rpRndSum).toFixed(2))) })
    getMoney = rpResult;
    // console.log({sum:rpResult.reduce((acc, val) => { return acc + val })});

    wx.request({
      url: 'https://xiaochegnxu.xsawe.top/v2/login/refreshAccessToken?userId=' + app.globalData.userId,
      method: "POST",
      success: function (res) {
        AccessToken = res.data.res.accessToken;
      },
      fail: function (err) {
        console.log(err)
      }
    })
  
  },
  onReady: function (e){
    var that = this;
    //倒计时
    var countdown = that.data.countdown;
    function countdownTimer() { 
      countdown--;
      that.setData({
        countdown: countdown
      })
      var countdownTimer_ = setTimeout(countdownTimer, 1000);
      //清除倒计时
      if (countdown == 0) {
        clearTimeout(countdownTimer_);
        that.setData({
          isCountdown: true
        })
      }
    }
    //倒计时开始
    setTimeout(function(){
      countdownTimer();
    },1000)

    var countdown2 = that.data.gameCountdown;
    function gameCountdown(){
      countdown2--;
      that.setData({
        gameCountdown: countdown2
      })
      var countdownTimer_2 = setTimeout(gameCountdown, 1000);
      //清除倒计时
      if (countdown2 == 0) {
        clearTimeout(countdownTimer_2);
        that.setData({
          isCountdown: true
        })
      }
    }
    setTimeout(function () {
      gameCountdown();
    }, 5000)
    
    //喷射红包
    function gamesStarts() {
      for (var i = 0; i < 30; i++) {
        var width = randomInteger(90, 128);
        var viewAnimationName = "fade, up";
        var spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpinAndFlip';
        /* 随机下落时间 */
        var fadeAndDropDuration = durationValue(randomFloat(1, 2));
        /* 随机旋转时间 */
        var spinDuration = durationValue(randomFloat(3, 4));
        // 随机delay时间
        var leafDelay = durationValue(randomFloat(0, 0));
        var top = randomInteger(-200, -300);
        var left = randomInteger(150, 500);
        var viewDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
        var viewDelay = leafDelay + ', ' + leafDelay;

        var viewStyle = "top:" + top + "rpx; left:" + left + "rpx;animation-name: " + viewAnimationName + ";animation-duration: " + viewDuration + "; animation-delay: " + viewDelay + ";width:" + width + "rpx;height:" + width + "rpx;"
        var imageStyle = "width:" + width + "rpx;height:" + width + "rpx;animation-name:" + spinAnimationName + ";animation-duration:" + spinDuration + "";
        var labelStyle = "width:" + width + "rpx;height:" + width + "rpx;line-height:" + width + "rpx";
        let location = {
          viewStyle: viewStyle,
          labelStyle: labelStyle,
          imageStyle: imageStyle,
          imageUrl: images[randomInteger(0, 1)],
          state: 0
        }
        arr.push(location);
      }
      that.setData({
        array: arr
      })
    };

    setTimeout(function(){
      gamesStarts();
    },5000);
   
    setTimeout(function(){
      arr = new Array();
      that.setData({
        array: arr
      })
      for (var i = 0; i < 80; i++) {
        var width = randomInteger(90, 128);
        var viewAnimationName = "fade, drop";
        var spinAnimationName = (Math.random() < 0.5) ? 'clockwiseSpin' : 'counterclockwiseSpinAndFlip';
        /* 随机下落时间 */
        var fadeAndDropDuration = durationValue(randomFloat(2, 5));
        /* 随机旋转时间 */
        var spinDuration = durationValue(randomFloat(3, 4));
        // 随机delay时间
        var leafDelay = durationValue(randomFloat(0, 20));
        var top = randomInteger(-200, -130);
        var left = randomInteger(0, 650);
        var viewDuration = fadeAndDropDuration + ', ' + fadeAndDropDuration;
        var viewDelay = leafDelay + ', ' + leafDelay;

        var viewStyle = "top:" + top + "rpx; left:" + left + "rpx;animation-name: " + viewAnimationName + ";animation-duration: " + viewDuration + "; animation-delay: " + viewDelay + ";width:" + width + "rpx;height:" + width + "rpx;"
        var imageStyle = "width:" + width + "rpx;height:" + width + "rpx;animation-name:" + spinAnimationName + ";animation-duration:" + spinDuration + "";
        var labelStyle = "width:" + width + "rpx;height:" + width + "rpx;line-height:" + width + "rpx";
        let location = {
          viewStyle: viewStyle,
          labelStyle: labelStyle,
          imageStyle: imageStyle,
          imageUrl: images[randomInteger(0, 1)],
          state: 0
        }
        arr.push(location);
      }
      that.setData({
        array: arr
      })

      setTimeout(function () {
        arr = new Array();
        that.setData({
          array: arr
        })
        app.globalData.gameStatus = false;
   
        var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(app.globalData.moneyResult + app.globalData.userId + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);

        console.log("money:" + app.globalData.moneyResult);
        console.log("userId:" + app.globalData.userId);
        console.log("volcanoId:" + volcanoId);

        wx.request({
          url: 'https://xiaochegnxu.xsawe.top/v3/volcano/robRedPackage',
          data: Util.json2Form({
            money: app.globalData.moneyResult,
            userId: app.globalData.userId,
            volcanoId: volcanoId
          }),
          method: "POST",
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
              wx.navigateTo({
                url: '../redPackets/redPackets?gameType=0'
              })
            }
          }
        })
      }, 25000)
    },5000)
  },
  openPacket: function(e){
    
    var that = this;
    index = e.currentTarget.dataset.index;

    if (that.data.array[index].state == 1) {
      that.arr[index].state = 0;
    } else if (that.data.array[index].state == 0) {
      that.data.array[index].state = 1;
      var money_ = 0;
      if (getMoney[index] == 0){
        money_ = getMoney[index]+ 0.01;
      }else{
        money_ = getMoney[index];
      }
      moneys = moneys + getMoney[index];
      that.data.array[index].money = money_;
    }
    that.setData({
      array: that.data.array
    })
    app.globalData.moneyResult = moneys.toFixed(2);
  
  }
})