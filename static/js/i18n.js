// ============================================================
// liuleinet 个人主页 - 多语言字典（zh / en）
// 用法：
//   1. 页面静态文本：元素挂 data-i18n="key"（或 data-i18n-alt="key" 设置 alt）
//   2. 数据条目：data.js 中加 titleEn / descEn / nameEn / textEn 字段（缺省回落中文）
//   3. JS 动态文案：script.js 中 t('key') / tFmt('key', { n: 123 })
// 切换逻辑在 script.js（getLang / setLang / applyI18n）
// ============================================================

var I18N = {
    zh: {
        docTitle: "个人学习记录 - 刘磊的个人网站",
        clockY: " 年 ",
        clockM: " 月 ",
        clockD: " 日 ",
        tagCode: "编程",
        tagWrite: "写作",
        tagRead: "读书",
        tagDream: "做梦",
        tagMusic: "听歌",
        tipSponsor: "赞助",
        tipWechat: "微信",
        tipGzh: "公众号",
        ghLoading: "正在获取 GitHub 提交记录…",
        ghError: "提交记录加载失败，点击重试",
        ghEmpty: "暂无提交记录",
        ghTotal: "过去一年 {n} 次提交",
        ghTipNone: "没有提交",
        ghTipUnit: "次提交",
        groupPersonal: "个人站点",
        groupFriends: "友情链接",
        titleMiniprogram: "小程序",
        mpNote: "微信扫码即可进入对应小程序",
        qrFallback: "待放置二维码图片：{f}",
        qrAltSponsor: "赞助赞赏码",
        qrAltWechat: "个人微信二维码",
        qrAltGzh: "微信公众号二维码",
        qrAltMp: "小程序码",
        skillAltPc: "技能图谱（桌面版）",
        skillAltWap: "技能图谱（移动版）",
        avatarAlt: "刘磊头像装饰框"
    },
    en: {
        docTitle: "Lei's Personal Site - Study Notes",
        clockY: " / ",
        clockM: " / ",
        clockD: " ",
        tagCode: "Coding",
        tagWrite: "Writing",
        tagRead: "Reading",
        tagDream: "Daydreaming",
        tagMusic: "Music",
        tipSponsor: "Sponsor",
        tipWechat: "WeChat",
        tipGzh: "Official Account",
        ghLoading: "Loading GitHub contributions…",
        ghError: "Failed to load contributions. Click to retry",
        ghEmpty: "No contributions yet",
        ghTotal: "{n} contributions in the last year",
        ghTipNone: "No contributions",
        ghTipUnit: "contributions",
        groupPersonal: "My Sites",
        groupFriends: "Friend Links",
        titleMiniprogram: "Mini Programs",
        mpNote: "Scan with WeChat to open a mini program.",
        qrFallback: "QR image pending: {f}",
        qrAltSponsor: "Appreciation QR code",
        qrAltWechat: "Personal WeChat QR code",
        qrAltGzh: "WeChat Channel QR code",
        qrAltMp: "Mini program QR code",
        skillAltPc: "Skill map (desktop)",
        skillAltWap: "Skill map (mobile)",
        avatarAlt: "Lei's avatar frame"
    }
};
