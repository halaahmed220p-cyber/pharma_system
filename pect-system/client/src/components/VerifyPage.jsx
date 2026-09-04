import React, { useState, useEffect } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import axios from 'axios';
import './VerifyData.css';

export default function VerifyData() {
    const [activeTab, setActiveTab] = useState('qr'); 
    const [searchName, setSearchName] = useState('');
    const [qrInput, setQrInput] = useState('');
    const [verifiedData, setVerifiedData] = useState(null);
    const [errorMsg, setErrorMsg] = useState('');
    const [scannerActive, setScannerActive] = useState(false);

    // دالة التحقق عبر الباك اند (السيرفر)
    const verifyCodeOnServer = async (codeToVerify) => {
        try {
            const res = await axios.post('http://localhost:5000/api/verify', { qr_code: codeToVerify });
            if (res.data.success) {
                setVerifiedData(res.data.data);
                setErrorMsg('');
                setScannerActive(false);
            }
        } catch (err) {
            setErrorMsg('الرمز غير موجود أو حدث خطأ في التحقق');
        }
    };

    // تشغيل الكاميرا الحقيقية
    const startCameraScanner = () => {
        setScannerActive(true);
        setTimeout(() => {
            const scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                false
            );

            scanner.render(
                (decodedText) => {
                    // عند نجاح مسح الكود بالكاميرا
                    verifyCodeOnServer(decodedText);
                    scanner.clear().catch(error => console.error("Failed to clear scanner."));
                },
                (error) => {
                    // أخطاء المسح المؤقتة تتجاهل لتجنب الإزعاج
                }
            );
        }, 100);
    };

    return (
        <div className="verify-container">
            <div className="verify-header-tabs">
                <button 
                    className={`tab-btn ${activeTab === 'name' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('name'); setVerifiedData(null); setScannerActive(false); }}
                >
                    📝 اكتب الاسم للتحقق
                </button>
                <button 
                    className={`tab-btn ${activeTab === 'qr' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('qr'); setVerifiedData(null); }}
                >
                    📷 امسح QR Code
                </button>
            </div>

            <div className="verify-card-box">
                <div className="verify-title-section">
                    <h2>توثيق البيانات والتحقق</h2>
                    <p>توثيق الحضور والتحقق من رمز QR أو الاسم المباشر</p>
                </div>

                {/* التبويب الأول: مسح الـ QR والكاميرا */}
                {activeTab === 'qr' && !verifiedData && (
                    <div className="qr-section-content">
                        <h3>ماسح الـ QR Code الضوئي</h3>
                        <p className="sub-text">قم بتوجيه الكاميرا نحو رمز QR الضوئي، أو أدخل الرمز يدوياً</p>
                        
                        <div className="camera-frame-container">
                            {!scannerActive ? (
                                <div className="camera-placeholder">
                                    <span className="cam-icon">📷</span>
                                    <button className="activate-cam-btn" onClick={startCameraScanner}>
                                        تفعيل الكاميرا للمسح
                                    </button>
                                </div>
                            ) : (
                                <div id="reader" style={{ width: '100%', background: '#fff', borderRadius: '8px' }}></div>
                            )}
                        </div>

                        <div className="manual-qr-input" style={{ marginTop: '20px' }}>
                            <span>أو أدخل رمز QR / UUID يدوياً:</span>
                            <div className="input-with-btn">
                                <input 
                                    type="text" 
                                    placeholder="مثال: PECT-577669"
                                    value={qrInput}
                                    onChange={(e) => setQrInput(e.target.value)}
                                />
                                <button onClick={() => verifyCodeOnServer(qrInput)} className="check-now-btn">تحقق الآن</button>
                            </div>
                        </div>
                        {errorMsg && <p style={{ color: 'red', textAlign: 'center', fontSize: '13px' }}>{errorMsg}</p>}
                    </div>
                )}

                {/* عرض نتيجة التوثيق الناجح */}
                {verifiedData && (
                    <div className="success-verification-result">
                        <div className="success-badge-header">
                            ✔️ تم التوثيق بنجاح!
                        </div>
                        <h3>تفاصيل البيانات الموثقة:</h3>

                        <div className="details-grid-card">
                            <div className="detail-row">
                                <span className="label">الاسم الكامل:</span>
                                <span className="value bold">{verifiedData.full_name}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">الرقم التعريفي (QR / UUID):</span>
                                <span className="value code">{verifiedData.qr_code}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">الصفة / المسمى:</span>
                                <span className="value badge-tag-pill">{verifiedData.role_title || verifiedData.add_type}</span>
                            </div>
                            <div className="detail-row">
                                <span className="label">عدد مرات الحضور:</span>
                                <span className="value">{verifiedData.attendance_count || 1} مرات</span>
                            </div>
                        </div>

                        <div className="result-actions">
                            <button className="print-badge-from-verify-btn" onClick={() => window.print()}>
                                🖨️ طباعة بطاقة الحضور
                            </button>
                            <button className="reset-verify-btn" onClick={() => { setVerifiedData(null); setQrInput(''); }}>
                                بحث عن شخص آخر
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}