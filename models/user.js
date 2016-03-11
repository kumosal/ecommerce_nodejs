var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

// The user schema attributes
var userSchema = new Schema({
    email : { type: String, unique: true, lowercase: true},
    password : String,
    profile : { 
        name : { type: String, default: ''},
    },
    address : String,
    history : [{
        date : Date,
        paid : { type: Number, default: ''},
        item : { type: Schema.Types.ObjectId, ref: ''}
    }]
});

// Hash the password before we even save it to the database
userSchema.pre('save', function(next) {
    var user = this;
    if (!user.isModified('password')) return next();
    bcrypt.genSalt(10, function(err, salt) {
       if (err) return next(err);
       bcrypt.hash(user.password, salt, null, function(err, hash) {
          if (err) return next(err);
          user.password = hash;
          next(); 
       });
        
    });
});

// compare the password in the database with the one the user typed.
userSchema.methods.comparePasswords = function(password) {
    return bcrypt.compareSync(password, this.password);
    // Async version
    // bcrypt.compare(password, this.password, function(err, same) {
    //     if (err) return err;
    //     return same;
    // });
}

module.exports = mongoose.model('User', userSchema);