// ─── Homepage — server-rendered markup (SEO-friendly) + client-side interactivity ───
// html prop is built server-side (app/page.js) from lib/homeMarkup.js, so the
// full page is present in the initial HTML. This effect only wires up the
// same animations/behaviour the approved design-preview/index.html had.
"use client";
import { useEffect } from "react";

export default function HomeView({ html }) {
  useEffect(() => {
    const cleanups = [];

    // topbar: scroll pe halka compact + shadow
    const topEl = document.querySelector(".top");
    const onScroll = () => topEl && topEl.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

    // stars in hero night sky (guard: don't duplicate on strict-mode double-run)
    const st = document.getElementById("stars");
    if (st && !st.dataset.filled) {
      st.dataset.filled = "1";
      for (let i = 0; i < 40; i++) {
        const s = document.createElement("i");
        s.style.left = Math.random() * 100 + "%";
        s.style.top = Math.random() * 45 + "%";
        const sz = (Math.random() * 2 + 1).toFixed(1);
        s.style.width = sz + "px";
        s.style.height = sz + "px";
        s.style.animationDelay = (Math.random() * 3).toFixed(1) + "s";
        st.appendChild(s);
      }
    }

    // inverter watt display + battery % — live tickers (real feel)
    const wEl = document.getElementById("watts");
    const pEl = document.getElementById("pct");
    let pctVal = 64;
    const t1 = setInterval(() => {
      if (wEl) wEl.textContent = (1100 + Math.round(Math.random() * 320)).toLocaleString("en-IN");
    }, 1600);
    const t2 = setInterval(() => {
      if (pEl) { pctVal = pctVal >= 99 ? 64 : pctVal + 1; pEl.textContent = pctVal; }
    }, 1800);
    cleanups.push(() => { clearInterval(t1); clearInterval(t2); });

    // reveal on scroll
    const io = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } });
    }, { threshold: .15 });
    document.querySelectorAll(".rv").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    // counters
    function animateCount(el) {
      const end = parseInt(el.dataset.count, 10);
      const suf = el.dataset.suffix || "";
      let t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        const p = Math.min((t - t0) / 1400, 1);
        el.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }
    const io2 = new IntersectionObserver((es) => {
      es.forEach((e) => { if (e.isIntersecting) { animateCount(e.target); io2.unobserve(e.target); } });
    }, { threshold: .6 });
    document.querySelectorAll("[data-count]").forEach((el) => io2.observe(el));
    cleanups.push(() => io2.disconnect());

    // calculator
    const bill = document.getElementById("bill");
    function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
    function lakh(n) { return n >= 100000 ? "₹" + (n / 100000).toFixed(2).replace(/\.00$/, "") + " lakh" : inr(n); }
    function upd() {
      const b = +bill.value;
      document.getElementById("billOut").textContent = inr(b);
      const yr = b * .8 * 12;
      document.getElementById("saveOut").textContent = inr(yr);
      document.getElementById("save10").textContent = lakh(yr * 10);
      document.getElementById("payOut").textContent = "~" + Math.max(2, Math.round((b * 30) / yr)) + " saal me";
    }
    if (bill) { bill.addEventListener("input", upd); upd(); cleanups.push(() => bill.removeEventListener("input", upd)); }

    // power harness: battery chip se har use-case card tak asli wire
    function drawHarness() {
      const pg = document.querySelector(".pgrid");
      const svg = document.getElementById("harness");
      if (!pg || !svg) return;
      if (window.innerWidth < 921) { svg.innerHTML = ""; return; }
      const W = pg.clientWidth, H = pg.clientHeight;
      svg.setAttribute("viewBox", "0 0 " + W + " " + H);
      const sock = document.getElementById("socket");
      const pgR = pg.getBoundingClientRect(), sR = sock.getBoundingClientRect();
      const sx = sR.left + sR.width / 2 - pgR.left, sy = sR.bottom - pgR.top + 2;
      let html2 = "";
      pg.querySelectorAll(".case").forEach((c, i) => {
        const x = c.offsetLeft + c.offsetWidth / 2, y = c.offsetTop + 2;
        const d = "M" + sx + "," + sy + " C" + sx + "," + (sy + 52) + " " + x + "," + (y - 52) + " " + x + "," + y;
        html2 += '<path class="base" d="' + d + '"/><path class="live" style="animation-delay:' + (i * .18) + 's" d="' + d + '"/>';
      });
      svg.innerHTML = html2;
    }
    function drawTrunk() {
      const pz = document.getElementById("powerzone");
      const svg = document.getElementById("trunk");
      const bat = document.getElementById("batDev");
      const plug = document.getElementById("plug");
      if (!pz || !svg || !bat || !plug) return;
      const pzR = pz.getBoundingClientRect(), bR = bat.getBoundingClientRect(), pR = plug.getBoundingClientRect();
      svg.setAttribute("viewBox", "0 0 " + pz.clientWidth + " " + pz.clientHeight);
      const bx = bR.left + bR.width / 2 - pzR.left, by = bR.bottom - pzR.top - 6;
      const px = pR.left + pR.width / 2 - pzR.left, py = pR.top - pzR.top + 8;
      let d;
      if (window.innerWidth < 921) {
        const rx = pz.clientWidth - 12;
        d = "M" + bx + "," + by + " C" + bx + "," + (by + 70) + " " + rx + "," + (by + 20) + " " + rx + "," + (by + 130)
          + " L" + rx + "," + (py - 130)
          + " C" + rx + "," + (py - 30) + " " + px + "," + (py - 80) + " " + px + "," + py;
      } else {
        d = "M" + bx + "," + by + " C" + bx + "," + (by + 170) + " " + px + "," + (py - 170) + " " + px + "," + py;
      }
      svg.querySelector(".tbase").setAttribute("d", d);
      svg.querySelector(".tlive").setAttribute("d", d);
    }
    function drawAll() { drawHarness(); drawTrunk(); }
    window.addEventListener("resize", drawAll);
    cleanups.push(() => window.removeEventListener("resize", drawAll));
    const timers = [setTimeout(drawAll, 400), setTimeout(drawAll, 1200)];
    cleanups.push(() => timers.forEach(clearTimeout));
    drawAll();

    // scroll pe circuit poora: plug socket me ghusta hai -> sab ON
    const sockEl = document.getElementById("socket");
    let io3;
    if (sockEl) {
      io3 = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              document.getElementById("powerzone")?.classList.add("powered");
              document.querySelector(".cases")?.classList.add("powered");
            }, 350);
            io3.unobserve(e.target);
          }
        });
      }, { threshold: .5 });
      io3.observe(sockEl);
      cleanups.push(() => io3.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
