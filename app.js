const express = require('express');
const { category } = require('./src/classes/category')

const { post } = require('./src/classes/post')
const { user } = require('./src/classes/user')
const { comment } = require('./src/classes/comment')
const { config } = require('./src/config/config')
const { db } = require('./src/config/db')

const { getNestedReplies } = require('./src/functions/getNestedReplies')

const app = express()
app.use(express.json());

app.listen(config.port, async () => {
  await db.init()
  console.log(`Server running on ${config.port}`)
})

app.get(`/`, (req, res) => {
  res.send(`view the documentation here: ${config.docURL}`)
})

app.get(`/newUser`, async (req, res) => {
  await res.json(await (new user(req)).push(req, db))
})

app.post(`/newPost`, async (req, res) => {
  await res.json(await (new post(req.body.user, req.body.body, req.body.category, db)).push(db))
})

app.post(`/newComment`, async (req, res) => {
  await res.json(await (new comment(req.body.user, req.body.body, req.body.parent, db)).push(db))
})

app.post(`/posts`, async (req, res) => {
  let posts = await db.find(i => i.type===`post`&&i.category.name===req.body.category?i:false)
  posts.forEach(post => {
    post.replies = getNestedReplies(post)
  })
  await res.json(posts)
})

app.get(`/categories`, async (req, res) => {
  await res.json(await db.find(i => i.type==='category'?i:false))
})

app.get(`/users`, async (req, res) => {
  await res.json((await db.find(i => i.type==='user'?i:false)).map(i => {delete i.secret; delete i.ip; return i }))
})
