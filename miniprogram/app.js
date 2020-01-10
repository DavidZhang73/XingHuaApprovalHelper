App({
  /**
   * 启动时
   */
  onLaunch: function () {

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        env: 'xinghua-0uxtf',
        traceUser: true,
      })
    }

    this.globalData = {
      _openid: null,
      groupMap: {
        admin: '管理员',
        applicant: '申请人',
        examiner: '审理人',
        applying: '申请中',
        disabled: '已禁用',
      },
      statusMap: {},
    }
  },
  /**
   * 获得openid
   */
  getOpenid: async function () {
    if (this.globalData._openid) {
      return this.globalData._openid
    } else {
      try {
        const { result } = await wx.cloud.callFunction({
          name: 'getOpenid',
        })
        const _openid = result.openid
        this.globalData._openid = _openid
        console.log('获得openid', _openid)
        return _openid
      } catch (e) {
        console.log('无法连接到云服务器，错误 ' + e)
      }
    }
  },
})
