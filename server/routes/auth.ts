import bcrypt from 'bcryptjs';
import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

router.post('/login', async (req, res) => {
    let connection;
    try {
        const { username, password } = req.body;

        console.log('Intentando login para:', username);

        connection = await pool.getConnection();

        const [rows]: any = await connection.execute(
            'SELECT id, usrName, usrUserName, usrPassword FROM users WHERE usrUserName = ? LIMIT 1',
            [username]
        );

        const user = rows[0];

        if (!user) {
            console.log('Usuario no encontrado:', username);
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        console.log('Usuario encontrado:', user.usrUserName);

        const isValid = await bcrypt.compare(password, user.usrPassword);

        if (!isValid) {
            console.log('Contraseña incorrecta');
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        console.log('Login exitoso para:', user.usrUserName);

        return res.status(200).json({
            id: user.id,
            usrName: user.usrName,
            usrUserName: user.usrUserName
        });
    } catch (error: any) {
        console.error('Error en login:', error.message);
        console.error('Código de error:', error.code);
        return res.status(500).json({
            error: 'Error en el servidor',
            details: error.message
        });
    } finally {
        if (connection) {
            connection.release();
        }
    }
});

export default router;