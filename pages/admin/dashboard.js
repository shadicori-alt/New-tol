// pages/admin/dashboard.js - النظام المتكامل الكامل
import { useState, useEffect } from 'react';
import Head from 'next/head';

export default function IntegratedDashboard() {
  const [systemStatus, setSystemStatus] = useState({
    facebook: true,
    whatsapp: false,
    ai: true,
    autoReply: true
  });

  const [facebookPages, setFacebookPages] = useState([
    { id: '123', name: 'صفحة القاهرة', connected: true, messages: 15, comments: 8 },
    { id: '456', name: 'صفحة الجيزة', connected: false, messages: 0, comments: 0 }
  ]);

  const [delegates, setDelegates] = useState([
    { id: 1, name: 'أحمد محمد', governorate: 'القاهرة', whatsapp: '+20100XXXXXX', active: true, orders: 23 },
    { id: 2, name: 'سارة علي', governorate: 'الجيزة', whatsapp: '+20101XXXXXX', active: true, orders: 18 }
  ]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'أهلاً بك! أنا مساعدك الذكي. اطرح أي سؤال عن النظام.' }
  ]);
  const [chatInput, setChatInput] = useState('');

  const [newDelegate, setNewDelegate] = useState({ name: '', governorate: 'القاهرة', whatsapp: '' });

  const [botSettings, setBotSettings] = useState({
    replyMode: 'hybrid',
    responseTime: 2,
    keywords: ['طلب', 'عايز', 'حابب', 'وداي', 'سعر', 'عنوان']
  });

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const newMessages = [...chatMessages, { role: 'user', content: chatInput }];
    setChatMessages(newMessages);
    
    setTimeout(() => {
      setChatMessages([...newMessages, {
        role: 'assistant',
        content: `تم التحليل: "${chatInput}". الحل: اذهب إلى الإعدادات > تكاملات > فيسبوك.`
      }]);
    }, 1000);
    
    setChatInput('');
  };

  const addDelegate = () => {
    if (!newDelegate.name || !newDelegate.whatsapp) {
      alert('الرجاء إدخال الاسم ورقم الواتساب');
      return;
    }
    setDelegates([...delegates, {
      id: Date.now(),
      ...newDelegate,
      active: true,
      orders: 0
    }]);
    setNewDelegate({ name: '', governorate: 'القاهرة', whatsapp: '' });
    alert('✅ تم إضافة المندوب بنجاح');
  };

  const toggleBot = (type) => {
    setSystemStatus(prev => ({ ...prev, [type]: !prev[type] }));
  };

  const quickConnectFacebook = () => {
    alert('🔄 جاري الربط بفيسبوك...');
    setFacebookPages(prev => prev.map(page => 
      page.id === '456' ? { ...page, connected: true } : page
    ));
  };

  return (
    <>
      <Head>
        <title>🤖 منصة التكامل الذكية</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50" dir="rtl">
        <header className="bg-white shadow-lg sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-3">
                <span className="text-3xl">🤖</span>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  منصة التكامل الذكية
                </h1>
              </div>
              <button 
                onClick={() => setChatOpen(!chatOpen)}
                className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-all"
              >
                💬 مساعد
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatusCard title="📘 فيسبوك" active={systemStatus.facebook} stats="3 صفحات مربوطة" onToggle={() => toggleBot('facebook')} />
            <StatusCard title="💬 واتساب" active={systemStatus.whatsapp} stats="قيد الربط" onToggle={() => toggleBot('whatsapp')} />
            <StatusCard title="🧠 الذكاء" active={systemStatus.ai} stats="GPT-4 نشط" onToggle={() => toggleBot('ai')} />
            <StatusCard title="🚀 ردود تلقائية" active={systemStatus.autoReply} stats="معدل الرد: 2 ث" onToggle={() => toggleBot('autoReply')} />
          </div>

          <div className="bg-white rounded-xl shadow-lg p-2 mb-8">
            <div className="flex flex-wrap gap-2">
              <TabButton label="📊 لوحة التحكم" active />
              <TabButton label="📋 الصفحات" />
              <TabButton label="👥 المندوبين" />
              <TabButton label="⚙️ إعدادات البوت" />
              <TabButton label="📈 التقارير" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <SectionCard title="📋 إدارة صفحات فيسبوك" icon="📘">
                <button onClick={quickConnectFacebook} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-lg mb-6 hover:from-blue-600 hover:to-blue-700 transition-all shadow-lg">
                  🔗 اضغط للربط السريع بفيسبوك (OAuth)
                </button>
                <div className="space-y-4">
                  {facebookPages.map(page => (
                    <div key={page.id} className="border rounded-lg p-4 hover:shadow-md transition-all">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-bold text-lg">{page.name}</h3>
                          <div className="flex gap-4 mt-2 text-sm text-gray-600">
                            <span>✉️ {page.messages} رسائل</span>
                            <span>💬 {page.comments} تعليقات</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {page.connected ? (
                            <>
                              <span className="text-green-600">🟢 متصل</span>
                              <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                                إدارة
                              </button>
                            </>
                          ) : (
                            <button className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                              ربط
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="🤖 إعدادات البوت الذكي" icon="⚙️">
                <div className="space-y-6">
                  <div>
                    <label className="block font-semibold mb-2">نمط الرد:</label>
                    <select value={botSettings.replyMode} onChange={(e) => setBotSettings({...botSettings, replyMode: e.target.value})} className="w-full border-2 border-blue-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none">
                      <option value="ai">🧠 ذكاء اصطناعي كامل (OpenAI GPT-4)</option>
                      <option value="hybrid">⚡ هجين (ذكاء + بوت محلي)</option>
                      <option value="local">🏠 بوت محلي فقط (بدون إنترنت)</option>
                      <option value="manual">👤 ردود يدوية من الإداري</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">سرعة الرد (ثواني):</label>
                    <input type="range" min="1" max="10" value={botSettings.responseTime} onChange={(e) => setBotSettings({...botSettings, responseTime: e.target.value})} className="w-full" />
                    <div className="text-center mt-1">{botSettings.responseTime} ثانية</div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-2">كلمات المفتاح للطلبات:</label>
                    <div className="flex flex-wrap gap-2">
                      {botSettings.keywords.map((kw, i) => (
                        <span key={i} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                          {kw} ✕
                        </span>
                      ))}
                      <button className="border-2 border-dashed border-blue-300 px-3 py-1