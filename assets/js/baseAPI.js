// 每次调用get、post、ajax时会先调用这个函数
// 这个函数中，可以拿到给ajax提供的配置对象
$.ajaxPrefilter(function (options) {

  // 再发起真正的ajax请求之前先拼接
  options.url = 'http://big-event-api-t.itheima.net' + options.url
  // console.log(options.url)

  // 统一为有权限的接口，设置headers请求头
  if (options.url.indexOf('/my/') !== -1) {
    options.headers = {
      Authorization: localStorage.getItem('token') || ''
    }
  }

  // 全局统一挂载complete回调函数
  options.complete = function (res) {
    if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
      // 1、强制清空token
      localStorage.removeItem('token')
      // 2、强制跳转到登录页
      location.href = '/login.html'
    }
  }
})