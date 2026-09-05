const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// الاتصال بقاعدة بيانات Neon PostgreSQL
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// 1. تسجيل الدخول
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const result = await pool.query('SELECT * FROM users WHERE username = $1 AND password = $2', [username, password]);
        if (result.rows.length > 0) {
            res.json({ success: true, user: result.rows[0] });
        } else {
            res.status(401).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 2. جلب كافة المسجلين
app.get('/api/participants', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM participants ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3. إضافة شخص جديد وتوليد الرمز والبطاقة (مسار موحد بدون تكرار)
app.post('/api/participants', async (req, res) => {
    const { add_type, sub_category, full_name, role_title } = req.body;
    const qr_code = 'PECT-' + Math.floor(100000 + Math.random() * 900000); 
    
    try {
        const query = `
            INSERT INTO participants (add_type, sub_category, full_name, role_title, qr_code) 
            VALUES ($1, $2, $3, $4, $5) RETURNING *;
        `;
        const values = [add_type, sub_category || null, full_name, role_title || add_type, qr_code];
        const newParticipant = await pool.query(query, values);
        res.json(newParticipant.rows[0]);
    } catch (err) {
        console.error("Database Error:", err.message);
        res.status(500).json({ error: err.message });
    }
});
// مسار تعديل بيانات المشارك بناءً على الـ id
app.put('/api/participants/:id', async (req, res) => {
    const { id } = req.params;
    const { full_name, add_type, sub_category, role_title, qr_code } = req.body;

    try {
        const query = `
            UPDATE participants 
            SET full_name = $1, add_type = $2, sub_category = $3, role_title = $4, qr_code = $5 
            WHERE id = $6 RETURNING *;
        `;
        const values = [full_name, add_type, sub_category, role_title, qr_code, id];
        
        // استبدل pool بمتغير الاتصال بقاعدة البيانات لديك (مثل client أو db)
        const result = await pool.query(query, values);

        if (result.rowCount === 0) {
            return res.status(404).json({ message: 'السجل غير موجود' });
        }

        res.json({ message: 'تم التعديل بنجاح', updatedRecord: result.rows[0] });
    } catch (err) {
        console.error("خطأ في الخادم أثناء التعديل:", err);
        res.status(500).json({ message: 'خطأ في الخادم الداخلي', error: err.message });
    }
});


// 4. التحقق وتوثيق الحضور
// 4. التحقق وتوثيق الحضور
app.post('/api/verify', async (req, res) => {
    const { qr_code } = req.body;
    try {
        const query = `
            UPDATE participants 
            SET attendance_count = COALESCE(attendance_count, 0) + 1 
            WHERE qr_code = $1 
            RETURNING *;
        `;
        const result = await pool.query(query, [qr_code]);
        if (result.rows.length > 0) {
            res.json({ success: true, data: result.rows[0] });
        } else {
            res.status(404).json({ success: false, message: 'الرمز غير موجود في قاعدة البيانات' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));