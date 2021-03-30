const express = require('express')
const app = express()
const port = 3000

// MongoDB connect
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://bakcoder:abcd@bakcodercluster.cvjhw.mongodb.net/bakcoderDB?retryWrites=true&w=majority', {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err))

app.get('/', (req, res) => {
    res.send('Hello World')
})

app.listen(port, () => {
    console.log(`listening http://localhost:${port}`)
})