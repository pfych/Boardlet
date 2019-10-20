const { db } = require('../config/db')

// Thank you Aurame for these functions :D
function _getNestedReplies (post, replies) {
  return db.find(i => i.type === "comment" && i.parent === post.id ? i : false).map(i => ({...i, replies: _getNestedReplies(i, i.replies)}));
}

module.exports.getNestedReplies = function (post) {
  return _getNestedReplies(post, post.replies);
}
