const crypto = require("crypto");
const { config } = require('../config')

// UID Structure
//  ┌─ First 2 Chars of IP
// 19:thyeetg9y
//       └─ Math.Random().toString(36).substr(2,9)

module.exports.user = class user {
  constructor (req) {
    this.type = `user`
    this.ip = req.ip
    this.uid = `${this.ip.substr(0,2)}:${Math.random().toString(36).substr(2, 9)}`
    this.secret = crypto.randomBytes(20).toString('hex')
  }

  async validate (db) {
    let ip = (db.find(i => i.ip === this.ip?i:false))[0]
    if(!ip) {
      db.insert(new antiSpam(this.ip))
      return true
    } else {
      if(+ new Date() - ip.date >= this.min(config.newUserTimeout) || isNaN(ip.date)) {
        await db.delete(ip._id)
        db.insert(new antiSpam(this.ip))
        return true
      } else {
        return false
      }
    }
  }

  async push (req, db) {
    if (await this.validate(db)) {
      return await db.findById(await db.insert(this))
    } else {
      return {'error': `429`, 'Retry-After': this.RetryTime(req, db)*60}
    }
  }

  min(mins) {
    return mins * 60 * 1000
  }

  RetryTime (req, db) {
    // noinspection JSConstructorReturnsPrimitive // This is inteilliJ trying to be helpful please dont remove
    return ((((db.find(i => i.ip===req.ip?i:false))[0].date)+this.min(config.newUserTimeout)-+ new Date()) / 60 / 1000) * 10
  }

}

class antiSpam {
  constructor (ip) {
    this.ip = ip
    this.date = + new Date()
  }
}
