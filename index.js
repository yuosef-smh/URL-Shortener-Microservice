require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded());

// Basic Configuration
const port = process.env.PORT || 3000;

const urls = [];

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

const urlRegex = /^https?:\/\/(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+.*$/;

app.post('/api/shorturl', (req, res) => {
  
  const url = req.body.url;
  console.log(url);
  if(!url || !urlRegex.test(url)) {
    return res.json({error: "invalid url"});
  }
  urls.push(url);
  res.json({original_url: url, short_url: urls.length});
});

app.get('/api/shorturl/:id', (req, res) => {
  const urlId = parseInt(req.params.id);
  if(urlId > 0 && urlId <= urls.length) {
      res.redirect(urls[urlId - 1]);
  }
  else {
    res.json({error: "invalid url"});
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
