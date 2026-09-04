import React, { useState } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import VerifyPage from './components/VerifyPage';
import AddParticipant from './components/AddParticipant';
import ManageNames from './components/ManageNames'; // استيراد صفحة مراجعة الأسماء

export default function App() {
    const [user, setUser] = useState(null);
    const [activeTab, setActiveTab] = useState('dashboard');

    if (!user) {
        return <Login onLogin={(userData) => { setUser(userData); setActiveTab('dashboard'); }} />;
    }

    if (activeTab === 'verify') {
        return (
            <div>
                {/* يمكنك إضافة زر عودة للوحة التحكم هنا إذا أردت */}
                <VerifyPage />
            </div>
        );
    }

    if (activeTab === 'add') {
        return (
            <AddParticipant onBack={() => setActiveTab('dashboard')} />
        );
    }

    if (activeTab === 'table') {
        return (
            <ManageNames onBack={() => setActiveTab('dashboard')} />
        );
    }

    return (
        <Dashboard 
            user={user} 
            onLogout={() => setUser(null)} 
            setActiveTab={(tab) => setActiveTab(tab)} 
        />
    );
}