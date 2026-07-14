// ─── Homepage markup — ported from the approved design-preview/index.html ───
// Static hero/cases/calculator/reviews/footer HTML (unchanged, pixel-perfect
// same as the approved design) + a dynamic gallery section built from DB rows.
// Rendered via dangerouslySetInnerHTML in HomeView.jsx (server-rendered, so
// content is in the initial HTML — good for SEO), interactivity wired in a
// useEffect that mirrors the original <script> block.

function esc(s) {
  return String(s || "").replace(/[&<>"']/g, (c) => (
    { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]
  ));
}

// homeUrl="/" -> homepage ke "Humara Kaam" section (Solutions/Bachat/Contact anchors kaam karte hain);
// homeUrl!="/" (jaise /gallery pe) -> nav "Solutions/Bachat/Contact" homepage ("/#solutions" etc) pe le jaate hain.
export function buildNavHtml({ logoUrl, phone1Digits, phone1 }, onHome = true) {
  const p = onHome ? "" : "/";
  return `
<div class="top">
  <div class="in">
    <a href="/" style="text-decoration:none"><div class="logo"><span class="dot"><img src="${logoUrl}" alt="Indian Solar Light Centre logo"></span> Indian Solar <span style="color:var(--sun)">Light Centre</span></div></a>
    <div class="navlinks">
      <a href="${p}#solutions">Solutions</a>
      <a href="${p}#calc">Bachat</a>
      <a href="/gallery">📸 Gallery</a>
      <a href="${p}#contact">Contact</a>
    </div>
    <div class="topcall">
      <a class="btn btn-ghost btn-sm" href="tel:${phone1Digits}">📞 ${esc(phone1.replace("+91 ", ""))}</a>
      <a class="btn btn-sun btn-sm" href="${p}#calc">Bachat dekho ⚡</a>
    </div>
  </div>
</div>`;
}

function imageCard(it) {
  const cap = esc(it.caption);
  return `<div class="shot rv"><img src="${esc(it.url)}" alt="${cap}"><span class="cap">${cap}</span></div>`;
}

function videoCard(it) {
  const cap = esc(it.caption);
  const poster = it.poster ? ` poster="${esc(it.poster)}"` : "";
  return `<div class="shot rv"><video src="${esc(it.url)}"${poster} controls preload="none" playsinline></video><span class="cap">${cap}</span></div>`;
}

// items ko Photos aur Videos — do ALAG sections me dikhata hai.
// full=false (homepage teaser) -> har section max 3 + "puri gallery" link.
// full=true (/gallery page) -> sab kuch, koi limit nahi.
export function buildGalleryHtml(items, phone, { full = false } = {}) {
  const all = items || [];
  const photos = all.filter((it) => it.media_type !== "video");
  const videos = all.filter((it) => it.media_type === "video");
  const showPhotos = full ? photos : photos.slice(0, 3);
  const showVideos = full ? videos : videos.slice(0, 3);

  const cta = `<div class="shot rv">😄 Agla install aapka?<span class="cap">📞 ${esc(phone)} — call karo</span></div>`;
  const seeAll = full ? "" : `<p class="sub" style="margin-top:6px"><a href="/gallery" style="color:var(--fire);font-weight:800;text-decoration:none">📸 Puri gallery dekho — sab photos aur videos →</a></p>`;

  const photoSection = showPhotos.length ? `
    <h3 style="font-size:1.1rem;font-weight:800;margin:0 0 14px">🖼️ Photos</h3>
    <div class="grid">
      ${showPhotos.map(imageCard).join("")}${full ? "" : cta}
    </div>` : "";

  const videoSection = showVideos.length ? `
    <h3 style="font-size:1.1rem;font-weight:800;margin:34px 0 14px">🎥 Videos</h3>
    <div class="grid">
      ${showVideos.map(videoCard).join("")}
    </div>` : "";

  return `
<section class="shots" id="work">
  <div class="wrap">
    <span class="tag">📸 Humara Kaam</span>
    <h2 class="sec">Baatein nahi — chhat pe chadh ke dekho! 👷</h2>
    <p class="sub">Asli jagah, asli photos, asli kaam — koi stock image nahi. Sab hamare apne installs.</p>
    ${photoSection}
    ${videoSection}
    ${seeAll}
  </div>
</section>`;
}

// Standalone /gallery page: nav + header + FULL grid (sab items) + footer.
export function buildGalleryPageHtml(items, common) {
  return `
${buildNavHtml(common, false)}
<header style="background:linear-gradient(180deg,var(--night) 0%,var(--deep) 100%);padding:150px 0 60px;color:#fff;text-align:center">
  <div class="wrap">
    <span class="tag" style="background:#fff1d6">📸 Humara Kaam</span>
    <h1 class="sec" style="color:#fff">Puri Gallery — Har Install Yahan</h1>
    <p class="sub" style="color:#cfe2ff;margin:0 auto">Asli photos aur videos, seedhe hamare kaam se — koi stock image nahi.</p>
  </div>
</header>
${buildGalleryHtml(items, common.phone1, { full: true })}
${buildBottomHtml(common)}`;
}

export function buildTopHtml(common) {
  const { phone1Digits, whatsappMsg } = common;
  const waHref = `https://wa.me/${phone1Digits}?text=${encodeURIComponent(whatsappMsg)}`;
  return `
${buildNavHtml(common, true)}

<div class="powerzone" id="powerzone">
<svg id="trunk" class="trunk" xmlns="http://www.w3.org/2000/svg"><path class="tbase"/><path class="tlive"/></svg>

<header class="hero">
  <div class="stars" id="stars"></div>
  <div class="wrap">
    <div>
      <span class="h-badge"><span class="pulse"></span> Azamgarh me 10+ saal se roshni failate hue</span>
      <h1>Bijli ka bill?<br><span class="y">Ab suraj bharega!</span></h1>
      <p class="lead">Dukaan, khet, ghar, school, hospital — jahan bolo wahan solar. Sarkari subsidy ke saath, fitting se guarantee tak — sab hum sambhalte hain.</p>
      <div class="ctas">
        <a class="btn btn-sun" href="tel:${phone1Digits}">📞 Abhi call karo</a>
        <a class="btn btn-wa" href="${waHref}">💬 WhatsApp karo</a>
      </div>
      <div class="trustline">
        <div><b>500+</b><span>installs</span></div>
        <div><b>80%</b><span>tak bill me bachat</span></div>
        <div><b>25 saal</b><span>panel ki umar</span></div>
        <div><b>⭐ 4.8</b><span>Google rating</span></div>
      </div>
    </div>
    <div class="visual">
      <svg class="sunreal" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="sCore" cx="42%" cy="40%">
            <stop offset="0%" stop-color="#fffdf2"/><stop offset="28%" stop-color="#fff3b8"/>
            <stop offset="58%" stop-color="#ffcf4d"/><stop offset="85%" stop-color="#ffa22e"/>
            <stop offset="100%" stop-color="#ff8a3d"/>
          </radialGradient>
          <radialGradient id="sCorona">
            <stop offset="0%" stop-color="#ffd75e" stop-opacity=".55"/>
            <stop offset="60%" stop-color="#ffb628" stop-opacity=".22"/>
            <stop offset="100%" stop-color="#ffb628" stop-opacity="0"/>
          </radialGradient>
          <filter id="boil" x="-30%" y="-30%" width="160%" height="160%">
            <feTurbulence type="fractalNoise" baseFrequency="0.055" numOctaves="3" result="n">
              <animate attributeName="baseFrequency" values="0.055;0.07;0.055" dur="9s" repeatCount="indefinite"/>
            </feTurbulence>
            <feDisplacementMap in="SourceGraphic" in2="n" scale="5"/>
          </filter>
          <filter id="soft"><feGaussianBlur stdDeviation="1.4"/></filter>
        </defs>
        <circle class="cor" cx="150" cy="150" r="145" fill="url(#sCorona)"/>
        <circle cx="150" cy="150" r="80" fill="url(#sCore)" filter="url(#boil)"/>
        <circle cx="150" cy="150" r="77" fill="url(#sCore)" filter="url(#soft)" opacity=".85"/>
        <circle cx="128" cy="126" r="30" fill="#fffdf2" opacity=".5" filter="url(#soft)"/>
      </svg>
      <div class="panel3d"><svg viewBox="0 0 440 240" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="pv" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#0e3a75"/><stop offset="55%" stop-color="#1c5fae"/><stop offset="100%" stop-color="#2f7fd4"/>
          </linearGradient>
        </defs>
        <ellipse cx="215" cy="220" rx="185" ry="13" fill="rgba(4,20,45,.35)"/>
        <g stroke="#8ea6c4" stroke-width="8" stroke-linecap="round">
          <line x1="335" y1="138" x2="330" y2="208"/><line x1="396" y1="112" x2="400" y2="208"/>
        </g>
        <polygon points="248,118 352,76 418,100 316,144" fill="#dbe6f4"/>
        <polygon points="258,117 350,82 406,102 314,138" fill="url(#pv)" opacity=".92"/>
        <g stroke="rgba(255,255,255,.3)" stroke-width="1.6">
          <line x1="289" y1="105" x2="345" y2="126"/><line x1="320" y1="93" x2="376" y2="114"/>
          <line x1="276" y1="124" x2="368" y2="89"/>
        </g>
        <g stroke="#8ea6c4" stroke-width="9" stroke-linecap="round">
          <line x1="105" y1="160" x2="92" y2="212"/><line x1="228" y1="112" x2="240" y2="212"/>
        </g>
        <polygon points="28,142 202,68 306,106 132,184" fill="#dbe6f4"/>
        <polygon points="42,139 200,76 290,108 130,174" fill="url(#pv)"/>
        <g stroke="rgba(255,255,255,.32)" stroke-width="2">
          <line x1="81" y1="124" x2="168" y2="155"/>
          <line x1="121" y1="108" x2="207" y2="139"/>
          <line x1="160" y1="92" x2="247" y2="124"/>
          <line x1="70" y1="149" x2="227" y2="89"/>
          <line x1="99" y1="160" x2="256" y2="99"/>
        </g>
        <polygon class="glint" points="96,116 148,94 170,102 118,124" fill="#ffffff" opacity=".4"/>
        <rect x="140" y="176" width="26" height="16" rx="4" fill="#0a1c38" stroke="#35558a" stroke-width="2"/>
        <path d="M153,192 V212 H215" fill="none" stroke="#132c52" stroke-width="4" stroke-linecap="round"/>
      </svg></div>
      <div class="fcard fc1">💰 <div>₹2,400 bacha<small>is mahine — Sharma Kirana</small></div></div>
      <div class="fcard fc2">🚜 <div>Pump chalu!<small>diesel ₹0 — Rajesh bhai ka khet</small></div></div>
      <div class="chain">
        <div class="wireh"></div>
        <div class="dev inv">
          <span class="brand">⚡ SOLAR INVERTER</span>
          <div class="scr"><b id="watts">1,240</b> W</div>
          <div class="leds"><i class="lg"></i><i class="ly"></i></div>
          <div class="vents"><i></i><i></i><i></i><i></i></div>
        </div>
        <div class="wireh"></div>
        <div class="dev bat" id="batDev">
          <div class="caps"><i></i><i></i><i></i></div>
          <div class="bwrap"><div class="bars"><i></i><i></i><i></i><i></i></div><div class="pct"><b id="pct">64</b>%</div></div>
          <small>Battery — charging</small>
        </div>
      </div>
    </div>
  </div>
  <svg class="wave" viewBox="0 0 1440 90" preserveAspectRatio="none" style="height:90px;width:100%"><path d="M0,60 C240,100 480,10 720,40 C960,70 1200,20 1440,55 L1440,90 L0,90 Z" fill="#fff9ef"/></svg>
</header>

<section class="cases" id="solutions">
  <div class="wrap">
    <span class="tag">🔌 Aapke kaam ke hisaab se</span>
    <h2 class="sec">Kahan lagwana hai solar? 👇</h2>
    <p class="sub">Har jagah ka setup alag hota hai — humne sab kiya hai. Apna wala chuno, baaki hum dekh lenge.</p>
    <div class="pgrid">
      <div class="sockwrap">
        <div class="plug" id="plug"><i></i><i></i><i></i></div>
        <div class="socket" id="socket"><span class="hole h1"></span><span class="hole h2"></span><span class="hole h3"></span><span class="lamp"></span></div>
        <small class="socklbl">🔌 upar wali battery se seedha connection</small>
      </div>
      <svg class="harness" id="harness"></svg>
    <div class="grid">
      <div class="case rv"><div class="scene"><svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="130" fill="#dbeafe"/>
        <rect y="108" width="240" height="22" fill="#b9c8d8"/>
        <path d="M120,0 V22" stroke="#132c52" stroke-width="3"/>
        <rect x="38" y="38" width="164" height="72" rx="4" fill="#fff2dd" stroke="#d8b68a" stroke-width="2"/>
        <rect x="34" y="22" width="172" height="18" rx="4" fill="#0d3b73"/>
        <text x="120" y="35" text-anchor="middle" fill="#ffd75e" font-size="11" font-weight="800" font-family="inherit">SHARMA KIRANA STORE</text>
        <path d="M34,40 h172 l-11,17 h-150 z" fill="#ff6b35"/>
        <g stroke="#fff" stroke-width="5" opacity=".75"><line x1="70" y1="42" x2="64" y2="55"/><line x1="112" y1="42" x2="108" y2="55"/><line x1="154" y1="42" x2="150" y2="55"/></g>
        <rect x="52" y="66" width="60" height="36" rx="3" fill="#31435c"/>
        <rect class="lit" x="52" y="66" width="60" height="36" rx="3" fill="#ffd75e" opacity=".95"/>
        <g stroke="#b98a4a" stroke-width="3"><line x1="56" y1="80" x2="108" y2="80"/><line x1="56" y1="92" x2="108" y2="92"/></g>
        <rect x="150" y="66" width="32" height="44" rx="3" fill="#8a5a2b"/>
        <circle class="lit" cx="132" cy="74" r="9" fill="#ffd75e" opacity=".3"/>
        <circle class="lit" cx="132" cy="74" r="4" fill="#ffe9a8"/>
        <g class="swing"><line x1="196" y1="57" x2="196" y2="66" stroke="#555" stroke-width="2"/><rect x="182" y="66" width="28" height="14" rx="3" fill="#19a974"/><text x="196" y="76" text-anchor="middle" font-size="8" fill="#fff" font-weight="800" font-family="inherit">OPEN</text></g>
      </svg></div><h3>Dukaan</h3><p>Din bhar ka pura load suraj pe — fridge, light, fan sab. Mahine ka bill lagbhag zero.</p><span class="on-badge"><i></i>⚡ solar se chalu</span><span class="go">Baat karo →</span></div>
      <div class="case rv"><div class="scene"><svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="130" fill="#ece8fb"/>
        <rect y="108" width="240" height="22" fill="#c3bcd8"/>
        <path d="M120,0 V18" stroke="#132c52" stroke-width="3"/>
        <path d="M30,46 L120,16 L210,46 V110 H30 Z" fill="#f3e6cf" stroke="#c9ae83" stroke-width="2"/>
        <rect x="82" y="24" width="76" height="16" rx="3" fill="#0d3b73"/>
        <text x="120" y="36" text-anchor="middle" fill="#ffd75e" font-size="10" font-weight="800" font-family="inherit">ATTA CHAKKI</text>
        <g class="spinw"><circle cx="82" cy="76" r="22" fill="none" stroke="#4a3a28" stroke-width="6"/><line x1="82" y1="56" x2="82" y2="96" stroke="#4a3a28" stroke-width="4"/><line x1="62" y1="76" x2="102" y2="76" stroke="#4a3a28" stroke-width="4"/></g>
        <rect x="140" y="66" width="34" height="26" rx="4" fill="#31435c"/>
        <circle class="lit" cx="157" cy="72" r="3" fill="#3dfc9a"/>
        <line class="flow" x1="104" y1="66" x2="140" y2="72" stroke="#ffb628" stroke-width="4"/>
        <line class="flow" x1="104" y1="86" x2="140" y2="86" stroke="#ffb628" stroke-width="4"/>
        <g fill="#e8d8b8"><ellipse cx="196" cy="100" rx="12" ry="12"/><ellipse cx="182" cy="104" rx="10" ry="9"/></g>
        <g fill="#fff" opacity=".9"><circle class="drop" cx="160" cy="96" r="2.5"/><circle class="drop" cx="168" cy="94" r="2" style="animation-delay:.4s"/><circle class="drop" cx="154" cy="94" r="2" style="animation-delay:.8s"/></g>
        <rect x="52" y="98" width="60" height="12" rx="2" fill="#b98a4a"/>
      </svg></div><h3>Atta Chakki</h3><p>Diesel ka roz ka kharcha khatam. Heavy motor ke liye special setup — full power.</p><span class="on-badge"><i></i>⚡ solar se chalu</span><span class="go">Baat karo →</span></div>
      <div class="case rv"><span class="badge-kusum">🌾 PM-KUSUM subsidy</span><div class="scene"><svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="130" fill="#d9f2e4"/>
        <rect y="96" width="240" height="34" fill="#8fce9f"/>
        <g stroke="#3b9a55" stroke-width="4" stroke-linecap="round"><line x1="130" y1="104" x2="130" y2="94"/><line x1="150" y1="108" x2="150" y2="96"/><line x1="170" y1="104" x2="170" y2="93"/><line x1="190" y1="109" x2="190" y2="97"/><line x1="210" y1="105" x2="210" y2="94"/></g>
        <rect x="118" y="112" width="122" height="12" fill="#4db8ff" opacity=".65"/>
        <path d="M60,0 V44" stroke="#132c52" stroke-width="3"/>
        <rect x="30" y="80" width="70" height="12" rx="2" fill="#9a8468"/>
        <g class="shk"><rect x="40" y="46" width="46" height="34" rx="7" fill="#1d5fa8" stroke="#0d3b73" stroke-width="3"/><circle cx="55" cy="63" r="8" fill="#0d3b73"/><circle class="lit" cx="76" cy="54" r="3.5" fill="#3dfc9a"/></g>
        <rect x="84" y="56" width="26" height="8" rx="3" fill="#5b6b7c"/>
        <path class="flow" d="M110,60 C136,58 148,80 152,108" fill="none" stroke="#4db8ff" stroke-width="6" stroke-linecap="round"/>
        <g fill="#4db8ff"><circle class="drop" cx="146" cy="92" r="3"/><circle class="drop" cx="156" cy="88" r="2.5" style="animation-delay:.35s"/><circle class="drop" cx="150" cy="84" r="2" style="animation-delay:.7s"/></g>
        <text x="63" y="106" text-anchor="middle" font-size="9" font-weight="800" fill="#0d3b73" font-family="inherit">TULLU PUMP</text>
      </svg></div><h3>Khet ka Pump</h3><p>Sarkari yojana me ~10% paisa aapka, baaki subsidy. Form se fitting tak hum karwate hain.</p><span class="on-badge"><i></i>⚡ solar se chalu</span><span class="go">Subsidy poochho →</span></div>
      <div class="case rv"><div class="scene"><svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="130" fill="#fdeee6"/>
        <rect y="108" width="240" height="22" fill="#d8c2b2"/>
        <path d="M120,0 V16" stroke="#132c52" stroke-width="3"/>
        <rect x="34" y="44" width="172" height="66" rx="4" fill="#fff7ea" stroke="#d8b68a" stroke-width="2"/>
        <path d="M28,46 L120,14 L212,46 Z" fill="#c94f3d"/>
        <rect x="96" y="50" width="48" height="14" rx="3" fill="#0d3b73"/>
        <text x="120" y="61" text-anchor="middle" fill="#ffd75e" font-size="9.5" font-weight="800" font-family="inherit">SCHOOL</text>
        <g><rect x="48" y="72" width="26" height="20" rx="2" fill="#31435c"/><rect class="lit" x="48" y="72" width="26" height="20" rx="2" fill="#ffd75e"/></g>
        <g><rect x="166" y="72" width="26" height="20" rx="2" fill="#31435c"/><rect class="lit" x="166" y="72" width="26" height="20" rx="2" fill="#ffd75e"/></g>
        <rect x="106" y="74" width="28" height="36" rx="2" fill="#8a5a2b"/>
        <g class="fanb"><line x1="82" y1="94" x2="98" y2="94" stroke="#31435c" stroke-width="3"/><line x1="90" y1="86" x2="90" y2="102" stroke="#31435c" stroke-width="3"/></g>
        <line x1="212" y1="44" x2="212" y2="10" stroke="#555" stroke-width="3"/>
        <path class="flag" d="M212,12 h22 v11 h-22 z" fill="#ff8a3d"/>
      </svg></div><h3>School / College</h3><p>Fan, light, computer lab — bachon ki padhai kabhi na ruke, bill bhi na aaye.</p><span class="on-badge"><i></i>⚡ solar se chalu</span><span class="go">Baat karo →</span></div>
      <div class="case rv"><div class="scene"><svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="130" fill="#fdeef0"/>
        <rect y="108" width="240" height="22" fill="#d8bcc2"/>
        <path d="M120,0 V20" stroke="#132c52" stroke-width="3"/>
        <rect x="38" y="30" width="164" height="80" rx="5" fill="#ffffff" stroke="#d5c2c8" stroke-width="2"/>
        <g class="lit"><rect x="108" y="38" width="24" height="8" rx="2" fill="#e24b4a"/><rect x="116" y="30" width="8" height="24" rx="2" fill="#e24b4a"/></g>
        <g><rect x="52" y="64" width="24" height="18" rx="2" fill="#31435c"/><rect class="lit" x="52" y="64" width="24" height="18" rx="2" fill="#ffd75e"/></g>
        <g><rect x="88" y="64" width="24" height="18" rx="2" fill="#31435c"/><rect class="lit" x="88" y="64" width="24" height="18" rx="2" fill="#ffd75e"/></g>
        <g><rect x="128" y="64" width="24" height="18" rx="2" fill="#31435c"/><rect class="lit" x="128" y="64" width="24" height="18" rx="2" fill="#ffd75e"/></g>
        <g><rect x="164" y="64" width="24" height="18" rx="2" fill="#31435c"/><rect class="lit" x="164" y="64" width="24" height="18" rx="2" fill="#ffd75e"/></g>
        <rect x="104" y="82" width="32" height="28" rx="2" fill="#8899ad"/>
        <text x="120" y="102" text-anchor="middle" font-size="9" font-weight="800" fill="#0d3b73" font-family="inherit">24×7</text>
        <rect x="52" y="92" width="30" height="16" rx="2" fill="#e8f0f8" stroke="#b9c8d8"/>
        <circle class="lit" cx="67" cy="100" r="3" fill="#3dfc9a"/>
        <text x="67" y="122" text-anchor="middle" font-size="8" font-weight="700" fill="#7a5560" font-family="inherit">dawai ka fridge ON</text>
      </svg></div><h3>Hospital / Clinic</h3><p>24 ghante bina rukawat bijli — fridge me dawai, machine sab chalti rahe.</p><span class="on-badge"><i></i>⚡ solar se chalu</span><span class="go">Baat karo →</span></div>
      <div class="case rv"><div class="scene"><svg viewBox="0 0 240 130" xmlns="http://www.w3.org/2000/svg">
        <rect width="240" height="130" fill="#1b2f52"/>
        <g fill="#fff"><circle cx="36" cy="22" r="1.6"/><circle cx="70" cy="14" r="1.3"/><circle cx="200" cy="18" r="1.6"/><circle cx="176" cy="34" r="1.2"/><circle cx="222" cy="42" r="1.3"/></g>
        <circle cx="204" cy="26" r="10" fill="#f3ecd8" opacity=".9"/>
        <rect y="108" width="240" height="22" fill="#12233d"/>
        <path d="M120,0 V18" stroke="#0a1c38" stroke-width="3"/>
        <rect x="52" y="56" width="136" height="54" rx="4" fill="#f5e8d2" stroke="#c9ae83" stroke-width="2"/>
        <path d="M44,58 L120,22 L196,58 Z" fill="#a8552e"/>
        <rect x="128" y="30" width="34" height="20" rx="2" fill="#123f7d" stroke="#dbe9ff" stroke-width="2"/>
        <g><rect x="66" y="70" width="26" height="20" rx="2" fill="#31435c"/><rect class="lit" x="66" y="70" width="26" height="20" rx="2" fill="#ffce7a"/></g>
        <g><rect x="148" y="70" width="26" height="20" rx="2" fill="#31435c"/><rect class="lit" x="148" y="70" width="26" height="20" rx="2" fill="#ffce7a"/></g>
        <rect x="108" y="74" width="26" height="36" rx="2" fill="#7a4a22"/>
        <circle class="lit" cx="121" cy="66" r="7" fill="#ffd75e" opacity=".3"/>
        <circle class="lit" cx="121" cy="66" r="3" fill="#ffe9a8"/>
        <text x="120" y="124" text-anchor="middle" font-size="8.5" font-weight="700" fill="#9fc3f5" font-family="inherit">raat me bhi puri roshni — solar + battery</text>
      </svg></div><h3>Ghar</h3><p>Panel + battery + inverter ka pura set. Raat me bhi roshni, mehmaan bhi khush.</p><span class="on-badge"><i></i>⚡ solar se chalu</span><span class="go">Baat karo →</span></div>
    </div>
    </div>
  </div>
</section>
</div>

<div class="stats">
  <div class="wrap grid">
    <div class="stat rv"><b data-count="10" data-suffix="+">0</b><span>saal ka tajurba</span></div>
    <div class="stat rv"><b data-count="500" data-suffix="+">0</b><span>khush customer</span></div>
    <div class="stat rv"><b data-count="80" data-suffix="%">0</b><span>tak bill me bachat</span></div>
    <div class="stat rv"><b data-count="25" data-suffix=" saal">0</b><span>panel warranty tak</span></div>
  </div>
</div>

<section id="calc">
  <div class="wrap">
    <div class="calc rv">
      <div class="l">
        <h2>Kitna bachega? <br>Khud dekho 🧮</h2>
        <p>Slider khisakao — apna mahine ka bijli bill chuno</p>
        <div class="bill-big" id="billOut">₹3,000</div>
        <input type="range" id="bill" min="500" max="20000" step="500" value="3000">
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:#bcd7ff;margin-top:6px"><span>₹500</span><span>₹20,000</span></div>
      </div>
      <div class="r">
        <div class="row"><span>Saal bhar ki bachat</span><b class="g" id="saveOut">₹28,800</b></div>
        <div class="row"><span>10 saal me bachat</span><b class="g" id="save10">₹2.88 lakh</b></div>
        <div class="row"><span>Paisa vasool</span><b id="payOut">~3 saal me</b></div>
        <a class="btn btn-sun" style="width:100%;justify-content:center;margin-top:20px" href="${waHref}">Free me hisaab banwao 📋</a>
        <p class="calcnote">* Ye andaaza hai — pakka hisaab aapki jagah dekh ke free me banate hain.</p>
      </div>
    </div>
  </div>
</section>`;
}

export function buildBottomHtml({ logoUrl, phone1Digits, phone1, phone2, email, address, whatsappMsg }) {
  const waHref = `https://wa.me/${phone1Digits}?text=${encodeURIComponent(whatsappMsg)}`;
  return `
<section>
  <div class="wrap">
    <div class="band rv">
      <h2>Suraj free me kaam karta hai — aap kab se karwaoge? 😄</h2>
      <p>Ek call karo — aapki jagah dekh ke, sahi setup aur pakka daam batayenge. Koi charge nahi.</p>
      <a class="btn btn-white" href="tel:${phone1Digits}">📞 ${esc(phone1.replace("+91 ", ""))} — abhi baat karo</a>
    </div>
  </div>
</section>

<section class="revs">
  <div class="wrap">
    <span class="tag">⭐ Google Reviews</span>
    <h2 class="sec">Log kya kehte hain 💬</h2>
    <p class="sub">Ye asli Google reviews hain — site pe seedha Google se judenge.</p>
    <div class="grid">
      <div class="rev rv"><div class="stars5">★★★★★</div><p>"Pump lagwaya khet me — ab diesel ka jhanjhat khatam. Subsidy ka form bhi inhone hi bharwaya. Bahut badhiya kaam."</p><div class="who"><span class="av" style="background:#1c5fae">R</span>Rajesh Yadav<small>Kisan, Rani ki Sarai</small></div></div>
      <div class="rev rv"><div class="stars5">★★★★★</div><p>"Dukaan pe 3kW lagwaya. Pehle ₹2,800 bill aata tha, ab ₹300. Fitting ekdum safai se ki team ne."</p><div class="who"><span class="av" style="background:#ff8a3d">S</span>Sharma Ji<small>Kirana store, Azamgarh</small></div></div>
      <div class="rev rv"><div class="stars5">★★★★★</div><p>"Ghar ke liye battery wala set liya. Raat me bhi sab chalta hai. Daam bhi sahi, baat bhi seedhi."</p><div class="who"><span class="av" style="background:#19a974">A</span>Sonali<small>Sonwara Mod</small></div></div>
    </div>
  </div>
</section>

<footer id="contact">
  <div class="wrap grid">
    <div>
      <div class="f-logo"><span style="width:40px;height:40px;border-radius:50%;background:#fff;display:grid;place-items:center;overflow:hidden"><img src="${logoUrl}" alt="Indian Solar Light Centre logo" style="width:100%;height:100%;object-fit:cover;transform:scale(1.28);object-position:center 38%"></span> Indian Solar Light Centre</div>
      <p>Azamgarh ka apna solar ghar — panel, battery, pump, fitting, subsidy. Sab ek jagah, seedhi baat ke saath.</p>
    </div>
    <div>
      <h4>📍 Dukaan pe aao</h4>
      <p>${esc(address)}</p>
    </div>
    <div>
      <h4>📞 Baat karo</h4>
      <p><a href="tel:${phone1Digits}">${esc(phone1)}</a><br><a href="tel:${esc(phone2.replace(/\D/g, ""))}">${esc(phone2)}</a><br><a href="mailto:${esc(email)}">${esc(email)}</a></p>
    </div>
  </div>
  <div class="copyline"><span>© 2026 Indian Solar Light Centre — Azamgarh</span><span>Solar Panel · Battery · Inverter · Pump · Subsidy · Installation</span></div>
</footer>

<a class="sticky-wa" href="${waHref}" aria-label="WhatsApp">💬</a>`;
}
