// رادار عالمي بيشتغل في أي صفحة مربوط فيها الملف ده
function initGlobalCallListener() {
    auth.onAuthStateChanged(user => {
        if (user) {
            console.log("✅ الرادار العالمي شغال واليوزر مسجل دخول");

            db.collectionGroup('calls')
                .where('status', '==', 'ringing')
                .onSnapshot(snapshot => {
                    snapshot.docChanges().forEach(change => {
                        if (change.type === 'added') {
                            const callData = change.doc.data();
                            // لو المكالمة مش أنا اللي عاملها
                            if (callData.callerId !== user.uid) {
                                const chatId = change.doc.ref.parent.parent.id;
                                handleIncomingCall(callData, chatId);
                            }
                        }
                    });
                }, err => console.log("خطأ في الرادار: ", err));
        }
    });
}

function handleIncomingCall(data, chatId) {
    // 1. تشغيل الصوت (تأكد من المسار)
    const ringtone = new Audio('./sounds/ring_in.wav');
    ringtone.loop = true;
    ringtone.play().catch(e => console.log("المتصفح يمنع الصوت التلقائي"));

    // 2. إظهار شاشة الرنين (ممكن تستخدم alert بسيط أو Modal)
    if (confirm("📞 مكالمة واردة من: " + data.callerName + "\nهل تريد الرد؟")) {
        ringtone.pause();
        window.location.href = `chat.html?chatId=${chatId}&answer=true`;
    } else {
        ringtone.pause();
    }
}

// تشغيل الوظيفة فوراً
initGlobalCallListener();
