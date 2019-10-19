const nodeFetch = require('node-fetch')
const fs = require('fs')

const apiResponses = require('./apiResponses.json')

const newResponses = {}

const urls = Object.keys(apiResponses)

Promise.all(urls.map(async (url) => {
  console.log(url)
  const response = await nodeFetch(url)
  const data = await response.json()
  newResponses[url] = data
  console.log(`done ${url}`)
  return null
})).then(() => {
  console.log(Object.keys(newResponses))
  fs.writeFileSync('./apiResponses.json', JSON.stringify(newResponses, null, 2))
})




