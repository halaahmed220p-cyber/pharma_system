import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import logo from '../assets/logo.png';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Master Admin');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'https://pharma-system.onrender.com';
            const res = await axios.post(`${API_URL}/api/login`, { username, password, role });
            if (res.data.success) {
                onLogin(res.data.user);
            }
        } catch (err) {
            alert('خطأ في تسجيل الدخول، تأكد من البيانات أو الدور المحدد');
        }
    };

    return (
        <div className="login-page">
            <div className="login-card">
                <div className="login-header">
                    <img src={logo} alt="PHARM Logo" className="logo-img" />
                    <h2>نظام إدارة PECT</h2>
                    <p>المؤتمر والمعرض الصيدلاني (PHARM)</p>
                </div>

                <form onSubmit={handleLogin} className="login-form">
                    <h3>تسجيل الدخول إلى النظام</h3>
                    
                    <div className="input-group">
                        <label>اسم المستخدم</label>
                        <div className="input-field-wrapper">
                            <input 
                                type="text" 
                                placeholder="أدخل اسم المستخدم" 
                                value={username} 
                                onChange={e => setUsername(e.target.value)} 
                                required 
                            />
                            <i className="icon-user">👤</i>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>كلمة المرور</label>
                        <div className="input-field-wrapper">
                            <input 
                                type="password" 
                                placeholder="••••••••" 
                                value={password} 
                                onChange={e => setPassword(e.target.value)} 
                                required 
                            />
                            <i className="icon-lock">🔒</i>
                        </div>
                    </div>

                    <div className="input-group">
                        <label>الصلاحية / الدور</label>
                        <div className="radio-group" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '5px' }}>
                            <label className="radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    checked={role === 'Master Admin'} 
                                    onChange={() => setRole('Master Admin')} 
                                />
                                المسؤول الرئيسي (Master Admin)
                            </label>
                            
                            <label className="radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    checked={role === 'Verifier'} 
                                    onChange={() => setRole('Verifier')} 
                                />
                                موثق البيانات (Verifier)
                            </label>

                            <label className="radio-label" style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                                <input 
                                    type="radio" 
                                    name="role" 
                                    checked={role === 'Data Entry'} 
                                    onChange={() => setRole('Data Entry')} 
                                />
                                مدخل البيانات (Data Entry)
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="login-btn">
                        تسجيل الدخول <span>←</span>
                    </button>
                </form>
            </div>
        </div>
    );
}