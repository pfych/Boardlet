const path = require('path');

module.exports.config = {
  port: "8080",
  docURL: "https://github.com/Puffycheeses/Boardlet/wiki",
  dbPath: path.join(__dirname, "db.sl"),
  newUserTimeout: 1
}
