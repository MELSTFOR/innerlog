-- Actualizar contraseña de Melina con hash correcto
UPDATE usuarios 
SET password_hash = '$2a$10$MZ/UgGaYgRjpjkmm7Yl4EeFyaUsROH0MJGgni341W3n54QhJ2JhB.' 
WHERE email = 'melina@fila.com';
