$(function () {
  var layer = layui.layer
  var form = layui.form

  // 定义加载文章分类的方法
  initCate()

  // 初始化富文本编辑器
  initEditor()

  function initCate () {
    $.ajax({
      method: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('初始化文章分类失败！')
        }
        // 调用模板引擎，渲染分类的下拉菜单
        // console.log(res)
        var htmlStr = template('tpl-cate', res)
        $('[name=cate_id]').html(htmlStr)
        // 一定要记得调用form.render方法
        form.render()
      }
    })
  }

  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)


  // 绑定选择封面的点击事件
  $('#btnChooseImage').on('click', function () {
    $('#coverFile').click()
  })

  // 监听coverFile的change事件
  $('#coverFile').on('change', function (e) {
    // 获取到文件的列表数组
    var files = e.target.files
    // 判断是否选择文件
    if (files.length === 0) {
      return
    }
    // 根据文件，创建对应的地址
    var newImgURL = URL.createObjectURL(files[0])
    // 为裁剪区域重新设置图片
    $image
      .cropper('destroy')
      .attr('src', newImgURL)
      .cropper(options)
  })


  var art_state = '已发布'

  // 为存为草稿绑定点击事件
  $('#btnSave2').on('click', function () {
    art_state = '草稿'
  })

  // 为表单绑定submit提交事件
  $('#form-pub').on('submit', function (e) {
    e.preventDefault()
    // 基于form表单快速创建form data对象
    var fd = new FormData($(this)[0])

    // 追加state元素
    fd.append('state', art_state)


    // 将封面裁减过后的图片输出为文件对象
    $image
      .cropper('getCroppedCanvas', {
        // 创建一个canvas画布
        width: 400,
        height: 280
      })
      .toBlob(function (blob) {
        // 将blob追加到form data里
        fd.append('cover_img', blob)

        // 发起ajax请求
        publishArticle(fd)

      })
  })


  // 定义一个发布文章的方法
  function publishArticle (fd) {
    $.ajax({
      method: "POST",
      url: "/my/article/add",
      data: fd,
      // 如果提交formdata格式数据，必须添加如下两个配置项
      contentType: false,
      processData: false,
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('发布文章失败！')
        }
        layer.msg('发布文章成功！')
        // 发布成功后需要跳转到文章列表页面
        location.href = '/article/art_list.html'
      }
    })
  }
})