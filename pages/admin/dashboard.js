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
                      <button className="border-2 border-dashed border-blue-300 px-3 py-1 rounded-full text-sm hover:border-blue-500">
                        + إضافة
                      </button>
                    </div>
                  </div>

                  <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all shadow-lg">
                    💾 حفظ إعدادات البوت
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="🎯 أدوات سريعة" icon="🚀">
                <div className="grid grid-cols-2 gap-4">
                  <QuickAction icon="📊" title="تصدير الطلبات" color="from-green-500 to-green-600" />
                  <QuickAction icon="🔄" title="مزامنة الآن" color="from-blue-500 to-blue-600" />
                  <QuickAction icon="🧹" title="تنظيف البيانات" color="from-yellow-500 to-yellow-600" />
                  <QuickAction icon="📢" title="إرسال إشعار" color="from-red-500 to-red-600" />
                </div>
              </SectionCard>
            </div>

            <div className="space-y-8">
              <SectionCard title="➕ إضافة مندوب جديد" icon="👥">
                <div className="space-y-4">
                  <input type="text" placeholder="اسم المندوب" value={newDelegate.name} onChange={(e) => setNewDelegate({...newDelegate, name: e.target.value})} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none" />
                  <select value={newDelegate.governorate} onChange={(e) => setNewDelegate({...newDelegate, governorate: e.target.value})} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none">
                    {['القاهرة', 'الجيزة', 'الاسكندرية', 'المنوفية', 'الشرقية', 'الغربية', 'الدقهلية', 'كفر الشيخ', 'الفيوم', 'بني سويف'].map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                  <input type="tel" placeholder="رقم واتساب (+20100...)" value={newDelegate.whatsapp} onChange={(e) => setNewDelegate({...newDelegate, whatsapp: e.target.value})} className="w-full border-2 border-gray-200 rounded-lg p-3 focus:border-blue-500 focus:outline-none" />
                  <button onClick={addDelegate} className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-lg">
                    ✅ إضافة المندوب
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="📱 المندوبين النشطين" icon="👥">
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {delegates.map(delegate => (
                    <div key={delegate.id} className="border rounded-lg p-3 hover:bg-gray-50 transition-all">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold">{delegate.name}</h4>
                          <p className="text-sm text-gray-600">{delegate.governorate}</p>
                          <p className="text-xs text-blue-600 mt-1">📱 {delegate.whatsapp}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-blue-600">{delegate.orders}</p>
                          <p className="text-xs text-gray-500">طلب</p>
                          <button onClick={() => setDelegates(prev => prev.map(d => d.id === delegate.id ? {...d, active: !d.active} : d))} className={`mt-2 px-3 py-1 rounded text-xs ${delegate.active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                            {delegate.active ? '🟢 نشط' : '🔴 متوقف'}
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <button className="flex-1 bg-blue-500 text-white py-1 rounded text-sm hover:bg-blue-600">
                          📱 واتساب
                        </button>
                        <button className="flex-1 bg-gray-300 text-gray-700 py-1 rounded text-sm hover:bg-gray-400">
                          📋 التفاصيل
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          </div>

        </main>

        {chatOpen && (
          <div className="fixed bottom-6 left-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-600 to-purple-700 text-white p-4 flex justify-between items-center">
              <h3 className="font-bold">🤖 مساعد النظام الذكي</h3>
              <button onClick={() => setChatOpen(false)} className="text-2xl hover:scale-110 transition">✕</button>
            </div>
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`mb-3 flex ${msg.role === 'user' ? 'justify-start' : 'justify-end'}`}>
                  <div className={`max-w-xs px-4 py-2 rounded-2xl ${msg.role === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t bg-white flex gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()} placeholder="اشرح مشكلتك هنا..." className="flex-1 border-2 border-gray-200 rounded-full px-4 py-2 focus:border-purple-500 focus:outline-none" />
              <button onClick={sendChatMessage} className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition-all">➤</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}

function StatusCard({ title, active, stats, onToggle }) {
  return (
    <div className={`bg-white rounded-xl shadow-lg p-6 transform hover:scale-105 transition-all ${active ? 'border-4 border-green-400' : 'border-2 border-gray-200'}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-bold text-lg">{title}</h3>
        <span className={`text-sm px-3 py-1 rounded-full ${active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'}`}>
          {active ? '🟢' : '⚫'}
        </span>
      </div>
      <p className="text-gray-600 text-sm mb-4">{stats}</p>
      <button onClick={onToggle} className={`w-full py-2 rounded-lg font-bold transition-all ${active ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}>
        {active ? 'إيقاف الخدمة' : 'تشغيل الخدمة'}
      </button>
    </div>
  );
}

function SectionCard({ title, icon, children }) {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-2xl">{icon}</span>
        <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {title}
        </h2>
      </div>
      {children}
    </div>
  );
}

function TabButton({ label, active }) {
  return (
    <button className={`px-4 py-2 rounded-lg font-medium transition-all ${active ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
      {label}
    </button>
  );
}

function QuickAction({ icon, title, color }) {
  return (
    <button className={`bg-gradient-to-r ${color} text-white p-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all`}>
      <div className="text-2xl mb-2">{icon}</div>
      <div className="font-bold">{title}</div>
    </button>
  );
}
