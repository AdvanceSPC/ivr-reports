import bcrypt from 'bcryptjs';
import pool from '../lib/db';

async function createUser() {
    try {
        const usrName = 'Ruben Rivadeneira';
        const usrUserName = 'rrivadeneira';
        const usrPassword = 'rrivadeneira2025$$';

        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(usrPassword, 10);

        // Insertar usuario
        const [result]: any = await pool.execute(
            'INSERT INTO users (usrName, usrUserName, usrPassword) VALUES (?, ?, ?)',
            [usrName, usrUserName, hashedPassword]
        );

        console.log('✅ Usuario creado exitosamente');
        console.log('ID:', result.insertId);
        console.log('Nombre:', usrName);
        console.log('Usuario:', usrUserName);
        console.log('Contraseña original:', usrPassword);
        console.log('Contraseña hasheada:', hashedPassword);

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

createUser();