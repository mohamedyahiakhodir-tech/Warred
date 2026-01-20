// ============================================================
// 📡 الرادار العالمي للمكالمات (يوضع في كل الصفحات)
// ============================================================

const globalRingIn = new Audio("https://firebasestorage.googleapis.com/v0/b/pools-e4381.firebasestorage.app/o/sounds%2Fmixkit-happy-bells-notification-937.wav?alt=media&token=3422aeb0-bf76-4670-83aa-5ba59fff7fe5");
globalRingIn.loop = true;

let globalCallDocPath = null;
let targetChatId = null;

// دالة التشغيل التلقائية (بمجرد ما الصفحة تفتح)
(function initGlobalListener() {
    // ننتظر حتى يتأكد فايربيس أن المستخدم مسجل دخول
    firebase.auth().onAuthStateChanged(user => {
        if (!user) return; // لو مش مسجل دخول، متعملش حاجة

        const db = firebase.firestore();
        const currentUserId = user.uid;

        console.log("📡 الرادار يعمل.. في انتظار مكالمات...");

        // الاستماع لأي مكالمة حالتها "ringing" في السيستم كله
        db.collectionGroup('calls')
            .where('status', '==', 'ringing')
            .onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                    const callData = change.doc.data();
                    
                    // 1. لو في مكالمة جديدة (Added)
                    if (change.type === 'added') {
                        // شرط مهم جداً: المكالمة مش أنا اللي عاملها (عشان مرنش على نفسي)
                        if (callData.callerId !== currentUserId) {
                            
                            // نجيب رقم الشات عشان لما نرد ينقلنا عليه
                            const callDocRef = change.doc.ref;
                            targetChatId = callDocRef.parent.parent.id;
                            globalCallDocPath = callDocRef.path;

                            // نظهر النافذة
                            showGlobalCallUI(callData);
                        }
                    }

                    // 2. لو المكالمة اتلغت أو حد رد عليها (Modified/Removed)
                    if (change.type === 'modified' || change.type === 'removed') {
                        if (globalCallDocPath === change.doc.ref.path) {
                            // لو الحالة مبقتش ringing (بقت ended أو rejected) نخفي النافذة
                            if (callData && callData.status !== 'ringing') {
                                hideGlobalCallUI();
                            } else if (change.type === 'removed') {
                                hideGlobalCallUI();
                            }
                        }
                    }
                });
            });
    });
})();

// ============================================================
// 🎨 رسم النافذة بالكود (عشان منحطش HTML في كل صفحة)
// ============================================================
function showGlobalCallUI(data) {
    // لو النافذة مش موجودة في الصفحة، نخلقها
    if (!document.getElementById('globalCallModal')) {
        const modalHTML = `
        <div id="globalCallModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); z-index:99999; flex-direction:column; align-items:center; justify-content:center;">
            <div style="width:120px; height:120px; border-radius:50%; background:#333; background-size:cover; background-position:center; border:3px solid #00e5ff; margin-bottom:20px; box-shadow:0 0 30px rgba(0,229,255,0.3);" id="g_avatar"></div>
            <h2 id="g_name" style="color:#fff; margin-bottom:10px; font-family:'Cairo';">مستخدم</h2>
            <p style="color:#00e5ff; margin-bottom:40px; font-family:'Cairo';">📞 مكالمة واردة...</p>
            
            <div style="display:flex; gap:40px;">
                <button onclick="rejectGlobalCall()" style="width:60px; height:60px; border-radius:50%; background:#ff3b30; border:none; color:#fff; font-size:24px; cursor:pointer;"><i class="fa-solid fa-phone-slash"></i></button>
                <button onclick="acceptGlobalCall()" style="width:60px; height:60px; border-radius:50%; background:#10b981; border:none; color:#fff; font-size:24px; cursor:pointer; box-shadow:0 0 20px rgba(16,185,129,0.5);"><i class="fa-solid fa-phone"></i></button>
            </div>
        </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    // تحديث البيانات
    const modal = document.getElementById('globalCallModal');
    const avatarEl = document.getElementById('g_avatar');
    const nameEl = document.getElementById('g_name');

    nameEl.innerText = data.callerName || "مستخدم";
    if (data.callerAvatar) {
        avatarEl.style.backgroundImage = `url('${data.callerAvatar}')`;
    } else {
        avatarEl.style.backgroundImage = 'none';
        avatarEl.innerHTML = '<i class="fa-solid fa-user" style="color:#fff; font-size:40px; display:flex; justify-content:center; align-items:center; height:100%;"></i>';
    }

    // إظهار النافذة وتشغيل الصوت
    modal.style.display = 'flex';
    globalRingIn.currentTime = 0;
    globalRingIn.play().catch(e => console.log("Sound blocked"));
    if (navigator.vibrate) navigator.vibrate([1000, 500, 1000]);
}

function hideGlobalCallUI() {
    const modal = document.getElementById('globalCallModal');
    if (modal) modal.style.display = 'none';
    
    globalRingIn.pause();
    if (navigator.vibrate) navigator.vibrate(0);
}

// دوال الأزرار (لازم تكون global عشان الـ HTML يشوفها)
window.acceptGlobalCall = function() {
    globalRingIn.pause();
    // نقل المستخدم لصفحة الشات مع أمر الرد
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
