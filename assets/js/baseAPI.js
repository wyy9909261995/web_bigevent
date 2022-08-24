// 每次调用get、post、ajax时会先调用这个函数
// 这个函数中，可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {

  // 再发起真正的ajax请求之前先拼接
  options.url = 'http://big-event-api-t.itheima.net' + options.url
  console.log(options.url)
})