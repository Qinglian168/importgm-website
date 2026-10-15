/* =========================================================
   EBIT — Application logic (i18n render, quote list, search)
   ========================================================= */

var LANG = "zh";
var IMG = "assets/img/";

/* ---------------- Language ---------------- */
function detectLang(){
  var q = new URLSearchParams(location.search).get("lang");
  if(q === "en" || q === "zh"){ LANG = q; localStorage.setItem("ebit_lang", LANG); return; }
  var s = localStorage.getItem("ebit_lang");
  LANG = (s === "en" || s === "zh") ? s : "zh";
}
function setLang(l){
  LANG = l;
  localStorage.setItem("ebit_lang", l);
  renderAll();
  document.documentElement.lang = (l === "zh") ? "zh-Hant" : "en";
  document.title = pageTitle();
}
function t(k){
  var d = T[LANG] || T.zh;
  return (d[k] !== undefined) ? d[k] : k;
}
function tf(k, vars){
  var s = t(k);
  for(var key in vars){ s = s.replace("{" + key + "}", vars[key]); }
  return s;
}
function zh(v1, v2){ return LANG === "zh" ? v1 : v2; }

/* ---------------- Helpers ---------------- */
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }
function qs(sel, root){ return (root||document).querySelector(sel); }
function qsa(sel, root){ return Array.prototype.slice.call((root||document).querySelectorAll(sel)); }
function param(k){ return new URLSearchParams(location.search).get(k); }
function catIcon(c){ return IMG + "cat/" + c.icon + ".svg"; }
function pname(p){ return LANG === "zh" ? p.zh : p.en; }
function pspecs(p){ return LANG === "zh" ? p.sz : p.se; }
function catName(c){ return LANG === "zh" ? c.zh : c.en; }
function catDesc(c){ return LANG === "zh" ? c.dz : c.de; }
function groupName(g){ return LANG === "zh" ? g.zh : g.en; }
function pLink(p){ return "product.html?p=" + encodeURIComponent(p.sku) + langSuffix(); }
function cLink(c){ return "category.html?c=" + encodeURIComponent(c.slug) + langSuffix(); }
function langSuffix(){ return LANG === "en" ? "&lang=en" : ""; }
function langUrl(file){
  var base = file;
  var extra = "";
  var c = param("c"), p = param("p"), k = param("k");
  if(c) extra += "&c=" + encodeURIComponent(c);
  if(p) extra += "&p=" + encodeURIComponent(p);
  if(k) extra += "&k=" + encodeURIComponent(k);
  return LANG === "en" ? base + "?lang=en" + extra : base + (extra ? "?" + extra.slice(1) : "");
}

/* ---------------- Icons ---------------- */
var ICON = {
  user:'<svg viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  quote:'<svg viewBox="0 0 24 24"><path d="M9 2h6a2 2 0 0 1 2 2v4l3 6v6a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-6l3-6V4a2 2 0 0 1 2-2z"/><path d="M9 2v6H6M15 2v6h3"/></svg>',
  phone:'<svg viewBox="0 0 24 24"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8.1 9.9a16 16 0 0 0 6 6l1.3-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/></svg>',
  menu:'<svg viewBox="0 0 24 24"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  grid:'<svg viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  search:'<svg viewBox="0 0 24 24" style="width:16px;height:16px;stroke:#fff;fill:none;stroke-width:2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>',
  shield:'<svg viewBox="0 0 24 24"><path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6z"/><path d="M9 12l2 2 4-4"/></svg>',
  truck:'<svg viewBox="0 0 24 24"><path d="M1 3h13v13H1zM14 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/></svg>',
  box:'<svg viewBox="0 0 24 24"><path d="M21 8l-9-5-9 5 9 5 9-5z"/><path d="M3 8v8l9 5 9-5V8"/></svg>',
  headset:'<svg viewBox="0 0 24 24"><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v6H5a2 2 0 0 1-2-2v-4zM20 14h-3v6h2a2 2 0 0 0 2-2v-4z"/></svg>',
  cog:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V21a2 2 0 1 1-4 0v-.1A1.6 1.6 0 0 0 7.5 19.4l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1A1.6 1.6 0 0 0 3 13.9H3a2 2 0 1 1 0-4h.1A1.6 1.6 0 0 0 4.6 7.5l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1A1.6 1.6 0 0 0 10 3.1V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.5 1.4l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z"/></svg>',
  check:'<svg viewBox="0 0 24 24"><path d="M20 6L9 17l-5-5"/></svg>',
  pin:'<svg viewBox="0 0 24 24"><path d="M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11z"/><circle cx="12" cy="10" r="2.5"/></svg>',
  mail:'<svg viewBox="0 0 24 24"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M2 7l10 6 10-6"/></svg>',
  clock:'<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
  up:'<svg viewBox="0 0 24 24"><path d="M12 19V5M5 12l7-7 7 7"/></svg>',
  wx:'<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-4.8A8.4 8.4 0 0 1 4 11.5 8.4 8.4 0 0 1 12.5 3 8.4 8.4 0 0 1 21 11.5z"/></svg>'
};

/* ---------------- Category extra content ---------------- */
var CAT_EXTRA = {
  optical:{
    f_zh:["逐隻完成收發光功率與靈敏度測試，附測試記錄","支援碼片寫入，相容主流品牌交換機即插即用","金屬外殼遮蔽設計，EMI 表現優異","支援 DOM/DDM 即時光功率診斷（視型號）"],
    f_en:["Per-unit TX/RX power and sensitivity test with records","In-house coding for plug-and-play multi-vendor compatibility","Metal housing shielding for excellent EMI performance","DOM/DDM real-time diagnostics (model dependent)"],
    a_zh:["資料中心伺服器接入與上行鏈路","園區網核心與匯聚層互連","電信營運商城域傳輸網","5G 前傳與基站回傳"],
    a_en:["Data center server access and uplinks","Campus core and aggregation interconnects","Carrier metro transport networks","5G fronthaul and base station backhaul"]
  },
  copper:{
    f_zh:["無氧銅導體，導電性能穩定，衰減低","批次 Fluke 抽測，可提供檢測報告","注塑成型接頭，抗拉抗彎折","支援長度、顏色與標籤訂製"],
    f_en:["Oxygen-free copper conductors, low attenuation","Batch Fluke sampling with test reports available","Molded strain-relief boots resist pulling and bending","Custom length, color and labeling supported"],
    a_zh:["企業辦公與園區水平佈線","資料中心機櫃內結構化配線","智慧建築弱電與樓宇自控","安防監控與門禁網路"],
    a_en:["Enterprise office and campus horizontal cabling","Structured patching inside data center racks","Intelligent building ELV and automation","CCTV surveillance and access control networks"]
  },
  test:{
    f_zh:["出廠前完成精度校準，可附校準證書","LCD/LED 顯示直觀，現場判讀快","堅固機身設計，適合工地環境使用","支援電池/充電雙供電，連續工作時間長"],
    f_en:["Factory calibrated before shipment, certificates available","Clear LCD/LED readouts for fast on-site decisions","Rugged housing built for construction sites","Battery or rechargeable power for long field use"],
    a_zh:["綜合佈線工程驗收與交付","機房巡檢與鏈路故障排查","系統整合商項目交付測試","營運商專線開通驗證"],
    a_en:["Structured cabling acceptance and handover","Data center audits and link troubleshooting","System integrator project delivery testing","Carrier leased line commissioning"]
  },
  tools:{
    f_zh:["高碳鋼刀口，硬度高、耐磨損","省力棘輪/彈簧結構，長時間作業不疲勞","防滑雙色手柄，握持舒適","可替換刀頭設計，維護成本低"],
    f_en:["High-carbon steel blades, hard and wear resistant","Labor-saving ratchet/spring mechanism reduces fatigue","Non-slip dual-color ergonomic grips","Replaceable blades keep maintenance cost low"],
    a_zh:["網路與光纖佈線現場施工","機房標準化建置與整線","設備維護與現場搶修","弱電工程隊隨身工具配置"],
    a_en:["On-site network and fiber cabling","Standardized rack build-out and cable management","Equipment maintenance and emergency repair","Everyday kit for ELV installation crews"]
  },
  dc:{
    f_zh:["符合 19 吋機架標準，安裝孔位通用","冷軋鋼/阻燃材質，承重與安全性兼顧","表面防鏽處理，適合長期機房環境","可提供含安裝件的整套配置"],
    f_en:["19\" rack standard with universal mounting pattern","Cold-rolled steel / flame-retardant materials for load and safety","Anti-corrosion finish for long-term data center use","Supplied as a complete kit with mounting hardware"],
    a_zh:["資料中心機房整體建置","企業分支機構機櫃部署","邊緣運算與基站機房","弱電間與監控中心"],
    a_en:["Full data center room build-outs","Branch office rack deployments","Edge computing and base station rooms","ELV rooms and monitoring centers"]
  }
};
function extra(cat){ return CAT_EXTRA[cat.group] || CAT_EXTRA.optical; }

/* =========================================================
   QUOTE LIST
   ========================================================= */
function getQuote(){ try{ return JSON.parse(localStorage.getItem("ebit_quote")||"[]"); }catch(e){ return []; } }
function saveQuote(a){ localStorage.setItem("ebit_quote", JSON.stringify(a)); updateQuoteBadge(); }
function addToQuote(sku, qty){
  var a = getQuote();
  var found = false;
  for(var i=0;i<a.length;i++){ if(a[i].sku===sku){ a[i].qty = (a[i].qty||1) + (qty||1); found = true; break; } }
  if(!found) a.push({sku:sku, qty:qty||1});
  saveQuote(a);
  toast(LANG==="zh" ? "已加入詢價籃" : "Added to quote list");
  renderDrawer();
}
function setQuoteQty(sku, qty){
  var a = getQuote();
  for(var i=0;i<a.length;i++){ if(a[i].sku===sku){ a[i].qty = Math.max(1, parseInt(qty||1,10)); } }
  saveQuote(a); renderDrawer(); if(qs("#quoteList")) renderQuotePage();
}
function removeQuote(sku){
  var a = getQuote().filter(function(x){ return x.sku !== sku; });
  saveQuote(a); renderDrawer(); if(qs("#quoteList")) renderQuotePage();
  toast(LANG==="zh" ? "已移除" : "Removed");
}
function clearQuote(){ saveQuote([]); renderDrawer(); if(qs("#quoteList")) renderQuotePage(); }
function quoteCount(){ var a=getQuote(), n=0; a.forEach(function(x){ n += (x.qty||1); }); return n; }
function updateQuoteBadge(){
  qsa(".q-count").forEach(function(el){ el.textContent = quoteCount(); });
  qsa(".q-count").forEach(function(el){ el.style.display = quoteCount()>0 ? "flex" : "none"; });
}
function toast(msg){
  var el = qs("#toast");
  if(!el){ el = document.createElement("div"); el.id="toast"; el.className="toast"; document.body.appendChild(el); }
  el.textContent = msg; el.classList.add("on");
  clearTimeout(el._t); el._t = setTimeout(function(){ el.classList.remove("on"); }, 1900);
}

/* =========================================================
   SHARED CHROME
   ========================================================= */
function renderTopbar(){
  var el = qs("#topbar");
  if(!el) return;
  el.className = "topbar";
  el.innerHTML =
    '<div class="wrap">' +
      '<span>' + ICON.check.replace("<svg",'<svg style="width:13px;height:13px;stroke:#12a05c;fill:none;stroke-width:2.4;vertical-align:-2px;margin-right:4px"') + esc(t("top.free")) + '</span>' +
      '<span class="sep">|</span><span>' + esc(t("top.bulk")) + '</span>' +
      '<span class="sep">|</span><span>' + esc(t("top.support")) + '</span>' +
      '<div class="topbar-right">' +
        '<a href="support.html' + (LANG==="en"?"?lang=en":"") + '">' + esc(t("top.help")) + '</a>' +
        '<span class="sep">|</span>' +
        '<span>' + esc(t("langLabel")) + ':' +
          '<span class="lang-switch" style="margin-left:6px">' +
            '<button data-lang="zh" class="' + (LANG==="zh"?"on":"") + '">繁體</button>' +
            '<button data-lang="en" class="' + (LANG==="en"?"on":"") + '">EN</button>' +
          '</span>' +
        '</span>' +
      '</div>' +
    '</div>';
}

function renderHeader(){
  var el = qs("#header");
  if(!el) return;
  el.className = "header";
  el.innerHTML =
    '<div class="wrap header-inner">' +
      '<button class="burger" id="burger" aria-label="menu">' + ICON.menu + '</button>' +
      '<a class="logo" href="index.html' + (LANG==="en"?"?lang=en":"") + '">' +
        '<img src="' + IMG + 'logo.svg" alt="HELPYOU">' +
      '</a>' +
      '<div class="search">' +
        '<div class="search-box">' +
          '<input id="q" type="text" placeholder="' + esc(t("search.ph")) + '" autocomplete="off">' +
          '<button id="qbtn">' + ICON.search + esc(t("search.btn")) + '</button>' +
        '</div>' +
        '<div class="suggest" id="suggest"></div>' +
      '</div>' +
      '<div class="h-actions">' +
        '<a class="h-action" href="quote.html' + (LANG==="en"?"?lang=en":"") + '">' + ICON.quote + '<span class="badge q-count">0</span>' + esc(t("nav.quote")) + '</a>' +
        '<a class="h-action" href="contact.html' + (LANG==="en"?"?lang=en":"") + '">' + ICON.headset + esc(t("nav.contact")) + '</a>' +
        '<div class="h-phone"><b>' + COMPANY.phone + '</b><span>' + esc(COMPANY.contact) + '</span></div>' +
      '</div>' +
    '</div>';
  bindSearch();
}

function renderNav(){
  var el = qs("#navbar");
  if(!el) return;
  var mega = '<div class="mega" id="mega">';
  GROUPS.forEach(function(g){
    var cats = CATS.filter(function(c){ return c.group === g.slug; });
    mega += '<div class="mega-col"><h5><img src="' + IMG + 'cat/' + g.icon + '.svg" alt="">' + esc(groupName(g)) + '</h5>';
    cats.forEach(function(c){ mega += '<a href="' + cLink(c) + '">' + esc(catName(c)) + '</a>'; });
    mega += '</div>';
  });
  mega += '<div class="mega-foot"><span>' + esc(t("nav.slogan")) + '</span><span>·</span><span>' + esc(t("top.support")) + '：' + COMPANY.phone + '</span><span>·</span><a href="products.html' + (LANG==="en"?"?lang=en":"") + '" style="color:#ff6a13;font-weight:600">' + esc(t("cat.more")) + ' →</a></div></div>';

  var page = document.body.getAttribute("data-page") || "";
  var links = [
    {h:"index.html", k:"nav.home", p:"home"},
    {h:"products.html", k:"nav.products", p:"products"},
    {h:"support.html", k:"nav.support", p:"support"},
    {h:"about.html", k:"nav.about", p:"about"},
    {h:"contact.html", k:"nav.contact", p:"contact"}
  ];
  var lhtml = links.map(function(l){
    return '<a href="' + l.h + (LANG==="en"?"?lang=en":"") + '" class="' + (page===l.p?"hot":"") + '">' + esc(t(l.k)) + '</a>';
  }).join("");

  el.className = "navbar";
  el.innerHTML =
    '<div class="nav-inner">' +
      '<div class="nav-cat" id="navCat">' + ICON.grid + '<span>' + esc(t("nav.all")) + '</span></div>' +
      '<div class="nav-links">' + lhtml + '</div>' +
      '<div class="nav-cta">' + ICON.phone.replace("<svg",'<svg style="width:14px;height:14px;stroke:#ff6a13;fill:none;stroke-width:2"') +
        '<span>' + esc(t("nav.slogan")) + '</span></div>' +
    '</div>' + mega;

  var nc = qs("#navCat"), mg = qs("#mega");
  if(nc && mg){
    nc.addEventListener("click", function(e){ e.stopPropagation(); mg.classList.toggle("open"); });
    mg.addEventListener("click", function(e){ e.stopPropagation(); });
  }
  var bg = qs("#burger");
  if(bg) bg.addEventListener("click", function(){ el.classList.toggle("mobile-open"); });
}

function renderFooter(){
  var el = qs("#footer");
  if(!el) return;
  var optical = CATS.filter(function(c){ return c.group==="optical"; }).slice(0,5);
  var test = CATS.filter(function(c){ return c.group==="test" || c.group==="tools"; }).slice(0,5);
  var dc = CATS.filter(function(c){ return c.group==="dc" || c.group==="copper"; }).slice(0,5);
  var sfx = LANG==="en" ? "?lang=en" : "";

  function col(title, arr){
    return '<div class="foot-col"><h5>' + esc(title) + '</h5>' +
      arr.map(function(c){ return '<a href="' + cLink(c) + '">' + esc(catName(c)) + '</a>'; }).join("") +
      '</div>';
  }
  el.className = "footer";
  el.innerHTML =
    '<div class="foot-top"><div class="wrap"><div class="foot-grid">' +
      '<div class="foot-col foot-about">' +
        '<a class="logo" href="index.html' + sfx + '"><img src="' + IMG + 'logo-white.svg" alt="HELPYOU" style="height:38px"></a>' +
        '<p>' + esc(t("foot.about")) + '</p>' +
        '<div class="wx-box"><div class="qr"><img src="' + IMG + 'wechat-qr.png" alt="WeChat"></div>' +
        '<div><b style="color:#fff;font-size:13px">' + esc(t("foot.wx")) + '</b><br><span style="font-size:12px">' + esc(t("foot.wx2")) + '</span></div></div>' +
      '</div>' +
      col(t("foot.prod"), optical) +
      col(t("foot.serv"), test) +
      col(t("foot.comp"), dc) +
      '<div class="foot-col"><h5>' + esc(t("foot.contact")) + '</h5>' +
        '<ul class="foot-contact">' +
          '<li>' + ICON.user.replace("<svg",'<svg style="width:15px;height:15px;stroke:#ff6a13;fill:none;stroke-width:1.8;margin-top:4px"') + '<div><b>' + esc(COMPANY.contact) + '</b><br><span>' + esc(t("contact.name")) + '</span></div></li>' +
          '<li>' + ICON.phone.replace("<svg",'<svg style="stroke:#ff6a13"') + '<div><b>' + COMPANY.phone + '</b><br><span>' + esc(t("contact.phone")) + '</span></div></li>' +
          '<li>' + ICON.mail.replace("<svg",'<svg style="stroke:#ff6a13"') + '<div><b>' + esc(COMPANY.email) + '</b></div></li>' +
          '<li>' + ICON.pin.replace("<svg",'<svg style="stroke:#ff6a13"') + '<div><span>' + esc(LANG==="zh"?COMPANY.addr_zh:COMPANY.addr_en) + '</span></div></li>' +
          '<li>' + ICON.clock.replace("<svg",'<svg style="stroke:#ff6a13"') + '<div><span>' + esc(LANG==="zh"?COMPANY.hours_zh:COMPANY.hours_en) + '</span></div></li>' +
        '</ul>' +
      '</div>' +
    '</div></div></div>' +
    '<div class="foot-bottom"><div class="wrap">' +
      '<span>© ' + new Date().getFullYear() + ' ' + esc(LANG==="zh"?COMPANY.zh:COMPANY.en) + ' · ' + esc(t("foot.rights")) + '</span>' +
      '<div class="r"><span>' + esc(t("foot.icp")) + '</span><a href="support.html' + sfx + '">' + esc(t("nav.support")) + '</a><a href="contact.html' + sfx + '">' + esc(t("nav.contact")) + '</a></div>' +
    '</div></div>';
}

function renderDrawer(){
  var el = qs("#drawer");
  if(!el){ var d = document.createElement("div"); d.id = "drawer"; document.body.appendChild(d); }
  var box = qs("#drawer");
  var items = getQuote();
  var sfx = LANG==="en" ? "?lang=en" : "";
  var body = items.length ? items.map(function(it){
      var p = getProduct(it.sku);
      if(!p) return "";
      var c = getCat(p.cat);
      return '<div class="quote-item">' +
        '<div class="qimg"><img src="' + catIcon(c) + '" alt=""></div>' +
        '<div class="qi"><b>' + esc(pname(p)) + '</b><span>' + esc(p.sku) + '</span></div>' +
        '<input type="number" min="1" value="' + it.qty + '" data-qsku="' + esc(p.sku) + '">' +
        '<button class="del" data-delsku="' + esc(p.sku) + '">&times;</button>' +
      '</div>';
    }).join("") :
    '<div class="empty" style="padding:40px 10px">' + esc(t("quote.empty")) + '</div>';

  box.className = "drawer";
  box.innerHTML =
    '<header><b>' + esc(t("nav.quote")) + ' (' + quoteCount() + ')</b><button id="drawerClose">&times;</button></header>' +
    '<div class="body">' + body + '</div>' +
    '<footer>' +
      '<a class="btn btn-primary btn-block" href="quote.html' + sfx + '">' + esc(t("quote.submit")) + '</a>' +
      '<div class="row mt8"><button class="btn btn-ghost btn-sm" id="drawerClear" style="flex:1">' + esc(t("quote.clear")) + '</button></div>' +
    '</footer>';
  var c = qs("#drawerClose"); if(c) c.addEventListener("click", closeDrawer);
  var cl = qs("#drawerClear"); if(cl) cl.addEventListener("click", function(){ clearQuote(); });
}

function openDrawer(){ var d = qs("#drawer"); if(d) d.classList.add("on"); var m=qs("#mask"); if(m) m.classList.add("on"); }
function closeDrawer(){ var d = qs("#drawer"); if(d) d.classList.remove("on"); var m=qs("#mask"); if(m) m.classList.remove("on"); }

/* =========================================================
   PRODUCT CARD
   ========================================================= */
var TAG_MAP = {"熱銷":"Hot","新品":"New","現貨":"In Stock","限時":"Limited"};
function ptag(p){
  if(!p.tag) return "";
  var label = LANG === "en" ? (TAG_MAP[p.tag] || p.tag) : p.tag;
  var cls = (p.tag === "新品" || p.tag === "New") ? " green" : "";
  return '<span class="p-tag' + cls + '">' + esc(label) + '</span>';
}
function productCard(p){
  var c = getCat(p.cat);
  var specs = pspecs(p).slice(0,3);
  var tag = ptag(p);
  return '<div class="p-card">' +
    '<a class="pimg" href="' + pLink(p) + '">' + tag + '<img src="' + catIcon(c) + '" alt="' + esc(pname(p)) + '"></a>' +
    '<a class="p-name" href="' + pLink(p) + '">' + esc(pname(p)) + '</a>' +
    '<div class="p-sku">' + esc(p.sku) + '</div>' +
    '<ul class="p-specs">' + specs.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join("") + '</ul>' +
    '<div class="p-foot">' +
      '<div class="p-price"><b>' + esc(t("askPrice")) + '</b><span>' + esc(t("askPriceHint")) + '</span></div>' +
      '<button class="p-qbtn" data-add="' + esc(p.sku) + '">' + ICON.quote.replace("<svg",'<svg style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2"') + esc(t("addQuote")) + '</button>' +
    '</div>' +
  '</div>';
}
function catCard(c){
  var n = c.items.length;
  return '<a class="cat-card" href="' + cLink(c) + '">' +
    '<div class="thumb"><img src="' + catIcon(c) + '" alt=""></div>' +
    '<b>' + esc(catName(c)) + '</b>' +
    '<span>' + esc(LANG==="zh" ? (n + " 個型號") : (n + " models")) + '</span>' +
    '<em>' + esc(t("viewDetail")) + ' →</em>' +
  '</a>';
}

/* =========================================================
   PAGES
   ========================================================= */
function pageTitle(){
  var suffix = " | " + (LANG==="zh" ? COMPANY.zh : COMPANY.en);
  var page = document.body.getAttribute("data-page");
  if(page === "home") return (LANG==="zh" ? "HELPYOU · 网络配件与测试工具一站式供应商" : "HELPYOU · One-Stop Network Accessories & Test Tools") ;
  if(page === "products") return (LANG==="zh" ? "产品中心" : "Products") + suffix;
  if(page === "category"){ var c = getCat(param("c")); return c ? catName(c) + suffix : (LANG==="zh"?"产品中心":"Products") + suffix; }
  if(page === "product"){ var p = getProduct(param("p")); return p ? pname(p) + " " + p.sku + suffix : (LANG==="zh"?"产品详情":"Product") + suffix; }
  if(page === "about") return (LANG==="zh" ? "关于我们" : "About Us") + suffix;
  if(page === "contact") return (LANG==="zh" ? "联系我们" : "Contact Us") + suffix;
  if(page === "support") return (LANG==="zh" ? "技术支持" : "Technical Support") + suffix;
  if(page === "quote") return (LANG==="zh" ? "我的询价篮" : "My Quote List") + suffix;
  return (LANG==="zh" ? COMPANY.zh : COMPANY.en);
}

function crumb(items){
  return '<div class="wrap crumb">' + items.map(function(it, i){
    return (i>0 ? '<span>/</span>' : '') + (it.href ? '<a href="' + it.href + '">' + esc(it.label) + '</a>' : '<span style="color:#1f2329">' + esc(it.label) + '</span>');
  }).join("") + '</div>';
}

/* ---------- HOME ---------- */
function pageHome(){
  var sfx = LANG==="en" ? "?lang=en" : "";
  var hot = ALL_PRODUCTS.slice().sort(function(a,b){ return (b.pop - a.pop) || (a.sku < b.sku ? -1 : 1); }).slice(0,10);
  var fresh = ALL_PRODUCTS.filter(function(p){ return p.tag === "新品" || p.tag === "New"; }).slice(0,5);
  if(fresh.length < 5) fresh = ALL_PRODUCTS.slice(0,5);
  var strip = [
    {i:ICON.shield, t:"strip1t", d:"strip1d"},
    {i:ICON.truck, t:"strip2t", d:"strip2d"},
    {i:ICON.cog, t:"strip3t", d:"strip3d"},
    {i:ICON.headset, t:"strip4t", d:"strip4d"}
  ].map(function(s){
    return '<div class="strip-item">' + s.i.replace("<svg",'<svg style="width:30px;height:30px;stroke:#0a5adb;fill:none;stroke-width:1.6"') +
      '<div><b>' + esc(t(s.t)) + '</b><span>' + esc(t(s.d)) + '</span></div></div>';
  }).join("");

  var values = [
    {i:ICON.box, t:"v1t", d:"v1d"},
    {i:ICON.truck, t:"v2t", d:"v2d"},
    {i:ICON.shield, t:"v3t", d:"v3d"},
    {i:ICON.headset, t:"v4t", d:"v4d"}
  ].map(function(v){
    return '<div class="value-card"><div class="vi">' + v.i.replace("<svg",'<svg viewBox="0 0 24 24" style="width:24px;height:24px;stroke:#0a5adb;fill:none;stroke-width:1.7"') + '</div>' +
      '<h4>' + esc(t(v.t)) + '</h4><p>' + esc(t(v.d)) + '</p></div>';
  }).join("");

  return '' +
  '<section class="hero">' +
    '<div class="hero-inner">' +
      '<div>' +
        '<h1>' + esc(t("hero.t1")) + '<br><em>' + esc(t("hero.t2")) + '</em></h1>' +
        '<p class="hero-sub">' + esc(t("hero.sub")) + '</p>' +
        '<div class="hero-tags"><span>' + esc(t("hero.tag1")) + '</span><span>' + esc(t("hero.tag2")) + '</span><span>' + esc(t("hero.tag3")) + '</span><span>' + esc(t("hero.tag4")) + '</span></div>' +
        '<div class="hero-btns">' +
          '<a class="btn btn-primary btn-lg" href="products.html' + sfx + '">' + esc(t("hero.btn1")) + '</a>' +
          '<a class="btn btn-outline-w btn-lg" href="contact.html' + sfx + '">' + esc(t("hero.btn2")) + '</a>' +
        '</div>' +
        '<div class="hero-stats">' +
          '<div><b>' + t("hero.s1v") + '</b><span>' + esc(t("hero.s1")) + '</span></div>' +
          '<div><b>' + t("hero.s2v") + '</b><span>' + esc(t("hero.s2")) + '</span></div>' +
          '<div><b>' + t("hero.s3v") + '</b><span>' + esc(t("hero.s3")) + '</span></div>' +
          '<div><b>' + t("hero.s4v") + '</b><span>' + esc(t("hero.s4")) + '</span></div>' +
        '</div>' +
      '</div>' +
      '<div class="hero-art"><img src="' + IMG + 'hero.svg" alt="">' +
        '<div class="hero-card"><b>' + esc(t("hero.card1")) + '</b><span>' + esc(t("hero.card2")) + '</span></div>' +
      '</div>' +
    '</div>' +
  '</section>' +

  '<div class="strip"><div class="strip-inner">' + strip + '</div></div>' +

  '<section class="section"><div class="wrap">' +
    '<div class="sec-head"><h2>' + esc(t("cat.title")) + '</h2><p>' + esc(t("cat.sub")) + '</p><a class="more" href="products.html' + sfx + '">' + esc(t("cat.more")) + ' →</a></div>' +
    '<div class="cat-grid">' + CATS.map(catCard).join("") + '</div>' +
  '</div></section>' +

  '<section class="section soft"><div class="wrap">' +
    '<div class="sec-head"><h2>' + esc(t("hot.title")) + '</h2><p>' + esc(t("hot.sub")) + '</p><a class="more" href="products.html' + sfx + '">' + esc(t("hot.more")) + ' →</a></div>' +
    '<div class="p-grid">' + hot.map(productCard).join("") + '</div>' +
  '</div></section>' +

  '<section class="section"><div class="wrap">' +
    '<div class="sec-head"><h2>' + esc(t("new.title")) + '</h2><p>' + esc(t("new.sub")) + '</p></div>' +
    '<div class="p-grid p-grid-4">' + fresh.map(productCard).join("") + '</div>' +
  '</div></section>' +

  '<section class="section soft"><div class="wrap">' +
    '<div class="tc"><h2 class="sec-title-lg">' + esc(t("brand.title")) + '</h2><p class="sec-sub">' + esc(t("brand.sub")) + '</p></div>' +
    '<div class="brand-row mt24">' + BRANDS.map(function(b){ return '<span class="brand-chip">' + esc(b) + '</span>'; }).join("") + '</div>' +
  '</div></section>' +

  '<section class="section"><div class="wrap">' +
    '<div class="tc"><h2 class="sec-title-lg">' + esc(t("value.title")) + '</h2><p class="sec-sub">' + esc(t("value.sub")) + '</p></div>' +
    '<div class="value-grid mt24">' + values + '</div>' +
  '</div></section>' +

  '<section class="section"><div class="wrap">' +
    '<div class="cta-band"><div><h3>' + esc(t("cta.t")) + '</h3><p>' + esc(t("cta.d")) + '</p></div>' +
      '<div class="btns"><a class="btn btn-primary btn-lg" href="contact.html' + sfx + '">' + esc(t("cta.b1")) + '</a>' +
      '<a class="btn btn-outline-w btn-lg" href="quote.html' + sfx + '">' + esc(t("nav.quote")) + '</a></div>' +
    '</div>' +
  '</div></section>';
}

/* ---------- PRODUCTS (all / search) ---------- */
function pageProducts(){
  var k = param("k");
  var sfx = LANG==="en" ? "?lang=en" : "";
  var head;
  if(k){
    var res = searchProducts(k);
    head = '<div class="page-head"><div class="wrap">' +
      '<h1>' + esc(tf("search.resultFor", {k:k})) + '</h1>' +
      '<p>' + esc(t("search.noResult")) + '</p></div></div>';
    var body = res.length ? '<div class="p-grid">' + res.map(productCard).join("") + '</div>'
      : '<div class="empty"><p>' + esc(t("search.noResult")) + '</p><a class="btn btn-blue mt16" href="products.html' + sfx + '">' + esc(t("products.all")) + '</a></div>';
    return head + '<div class="wrap section">' + crumb([{label:t("crumb.home"), href:"index.html"+sfx},{label:t("crumb.products"), href:"products.html"+sfx},{label:t("crumb.search")}]) + body + '</div>';
  }

  var groupsHtml = GROUPS.map(function(g){
    var cats = CATS.filter(function(c){ return c.group === g.slug; });
    var prods = [];
    cats.forEach(function(c){ prods = prods.concat(c.items); });
    prods = prods.sort(function(a,b){ return b.pop - a.pop; }).slice(0,5);
    return '<div class="mb24" style="padding-top:8px">' +
      '<div class="sec-head"><h2 style="font-size:19px">' + esc(groupName(g)) + '</h2>' +
        '<p>' + esc(cats.map(catName).join(" · ")) + '</p></div>' +
      '<div class="cat-grid" style="margin-bottom:16px">' + cats.map(catCard).join("") + '</div>' +
      '<div class="p-grid">' + prods.map(productCard).join("") + '</div>' +
    '</div>';
  }).join("");

  return '<div class="page-head"><div class="wrap">' +
      '<h1>' + esc(t("products.title")) + '</h1>' +
      '<p>' + esc(t("products.lead")) + '</p></div></div>' +
    '<div class="wrap section">' +
      crumb([{label:t("crumb.home"), href:"index.html"+sfx},{label:t("crumb.products")}]) +
      '<div class="toolbar"><span class="strong">' + esc(tf("toolbar.count", {n:ALL_PRODUCTS.length})) + '</span>' +
        '<span class="muted">' + esc(t("nav.slogan")) + '</span></div>' +
      groupsHtml +
    '</div>';
}

function searchProducts(k){
  var key = String(k).toLowerCase().trim();
  if(!key) return [];
  return ALL_PRODUCTS.filter(function(p){
    return (p.sku + " " + p.zh + " " + p.en + " " + p.catZh + " " + p.catEn + " " + p.sz.join(" ") + " " + p.se.join(" ")).toLowerCase().indexOf(key) > -1;
  });
}

/* ---------- CATEGORY ---------- */
function pageCategory(){
  var c = getCat(param("c")) || CATS[0];
  var sfx = LANG==="en" ? "?lang=en" : "";
  var prods = c.items.slice().sort(function(a,b){ return b.pop - a.pop; });
  var other = CATS.filter(function(x){ return x.group === c.group && x.slug !== c.slug; });
  var e = extra(c);

  var filters = '<div class="filter">' +
    '<h4>' + esc(t("filter.cat")) + '</h4>' +
    '<div class="filter-group">' + CATS.filter(function(x){ return x.group === c.group; }).map(function(x){
      return '<label><a href="' + cLink(x) + '" style="' + (x.slug===c.slug?"color:#0a5adb;font-weight:700":"") + '">' + esc(catName(x)) + '</a></label>';
    }).join("") + '</div>' +
    '<div class="filter-group"><span>' + esc(t("filter.brand")) + '</span>' +
      BRANDS.slice(0,8).map(function(b){ return '<label>' + esc(b) + '</label>'; }).join("") + '</div>' +
    '<div class="filter-group"><span>' + esc(t("filter.stock")) + '</span>' +
      '<label>' + esc(t("inStock")) + '</label><label>' + esc(t("leadTime")) + '</label></div>' +
    '<a class="btn btn-ghost btn-sm btn-block" href="contact.html' + sfx + '">' + esc(t("askPrice")) + '</a>' +
  '</div>';

  return '<div class="page-head"><div class="wrap">' +
      '<h1>' + esc(catName(c)) + '</h1><p>' + esc(catDesc(c)) + '</p></div></div>' +
    '<div class="wrap section">' +
      crumb([{label:t("crumb.home"), href:"index.html"+sfx},{label:t("crumb.products"), href:"products.html"+sfx},{label:catName(c)}]) +
      '<div class="cat-layout">' + filters +
        '<div>' +
          '<div class="toolbar"><span class="strong">' + esc(tf("toolbar.count", {n:prods.length})) + '</span>' +
            '<span class="muted small">' + esc(LANG==="zh"?"全部型號均為深圳倉現貨或 5-10 個工作日訂貨":"All models in Shenzhen stock or 5-10 business days") + '</span></div>' +
          '<div class="p-grid">' + prods.map(productCard).join("") + '</div>' +
          '<div class="mt32"><h3 style="font-size:16px;margin-bottom:12px">' + esc(t("pd.feat")) + '</h3>' +
            '<ul class="feat-list">' + (LANG==="zh"?e.f_zh:e.f_en).map(function(s){ return '<li>' + esc(s) + '</li>'; }).join("") + '</ul></div>' +
          '<div class="mt24"><h3 style="font-size:16px;margin-bottom:12px">' + esc(t("pd.app")) + '</h3>' +
            '<ul class="feat-list">' + (LANG==="zh"?e.a_zh:e.a_en).map(function(s){ return '<li>' + esc(s) + '</li>'; }).join("") + '</ul></div>' +
          (other.length ? '<div class="mt32"><h3 style="font-size:16px;margin-bottom:12px">' + esc(LANG==="zh"?"同系列其他分類":"More in this line") + '</h3>' +
            '<div class="cat-grid">' + other.map(catCard).join("") + '</div></div>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
}

/* ---------- PRODUCT DETAIL ---------- */
function pageProduct(){
  var p = getProduct(param("p")) || ALL_PRODUCTS[0];
  var c = getCat(p.cat);
  var e = extra(c);
  var sfx = LANG==="en" ? "?lang=en" : "";
  var rel = c.items.filter(function(x){ return x.sku !== p.sku; }).slice(0,5);
  var compat = "";
  if(c.group === "optical"){
    var list = BRANDS.slice(0,6).map(function(b){ return b + " — " + COMPAT_MAP[b]; });
    compat = '<tr><th>' + esc(t("pd.compat")) + '</th><td>' + list.map(esc).join("<br>") + '</td></tr>';
  }
  var feats = pspecs(p).concat(LANG==="zh"?e.f_zh:e.f_en);

  return '<div class="wrap section">' +
    crumb([{label:t("crumb.home"), href:"index.html"+sfx},{label:t("crumb.products"), href:"products.html"+sfx},{label:catName(c), href:cLink(c)},{label:p.sku}]) +
    '<div class="pd">' +
      '<div class="pd-gallery">' +
        '<div class="pd-main"><img src="' + catIcon(c) + '" alt="' + esc(pname(p)) + '"></div>' +
        '<div class="pd-thumbs">' +
          [0,1,2,3].map(function(i){ return '<div class="' + (i===0?"on":"") + '"><img src="' + catIcon(c) + '" alt=""></div>'; }).join("") +
        '</div>' +
        '<div class="mt16 small muted">' + esc(LANG==="zh"?"產品圖片為示意圖，實物以出貨為準。需要實拍圖請聯繫業務。":"Images are illustrative. Contact us for actual product photos.") + '</div>' +
      '</div>' +
      '<div>' +
        '<h1>' + esc(pname(p)) + '</h1>' +
        '<div class="pd-meta"><span>' + esc(t("pd.skuLabel")) + '：<b style="color:#1f2329">' + esc(p.sku) + '</b></span>' +
          '<span>' + esc(catName(c)) + '</span><span><b>●</b> ' + esc(t("inStock")) + '</span></div>' +
        '<div class="pd-tags">' + (p.tag?'<span>' + esc(LANG==="en" ? (TAG_MAP[p.tag]||p.tag) : p.tag) + '</span>':'') +
          '<span>' + esc(t("strip1t")) + '</span><span>' + esc(t("strip2t")) + '</span><span>' + esc(t("strip3t")) + '</span></div>' +
        '<div class="pd-box">' +
          '<div class="price-line"><span class="ask">' + esc(t("askPrice")) + '</span><span class="muted small">' + esc(t("askPriceHint")) + '</span></div>' +
          '<div class="row mt12">' +
            '<div class="qty"><button data-minus>−</button><input id="pqty" type="text" value="1"><button data-plus>+</button></div>' +
            '<button class="btn btn-primary" data-add="' + esc(p.sku) + '" data-qtyinput="pqty">' + esc(t("pd.add")) + '</button>' +
            '<a class="btn btn-blue" href="contact.html' + sfx + '">' + esc(t("pd.buy")) + '</a>' +
          '</div>' +
          '<div class="pd-contact"><span>' + ICON.phone.replace("<svg",'<svg style="width:14px;height:14px;stroke:#ff6a13;fill:none;stroke-width:2;vertical-align:-2px"') + ' ' + esc(t("pd.contactHint")) + '</span>' +
          '<span>' + ICON.clock.replace("<svg",'<svg style="width:14px;height:14px;stroke:#0a5adb;fill:none;stroke-width:2;vertical-align:-2px"') + ' ' + esc(t("leadHint")) + '</span></div>' +
        '</div>' +
        '<div class="tabs">' +
          '<button class="on" data-tab="desc">' + esc(t("pd.desc")) + '</button>' +
          '<button data-tab="spec">' + esc(t("pd.spec")) + '</button>' +
          '<button data-tab="feat">' + esc(t("pd.feat")) + '</button>' +
          '<button data-tab="app">' + esc(t("pd.app")) + '</button>' +
          '<button data-tab="ship">' + esc(t("pd.ship")) + '</button>' +
        '</div>' +
        '<div class="tab-panel on" id="tab-desc"><p class="content" style="font-size:14px;line-height:1.9">' +
            esc(LANG==="zh"
              ? (p.zh + "，屬於" + c.zh + "產品線，主要規格：" + p.sz.join("、") + "。產品出廠前完成逐項檢測，適合" + e.a_zh[0] + "等場景使用，可根據項目需求提供長度、標籤、包裝與碼片寫入等訂製服務。")
              : (p.en + ", part of the " + c.en + " line. Key specs: " + p.se.join(", ") + ". Every unit is factory tested and suited for " + e.a_en[0] + " and similar scenarios. Custom length, labeling, packaging and coding are available on request.")
            ) + '</p>' +
            '<p class="content mt12" style="font-size:14px;line-height:1.9">' + esc(catDesc(c)) + '</p>' +
        '</div>' +
        '<div class="tab-panel" id="tab-spec"><table class="spec-table">' +
          '<tr><th>' + esc(t("pd.skuLabel")) + '</th><td>' + esc(p.sku) + '</td></tr>' +
          '<tr><th>' + esc(t("filter.cat")) + '</th><td>' + esc(catName(c)) + '</td></tr>' +
          '<tr><th>' + esc(t("pd.brand")) + '</th><td>' + esc(LANG==="zh"?COMPANY.short_zh:COMPANY.short_en) + '</td></tr>' +
          '<tr><th>' + esc(t("leadTime")) + '</th><td>' + esc(LANG==="zh"?"深圳倉現貨，48 小時內發出":"Shenzhen stock, ships within 48h") + '</td></tr>' +
          '<tr><th>' + esc(t("moq")) + '</th><td>1 ' + esc(t("pcs")) + '</td></tr>' +
          '<tr><th>' + esc(t("pd.warranty")) + '</th><td>' + esc(LANG==="zh"?"1 年（非人為損壞 7 天包換）":"1 year (7-day replacement for non-human damage)") + '</td></tr>' +
          '<tr><th>' + esc(LANG==="zh"?"產地 / Origin":"Origin") + '</th><td>' + esc(LANG==="zh"?"中國深圳 / Shenzhen, China":"Shenzhen, China") + '</td></tr>' +
          '<tr><th>' + esc(t("pd.ship")) + '</th><td>' + esc(LANG==="zh"?"靜電袋 + 泡棉 + 紙箱，可中性包裝":"ESD bag + foam + carton, neutral packing available") + '</td></tr>' +
          compat +
        '</table></div>' +
        '<div class="tab-panel" id="tab-feat"><ul class="feat-list">' + feats.map(function(s){ return '<li>' + esc(s) + '</li>'; }).join("") + '</ul></div>' +
        '<div class="tab-panel" id="tab-app"><ul class="feat-list">' + (LANG==="zh"?e.a_zh:e.a_en).map(function(s){ return '<li>' + esc(s) + '</li>'; }).join("") + '</ul></div>' +
        '<div class="tab-panel" id="tab-ship"><ul class="feat-list">' +
          (LANG==="zh"
            ? ['<li>現貨型號 12:00 前下單當日發出，常規訂單 48 小時內發出</li>','<li>非標型號 5-10 個工作日，加急可協調產線插單</li>','<li>支援順豐 / 德邦 / 指定物流，出口可做中性包裝</li>','<li>批量訂單可申請階梯價格與增值稅專用發票</li>','<li>包裝：靜電袋 + 泡棉 + 五層紙箱，運輸損壞由我們承擔</li>']
            : ['<li>In-stock SKUs ordered before 12:00 ship the same day; standard orders within 48h</li>','<li>Non-standard models 5-10 business days; rush scheduling available</li>','<li>SF Express / Deppon / nominated forwarder; neutral export packing available</li>','<li>Tiered pricing and VAT invoices for volume orders</li>','<li>ESD bag + foam + 5-ply carton; transit damage covered by us</li>']
          ).join("") + '</ul></div>' +
      '</div>' +
    '</div>' +
    '<div class="mt48"><div class="sec-head"><h2>' + esc(t("pd.rel")) + '</h2><a class="more" href="' + cLink(c) + '">' + esc(t("more")) + ' →</a></div>' +
      '<div class="p-grid">' + rel.map(productCard).join("") + '</div></div>' +
  '</div>';
}

/* ---------- ABOUT ---------- */
function pageAbout(){
  return '<div class="page-head"><div class="wrap"><h1>' + esc(t("about.title")) + '</h1><p>' + esc(t("about.lead")) + '</p></div></div>' +
  '<div class="wrap section">' +
    '<div class="content-grid">' +
      '<div class="content">' +
        '<h2>' + esc(LANG==="zh"?COMPANY.zh:COMPANY.en) + '</h2>' +
        '<p>' + esc(t("about.p1")) + '</p>' +
        '<p>' + esc(t("about.p2")) + '</p>' +
        '<p>' + esc(t("about.p3")) + '</p>' +
        '<div class="row mt16" style="gap:10px;flex-wrap:wrap">' +
          '<a class="btn btn-blue" href="contact.html' + (LANG==="en"?"?lang=en":"") + '">' + esc(t("nav.contact")) + '</a>' +
          '<a class="btn btn-ghost" href="products.html' + (LANG==="en"?"?lang=en":"") + '">' + esc(t("products.title")) + '</a>' +
        '</div>' +
      '</div>' +
      '<div><img src="' + IMG + 'about.svg" alt=""></div>' +
    '</div>' +
    '<div class="value-grid mt48">' +
      [["about.v1","about.v1v"],["about.v2","about.v2v"],["about.v3","about.v3v"],["about.v4","about.v4v"]].map(function(v){
        return '<div class="value-card tc"><div style="font-size:30px;font-weight:700;color:#0a5adb">' + esc(t(v[1])) + '</div><div class="muted mt8">' + esc(t(v[0])) + '</div></div>';
      }).join("") +
    '</div>' +
    '<div class="content-grid mt48">' +
      '<div><h2>' + esc(t("about.h1")) + '</h2>' +
        '<div class="value-grid" style="grid-template-columns:1fr 1fr;gap:12px;margin-top:14px">' +
          [["v1t","v1d"],["v3t","v3d"],["v2t","v2d"],["v4t","v4d"]].map(function(v){
            return '<div class="value-card" style="padding:16px"><h4 style="font-size:14px">' + esc(t(v[0])) + '</h4><p style="font-size:12.5px">' + esc(t(v[1])) + '</p></div>';
          }).join("") +
        '</div>' +
      '</div>' +
      '<div><h2>' + esc(t("about.h2")) + '</h2>' +
        '<ul class="timeline">' +
          [["tl1t","tl1d"],["tl2t","tl2d"],["tl3t","tl3d"],["tl4t","tl4d"]].map(function(v){
            return '<li><b>' + esc(t(v[0])) + '</b><span>' + esc(t(v[1])) + '</span></li>';
          }).join("") +
        '</ul>' +
      '</div>' +
    '</div>' +
  '</div>';
}

/* ---------- SUPPORT ---------- */
function pageSupport(){
  var svcs = [["s1t","s1d"],["s2t","s2d"],["s3t","s3d"],["s4t","s4d"],["s5t","s5d"],["s6t","s6d"]].map(function(s){
    return '<div class="svc-card"><div class="ic">' + ICON.cog.replace("<svg",'<svg viewBox="0 0 24 24" style="width:22px;height:22px;stroke:#ff6a13;fill:none;stroke-width:1.7"') + '</div>' +
      '<h4>' + esc(t(s[0])) + '</h4><p>' + esc(t(s[1])) + '</p></div>';
  }).join("");
  var faqs = [1,2,3,4,5,6].map(function(i){
    return '<div class="faq-item"><div class="faq-q">' + esc(t("faq"+i+"q")) + '</div><div class="faq-a">' + esc(t("faq"+i+"a")) + '</div></div>';
  }).join("");
  return '<div class="page-head"><div class="wrap"><h1>' + esc(t("support.title")) + '</h1><p>' + esc(t("support.lead")) + '</p></div></div>' +
    '<div class="wrap section">' +
      '<div class="svc-grid">' + svcs + '</div>' +
      '<div class="mt48"><h2 style="font-size:20px;margin-bottom:14px">' + esc(t("faq.title")) + '</h2><div class="faq">' + faqs + '</div></div>' +
      '<div class="mt32"><div class="cta-band"><div><h3>' + esc(t("cta.t")) + '</h3><p>' + esc(t("cta.d")) + '</p></div>' +
        '<div class="btns"><a class="btn btn-primary btn-lg" href="contact.html' + (LANG==="en"?"?lang=en":"") + '">' + esc(t("cta.b1")) + '</a></div></div></div>' +
    '</div>';
}

/* ---------- CONTACT ---------- */
function pageContact(){
  var sfx = LANG==="en" ? "?lang=en" : "";
  var info = '<div class="info-card">' +
    '<ul class="info-list">' +
      '<li><div class="ic">' + ICON.user.replace("<svg",'<svg viewBox="0 0 24 24"') + '</div><div><b>' + esc(t("contact.name")) + '</b><span>' + esc(COMPANY.contact) + '</span></div></li>' +
      '<li><div class="ic">' + ICON.phone.replace("<svg",'<svg viewBox="0 0 24 24"') + '</div><div><b>' + esc(t("contact.phone")) + '</b><span style="font-size:19px;color:#ff6a13">' + COMPANY.phone + '</span><p>' + esc(LANG==="zh"?"微信同號，可直接添加":"Same number on WeChat") + '</p></div></li>' +
      '<li><div class="ic">' + ICON.mail.replace("<svg",'<svg viewBox="0 0 24 24"') + '</div><div><b>' + esc(t("contact.mail")) + '</b><span>' + esc(COMPANY.email) + '</span></div></li>' +
      '<li><div class="ic">' + ICON.pin.replace("<svg",'<svg viewBox="0 0 24 24"') + '</div><div><b>' + esc(t("contact.addr")) + '</b><span style="font-weight:400;font-size:13.5px">' + esc(LANG==="zh"?COMPANY.addr_zh:COMPANY.addr_en) + '</span></div></li>' +
      '<li><div class="ic">' + ICON.clock.replace("<svg",'<svg viewBox="0 0 24 24"') + '</div><div><b>' + esc(t("contact.hours")) + '</b><span style="font-weight:400;font-size:13.5px">' + esc(LANG==="zh"?COMPANY.hours_zh:COMPANY.hours_en) + '</span></div></li>' +
      '<li><div class="ic">' + ICON.wx.replace("<svg",'<svg viewBox="0 0 24 24"') + '</div><div><b>' + esc(t("foot.wx")) + '</b>' +
        '<div class="wx-box"><div class="qr"><img src="' + IMG + 'wechat-qr.png" alt=""></div><span class="small">' + esc(t("foot.wx2")) + '</span></div></div></li>' +
    '</ul></div>';

  var needs = LANG==="zh" ? ["產品採購","批量報價","項目方案","OEM/訂製","技術諮詢","其他"] : ["Product purchase","Volume quote","Project BOM","OEM / Custom","Technical advice","Other"];
  var form = '<div class="form-card"><h3 style="font-size:17px;margin-bottom:16px">' + esc(t("contact.form")) + '</h3>' +
    '<div class="form-row"><label>' + esc(t("contact.fname")) + ' *</label><input id="cf-name"></div>' +
    '<div class="form-row"><label>' + esc(t("contact.fcompany")) + '</label><input id="cf-company"></div>' +
    '<div class="form-row"><label>' + esc(t("contact.fphone")) + ' *</label><input id="cf-phone"></div>' +
    '<div class="form-row"><label>' + esc(t("contact.fmail")) + '</label><input id="cf-mail"></div>' +
    '<div class="form-row"><label>' + esc(t("contact.fneed")) + '</label><select id="cf-need">' + needs.map(function(n){ return '<option>' + esc(n) + '</option>'; }).join("") + '</select></div>' +
    '<div class="form-row"><label>' + esc(t("contact.fmsg")) + '</label><textarea id="cf-msg"></textarea></div>' +
    '<button class="btn btn-primary btn-block" id="cf-submit">' + esc(t("contact.submit")) + '</button>' +
    '<p class="form-note">' + esc(t("contact.note")) + '</p></div>';

  return '<div class="page-head"><div class="wrap"><h1>' + esc(t("contact.title")) + '</h1><p>' + esc(t("contact.lead")) + '</p></div></div>' +
    '<div class="wrap section">' + crumb([{label:t("crumb.home"), href:"index.html"+sfx},{label:t("crumb.contact")}]) +
      '<div class="contact-grid">' + info + form + '</div>' +
    '</div>';
}

/* ---------- QUOTE ---------- */
function pageQuote(){
  var sfx = LANG==="en" ? "?lang=en" : "";
  return '<div class="page-head"><div class="wrap"><h1>' + esc(t("quote.title")) + '</h1><p>' + esc(t("quote.sub")) + '</p></div></div>' +
    '<div class="wrap section">' + crumb([{label:t("crumb.home"), href:"index.html"+sfx},{label:t("crumb.quote")}]) +
      '<div id="quoteList"></div>' +
    '</div>';
}

function renderQuotePage(){
  var box = qs("#quoteList");
  if(!box) return;
  var items = getQuote();
  var sfx = LANG==="en" ? "?lang=en" : "";
  if(!items.length){
    box.innerHTML = '<div class="empty">' + ICON.quote.replace("<svg",'<svg viewBox="0 0 24 24"') +
      '<p>' + esc(t("quote.empty")) + '</p><p class="small mt8">' + esc(t("quote.emptySub")) + '</p>' +
      '<a class="btn btn-blue mt16" href="products.html' + sfx + '">' + esc(t("quote.goShop")) + '</a></div>';
    return;
  }
  var rows = items.map(function(it){
    var p = getProduct(it.sku); if(!p) return "";
    var c = getCat(p.cat);
    return '<div class="quote-item">' +
      '<div class="qimg"><img src="' + catIcon(c) + '" alt=""></div>' +
      '<div class="qi"><b>' + esc(pname(p)) + '</b><span>' + esc(p.sku) + ' · ' + esc(catName(c)) + '</span></div>' +
      '<input type="number" min="1" value="' + it.qty + '" data-qsku2="' + esc(p.sku) + '">' +
      '<span class="muted small">' + esc(t("pcs")) + '</span>' +
      '<button class="del" data-delsku="' + esc(p.sku) + '">&times;</button>' +
    '</div>';
  }).join("");

  box.innerHTML = '<div style="display:grid;grid-template-columns:1fr 380px;gap:22px;align-items:start">' +
    '<div>' + rows +
      '<div class="row mt16"><button class="btn btn-ghost btn-sm" id="qClear">' + esc(t("quote.clear")) + '</button>' +
      '<a class="btn btn-ghost btn-sm" href="products.html' + sfx + '">' + esc(t("quote.goShop")) + '</a></div>' +
    '</div>' +
    '<div class="quote-sum">' +
      '<div class="row" style="justify-content:space-between"><span class="muted">' + esc(t("quote.total")) + '</span><b style="font-size:18px">' + items.length + '</b></div>' +
      '<div class="row mt12" style="justify-content:space-between"><span class="muted">' + esc(t("quote.qty")) + '</span><b style="font-size:18px;color:#ff6a13">' + quoteCount() + '</b></div>' +
      '<hr style="border:0;border-top:1px solid #e3e6ea;margin:16px 0">' +
      '<div class="form-row"><label>' + esc(t("quote.name")) + '</label><input id="qf-name"></div>' +
      '<div class="form-row"><label>' + esc(t("quote.company")) + '</label><input id="qf-company"></div>' +
      '<div class="form-row"><label>' + esc(t("quote.phone")) + '</label><input id="qf-phone"></div>' +
      '<div class="form-row"><label>' + esc(t("quote.note")) + '</label><textarea id="qf-note" style="min-height:70px"></textarea></div>' +
      '<button class="btn btn-primary btn-block" id="qf-submit">' + esc(t("quote.submit")) + '</button>' +
      '<button class="btn btn-ghost btn-block mt8" id="qf-copy">' + esc(t("quote.copy")) + '</button>' +
      '<p class="form-note">' + esc(t("pd.contactHint")) + '</p>' +
    '</div></div>';

  var cl = qs("#qClear"); if(cl) cl.addEventListener("click", function(){ clearQuote(); });
  var cp = qs("#qf-copy"); if(cp) cp.addEventListener("click", copyQuote);
  var sb = qs("#qf-submit"); if(sb) sb.addEventListener("click", submitQuote);
}

function quoteText(){
  var items = getQuote();
  var name = (qs("#qf-name")||{}).value || "";
  var comp = (qs("#qf-company")||{}).value || "";
  var phone = (qs("#qf-phone")||{}).value || "";
  var note = (qs("#qf-note")||{}).value || "";
  var lines = [];
  lines.push(LANG==="zh" ? "【詢價清單】Helpyou Group Co., Ltd." : "[Quote Request] HELPYOU GROUP CO., LTD.");
  lines.push((LANG==="zh"?"聯繫人：":"Contact: ") + name + (comp ? " / " + comp : "") + (phone ? " / " + phone : ""));
  lines.push("----------------------------------");
  items.forEach(function(it, i){
    var p = getProduct(it.sku);
    if(!p) return;
    lines.push((i+1) + ". " + p.sku + "  " + pname(p) + "  x" + it.qty);
  });
  if(note) lines.push("----------------------------------\n" + (LANG==="zh"?"備註：":"Notes: ") + note);
  return lines.join("\n");
}
function copyQuote(){
  var txt = quoteText();
  try{
    if(navigator.clipboard && navigator.clipboard.writeText){ navigator.clipboard.writeText(txt); }
    else{
      var ta = document.createElement("textarea"); ta.value = txt; document.body.appendChild(ta); ta.select();
      document.execCommand("copy"); document.body.removeChild(ta);
    }
  }catch(e){}
  toast(t("quote.ok"));
}
function submitQuote(){
  var phone = (qs("#qf-phone")||{}).value || "";
  var name = (qs("#qf-name")||{}).value || "";
  if(!name.trim()){ toast(t("reqName")); return; }
  if(!phone.trim()){ toast(t("reqPhone")); return; }
  copyQuote();
  toast(LANG==="zh" ? "已生成詢價單，請發送給我們或致電 " + COMPANY.phone : "Quote generated — send it to us or call " + COMPANY.phone);
}

/* =========================================================
   SEARCH
   ========================================================= */
function bindSearch(){
  var input = qs("#q"), btn = qs("#qbtn"), sug = qs("#suggest");
  if(!input) return;
  function go(){
    var v = input.value.trim();
    if(!v) return;
    location.href = "products.html?k=" + encodeURIComponent(v) + (LANG==="en" ? "&lang=en" : "");
  }
  btn && btn.addEventListener("click", go);
  input.addEventListener("keydown", function(e){ if(e.key === "Enter") go(); });
  input.addEventListener("input", function(){
    var v = input.value.trim().toLowerCase();
    if(!v){ sug.style.display = "none"; return; }
    var res = searchProducts(v).slice(0,8);
    if(!res.length){ sug.style.display = "none"; return; }
    sug.innerHTML = res.map(function(p){
      var c = getCat(p.cat);
      return '<a href="' + pLink(p) + '"><img src="' + catIcon(c) + '" alt=""><div><div style="font-size:13px;font-weight:600">' + esc(pname(p)) + '</div><div class="small muted">' + esc(p.sku) + '</div></div></a>';
    }).join("");
    sug.style.display = "block";
  });
  document.addEventListener("click", function(){ if(sug) sug.style.display = "none"; });
}

/* =========================================================
   RENDER ALL
   ========================================================= */
function renderPage(){
  var main = qs("#main");
  var page = document.body.getAttribute("data-page");
  var html = "";
  if(page === "home") html = pageHome();
  else if(page === "products") html = pageProducts();
  else if(page === "category") html = pageCategory();
  else if(page === "product") html = pageProduct();
  else if(page === "about") html = pageAbout();
  else if(page === "support") html = pageSupport();
  else if(page === "contact") html = pageContact();
  else if(page === "quote") html = pageQuote();
  main.innerHTML = html;
  if(page === "quote") renderQuotePage();
  bindTabs();
  bindFaq();
  if(page === "contact") bindContactForm();
  if(page === "product") bindQty();
}
function bindTabs(){
  qsa(".tabs button").forEach(function(b){
    b.addEventListener("click", function(){
      qsa(".tabs button").forEach(function(x){ x.classList.remove("on"); });
      qsa(".tab-panel").forEach(function(x){ x.classList.remove("on"); });
      b.classList.add("on");
      var p = qs("#tab-" + b.getAttribute("data-tab"));
      if(p) p.classList.add("on");
    });
  });
}
function bindFaq(){
  qsa(".faq-q").forEach(function(q){
    q.addEventListener("click", function(){ q.parentNode.classList.toggle("open"); });
  });
}
function bindQty(){
  var input = qs("#pqty");
  if(!input) return;
  var minus = qs("[data-minus]"), plus = qs("[data-plus]");
  if(minus) minus.addEventListener("click", function(){ input.value = Math.max(1, (parseInt(input.value,10)||1) - 1); });
  if(plus) plus.addEventListener("click", function(){ input.value = (parseInt(input.value,10)||1) + 1; });
}
function bindContactForm(){
  var b = qs("#cf-submit");
  if(!b) return;
  b.addEventListener("click", function(){
    var name = (qs("#cf-name")||{}).value || "";
    var phone = (qs("#cf-phone")||{}).value || "";
    if(!name.trim()){ toast(t("reqName")); return; }
    if(!phone.trim()){ toast(t("reqPhone")); return; }
    toast(t("contact.ok"));
  });
}
function renderAll(){
  renderTopbar();
  renderHeader();
  renderNav();
  renderPage();
  renderFooter();
  renderDrawer();
  updateQuoteBadge();
  document.documentElement.lang = LANG === "zh" ? "zh-Hant" : "en";
  document.title = pageTitle();
}

/* ---------------- Global events ---------------- */
document.addEventListener("click", function(e){
  var el = e.target.closest ? e.target.closest("[data-add],[data-delsku],[data-lang],[data-page-link]") : null;
  if(!el) return;
  if(el.hasAttribute("data-add")){
    e.preventDefault();
    var sku = el.getAttribute("data-add");
    var qty = 1;
    var qi = el.getAttribute("data-qtyinput");
    if(qi){ var box = qs("#" + qi); if(box) qty = Math.max(1, parseInt(box.value,10) || 1); }
    addToQuote(sku, qty);
    if(el.classList.contains("p-qbtn")){
      el.classList.add("added");
      el.innerHTML = "✓ " + esc(t("added"));
      var btn = el;
      setTimeout(function(){
        btn.classList.remove("added");
        btn.innerHTML = ICON.quote.replace("<svg",'<svg style="width:13px;height:13px;stroke:currentColor;fill:none;stroke-width:2"') + esc(t("addQuote"));
      }, 1600);
    }
    renderDrawer();
    openDrawer();
    return;
  }
  if(el.hasAttribute("data-delsku")){ e.preventDefault(); removeQuote(el.getAttribute("data-delsku")); return; }
  if(el.hasAttribute("data-lang")){ e.preventDefault(); setLang(el.getAttribute("data-lang")); return; }
});

document.addEventListener("change", function(e){
  var el = e.target;
  if(el.hasAttribute && el.hasAttribute("data-qsku")){ setQuoteQty(el.getAttribute("data-qsku"), el.value); }
  if(el.hasAttribute && el.hasAttribute("data-qsku2")){ setQuoteQty(el.getAttribute("data-qsku2"), el.value); }
});

document.addEventListener("DOMContentLoaded", function(){
  detectLang();
  // single global handler: close mega menu on outside click
  document.addEventListener("click", function(){
    var mg = qs("#mega"); if(mg) mg.classList.remove("open");
  });
  // page shell
  var body = document.body;
  if(!qs("#main")){
    var m = document.createElement("main"); m.id = "main"; body.appendChild(m);
  }
  var order = ["topbar","header","navbar"];
  order.forEach(function(id){
    if(!qs("#"+id)){ var d = document.createElement("div"); d.id = id; body.insertBefore(d, qs("#main")); }
  });
  if(!qs("#footer")){ var f = document.createElement("div"); f.id = "footer"; body.appendChild(f); }
  var mask = document.createElement("div"); mask.id = "mask"; mask.className = "drawer-mask";
  body.appendChild(mask);
  mask.addEventListener("click", closeDrawer);
  var drawer = document.createElement("div"); drawer.id = "drawer"; body.appendChild(drawer);
  var toTop = document.createElement("a"); toTop.className = "totop"; toTop.href = "#top";
  toTop.innerHTML = ICON.up.replace("<svg",'<svg viewBox="0 0 24 24"');
  toTop.addEventListener("click", function(e){ e.preventDefault(); window.scrollTo({top:0, behavior:"smooth"}); });
  body.appendChild(toTop);
  var toastEl = document.createElement("div"); toastEl.id = "toast"; toastEl.className = "toast"; body.appendChild(toastEl);

  renderAll();

  // open drawer when quote icon clicked
  var qa = qs('.h-action[href^="quote.html"]');
  if(qa) qa.addEventListener("click", function(e){
    // keep navigation
  });
});
