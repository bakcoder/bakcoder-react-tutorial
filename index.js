const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');
const { User } = require("./models/User");
const config = require('./config/key');

//application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));

//application/json
app.use(bodyParser.json())

// MongoDB connect
const mongoose = require('mongoose');
mongoose.connect(config.mongoURI, {
    useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
}).then(() => console.log('MongoDB connected...'))
  .catch(err => console.log(err));

app.get('/', (req, res) => {
    res.send('Hello World');
})

app.post('/register', (req, res) => {
    //회원 가입 시 필요한 정보들을 클라이언트에서 가져와 DB로 insert

    const user = new User(req.body)

    user.save((err, userInfo) => {
        if(err) return res.json({success: false, err})
        return res.status(200).json({
            success: true
        })
    })
})

app.listen(port, () => {
    console.log(`listening http://localhost:${port}`);
})