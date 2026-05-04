const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Obtener token del header Authorization
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token no proporcionado' });
    }

    const token = authHeader.substring(7); // Remover "Bearer "

    // Verificar token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'tu_secreto_jwt'
    );

    // Adjuntar usuario decodificado al request
    req.user = decoded;
    next();
  } catch (error) {
    console.error('Error al validar token:', error.message);
    res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

module.exports = authMiddleware;
