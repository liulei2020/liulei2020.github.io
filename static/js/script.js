console.log('%cCopyright © 2024 liuleinet.top',
    'background-color: #ff00ff; color: white; font-size: 24px; font-weight: bold; padding: 10px;'
);
console.log('%c   /\\_/\\', 'color: #8B4513; font-size: 20px;');
console.log('%c  ( o.o )', 'color: #8B4513; font-size: 20px;');
console.log(' %c  > ^ <', 'color: #8B4513; font-size: 20px;');
console.log('  %c /  ~ \\', 'color: #8B4513; font-size: 20px;');
console.log('  %c/______\\', 'color: #8B4513; font-size: 20px;');

// ============================================================
// 数据渲染模块（数据源：static/js/data.js）
// 注意：须在下方 .projectItem 按压事件绑定之前执行
// ============================================================

// ============================================================
// 多语言（字典：static/js/i18n.js；数据英文字段：data.js 的 En 后缀）
// 首访跟随浏览器语言（中文环境 zh，其他 en），手动切换后 cookie 记忆一年
// ============================================================
var MONTHS_EN = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
var _langCache = null;

function getLang() {
    if (_langCache) return _langCache;
    var saved = getCookie('langState');
    if (saved === 'zh' || saved === 'en') {
        _langCache = saved;
        return _langCache;
    }
    var nav = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    _langCache = /^zh(-|$)/i.test(nav) ? 'zh' : 'en';
    return _langCache;
}

// 取字典：当前语言缺 key 时回落中文，再缺省返回 key 本身
function t(key) {
    var dict = window.I18N || {};
    var val = (dict[getLang()] || {})[key];
    if (val == null) val = (dict.zh || {})[key];
    return val != null ? val : key;
}

function tFmt(key, vars) {
    var s = t(key);
    for (var k in vars) s = s.split('{' + k + '}').join(vars[k]);
    return s;
}

// 数据条目按语言取值：英文模式且有 En 字段时取英文，否则回落中文
function pickLang(zhVal, enVal) {
    return (getLang() === 'en' && enVal != null && enVal !== '') ? enVal : zhVal;
}

// 应用静态文本 + 文档属性 + 切换按钮文案
function applyI18n() {
    document.documentElement.lang = getLang() === 'en' ? 'en' : 'zh-CN';
    document.title = t('docTitle');
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
        el.textContent = t(el.getAttribute('data-i18n'));
    });
    document.querySelectorAll('[data-i18n-alt]').forEach(function (el) {
        el.setAttribute('alt', t(el.getAttribute('data-i18n-alt')));
    });
    var btn = document.getElementById('langSwitchText');
    if (btn) btn.textContent = getLang() === 'zh' ? 'EN' : '中';
}

// 语言切换后重渲染所有数据区块
function rerenderAll() {
    if (typeof SITE_DATA !== 'undefined') {
        renderProjectList('personalSiteList', SITE_DATA.personal);
        renderProjectList('friendLinkList', SITE_DATA.friends);
    }
    renderMiniPrograms();
    renderTools();
    renderTimeline();
    renderGitHubContributions();
}

function initLang() {
    applyI18n();
    var btn = document.getElementById('langSwitch');
    if (btn) {
        btn.addEventListener('click', function () {
            _langCache = getLang() === 'zh' ? 'en' : 'zh';
            setCookie('langState', _langCache, 365);
            applyI18n();
            rerenderAll();
        });
    }
}

// ---------- site：个人站点 / 友情链接 ----------
function renderProjectList(elementId, items) {
    var el = document.getElementById(elementId);
    if (!el || !items) return;
    el.innerHTML = items.map(function (it) {
        var title = pickLang(it.title, it.titleEn);
        var desc = pickLang(it.desc, it.descEn);
        return '<a class="projectItem a" target="_blank" rel="noopener" href="' + it.url + '">' +
            '<div class="projectItemLeft">' +
            '<h1>' + title + '</h1>' +
            '<p>' + desc + '</p>' +
            '</div>' +
            '<div class="projectItemRight">' +
            '<img src="' + it.img + '" alt="' + title + '">' +
            '</div>' +
            '</a>';
    }).join('');
}

// ---------- Tools：文字 + 图标 ----------
function renderTools() {
    var el = document.getElementById('toolList');
    if (!el || typeof TOOLS === 'undefined' || !TOOLS) return;
    el.innerHTML = TOOLS.map(function (t) {
        return '<a class="toolItem" target="_blank" rel="noopener" href="' + t.url + '">' +
            '<img class="toolIcon" src="' + t.icon + '" alt="' + t.name + '">' +
            '<span>' + t.name + '</span>' +
            '</a>';
    }).join('');
}

// ---------- 时间线（数据正序配置，展示倒序：最新在上） ----------
function renderTimeline() {
    var el = document.getElementById('line');
    if (!el || !TIME_LINE) return;
    el.innerHTML = TIME_LINE.slice().reverse().map(function (it) {
        return '<li>' +
            '<div class="focus"></div>' +
            '<div>' + pickLang(it.text, it.textEn) + '</div>' +
            '<div>' + it.date + '</div>' +
            '</li>';
    }).join('');
}

// ---------- GitHub 提交历史热力图 ----------
var GH_API = 'https://github-contributions-api.jogruber.de/v4/';
var GH_LAST = null; // 语言切换时用缓存数据直接重画，不重新请求

function renderGitHubContributions() {
    var chart = document.getElementById('gh-chart');
    if (!chart) return;
    if (GH_LAST) {
        paintContributions(chart, GH_LAST);
        return;
    }
    chart.innerHTML = '<div class="gh-status">' + t('ghLoading') + '</div>';
    fetch(GH_API + GITHUB_USER + '?y=last')
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function (data) {
            GH_LAST = data;
            paintContributions(chart, data);
        })
        .catch(function () {
            chart.innerHTML = '<div class="gh-status gh-status-error">' + t('ghError') + '</div>';
            chart.querySelector('.gh-status').addEventListener('click', function () {
                GH_LAST = null;
                renderGitHubContributions();
            });
        });
}

function paintContributions(chart, data) {
    var total = (data.total && data.total.lastYear) || 0;
    var totalEl = document.getElementById('gh-total');
    if (totalEl) totalEl.textContent = tFmt('ghTotal', { n: total });
    drawContributionGrid(chart, data.contributions || []);
}

function drawContributionGrid(chart, contributions) {
    if (!contributions.length) {
        chart.innerHTML = '<div class="gh-status">暂无提交记录</div>';
        return;
    }

    function parseDate(s) { return new Date(s + 'T00:00:00Z'); }

    // 首日对齐到所在周的周日（周日=0），保证列结构为「周日~周六」
    var pad = parseDate(contributions[0].date).getUTCDay();
    var cells = [];
    for (var i = 0; i < pad; i++) cells.push(null);
    contributions.forEach(function (c) { cells.push(c); });
    while (cells.length % 7 !== 0) cells.push(null);
    var cols = cells.length / 7;

    // 月份标签：取每列中间行的日期，月份变化处标注（zh：3月；en：Mar）
    var monthsHtml = '';
    var prevMonth = -1;
    for (var col = 0; col < cols; col++) {
        var mid = cells[col * 7 + 3];
        if (!mid) continue;
        var m = parseDate(mid.date).getUTCMonth();
        if (m !== prevMonth) {
            var label = getLang() === 'en' ? MONTHS_EN[m] : (m + 1) + '月';
            monthsHtml += '<span class="gh-month" style="left:calc(' + col +
                ' * (var(--gh-cell) + var(--gh-gap)))">' + label + '</span>';
            prevMonth = m;
        }
    }

    var gridHtml = '';
    for (var j = 0; j < cells.length; j++) {
        var c = cells[j];
        if (c) {
            var tip = (c.count === 0 ? t('ghTipNone') : c.count + ' ' + t('ghTipUnit')) + ' · ' + c.date;
            gridHtml += '<div class="gh-cell" data-level="' + c.level + '" title="' + tip + '"></div>';
        } else {
            gridHtml += '<div class="gh-cell gh-cell-empty"></div>';
        }
    }

    chart.innerHTML = '<div class="gh-months">' + monthsHtml + '</div>' +
        '<div class="gh-grid">' + gridHtml + '</div>';
}

// ---------- 小程序列表（>4 个时自动横向滚动，滚到最后一个后回到开头重新滚动，非循环拼接） ----------
function renderMiniPrograms() {
    var el = document.getElementById('miniprogramList');
    if (!el || typeof MINI_PROGRAMS === 'undefined') return;
    el.innerHTML = MINI_PROGRAMS.map(function (it) {
        var name = pickLang(it.name, it.nameEn);
        return '<div class="miniprogramItem">' +
            '<img src="' + it.img + '" alt="' + name + ' ' + t('qrAltMp') + '">' +
            '<p>' + name + '</p>' +
            '</div>';
    }).join('');
    setupMiniProgramScroll(el);
}

function setupMiniProgramScroll(el) {
    // 语言切换重渲染会再次进入本函数：先拆掉上一轮的监听与定时器，防止重复滚动
    if (el._mpScrollTeardown) el._mpScrollTeardown();

    var items = el.children;
    if (items.length <= 4) return; // 4 个及以内：完整展示，不滚动

    var timer = null, resetTimer = null, resizeTimer = null;
    var paused = false, m = null;

    function measure() {
        if (items.length < 2) return null;
        var stride = items[1].offsetLeft - items[0].offsetLeft; // 相邻项目的横向步进（项目宽 + 间距）
        if (stride <= 0) return null;
        return { stride: stride };
    }

    function step() {
        if (paused || !m) return;
        var maxScroll = el.scrollWidth - el.clientWidth;
        if (maxScroll <= 0) return;
        var next = el.scrollLeft + m.stride;
        if (next >= maxScroll - 2) {
            // 已到最后一个：完整显示最后一个，停留后瞬间回到开头重新滚动
            el.scrollLeft = maxScroll;
            resetTimer = setTimeout(function () {
                var prev = el.style.scrollBehavior;
                el.style.scrollBehavior = 'auto';
                el.scrollLeft = 0;
                el.style.scrollBehavior = prev || '';
            }, 1400);
        } else {
            el.scrollLeft = next;
        }
    }

    function start() {
        stop();
        el.style.height = '';
        el.classList.add('miniprogramList--scroll'); // 先锁定单行不换行，才能测出真实横向溢出
        m = measure();
        if (el.scrollWidth <= el.clientWidth + 1) m = null; // 实际未溢出则不滚动
        if (!m) {
            el.classList.remove('miniprogramList--scroll');
            return;
        }
        el.scrollLeft = 0;
        timer = setInterval(step, 2400);
    }

    function stop() {
        if (timer) { clearInterval(timer); timer = null; }
        if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
    }

    // 悬浮/点击/触摸 → 暂停。关键：必须同时取消已排定的“末尾停留回卷”定时器，
    // 否则悬浮最后一项（第 5 个）时，1.4s 后回卷仍会触发，列表从手底下滚走
    function pause() {
        paused = true;
        if (resetTimer) { clearTimeout(resetTimer); resetTimer = null; }
    }
    function resume() { paused = false; }

    el.addEventListener('mouseenter', pause);
    el.addEventListener('mouseleave', resume);
    el.addEventListener('click', pause); // 点击同样暂停（含触屏轻点）

    // 触屏无 hover：触摸列表内暂停，触摸列表外恢复
    function onDocTouchStart(e) {
        if (!el.contains(e.target)) resume();
    }
    document.addEventListener('touchstart', onDocTouchStart, { passive: true });

    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(start, 200);
    }
    window.addEventListener('resize', onResize);

    el._mpScrollTeardown = function () {
        stop();
        el.removeEventListener('mouseenter', pause);
        el.removeEventListener('mouseleave', resume);
        el.removeEventListener('click', pause);
        document.removeEventListener('touchstart', onDocTouchStart);
        window.removeEventListener('resize', onResize);
        el._mpScrollTeardown = null;
    };

    start();
}

// ---------- 顶部图标二维码气泡（悬浮由 CSS 处理；点击切换，点击外部关闭） ----------
function closeAllIconPops() {
    document.querySelectorAll('.iconItem.active').forEach(function (el) {
        el.classList.remove('active');
    });
}

function setupIconPops() {
    document.querySelectorAll('.iconItem[data-pop]').forEach(function (item) {
        item.addEventListener('click', function (e) {
            e.stopPropagation();
            var isActive = item.classList.contains('active');
            closeAllIconPops();
            if (!isActive) item.classList.add('active');
        });
        var popBox = item.querySelector('.iconPop');
        var img = popBox && popBox.querySelector('img');
        if (img) {
            var showFallback = function () {
                var fb = document.createElement('div');
                fb.className = 'iconPop-fallback';
                fb.textContent = tFmt('qrFallback', { f: img.getAttribute('src').split('/').pop() });
                img.replaceWith(fb);
            };
            // 本地 404 可能先于 error 监听绑定完成，需检查加载状态
            if (img.complete && img.naturalWidth === 0) {
                showFallback();
            } else {
                img.addEventListener('error', showFallback);
            }
        }
    });
    document.addEventListener('click', closeAllIconPops);
}

// ---------- 启动渲染（先初始化语言，静态文本与数据渲染均按当前语言输出） ----------
initLang();
if (typeof SITE_DATA !== 'undefined') {
    renderProjectList('personalSiteList', SITE_DATA.personal);
    renderProjectList('friendLinkList', SITE_DATA.friends);
}
renderMiniPrograms();
renderTools();
renderTimeline();
renderGitHubContributions();
setupIconPops();

document.addEventListener('contextmenu', function (event) {
    event.preventDefault();
});

function handlePress(event) {
    this.classList.add('pressed');
}

function handleRelease(event) {
    this.classList.remove('pressed');
}

function handleCancel(event) {
    this.classList.remove('pressed');
}

// 数字时钟功能
function updateClock() {
    const now = new Date();
    
    // 更新日期
    document.getElementById('clock-year').textContent = now.getFullYear();
    document.getElementById('clock-month').textContent = String(now.getMonth() + 1).padStart(2, '0');
    document.getElementById('clock-day').textContent = String(now.getDate()).padStart(2, '0');
    
    // 更新星期（按当前语言）
    var lang = getLang();
    var weekdays = lang === 'en'
        ? ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        : ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
    document.getElementById('clock-weekday').textContent = weekdays[now.getDay()];
    
    // 更新时间
    document.getElementById('clock-hour').textContent = String(now.getHours()).padStart(2, '0');
    document.getElementById('clock-minute').textContent = String(now.getMinutes()).padStart(2, '0');
    document.getElementById('clock-second').textContent = String(now.getSeconds()).padStart(2, '0');
  }
  
  // 页面加载完成后启动时钟
  document.addEventListener('DOMContentLoaded', function() {
    updateClock(); // 立即更新一次
    setInterval(updateClock, 1000); // 每秒更新一次
});

var buttons = document.querySelectorAll('.projectItem');
buttons.forEach(function (button) {
    button.addEventListener('mousedown', handlePress);
    button.addEventListener('mouseup', handleRelease);
    button.addEventListener('mouseleave', handleCancel);
    button.addEventListener('touchstart', handlePress);
    button.addEventListener('touchend', handleRelease);
    button.addEventListener('touchcancel', handleCancel);
});

function toggleClass(selector, className) {
    var elements = document.querySelectorAll(selector);
    elements.forEach(function (element) {
        element.classList.toggle(className);
    });
}

function pop(imageURL) {
    var tcMainElement = document.querySelector(".tc-img");
    if (imageURL) {
        tcMainElement.src = imageURL;
    }
    toggleClass(".tc-main", "active");
    toggleClass(".tc", "active");
}

var tc = document.getElementsByClassName('tc');
var tc_main = document.getElementsByClassName('tc-main');
tc[0].addEventListener('click', function (event) {
    pop();
});
tc_main[0].addEventListener('click', function (event) {
    event.stopPropagation();
});



function setCookie(name, value, days) {
    var expires = "";
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) == 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}















document.addEventListener('DOMContentLoaded', function () {






    var html = document.querySelector('html');
    var themeState = getCookie("themeState") || "Light";

    function changeTheme(theme) {
        html.dataset.theme = theme;
        setCookie("themeState", theme, 365);
        themeState = theme;
    }







    var Checkbox = document.getElementById('myonoffswitch')
    Checkbox.addEventListener('change', function () {
        if (themeState == "Dark") {
            changeTheme("Light");
        } else if (themeState == "Light") {
            changeTheme("Dark");
        } else {
            changeTheme("Dark");
        }
    });



    if (themeState == "Dark") {
        Checkbox.checked = false;
    }

    changeTheme(themeState);

















   

    var fpsElement = document.createElement('div');
    fpsElement.id = 'fps';
    fpsElement.style.zIndex = '10000';
    fpsElement.style.position = 'fixed';
    fpsElement.style.left = '0';
    document.body.insertBefore(fpsElement, document.body.firstChild);

    var showFPS = (function () {
        var requestAnimationFrame = window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };

        var fps = 0,
            last = Date.now(),
            offset, step, appendFps;

        step = function () {
            offset = Date.now() - last;
            fps += 1;

            if (offset >= 1000) {
                last += offset;
                appendFps(fps);
                fps = 0;
            }

            requestAnimationFrame(step);
        };

        appendFps = function (fpsValue) {
            fpsElement.textContent = 'FPS: ' + fpsValue;
        };

        step();
    })();
    
    
    
    //pop('./static/img/tz.jpg')
    
    
    
});




var pageLoading = document.querySelector("#zyyo-loading");
window.addEventListener('load', function() {
    setTimeout(function () {
        pageLoading.style.opacity = '0';
    }, 100);
});

