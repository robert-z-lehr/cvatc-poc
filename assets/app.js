(function () {
  const feedbackEl = document.getElementById("feedback");
  const submitBtn = document.getElementById("submitBtn");
  const copyBtn = document.getElementById("copyBtn");
  const dictateBtn = document.getElementById("dictateBtn");
  const stopDictateBtn = document.getElementById("stopDictateBtn");
  const speechStatus = document.getElementById("speechStatus");
  const geoPill = document.getElementById("geoPill");
  const siteSubtitle = document.getElementById("siteSubtitle");

  // Lists
  const votingList = document.getElementById("votingList");
  const librariesList = document.getElementById("librariesList");
  const parksList = document.getElementById("parksList");
  const fireList = document.getElementById("fireList");
  const otherList = document.getElementById("otherList");

  // --- Helpers ---
  function esc(str) {
    return String(str).replace(/[&<>"']/g, (m) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[m]));
  }

  function parseQuery() {
    const params = new URLSearchParams(location.search);
    const siteId = params.get("siteId") || CVATC_RESOURCES.defaultSite.siteId;
    const label = params.get("label") || CVATC_RESOURCES.defaultSite.label;
    const lat = Number(params.get("lat")) || CVATC_RESOURCES.defaultSite.lat;
    const lng = Number(params.get("lng")) || CVATC_RESOURCES.defaultSite.lng;

    return { siteId, label, lat, lng };
  }

  const SITE = parseQuery();
  siteSubtitle.textContent = `${SITE.label} • Site ID: ${SITE.siteId}`;

  // --- Demo submit (no backend) ---
  submitBtn.addEventListener("click", () => {
    const text = feedbackEl.value.trim();
    if (!text) {
      alert("Please type feedback first.");
      feedbackEl.focus();
      return;
    }
    // Demo behavior: show what would be sent
    alert(
      `Demo submission (not stored):\n\nSite: ${SITE.siteId}\nText: ${text.slice(0, 300)}${text.length > 300 ? "…" : ""}`
    );
  });

  copyBtn.addEventListener("click", async () => {
    const text = feedbackEl.value;
    try {
      await navigator.clipboard.writeText(text);
      alert("Copied.");
    } catch {
      alert("Copy failed. You can manually select and copy the text.");
    }
  });

  // --- Optional geolocation (for UX credibility) ---
  // Not required, but adds “this is location aware” if user permits.
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        geoPill.textContent = `Geo: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
      },
      () => {
        geoPill.textContent = "Geo: denied or unavailable";
      },
      { enableHighAccuracy: false, timeout: 2500, maximumAge: 600000 }
    );
  } else {
    geoPill.textContent = "Geo: unsupported";
  }

  // --- Voice dictation (no backend) ---
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognizer = null;
  let dictating = false;

  function setSpeechUI(state, msg) {
    dictating = state;
    dictateBtn.disabled = state;
    stopDictateBtn.disabled = !state;
    speechStatus.textContent = msg || "";
  }

  if (!SpeechRecognition) {
    setSpeechUI(false, "Dictation not supported in this browser. Use Chrome for the demo.");
    dictateBtn.disabled = true;
    stopDictateBtn.disabled = true;
  } else {
    recognizer = new SpeechRecognition();
    recognizer.continuous = true;
    recognizer.interimResults = true;
    recognizer.lang = "en-US";

    let finalTranscript = "";

    recognizer.onstart = () => setSpeechUI(true, "Listening…");
    recognizer.onerror = (e) => setSpeechUI(false, `Dictation error: ${e.error}`);
    recognizer.onend = () => setSpeechUI(false, "Stopped.");

    recognizer.onresult = (event) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        if (res.isFinal) {
          finalTranscript += res[0].transcript;
        } else {
          interim += res[0].transcript;
        }
      }
      // Write into textarea (append mode)
      const base = feedbackEl.value.replace(/\s+$/g, "");
      const combined = (base ? base + " " : "") + (finalTranscript + " " + interim).trim();
      feedbackEl.value = combined;
    };

    dictateBtn.addEventListener("click", () => {
      try {
        finalTranscript = "";
        recognizer.start();
      } catch {
        // Some browsers throw if start() called twice
      }
    });

    stopDictateBtn.addEventListener("click", () => {
      try {
        recognizer.stop();
      } catch {}
    });
  }

  // --- Map + resources ---
  const categoryMeta = Object.fromEntries(
    CVATC_RESOURCES.categories.map((c) => [c.key, c])
  );

  function renderLegend() {
    const legend = document.getElementById("legend");
    legend.innerHTML = CVATC_RESOURCES.categories
      .map((c) => {
        return `
          <div class="legendItem">
            <span class="swatch" style="background:${c.color}"></span>
            <span>${esc(c.label)}</span>
          </div>`;
      })
      .join("");
  }

  function renderLists() {
    const byCat = {};
    for (const p of CVATC_RESOURCES.points) {
      byCat[p.category] = byCat[p.category] || [];
      byCat[p.category].push(p);
    }

    function itemHTML(p) {
      const link = p.link ? `<a href="${esc(p.link)}" target="_blank" rel="noopener">Official page</a>` : "";
      return `
        <div class="listItem">
          <div class="name">${esc(p.name)}</div>
          <div class="meta">${esc(p.info || "")}</div>
          <div class="meta">${link}</div>
        </div>`;
    }

    votingList.innerHTML = (byCat.voting || []).map(itemHTML).join("") || `<p class="help">No items yet.</p>`;
    librariesList.innerHTML = (byCat.libraries || []).map(itemHTML).join("") || `<p class="help">No items yet.</p>`;
    parksList.innerHTML = (byCat.parks || []).map(itemHTML).join("") || `<p class="help">No items yet.</p>`;
    fireList.innerHTML = (byCat.fire || []).map(itemHTML).join("") || `<p class="help">No items yet.</p>`;
    otherList.innerHTML = (byCat.other || []).map(itemHTML).join("") || `<p class="help">No items yet.</p>`;
  }

  renderLegend();
  renderLists();

  // Map init
  let map = null;

  function initMap() {
    const mapEl = document.getElementById("map");
    if (!mapEl || !window.L) {
      // Leaflet failed; show fallback image block
      const fb = document.querySelector(".fallback");
      if (fb) fb.style.display = "block";
      return;
    }

    map = L.map("map", { zoomControl: true }).setView([SITE.lat, SITE.lng], 14);

    // OpenStreetMap tile layer (no key)
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    // QR site pin
    const siteMarker = L.circleMarker([SITE.lat, SITE.lng], {
      radius: 10,
      weight: 2,
      color: "#ffffff",
      fillColor: "#2b8cff",
      fillOpacity: 0.9
    }).addTo(map);

    siteMarker.bindPopup(`<b>${esc(SITE.label)}</b><br/>Site ID: ${esc(SITE.siteId)}`).openPopup();

    // Category markers
    for (const p of CVATC_RESOURCES.points) {
      const meta = categoryMeta[p.category] || { color: "#aaaaaa", label: p.category };
      const marker = L.circleMarker([p.lat, p.lng], {
        radius: 7,
        weight: 2,
        color: meta.color,
        fillColor: meta.color,
        fillOpacity: 0.75
      }).addTo(map);

      const link = p.link ? `<br/><a href="${esc(p.link)}" target="_blank" rel="noopener">Official page</a>` : "";
      marker.bindPopup(`<b>${esc(p.name)}</b><br/>${esc(meta.label)}${p.info ? `<br/>${esc(p.info)}` : ""}${link}`);
    }
  }

  initMap();
})();
