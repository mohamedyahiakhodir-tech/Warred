/* ==================================================
   ملف الإشعارات الموحد (Global Notifications System)
   Engine: Same as Global Call (Unlocked Audio) 🚀
   ================================================== */

(function() {
    // 1. منع التكرار (زي ملف الاتصال)
    if (window.self !== window.top) return; 
    if (window.isGlobalNotificationsActive) return; 
    window.isGlobalNotificationsActive = true;

    console.log("🔔 Global Notifications: Active");

    // ============================================================
    // 🔊 الخطوة 1: التعريف العام (الربط المباشر)
    // ============================================================
    // عرفنا الصوت هنا عشان يفضل موجود في الذاكرة زي الرنة بالظبط
    const notifSound = new Audio("./sounds/incoming.mp3"); 

    // ============================================================
    // 🔓 الخطوة 2: فك الحظر (The Unlock Hack)
    // ============================================================
    function unlockAudioAndVibro() {
        // بنشغل الصوت لحظة ونقفله عشان ناخذ التصريح
        notifSound.play().then(() => {
            notifSound.pause();
            notifSound.currentTime = 0;
        }).catch((e) => {});

        // بنشغل الاهتزاز لحظة عشان ناخذ التصريح
        if (navigator.vibrate) navigator.vibrate(0);

        // بنشيل المستمعين عشان الكود ده يتنفذ مرة واحدة بس
        document.body.removeEventListener('click', unlockAudioAndVibro);
        document.body.removeEventListener('touchstart', unlockAudioAndVibro);
    }

    // أول ما تلمس الشاشة، النظام "بيسخن" ويجهز نفسه
    document.body.addEventListener('click', unlockAudioAndVibro, { once: true });
    document.body.addEventListener('touchstart', unlockAudioAndVibro, { once: true });


    // ============================================================
    // 🎨 حقن CSS
    // ============================================================
    const style = document.createElement('style');
    style.innerHTML = `
        #msgBanner {
            position: fixed; top: -100px; left: 50%; transform: translateX(-50%);
            width: 90%; max-width: 400px;
            background: rgba(20, 20, 25, 0.95);
            border: 1px solid rgba(255, 255, 255, 0.1);
            border-left: 4px solid #00C6FF;
            backdrop-filter: blur(15px); -webkit-backdrop-filter: blur(15px);
            border-radius: 16px; padding: 12px 15px;
            display: flex; align-items: center; gap: 12px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.5);
            z-index: 2147483647;
            transition: top 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
            cursor: pointer; visibility: hidden;
        }
        #msgBanner.visible { top: 20px; visibility: visible; }
        .banner-content { flex: 1; overflow: hidden; text-align: right; }
        .banner-name { font-size: 14px; font-weight: 800; color: #fff; margin-bottom: 2px; }
        .banner-text { font-size: 12px; color: #aaa; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .banner-avatar { width: 40px; height: 40px; border-radius: 50%; background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,0.1); flex-shrink: 0; }
    `;
    document.head.appendChild(style);

    // ============================================================
    // 🛠️ دالة البدء
    // ============================================================
    function initSystem() {
        if (document.getElementById('msgBanner')) return;

        const bannerHTML = `
            <div id="bannerAvatar" class="banner-avatar"></div>
            <div class="banner-content">
                <div id="bannerName" class="banner-name"></div>
                <div id="bannerText" class="banner-text"></div>
            </div>
            <i class="fa-solid fa-comment-dots" style="color:#00C6FF; font-size:20px;"></i>
        `;
        
        const bannerDiv = document.createElement('div');
        bannerDiv.id = 'msgBanner';
        bannerDiv.innerHTML = bannerHTML;
        document.body.appendChild(bannerDiv);
        
        initGlobalListener();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSystem);
    } else {
        initSystem();
    }

    // ============================================================
    // 🔔 الخطوة 3: التشغيل المباشر (زي الرنة)
    // ============================================================
    window.showGlobalBanner = function(name, text, pic, chatId, otherUid) {
        const banner = document.getElementById('msgBanner');
        if(!banner) return;

        // 1. تشغيل الصوت فوراً (لأننا أخدنا الإذن خلاص في الخطوة 2)
        notifSound.currentTime = 0;
        notifSound.play().catch((err) => console.log("Sound blocked:", err));

        // 2. تشغيل الاهتزاز بقوة (زي الرنة)
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]); 
        }

        // 3. عرض البانر
        document.getElementById('bannerName').innerText = name || "رسالة جديدة";
        document.getElementById('bannerText').innerText = text;
        const finalPic = pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        document.getElementById('bannerAvatar').style.backgroundImage = `url('${finalPic}')`;

        banner.onclick = () => {
            window.location.href = `chat.html?chatId=${chatId}&name=${encodeURIComponent(name)}&uid=${otherUid}`;
        };

        if (banner.classList.contains('visible')) {
            banner.style.transform = "translateX(-50%) scale(1.05)";
            setTimeout(() => banner.style.transform = "translateX(-50%) scale(1)", 100);
            return;
        }

        banner.classList.add('visible');
        setTimeout(() => { banner.classList.remove('visible'); }, 4000);
    };

    // ============================================================
    // 📡 المراقب
    // ============================================================
    let unsubscribe = null;
    let chatsTimestamps = {}; 

    function initGlobalListener() {
        const checkAuth = setInterval(() => {
            if (typeof firebase !== 'undefined' && firebase.auth()) {
                clearInterval(checkAuth);
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        startListening(user.uid);
                    } else {
                        if (unsubscribe) unsubscribe();
                    }
                });
            }
        }, 500);
    }

    let usersCacheForBanner = {};

    function startListening(myUid) {
        const db = firebase.firestore();
        if (unsubscribe) unsubscribe();

        unsubscribe = db.collection('chats')
          .where('users', 'array-contains', myUid)
          .onSnapshot(snapshot => {
            
            snapshot.docChanges().forEach(async change => {
                const data = change.doc.data();
                const chatId = change.doc.id;
                
                let msgTime = 0;
                if (data.lastMessageTime && data.lastMessageTime.toMillis) {
                    msgTime = data.lastMessageTime.toMillis();
                } else {
                    msgTime = Date.now();
                }

                if (!chatsTimestamps[chatId]) {
                    chatsTimestamps[chatId] = msgTime; 
                    return; 
                }

                const otherUid = data.users.find(u => u !== myUid);
                let senderName = "مستخدم";
                let senderPic = "https://cdn-icons-png.flaticon.com/512/149/149071.png";

                if (usersCacheForBanner[otherUid]) {
                    senderName = usersCacheForBanner[otherUid].name;
                    senderPic = usersCacheForBanner[otherUid].pic;
                } else {
                    if(data.isGroup) {
                        senderName = data.name; 
                    } else {
                        db.collection('users').doc(otherUid).get().then(doc => {
                            if(doc.exists) {
                                const u = doc.data();
                                usersCacheForBanner[otherUid] = { name: u.name, pic: u.profilePic || senderPic };
                            }
                        });
                    }
                }

                // --- (1) حالة رسالة جديدة ---
                if (msgTime > chatsTimestamps[chatId]) {
                    chatsTimestamps[chatId] = msgTime;

                    if (window.location.href.includes(`chatId=${chatId}`)) return; 
                    if (data.mutedBy && data.mutedBy.includes(myUid)) return;

                    let msgText = data.lastMessage;
                    if (msgText.includes('http') && !msgText.includes(' ')) msgText = "📷 صورة/ملف";

                    // 🔥 تشغيل النظام
                    window.showGlobalBanner(senderName, msgText, senderPic, chatId, otherUid);

                    // تشغيل الكرة (لو موجودة)
                    if (typeof triggerUraniumAlert === 'function') {
                        triggerUraniumAlert(`${senderName}: ${msgText}`, {name: senderName, pic: senderPic}, false);
                    }
                } 
                
                // --- (2) حالة جاري الكتابة (الكرة فقط) ---
                else {
                    const typingMap = data.typingStatus || {};
                    const now = Date.now();
                    
                    if (typingMap[otherUid] && (now - typingMap[otherUid] < 5000)) {
                        if (typeof triggerUraniumAlert === 'function') {
                            triggerUraniumAlert(`${senderName} يكتب الآن... ✍️`, {name: senderName, pic: senderPic}, true);
                        }
                    }
                }
            });
        });
    }

})();
