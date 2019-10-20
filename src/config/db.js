const streamlet = require('streamlet')
const { config } = require('./config')

module.exports.db = new streamlet(config.dbPath)
