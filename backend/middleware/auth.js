import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    const { token } = req.headers;
    if (!token) {
        return res.json({ success: false, message: "Not authorized login" });
    }

    try {
        const token_decode = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = token_decode.id; // ✅ Attach to req, not req.body
        next();
    } catch (err) {
        console.log(err);
        res.json({ success: false, message: "Token error" });
    }
};

export default authMiddleware;
