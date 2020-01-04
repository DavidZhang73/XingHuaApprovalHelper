const cloud = require('wx-server-sdk')

cloud.init()

exports.main = async (event, context) => {
  const {
    openid,
    data
  } = event
  const db = cloud.database()
  return await db.collection('user').where({
    _openid: openid
  }).update({
    data: data
  })
}
