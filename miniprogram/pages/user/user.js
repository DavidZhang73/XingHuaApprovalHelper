import moment from '../../utils/moment'
import { $wuxForm, $wuxToast } from '../../style/wux/index'

const app = getApp()

Page({
  data: {
    user: {
      name: null,
      phone: null,
      group: null,
      joinDate: null,
      openid: null
    },
    groupMap: null,
    groupOptions: null,
    groupOption: null,
    isNameCorrect: true,
    isPhoneCorrect: true
  },
  onLoad: function () {
    const groupMap = app.globalData.groupMap
    let groupOptions = []
    for (let key in groupMap) {
      groupOptions.push({
        value: key,
        label: groupMap[key]
      })
    }
    this.setData({
      groupMap: groupMap,
      groupOptions: groupOptions
    })
  },
  onShow: async function (options) {
    const db = wx.cloud.database()
    const openid = await app.getOpenid()
    try {
      const { data } = await db.collection('user').where({
        _openid: openid
      }).get()
      const user = data[0]
      this.setData({
        user: {
          name: user.name,
          phone: user.phone,
          group: user.group,
          joinDate: moment(user.join_date).format('YYYY-MM-DD HH:mm'),
          openid: openid
        },
        groupOption: user.group
      })
    } catch (e) {
      console.log(e)
    }
  },
  onSubmit: async function () {
    const { getFieldsValue } = $wuxForm()
    const fields = getFieldsValue()
    const name = fields['name']
    const phone = fields['phone']
    const group = fields['group'][0]
    console.log('here', group)
    this.setData({
      isNameCorrect: !!name,
      isPhoneCorrect: !!phone
    })
    if (this.data.isNameCorrect && this.data.isPhoneCorrect) {
      try {
        const db = wx.cloud.database()
        const openid = await app.getOpenid()
        db.collection('user').where({
          _openid: openid
        }).update({
          data: {
            name: name,
            phone: phone,
            group: group
          }
        })
        $wuxToast().success('更新成功').then(() => {
          wx.navigateBack()
        })
      } catch (e) {
        console.log(e)
      }
    }
  },
  onGroupChange: function (e) {
    const { detail } = e
    this.setData({
      groupOption: detail.selectedValue
    })
  }
})
