// ============================================================
// 📡 الرادار العالمي - (نسخة الإصلاح النهائي للتعليق)
// ============================================================

const globalRingIn = new Audio("https://firebasestorage.googleapis.com/v0/b/pools-e4381.firebasestorage.app/o/sounds%2Fmixkit-happy-bells-notification-937.wav?alt=media&token=3422aeb0-bf76-4670-83aa-5ba59fff7fe5");
globalRingIn.loop = true;

let globalCallDocPath = null;
let targetChatId = null;
let isDismissed = false; 
let vibrationInterval = null; 

// ============================================================
// 🛑 دالة الطوارئ (وقف كل شيء) - أهم دالة
// ============================================================
function stopEverything() {
    // 1. وقف الصوت
    globalRingIn.pause();
    globalRingIn.currentTime = 0;

    // 2. وقف الزن المتكرر
    if (vibrationInterval) {
        clearInterval(vibrationInterval);
        vibrationInterval = null;
    }

    // 3. وقف اهتزاز الموبايل الحالي
    if (navigator.vibrate) navigator.vibrate(0);

    // 4. إخفاء الإشعار
    const banner = document.getElementById('callNotificationBanner');
    if (banner) {
        banner.classList.remove('active');
        setTimeout(() => banner.remove(), 300);
    }
}

// ============================================================
// 🔓 كود فك حظر الصوت
// ============================================================
function unlockAudio() {
    globalRingIn.play().then(() => {
        globalRingIn.pause();
        globalRingIn.currentTime = 0;
    }).catch((e) => {});
    if (navigator.vibrate) navigator.vibrate(0);
    document.body.removeEventListener('click', unlockAudio);
    document.body.removeEventListener('touchstart', unlockAudio);
}
document.body.addEventListener('click', unlockAudio, { once: true });
document.body.addEventListener('touchstart', unlockAudio, { once: true });


// ============================================================
// 📡 الرادار والمراقبة
// ============================================================
(function initGlobalListener() {
    if (typeof firebase === 'undefined') return;

    firebase.auth().onAuthStateChanged(user => {
        if (!user) return; 

        const db = firebase.firestore();
        const currentUserId = user.uid;

        console.log("📡 الرادار يعمل (نظام منع التعليق)...");

        db.collectionGroup('calls')
            .where('status', '==', 'ringing')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    const callData = change.doc.data();
                    
                    // 1. حالة اتصال جديد
                    if (change.type === 'added') {
                        if (callData.callerId !== currentUserId) {
                            const callDocRef = change.doc.ref;
                            targetChatId = callDocRef.parent.parent.id;
                            globalCallDocPath = callDocRef.path;
                            isDismissed = false; 

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

                    // 2. حالة التعديل (حد رد أو كنسل)
                    if (change.type === 'modified') {
                        if (globalCallDocPath === change.doc.ref.path) {
                            // لو الحالة مبقتش "ringing" (يعني بقت rejected, ended, picked...)
                            if (!callData || callData.status !== 'ringing') {
                                stopEverything(); // 🛑 وقف فوراً
                            }
                        }
                    }

                    // 3. حالة الحذف (الطرف التاني قفل الخط وحذف الملف)
                    if (change.type === 'removed') {
                        // لو الملف المحذوف هو نفس ملف مكالمتنا
                        if (globalCallDocPath === change.doc.ref.path) {
                            stopEverything(); // 🛑 وقف فوراً
                        }
                    }
                });
            });
    });
})();

// ============================================================
// 🎨 رسم الإشعار
// ============================================================
function showHeadsUpNotification(data) {
    if (isDismissed) return;

    // تأمين: نوقف أي حاجة قديمة الأول عشان مفيش صوتين يشتغلوا فوق بعض
    stopEverything();

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
                    <button class="b-btn reject" onclick="rejectGlobalCall()"><i class="fa-solid fa-phone-slash"></i></button>
                    <button class="b-btn accept" onclick="acceptGlobalCall()"><i class="fa-solid fa-phone"></i></button>
                </div>
            </div>
            <div class="swipe-area" id="swipeArea"><div class="swipe-indicator"></div></div>
        </div>
        <style>
            .call-banner-container {
                position: fixed; top: -150px; left: 10px; right: 10px;
                background: rgba(15, 23, 42, 0.95); backdrop-filter: blur(15px);
                border-radius: 16px; padding: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.6);
                border: 1px solid rgba(255,255,255,0.1);
                z-index: 999999;
                transition: top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
                display: flex; flex-direction: column;
            }
            .call-banner-container.active { top: 15px; }
            .banner-content { display: flex; align-items: center; gap: 12px; }
            .b-avatar { width: 48px; height: 48px; border-radius: 50%; background:#333; background-size:cover; border:2px solid #00e5ff; flex-shrink:0; }
            .b-info { flex: 1; overflow: hidden; }
            .b-info h4 { color: #fff; margin:0; font-size:15px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
            .b-info span { color: #00e5ff; font-size:12px; animation: blink 1s infinite; }
            .b-actions { display: flex; gap: 10px; }
            .b-btn { width: 42px; height: 42px; border-radius: 50%; border:none; color:#fff; font-size:18px; cursor:pointer; display:grid; place-items:center; }
            .b-btn.reject { background: #ff3b30; }
            .b-btn.accept { background: #10b981; animation: pulse 1.5s infinite; }
            .swipe-area { padding-top: 10px; cursor: grab; }
            .swipe-indicator { width: 40px; height: 4px; background: rgba(255,255,255,0.2); border-radius: 10px; margin: 0 auto; }
            @keyframes blink { 50% { opacity: 0.5; } }
            @keyframes pulse { 0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7); } 70% { box-shadow: 0 0 0 10px rgba(16, 185, 129, 0); } }
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
    typeEl.innerText = data.isVideo ? "📹 فيديو وارد..." : "📞 مكالمة واردة...";
    if (data.callerAvatar) avatarEl.style.backgroundImage = `url('${data.callerAvatar}')`;

    setTimeout(() => banner.classList.add('active'), 100);

    globalRingIn.currentTime = 0;
    globalRingIn.play().catch(()=>{});

    // تشغيل الزن (زنة كل ثانيتين)
    if (navigator.vibrate) {
        navigator.vibrate(500); 
        vibrationInterval = setInterval(() => {
            navigator.vibrate(500);
        }, 2000);
    }
}

// ============================================================
// 🤐 دالة الكتم المحلي (عند السحب)
// ============================================================
window.dismissCallLocal = function() {
    stopEverything(); // وقف الصوت والاهتزاز فقط محلياً
    isDismissed = true; // عشان ميرنش تاني لنفس المكالمة
    console.log("🔕 تم كتم المكالمة");
}

// ============================================================
// 🟢 دالة الرد
// ============================================================
window.acceptGlobalCall = function() {
    stopEverything(); // وقف الصوت قبل الانتقال
    window.location.href = `chat.html?chatId=${targetChatId}&answer=true`;
}

// ============================================================
// 🔴 دالة الرفض (الإصلاح هنا)
// ============================================================
window.rejectGlobalCall = function() {
    // 1. وقف الصوت والزن فوراً عشان المستخدم ميحسش بتعليق
    stopEverything();

    // 2. ابعت الأمر للسيرفر
    if (globalCallDocPath) {
        firebase.firestore().doc(globalCallDocPath).update({ status: 'rejected' })
        .catch(err => console.log("Error rejecting:", err));
    }
}

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
