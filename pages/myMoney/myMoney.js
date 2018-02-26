const app = getApp()
Page({
  data: {
    myMoney: 0,
    volcanoIncomeList: null,
    getMonetTip:true,
    webUrl: true
  },
  onLoad: function(){
    var that = this;
    wx.request({
      //获取openid接口  
      url: 'https://xiaochegnxu.xsawe.top/v3/volcano/selectVolcanoIncomeList',
      data: {
        userId: "7025",
        pageNum: "1",
        pageSize: "100"
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var da = res.data.res;
        console.log(da);
        if (res.data.code == "10000"){
          var volcanoIncomeList = null;
          if (da.volcanoIncomeList.result){
            volcanoIncomeList = da.volcanoIncomeList.result;
          }
          that.setData({
            myMoney: da.totalMoney.money,
            volcanoIncomeList: volcanoIncomeList
          })
        }
      },
      fail: function (err) {
        console.log(err)
      }  
    })
  },
  getMoney: function(e){
    this.setData({
      getMonetTip:false
    })
  },
  confirm: function(){
    this.setData({
      getMonetTip: true
    })
    
  }
})