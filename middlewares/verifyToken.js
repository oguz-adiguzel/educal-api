const jwt = require("jsonwebtoken")
module.exports = (req, res, next) => {
    const token = req.headers.authorization; // request gelen tokenı al
  
    if (!token) {
      return res.status(403).json({ message: 'Token bulunamadı', });
    }
  
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(401).json({ message: 'Geçersiz token', status:401 });
      }
  
      // Token doğru ise, kullanıcı id'sini request objesine ekleyerek devam et
      req.userId = decoded.userId;
      next();
    });
  };