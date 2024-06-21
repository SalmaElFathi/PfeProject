const jwt = require('jsonwebtoken');

const GetUserIdFromSocket = async (socket) => {
    try {
        const cookie = socket.handshake.headers['token'];
        const token = cookie.replace('token=', '');
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        const userId = decoded.userId;
        return userId;
    } catch (error) {
        console.log(error);
    }
}

module.exports = GetUserIdFromSocket;
