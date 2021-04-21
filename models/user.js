const bcrypt = require('bcrypt-nodejs');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define our model
const userSchema = new Schema({
    // lowercase attribute ensures that it is case sensitive.
    email: {type: String, unique: true, lowercase: true},
    password: String
});

// On save hook, encrypt password
// before saving the model save this.
userSchema.pre('save', function(next) {
    // get access to the usermodel.
    const user = this;
    // generate a salt and then run callback
    bcrypt.genSalt(10, function(error, salt) {
        if(error) return next(error);
        // hash (encrypt) user password using the salt.
        bcrypt.hash(user.password, salt, null, function(error, hash) {
            if(error) return next(error);

            // overwrite plain text password with encrypted password.
            user.password = hash;

            console.log('user.passwod', hash);

            // Continue to save the model.
            next();
        })
    })
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
        if(err) return callback(err);

        callback(null, isMatch)
    })
}



// Create the model class
const ModelClass = mongoose.model('user', userSchema);



// Export the model
module.exports = ModelClass;