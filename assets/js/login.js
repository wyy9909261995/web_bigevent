$(function () {
  // 点击去注册账号的链接
  $('#link_reg').on('click', function () {
    $('.login-box').hide()
    $('.reg-box').show()
  })

  // 点击去登陆的链接
  $('#link_login').on('click', function () {
    $('.login-box').show()
    $('.reg-box').hide()
  })

  // 从layui里获取form对象
  var form = layui.form
  var layer = layui.layer
  // 通过form.verify（）函数自定义校验规则
  form.verify({
    // 自定义了一个叫做pwd校验规则
    pwd: [
      /^[\S]{6,12}$/
      , '密码必须6到12位，且不能出现空格'
    ],
    // 校验两次密码是否一致
    repwd: function (value) {
      // 通过形参拿到的是确认密码框的内容，还需要拿到密码框的内容，进行判断，若失败，则return一个提示消息
      var pwd = $('.reg-box [name=password]').val()
      if (pwd !== value) {
        return '两次密码不一致'
      }
    }
  })

  // 监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    // 阻止默认的提交行为
    e.preventDefault()
    // 发起ajax的post请求
    $.post('/api/reguser', { username: $('#form_reg [name=username]').val(), password: $('#form_reg [name=password]').val() },
      function (res) {
        if (res.status !== 0) {
          // return console.log(res.message)
          return layer.msg(res.message)
        }
        // console.log('注册成功！')
        layer.msg('注册成功,请登录！')
        // 模拟人的点击行为
        $('#link_login').click()
      })
  })

  // 监听登录表单的提交事件
  $('#form_login').on('submit', function (e) {
    // 阻止默认的提交行为
    e.preventDefault()
    // 发起ajax的post请求
    $.ajax({
      url: '/api/login',
      method: 'POST',
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('登录失败！')
        }
        layer.msg('登录成功！')
        console.log(res.token)
        // 跳转到后台主页
        location.href = '/index.html'
      }
    })
  })
})