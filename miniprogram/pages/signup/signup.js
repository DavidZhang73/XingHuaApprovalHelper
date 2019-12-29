const app = getApp()

Page({

  data: {
    isNameCorrect: true,
    isPhoneCorrect: true
  },

  onSubmit: function (e) {
    let formdata = e.detail.value
    // check fields
    this.setData({
        isNameCorrect: !!formdata.name,
        isPhoneCorrect: !!formdata.phone
      }
    )
    if (this.data.isNameCorrect && this.data.isPhoneCorrect) {
      wx.cloud.callFunction({
        name: 'signup',
        data: {
          name: formdata.name,
          phone: formdata.phone
        }
      })
        .then(res => {
          wx.navigateBack()
        })
        .catch(err => {
          wx.showToast({
            title: '失败',
            icon: 'none',
            duration: 1000
          })
        })
    }
  }
})
