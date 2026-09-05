import React, { useState } from 'react';
import axios from 'axios';
import './AddParticipant.css';

export default function AddParticipant({ onBack }) {
    const [formData, setFormData] = useState({
        add_type: 'منظم حدث',
        sub_category: 'فريق التصميم',
        full_name: '',
        role_title: 'عضو'
    });
    
    const [savedCard, setSavedCard] = useState(null);

    const addTypes = [
        'منظم حدث', 'مشارك', 'حاضر', 'باحث', 
        'حاضر أونلاين', 'دكتور', 'لجنة علمية', 
        'منظم الحدث', 'مساعدة المنظم'
    ];

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
             const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-system.onrender.com';
            setSavedCard(res.data); // البيانات المرجعة مع الـ QR
        } catch (err) {
            alert('حدث خطأ أثناء الحفظ');
        }
    };

    return (
        <div className="add-container">
            <button className="back-btn" onClick={onBack}>← عودة للوحة التحكم</button>
            
            {!savedCard ? (
                <div className="form-card">
                    <h2>إضافة شخص جديد للنظام</h2>
                    <p className="subtitle">إضافة بياناتك مع التحقق الآلي وإنشاء رمز QR والبطاقة</p>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="input-group">
                            <label>نوع الإضافة *</label>
                            <select 
                                value={formData.add_type} 
                                onChange={(e) => setFormData({...formData, add_type: e.target.value})}
                            >
                                {addTypes.map((type, idx) => (
                                    <option key={idx} value={type}>{type}</option>
                                ))}
                            </select>
                        </div>

                        {formData.add_type === 'منظم حدث' && (
                            <div className="sub-section">
                                <h4>بيانات فريق تنظيم الحدث (Event Organizer Data)</h4>
                                <div className="input-group">
                                    <label>1. نوع الفريق *</label>
                                    <select 
                                        value={formData.sub_category}
                                        onChange={(e) => setFormData({...formData, sub_category: e.target.value})}
                                    >
                                        <option value="فريق التصميم">فريق التصميم</option>
                                        <option value="فريق التقنية">فريق التقنية</option>
                                        <option value="فريق التنظيم">فريق التنظيم</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        <div className="input-group">
                            <label>2. الاسم الكامل *</label>
                            <input 
                                type="text" 
                                placeholder="ادخل الاسم الكامل للمنظم..." 
                                value={formData.full_name}
                                onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                required
                            />
                        </div>

                        <div className="input-group">
                            <label>3. صفة المنظم *</label>
                            <input 
                                type="text" 
                                placeholder="الصفة أو المسمى..." 
                                value={formData.role_title}
                                onChange={(e) => setFormData({...formData, role_title: e.target.value})}
                                required
                            />
                        </div>

                        <button type="submit" className="submit-btn">إنشاء وتوليد البطاقة الفورية</button>
                    </form>
                </div>
            ) : (
                /* نافذة معاينة البطاقة وتنزيل الـ PDF */
                <div className="badge-preview-modal">
                    <div className="badge-card">
                        <div className="badge-header-top">PHARM P</div>
                        <div className="badge-sub">PHARMACEUTICAL CONFERENCE & EXPO</div>
                        <div className="badge-tag">PECT 2026 OFFICIAL BADGE</div>
                        
                        <div className="badge-body">
                            <span className="participant-role-badge">{savedCard.role_title || savedCard.add_type}</span>
                            <h3>{savedCard.full_name}</h3>
                            <p>{savedCard.sub_category || savedCard.add_type}</p>
                            
                            <div className="qr-box">
                                <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${savedCard.qr_code}`} 
                                    alt="QR Code" 
                                />
                                <span className="qr-text">{savedCard.qr_code}</span>
                            </div>
                        </div>
                        <div className="badge-footer">pect-system.org</div>
                    </div>
                    
                    <div className="badge-actions">
                        <button className="download-pdf-btn" onClick={() => window.print()}>📥 تحميل ملف الـ PDF فوراً</button>
                        <button className="close-preview-btn" onClick={() => setSavedCard(null)}>إضافة شخص آخر</button>
                    </div>
                </div>
            )}
        </div>
    );
}