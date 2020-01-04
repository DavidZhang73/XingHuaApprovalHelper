import moment from '../../utils/moment'
import { $wuxForm, $wuxToast } from '../../style/wux/index'

const app = getApp()

Page({
  data: {
    options: null,
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
    isPhoneCorrect: true,
    currentGroup: null
  },
  onLoad: async function (options) {
    const groupMap = app.globalData.groupMap
    let groupOptions = []
    for (let key in groupMap) {
      groupOptions.push({
        value: key,
        label: groupMap[key]
      })
    }
    this.setData({
      options: options,
      groupMap: groupMap,
      groupOptions: groupOptions
    })
    // 获取当前用户组
    const db = wx.cloud.database()
    const openid = await app.getOpenid()
    const { data } = await db.collection('user').where({
      _openid: openid
    }).get()
    const currentUser = data[0]
    this.setData({
      currentGroup: currentUser.group
    })
  },
  onShow: async function (options) {
    const db = wx.cloud.database()
    const openid = await this.getOpenid()
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
    this.setData({
      isNameCorrect: !!name,
      isPhoneCorrect: !!phone
    })
    if (this.data.isNameCorrect && this.data.isPhoneCorrect) {
      try {
        let data = {
          name: name,
          phone: phone
        }
        if (this.data.currentGroup === 'admin') {
          data.group = this.data.groupOption
        }
        const openid = await this.getOpenid()
        await wx.cloud.callFunction({
          name: 'updateUser',
          data: {
            openid: openid,
            data: data
          }
        })
        $wuxToast().success('更新成功').then(() => {
          wx.navigateBack()
        })
      } catch (e) {
        $wuxToast().success(e)
        console.log(e)
      }
    }
  },
  onGroupConfirm: function (e) {
    const { detail } = e
    this.setData({
      groupOption: detail.selectedValue[0]
    })
  },
  /**
   * 获得当前要显示的用户对应的openid，如果url中没有指定，则返回当前用户openid
   */
  getOpenid: async function () {
    let openid
    if (this.data.options._openid) {
      openid = this.data.options._openid
    } else {
      openid = await app.getOpenid()
    }
    return openid
  }
})
