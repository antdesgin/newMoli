//app.js
let platformType = "2";
var OPEN_ID = ''//储存获取到openid  
var SESSION_KEY = ''//储存获取到session_key
var CODE;
var encryptedData;
var iv;
let AccessToken = null;
let userId;
let platformUid;
// var Util = require('utils/util.js');
// var MD5 = require('utils/MD5.js');
// var CusBase64 = require('utils/Base64.js');
// // var WXBizDataCrypt = require('utils/WXBizDataCrypt.js');
// function getEncrypts(str) {
//   // console.log("str:" + str);
//   return CusBase64.CusBASE64.encoder(str);
// };


//初始化加密
// function startEncrypt() {
//   wx.request({
//     url: 'https://xiaochegnxu.xsawe.top/v2/login/refreshAccessToken?userId=0',
//     method: "POST",
//     success: function (res) {
//       // console.log(res);
//       AccessToken = res.data.res.accessToken;
//     },
//     fail: function (err) {
//       console.log(err)
//     }
//   })
// };
// startEncrypt();
App({
  globalData: {
    userInfo: null,
    binner: true,
    register:false,
    platformUid: null,
    platformOpenId: null,
    AccessToken:null,
    userId:"",
    money:0,
    moneyResult:0,
    gameStatus: true
  },
  onLaunch: function () {
    var that = this;
    // 登录
    wx.login({
      success: res => {
        // CODE = res.code;
        // console.log(CODE);
        
        wx.getUserInfo({
          data:{
            withCredentials:true
          },
          success: function (res) {
            // console.log(res);
            // encryptedData = encodeURI(res.encryptedData);
            // iv = encodeURI(res.iv);
            // checkBinding(that);
          }
        })
      }
    })
    //检测微信是否绑定
    function checkBinding(obj){
      var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(CODE + encryptedData + iv + "H5" + platformType+"2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
      wx.request({
        url: 'https://xiaochegnxu.xsawe.top/v2/login/loginSelective',
        data: Util.json2Form({
          accessToken: CODE,
          content: encryptedData,
          iv: iv,
          platformMark: "H5",
          platformType: platformType
          
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
          if (res.data.code == 10000){
            var binner = res.data.res.resMap.binner;
            AccessToken = res.data.res.resMap.accessToken;
            userId = res.data.res.resMap.user.id;
            that.globalData.binner = binner;
            that.globalData.userId = userId;
            // wx.navigateTo({
            //   url: '../redPackets/redPackets'
            // })
          } else if (res.data.code == 123700){
            //未注册用户弹出绑定窗口
            console.log("未注册用户弹出绑定窗口");
            that.globalData.register = true;
            that.globalData.platformOpenId = res.data.res.platformuserobj.id;
            that.globalData.platformUid = res.data.res.platformuserobj.unionid;
            obj.setData({
              register: true,
              binner: false
            })
          }
        }
      })
    }

    //绑定手机号
    function bindingPhone(){
      var sign = MD5.hexMD5(MD5.hexMD5(getEncrypts(authNum + phone + userId + "2.5.0" + "H5" + "H5" + "H5")) + AccessToken);
      var that = this;
      wx.request({
        url: 'https://xiaochegnxu.xsawe.top/v2/login/bindingPhoneSelective',
        data: Util.json2Form({
          authNum: "",
          phone: "",
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
          
        }
      })
    }

    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              // console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  //获取验证码
  getPhoneAuth: function (e) {
    var phone = e.currentTarget.dataset.phone;
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
        if (res.data.code = 10000){

        } else if (res.data.code = 123500){
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
        } else if (res.data.code = 122800){
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
  }
})

