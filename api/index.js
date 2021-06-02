const express = require('express')
const app = express()

app.use(function(req, res, next){
  console.log("A new request received at " + Date.now());
  next();
});

app.get('/echo/:what', (req, res) => {
  res.json(req.params)
})

module.exports = {
  path: '/api',
  handler: app
}
