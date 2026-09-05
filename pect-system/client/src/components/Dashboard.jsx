import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Dashboard.css';
import logo from '../assets/logo.png';

export default function Dashboard({ user, onLogout, setActiveTab }) {
    const [stats, setStats] = useState({ total: 19, participants: 14, organizers: 6 });
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-system.onrender.com';
const res = await axios.get(`${API_URL}/api/participants`);
            .then(res => {
                if(res.data && res.data.length > 0) {
                    setStats({
                        total: res.data.length,
                        participants: res.data.filter(p => p.add_type === 'مشارك').length,
                        organizers: res.data.filter(p => p.add_type === 'منظم حدث').length
                    });
                }
            })
            .catch(err => console.log(err));
    }, []);

    // التعامل مع البحث السريع من الهيدر والانتقال لصفحة الجدول
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setActiveTab('table'); // الانتقال لصفحة مراجعة الأسماء والبحث
        }
    };

    return (
        <div className="dashboard-container">
            {/* الهيدر العلوي */}
            <header className="dashboard-header">
                <div className="header-right">
                    <img src={logo} alt="Logo" className="nav-brand-logo" />
                    <span>PECT Management</span>
                    <form onSubmit={handleSearchSubmit} className="search-bar-top">
                        <input 
                            type="text" 
                            placeholder="ابحث عن أي شخص بالاسم..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </div>
                <div className="header-left">
                    <ul className="nav-links">
                        <li className="active">اللوحة الرئيسية</li>
                        <li onClick={() => setActiveTab('verify')}>توثيق البيانات</li>
                        <li onClick={() => setActiveTab('add')}>اضافة البيانات</li>
                        <li onClick={() => setActiveTab('table')}>مراجعة الأسماء</li>
                    </ul>
                    <span style={{cursor: 'pointer', color: '#f87171'}} onClick={onLogout} title="تسجيل الخروج">🚪 خروج</span>
                </div>
            </header>

            {/* محتوى اللوحة */}
            <div className="dashboard-content">
                {/* بانر الترحيب */}
                <div className="welcome-banner">
                    <div className="banner-badge">PECT System 2026</div>
                    <h1>أهلاً بك في نظام PECT، المسؤول الرئيسي (Master Admin)</h1>
                    <p>الرجاء اختيار إحدى المسارات التالية للبدء:</p>
                </div>

                {/* مربعات الإحصائيات */}
                <div className="stats-container">
                    <div className="stat-box" onClick={() => setActiveTab('table')} style={{cursor: 'pointer'}}>
                        <div>
                            <div className="stat-number">{stats.total}</div>
                            <div className="stat-label">إجمالي المسجلين</div>
                        </div>
                        <span>👥</span>
                    </div>
                    <div className="stat-box">
                        <div>
                            <div className="stat-number">{stats.participants}</div>
                            <div className="stat-label">ملفات القوائم</div>
                        </div>
                        <span>📄</span>
                    </div>
                    <div className="stat-box">
                        <div>
                            <div className="stat-number">{stats.organizers}</div>
                            <div className="stat-label">منظمو الحدث</div>
                        </div>
                        <span>🛡️</span>
                    </div>
                </div>

                {/* المسارات الرئيسية (Path 1 & Path 2) */}
                <div className="paths-container">
                    {/* المسار الثاني: إضافة البيانات */}
                    <div className="path-card" onClick={() => setActiveTab('add')}>
                        <span className="path-badge">المسار الثاني (2 PATH)</span>
                        <h3>اضافة البيانات</h3>
                        <p>إضافة شخص جديد (منظم، مشارك، باحث، حاضر) مع توليد QR وطباعة البطاقة الفورية.</p>
                        <span className="path-link">الانتقال لنموذج التسجيل والتوليد ←</span>
                    </div>

                    {/* المسار الأول: توثيق البيانات */}
                    <div className="path-card" onClick={() => setActiveTab('verify')}>
                        <span className="path-badge">المسار الأول (1 PATH)</span>
                        <h3>توثيق البيانات</h3>
                        <p>التحقق من بيانات الحضور عبر مسح QR Code أو البحث المباشر بالاسم.</p>
                        <span className="path-link">الانتقال لصفحة التوثيق (Scan / Search) ←</span>
                    </div>
                </div>
            </div>
        </div>
    );
}