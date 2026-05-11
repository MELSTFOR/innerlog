const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

// Registrar nuevo usuario
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, deporte, nivel } = req.body;

    // Validar campos requeridos
    if (!nombre || !email || !password || !rol) {
      return res.status(400).json({ error: 'Faltan campos requeridos' });
    }

    // Verificar si el email ya existe
    const userExists = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear usuario
    const result = await db.query(
      'INSERT INTO usuarios (nombre, email, password_hash, rol, deporte, nivel) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, email, rol, deporte, nivel, created_at',
      [nombre, email, hashedPassword, rol, deporte, nivel]
    );

    const user = result.rows[0];

    // Obtener nombre del equipo si existe
    let equipoNombre = null;
    if (user.equipo_id) {
      const equipoResult = await db.query('SELECT nombre FROM equipos WHERE id = $1', [user.equipo_id]);
      if (equipoResult.rows.length > 0) {
        equipoNombre = equipoResult.rows[0].nombre;
      }
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        deporte: user.deporte,
        nivel: user.nivel,
        equipo_id: user.equipo_id,
        equipo: equipoNombre,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validar campos
    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // Buscar usuario
    const result = await db.query('SELECT * FROM usuarios WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = result.rows[0];

    // Verificar contraseña
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // Obtener nombre del equipo si existe
    let equipoNombre = null;
    if (user.equipo_id) {
      const equipoResult = await db.query('SELECT nombre FROM equipos WHERE id = $1', [user.equipo_id]);
      if (equipoResult.rows.length > 0) {
        equipoNombre = equipoResult.rows[0].nombre;
      }
    }

    // Generar JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, rol: user.rol },
      process.env.JWT_SECRET || 'tu_secreto_jwt',
      { expiresIn: process.env.JWT_EXPIRY || '7d' }
    );

    res.json({
      message: 'Login exitoso',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        deporte: user.deporte,
        nivel: user.nivel,
        equipo_id: user.equipo_id,
        equipo: equipoNombre,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Obtener usuario autenticado
const getMe = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT id, nombre, email, rol, deporte, nivel, equipo_id, created_at FROM usuarios WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    const user = result.rows[0];

    // Obtener nombre del equipo si existe
    let equipoNombre = null;
    if (user.equipo_id) {
      const equipoResult = await db.query('SELECT nombre FROM equipos WHERE id = $1', [user.equipo_id]);
      if (equipoResult.rows.length > 0) {
        equipoNombre = equipoResult.rows[0].nombre;
      }
    }

    res.json({
      user: {
        id: user.id,
        nombre: user.nombre,
        email: user.email,
        rol: user.rol,
        deporte: user.deporte,
        nivel: user.nivel,
        equipo_id: user.equipo_id,
        equipo: equipoNombre,
        created_at: user.created_at,
      },
    });
  } catch (error) {
    console.error('Error en getMe:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

// Actualizar actividad del usuario (last_activity)
const updateActivity = async (req, res) => {
  try {
    const userId = req.user.id;

    // Actualizar el timestamp de última actividad
    const result = await db.query(
      'UPDATE usuarios SET last_activity = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, last_activity',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }

    res.json({ 
      message: 'Actividad actualizada',
      last_activity: result.rows[0].last_activity 
    });
  } catch (error) {
    console.error('Error al actualizar actividad:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateActivity,
};
