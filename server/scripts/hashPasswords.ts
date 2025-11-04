import bcrypt from 'bcryptjs';
import pool from '../lib/db';

async function hashExistingPasswords() {
    try {
        // Obtener todos los usuarios
        const [users]: any = await pool.execute('SELECT id, usrPassword FROM users');

        console.log(`Encontrados ${users.length} usuarios`);

        for (const user of users) {
            // Hashear la contraseña actual
            const hashedPassword = await bcrypt.hash(user.usrPassword, 10);
            
            // Actualizar en la base de datos
            await pool.execute(
                'UPDATE users SET usrPassword = ? WHERE id = ?',
                [hashedPassword, user.id]
            );
            
            console.log(`✅ Contraseña hasheada para usuario ID: ${user.id}`);
        }

        console.log('✅ Todas las contraseñas han sido hasheadas');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

hashExistingPasswords();