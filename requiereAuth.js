const jwt = require('jsonwebtoken');

// Middleware para validar el token (rutas protegidas)
const requiereAuth = (req, res, next) => {
    const token = req.headers.authorization;

    // Se verifica si el request posee el header authorization
    if (!token) return res.status(401).json({ error: 'No token provided.' });

    jwt.verify(token, secret_key, (err, decodedToken) => {
        if (err) {
            res.status(401).json({ error: 'Invalid token', token_error: err });
        } else {
            req.user = decodedToken; // id, email, role_id
            next();
        }
    });
}

// const verifyRoles = (...roles) => {
//     return [
//         requiresAuth,
//         (req, res, next) => {
//             const user = req.user;
//             console.log(user);
//             console.log(roles)
//             if (roles.length && !roles.includes(user.role_id)) {
//                 return res.status(401).json({ error: 'Unauthorized' });
//             }
//             next();
//         }
//     ]
// };

module.exports = { requiereAuth };