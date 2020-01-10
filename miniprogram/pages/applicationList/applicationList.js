const app = getApp()

Page({
  data: {
    applicationList: [],
    current: 1,
    pageCount: 1,
    perPage: 10,
  },
  onShow: async function (options) {
    const db = wx.cloud.database()
    const { total } = await db.collection('application').count()
    this.setData({
      applicationList: this.getApplicationList(),
      pageCount: Math.ceil(total / this.data.perPage),
    })
  },
  onPageChange: async function (e) {
    const { detail } = e
    const current = detail.current
    this.setData({
      current: current,
    })
    this.setData({
      applicationList: this.getApplicationList(),
    })
  },
  getApplicationList: function () {
    return [
      {
        _id: 1,
        title: 'titile1',
        status: 'pending',
        user: {
          name: 'user1',
        },
      },
      {
        _id: 2,
        title: 'titile2',
        status: 'pass',
        user: {
          name: 'user2',
        },
      },
    ]
  },
})
