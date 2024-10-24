const jwt = require('jsonwebtoken');

const setUserInReqFromCookie = (req, res, next) => {
  
  try {
    console.log(`Incoming Headers: ${JSON.stringify(req.headers)}`);
    const cookies = req.headers?.cookie?.split('; ');
    console.log(`cookies: ${cookies}`);
    if(!cookies) return res.status(401).send('UNAUTHORIZED');
    
    for(let secret of cookies){
        if(secret.includes('token=')){
          const token = secret.split('token=')[1];
          const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');
          if(!decoded) return res.status(401).send('UNAUTHORIZED');
          console.log(decoded);

          req.decodedUser = decoded.user;
          next();
          return;
        }
    }
    return res.status(401).send('UNAUTHORIZED');
  } catch (error) {
    console.log(error);
    return res.status(401).send('UNAUTHORIZED');
  }
};

module.exports = {
    setUserInReqFromCookie
};
