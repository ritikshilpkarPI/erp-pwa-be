const jwt = require('jsonwebtoken');

// const setUserInReqFromCookie = (req, res, next) => {
//   try {
//     const cookies = req.headers?.cookie?.split('; ');
//     if(!cookies) return res.status(401).send('UNAUTHORIZED');
//     for(let secret of cookies){
//         if(secret.includes('token=')){
//           const token = secret.split('token=')[1];
//           const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');
//           if(!decoded) return res.status(401).send('UNAUTHORIZED');
//           req.decodedUser = decoded.user;
//           next();
//           return;
//         }
//     }
//     return res.status(401).send('UNAUTHORIZED');
//   } catch (error) {
//     console.log(error);
//     return res.status(401).send('UNAUTHORIZED');
//   }
// };

const setUserInReqFromCookie = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).send('UNAUTHORIZED');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');
    if (!decoded) return res.status(401).send('UNAUTHORIZED');

    req.decodedUser = decoded.user;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).send('UNAUTHORIZED');
  }
};

module.exports = {
    setUserInReqFromCookie
};
