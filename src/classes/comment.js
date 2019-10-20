const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
const crypto = require("crypto");

module.exports.comment = class comment {
  constructor (user, body, parent, db) {
    this.type = `comment`
    this.id = crypto.randomBytes(6).toString('hex')
    this.user = (db.find(i => i.type==='user'&&i.secret===user.secret?i:false))[0]
    this.body = DOMPurify.sanitize(body)
    this.parent = (db.find(i => (i.type==='post'||i.type==='comment')&&i.id===parent?i:false))[0]
    this.date = + new Date()
  }

  validate (db) {
    if(!this.parent) return 'Parent Invalid' // Parent doesnt exist
    if(!this.user) return 'User Invalid' // User doesnt exists
    if(!this.body) return 'Body Invalid'// does this.body contain anything

    // Set Values
    this.parent = this.parent.id
    this.user = this.user.id

    return true
  }

  async push (db) {
    const e = this.validate(db);
    if(typeof e === 'boolean') return await db.findById(await db.insert(this))
    if(e.indexOf("Invalid") !== -1) return {'error': e}
    return {'error': 'Big yikes, this should never happen'}
  }
}
