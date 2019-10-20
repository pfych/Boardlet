const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');
const window = (new JSDOM('')).window;
const DOMPurify = createDOMPurify(window);
const crypto = require("crypto");

module.exports.post = class post {
  constructor (user, body, category, db) {
    this.type = `post`
    this.id = crypto.randomBytes(6).toString('hex')
    this.user = (db.find(i => i.type==='user'&&i.secret===user.secret?i:false))[0]
    this.body = DOMPurify.sanitize(body)
    this.category = (db.find(i => i.type==='category'&&i.name===category?i:false))[0]
    this.date = + new Date()
  }

  validate (db) {
    if(!this.category) return 'Category Invalid' // Category doesnt exist
    if(!this.user) return 'User Invalid' // User doesnt exists
    if(!this.body) return 'Body Invalid'// does this.body contain anything

    // Set Values
    console.log(this.user)
    this.user = this.user.uid

    return true
  }

  async push (db) {
    const e = this.validate(db);
    console.log(e)
    console.log(this.user)
    if(typeof e === 'boolean') return await db.findById(await db.insert(this))
    if(e.indexOf("Invalid") !== -1) return {'error': e}
    return {'error': 'Big yikes, this should never happen'}
  }
}
