// ==========================================
// 🧠 ملف خوارزميات الاقتراح الذكية (Recommendation Engine)
// ==========================================

const RecommendationEngine = {
    
    // 1. تسجيل اهتمامات المستخدم (عند اللايك أو المشاهدة)
    // weight: قوة الاهتمام (مثلاً اللايك = 5 نقاط، المشاهدة الكاملة = 3 نقاط)
    async trackInterest(userId, tags, weight) {
        if (!userId || !tags || tags.length === 0) return;

        const userRef = db.collection('users').doc(userId);

        try {
            await db.runTransaction(async (transaction) => {
                const doc = await transaction.get(userRef);
                if (!doc.exists) return;

                let currentInterests = doc.data().interests || {};

                // تحديث النقاط لكل تاج (Tag)
                tags.forEach(tag => {
                    if (!currentInterests[tag]) currentInterests[tag] = 0;
                    currentInterests[tag] += weight;
                });

                transaction.update(userRef, { interests: currentInterests });
            });
            console.log(`🧠 تم تحديث اهتمامات المستخدم: +${weight} لـ ${tags}`);
        } catch (e) {
            console.error("خطأ في تسجيل الاهتمام:", e);
        }
    },

    // 2. جلب الفيديوهات المقترحة (المصفاة والمرتبة)
    async getFeedForUser(userId) {
        try {
            // أ. جلب اهتمامات المستخدم
            const userDoc = await db.collection('users').doc(userId).get();
            const userInterests = userDoc.data().interests || {};

            // ب. جلب آخر 100 فيديو (كمثال) من قاعدة البيانات
            // (في التطبيقات الكبيرة نستخدم Cloud Functions هنا، لكن للويب هذا يكفي)
            const snapshot = await db.collection('posts')
                .orderBy('createdAt', 'desc')
                .limit(50) 
                .get();

            let allVideos = [];

            // ج. حساب النقاط لكل فيديو
            snapshot.forEach(doc => {
                const vid = doc.data();
                vid.id = doc.id;
                
                // حساب الـ Score الخاص بهذا الفيديو لهذا المستخدم
                let score = 0;
                
                // 1. نقاط بناءً على الاهتمامات (Tags)
                if (vid.tags && Array.isArray(vid.tags)) {
                    vid.tags.forEach(tag => {
                        if (userInterests[tag]) {
                            score += userInterests[tag]; // زود نقاط لو المستخدم بيحب التصنيف ده
                        }
                    });
                }

                // 2. نقاط بناءً على الشهرة العامة (Trending)
                // الفيديو المشهور ياخد دفعة بسيطة عشان يظهر للناس الجديدة
                score += (vid.likesCount || 0) * 0.5; // كل لايك بنص نقطة
                score += (vid.views || 0) * 0.1;      // كل مشاهدة بـ 0.1 نقطة

                // 3. خصم نقاط للفيديوهات القديمة جداً (Freshness)
                // (اختياري: معادلة بسيطة لتقليل سكور الفيديو القديم)
                
                vid.algoScore = score;
                allVideos.push(vid);
            });

            // د. الترتيب النهائي (الأعلى نقاطاً يظهر أولاً)
            // ثم خلط بسيط عشان المستخدم ميحسش بالملل (Randomness Factor)
            allVideos.sort((a, b) => b.algoScore - a.algoScore);

            return allVideos;

        } catch (e) {
            console.error("خطأ في جلب الاقتراحات:", e);
            return []; // لو حصل خطأ رجع مصفوفة فاضية
        }
    }
};
