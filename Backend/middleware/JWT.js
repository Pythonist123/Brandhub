import jwt from "jsonwebtoken";

const JWT = (_id,role)=>{
    const token = jwt.sign({ id: _id , role:role}, 'your-secret-key', { expiresIn: '1h' });
    return token;
}

export default JWT;