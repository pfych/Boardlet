const path = require('path');

module.exports.config = {
  port: "8080",
  docURL: "https://example.com",
  dbPath: path.join(__dirname, "db.sl"),
  newUserTimeout: 1
}
