// ==================== إعدادات النظام ====================
const CONFIG = {
  facebook: {
    verifyToken: 'YOUR_VERIFY_TOKEN',
    accessToken: 'YOUR_PAGE_ACCESS_TOKEN'
  },
  openai: {
    apiKey: 'YOUR_OPENAI_API_KEY',
    model: 'gpt-4-turbo-preview'
  },
  whatsapp: {
    phoneId: 'YOUR_WHATSAPP_PHONE_ID',
    token: 'YOUR_WHATSAPP_TOKEN'
  },
  sheetNames: {
    delegates: 'المندوبين',
    orders: 'الطلبات',
    pages: 'الصفحات',
    config: 'الإعدادات'
  }
};

// ==================== 1. إدارة المندوبين ====================
function manageDelegates() {
  const sheet = getSheet(CONFIG.sheetNames.delegates);
  const delegates = sheet.getDataRange().getValues().slice(1);
  return delegates.map(row => ({
    id: row[0],
    name: row[1],
    governorate: row[2],
    whatsapp: row[3],
    active: row[4] === 'نعم',
    orderCount: row[5] || 0
  }));
}

function addDelegate(delegateData) {
  const sheet = getSheet(CONFIG.sheetNames.delegates);
  sheet.appendRow([
    Date.now(),
    delegateData.name,
    delegateData.governorate,
    delegateData.whatsapp,
    'نعم',
    0
  ]);
}

// ==================== 2. توزيع الطلبات ====================
function distributeOrder(order) {
  const delegates = manageDelegates().filter(d => d.governorate === order.governorate && d.active);
  if (delegates.length === 0) throw new Error('لا يوجد مندوبين نشطين في ' + order.governorate);
  
  const selectedDelegate = delegates.reduce((min, d) => d.orderCount < min.orderCount ? d : min);
  const ordersSheet = getSheet(CONFIG.sheetNames.orders);
  ordersSheet.appendRow([
    Date.now(),
    order.customerName,
    order.phone,
    order.address,
    order.governorate,
    JSON.stringify(order.items),
    selectedDelegate.name,
    selectedDelegate.whatsapp,
    'جديد',
    new Date().toLocaleString('ar-EG')
  ]);
  
  updateDelegateCount(selectedDelegate.id);
  sendToDelegate(selectedDelegate.whatsapp, order);
  return selectedDelegate;
}

// ==================== 3. تكامل Facebook Webhook ====================
function doPost(e) {
  const data = JSON.parse(e.postData.contents);
  if (data.object === 'page') {
    data.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        if (event.message) handleFacebookMessage(event);
        else if (event.comment) handleFacebookComment(event);
      });
    });
  }
  return ContentService.createTextOutput('OK').setMimeType(ContentService.MimeType.TEXT);
}

function handleFacebookMessage(event) {
  const senderId = event.sender.id;
  const message = event.message.text;
  const response = processWithAI(message, event);
  sendFacebookMessage(senderId, response);
  
  if (isOrder(message)) {
    const order = extractOrderDetails(message);
    distributeOrder(order);
  }
}

// ==================== 4. معالجة الذكاء الاصطناعي ====================
function processWithAI(message, context) {
  const config = getSheet(CONFIG.sheetNames.config);
  const aiEnabled = config.getRange('B1').getValue();
  if (!aiEnabled) return processWithLocalBot(message);
  
  const url = 'https://api.openai.com/v1/chat/completions';
  const payload = {
    model: CONFIG.openai.model,
    messages: [
      {role: 'system', content: 'أنت مساعد خدمة عملاء لشركة توصيل طلبات في مصر. استخرج تفاصيل الطلب إن وجدت.'},
      {role: 'user', content: message}
    ],
    temperature: 0.7
  };
  
  const options = {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + CONFIG.openai.apiKey,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  };
  
  const response = UrlFetchApp.fetch(url, options);
  const result = JSON.parse(response.getContentText());
  return result.choices[0].message.content;
}

// ==================== 5. البوت المحلي بدون نت ====================
function processWithLocalBot(message) {
  const patterns = {
    'مرحبا|السلام|اهلا': 'مرحباً! كيف يمكنني مساعدتك اليوم؟',
    'طلب|عايز|حابب|وداي': 'بالتأكيد! أريد منك: الاسم، رقم التليفون، العنوان، والطلبات.',
    'شكرا|تسلم|مع السلامة': 'شكراً لك! تم تسجيل طلبك وسيتم التواصل قريباً.',
    'اسمي|عنواني|تليفوني': 'شكراً! هل أدخلت جميع البيانات المطلوبة؟'
  };
  
  for (let pattern in patterns) {
    const regex = new RegExp(pattern, 'i');
    if (regex.test(message)) return patterns[pattern];
  }
  return 'عفواً، لم أفهم. هل يمكنك إعادة صياغة الطلب؟ (الاسم، رقم التليفون، العنوان، الطلبات)';
}

// ==================== 6. إرسال WhatsApp ====================
function sendToDelegate(whatsapp, order) {
  const message = `📦 *طلب جديد* 👤 ${order.customerName} 📱 ${order.phone} 📍 ${order.address} 🛍️ ${order.items.join(', ')}`;
  const url = `https://graph.facebook.com/v18.0/${CONFIG.whatsapp.phoneId}/messages`;
  const payload = {
    messaging_product: 'whatsapp',
    to: whatsapp,
    text: { body: message }
  };
  
  UrlFetchApp.fetch(url, {
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + CONFIG.whatsapp.token,
      'Content-Type': 'application/json'
    },
    payload: JSON.stringify(payload)
  });
}

// ==================== 7. مساعد النظام الذكي ====================
function aiSystemHelper(userQuery) {
  return processWithAI(`أنت مساعد نظام. المستخدم يواجه: "${userQuery}". قدم حلاً فورياً بالعربية.`, {});
}

// ==================== وظائف مساعدة ====================
function getSheet(name) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    initializeSheet(sheet, name);
  }
  return sheet;
}

function initializeSheet(sheet, name) {
  if (name === CONFIG.sheetNames.delegates) {
    sheet.getRange('A1:F1').setValues([['ID', 'الاسم', 'المحافظة', 'واتساب', 'نشط', 'عدد الطلبات']]);
  } else if (name === CONFIG.sheetNames.orders) {
    sheet.getRange('A1:J1').setValues([['ID', 'العميل', 'التليفون', 'العنوان', 'المحافظة', 'الطلبات', 'المندوب', 'واتساب المندوب', 'الحالة', 'التاريخ']]);
  } else if (name === CONFIG.sheetNames.config) {
    sheet.getRange('A1:B2').setValues([['AI مفعّل', 'نعم'], ['آخر تحديث', new Date()]]);
  }
}

function sendFacebookMessage(recipientId, message) {
  const url = `https://graph.facebook.com/v18.0/me/messages?access_token=${CONFIG.facebook.accessToken}`;
  const payload = { recipient: { id: recipientId }, message: { text: message } };
  UrlFetchApp.fetch(url, { method: 'post', payload: JSON.stringify(payload) });
}

function updateDelegateCount(delegateId) {
  // زيادة عدد الطلبات
}

function isOrder(message) {
  return /(طلب|عايز|حابب|وداي)/i.test(message);
}

function extractOrderDetails(message) {
  return {
    customerName: 'استخرج من الرسالة',
    phone: 'استخرج من الرسالة',
    address: 'استخرج من الرسالة',
    governorate: 'القاهرة',
    items: ['منتج1', 'منتج2']
  };
}

function handleFacebookComment(event) {
  // معالجة التعليقات
}