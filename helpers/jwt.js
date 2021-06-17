const expressJwt = require('express-jwt');

function authJwt() {
    const secret = process.env.SECRET_KEY;
    const api = process.env.API_URL;
    const apiUrl = '/api/v1';
    return expressJwt({
        secret,
        algorithms: ['HS256'],
        isRevoked: isRevoked,
    }).unless({
        path: [
            {
                url: /\/api\/v1\/products(.*)/,
                methods: ['GET', 'PUT', 'OPTIONS'],
            },
            { url: /\/api\/v1\/categories(.*)/, methods: ['GET', 'OPTIONS'] },
            {
                url: /\/api\/v1\/orders(.*)/,
                methods: ['GET', 'PUT', 'DELETE', 'OPTIONS'],
            },

            `${apiUrl}/users/login`,
            `${apiUrl}/users/register`,
            `${apiUrl}/orders`,
            `${apiUrl}/products`,
        ],
    });
}

async function isRevoked(req, payload, done) {
    if (!payload.isAdmin) {
        done(null, true);
    }

    done();
}

module.exports = authJwt;
