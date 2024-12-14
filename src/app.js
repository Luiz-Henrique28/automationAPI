const express = require('express')

require('dotenv').config()

const fs = require('fs');
const data = fs.readFileSync('../data/credentials.json', 'utf8')

const app = express()
const port = process.env.PORT || 4000

app.use(express.json())

const checkCredentials = (req, res, next) => {
  const credentials = JSON.parse(data)

  const {filialName, filialKey} = req.body

  const validated = credentials.filiais.some(filialObj => {
    return filialObj.filialName === filialName && filialObj.filialKey === filialKey;
  });
  
  return validated ? next() : res.status(403).json({msg: 'unauthorized'})
}

app.get('/', (_, res) => {
  return res.send('running')
})

app.post('/access', checkCredentials, (_, res) => {
  return res.status(200).json({msg: 'authorized access'})
})

app.listen(port, () => {
  console.log(`Server is running at ${port}`)
})

