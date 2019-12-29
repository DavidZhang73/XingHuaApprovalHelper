// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
  const name = event.name
  const phone = event.phone
  const db = cloud.database()
  const user = await db.collection('user').where({
    openid: openid
  }).get()
  if (user.data) {
    db.collection('user').add({
      data: {
        openid: openid,
        name: name,
        phone: phone,
        group: 'applicant',
        join_date: new Date()
      }
    })
  }
  return null
}
