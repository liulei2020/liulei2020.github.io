// ============================================================
// liuleinet 个人主页 - 数据配置中心
// 站点 / 友链 / 工具 / 时间线 / GitHub 均在此配置，改完即生效
// ============================================================

// GitHub 用户名（用于拉取提交历史热力图）
var GITHUB_USER = "liulei2020";

// ---------- site：个人站点（En 后缀字段为英文，可缺省） ----------
var SITE_DATA = {
    personal: [
        { title: "博客", titleEn: "Blog", desc: "记录摆烂日常", descEn: "Daily notes & ramblings", url: "https://blog.liuleinet.top", img: "./static/img/i1.png" },
        { title: "情侣日常", titleEn: "Couple Diary", desc: "记录情侣日常", descEn: "Our everyday moments", url: "https://couple.liuleinet.top", img: "./static/img/i1.png" },

    ],
    // ---------- site：友情链接（按相同格式添加即可） ----------
    friends: [
        { title: "AIFIS语言反射训练平台", titleEn: "AIFIS Language Training", desc: "快速习得外语口语", descEn: "Master spoken languages fast", url: "https://langtrain.suikuntech.com", img: "./static/img/i2.png" }
    ]
};

// ---------- Tools：名称 + 图标 + 链接 ----------
var TOOLS = [
    { name: "Claude Code", icon: "./static/img/tools/claude.svg", url: "https://claude.com/product/claude-code" },
    { name: "Codex", icon: "./static/img/tools/openai.svg", url: "https://openai.com/codex" },
    { name: "OpenCode", icon: "./static/img/tools/opencode.svg", url: "https://opencode.ai" },
    { name: "Harness", icon: "./static/img/tools/harness.svg", url: "https://www.harness.io" }
];

// ---------- 小程序（超过 4 个时自动横向滚动，滚到最后一个后回到开头重新滚动） ----------
var MINI_PROGRAMS = [
    { name: "天天跟练英语", nameEn: "Daily English Practice", img: "./images/eng-app-qrcode_with_invite_code.png" },
    { name: "单词消除保卫战", nameEn: "Word Elimination Battle", img: "./images/word-game-qrcode.png" },
    { name: "奖状制作", nameEn: "Certificate Maker", img: "./images/cert-app-qrcode.png" },
    { name: "情侣互动奖励", nameEn: "Couple Rewards", img: "./images/couple-app-qrcode.png" },
    { name: "爱己打卡计划", nameEn: "Self-Care Check-in", img: "./images/checkin-qrcode_with_invite_code.png" }
];

// ---------- 时间线（按时间正序填写，页面自动倒序展示：最新在上；textEn 为英文，可缺省） ----------
var TIME_LINE = [
    { text: "新余市第四中学", textEn: "Xinyu No.4 High School", date: "2012.09" },
    { text: "江西农业大学-城乡规划", textEn: "Jiangxi Agricultural University - Urban & Rural Planning", date: "2015.09" },
    { text: "开发第一个安卓APP（未上线）", textEn: "Developed my first Android app (unreleased)", date: "2017.07" },
    { text: "江西财经大学-计算机科学与技术-第二学士学位", textEn: "Jiangxi University of Finance and Economics - Computer Science and Technology (2nd degree)", date: "2020.09" },
    { text: "个人第一个小程序上线", textEn: "Launched my 1st mini program", date: "2020.09" },
    { text: "个人网站首次上线", textEn: "Personal website first launch", date: "2021.10" },
    { text: "注册域名 liuleinet.top", textEn: "Registered domain liuleinet.top", date: "2022.03" },
    { text: "ICP 备案成功", textEn: "ICP filing approved", date: "2022.03" },
    { text: "个人第二个小程序上线", textEn: "Launched my 2nd mini program", date: "2022.06" },
    { text: "Java 开发入职", textEn: "Started as a Java developer", date: "2022.07" },
    { text: "Java 企业项目", textEn: "Enterprise Java projects", date: "2022.08" },
    { text: "个人博客网站上线（Java (Springboot) + Vue）", textEn: "Blog v1 launched (Java Spring Boot + Vue)", date: "2022.10" },
    { text: "个人博客网站改版（Java (Springboot) + freemarker）", textEn: "Blog v2 revamp (Java Spring Boot + Freemarker)", date: "2024.03" },
    { text: "个人第三个小程序上线", textEn: "Launched my 3rd mini program", date: "2025.01" },
    { text: "个人博客网站改版（Go (Gin) + Nextjs）", textEn: "Blog v3 revamp (Go Gin + Next.js)", date: "2025.12" },
    { text: "个人博客网站迁移到子域名（blog.liuleinet.top）", textEn: "Blog migrated to subdomain (blog.liuleinet.top)", date: "2026.08" },
    { text: "敬请期待", textEn: "Stay tuned", date: "2026.09" }
];
