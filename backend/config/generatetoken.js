const jwt = require('jsonwebtoken');

const generatetoken = (id) => {
    const token  = jwt.sign({id},process.env.SECRET,{
        expiresIn : "15d",
    });
    return token;
};

module.exports = generatetoken;