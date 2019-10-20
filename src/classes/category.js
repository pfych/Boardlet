module.exports.category = class category {
  constructor (name, description, nsfw) {
    this.type = `category`
    this.name = name
    this.description = description
    this.nsfw = nsfw
  }

  async validate (db) {
    if(!this.name) return false
    if(!this.description) return false
    return typeof this.nsfw === "boolean";
  }

  async push (db) {
    if(await this.validate(db)) db.insert(this)
  }
}
