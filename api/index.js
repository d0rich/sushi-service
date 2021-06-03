const express = require('express')
const bodyParser = require('body-parser');

const app = express()
app.use(bodyParser.json())
app.use(function(req, res, next){
  console.log("A new request received at " + Date.now());
  next();
});

app.get('/echo/:what', (req, res) => {
  res.json(req.params)
})

import authRouter from './auth'
app.use('/auth', authRouter)


module.exports = {
  path: '/api',
  handler: app
}
