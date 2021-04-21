const jwt = require("jwt-simple");
const User = require("../models/user");
const config = require("../config");

function tokenForUser(user) {
  const timestamp = new Date().getTime();
  // this is a standard from jwt, contains sub, iat(issued at time). more documenttaion in
  // jwt.io
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}

exports.signup = (req, res, next) => {
  //res.send({success: true})

  const { email, password } = req.body;
  console.log(email, password);

  // check input parameters
  if (!email || !password) {
    return res.status(422).send({ error: "invalid email or password!" });
  }

  // see if the user with given email exists.
  User.findOne({ email: email }, function (error, existingUser) {
    if (error) {
      return next(error);
    }

    // if the user with the email exists return an error
    if (existingUser) {
      return res.status(422).send("Email already exists!");
    }

    // if the user with email does not exist, create and save user record
    const user = new User({
      email: email,
      password: password,
    });

    user.save(function (error) {
      if (error) return next(error);
    });

    // Respond to the request indicating the user was created.
    res.json({ token: tokenForUser(user) });
  });
};


exports.signin = function(req, res, next){
  // User has already had email and password a'thed
  // we just need to give them a token
  // req.user is assigned by the passport library.
  console.log('req.user', req.user);
  res.send({token: tokenForUser(req.user)});


}
