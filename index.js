const express = require('express')
const axios = require('axios')
const path = require('path')

// Source: https://ihateregex.io/expr/url/
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/

const RICK_ROLL_URLS = [
  'youtube.com/watch?v=dQw4w9WgXcQ',
  'youtu.be/dQw4w9WgXcQ'
  // TODO: Add More
]

const frontendDir = path.join(__dirname, 'frontend')

const app = express()

app.use('/', express.static(frontendDir))

app.get('/', (_, res) => {
  res.sendFile(path.join(frontendDir, 'index.html'))
})

app.get('/check_url', async (req, res) => {
  const checkUrl = req.query.url
  if (!checkUrl || !URL_REGEX.test(checkUrl)) {
    res.status(400) // TODO: Add better error handling
    res.send('400: Invalid URL')
    return
  }

  // TODO: Add handling if the url can't be reached
  const checkResponse = await axios.get(checkUrl)
  const endUrl = checkResponse.request.res.responseUrl

  let isRickRoll = false
  for (const rr of RICK_ROLL_URLS) {
    if (endUrl.includes(rr)) {
      isRickRoll = true
      break
    }
  }

  res.send(JSON.stringify({
    url: checkUrl,
    value: isRickRoll
  }))
})

app.listen(3000, () => {
  console.log('server started')
})
