"use strict";

document.addEventListener("click", (event) => {
  const link = event.target instanceof Element ? event.target.closest("a[data-contact]") : null;
  if (!link) return;

  const channel = link.dataset.contact;
  if (channel !== "whatsapp" && channel !== "email") return;

  const detail = {
    event: channel === "whatsapp" ? "whatsapp_click" : "email_click",
    placement: link.dataset.placement || "link",
    page: window.location.pathname
  };
  document.dispatchEvent(new CustomEvent("oranday:contact", { detail }));
  if (Array.isArray(window.dataLayer)) window.dataLayer.push(detail);
});
