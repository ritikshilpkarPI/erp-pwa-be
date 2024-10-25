// const jwt = require('jsonwebtoken');

// const setUserInReqFromCookie = (req, res, next) => {
  
//   try {
//     console.log(`Incoming Headers: ${JSON.stringify(req.headers)}`);
//     const cookies = req.headers?.cookie?.split('; ');
//     console.log(`Parsed Cookies: ${cookies}`);
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

// module.exports = {
//     setUserInReqFromCookie
// };


//----------------------------------------------------//

const jwt = require('jsonwebtoken');

const setUserInReqFromCookie = (req, res, next) => {
    try {
        // console.log(`Incoming Headers: ${JSON.stringify(req.headers)}`);

        const cookie = req.headers['cookie'];
        let token;

        if (cookie) {            
            const cookieToken = cookie
                .split('; ')
                .find(row => row.startsWith('token='));

            if (cookieToken) {
                token = cookieToken.split('=')[1];
            }
        }

        console.log(`Token from cookie: ${token}`);
        
        if (!token) {
            return res.status(401).send('UNAUTHORIZED: No token provided.');
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'JWT_SECRET');

        if (!decoded) {
            return res.status(401).send('UNAUTHORIZED: Invalid token.');
        }

        req.decodedUser = decoded.user;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).send('UNAUTHORIZED: Token verification failed.');
    }
};

module.exports = {
  setUserInReqFromCookie
};
