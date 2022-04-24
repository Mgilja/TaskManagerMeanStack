const mongoose = require('mongoose');

const jwt = require('jsonwebtoken');

const jwtSecret = "738883684733812850273381285027ajkshdjkshdjahdjlashdl9962259338";
const crypto = require('crypto');
const bycrpt = require('bcryptjs');


const UserSchema = new mongoose.Schema({
    email:{
        type:String,
        required: true,
        minlength: 1,
        trim: true,
        unique: true,
    },
   password: {
       type: String,
       required: true,
       minlength: 8,
   },
   sessions: [{
       token:{
           type: String,
           required: true,
       },
      expiresAt:{
           type: Number,
           required: true,
       }
   }]
});
UserSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();
    
    return userObject;
}
UserSchema.methods.generateAccessAuthToken = function() {
  const user = this;
  return new Promise((res,reject)=> {
      
    jwt.sign({_id: user._id.toHexString()}, jwtSecret, {expiresIn:"120m"}, (err,token)=> {
        if(!err) {
            res(token)
        }
        else {
            reject()
        }
    })
  })
}
UserSchema.methods.generateRefreshAuthToken = function() {
    // generating 64byte hex string, doesnt save it to the database
    return new Promise((res,rej)=> {
       crypto.randomBytes(64, (err,buff)=> {
           if(!err) {
               let token = buff.toString('hex');

               return res(token);
           }
       })
    })
}

UserSchema.methods.createSession = function() {

   let user = this;

   return user.generateRefreshAuthToken().then((refreshToken)=> {
       return saveSessionToDb(user, refreshToken);
   }).then((refreshToken)=> {
       return refreshToken
   }).catch((err)=> {
       return Promise.reject('Failed to save session to database.\n' + err)
   })
}
/*
MODEL METHODS(static models)
*/ 

UserSchema.statics.getJwtSecret = () => {
    return jwtSecret
}

UserSchema.statics.findByIdAndToken = function(_id, token) {
 const User = this;
 return User.findOne({
     _id,
     'sessions.token': token,
 });
}
UserSchema.statics.findByCredential = function(email,password) {
    let User = this;

    return User.findOne({email}).then((user)=> {
        if(!user) return Promise.reject();

        return new Promise((resolve, reject) => {
            bycrpt.compare(password, user.password, (err, res)=> {
                if(res) resolve(user);
                else{
                    reject();
                }
            })
        })

    })
}

UserSchema.statics.hasRefreshTokenExpired = (expiresAt)=> {
    let secondSinceEpoch = Date.now() / 1000;
    if(expiresAt > secondSinceEpoch) {
        return false;
    }else {
        return true;
    }
}

 // MIDDLEWARE

 UserSchema.pre('save', function(next){
     let user = this;
     let costFactor = 10;

     if(user.isModified('password')) {
       
        bycrpt.genSalt(costFactor, (err, salt)=> {
            bycrpt.hash(user.password, salt, (err, hash)=> {
                user.password = hash;
                next()
            })
        })
     } else {
         next();
     }
 })

/*
HELPERES
 */
let saveSessionToDb = (user, refreshToken) => {
    return new Promise((res, rej)=> {
        let expiresAt = generateRefreshTokenExpiryTime();

        user.sessions.push({'token': refreshToken, expiresAt})

        user.save().then(()=> {
            return res(refreshToken);
        }).catch((err)=> {
            rej(err)
        })
    })
}

let generateRefreshTokenExpiryTime = () => {
    let daysUntilExpires = "10";
    let secondsUntilExpires = ((daysUntilExpires * 24) * 60) * 60;
    
    return ((Date.now() / 1000) + secondsUntilExpires);
}


const User = mongoose.model('User', UserSchema);
const secret = jwtSecret
module.exports = {User, secret};