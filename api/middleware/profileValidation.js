const authModel = require('../auth/auth-model');

module.exports = async (req, res, next) => {
    /*
    On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".
    */
    const {username, password} = req.body;
    const user = await authModel.findBy({username})
    console.log(user[0]);
    if(typeof username !== 'string' || typeof password !== 'string' || username.trim() === '' || password.trim() === ''){ 
        res.status(400).json({ message: "Username and password required" })
        return;
    } else if(typeof user[0] !== 'undefined'){
        console.log("YOU MADE IT")
        res.status(403).json({ message: "Username taken" });
        return;
    } else {
        next();
    }
};
  