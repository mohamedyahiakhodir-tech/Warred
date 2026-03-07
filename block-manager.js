// block-manager.js

// استخدام Set بدلاً من Array للبحث السريع (O(1) complexity)
window.globalBlockList = new Set();

let outgoingBlocks = [];
let incomingBlocks = [];

// 🔥 متغير جديد لمعرفة ما إذا كانت شاشة الحظر معروضة حالياً
let isCurrentlyShowingBlockScreen = false; 

function initBlockSystem(currentUser) {
    if (!currentUser) return;

    const db = firebase.firestore();
    const myUid = currentUser.uid;

    // مراقبة القائمتين بشكل لحظي
    const listenToBlocks = (collectionName, type) => {
        db.collection('users').doc(myUid).collection(collectionName)
            .onSnapshot(snap => {
                const ids = snap.docs.map(doc => doc.id);
                updateGlobalBlockList(ids, type);
            }, error => console.error(`Error listening to ${collectionName}:`, error));
    };

    listenToBlocks('blockedUsers', 'outgoing');
    listenToBlocks('blockedBy', 'incoming');
}

function updateGlobalBlockList(ids, type) {
    if (type === 'outgoing') outgoingBlocks = ids;
    if (type === 'incoming') incomingBlocks = ids;

    // تحديث الـ Set بالقيم الجديدة
    window.globalBlockList = new Set([...outgoingBlocks, ...incomingBlocks]);
    
    console.log("🚫 قائمة الحظر المحدثة (عدد):", window.globalBlockList.size);
    
    // تشغيل التنظيف بعد أي تحديث
    cleanCurrentPage();
}

function cleanCurrentPage() {
    // استخدام selector مجمع لتحسين الأداء
    const blockedElements = document.querySelectorAll('.post, .comment-item, .user-card, .follow-user-card, .chat-item');
    
    blockedElements.forEach(el => {
        const uid = el.getAttribute('data-uid');
        if (uid && window.globalBlockList.has(uid)) {
            el.style.transition = 'opacity 0.3s'; // حركة لطيفة قبل المسح
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 300);
        }
    });

    // فحص البروفايل الحالي اللحظي
    checkCurrentProfile();
}

function checkCurrentProfile() {
    const params = new URLSearchParams(window.location.search);
    const currentProfileUid = params.get('uid');
    
    if (!currentProfileUid) return;

    const isBlockedNow = window.globalBlockList.has(currentProfileUid);

    // 🛑 الحالة الأولى: المستخدم محظور، والشاشة لم تتغير بعد
    if (isBlockedNow && !isCurrentlyShowingBlockScreen) {
        isCurrentlyShowingBlockScreen = true;
        renderBlockedState();
    } 
    // 🟢 الحالة الثانية (السحر هنا): تم فك الحظر للتو، والشخص لا يزال واقفاً على شاشة الحظر
    else if (!isBlockedNow && isCurrentlyShowingBlockScreen) {
        console.log("🔓 تم فك الحظر! جاري إعادة تحميل الصفحة...");
        // نقوم بعمل ريفريش فوري للصفحة لكي يختفي الحظر وتظهر بيانات البروفايل
        window.location.reload();
    }
}

function renderBlockedState() {
    // مسح الواجهة ووضع واجهة الحظر
    document.body.innerHTML = `
        <div style="height:100vh; background:var(--bg-color, #0d0d0f); color:var(--text-color, #fff); display:flex; align-items:center; justify-content:center; flex-direction:column; font-family: 'Cairo', sans-serif; animation: fadeIn 0.4s ease;">
            <div style="background:var(--card-color, #161616); padding:40px; border-radius:24px; text-align:center; box-shadow: 0 10px 40px rgba(0,0,0,0.5); border: 1px solid var(--border-color, #2a2a2a); max-width: 90%; width: 340px;">
                <div style="width: 80px; height: 80px; background: rgba(255, 59, 48, 0.1); color: #ff3b30; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 35px; margin: 0 auto 20px;">
                    <i class="fa-solid fa-user-slash"></i>
                </div>
                <h2 style="margin-bottom:10px; font-weight: 900; font-size: 20px;">الحساب غير متوفر</h2>
                <p style="color:var(--secondary-text, #888); font-size: 14px; line-height: 1.6;">
                    ربما قام المستخدم بحظرك، أو قمت بحظره، أو تم حذف الحساب نهائياً.
                </p>
                <button onclick="location.href='home.html'" style="margin-top:25px; width: 100%; padding:15px; border-radius:12px; border:none; background: var(--primary-gradient, linear-gradient(135deg, #5D5FEF, #7879F1)); color:white; font-weight:bold; font-size: 15px; cursor:pointer; box-shadow: 0 5px 15px rgba(93, 95, 239, 0.3);">
                    العودة للرئيسية
                </button>
            </div>
        </div>
    `;
}

// دالة التحقق (بقت أسرع بكتير مع Set.has)
function isUserBlocked(uid) {
    return window.globalBlockList.has(uid);
}
