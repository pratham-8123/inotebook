import jwt from 'jsonwebtoken';

const JWT_SECRET = '1@3$5^';

const fetchuser = async (req, res, next) => {
    // Get the user from jwt token and append id to req object
    const token = req.header('auth-token');
    if (!token) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).send({ error: "Please authenticate using a valid token" });
    }
};

export default fetchuser;