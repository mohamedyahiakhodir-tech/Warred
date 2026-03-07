// 1. قاعدة بيانات السمات (تحتوي الآن على 56 سمة احترافية)
const appThemesConfig = {
    // =========================================
    // 🎨 السمات الأساسية (الأصلية)
    // =========================================
    'default': {
        primary: '#5D5FEF',
        appBg: '#0d0d0f',
        postBg: '#161616',
        postBorder: '#2a2a2a',
        postShadow: '0 10px 20px rgba(0,0,0,0.3)',
        postLine: 'transparent'
    },
    'cosmic': {
        primary: '#FFD700',
        appBg: 'linear-gradient(to bottom, #0f0c29, #302b63, #0f0c29)',
        postBg: 'linear-gradient(135deg, #0f0c29 0%, #302b63 100%)',
        postBorder: 'rgba(255, 215, 0, 0.6)',
        postShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 215, 0, 0.25), inset 0 0 20px rgba(255, 215, 0, 0.1)',
        postLine: '#FFD700'
    },
    'blood': {
        primary: '#ff416c',
        appBg: '#1a0505',
        postBg: 'linear-gradient(135deg, #380710 0%, #1a0505 100%)',
        postBorder: 'rgba(255, 65, 108, 0.5)',
        postShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(255, 65, 108, 0.2)',
        postLine: '#ff416c'
    },
    'ocean': {
        primary: '#00c6ff',
        appBg: '#05131f',
        postBg: 'linear-gradient(135deg, #001f3f 0%, #05131f 100%)',
        postBorder: 'rgba(0, 198, 255, 0.5)',
        postShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(0, 198, 255, 0.2)',
        postLine: '#00c6ff'
    },
    'nature': {
        primary: '#38ef7d',
        appBg: '#0a140d',
        postBg: 'linear-gradient(135deg, #0f2b18 0%, #0a140d 100%)',
        postBorder: 'rgba(56, 239, 125, 0.5)',
        postShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(56, 239, 125, 0.15)',
        postLine: '#38ef7d'
    },
    'cyber': {
        primary: '#fc00ff',
        appBg: '#12041f',
        postBg: 'linear-gradient(135deg, #2b0845 0%, #12041f 100%)',
        postBorder: 'rgba(252, 0, 255, 0.5)',
        postShadow: '0 15px 35px rgba(0, 0, 0, 0.6), 0 0 25px rgba(252, 0, 255, 0.25)',
        postLine: '#fc00ff'
    },

    // =========================================
    // 🌌 الفضاء والمجرات (Space & Galaxy)
    // =========================================
    'nebula': {
        primary: '#8A2BE2',
        appBg: '#090014',
        postBg: 'linear-gradient(135deg, #1b003a 0%, #090014 100%)',
        postBorder: 'rgba(138, 43, 226, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(138, 43, 226, 0.25)',
        postLine: '#8A2BE2'
    },
    'starlight': {
        primary: '#E0FFFF',
        appBg: '#000814',
        postBg: 'linear-gradient(135deg, #001d3d 0%, #000814 100%)',
        postBorder: 'rgba(224, 255, 255, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(224, 255, 255, 0.2)',
        postLine: '#E0FFFF'
    },
    'blackhole': {
        primary: '#FF4500',
        appBg: '#000000',
        postBg: 'linear-gradient(135deg, #1a0500 0%, #000000 100%)',
        postBorder: 'rgba(255, 69, 0, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.8), 0 0 25px rgba(255, 69, 0, 0.15)',
        postLine: '#FF4500'
    },
    'martian': {
        primary: '#FF5733',
        appBg: '#170501',
        postBg: 'linear-gradient(135deg, #330b02 0%, #170501 100%)',
        postBorder: 'rgba(255, 87, 51, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 87, 51, 0.2)',
        postLine: '#FF5733'
    },
    'lunar': {
        primary: '#D3D3D3',
        appBg: '#0f1115',
        postBg: 'linear-gradient(135deg, #23272f 0%, #0f1115 100%)',
        postBorder: 'rgba(211, 211, 211, 0.3)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(211, 211, 211, 0.1)',
        postLine: '#D3D3D3'
    },
    'aurora': {
        primary: '#00FFCC',
        appBg: '#001a14',
        postBg: 'linear-gradient(135deg, #003328 0%, #001a14 100%)',
        postBorder: 'rgba(0, 255, 204, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(0, 255, 204, 0.2)',
        postLine: '#00FFCC'
    },
    'quasar': {
        primary: '#FF1493',
        appBg: '#12000a',
        postBg: 'linear-gradient(135deg, #2b0018 0%, #12000a 100%)',
        postBorder: 'rgba(255, 20, 147, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 20, 147, 0.25)',
        postLine: '#FF1493'
    },
    'supernova': {
        primary: '#FDB813',
        appBg: '#1a1200',
        postBg: 'linear-gradient(135deg, #332400 0%, #1a1200 100%)',
        postBorder: 'rgba(253, 184, 19, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(253, 184, 19, 0.2)',
        postLine: '#FDB813'
    },
    'eclipse': {
        primary: '#F0E68C',
        appBg: '#080808',
        postBg: 'linear-gradient(135deg, #1c1c1c 0%, #080808 100%)',
        postBorder: 'rgba(240, 230, 140, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(240, 230, 140, 0.15)',
        postLine: '#F0E68C'
    },
    'pluto': {
        primary: '#B0E0E6',
        appBg: '#060a12',
        postBg: 'linear-gradient(135deg, #0e1726 0%, #060a12 100%)',
        postBorder: 'rgba(176, 224, 230, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(176, 224, 230, 0.15)',
        postLine: '#B0E0E6'
    },

    // =========================================
    // 🌍 الطبيعة والفصول (Nature & Seasons)
    // =========================================
    'sunset': {
        primary: '#FF7E5F',
        appBg: '#1a0b08',
        postBg: 'linear-gradient(135deg, #331610 0%, #1a0b08 100%)',
        postBorder: 'rgba(255, 126, 95, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 126, 95, 0.2)',
        postLine: '#FF7E5F'
    },
    'forest': {
        primary: '#228B22',
        appBg: '#051205',
        postBg: 'linear-gradient(135deg, #0b260b 0%, #051205 100%)',
        postBorder: 'rgba(34, 139, 34, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(34, 139, 34, 0.15)',
        postLine: '#228B22'
    },
    'volcano': {
        primary: '#FF2400',
        appBg: '#120200',
        postBg: 'linear-gradient(135deg, #2b0500 0%, #120200 100%)',
        postBorder: 'rgba(255, 36, 0, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.7), 0 0 25px rgba(255, 36, 0, 0.25)',
        postLine: '#FF2400'
    },
    'glacier': {
        primary: '#A5F2F3',
        appBg: '#041112',
        postBg: 'linear-gradient(135deg, #0a2729 0%, #041112 100%)',
        postBorder: 'rgba(165, 242, 243, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(165, 242, 243, 0.2)',
        postLine: '#A5F2F3'
    },
    'desert': {
        primary: '#EDC9AF',
        appBg: '#140f0a',
        postBg: 'linear-gradient(135deg, #2e2317 0%, #140f0a 100%)',
        postBorder: 'rgba(237, 201, 175, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(237, 201, 175, 0.15)',
        postLine: '#EDC9AF'
    },
    'autumn': {
        primary: '#D2691E',
        appBg: '#170a02',
        postBg: 'linear-gradient(135deg, #331705 0%, #170a02 100%)',
        postBorder: 'rgba(210, 105, 30, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(210, 105, 30, 0.2)',
        postLine: '#D2691E'
    },
    'spring': {
        primary: '#FFB7C5',
        appBg: '#140a0c',
        postBg: 'linear-gradient(135deg, #2e171b 0%, #140a0c 100%)',
        postBorder: 'rgba(255, 183, 197, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 183, 197, 0.15)',
        postLine: '#FFB7C5'
    },
    'thunder': {
        primary: '#F0E68C',
        appBg: '#090912',
        postBg: 'linear-gradient(135deg, #17172b 0%, #090912 100%)',
        postBorder: 'rgba(240, 230, 140, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.7), 0 0 25px rgba(240, 230, 140, 0.2)',
        postLine: '#F0E68C'
    },
    'abyss': {
        primary: '#008B8B',
        appBg: '#010c0c',
        postBg: 'linear-gradient(135deg, #031c1c 0%, #010c0c 100%)',
        postBorder: 'rgba(0, 139, 139, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(0, 139, 139, 0.2)',
        postLine: '#008B8B'
    },
    'coral': {
        primary: '#FF7F50',
        appBg: '#170805',
        postBg: 'linear-gradient(135deg, #33120a 0%, #170805 100%)',
        postBorder: 'rgba(255, 127, 80, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 127, 80, 0.2)',
        postLine: '#FF7F50'
    },

    // =========================================
    // 💎 الأحجار الكريمة والمعادن (Gems & Metals)
    // =========================================
    'ruby': {
        primary: '#E0115F',
        appBg: '#140108',
        postBg: 'linear-gradient(135deg, #2e0213 0%, #140108 100%)',
        postBorder: 'rgba(224, 17, 95, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(224, 17, 95, 0.2)',
        postLine: '#E0115F'
    },
    'emerald': {
        primary: '#50C878',
        appBg: '#06140b',
        postBg: 'linear-gradient(135deg, #0d2e1a 0%, #06140b 100%)',
        postBorder: 'rgba(80, 200, 120, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(80, 200, 120, 0.15)',
        postLine: '#50C878'
    },
    'sapphire': {
        primary: '#0F52BA',
        appBg: '#010714',
        postBg: 'linear-gradient(135deg, #03132e 0%, #010714 100%)',
        postBorder: 'rgba(15, 82, 186, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(15, 82, 186, 0.2)',
        postLine: '#0F52BA'
    },
    'amethyst': {
        primary: '#9966CC',
        appBg: '#0d0812',
        postBg: 'linear-gradient(135deg, #1e142b 0%, #0d0812 100%)',
        postBorder: 'rgba(153, 102, 204, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(153, 102, 204, 0.2)',
        postLine: '#9966CC'
    },
    'obsidian': {
        primary: '#8A2BE2',
        appBg: '#050505',
        postBg: 'linear-gradient(135deg, #141414 0%, #050505 100%)',
        postBorder: 'rgba(138, 43, 226, 0.3)',
        postShadow: '0 15px 35px rgba(0,0,0,0.8), 0 0 25px rgba(138, 43, 226, 0.15)',
        postLine: '#8A2BE2'
    },
    'gold': {
        primary: '#FFDF00',
        appBg: '#121000',
        postBg: 'linear-gradient(135deg, #2b2500 0%, #121000 100%)',
        postBorder: 'rgba(255, 223, 0, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 223, 0, 0.2)',
        postLine: '#FFDF00'
    },
    'silver': {
        primary: '#C0C0C0',
        appBg: '#0a0a0a',
        postBg: 'linear-gradient(135deg, #1f1f1f 0%, #0a0a0a 100%)',
        postBorder: 'rgba(192, 192, 192, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(192, 192, 192, 0.15)',
        postLine: '#C0C0C0'
    },
    'bronze': {
        primary: '#CD7F32',
        appBg: '#120a04',
        postBg: 'linear-gradient(135deg, #2b1a0a 0%, #120a04 100%)',
        postBorder: 'rgba(205, 127, 50, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(205, 127, 50, 0.15)',
        postLine: '#CD7F32'
    },
    'diamond': {
        primary: '#B9F2FF',
        appBg: '#081012',
        postBg: 'linear-gradient(135deg, #132429 0%, #081012 100%)',
        postBorder: 'rgba(185, 242, 255, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(185, 242, 255, 0.2)',
        postLine: '#B9F2FF'
    },
    'topaz': {
        primary: '#FFC87C',
        appBg: '#140e06',
        postBg: 'linear-gradient(135deg, #2e200d 0%, #140e06 100%)',
        postBorder: 'rgba(255, 200, 124, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 200, 124, 0.15)',
        postLine: '#FFC87C'
    },

    // =========================================
    // 🎭 الجماليات والأنماط (Aesthetics & Styles)
    // =========================================
    'matrix': {
        primary: '#00FF41',
        appBg: '#000a00',
        postBg: 'linear-gradient(135deg, #001f00 0%, #000a00 100%)',
        postBorder: 'rgba(0, 255, 65, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(0, 255, 65, 0.2)',
        postLine: '#00FF41'
    },
    'vaporwave': {
        primary: '#FF71CE',
        appBg: '#0a0014',
        postBg: 'linear-gradient(135deg, #1d0033 0%, #0a0014 100%)',
        postBorder: 'rgba(255, 113, 206, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 113, 206, 0.25)',
        postLine: '#FF71CE'
    },
    'synthwave': {
        primary: '#01CDFE',
        appBg: '#10001a',
        postBg: 'linear-gradient(135deg, #280040 0%, #10001a 100%)',
        postBorder: 'rgba(1, 205, 254, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(1, 205, 254, 0.2)',
        postLine: '#01CDFE'
    },
    'dracula': {
        primary: '#BD93F9',
        appBg: '#181920',
        postBg: 'linear-gradient(135deg, #282A36 0%, #181920 100%)',
        postBorder: 'rgba(189, 147, 249, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(189, 147, 249, 0.15)',
        postLine: '#BD93F9'
    },
    'hacker': {
        primary: '#00FF00',
        appBg: '#000000',
        postBg: '#0a0a0a',
        postBorder: 'rgba(0, 255, 0, 0.6)',
        postShadow: '0 15px 35px rgba(0,0,0,0.8), 0 0 25px rgba(0, 255, 0, 0.2)',
        postLine: '#00FF00'
    },
    'gothic': {
        primary: '#800000',
        appBg: '#080808',
        postBg: 'linear-gradient(135deg, #1c1c1c 0%, #080808 100%)',
        postBorder: 'rgba(128, 0, 0, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.8), 0 0 25px rgba(128, 0, 0, 0.2)',
        postLine: '#800000'
    },
    'toxic': {
        primary: '#BFFF00',
        appBg: '#0b1400',
        postBg: 'linear-gradient(135deg, #192b00 0%, #0b1400 100%)',
        postBorder: 'rgba(191, 255, 0, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(191, 255, 0, 0.15)',
        postLine: '#BFFF00'
    },
    'steampunk': {
        primary: '#C39B77',
        appBg: '#120d09',
        postBg: 'linear-gradient(135deg, #291d14 0%, #120d09 100%)',
        postBorder: 'rgba(195, 155, 119, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(195, 155, 119, 0.15)',
        postLine: '#C39B77'
    },
    'neon_city': {
        primary: '#FF0055',
        appBg: '#050114',
        postBg: 'linear-gradient(135deg, #13032e 0%, #050114 100%)',
        postBorder: 'rgba(255, 0, 85, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 0, 85, 0.25)',
        postLine: '#FF0055'
    },
    'minimal': {
        primary: '#FFFFFF',
        appBg: '#000000',
        postBg: '#0f0f0f',
        postBorder: '#333333',
        postShadow: '0 10px 20px rgba(0,0,0,0.5)',
        postLine: '#FFFFFF'
    },

    // =========================================
    // 🎨 ألوان ومزاج (Colors & Moods)
    // =========================================
    'crimson': {
        primary: '#DC143C',
        appBg: '#140105',
        postBg: 'linear-gradient(135deg, #2e030b 0%, #140105 100%)',
        postBorder: 'rgba(220, 20, 60, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(220, 20, 60, 0.2)',
        postLine: '#DC143C'
    },
    'mint': {
        primary: '#98FF98',
        appBg: '#07120a',
        postBg: 'linear-gradient(135deg, #102917 0%, #07120a 100%)',
        postBorder: 'rgba(152, 255, 152, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(152, 255, 152, 0.15)',
        postLine: '#98FF98'
    },
    'teal': {
        primary: '#008080',
        appBg: '#000f0f',
        postBg: 'linear-gradient(135deg, #002424 0%, #000f0f 100%)',
        postBorder: 'rgba(0, 128, 128, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(0, 128, 128, 0.2)',
        postLine: '#008080'
    },
    'peach': {
        primary: '#FFE5B4',
        appBg: '#14110a',
        postBg: 'linear-gradient(135deg, #2e2617 0%, #14110a 100%)',
        postBorder: 'rgba(255, 229, 180, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 229, 180, 0.15)',
        postLine: '#FFE5B4'
    },
    'lavender': {
        primary: '#E6E6FA',
        appBg: '#0f0c14',
        postBg: 'linear-gradient(135deg, #231c2e 0%, #0f0c14 100%)',
        postBorder: 'rgba(230, 230, 250, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(230, 230, 250, 0.15)',
        postLine: '#E6E6FA'
    },
    'indigo': {
        primary: '#4B0082',
        appBg: '#05000a',
        postBg: 'linear-gradient(135deg, #120024 0%, #05000a 100%)',
        postBorder: 'rgba(75, 0, 130, 0.5)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(75, 0, 130, 0.2)',
        postLine: '#4B0082'
    },
    'slate': {
        primary: '#708090',
        appBg: '#07080a',
        postBg: 'linear-gradient(135deg, #12151a 0%, #07080a 100%)',
        postBorder: 'rgba(112, 128, 144, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(112, 128, 144, 0.15)',
        postLine: '#708090'
    },
    'mustard': {
        primary: '#FFDB58',
        appBg: '#141104',
        postBg: 'linear-gradient(135deg, #2e270a 0%, #141104 100%)',
        postBorder: 'rgba(255, 219, 88, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(255, 219, 88, 0.15)',
        postLine: '#FFDB58'
    },
    'olive': {
        primary: '#808000',
        appBg: '#0a0a00',
        postBg: 'linear-gradient(135deg, #1a1a00 0%, #0a0a00 100%)',
        postBorder: 'rgba(128, 128, 0, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(128, 128, 0, 0.15)',
        postLine: '#808000'
    },
    'rose_gold': {
        primary: '#B76E79',
        appBg: '#120a0b',
        postBg: 'linear-gradient(135deg, #2b181b 0%, #120a0b 100%)',
        postBorder: 'rgba(183, 110, 121, 0.4)',
        postShadow: '0 15px 35px rgba(0,0,0,0.6), 0 0 25px rgba(183, 110, 121, 0.15)',
        postLine: '#B76E79'
    }
};

// ... (باقي كود الجافاسكربت الخاص بك كما هو: applyFullTheme, clearCustomTheme, الخ)

// 2. دالة تطبيق السمة (تعمل عالمياً في كل الصفحات)
window.applyFullTheme = function(themeName, save = true) {
    const theme = appThemesConfig[themeName] || appThemesConfig['default']; 
    const root = document.documentElement;

    // إيقاف الوضع النهاري فوراً عند اختيار أي سمة مخصصة
    document.body.classList.remove('light-mode');
    if (save) localStorage.setItem('nabd_theme_mode', 'dark');

    // حقن الألوان في الـ CSS
    root.style.setProperty('--primary-color', theme.primary); 
    root.style.setProperty('--primary-solid', theme.primary); 
    root.style.setProperty('--app-main-bg', theme.appBg);
    root.style.setProperty('--bg-color', theme.appBg); 
    root.style.setProperty('--post-main-bg', theme.postBg);
    root.style.setProperty('--post-border-color', theme.postBorder);
    root.style.setProperty('--post-shadow-effect', theme.postShadow);
    root.style.setProperty('--post-line-color', theme.postLine);

    // إجبار الخلفية على التغيير
    document.body.style.setProperty('background', theme.appBg, 'important');
    document.body.style.setProperty('background-size', 'cover', 'important');

    if (save) {
        localStorage.setItem('nabd_active_theme', themeName);
        if(typeof playSound === 'function') playSound('success');
        if(typeof showToast === 'function') showToast("تم تطبيق السمة بنجاح 🎨");
        
        window.closeThemeModal();
        
        const overlay = document.getElementById('globalOverlay') || document.getElementById('overlay');
        if(overlay) overlay.style.display = 'none';
    }
};

// 3. دالة مسح السمات (للعودة للوضع الافتراضي أو النهاري)
window.clearCustomTheme = function() {
    const root = document.documentElement;
    
    root.style.removeProperty('--primary-color');
    root.style.removeProperty('--primary-solid');
    root.style.removeProperty('--app-main-bg');
    root.style.removeProperty('--bg-color');
    root.style.removeProperty('--post-main-bg');
    root.style.removeProperty('--post-border-color');
    root.style.removeProperty('--post-shadow-effect');
    root.style.removeProperty('--post-line-color');

    document.body.style.removeProperty('background');
    document.body.style.removeProperty('background-attachment');
    document.body.style.removeProperty('background-size');

    localStorage.removeItem('nabd_active_theme');
};

// 4. دوال فتح وإغلاق النافذة
window.openThemeModal = function() {
    if(typeof playSound === 'function') playSound('click');
    
    // إرجاع الكرة لو كانت سوبر
    if(typeof deactivateSuperMode === 'function' && typeof superMode !== 'undefined' && superMode) {
        deactivateSuperMode();
    }
    
    // غلق أي قوائم مفتوحة
    if(typeof closeAllSheets === 'function') closeAllSheets();
    
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.style.display = 'flex'; 
        setTimeout(() => { modal.classList.add('active'); }, 10);
    }
};

window.closeThemeModal = function() {
    const modal = document.getElementById('themeModal');
    if (modal) {
        modal.classList.remove('active');
        setTimeout(() => { modal.style.display = 'none'; }, 300);
    }
};

// 5. تهيئة السمة تلقائياً عند فتح أي صفحة في التطبيق
document.addEventListener("DOMContentLoaded", () => {
    const isLightMode = localStorage.getItem('nabd_theme_mode') === 'light';
    const savedTheme = localStorage.getItem('nabd_active_theme'); 

    if (isLightMode) {
        document.body.classList.add('light-mode');
        window.clearCustomTheme();
    } else {
        document.body.classList.remove('light-mode');
        if (savedTheme && savedTheme !== 'default') {
            window.applyFullTheme(savedTheme, false);
        } else {
            window.clearCustomTheme();
        }
    }
});
