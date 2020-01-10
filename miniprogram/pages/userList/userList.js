const app = getApp()

Page({
  data: {
    userList: [],
    groupMap: app.globalData.groupMap,
    current: 1,
    pageCount: 1,
    perPage: 10,
  },
  onShow: async function () {
    const db = wx.cloud.database()
    const { total } = await db.collection('user').count()
    this.setData({
      userList: await this.getUserList(),
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
      userList: await this.getUserList(),
    })
  },
  getUserList: async function () {
    try {
      const db = wx.cloud.database()
      const { data } = await db.collection('user').
        orderBy('join_date', 'desc').
        skip(this.data.perPage * (this.data.current - 1)).
        limit(this.data.perPage).
        get()
      return data
    } catch (e) {
      console.error(e)
    }
  },
})
