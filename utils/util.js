const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  if (isThisYear){
    return [month, day].map(formatNumber).join('-')
  }else{
    return [year, month, day].map(formatNumber).join('-')
  }
  
  // return [year, month, day].map(formatNumber).join('-') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const countdown = date => {
  var hours = parseInt(date / 1000 / 60 / 60 % 24, 10); //计算剩余的小时
  var minutes = parseInt(date / 1000 / 60 % 60, 10);//计算剩余的分钟
  var seconds = parseInt(date / 1000 % 60, 10);//计算剩余的秒数
  return [hours, minutes, seconds].map(formatNumber).join(':')
}

const isThisYear = date=>{
  const now = new Date();
  const year = now.getFullYear();
  if (year == date.getFullYear()){
    return true;
  }else{
    return false;
  }
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function json2Form(json) {
  var str = [];
  for (var p in json) {
    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(json[p]));
  }
  return str.join("&");
}

//格式化回复主贴时间
const setTime = date=>{
  const now = new Date().getTime();
  const time = now - date;
  if (time < 60) {
    return "刚刚";
  }
  // 秒转分钟
  var minutes = time / 60;
  if (minutes < 60) {
    return minutes + "分钟前";
  }
  // 秒转小时
  var hours = time / 3600;
  if (hours < 24) {
    return hours + "小时前";
  }
  //秒转天数
  var days = time / 3600 / 24;
  if (days < 7) {
    return days + "天前";
  }else{
    return formatTime(new Date(date));
  }
}

const formatSeconds = value=> {
  var theTime = parseInt(value);// 秒 
  var theTime1 = 0;// 分 
  var theTime2 = 0;// 小时 
  // alert(theTime); 
  if (theTime > 60) {
    theTime1 = parseInt(theTime / 60);
    theTime = parseInt(theTime % 60);
    // alert(theTime1+"-"+theTime); 
    if (theTime1 > 60) {
      theTime2 = parseInt(theTime1 / 60);
      theTime1 = parseInt(theTime1 % 60);
    }
  }
  var result = "" + parseInt(theTime)
  if (theTime<10){
    result = "0" + parseInt(theTime);
  }
  if (theTime1 > 0) {
    result = "" + parseInt(theTime1) + ":" + result;
    if (theTime1 < 10){
      result = "0"+result;
    }
  }else{
    result =  "00:" + result;
  }
  // if (theTime2 > 0) {
  //   result = "" + parseInt(theTime2) + "小时" + result;
  // }
  return result;
} 

module.exports = {
  formatTime: formatTime,
  countdown: countdown,
  json2Form: json2Form,
  setTime: setTime,
  formatSeconds: formatSeconds
}

