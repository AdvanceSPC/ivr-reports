import { Router } from 'express';
import pool from '../lib/db';

const router = Router();

router.get('/data', async (req, res) => {
    const { startDate, endDate, canal } = req.query;
    let query = 'SELECT * FROM ivr WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
        query += ' AND ivrDateStart >= ?';
        params.push(startDate);
    }

    if (endDate) {
        query += ' AND (ivrDateStart <= ? OR ivrDateStart IS NULL)';
        params.push(endDate);
    }

    if (canal && canal !== 'todos') {
        if (canal === 'llamadas') {
            query += " AND UPPER(ivrCanal) LIKE '%CALL%'";
        } else if (canal === 'whatsapp') {
            query += " AND UPPER(ivrCanal) LIKE '%WHATSAPP%'";
        } else if (canal === 'messenger') {
            query += " AND UPPER(ivrCanal) LIKE '%MESSENGER%'";
        }
    }

    query += ' ORDER BY ivrDateStart DESC';

    try {
        const [rows] = await pool.execute(query, params);
        res.json(rows);
    } catch (error) {
        console.error('Error ejecutando consulta IVR:', error);
        res.status(500).json({ error: 'Error consultando datos de IVR' });
    }
});


export default router;