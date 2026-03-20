import React from "react";
import "./HeroBanner.css";

export default function HeroBanner() {
  return (
    <section className="hero-banner">
      <div className="hero-banner__ambient hero-banner__ambient--one" />
      <div className="hero-banner__ambient hero-banner__ambient--two" />
      <div className="hero-banner__grid" />

      <div className="hero-banner__content-wrap">
        <div className="hero-banner__content">
          <h1 className="hero-banner__title">Drive more revenue with mobile ordering and marketing solutions</h1>
          <div className="hero-banner__actions">
            <a className="hero-banner__btn hero-banner__btn--primary" href="/why-emenu">
              Why TapOrder
            </a>
          </div>
        </div>

        <div className="hero-banner__visual" aria-hidden="true">
          <div className="hero-banner__qr-orbit">
            <span className="hero-banner__qr-wave hero-banner__qr-wave--one" />
            <span className="hero-banner__qr-wave hero-banner__qr-wave--two" />
            <span className="hero-banner__qr-wave hero-banner__qr-wave--three" />
            <div className="hero-banner__qr-card">
              <img
                className="hero-banner__qr-image"
                src="https://erp-cdn.kptac.com/cff9bb1d-ec14-4c7b-9c85-f9be0baee528.png"
                alt="QR code"
              />
            </div>
          </div>
        </div>
      </div>

      <img
        className="hero-banner__hand"
        src="https://erp-cdn.kptac.com/317bf65e-762a-42b6-8765-1b5e1721caff.png"
        alt="Hand holding phone"
      />
    </section>
  );
}

