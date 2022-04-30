const express = require('express')
const axios = require('axios')
const path = require('path')
const fs = require('fs')

// Source: https://ihateregex.io/expr/url/
const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()!@:%_\+.~#?&\/\/=]*)$/

const RICK_ROLL_URLS = fs.readFileSync('./rick_roll_endpoints.txt', { encoding: 'utf8' }) // Load File
  .replace('\r', '').split('\n').map(s => s.trim()) // Get Lines
  .filter(s => ((s.length > 0) && (s[0] !== '#'))) // Remove Empty Lines and Comments

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

  let isRickRoll = false

  let endUrl = ''
  try {
    const checkResponse = await axios.get(checkUrl)
    endUrl = checkResponse.request.res.responseUrl
  } catch (err) {
    isRickRoll = true
  }

  if (!isRickRoll) { // If the url is valid
    for (const rr of RICK_ROLL_URLS) {
      if (endUrl.includes(rr)) {
        isRickRoll = true
        break
      }
    }
  }

  res.send(JSON.stringify({
    url: checkUrl,
    value: isRickRoll
  }))
})

app.listen(process.env.PORT || 3000, () => {
  console.log('server started')
})
