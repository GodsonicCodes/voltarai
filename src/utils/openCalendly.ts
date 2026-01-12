const openCalendly = () => {
    const url = "https://calendly.com/voltar-info";
    if (typeof window === "undefined") return;

    const calendly = window.Calendly;

    const openPopup = () => {
      try {
        window.Calendly?.initPopupWidget({ url });
      } catch (_error) {
        // no-op: if Calendly isn't available, we'll ensure script loads below
      }
    };

    if (calendly && typeof calendly.initPopupWidget === "function") {
      openPopup();
      return;
    }

    // Fallback: load Calendly script on-demand, then open
    const existing = document.querySelector(
      'script[src="https://assets.calendly.com/assets/external/widget.js"]'
    ) as HTMLScriptElement | null;

    const ensureCss = () => {
      const cssHref = "https://assets.calendly.com/assets/external/widget.css";
      if (!document.querySelector(`link[href="${cssHref}"]`)) {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssHref;
        document.head.appendChild(link);
      }
    };

    const loadAndOpen = () => {
      ensureCss();
      const s = document.createElement("script");
      s.src = "https://assets.calendly.com/assets/external/widget.js";
      s.async = true;
      s.addEventListener(
        "load",
        () => {
          s.dataset.loaded = "true";
          openPopup();
        },
        { once: true }
      );
      document.body.appendChild(s);
    };

    if (!existing) {
      loadAndOpen();
    } else if (existing.dataset.loaded === "true") {
      openPopup();
    } else {
      existing.addEventListener("load", openPopup, { once: true });
    }
  };


export default openCalendly;