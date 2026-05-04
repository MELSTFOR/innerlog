// Middleware para manejar errores globalmente
const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ error: 'Token inválido' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ error: 'Token expirado' });
  }

  res.status(err.status || 500).json({
    error: err.message || 'Error en el servidor',
  });
};

module.exports = errorHandler;
