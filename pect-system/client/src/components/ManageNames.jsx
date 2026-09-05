import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ManageNames.css';

export default function ManageNames({ onBack }) {
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState('');
    const [editingItem, setEditingItem] = useState(null);

    // تعريف الرابط هنا يجعله متاحاً لكل الدوال في هذا الملف
    const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-system.onrender.com';

    const fetchRecords = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}/api/participants`);
            if (Array.isArray(response.data)) {
                setRecords(response.data);
            } else if (response.data && Array.isArray(response.data.data)) {
                setRecords(response.data.data);
            } else {
                setRecords([]);
            }
            setLoading(false);
        } catch (err) {
            console.error("خطأ في جلب البيانات:", err);
            setErrorMsg('تعذر الاتصال بقاعدة البيانات.');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleDelete = async (item) => {
        const recordId = item.id || item._id;
        if (window.confirm('هل أنت متأكد من حذف هذا السجل نهائياً؟')) {
            try {
                await axios.delete(`${API_URL}/api/participants/${recordId}`);
                setRecords(records.filter(r => (r.id || r._id) !== recordId));
            } catch (err) {
                console.error("خطأ الحذف:", err);
                alert('فشل عملية الحذف');
            }
        }
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        const recordId = editingItem.id || editingItem._id;
        
        try {
            console.log("إرسال التعديل للسجل رقم:", recordId, editingItem);
            
            await axios.put(`${API_URL}/api/participants/${recordId}`, {
                full_name: editingItem.full_name,
                add_type: editingItem.add_type,
                sub_category: editingItem.sub_category,
                role_title: editingItem.role_title,
                qr_code: editingItem.qr_code
            });

            alert('تم تعديل البيانات بنجاح');
            setEditingItem(null);
            fetchRecords();
        } catch (err) {
            console.error("خطأ في حفظ التعديلات:", err.response?.data || err.message);
            alert(`فشل حفظ التعديلات: ${err.response?.data?.message || err.message}`);
        }
    };

    return (
        <div className="manage-container">
            <div className="manage-header-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <div>
                    <h2>مراجعة الأسماء وقاعدة البيانات</h2>
                    <p className="sub-desc">إدارة، تعديل، أو حذف السجلات المسجلة في النظام (جدول participants)</p>
                </div>
                {onBack && (
                    <button onClick={onBack} className="back-btn" style={{ padding: '8px 16px', background: '#1e3a8a', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>
                        ← العودة للوحة الرئيسية
                    </button>
                )}
            </div>

            {errorMsg && <div style={{ color: 'red', marginBottom: '15px', background: '#fee2e2', padding: '10px', borderRadius: '6px' }}>{errorMsg}</div>}

            {loading ? (
                <div className="loading-text" style={{ textAlign: 'center', padding: '40px', fontSize: '16px', color: '#475569' }}>جاري تحميل البيانات...</div>
            ) : (
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>الاسم الكامل</th>
                                <th>النوع</th>
                                <th>التصنيف الفرعي</th>
                                <th>المسمى الوظيفي</th>
                                <th>الرقم التعريفي (QR)</th>
                                <th>مرات الحضور</th>
                                <th>تاريخ التسجيل</th>
                                <th>الإجراءات</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.length > 0 ? (
                                records.map((item, index) => {
                                    const recordId = item.id || item._id;
                                    return (
                                        <tr key={recordId || index}>
                                            <td>{index + 1}</td>
                                            <td><strong>{item.full_name}</strong></td>
                                            <td><span className="badge-pill">{item.add_type}</span></td>
                                            <td>{item.sub_category || '---'}</td>
                                            <td>{item.role_title || '---'}</td>
                                            <td><code>{item.qr_code}</code></td>
                                            <td>{item.attendance_count ?? 0}</td>
                                            <td>{item.created_at ? new Date(item.created_at).toLocaleDateString() : '---'}</td>
                                            <td className="actions-cell">
                                                <button className="edit-btn" onClick={() => setEditingItem({...item})}>✏️ تعديل</button>
                                                <button className="delete-btn" onClick={() => handleDelete(item)}>🗑️ حذف</button>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan="9" className="no-data" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                        لا توجد بيانات مسجلة حالياً.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {editingItem && (
                <div className="modal-overlay">
                    <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
                        <h3>تعديل بيانات المستخدم</h3>
                        <form onSubmit={handleUpdateSubmit}>
                            <label>الاسم الكامل (full_name):</label>
                            <input 
                                type="text" 
                                value={editingItem.full_name || ''} 
                                onChange={(e) => setEditingItem({...editingItem, full_name: e.target.value})}
                                required
                            />

                            <label>نوع الإضافة (add_type):</label>
                            <input 
                                type="text" 
                                value={editingItem.add_type || ''} 
                                onChange={(e) => setEditingItem({...editingItem, add_type: e.target.value})}
                                required
                            />

                            <label>التصنيف الفرعي (sub_category):</label>
                            <input 
                                type="text" 
                                value={editingItem.sub_category || ''} 
                                onChange={(e) => setEditingItem({...editingItem, sub_category: e.target.value})}
                            />

                            <label>المسمى الوظيفي (role_title):</label>
                            <input 
                                type="text" 
                                value={editingItem.role_title || ''} 
                                onChange={(e) => setEditingItem({...editingItem, role_title: e.target.value})}
                            />

                            <label>الرقم التعريفي (qr_code):</label>
                            <input 
                                type="text" 
                                value={editingItem.qr_code || ''} 
                                onChange={(e) => setEditingItem({...editingItem, qr_code: e.target.value})}
                                required
                            />

                            <div className="modal-actions" style={{ marginTop: '15px' }}>
                                <button type="submit" className="save-btn">حفظ التعديلات</button>
                                <button type="button" className="cancel-btn" onClick={() => setEditingItem(null)}>إلغاء</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}