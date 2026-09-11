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

// ---------- site：个人站点 / 友情链接 ----------
function renderProjectList(elementId, items) {
    var el = document.getElementById(elementId);
    if (!el || !items) return;
    el.innerHTML = items.map(function (it) {
        return '<a class="projectItem a" target="_blank" rel="noopener" href="' + it.url + '">' +
            '<div class="projectItemLeft">' +
            '<h1>' + it.title + '</h1>' +
            '<p>' + it.desc + '</p>' +
            '</div>' +
            '<div class="projectItemRight">' +
            '<img src="' + it.img + '" alt="' + it.title + '">' +
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
            '<div>' + it.text + '</div>' +
            '<div>' + it.date + '</div>' +
            '</li>';
    }).join('');
}

// ---------- GitHub 提交历史热力图 ----------
var GH_API = 'https://github-contributions-api.jogruber.de/v4/';

function renderGitHubContributions() {
    var chart = document.getElementById('gh-chart');
    if (!chart) return;
    chart.innerHTML = '<div class="gh-status">正在获取 GitHub 提交记录…</div>';
    fetch(GH_API + GITHUB_USER + '?y=last')
        .then(function (res) {
            if (!res.ok) throw new Error('HTTP ' + res.status);
            return res.json();
        })
        .then(function (data) {
            var total = (data.total && data.total.lastYear) || 0;
            var totalEl = document.getElementById('gh-total');
            if (totalEl) totalEl.textContent = total + ' contributions in the last year';
            drawContributionGrid(chart, data.contributions || []);
        })
        .catch(function () {
            chart.innerHTML = '<div class="gh-status gh-status-error">提交记录加载失败，点击重试</div>';
            chart.querySelector('.gh-status').addEventListener('click', renderGitHubContributions);
        });
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

    // 月份标签：取每列中间行的日期，月份变化处标注
    var monthsHtml = '';
    var prevMonth = -1;
    for (var col = 0; col < cols; col++) {
        var mid = cells[col * 7 + 3];
        if (!mid) continue;
        var m = parseDate(mid.date).getUTCMonth();
        if (m !== prevMonth) {
            monthsHtml += '<span class="gh-month" style="left:calc(' + col +
                ' * (var(--gh-cell) + var(--gh-gap)))">' + (m + 1) + '月</span>';
            prevMonth = m;
        }
    }

    var gridHtml = '';
    for (var j = 0; j < cells.length; j++) {
        var c = cells[j];
        if (c) {
            var tip = (c.count === 0 ? '没有提交' : c.count + ' 次提交') + ' · ' + c.date;
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
        return '<div class="miniprogramItem">' +
            '<img src="' + it.img + '" alt="' + it.name + '小程序码">' +
            '<p>' + it.name + '</p>' +
            '</div>';
    }).join('');
    setupMiniProgramScroll(el);
}

function setupMiniProgramScroll(el) {
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

    el.addEventListener('mouseenter', function () { paused = true; });
    el.addEventListener('mouseleave', function () { paused = false; });

    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(start, 200);
    });

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
                fb.textContent = '待放置二维码图片：' + img.getAttribute('src').split('/').pop();
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

// ---------- 启动渲染 ----------
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
    
    // 更新星期
    const weekdays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
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

