// ─── Homepage — server-rendered markup (SEO-friendly) + client-side interactivity ───
// html prop is built server-side (app/page.js) from lib/homeMarkup.js, so the
// full page is present in the initial HTML. This effect only adds the motion:
// scroll reveal, counters, calculator and the real install videos.
"use client";
import { useEffect } from "react";

export default function HomeView({ html }) {
  useEffect(() => {
    const cleanups = [];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // topbar: scroll pe halka compact + shadow
    const topEl = document.querySelector(".top");
    const onScroll = () => topEl && topEl.classList.toggle("scrolled", window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    cleanups.push(() => window.removeEventListener("scroll", onScroll));

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
    if (!reduceMotion) document.querySelectorAll("[data-count]").forEach((el) => io2.observe(el));
    cleanups.push(() => io2.disconnect());

    // calculator
    const bill = document.getElementById("bill");
    function inr(n) { return "₹" + Math.round(n).toLocaleString("en-IN"); }
    // ₹7 per unit; 1 kW makes ~4 units a day (~120 a month); size rounded to 0.5 kW
    function upd() {
      const b = +bill.value;
      const kw = Math.max(1, Math.round((b / 7 / 120) * 2) / 2);
      document.getElementById("billOut").textContent = inr(b);
      document.getElementById("kwOut").textContent = "~" + kw + " kW";
      document.getElementById("saveM").textContent = inr(b * .8);
      document.getElementById("saveOut").textContent = inr(b * .8 * 12);
      const wa = document.getElementById("calcWa");
      const text = "Namaste! Mera bijli bill " + inr(b) + " mahina hai. Lagbhag " + kw + " kW system ka free quote chahiye.";
      wa.href = "https://wa.me/" + wa.dataset.phone + "?text=" + encodeURIComponent(text);
    }
    if (bill) { bill.addEventListener("input", upd); upd(); cleanups.push(() => bill.removeEventListener("input", upd)); }

    // hero reel: still poster for visitors who turned motion off
    const reel = document.querySelector(".reel video");
    if (reel && reduceMotion) reel.pause();

    // YouTube posts: the player loads only when someone presses play
    const onPlay = (e) => {
      const btn = e.target.closest(".soc-yt");
      if (!btn) return;
      const frame = document.createElement("iframe");
      frame.src = btn.dataset.embed;
      frame.title = btn.getAttribute("aria-label");
      frame.allow = "autoplay; encrypted-media; picture-in-picture";
      frame.allowFullscreen = true;
      btn.replaceWith(frame);
    };
    document.addEventListener("click", onPlay);
    cleanups.push(() => document.removeEventListener("click", onPlay));

    // solution cards: the real install video plays on hover (desktop) or while in view (phone)
    const cardVideos = [...document.querySelectorAll(".case video")];
    const play = (v) => v.play().catch(() => {});
    if (window.matchMedia("(hover: hover)").matches) {
      cardVideos.forEach((v) => {
        const card = v.closest(".case");
        const on = () => play(v);
        const off = () => v.pause();
        card.addEventListener("mouseenter", on);
        card.addEventListener("mouseleave", off);
        cleanups.push(() => { card.removeEventListener("mouseenter", on); card.removeEventListener("mouseleave", off); });
      });
    } else if (!reduceMotion) {
      const io3 = new IntersectionObserver((es) => {
        es.forEach((e) => (e.isIntersecting ? play(e.target) : e.target.pause()));
      }, { threshold: .7 });
      cardVideos.forEach((v) => io3.observe(v));
      cleanups.push(() => io3.disconnect());
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
