import { $wuxToast } from '../../style/wux/index'

const app = getApp()

Page({

  data: {
    isNameCorrect: true,
    isPhoneCorrect: true,
  },

  onSubmit: async function (e) {
    let formdata = e.detail.value
    const { name, phone } = formdata
    // check fields
    this.setData({
        isNameCorrect: !!name,
        isPhoneCorrect: !!phone,
      },
    )
    if (this.data.isNameCorrect && this.data.isPhoneCorrect) {
      const db = wx.cloud.database()
      try {
        const { total } = await db.collection('user').where({
          _openid: app.globalData._openid,
        }).count()
        if (total) {
          $wuxToast().warning('您已注册').then(() => {
            wx.navigateBack()
          })
        } else {
          await db.collection('user').add({
            data: {
              name: name,
              phone: phone,
              group: 'applying',
              join_date: new Date(),
            },
          })
          $wuxToast().success('注册成功').then(() => {
            wx.navigateBack()
          })
        }
      } catch (e) {
        console.error(e)
      }
    }
  },
})
