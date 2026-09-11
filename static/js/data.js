// ============================================================
// liuleinet 个人主页 - 数据配置中心
// 站点 / 友链 / 工具 / 时间线 / GitHub 均在此配置，改完即生效
// ============================================================

// GitHub 用户名（用于拉取提交历史热力图）
var GITHUB_USER = "liulei2020";

// ---------- site：个人站点 ----------
var SITE_DATA = {
    personal: [
        { title: "博客", desc: "记录摆烂日常", url: "https://blog.liuleinet.top", img: "./static/img/i1.png" },
        { title: "情侣日常", desc: "记录情侣日常", url: "https://couple.liuleinet.top", img: "./static/img/i1.png" },

    ],
    // ---------- site：友情链接（按相同格式添加即可） ----------
    friends: [
        { title: "AIFIS语言反射训练平台", desc: "快速习得外语口语", url: "https://langtrain.suikuntech.com", img: "./static/img/i2.png" }
    ]
};

// ---------- Tools：名称 + 图标 + 链接 ----------
var TOOLS = [
    { name: "Claude Code", icon: "./static/img/tools/claude.svg", url: "https://claude.com/product/claude-code" },
    { name: "Codex", icon: "./static/img/tools/openai.svg", url: "https://openai.com/codex" },
    { name: "OpenCode", icon: "./static/img/tools/opencode.svg", url: "https://opencode.ai" },
    { name: "Harness", icon: "./static/img/tools/harness.svg", url: "https://www.harness.io" }
];

// ---------- 小程序（超过 4 个时自动逐行滚动，滚到最后一行后回到开头重新滚动） ----------
var MINI_PROGRAMS = [
    { name: "天天跟练英语", img: "./images/eng-app-qrcode_with_invite_code.png" },
    { name: "单词消除保卫战", img: "./images/word-game-qrcode.png" },
    { name: "奖状制作", img: "./images/cert-app-qrcode.png" },
    { name: "情侣互动奖励", img: "./images/couple-app-qrcode.png" },
    { name: "爱己打卡计划", img: "./images/checkin-qrcode_with_invite_code.png" }
];

// ---------- 时间线（按时间正序填写，页面自动倒序展示：最新在上） ----------
var TIME_LINE = [
    { text: "新余市第四中学", date: "2012.09" },
    { text: "江西农业大学-城乡规划", date: "2015.09" },
    { text: "开发第一个安卓APP（未上线）", date: "2017.07" },
    { text: "江西财经大学-计算机科学与技术-第二学士学位", date: "2020.09" },
    { text: "个人第一个小程序上线", date: "2020.09" },
    { text: "个人网站首次上线", date: "2021.10" },
    { text: "注册域名 liuleinet.top", date: "2022.03" },
    { text: "ICP 备案成功", date: "2022.03" },
    { text: "个人第二个小程序上线", date: "2022.06" },
    { text: "Java 开发入职", date: "2022.07" },
    { text: "Java 企业项目", date: "2022.08" },
    { text: "个人博客网站上线（Java (Springboot) + Vue）", date: "2022.10" },
    { text: "个人博客网站改版（Java (Springboot) + freemarker）", date: "2024.03" },
    { text: "个人第三个小程序上线", date: "2025.01" },
    { text: "个人博客网站改版（Go (Gin) + Nextjs）", date: "2025.12" },
    { text: "个人博客网站迁移到子域名（blog.liuleinet.top）", date: "2026.08" },
    { text: "敬请期待", date: "2026.09" }
];
