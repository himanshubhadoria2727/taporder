import React, { useEffect, useMemo } from "react";
import legacyBodyHtml from "../legacy-body.html?raw";
import HomeTopSection from "../components/home/HomeTopSection.jsx";
import HomeMiddleSection from "../components/home/HomeMiddleSection.jsx";
import "./HomePage.css";

function sanitize(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<link[^>]*rel=["']prefetch["'][^>]*>/gi, "")
    .replace(/Digital eMenu/g, "TapOrder")
    .replace(/\beMenu\b/g, "TapOrder")
    .trim();
}

function extractSections(html) {
  if (typeof window === "undefined") {
    return { top: "", middle: "", footer: "" };
  }

  const parser = new DOMParser();
  const doc = parser.parseFromString(sanitize(html), "text/html");
  const root = doc.querySelector("#__next");

  if (!root) {
    return { top: "", middle: "", footer: "" };
  }

  const children = Array.from(root.children);
  const topEl = children.find(
    (el) => el.tagName === "DIV" && el.className.includes("css-h4z9d8")
  );
  const middleEl = children.find(
    (el) =>
      el.tagName === "DIV" &&
      (el.className.includes("css-1esno38") || el.className.includes("chakra-container css-1esno38"))
  );
  const footerEl = children.find((el) => el.tagName === "FOOTER");

  return {
    top: topEl ? topEl.outerHTML : "",
    middle: middleEl ? middleEl.outerHTML : "",
    footer: footerEl ? footerEl.outerHTML : "",
  };
}

function shouldSkipAnimated(el) {
  if (!el) return true;
  if (el.matches('[role="menu"], .chakra-menu__menu-list, .css-11hcikx')) return true;
  if (el.closest('[role="menu"], .chakra-menu__menu-list, .css-11hcikx')) return true;
  if (el.closest('.css-sq9uqz')) return true;
  return false;
}

function runHomeAnimations(root) {
  const nodes = Array.from(root.querySelectorAll('[style*="opacity: 0"]'));
  const items = nodes.filter((el) => !shouldSkipAnimated(el));

  items.forEach((el, index) => {
    if (!el.style.transform || el.style.transform === "none") {
      el.style.transform = "translateY(24px)";
    }
    el.style.willChange = "opacity, transform";
    el.style.transition = "opacity 700ms ease, transform 900ms cubic-bezier(0.22, 1, 0.36, 1)";
    el.style.transitionDelay = `${Math.min((index % 10) * 60, 540)}ms`;
  });

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.style.opacity = "1";
        el.style.transform = "none";
        obs.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -10% 0px" }
  );

  items.forEach((el) => observer.observe(el));

  return () => observer.disconnect();
}

function initScanOrderPayPopAnimation(root) {
  const sections = Array.from(root.querySelectorAll(".css-sq9uqz"));
  if (!sections.length) return () => {};

  const cleanups = [];

  sections.forEach((section) => {
    if (section.dataset.popInit === "1") return;

    const items = Array.from(section.querySelectorAll(":scope > div"))
      .filter((el) => el.querySelector("img"))
      .slice(0, 3);

    if (!items.length) return;
    section.dataset.popInit = "1";

    items.forEach((item) => {
      item.style.setProperty("opacity", "0", "important");
      item.style.setProperty("transform", "translateY(18px) scale(0.8)", "important");
      item.style.willChange = "opacity, transform";
      item.style.transition = "opacity 420ms ease, transform 520ms cubic-bezier(0.2, 0.9, 0.2, 1.2)";
      item.style.transitionDelay = "0ms";
    });

    let played = false;
    const play = () => {
      if (played) return;
      played = true;
      items.forEach((item, index) => {
        item.style.transitionDelay = `${index * 180}ms`;
        item.style.setProperty("opacity", "1", "important");
        item.style.setProperty("transform", "translateY(0) scale(1)", "important");
      });
    };

    const onScrollCheck = () => {
      if (played) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.88 && rect.bottom > window.innerHeight * 0.12;
      if (inView) play();
    };

    onScrollCheck();
    window.addEventListener("scroll", onScrollCheck, { passive: true });
    window.addEventListener("resize", onScrollCheck);

    cleanups.push(() => {
      window.removeEventListener("scroll", onScrollCheck);
      window.removeEventListener("resize", onScrollCheck);
      delete section.dataset.popInit;
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

function initTrustedLogosSlider(root) {
  const title = Array.from(root.querySelectorAll("h1, h2")).find((el) =>
    (el.textContent || "").includes("Trusted by 2000+ Hotels and Restaurants around the world")
  );

  if (!title) return () => {};

  title.style.marginBottom = "0";
  title.style.marginTop = "0";

  const section = title.parentElement;
  const viewport = section ? section.querySelector(".css-s88hxx") : null;
  const track = viewport ? viewport.querySelector(".css-k008qs") : null;

  if (!viewport || !track || track.dataset.sliderInit === "1") {
    return () => {};
  }

  const items = Array.from(track.querySelectorAll(":scope > .css-vkhht2"));
  if (!items.length) return () => {};

  track.dataset.sliderInit = "1";

  viewport.style.overflow = "hidden";
  viewport.style.width = "100%";
  viewport.style.marginTop = "22px";
  viewport.style.paddingTop = "6px";

  track.style.display = "flex";
  track.style.alignItems = "center";
  track.style.gap = "28px";
  track.style.width = "max-content";
  track.style.transform = "translate3d(0px, 0px, 0px)";
  track.style.transition = "none";
  track.style.willChange = "transform";

  items.forEach((item) => {
    item.style.transform = "none";
    item.style.flex = "0 0 auto";
    item.style.minWidth = "150px";
    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.justifyContent = "center";

    const img = item.querySelector("img");
    if (img) {
      img.style.width = "auto";
      img.style.height = "56px";
      img.style.objectFit = "contain";
      img.style.maxWidth = "180px";
    }
  });

  const clones = items.map((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    track.appendChild(clone);
    return clone;
  });

  let rafId = 0;
  let x = 0;
  let lastTs = performance.now();
  const speedPxPerSec = 42;

  const tick = (ts) => {
    const dt = Math.max(0, (ts - lastTs) / 1000);
    lastTs = ts;

    const cycleWidth = track.scrollWidth / 2;
    x -= speedPxPerSec * dt;

    if (Math.abs(x) >= cycleWidth) {
      x += cycleWidth;
    }

    track.style.transform = `translate3d(${x}px, 0px, 0px)`;
    rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);

  return () => {
    window.cancelAnimationFrame(rafId);
    clones.forEach((clone) => clone.remove());
    delete track.dataset.sliderInit;
  };
}

function initIntegrationsPartnersSection(root) {
  const title = Array.from(root.querySelectorAll("h2")).find((el) =>
    (el.textContent || "").includes("Our Leading Integrations")
  );
  if (!title) return () => {};

  const subtitle = title.nextElementSibling;
  const viewport = subtitle?.nextElementSibling?.classList?.contains("css-s88hxx")
    ? subtitle.nextElementSibling
    : title.parentElement?.querySelector(".css-s88hxx");
  const track = viewport?.querySelector(".css-k008qs");

  if (!viewport || !track || track.dataset.integrationsInit === "1") return () => {};

  const section = title.parentElement;
  section?.classList.add("integrations-partners-section");
  title.classList.add("integrations-partners-title");
  subtitle?.classList.add("integrations-partners-subtitle");
  viewport.classList.add("integrations-partners-viewport");
  track.classList.add("integrations-partners-track");

  const cards = Array.from(track.querySelectorAll(":scope > .css-vkhht2"));
  if (!cards.length) return () => {};

  cards.forEach((card) => {
    card.classList.add("integrations-partners-card");
    card.style.flex = "0 0 auto";
  });

  track.dataset.integrationsInit = "1";
  track.style.willChange = "transform";
  track.style.transform = "translate3d(0px, 0px, 0px)";
  track.style.transition = "none";

  const clones = cards.map((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.classList.add("integrations-partners-card");
    clone.style.flex = "0 0 auto";
    track.appendChild(clone);
    return clone;
  });

  let rafId = 0;
  let x = 0;
  let lastTs = performance.now();
  const speedPxPerSec = 36;

  const tick = (ts) => {
    const dt = Math.max(0, (ts - lastTs) / 1000);
    lastTs = ts;

    const cycleWidth = track.scrollWidth / 2;
    x -= speedPxPerSec * dt;

    if (Math.abs(x) >= cycleWidth) {
      x += cycleWidth;
    }

    track.style.transform = `translate3d(${x}px, 0px, 0px)`;
    rafId = window.requestAnimationFrame(tick);
  };

  rafId = window.requestAnimationFrame(tick);

  return () => {
    window.cancelAnimationFrame(rafId);
    clones.forEach((clone) => clone.remove());
    delete track.dataset.integrationsInit;
    section?.classList.remove("integrations-partners-section");
    title.classList.remove("integrations-partners-title");
    subtitle?.classList.remove("integrations-partners-subtitle");
    viewport.classList.remove("integrations-partners-viewport");
    track.classList.remove("integrations-partners-track");
    cards.forEach((card) => {
      card.classList.remove("integrations-partners-card");
      card.style.flex = "";
    });
    track.style.willChange = "";
    track.style.transform = "";
    track.style.transition = "";
  };
}
function initLegacyCarousels(root) {
  const roots = Array.from(root.querySelectorAll(".carousel-root"));
  if (!roots.length) return () => {};

  const cleanups = [];

  roots.forEach((carouselRoot) => {
    const slider = carouselRoot.querySelector(".carousel.carousel-slider");
    const track = slider?.querySelector(".slider");
    const prevBtn = slider?.querySelector('button[aria-label*="previous"]');
    const nextBtn = slider?.querySelector('button[aria-label*="next"]');

    if (!slider || !track || !prevBtn || !nextBtn || track.dataset.manualInit === "1") return;

    const allSlides = Array.from(track.querySelectorAll(":scope > .slide"));
    if (allSlides.length < 2) return;

    let visibleCount = allSlides.length;
    if (allSlides.length % 2 === 0) {
      const half = allSlides.length / 2;
      let isDuplicateHalf = true;
      for (let i = 0; i < half; i += 1) {
        const a = (allSlides[i].textContent || "").replace(/\s+/g, " ").trim();
        const b = (allSlides[i + half].textContent || "").replace(/\s+/g, " ").trim();
        if (!a || a !== b) {
          isDuplicateHalf = false;
          break;
        }
      }
      if (isDuplicateHalf) visibleCount = half;
    }

    if (visibleCount < 2) return;

    track.dataset.manualInit = "1";
    let index = 0;
    let direction = "next";

    const apply = (animate = true) => {
      allSlides.forEach((slide, i) => {
        const active = i % visibleCount === index;
        slide.style.display = active ? "block" : "none";
        slide.classList.toggle("selected", active);
        slide.classList.toggle("previous", false);

        if (!active) {
          slide.style.animation = "";
          return;
        }

        slide.style.animation = "";
        if (animate) {
          window.requestAnimationFrame(() => {
            slide.style.animation = direction === "prev"
              ? "drawbackSlideInPrev 320ms ease"
              : "drawbackSlideInNext 320ms ease";
          });
        }
      });
    };

    const onPrev = () => {
      direction = "prev";
      index = (index - 1 + visibleCount) % visibleCount;
      apply(true);
    };

    const onNext = () => {
      direction = "next";
      index = (index + 1) % visibleCount;
      apply(true);
    };

    prevBtn.addEventListener("click", onPrev);
    nextBtn.addEventListener("click", onNext);

    apply(false);

    cleanups.push(() => {
      prevBtn.removeEventListener("click", onPrev);
      nextBtn.removeEventListener("click", onNext);
      allSlides.forEach((slide) => {
        slide.style.display = "";
        slide.style.animation = "";
      });
      delete track.dataset.manualInit;
    });
  });

  return () => {
    cleanups.forEach((fn) => fn());
  };
}

function initBenefitsRocketAnimation(root) {
  const benefitsSection = root.querySelector(".css-sf4yoi");
  const rocket = benefitsSection?.querySelector(".css-1aq0crk");
  if (!benefitsSection || !rocket || rocket.dataset.rocketInit === "1") return () => {};

  rocket.dataset.rocketInit = "1";
  rocket.style.opacity = "0";
  rocket.style.transform = "translate3d(-130vw, 72vh, 0) rotate(-24deg) scale(0.82)";
  rocket.style.animation = "none";

  const play = () => {
    rocket.style.animation = "none";
    window.requestAnimationFrame(() => {
      rocket.style.animation = "benefitsRocketAcross 1850ms cubic-bezier(0.2, 0.75, 0.2, 1) forwards";
    });
  };

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        play();
        obs.unobserve(benefitsSection);
      });
    },
    { threshold: 0.18, rootMargin: "0px 0px -10% 0px" }
  );

  observer.observe(benefitsSection);

  return () => {
    observer.disconnect();
    rocket.style.animation = "";
    delete rocket.dataset.rocketInit;
  };
}

function initRevenueCaptureSection(root) {
  const title = Array.from(root.querySelectorAll("h2")).find((el) =>
    (el.textContent || "").includes("Increase Revenue Capture")
  );
  if (!title) return () => {};

  const subtitle = title.nextElementSibling;
  const cardsRoot =
    subtitle?.nextElementSibling?.classList?.contains("css-1vabeqo")
      ? subtitle.nextElementSibling
      : title.parentElement?.querySelector(".css-1vabeqo");

  if (!cardsRoot || cardsRoot.dataset.revenueInit === "1") return () => {};

  const cards = Array.from(cardsRoot.querySelectorAll(":scope > .css-1op74cc"));
  if (!cards.length) return () => {};

  cardsRoot.dataset.revenueInit = "1";
  const section = title.parentElement;
  section?.classList.add("revenue-capture-section");
  title.classList.add("revenue-capture-title");
  if (subtitle) subtitle.classList.add("revenue-capture-subtitle");

  const track = document.createElement("div");
  track.className = "revenue-features-track";
  cards.forEach((card) => track.appendChild(card));
  cardsRoot.appendChild(track);

  const controls = document.createElement("div");
  controls.className = "revenue-features-controls";
  controls.innerHTML = [
    '<button type="button" class="revenue-arrow revenue-arrow-prev" aria-label="Previous features slide">&#10094;</button>',
    '<div class="revenue-progress"><span class="revenue-progress-fill"></span></div>',
    '<button type="button" class="revenue-arrow revenue-arrow-next" aria-label="Next features slide">&#10095;</button>',
  ].join("");

  cardsRoot.insertAdjacentElement("afterend", controls);

  const prev = controls.querySelector(".revenue-arrow-prev");
  const next = controls.querySelector(".revenue-arrow-next");
  const fill = controls.querySelector(".revenue-progress-fill");
  const progressEl = controls.querySelector(".revenue-progress");

  let index = 0;
  let maxIndex = 0;
  let gap = 28;

  const getPerPage = () => {
    const w = window.innerWidth;
    if (w <= 680) return 2;
    if (w <= 1024) return 3;
    return 4;
  };

  const sync = (animate = true) => {
    const perPage = getPerPage();
    maxIndex = Math.max(0, cards.length - perPage);
    index = Math.min(index, maxIndex);

    const cardWidth = cards[0]?.getBoundingClientRect().width || 0;
    const x = index * (cardWidth + gap);
    track.style.transition = animate ? "transform 420ms cubic-bezier(0.2, 0.7, 0.2, 1)" : "none";
    track.style.transform = `translate3d(${-x}px, 0, 0)`;

    if (fill && progressEl) {
      const progress = maxIndex === 0 ? 0 : index / maxIndex;
      const clamped = Math.min(Math.max(progress, 0), 1);
      const maxTranslate = Math.max(0, progressEl.clientWidth - fill.offsetWidth);
      fill.style.transform = `translateX(${maxTranslate * clamped}px)`;
    }

    if (prev) prev.disabled = index <= 0;
    if (next) next.disabled = index >= maxIndex;
  };

  const onPrev = () => {
    index = Math.max(0, index - 1);
    sync(true);
  };

  const onNext = () => {
    index = Math.min(maxIndex, index + 1);
    sync(true);
  };

  const onResize = () => {
    const styles = window.getComputedStyle(track);
    gap = Number.parseFloat(styles.columnGap || styles.gap || "28") || 28;
    sync(false);
  };

  prev?.addEventListener("click", onPrev);
  next?.addEventListener("click", onNext);
  window.addEventListener("resize", onResize);
  onResize();

  return () => {
    prev?.removeEventListener("click", onPrev);
    next?.removeEventListener("click", onNext);
    window.removeEventListener("resize", onResize);
    controls.remove();
    cards.forEach((card) => cardsRoot.appendChild(card));
    track.remove();
    delete cardsRoot.dataset.revenueInit;
  };
}
function normalizeTopHeadings(root) {
  root.querySelectorAll("h1, h2").forEach((heading) => {
    if (heading.style.paddingTop === "12px") heading.style.paddingTop = "";
    if (heading.style.paddingBottom === "12px") heading.style.paddingBottom = "";
  });

  const targetHeading = Array.from(root.querySelectorAll("h2")).find((el) =>
    (el.textContent || "").includes("The future of hospitality is now at the touch of our fingertips")
  );
  if (!targetHeading) return () => {};

  const headingArea = targetHeading.parentElement;
  if (headingArea) {
    headingArea.style.paddingTop = "0";
    headingArea.style.paddingBottom = "clamp(20px, 3vw, 40px)";
  }

  // Keep a small badge image on the right side of the heading.
  let row = targetHeading.parentElement?.querySelector(":scope > .moneyback-heading-row");
  if (!row) {
    row = document.createElement("div");
    row.className = "moneyback-heading-row";
    targetHeading.parentElement?.insertBefore(row, targetHeading);
    row.appendChild(targetHeading);
  }

  row.style.setProperty("display", "grid", "important");
  row.style.setProperty("align-items", "center", "important");
  row.style.setProperty("grid-template-columns", "minmax(0, 1fr) auto", "important");
  row.style.setProperty("grid-auto-flow", "column", "important");
  row.style.gap = "8px";
  row.style.width = "100%";

  targetHeading.style.margin = "0";
  targetHeading.style.minWidth = "0";
  targetHeading.style.setProperty("grid-column", "1", "important");
  targetHeading.style.setProperty("width", "100%", "important");
  targetHeading.style.setProperty("padding-top", "82px", "important");

  let badge = row.querySelector(".moneyback-badge");
  const belowImageBlock = row.parentElement?.querySelector(":scope > .css-fbazg0");

  if (!badge && belowImageBlock) {
    badge = belowImageBlock;
    badge.classList.add("moneyback-badge");
    row.appendChild(badge);
  }

  const fallbackBadgeSvg = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 120 120\"><circle cx=\"60\" cy=\"60\" r=\"56\" fill=\"#11b5a8\"/><circle cx=\"60\" cy=\"60\" r=\"44\" fill=\"#ffffff\"/><path d=\"M40 61l12 12 28-29\" fill=\"none\" stroke=\"#11b5a8\" stroke-width=\"10\" stroke-linecap=\"round\" stroke-linejoin=\"round\"/></svg>";

  if (!badge) {
    badge = document.createElement("img");
    badge.className = "moneyback-badge";
    badge.alt = "Money back guarantee";
    badge.loading = "lazy";
    badge.decoding = "async";
    badge.src = `data:image/svg+xml;utf8,${encodeURIComponent(fallbackBadgeSvg)}`;
    row.appendChild(badge);
  }

  badge.style.width = "clamp(52px, 7vw, 88px)";
  badge.style.height = "clamp(52px, 7vw, 88px)";
  badge.style.objectFit = "contain";
  badge.style.setProperty("grid-column", "2", "important");
  badge.style.justifySelf = "end";
  badge.style.display = "block";
  badge.style.marginTop = "0";
  badge.style.lineHeight = "0";
  badge.style.overflow = "hidden";

  const badgeSvg = badge.querySelector("svg");
  if (badgeSvg) {
    badgeSvg.style.width = "100%";
    badgeSvg.style.height = "100%";
    badgeSvg.setAttribute("width", "100%");
    badgeSvg.setAttribute("height", "100%");
  }

  const applyHeadingResponsiveLayout = () => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    const description = row.parentElement?.querySelector(":scope > .css-1jzqurv");

    if (isMobile) {
      if (description && badge.parentElement !== description.parentElement) {
        description.insertAdjacentElement("afterend", badge);
      }

      row.style.setProperty("grid-template-columns", "1fr", "important");
      row.style.setProperty("grid-auto-flow", "row", "important");
      row.style.gap = "14px";
      targetHeading.style.setProperty("text-align", "center", "important");
      badge.style.setProperty("grid-column", "auto", "important");
      badge.style.justifySelf = "center";
      badge.style.marginTop = "18px";
      badge.style.width = "clamp(96px, 34vw, 148px)";
      badge.style.height = "clamp(96px, 34vw, 148px)";
    } else {
      if (badge.parentElement !== row) {
        row.appendChild(badge);
      }

      row.style.setProperty("grid-template-columns", "minmax(0, 1fr) auto", "important");
      row.style.setProperty("grid-auto-flow", "column", "important");
      row.style.gap = "8px";
      targetHeading.style.setProperty("text-align", "", "important");
      badge.style.setProperty("grid-column", "2", "important");
      badge.style.justifySelf = "end";
      badge.style.marginTop = "0";
      badge.style.width = "clamp(52px, 7vw, 88px)";
      badge.style.height = "clamp(52px, 7vw, 88px)";
    }
  };

  applyHeadingResponsiveLayout();
  window.addEventListener("resize", applyHeadingResponsiveLayout);

  return () => {
    window.removeEventListener("resize", applyHeadingResponsiveLayout);
  };
}

function trimLegacyContentAfterFlexible(root) {
  const middle = root.querySelector(".chakra-container.css-1esno38, .css-1esno38");
  if (!middle) return;

  const flexibleHeading = Array.from(middle.querySelectorAll("h2")).find((el) =>
    (el.textContent || "").includes("Flexible Design Customizations")
  );

  if (!flexibleHeading) return;

  let startNode = flexibleHeading;
  while (startNode.parentElement && startNode.parentElement !== middle) {
    startNode = startNode.parentElement;
  }

  if (startNode.parentElement !== middle) return;

  let cursor = startNode;
  while (cursor) {
    const next = cursor.nextElementSibling;
    cursor.remove();
    cursor = next;
  }
}

export default function HomePage() {
  const sections = useMemo(() => extractSections(legacyBodyHtml), []);

  useEffect(() => {
    document.documentElement.style.overflowX = "hidden";
    document.body.style.margin = "0";
    document.body.style.overflowX = "hidden";

    const root = document.getElementById("home-page-root");
    if (!root) return undefined;

    const stopRevealAnimations = runHomeAnimations(root);
    const stopScanOrderPayPop = initScanOrderPayPopAnimation(root);
    const stopTrustedSlider = initTrustedLogosSlider(root);
    const stopIntegrationsSection = initIntegrationsPartnersSection(root);
    const stopLegacyCarousels = initLegacyCarousels(root);
    const stopBenefitsRocket = initBenefitsRocketAnimation(root);
    const stopRevenueCapture = initRevenueCaptureSection(root);
    const cleanupHeadingSpacing = normalizeTopHeadings(root);
    trimLegacyContentAfterFlexible(root);

    return () => {
      stopRevealAnimations();
      stopScanOrderPayPop();
      stopTrustedSlider();
      stopIntegrationsSection();
      stopLegacyCarousels();
      stopBenefitsRocket();
      stopRevenueCapture();
      cleanupHeadingSpacing();
    };
  }, []);

  return (
    <main id="home-page-root" style={{ width: "100%", overflowX: "hidden" }}>
      <HomeTopSection html={sections.top} />
      <HomeMiddleSection html={sections.middle} />
      {/* <HomeFooterSection html={sections.footer} /> */}
      <footer className="custom-home-footer" aria-label="Site footer">
        <nav className="custom-home-footer-nav" aria-label="Primary footer links">
          <div className="custom-home-footer-links custom-home-footer-links-main">
            <a href="#" className="is-active">Home</a>
            <a href="#">Why TapOrder</a>
            <a href="#">Features</a>
            <a href="#">Pricing</a>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Contact</a>
          </div>
          <div className="custom-home-footer-links custom-home-footer-links-legal">
            <a href="#">Terms</a>
            <a href="#">Privacy</a>
            <a href="#">Refunds</a>
          </div>
        </nav>

        <div className="custom-home-footer-social" aria-label="Social media links">
          <a href="#" aria-label="Instagram">IG</a>
          <a href="#" aria-label="Facebook">FB</a>
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="YouTube">YT</a>
        </div>

        <div className="custom-home-footer-payments" aria-label="Accepted payment methods">
          <span className="visa">VISA</span>
          <span className="mc"><i></i><i></i></span>
        </div>

        <p className="custom-home-footer-copyright">Copyright Â© 2026 | All Rights Reserved</p>
        <p className="custom-home-footer-credit">
          Designed and Developed by <a href="https://www.kptac.com" target="_blank" rel="noreferrer">KPTAC</a>
        </p>
      </footer>
    </main>
  );
}





















































