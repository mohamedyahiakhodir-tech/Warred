// ============================================================
// 📡 الرادار العالمي للمكالمات (النسخة الاحترافية - UI Generator)
// ============================================================

// تعريف الصوت
const globalRingIn = new Audio("https://firebasestorage.googleapis.com/v0/b/pools-e4381.firebasestorage.app/o/sounds%2Fmixkit-happy-bells-notification-937.wav?alt=media&token=3422aeb0-bf76-4670-83aa-5ba59fff7fe5");
globalRingIn.loop = true;

let globalCallDocPath = null;
let targetChatId = null;

// دالة التشغيل الذاتي
(function initGlobalListener() {
    // التأكد من تحميل الفايربيس أولاً
    if (typeof firebase === 'undefined') {
        console.error("انتظر.. لم يتم تحميل الفايربيس بعد.");
        return;
    }

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
                    
                    // حالة اتصال جديد
                    if (change.type === 'added') {
                        if (callData.callerId !== currentUserId) {
                            const callDocRef = change.doc.ref;
                            targetChatId = callDocRef.parent.parent.id;
                            globalCallDocPath = callDocRef.path;

                            // 🔥 هنا السر: استدعاء الدالة التي ترسم الشكل الاحترافي
                            showGlobalCallUI(callData);
                        }
                    }

                    // حالة إلغاء الاتصال
                    if (change.type === 'modified' || change.type === 'removed') {
                        if (globalCallDocPath === change.doc.ref.path) {
                            if (!callData || callData.status !== 'ringing') {
                                hideGlobalCallUI();
                            }
                        }
                    }
                });
            });
    });
})();

// ============================================================
// 🎨 دالة رسم الشكل الاحترافي (بديل الـ confirm)
// ============================================================
function showGlobalCallUI(data) {
    // 1. لو النافذة مش موجودة، نصنعها بالكود
    if (!document.getElementById('globalCallModal')) {
        const modalHTML = `
        <div id="globalCallModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:99999; flex-direction:column; align-items:center; justify-content:center; backdrop-filter:blur(10px);">
            
            <div style="width:120px; height:120px; border-radius:50%; background:#1e293b; background-size:cover; background-position:center; border:3px solid #00e5ff; margin-bottom:20px; box-shadow:0 0 30px rgba(0,229,255,0.3); animation: pulse 2s infinite;" id="g_avatar"></div>
            
            <h2 id="g_name" style="color:#fff; margin-bottom:5px; font-family:'Cairo'; font-size:24px; text-shadow:0 2px 10px rgba(0,0,0,0.5);">مستخدم</h2>
            <p style="color:#00e5ff; margin-bottom:50px; font-family:'Cairo'; font-size:16px;">📞 مكالمة واردة...</p>
            
            <div style="display:flex; gap:40px;">
                <button onclick="rejectGlobalCall()" style="width:70px; height:70px; border-radius:50%; background:#ff3b30; border:none; color:#fff; font-size:28px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 5px 15px rgba(255, 59, 48, 0.4);">
                    <i class="fa-solid fa-phone-slash"></i>
                </button>
                
                <button onclick="acceptGlobalCall()" style="width:70px; height:70px; border-radius:50%; background:#10b981; border:none; color:#fff; font-size:28px; cursor:pointer; display:flex; align-items:center; justify-content:center; box-shadow:0 5px 15px rgba(16, 185, 129, 0.4); animation: shake 1.2s infinite;">
                    <i class="fa-solid fa-phone"></i>
                </button>
            </div>
        </div>
        
        <style>
            @keyframes pulse { 0% {box-shadow: 0 0 0 0 rgba(0, 229, 255, 0.7);} 70% {box-shadow: 0 0 0 20px rgba(0, 229, 255, 0);} 100% {box-shadow: 0 0 0 0 rgba(0, 229, 255, 0);} }
            @keyframes shake { 0% {transform: rotate(0deg);} 25% {transform: rotate(10deg);} 50% {transform: rotate(0deg);} 75% {transform: rotate(-10deg);} 100% {transform: rotate(0deg);} }
        </style>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // 2. تحديث البيانات
    const modal = document.getElementById('globalCallModal');
    const avatarEl = document.getElementById('g_avatar');
    const nameEl = document.getElementById('g_name');

    nameEl.innerText = data.callerName || "مستخدم نبض";
    if (data.callerAvatar) {
        avatarEl.style.backgroundImage = `url('${data.callerAvatar}')`;
    } else {
        avatarEl.style.backgroundImage = 'none';
        avatarEl.innerHTML = '<i class="fa-solid fa-user" style="color:#fff; font-size:50px; display:flex; justify-content:center; align-items:center; height:100%;"></i>';
    }

    // 3. إظهار النافذة وتشغيل الصوت
    modal.style.display = 'flex';
    
    globalRingIn.currentTime = 0;
    globalRingIn.play().catch(e => console.log("Sound blocked need interaction"));
    
    if (navigator.vibrate) navigator.vibrate([1000, 500, 1000]);
}

function hideGlobalCallUI() {
    const modal = document.getElementById('globalCallModal');
    if (modal) modal.style.display = 'none';
    
    globalRingIn.pause();
    if (navigator.vibrate) navigator.vibrate(0);
}

// تعريف الدوال بشكل عالمي (Window) عشان زرار HTML يشوفها
window.acceptGlobalCall = function() {
    globalRingIn.pause();
    if (navigator.vibrate) navigator.vibrate(0);
    // نقل المستخدم للشات مع تفعيل الرد
    window.location.href = `chat.html?chatId=${targetChatId}&answer=true`;
}

window.rejectGlobalCall = function() {
    if (globalCallDocPath) {
        firebase.firestore().doc(globalCallDocPath).update({
            status: 'rejected'
        });
    }
    hideGlobalCallUI();
}
