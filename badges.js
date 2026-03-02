// ==================================================
// 🏆 محرك أوسمة المتابعين الذكي (Dynamic Badges Pro)
// ==================================================

// ترتيب الأوسمة تصاعدياً (من الأصغر للأكبر) لتمثيل رحلة المستخدم
const followerTiers = [
    { count: 10000,     icon: '🥉', name: 'برونزي', color: '#cd7f32', glow: 'rgba(205, 127, 50, 0.4)' },
    { count: 50000,     icon: '🥈', name: 'فضي', color: '#c0c0c0', glow: 'rgba(192, 192, 192, 0.4)' },
    { count: 100000,    icon: '🥇', name: 'ذهبي', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.4)' },
    { count: 250000,    icon: '🌟', name: 'نجم صاعد', color: '#ffa500', glow: 'rgba(255, 165, 0, 0.6)' },
    { count: 500000,    icon: '🔥', name: 'مؤثر قوي', color: '#ff416c', glow: 'rgba(255, 65, 108, 0.6)' },
    { count: 1000000,   icon: '💎', name: 'مليونير', color: '#00c6ff', glow: 'rgba(0, 198, 255, 0.6)' },
    { count: 3000000,   icon: '🚀', name: 'ميجا ستار', color: '#ff4500', glow: 'rgba(255, 69, 0, 0.6)' },
    { count: 5000000,   icon: '⚡', name: 'سوبر ستار', color: '#ffff00', glow: 'rgba(255, 255, 0, 0.6)' },
    { count: 10000000,  icon: '👑', name: 'ملك التفاعل', color: '#FFD700', glow: 'rgba(255, 215, 0, 0.8)' },
    { count: 15000000,  icon: '💫', name: 'أيقونة', color: '#ff1493', glow: 'rgba(255, 20, 147, 0.8)' },
    { count: 20000000,  icon: '🌐', name: 'ظاهرة', color: '#00ffff', glow: 'rgba(0, 255, 255, 0.8)' },
    { count: 50000000,  icon: '🌌', name: 'إمبراطور', color: '#8a2be2', glow: 'rgba(138, 43, 226, 0.8)' },
    { count: 100000000, icon: '♾️', name: 'أسطورة وريد', color: '#ff00ff', glow: 'rgba(255, 0, 255, 0.8)' }
];

window.renderFollowerBadges = function(totalFollowers, isVerified) {
    const container = document.getElementById('achievementsContainer');
    if(!container) return;

    let badgesHTML = '';
    
    // 1. وسام التوثيق (يظهر أولاً ويكون مضيئاً إذا كان الحساب موثقاً)
    if(isVerified) {
        badgesHTML += `<div class="badge-item" style="border-color:#00c6ff; box-shadow: 0 0 15px rgba(0, 198, 255, 0.5);" onclick="showBadgeInfo('حساب موثق', 'تم التحقق من هوية هذا الحساب رسمياً.', '✔️', true, '#00c6ff')">✔️</div>`;
    }

    // 2. رسم مسار الأوسمة (المفتوح والمغلق)
    followerTiers.forEach(badge => {
        let formattedCount = window.formatNumber ? window.formatNumber(badge.count) : badge.count;
        let isUnlocked = totalFollowers >= badge.count;
        
        if (isUnlocked) {
            // الشارة المفتوحة (ملونة ومضيئة)
            badgesHTML += `
                <div class="badge-item unlocked" style="border-color: ${badge.color}; box-shadow: 0 0 15px ${badge.glow};" onclick="showBadgeInfo('${badge.name}', 'لقد حصل هذا الحساب على هذه الشارة لتجاوزه ${formattedCount} متابع!', '${badge.icon}', true, '${badge.color}')">
                    ${badge.icon}
                </div>
            `;
        } else {
            // الشارة المغلقة (مظلمة ورمادية)
            badgesHTML += `
                <div class="badge-item locked" style="border-color: #333; background: #111; filter: grayscale(100%); opacity: 0.4;" onclick="showBadgeInfo('شارة مقفلة 🔒', 'تحتاج إلى الوصول لـ ${formattedCount} متابع لفتح هذه الشارة.', '${badge.icon}', false, '#777')">
                    ${badge.icon}
                </div>
            `;
        }
    });

    // إظهار الرف دائماً
    container.style.display = 'flex';
    container.innerHTML = badgesHTML;
};
