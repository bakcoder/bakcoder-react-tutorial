const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50
    },
    email: {
        type: String,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        maxlength: 70
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String
    },
    tokenExp: {
        type: Number
    }
})

userSchema.pre('save', function (next){
    var user = this;
    
    // 비밀번호 암호화
    if(user.isModified('password')) {
        bcrypt.genSalt(saltRounds, function (err, salt) {
            if(err) return next(err);
            
            bcrypt.hash(user.password, salt, function (err, hash) {
                if(err) return next(err);
                user.password = hash;
                next();
            });
        });
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if(err) return cb(err);
        cb(null, isMatch);
    });
};

userSchema.methods.generateToken = function(cb) {
    var user = this;

    //jsontoken을 이용해서 token 생성
    var token = jwt.sign(user._id.toHexString(), 'secretToken');
    user.token = token;
    user.save(function(err, user) {
        if(err) return cb(err);
        cb(null, user);
    });
}

userSchema.statics.findByToken = function(token, cb) {
    var user = this;
    
    // 토큰 decode
    jwt.verify(token, 'secretToken', function(err, decoded) {
        // 유저 아이디를 이용하여 유저를 찾음
        user.findOne({"_id": decoded, "token": token}, function (err, user) {
            if(err) return cb(err);
            cb(null, user);
        });
        // 클라이언트에서 가져온 token과 DB에 보관된 token이 일치하는지 화인

    });
}

const User = mongoose.model('User', userSchema)
module.exports = {User}