// ============================================================
// 📡 الرادار العالمي - النسخة الاحترافية الكاملة (Ultimate Pro)
// ============================================================

const globalRingIn = new Audio("https://firebasestorage.googleapis.com/v0/b/pools-e4381.firebasestorage.app/o/sounds%2Fmixkit-happy-bells-notification-937.wav?alt=media&token=3422aeb0-bf76-4670-83aa-5ba59fff7fe5");
globalRingIn.loop = true;

let globalCallDocPath = null;
let targetChatId = null;
let isDismissed = false; 
let vibrationInterval = null; 
let titleInterval = null; 
let wakeLock = null;      
let originalTitle = document.title; 

// ============================================================
// 🛑 دالة الطوارئ (Stop Everything) - تنظيف وإيقاف فوري
// ============================================================
function stopEverything(isMissed = false, callerName = "") {
    // 1. وقف الصوت
    globalRingIn.pause();
    globalRingIn.currentTime = 0;

    // 2. وقف الزن
    if (vibrationInterval) { clearInterval(vibrationInterval); vibrationInterval = null; }
    if (navigator.vibrate) navigator.vibrate(0);

    // 3. وقف وميض العنوان
    if (titleInterval) { clearInterval(titleInterval); titleInterval = null; }
    document.title = originalTitle;

    // 4. إلغاء قفل الشاشة
    if (wakeLock) { wakeLock.release().then(() => wakeLock = null).catch(() => {}); }

    // 5. إخفاء الإشعار
    const banner = document.getElementById('callNotificationBanner');
    if (banner) {
        banner.classList.remove('active');
        setTimeout(() => banner.remove(), 300);
    }

    // 6. إظهار "مكالمة فائتة" لو لم يتم الرد أو الرفض يدوياً
    if (isMissed && !isDismissed) {
        showMissedCallToast(callerName);
    }
}

// ============================================================
// 🔓 كود فك حظر الصوت (يشتغل مرة واحدة عند أول لمسة)
// ============================================================
function unlockAudio() {
    globalRingIn.play().then(() => { globalRingIn.pause(); globalRingIn.currentTime = 0; }).catch((e) => {});
    if (navigator.vibrate) navigator.vibrate(0);
    document.body.removeEventListener('click', unlockAudio);
    document.body.removeEventListener('touchstart', unlockAudio);
}
document.body.addEventListener('click', unlockAudio, { once: true });
document.body.addEventListener('touchstart', unlockAudio, { once: true });


// ============================================================
// 📡 مراقب المكالمات (الرادار)
// ============================================================
(function initGlobalListener() {
    if (typeof firebase === 'undefined') return;

    firebase.auth().onAuthStateChanged(user => {
        if (!user) return; 

        const db = firebase.firestore();
        const currentUserId = user.uid;
        console.log("📡 الرادار الاحترافي يعمل...");

        db.collectionGroup('calls')
            .where('status', '==', 'ringing')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    const callData = change.doc.data();
                    
                    // 1. مكالمة جديدة
                    if (change.type === 'added') {
                        if (callData.callerId !== currentUserId) {
                            const callDocRef = change.doc.ref;
                            targetChatId = callDocRef.parent.parent.id;
                            globalCallDocPath = callDocRef.path;
                            isDismissed = false; 

                            // جلب البيانات الحقيقية
                            db.collection('users').doc(callData.callerId).get()
                            .then(userDoc => {
                                let realName = "مستخدم نبض";
                                let realAvatar = "";
                                if (userDoc.exists) {
                                    const u = userDoc.data();
                                    realName = u.name || "مستخدم نبض";
                                    realAvatar = u.profilePic || "";
                                }
                                callData.callerName = realName;
                                callData.callerAvatar = realAvatar;
                                showHeadsUpNotification(callData);
                            })
                            .catch(() => showHeadsUpNotification(callData));
                        }
                    }

                    // 2. تحديث الحالة
                    if (change.type === 'modified') {
                        if (globalCallDocPath === change.doc.ref.path) {
                            if (!callData || callData.status !== 'ringing') {
                                // نعتبرها فائتة فقط لو لم تكن مرفوضة أو مجابة
                                const isMissed = (callData.status !== 'rejected' && callData.status !== 'picked' && callData.status !== 'answered');
                                stopEverything(isMissed, callData.callerName); 
                            }
                        }
                    }

                    // 3. حذف المكالمة (المتصل أغلق)
                    if (change.type === 'removed') {
                        if (globalCallDocPath === change.doc.ref.path) {
                            stopEverything(true, callData.callerName || "مستخدم");
                        }
                    }
                });
            });
    });
})();

// ============================================================
// 🎨 رسم الإشعار + القوائم
// ============================================================
async function showHeadsUpNotification(data) {
    if (isDismissed) return;
    stopEverything(); // تنظيف أي شيء سابق

    // قفل الشاشة ووميض العنوان
    try { if ('wakeLock' in navigator) wakeLock = await navigator.wakeLock.request('screen'); } catch (err) {}
    let toggle = false;
    originalTitle = document.title;
    titleInterval = setInterval(() => { document.title = toggle ? `📞 ${data.callerName}` : "🔔 مكالمة واردة..."; toggle = !toggle; }, 1000);

    if (!document.getElementById('callNotificationBanner')) {
        const bannerHTML = `
        <div id="callNotificationBanner" class="call-banner-container">
            <div class="banner-content">
                <div class="b-avatar" id="b_avatar"></div>
                <div class="b-info">
                    <h4 id="b_name">...</h4>
                    <span id="b_type">📞 مكالمة واردة</span>
                </div>
                <div class="b-actions">
                    <button class="b-btn message" onclick="toggleQuickReplyMenu()">
                        <i class="fa-solid fa-comment-dots"></i>
                    </button>
                    <button class="b-btn reject" onclick="rejectGlobalCall()">
                        <i class="fa-solid fa-phone-slash"></i>
                    </button>
                    <button class="b-btn accept" onclick="acceptGlobalCall()">
                        <i class="fa-solid fa-phone"></i>
                    </button>
                </div>
            </div>
            
            <div id="quickReplyMenu" class="quick-reply-menu">
                <div onclick="sendQuickReply('سأعاود الاتصال بك لاحقاً 🕒')">سأعاود الاتصال بك لاحقاً 🕒</div>
                <div onclick="sendQuickReply('أنا مشغول الآن 🚫')">أنا مشغول الآن 🚫</div>
                <div onclick="sendQuickReply('هل يمكننا التحدث كتابة؟ 💬')">هل يمكننا التحدث كتابة؟ 💬</div>
                <div onclick="sendQuickReply('في اجتماع، سأكلمك قريباً 💼')">في اجتماع، سأكلمك قريباً 💼</div>
            </div>

            <div class="swipe-area" id="swipeArea"><div class="swipe-indicator"></div></div>
        </div>
        
        <style>
            .call-banner-container {
                position: fixed; top: -300px; left: 10px; right: 10px;
                background: rgba(16, 24, 39, 0.95); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
                border-radius: 18px; padding: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
                border: 1px solid rgba(255, 255, 255, 0.1);
                z-index: 999999;
                transition: top 0.6s cubic-bezier(0.22, 1, 0.36, 1);
                display: flex; flex-direction: column;
            }
            .call-banner-container.active { top: 15px; }
            .banner-content { display: flex; align-items: center; gap: 10px; }
            .b-avatar { width: 50px; height: 50px; border-radius: 50%; background:#333; background-size:cover; border:2px solid #00e5ff; flex-shrink:0; box-shadow: 0 0 10px rgba(0,229,255,0.2); }
            .b-info { flex: 1; overflow: hidden; }
            .b-info h4 { color: #fff; margin:0; font-family:'Cairo',sans-serif; font-size:15px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
            .b-info span { color: #00e5ff; font-family:'Cairo',sans-serif; font-size:12px; display:flex; align-items:center; gap:5px; }
            .b-info span::before { content:''; width:6px; height:6px; background:#00e5ff; border-radius:50%; animation: pulse-dot 1s infinite; }
            
            .b-actions { display: flex; gap: 8px; }
            .b-btn { width: 42px; height: 42px; border-radius: 50%; border:none; color:#fff; font-size:18px; cursor:pointer; display:grid; place-items:center; transition: transform 0.2s; }
            .b-btn:active { transform: scale(0.9); }
            .b-btn.reject { background: linear-gradient(135deg, #ff4b1f, #ff9068); box-shadow: 0 4px 15px rgba(255, 75, 31, 0.3); }
            .b-btn.accept { background: linear-gradient(135deg, #11998e, #38ef7d); box-shadow: 0 4px 15px rgba(56, 239, 125, 0.3); animation: shake-btn 2s infinite; }
            .b-btn.message { background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); }

            .quick-reply-menu {
                max-height: 0; overflow: hidden; transition: max-height 0.4s ease;
                background: rgba(0,0,0,0.3); border-radius: 12px; margin-top: 5px;
            }
            .quick-reply-menu.open { max-height: 200px; margin-top: 10px; }
            .quick-reply-menu div {
                padding: 10px; color: #ccc; font-family: 'Cairo', sans-serif; font-size: 13px;
                border-bottom: 1px solid rgba(255,255,255,0.05); cursor: pointer; text-align: right;
            }
            .quick-reply-menu div:last-child { border-bottom: none; }
            .quick-reply-menu div:active { background: rgba(255,255,255,0.1); color: #fff; }

            .swipe-area { padding-top: 10px; cursor: grab; }
            .swipe-indicator { width: 30px; height: 4px; background: rgba(255,255,255,0.3); border-radius: 10px; margin: 0 auto; }
            
            #missedCallToast {
                position: fixed; bottom: 30px; left: 50%; transform: translateX(-50%);
                background: rgba(0,0,0,0.85); color: #fff; padding: 12px 24px;
                border-radius: 30px; font-family: 'Cairo', sans-serif; font-size: 14px;
                display: flex; align-items: center; gap: 10px; z-index: 999999;
                opacity: 0; transition: opacity 0.5s; pointer-events: none; border: 1px solid #333;
            }
            #missedCallToast.show { opacity: 1; }

            @keyframes pulse-dot { 0% {opacity:1} 50% {opacity:0.4} 100% {opacity:1} }
            @keyframes shake-btn { 0%, 100% {transform: rotate(0deg)} 10% {transform: rotate(10deg)} 20% {transform: rotate(-10deg)} 30% {transform: rotate(10deg)} 40% {transform: rotate(-10deg)} 50% {transform: rotate(0deg)} }
        </style>
        `;
        document.body.insertAdjacentHTML('beforeend', bannerHTML);
        setupSwipeGesture(); 
    }

    const banner = document.getElementById('callNotificationBanner');
    const avatarEl = document.getElementById('b_avatar');
    const nameEl = document.getElementById('b_name');
    const typeEl = document.getElementById('b_type');

    nameEl.innerText = data.callerName || "مستخدم نبض";
    typeEl.innerText = data.isVideo ? "📹 فيديو وارد" : "📞 مكالمة صوتية";
    if (data.callerAvatar) avatarEl.style.backgroundImage = `url('${data.callerAvatar}')`;

    setTimeout(() => banner.classList.add('active'), 100);

    globalRingIn.currentTime = 0;
    globalRingIn.play().catch(()=>{});

    // زن كل ثانيتين
    if (navigator.vibrate) {
        navigator.vibrate(500); 
        vibrationInterval = setInterval(() => { navigator.vibrate(500); }, 2000);
    }
}

// ============================================================
// 🍞 دالة إشعار المكالمة الفائتة
// ============================================================
function showMissedCallToast(name) {
    if (!document.getElementById('missedCallToast')) {
        const toastHTML = `<div id="missedCallToast"><i class="fa-solid fa-phone-slash" style="color:#ff3b30"></i> <span></span></div>`;
        document.body.insertAdjacentHTML('beforeend', toastHTML);
    }
    const toast = document.getElementById('missedCallToast');
    toast.querySelector('span').innerText = `مكالمة فائتة من ${name || "مستخدم"}`;
    toast.classList.add('show');
    setTimeout(() => { toast.classList.remove('show'); }, 4000);
}

// ============================================================
// 💬 التحكم في الرد السريع
// ============================================================
window.toggleQuickReplyMenu = function() {
    const menu = document.getElementById('quickReplyMenu');
    if (menu) menu.classList.toggle('open');
}

window.sendQuickReply = function(msg) {
    rejectGlobalCall(); // 1. رفض المكالمة
    
    // 2. إرسال الرسالة
    if (targetChatId && firebase.auth().currentUser) {
        firebase.firestore().collection('chats').doc(targetChatId).collection('messages').add({
            text: msg,
            senderId: firebase.auth().currentUser.uid,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            type: 'text'
        });
    }
}

// ============================================================
// 🎮 أزرار التحكم (رد، رفض، كتم)
// ============================================================
window.dismissCallLocal = function() {
    stopEverything(); 
    isDismissed = true; 
}

window.acceptGlobalCall = function() {
    stopEverything(); 
    window.location.href = `chat.html?chatId=${targetChatId}&answer=true`;
}

window.rejectGlobalCall = function() {
    stopEverything();
    if (globalCallDocPath) {
        firebase.firestore().doc(globalCallDocPath).update({ status: 'rejected' })
        .catch(err => console.log("Error rejecting:", err));
    }
}

// ============================================================
// 👆 السحب للأعلى (Gestures)
// ============================================================
function setupSwipeGesture() {
    const banner = document.getElementById('callNotificationBanner');
    let startY = 0;
    banner.addEventListener('touchstart', e => { startY = e.touches[0].clientY; }, {passive: true});
    banner.addEventListener('touchmove', e => {
        const currentY = e.touches[0].clientY;
        if (currentY - startY < 0) banner.style.transform = `translateY(${currentY - startY}px)`;
    }, {passive: true});
    banner.addEventListener('touchend', e => {
        if (e.changedTouches[0].clientY < startY - 30) dismissCallLocal();
        else banner.style.transform = 'translateY(0)';
    }, {passive: true});
    const indicator = document.getElementById('swipeArea');
    if(indicator) indicator.onclick = dismissCallLocal;
}
