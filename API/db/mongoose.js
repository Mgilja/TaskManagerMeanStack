
// const connectionString = 'mongodb+srv://Mgilja93:AronGilja14@meanstackdemoproject.yohmn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

// handling connetion logic to mongoDb

const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://Mgilja93:' + process.env.MONGO_PASS + '@cluster0.9yt8b.mongodb.net/test'
, { useNewUrlParser:true})
.then(()=> {
console.log('Youre connected to MongoDB successfully');
}).catch((err)=> {
    console.log('eror while attempting to conncect');
    console.log(err);
});

// Preventing deprecation warnings 


// exporting moodule
module.exports = {
    mongoose,
}


