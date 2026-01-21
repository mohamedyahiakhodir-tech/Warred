/* ==================================================
   ملف الإشعارات الموحد (Global Notifications System)
   Fixed Version: Instant Injection + Debugging
   ================================================== */

(function() {
    console.log("🔔 Global Notifications System: Started");

    // 1. حقن تصميم CSS للإشعار
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

    // 2. دالة بدء النظام وحقن HTML (معدلة لتعمل فوراً)
    function initSystem() {
        // منع التكرار لو اشتغلت مرتين
        if (document.getElementById('msgBanner')) return;

        console.log("🔔 Global Notifications System: Injecting HTML");

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
        
        // تشغيل مراقب الفايربيس
        initGlobalListener();
    }

    // 🔥 التصحيح: التأكد من حالة الصفحة قبل التشغيل 🔥
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSystem);
    } else {
        // لو الصفحة حملت خلاص، شغل النظام فوراً
        initSystem();
    }

    // 3. دالة إظهار الإشعار (متاحة عالمياً)
    window.showGlobalBanner = function(name, text, pic, chatId, otherUid) {
        console.log("🔔 Showing Banner for:", name);
        const banner = document.getElementById('msgBanner');
        
        if(!banner) {
            console.error("❌ Banner element not found!");
            return;
        }

        // تعبئة البيانات
        document.getElementById('bannerName').innerText = name || "رسالة جديدة";
        document.getElementById('bannerText').innerText = text;
        const finalPic = pic || "https://cdn-icons-png.flaticon.com/512/149/149071.png";
        document.getElementById('bannerAvatar').style.backgroundImage = `url('${finalPic}')`;

        // عند الضغط
        banner.onclick = () => {
            console.log("🔔 Banner Clicked -> Going to chat");
            window.location.href = `chat.html?chatId=${chatId}&name=${encodeURIComponent(name)}&uid=${otherUid}`;
        };

        // إظهار
        banner.classList.add('visible');
        
        // اهتزاز
        if(navigator.vibrate) navigator.vibrate(100);

        // إخفاء تلقائي
        setTimeout(() => { banner.classList.remove('visible'); }, 4000);
    };

    // 4. مراقب الرسائل (Global Listener)
    function initGlobalListener() {
        const checkAuth = setInterval(() => {
            if (typeof firebase !== 'undefined' && firebase.auth()) {
                clearInterval(checkAuth);
                firebase.auth().onAuthStateChanged(user => {
                    if (user) {
                        console.log("🔔 Global Listener: User Authenticated");
                        startListening(user.uid);
                    }
                });
            }
        }, 500);
    }

    let usersCacheForBanner = {};

    function startListening(myUid) {
        const db = firebase.firestore();
        let isFirstRun = true; 

        db.collection('chats')
          .where('users', 'array-contains', myUid)
          .onSnapshot(snapshot => {
            
            // تجاهل التحميل الأولي (الرسائل القديمة)
            if(isFirstRun) { 
                isFirstRun = false; 
                return; 
            }

            snapshot.docChanges().forEach(async change => {
                if (change.type === 'modified') {
                    const data = change.doc.data();
                    const chatId = change.doc.id;

                    // فحوصات الأمان
                    if (data.lastSender === myUid) return;
                    if (!data.unreadCount || data.unreadCount <= 0) return;
                    
                    // منع الإشعار لو أنا جوه نفس الشات حالياً
                    if (window.location.href.includes(`chatId=${chatId}`)) return;
                    
                    if (data.mutedBy && data.mutedBy.includes(myUid)) return;

                    console.log("🔔 New Message Detected!");

                    // تجهيز البيانات
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
                            // محاولة سريعة
                            db.collection('users').doc(otherUid).get().then(doc => {
                                if(doc.exists) {
                                    const u = doc.data();
                                    usersCacheForBanner[otherUid] = { name: u.name, pic: u.profilePic || senderPic };
                                }
                            });
                        }
                    }

                    let msgText = data.lastMessage;
                    if (msgText.includes('http') && !msgText.includes(' ')) msgText = "📷 صورة/ملف";

                    // 🔥 1. تشغيل الصوت من sounds-manager.js 🔥
                    if (typeof playSound === 'function') {
                        console.log("🔔 Playing Sound: incoming");
                        playSound('incoming');
                    } else {
                        console.warn("⚠️ playSound function not found!");
                    }

                    // 🔥 2. إظهار البانر العلوي 🔥
                    window.showGlobalBanner(senderName, msgText, senderPic, chatId, otherUid);

                    // 🔥 3. تشغيل الكرة (لو موجودة) 🔥
                    if (typeof triggerUraniumAlert === 'function') {
                        triggerUraniumAlert(`${senderName}: ${msgText}`, {name: senderName, pic: senderPic}, false);
                    }
                }
            });
        });
    }

})();
