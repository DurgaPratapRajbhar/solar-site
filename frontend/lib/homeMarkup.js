// ─── Homepage markup — ported from the approved design-preview/index.html ───
// Static hero/cases/calculator/reviews/footer HTML (unchanged, pixel-perfect
// same as the approved design) + a dynamic gallery section built from DB rows.
// Rendered via dangerouslySetInnerHTML in HomeView.jsx (server-rendered, so
// content is in the initial HTML — good for SEO), interactivity wired in a
// useEffect that mirrors the original <script> block.

import { parseSocial, SOCIAL_LABELS, SOCIAL_TYPES } from "./social";

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
      <a href="/gallery">Gallery</a>
      <a href="${p}#contact">Contact</a>
    </div>
    <div class="topcall">
      <a class="btn btn-ghost btn-sm" href="tel:${phone1Digits}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z"/></svg> ${esc(phone1.replace("+91 ", ""))}</a>
      <a class="btn btn-sun btn-sm" href="${p}#calc">Bachat dekhein</a>
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

// YouTube: thumbnail first, the player loads on click (fast page). Instagram/Facebook: their own embed.
function socialCard(it) {
  const s = parseSocial(it.url);
  if (!s) return "";
  const cap = esc(it.caption);
  const label = SOCIAL_LABELS[s.type];
  const caption = cap ? `<span class="cap">${cap}</span>` : "";
  if (s.thumb) {
    return `<div class="shot soc rv"><button type="button" class="soc-yt" data-embed="${esc(s.embed)}" aria-label="${label} video chalayein"><img src="${esc(s.thumb)}" alt="${cap || label}" loading="lazy"><span class="soc-play" aria-hidden="true"></span></button><span class="soc-tag">${label}</span>${caption}</div>`;
  }
  return `<div class="shot soc soc-embed rv"><iframe src="${esc(s.embed)}" title="${cap || label + " post"}" loading="lazy" scrolling="no" allow="encrypted-media; picture-in-picture; clipboard-write" allowfullscreen></iframe><span class="soc-tag">${label}</span></div>`;
}

// items ko Photos, Videos aur Social posts — ALAG sections me dikhata hai.
// full=false (homepage teaser) -> har section max 3 + "puri gallery" link.
// full=true (/gallery page) -> sab kuch, koi limit nahi.
export function buildGalleryHtml(items, phone, { full = false } = {}) {
  const all = items || [];
  const photos = all.filter((it) => it.media_type === "image");
  const videos = all.filter((it) => it.media_type === "video");
  const socials = all.filter((it) => SOCIAL_TYPES.includes(it.media_type));
  const showPhotos = full ? photos : photos.slice(0, 3);
  const showVideos = full ? videos : videos.slice(0, 3);
  const showSocials = full ? socials : socials.slice(0, 3);

  const cta = `<a class="shot shot-cta rv" href="tel:${esc(phone.replace(/\D/g, ""))}"><span>Agla install aapka ho sakta hai</span><span class="cap">Call karein: ${esc(phone)}</span></a>`;
  const seeAll = full ? "" : `<p class="sub" style="margin-top:6px"><a href="/gallery" style="color:var(--fire);font-weight:600;text-decoration:none">Puri gallery dekhein →</a></p>`;

  const photoSection = showPhotos.length ? `
    <h3 style="font-size:1.05rem;font-weight:700;margin:0 0 14px">Photos</h3>
    <div class="grid">
      ${showPhotos.map(imageCard).join("")}${full ? "" : cta}
    </div>` : "";

  const videoSection = showVideos.length ? `
    <h3 style="font-size:1.05rem;font-weight:700;margin:34px 0 14px">Videos</h3>
    <div class="grid">
      ${showVideos.map(videoCard).join("")}
    </div>` : "";

  const socialSection = showSocials.length ? `
    <h3 style="font-size:1.05rem;font-weight:700;margin:34px 0 14px">Social media par hamara kaam</h3>
    <div class="grid">
      ${showSocials.map(socialCard).join("")}
    </div>` : "";

  return `
<section class="shots" id="work">
  <div class="wrap">
    <span class="tag">Humara kaam</span>
    <h2 class="sec">Asli installs, asli photos</h2>
    <p class="sub">Koi stock image nahi. Ye sab hamari team ke lagaye hue systems hain.</p>
    ${photoSection}
    ${videoSection}
    ${socialSection}
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
    <span class="tag" style="background:#fff1d6">Humara kaam</span>
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
  const waBase = `https://wa.me/${phone1Digits}?text=Namaste!%20`;
  return `
${buildNavHtml(common, true)}

<header class="hero">
  <div class="wrap">
    <div>
      <span class="h-badge"><span class="pulse"></span> Azamgarh me 10+ saal se roshni failate hue</span>
      <h1>Bijli ka bill?<br><span class="y">Ab suraj bharega!</span></h1>
      <p class="lead">Dukaan, khet, ghar, school, hospital — jahan bolo wahan solar. Sarkari subsidy ke saath, fitting se guarantee tak — sab hum sambhalte hain.</p>
      <div class="ctas">
        <a class="btn btn-sun" href="tel:${phone1Digits}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z"/></svg> Free site visit book karein</a>
        <a class="btn btn-wa" href="${waHref}"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg> WhatsApp karein</a>
      </div>
      <div class="trustline">
        <div><b data-count="500" data-suffix="+">500+</b><span>installs</span></div>
        <div><b data-count="80" data-suffix="%">80%</b><span>tak bill me bachat</span></div>
        <div><b data-count="25" data-suffix=" saal">25 saal</b><span>panel ki umar</span></div>
        <div><b>4.8 ★</b><span>Google rating</span></div>
      </div>
    </div>
    <div class="visual">
      <div class="reel">
        <video src="/media/hero-reel.mp4" poster="/media/hero-reel-poster.jpg" autoplay muted loop playsinline preload="auto" aria-label="Hamare asli solar installation ka video"></video>
        <span class="reel-tag"><i></i>Asli kaam · Azamgarh</span>
      </div>
      <figure class="snap snap-1"><img src="/uploads/chhat-install.jpg" alt="Chhat par lagaya solar panel"><figcaption>Rooftop install</figcaption></figure>
      <figure class="snap snap-2"><img src="/uploads/structure-kaam.jpg" alt="Solar structure ka kaam"><figcaption>Apni team, apna kaam</figcaption></figure>
    </div>
  </div>
</header>

<section class="cases" id="solutions">
  <div class="wrap">
    <span class="tag">Solutions</span>
    <h2 class="sec">Kahan lagwana hai solar?</h2>
    <p class="sub">Har jagah ka load aur setup alag hota hai. Ye sab hamare asli installs hain; card par mouse le jaayein to kaam ka video chalega.</p>
    <div class="grid">
      <a class="case rv" href="${waBase}Ghar%20ke%20liye%20solar%20lagwana%20hai"><div class="media"><img src="/uploads/chhat-install.jpg" alt="Ghar" loading="lazy"></div><div class="body"><h3>Ghar</h3><p>Panel, battery aur inverter ka poora set. Din me suraj, raat me battery se roshni.</p><span class="go">WhatsApp par poochein →</span></div></a>
      <a class="case rv" href="${waBase}Dukaan%20ke%20liye%20solar%20lagwana%20hai"><div class="media"><video src="/uploads/vid-panels-ready.mp4" poster="/uploads/vid-panels-ready-poster.jpg" muted loop playsinline preload="none"></video><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Video</span></div><div class="body"><h3>Dukaan &amp; business</h3><p>Fridge, light, fan aur machines ka din bhar ka load solar par. Har mahine pakki bachat.</p><span class="go">WhatsApp par poochein →</span></div></a>
      <a class="case rv" href="${waBase}Khet%20ke%20pump%20ke%20liye%20solar%20aur%20PM-KUSUM%20subsidy%20ki%20jaankari%20chahiye"><span class="badge-kusum">PM-KUSUM subsidy</span><div class="media"><video src="/uploads/vid-farm-site.mp4" poster="/uploads/vid-farm-site-poster.jpg" muted loop playsinline preload="none"></video><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Video</span></div><div class="body"><h3>Khet ka pump</h3><p>Diesel ka kharcha khatam. Sarkari yojana me ~10% paisa aapka, baaki subsidy. Form se fitting tak hum.</p><span class="go">WhatsApp par poochein →</span></div></a>
      <a class="case rv" href="${waBase}Bade%20load%20(school/hospital/chakki)%20ke%20liye%20solar%20lagwana%20hai"><div class="media"><img src="/uploads/bada-array.jpg" alt="School, hospital, chakki" loading="lazy"></div><div class="body"><h3>School, hospital, chakki</h3><p>Bade load ke liye special design: chakki ki motor, school ka lab, hospital ka 24 ghante backup.</p><span class="go">WhatsApp par poochein →</span></div></a>
      <a class="case rv" href="${waBase}Inverter%20aur%20battery%20backup%20ki%20jaankari%20chahiye"><div class="media"><video src="/uploads/vid-inverter-setup.mp4" poster="/uploads/vid-inverter-setup-poster.jpg" muted loop playsinline preload="none"></video><span class="play" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>Video</span></div><div class="body"><h3>Inverter &amp; battery backup</h3><p>Bijli jaaye ya raat ho, sab chalta rahe. Load ke hisaab se sahi inverter aur battery.</p><span class="go">WhatsApp par poochein →</span></div></a>
      <a class="case rv" href="${waBase}Solar%20installation%20ke%20baare%20me%20baat%20karni%20hai"><div class="media"><img src="/uploads/structure-kaam.jpg" alt="Structure &amp; fitting" loading="lazy"></div><div class="body"><h3>Structure &amp; fitting</h3><p>Mazboot structure, sahi angle aur safai se wiring. Ye sab hamari apni team karti hai.</p><span class="go">WhatsApp par poochein →</span></div></a>
    </div>
  </div>
</section>


<section class="why">
  <div class="wrap">
    <div class="why-grid">
      <div class="why-item rv"><span class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="draw" d="M12 21s-7-6.2-7-11.5A7 7 0 0112 2.5a7 7 0 017 7C19 14.8 12 21 12 21z"/><circle class="draw" cx="12" cy="9.5" r="2.5"/></svg></span><div><b>Free site visit</b><span>Jagah dekh kar sahi size aur pakka daam</span></div></div>
      <div class="why-item rv"><span class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="draw" d="M3 21h18M5 21V10l7-5 7 5v11"/><path class="draw" d="M9 21v-6h6v6"/></svg></span><div><b>Apni installation team</b><span>Structure, wiring aur fitting hum khud karte hain</span></div></div>
      <div class="why-item rv"><span class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="draw" d="M14 3H6a2 2 0 00-2 2v14a2 2 0 002 2h12a2 2 0 002-2V9z"/><path class="draw" d="M14 3v6h6M8 14l3 3 5-6"/></svg></span><div><b>PM-KUSUM subsidy me madad</b><span>Form aur kaagaz ka kaam hum karwate hain</span></div></div>
      <div class="why-item rv"><span class="wi"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path class="draw" d="M12 3l8 4v5c0 5-3.5 8-8 9-4.5-1-8-4-8-9V7z"/><path class="draw" d="M9 12l2 2 4-4"/></svg></span><div><b>Installation ke baad bhi saath</b><span>Ek call par service aur madad</span></div></div>
    </div>
  </div>
</section>

<section id="calc">
  <div class="wrap">
    <div class="calc rv">
      <div class="l">
        <h2>Aapko kitna bada system chahiye?</h2>
        <p>Apna mahine ka bijli bill chunein</p>
        <div class="bill-big" id="billOut">₹3,000</div>
        <input type="range" id="bill" min="500" max="20000" step="500" value="3000" aria-label="Mahine ka bijli bill">
        <div style="display:flex;justify-content:space-between;font-size:.8rem;color:#bcd7ff;margin-top:6px"><span>₹500</span><span>₹20,000</span></div>
      </div>
      <div class="r">
        <div class="row"><span>Andaazan system size</span><b id="kwOut">~3.5 kW</b></div>
        <div class="row"><span>Mahine ki bachat (80% tak)</span><b class="g" id="saveM">₹2,400</b></div>
        <div class="row"><span>Saal bhar ki bachat</span><b class="g" id="saveOut">₹28,800</b></div>
        <a class="btn btn-sun" id="calcWa" data-phone="${phone1Digits}" style="width:100%;justify-content:center;margin-top:20px" href="${waHref}">Is size ka free quote lein</a>
        <p class="calcnote">* Andaaza: ₹7 per unit aur 1 kW se roz lagbhag 4 unit. Pakka size, daam aur subsidy free site visit par.</p>
      </div>
    </div>
  </div>
</section>

<section class="process" id="process">
  <div class="wrap">
    <span class="tag">Kaam kaise hota hai</span>
    <h2 class="sec">Pehli call se chalu system tak</h2>
    <p class="sub">Har step par ek hi team, taaki aapko alag-alag jagah na bhagna pade.</p>
    <div class="steps rv">
      <div class="track"><i></i></div>
      <div class="step"><span class="n">1</span><h3>Free site visit</h3><p>Chhat, load aur bijli ka bill dekh kar sahi system size tay karte hain.</p></div>
      <div class="step"><span class="n">2</span><h3>Design aur quote</h3><p>Saaf quote, bina chhupe kharche ke. Aap aaram se faisla karein.</p></div>
      <div class="step"><span class="n">3</span><h3>Subsidy</h3><p>PM-KUSUM jaisi yojana ho to form aur kaagaz hum bharwate hain.</p></div>
      <div class="step"><span class="n">4</span><h3>Installation</h3><p>Hamari team structure, wiring aur fitting safai se karti hai.</p></div>
      <div class="step"><span class="n">5</span><h3>Support</h3><p>System chalu hone ke baad bhi ek call par madad.</p></div>
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
      <h2>Free site visit book karein</h2>
      <p>Hum aapki jagah dekh kar sahi setup aur pakka daam batayenge. Koi charge nahi.</p>
      <a class="btn btn-white" href="tel:${phone1Digits}"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" aria-hidden="true"><path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1.9.4 1.8.7 2.7a2 2 0 01-.5 2.1L8 9.8a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.7.7a2 2 0 011.7 2z"/></svg> Call karein: ${esc(phone1.replace("+91 ", ""))}</a>
    </div>
  </div>
</section>

<section class="revs">
  <div class="wrap">
    <span class="tag">Customer reviews</span>
    <h2 class="sec">Customers kya kehte hain</h2>
    <p class="sub">Azamgarh ke hamare customers ki raay.</p>
    <div class="grid">
      <div class="rev rv"><div class="stars5">★★★★★</div><p>"Pump lagwaya khet me — ab diesel ka jhanjhat khatam. Subsidy ka form bhi inhone hi bharwaya. Bahut badhiya kaam."</p><div class="who"><span class="av" style="background:#1c5fae">R</span>Rajesh Yadav<small>Kisan, Rani ki Sarai</small></div></div>
      <div class="rev rv"><div class="stars5">★★★★★</div><p>"Dukaan pe 3kW lagwaya. Pehle ₹2,800 bill aata tha, ab ₹300. Fitting ekdum safai se ki team ne."</p><div class="who"><span class="av" style="background:#ff8a3d">S</span>Sharma Ji<small>Kirana store, Azamgarh</small></div></div>
      <div class="rev rv"><div class="stars5">★★★★★</div><p>"Ghar ke liye battery wala set liya. Raat me bhi sab chalta hai. Daam bhi sahi, baat bhi seedhi."</p><div class="who"><span class="av" style="background:#19a974">A</span>Sonali<small>Sonwara Mod</small></div></div>
    </div>
  </div>
</section>

<section class="visit" id="contact">
  <div class="wrap">
    <div class="visit-grid rv">
      <div class="visit-info">
        <span class="tag">Dukaan par aaiye</span>
        <h2 class="sec">Azamgarh me hamari dukaan</h2>
        <p class="addr">${esc(address)}</p>
        <div class="visit-lines">
          <a href="tel:${phone1Digits}"><span>Phone</span>${esc(phone1)}</a>
          <a href="tel:${esc(phone2.replace(/\D/g, ""))}"><span>Phone</span>${esc(phone2)}</a>
          <a href="mailto:${esc(email)}"><span>Email</span>${esc(email)}</a>
        </div>
        <div class="ctas">
          <a class="btn btn-sun" href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("Indian Solar Light Centre " + address)}" target="_blank" rel="noopener">Raasta dekhein</a>
          <a class="btn btn-wa" href="${waHref}">WhatsApp karein</a>
        </div>
      </div>
      <div class="map">
        <iframe title="Indian Solar Light Centre map" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
          src="https://maps.google.com/maps?q=${encodeURIComponent("Indian Solar Light Centre, " + address)}&z=15&output=embed"></iframe>
      </div>
    </div>
  </div>
</section>

<footer>
  <div class="wrap grid">
    <div>
      <div class="f-logo"><span style="width:40px;height:40px;border-radius:50%;background:#fff;display:grid;place-items:center;overflow:hidden"><img src="${logoUrl}" alt="Indian Solar Light Centre logo" style="width:100%;height:100%;object-fit:cover;transform:scale(1.28);object-position:center 38%"></span> Indian Solar Light Centre</div>
      <p>Azamgarh ka apna solar ghar — panel, battery, pump, fitting, subsidy. Sab ek jagah, seedhi baat ke saath.</p>
    </div>
    <div>
      <h4>Dukaan ka pata</h4>
      <p>${esc(address)}</p>
    </div>
    <div>
      <h4>Sampark</h4>
      <p><a href="tel:${phone1Digits}">${esc(phone1)}</a><br><a href="tel:${esc(phone2.replace(/\D/g, ""))}">${esc(phone2)}</a><br><a href="mailto:${esc(email)}">${esc(email)}</a></p>
    </div>
  </div>
  <div class="copyline"><span>© 2026 Indian Solar Light Centre — Azamgarh</span><span>Solar Panel · Battery · Inverter · Pump · Subsidy · Installation</span></div>
</footer>

<a class="sticky-wa" href="${waHref}" aria-label="WhatsApp"><svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 00-8.6 15.1L2 22l5-1.3A10 10 0 1012 2zm0 18.2a8.2 8.2 0 01-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8s-.4-.1-.6.1-.7.8-.8 1-.3.2-.5.1a6.7 6.7 0 01-3.3-2.9c-.3-.4.3-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 00-.7.3 3 3 0 00-.9 2.2 5.2 5.2 0 001.1 2.7 11.8 11.8 0 004.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2s.2-1.1.2-1.2-.2-.2-.4-.3z"/></svg></a>`;
}
