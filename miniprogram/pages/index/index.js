import { $wuxToast } from '../../style/wux/index'

const app = getApp()

Page({
  data: {
    user: {
      name: null,
      group: null,
    },
  },
  onShow: async function () {
    const db = wx.cloud.database()
    try {
      const openid = await app.getOpenid()
      const { data } = await db.collection('user').where({
        _openid: openid,
      }).get()
      if (data.length === 0) {
        $wuxToast().warning('请先登录').then(() => {
          wx.navigateTo({ url: '/pages/signup/signup' })
        })
      } else {
        const user = data[0]
        this.setData({
          user: {
            name: user.name,
            group: user.group,
          },
        })
      }
    } catch (e) {
      console.error(e)
    }
  },
})
