document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
  }

  const selfToggle = document.getElementById("is-self");
  if (selfToggle) {
    const fields = {
      nama: { element: document.querySelector('[name="applicant_nama"]'), profile: "profileName" },
      nik: { element: document.querySelector('[name="applicant_nik"]'), profile: "profileNik" },
      tanggal_lahir: { element: document.querySelector('[name="applicant_tanggal_lahir"]'), profile: "profileBirth" },
      jenis_kelamin: { element: document.querySelector('[name="applicant_jenis_kelamin"]'), profile: "profileGender" },
      alamat: { element: document.querySelector('[name="applicant_alamat"]'), profile: "profileAddress" },
    };
    const fillFromProfile = (enabled) => {
      for (const field of Object.values(fields)) {
        const input = field.element;
        if (!input) continue;
        input.value = enabled ? input.dataset[field.profile] || "" : "";
      }
    };
    selfToggle.addEventListener("change", () => fillFromProfile(selfToggle.checked));
  }

  const serviceSelect = document.getElementById("service-select");
  const fieldContainer = document.getElementById("specific-fields");
  const hint = document.getElementById("service-hint");
  const extraLabel = document.getElementById("extra-doc-label");
  if (serviceSelect && fieldContainer) {
    serviceSelect.addEventListener("change", () => {
      const option = serviceSelect.selectedOptions[0];
      fieldContainer.replaceChildren();
      if (!option || !option.value) {
        hint.textContent = "Setiap layanan dapat meminta data khusus dan berkas pendukung.";
        extraLabel?.classList.remove("required-doc");
        return;
      }
      const labels = (option.dataset.fields || "").split("|").filter(Boolean);
      hint.textContent = labels.length
        ? `Data tambahan untuk layanan ini: ${labels.join(", ")}.`
        : "Tidak ada data khusus tambahan untuk layanan ini.";
      labels.forEach((label) => {
        const wrap = document.createElement("label");
        wrap.textContent = label;
        const input = document.createElement(label.toLowerCase().includes("tanggal") ? "input" : "textarea");
        const key = label.toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_|_$/g, "");
        input.name = `specific_${key}`;
        input.placeholder = `Masukkan ${label.toLowerCase()}`;
        if (input.tagName === "INPUT") input.type = "date";
        else input.rows = 2;
        wrap.append(input);
        fieldContainer.append(wrap);
      });
      if (option.dataset.extra) {
        const label = extraLabel?.querySelector("input");
        if (label) label.setAttribute("aria-label", option.dataset.extra);
        const caption = extraLabel?.querySelector(".label-help");
        if (caption) caption.textContent = `(${option.dataset.extra} · JPG, PNG, atau PDF · maks. 5 MB)`;
        extraLabel?.classList.add("required-doc");
      } else {
        extraLabel?.classList.remove("required-doc");
        const caption = extraLabel?.querySelector(".label-help");
        if (caption) caption.textContent = "(jika dipersyaratkan · maks. 5 MB)";
      }
    });
  }

  const districts = {
    Mantikulore: ["Talise", "Talise Valangguni", "Tondo", "Layana Indah", "Tanamodindi"],
    "Palu Barat": ["Balaroa", "Kamonji", "Lere", "Siranindi"],
    "Palu Selatan": ["Birobuli Selatan", "Birobuli Utara", "Petobo", "Tatura Selatan"],
    "Palu Timur": ["Besusu Barat", "Besusu Tengah", "Besusu Timur", "Lasoani"],
    "Palu Utara": ["Kayumalue Ngapa", "Mamboro", "Taipa"],
    Tatanga: ["Duyu", "Nunu", "Tatura Utara"],
    Tawaeli: ["Baiya", "Lasoani", "Panau"],
    Ulujadi: ["Buluri", "Donggala Kodi", "Silae"],
  };
  const districtSelect = document.getElementById("district-select");
  const neighborhoodSelect = document.getElementById("neighborhood-select");
  if (districtSelect && neighborhoodSelect) {
    districtSelect.addEventListener("change", () => {
      neighborhoodSelect.replaceChildren();
      const options = districts[districtSelect.value] || [];
      const placeholder = document.createElement("option");
      placeholder.value = "";
      placeholder.textContent = options.length ? "Pilih kelurahan" : "Pilih kecamatan dahulu";
      neighborhoodSelect.append(placeholder);
      options.forEach((name) => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        neighborhoodSelect.append(option);
      });
      neighborhoodSelect.disabled = options.length === 0;
    });
  }
});
