// block-manager.js

// مصفوفة عالمية هنخزن فيها كل الـ IDs المحظورة (سواء أنا حاظرهم أو هما حاظرين)
window.globalBlockList = [];

// دالة التشغيل: دي هننادي عليها أول ما الموقع يفتح
function initBlockSystem(currentUser) {
    if (!currentUser) return;

    const db = firebase.firestore();
    const myUid = currentUser.uid;

    // 1. مراقبة الناس اللي أنا عملت لهم بلوك
    db.collection('users').doc(myUid).collection('blockedUsers')
        .onSnapshot(snap => {
            const myBlocks = snap.docs.map(doc => doc.id);
            updateGlobalBlockList(myBlocks, 'outgoing');
        });

    // 2. مراقبة الناس اللي عملوا لي بلوك (عشان اختفي من عندهم وهم يختفوا من عندي)
    db.collection('users').doc(myUid).collection('blockedBy')
        .onSnapshot(snap => {
            const blockedByOthers = snap.docs.map(doc => doc.id);
            updateGlobalBlockList(blockedByOthers, 'incoming');
        });
}

let outgoingBlocks = [];
let incomingBlocks = [];

function updateGlobalBlockList(ids, type) {
    if (type === 'outgoing') outgoingBlocks = ids;
    if (type === 'incoming') incomingBlocks = ids;

    // دمج القائمتين في قائمة واحدة
    window.globalBlockList = [...new Set([...outgoingBlocks, ...incomingBlocks])];
    
    console.log("🚫 قائمة الحظر المحدثة:", window.globalBlockList);
    
    // تنظيف الصفحة فوراً لو فيه محتوى ظاهر لحد محظور
    cleanCurrentPage();
}

// دالة بتلف على الصفحة وتمسح أي حاجة تخص المحظورين
function cleanCurrentPage() {
    // 1. إخفاء المنشورات
    document.querySelectorAll('.post').forEach(el => {
        // لازم تكون ضايف data-uid للبوست في الـ HTML
        if (window.globalBlockList.includes(el.getAttribute('data-uid'))) {
            el.remove();
        }
    });

    // 2. إخفاء التعليقات
    document.querySelectorAll('.comment-item').forEach(el => {
        if (window.globalBlockList.includes(el.getAttribute('data-uid'))) {
            el.remove();
        }
    });

    // 3. لو أنا فاتح بروفايل حد محظور، اطرده فوراً
    const params = new URLSearchParams(window.location.search);
    const currentProfileUid = params.get('uid');
    
    if (currentProfileUid && window.globalBlockList.includes(currentProfileUid)) {
        document.body.innerHTML = `
            <div style="height:100vh; background:#000; color:#fff; display:flex; align-items:center; justify-content:center; flex-direction:column;">
                <i class="fa-solid fa-ban" style="font-size:50px; color:red; margin-bottom:20px;"></i>
                <h2>المستخدم غير متوفر</h2>
                <button onclick="location.href='home.html'" style="margin-top:20px; padding:10px 20px; border-radius:20px; border:none; cursor:pointer;">العودة</button>
            </div>
        `;
    }
}

// دالة مساعدة تستخدمها وأنت بترسم البوستات (Helper Function)
function isUserBlocked(uid) {
    return window.globalBlockList.includes(uid);
}
