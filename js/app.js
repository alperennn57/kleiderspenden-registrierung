// Konstante: erste zwei Ziffern der PLZ der Geschäftsstelle
// (Kannst du später ändern, wenn du willst)
const GESCHAEFTSSTELLE_PLZ_PREFIX = "70";

const form = document.getElementById("spendenForm");
const radioGeschaeftsstelle = document.getElementById("geschaeftsstelle");
const radioAbholung = document.getElementById("abholung");

const abholadresseBereich = document.getElementById("abholadresseBereich");
const strasseInput = document.getElementById("strasse");
const plzInput = document.getElementById("plz");
const ortInput = document.getElementById("ort");

const kleidungsartSelect = document.getElementById("kleidungsart");
const krisengebietSelect = document.getElementById("krisengebiet");

const fehlerBox = document.getElementById("fehlerBox");

function setFehler(text) {
  if (!text) {
    fehlerBox.classList.add("d-none");
    fehlerBox.innerText = "";
    return;
  }
  fehlerBox.classList.remove("d-none");
  fehlerBox.innerText = text;
}

function aktualisiereAnzeige() {
  setFehler("");

  if (radioAbholung.checked) {
    abholadresseBereich.classList.remove("d-none");

    // bei Abholung: Felder verpflichtend
    strasseInput.required = true;
    plzInput.required = true;
    ortInput.required = true;
  } else {
    abholadresseBereich.classList.add("d-none");

    // bei Geschäftsstelle: Abholadresse nicht nötig
    strasseInput.required = false;
    plzInput.required = false;
    ortInput.required = false;

    // optional: Felder leeren
    strasseInput.value = "";
    plzInput.value = "";
    ortInput.value = "";
  }
}

radioGeschaeftsstelle.addEventListener("change", aktualisiereAnzeige);
radioAbholung.addEventListener("change", aktualisiereAnzeige);

form.addEventListener("submit", (e) => {
  e.preventDefault();
  setFehler("");

  const uebergabeart = radioAbholung.checked ? "Abholung" : "Geschäftsstelle";
  const kleidungsart = kleidungsartSelect.value;
  const krisengebiet = krisengebietSelect.value;

  if (!kleidungsart || !krisengebiet) {
    setFehler("Bitte wähle eine Art der Kleidung und ein Krisengebiet aus.");
    return;
  }

  let ortText = "Geschäftsstelle";

  if (uebergabeart === "Abholung") {
    const strasse = strasseInput.value.trim();
    const plz = plzInput.value.trim();
    const ort = ortInput.value.trim();

    if (!strasse || !plz || !ort) {
      setFehler("Bitte fülle die Abholadresse vollständig aus.");
      return;
    }

    // PLZ prüfen: erste zwei Ziffern müssen passen
    const prefix = plz.substring(0, 2);
    if (prefix !== GESCHAEFTSSTELLE_PLZ_PREFIX) {
      setFehler(`Abholung nicht möglich: Die PLZ muss mit "${GESCHAEFTSSTELLE_PLZ_PREFIX}" beginnen.`);
      return;
    }

    ortText = `${strasse}, ${plz} ${ort}`;
  }

  // Datum und Uhrzeit erzeugen
  const now = new Date();
  const datum = now.toLocaleDateString("de-DE");
  const uhrzeit = now.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });

  // Daten per URL-Parameter zur Bestätigungsseite schicken
  const params = new URLSearchParams({
    uebergabeart,
    kleidungsart,
    krisengebiet,
    datum,
    uhrzeit,
    ort: ortText
  });

  window.location.href = `bestaetigung.html?${params.toString()}`;
});

// einmal initial auf richtigen Zustand setzen
aktualisiereAnzeige();
