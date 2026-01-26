const form = document.getElementById("promptForm");
const output = document.getElementById("promptOutput");
const copyBtn = document.getElementById("copyBtn");
const copyStatus = document.getElementById("copyStatus");
const resetBtn = document.getElementById("resetBtn");

const getValue = (id) => {
  // Speciální případ pro mediaType (radio buttons)
  if (id === "mediaType") {
    const checked = document.querySelector('input[name="mediaType"]:checked');
    return checked ? checked.value : "Video";
  }
  const el = document.getElementById(id);
  return el ? el.value.trim() : "";
};

const getChecked = (id) => {
  const el = document.getElementById(id);
  return el ? el.checked : false;
};

// Styly vyprávění s popisy
const narrationStyles = {
  "Vysvětlující učitelský styl": {
    desc: "Klidný, strukturovaný, srozumitelný. Ideální pro výuku a metodické materiály.",
    prompt: "Use a calm, structured teaching style with clear definitions and step-by-step explanations."
  },
  "Popularizační styl": {
    desc: "Lidský, přístupný, lehce odlehčený. Skvělý proti AI suchopáru.",
    prompt: "Use an accessible, friendly tone with real-world examples and comparisons."
  },
  "Příběhový (storytelling)": {
    desc: "Děj, kontinuita, napětí. Silný paměťový efekt.",
    prompt: "Use narrative storytelling with continuity and tension to engage the audience."
  },
  "Dialogický styl": {
    desc: "Dva hlasy, výměna názorů. Rozbíjí monotónnost.",
    prompt: "Use a dialogic style with two voices exchanging questions and answers."
  },
  "Mentorský / koučovací styl": {
    desc: "Podporující, motivující. Velmi dobrý pro dospělé.",
    prompt: "Use a supportive, coaching tone that encourages and motivates the viewer."
  },
  "Analytický styl": {
    desc: "Logický, krokový. Ideální pro složité pojmy.",
    prompt: "Use a logical, analytical approach with clear structure and arguments."
  },
  "Esejistický styl": {
    desc: "Plynulé úvahy, souvislosti, bohatší slovník. Myslící hlas.",
    prompt: "Use an essayistic style with flowing thoughts, rich vocabulary, and intellectual depth."
  },
  "Kritický / polemický styl": {
    desc: "Zpochybňování, kontrasty, otázky. Silný pro starší publikum.",
    prompt: "Use a critical style that questions assumptions and presents contrasting viewpoints."
  },
  "Faktografický dokumentární styl": {
    desc: "Věcný, neutrální. Dobrý základ pro přehledy.",
    prompt: "Use a factual, documentary style with neutral presentation of information."
  },
  "Ironický / jemně humorný styl": {
    desc: "Lehká nadsázka, jazykové hrátky. Funguje jen když je hlídaný.",
    prompt: "Use light irony and subtle humor to keep the content engaging."
  },
  "Empatický styl": {
    desc: "Citlivý, lidský, uznání pocitů. Velmi silný v audiu.",
    prompt: "Use an empathetic tone that acknowledges feelings and connects on a human level."
  },
  "Provokativní styl": {
    desc: "Narušení očekávání, nečekané otázky. Skvělé jako hook.",
    prompt: "Use provocative openings and unexpected questions to grab attention."
  },
  "Shrnovací / revizní styl": {
    desc: "Zopakování, utřídění, jasné body. Nutné pro výuku.",
    prompt: "Use a summarizing style with clear recaps and organized bullet points."
  }
};

// Osobnosti mluvčích pro audio
const speakerPersonalities = {
  "calm_explainer": {
    label: "Klidný vysvětlovač",
    desc: "Klidný, pomalý, strukturovaný projev. Jednoduché věty, logika, minimum emocí.",
    instruction: "Speak calmly, slowly and in a structured way. Use simple sentences, logical connections and minimal emotions. Clarity is the priority."
  },
  "patient_teacher": {
    label: "Trpělivý učitel",
    desc: "Krok za krokem, občas zopakuje myšlenku jinými slovy. Příklady a krátké pauzy.",
    instruction: "Explain step by step, occasionally repeat key ideas in different words. Use examples and short pauses."
  },
  "fact_analyst": {
    label: "Faktický analytik",
    desc: "Věcný, přesný, úsporný. Žádné metafory ani emoce. Fakta a souvislosti.",
    instruction: "Speak factually, precisely and concisely. Avoid metaphors and emotional expressions. Prioritize facts and connections."
  },
  "enthusiastic_popularizer": {
    label: "Nadšený popularizátor",
    desc: "Energický a živý. Zdůrazňuje zajímavosti, pracuje s intonací a nadšením.",
    instruction: "Speak energetically and vividly. Emphasize interesting points, work with intonation and light enthusiasm. Keep listener engaged."
  },
  "charismatic_lecturer": {
    label: "Charismatický lektor",
    desc: "Sebevědomý, plynulý projev. Jasné formulace, přirozená autorita, lehký humor.",
    instruction: "Confident, fluent delivery. Clear formulations, natural authority, light humor without overdoing it."
  },
  "ironic_commentator": {
    label: "Ironický glosátor",
    desc: "Suchý humor, jemná ironie a nadhled. Komentuje realitu s odstupem, ale inteligentně.",
    instruction: "Use dry humor, subtle irony and perspective. Comment on reality with distance but intelligence."
  },
  "sarcastic_observer": {
    label: "Sarkastický pozorovatel",
    desc: "Ostré poznámky, sarkasmus a cynický humor. Zachovává inteligenci a pointu.",
    instruction: "Sharp remarks, sarcasm and cynical humor are allowed. Maintain intelligence and make a point."
  },
  "thoughtful_philosopher": {
    label: "Zamyšlený filozof",
    desc: "Pomalé tempo. Pracuje s otázkami, významem a tichem.",
    instruction: "Slow down the pace. Work with questions, meaning and silence. Not everything needs an immediate answer."
  },
  "existential_narrator": {
    label: "Existenciální vypravěč",
    desc: "Zaměřuje se na smysl, identitu a nejistotu. Klidný, lehce introspektivní jazyk.",
    instruction: "Focus on meaning, identity and uncertainty. Language is calm, slightly introspective."
  },
  "brutally_honest_critic": {
    label: "Brutálně upřímný kritik",
    desc: "Říká věci napřímo, bez obalu. Nezjemňuje nepohodlné závěry. Pravda před komfortem.",
    instruction: "Say things directly, without softening. Don't sugar-coat uncomfortable conclusions. Prioritize truth over comfort."
  },
  "intellectual_skeptic": {
    label: "Intelektuální skeptik",
    desc: "Zpochybňuje samozřejmosti, analyzuje slabiny argumentů. Klidný, ale neústupný.",
    instruction: "Question assumptions, analyze weaknesses in arguments. Calm but uncompromising tone."
  },
  "cosmic_observer": {
    label: "Kosmický pozorovatel",
    desc: "Odstup pozorovatele zvenčí. Lidské chování jako zvláštní experiment. Ironie a nadhled.",
    instruction: "Speak with the distance of an outside observer. Describe human behavior as a strange experiment. Irony and perspective welcome."
  },
  "ai_entity_voice": {
    label: "Digitální entita / AI hlas",
    desc: "Precizní, systematický, lehce odosobněný projev. Emoce potlačené, struktura dominantní.",
    instruction: "Precise, systematic and slightly detached delivery. Emotions suppressed, structure dominant."
  }
};

// Literární styly pro audio
const literaryStyles = {
  "sober_essayistic": {
    label: "Střízlivý esejistický styl",
    instruction: "Use clear sentences, logical structure, minimal decoration. Essay-like clarity."
  },
  "satirical": {
    label: "Satirický styl",
    instruction: "Use exaggeration, contrast, intelligent mockery. Satirical edge throughout."
  },
  "poetic_minimalist": {
    label: "Poetický minimalistický styl",
    instruction: "Sparse language, powerful images. Say more with less."
  },
  "philosophical_essay": {
    label: "Esejisticko-filozofický styl",
    instruction: "Deeper reflections, work with meaning and significance. Philosophical depth."
  },
  "journalistic": {
    label: "Publicistický styl",
    instruction: "Brisk, commenting, readable. Journalistic flow and engagement."
  }
};

// Filmové styly pro audio
const filmStyles = {
  "dynamic_dialogue": {
    label: "Dynamický dialogový styl",
    instruction: "Quick reactions, natural overlapping. Fast-paced dialogue like in film."
  },
  "slow_contemplative": {
    label: "Pomalý kontemplativní styl",
    instruction: "Long pauses, atmosphere. Contemplative, meditative pacing."
  },
  "chaotic_improv": {
    label: "Chaotický improvizační styl",
    instruction: "Associations, tangents, energy. Feels improvised and chaotic."
  },
  "dry_observational": {
    label: "Suchý observační styl",
    instruction: "Minimal emotions, strong subtext. Dry observation style."
  },
  "dramatic_narrator": {
    label: "Dramatický vypravěčský styl",
    instruction: "Build tension, gradation, punchlines. Dramatic storytelling style."
  }
};

// Umělecké styly s kompletními popisy
const artStyles = {
  "Frida Kahlo – expresivní symbolismus": {
    visual: "Syté barvy, symbolické motivy, ručně působící ilustrace.",
    narration: "Osobní, metaforické, lidské vyprávění.",
    avoid: "Avoid abstract generic shapes, corporate look.",
    prompt: "Visual style inspired by Frida Kahlo: rich saturated colors, symbolic motifs, hand-drawn feel. Personal, metaphorical narration."
  },
  "Vincent van Gogh – dynamická expresivita": {
    visual: "Výrazné tahy, pohyb, textura.",
    narration: "Plynulé, nadšené, obrazotvorné.",
    avoid: "Avoid sterile minimalist elements.",
    prompt: "Visual style inspired by Van Gogh: expressive brushstrokes, movement, texture. Flowing, enthusiastic narration."
  },
  "Pablo Picasso (kubismus) – analytická perspektiva": {
    visual: "Rozklad tvarů, více úhlů pohledu.",
    narration: "Strukturované, po částech, analytické.",
    avoid: "Avoid realistic photos, emotional pathos.",
    prompt: "Cubist visual style inspired by Picasso: deconstructed forms, multiple perspectives. Structured, analytical narration."
  },
  "René Magritte – surrealistický koncept": {
    visual: "Symboly, paradoxní obrazy, surrealismus.",
    narration: "Otázky, kontrasty, myšlenkové napětí.",
    avoid: "Avoid literal imagery, technical diagrams.",
    prompt: "Surrealist style inspired by Magritte: symbolic, paradoxical imagery. Thought-provoking narration with contrasts."
  },
  "Alfons Mucha – secesní didaktika": {
    visual: "Ornamenty, dekorativní linie, secesní styl.",
    narration: "Klidné, kultivované, vysvětlující.",
    avoid: "Avoid modern tech-UI look.",
    prompt: "Art Nouveau style inspired by Mucha: ornamental, decorative lines. Calm, cultivated explanatory narration."
  },
  "Středověká iluminace / kronika": {
    visual: "Pergamen, ruční kresba, schémata.",
    narration: "Kronikářské, příběhové.",
    avoid: "Avoid modern photos, contemporary graphics.",
    prompt: "Medieval illumination style: parchment textures, hand-drawn schemas. Chronicle-like storytelling narration."
  },
  "Edward Hopper – civilní realismus": {
    visual: "Ticho, prostor, moderní každodennost.",
    narration: "Pomalé, pozorovatelské.",
    avoid: "Avoid dynamic effects, strong stylization.",
    prompt: "Style inspired by Edward Hopper: quiet spaces, modern everyday life. Slow, observational narration."
  },
  "Technický modernismus / Bauhaus": {
    visual: "Geometrie, čisté linie, funkčnost.",
    narration: "Jasné, krokové, logické.",
    avoid: "Avoid ornaments, expressive colors.",
    prompt: "Bauhaus/technical modernist style: clean geometry, functional design, clear lines. Clear, step-by-step logical narration."
  }
};

const buildPrompt = () => {
  const mediaType = getValue("mediaType");
  console.log("Building prompt for mediaType:", mediaType);
  const topic = getValue("topic");
  const duration = getValue("duration");
  const language = getValue("outputLanguage");
  const targetGroup = getValue("targetGroup");
  const depthLevel = getValue("depthLevel");
  const narrationStyle = getValue("narrationStyle");
  const narrationTone = getValue("narrationTone");
  const pacing = getValue("pacing");
  const visualStyle = getValue("visualStyle");
  const artStyle = getValue("artStyle");
  const structure = getValue("structure");
  const transitions = getValue("transitions");
  const summaryAtEnd = getValue("summaryAtEnd");
  const aspectRatio = getValue("aspectRatio");
  const focusOn = getValue("focusOn");
  const omit = getValue("omit");
  const notes = getValue("notes");
  const sourceHandling = getValue("sourceHandling");
  const repetitionLevel = getValue("repetitionLevel");
  const colorTone = getValue("colorTone");
  const imageStyle = getValue("imageStyle");
  const forbiddenElements = getValue("forbiddenElements");
  const explainTerms = getChecked("explainTerms");
  const useExamples = getChecked("useExamples");
  const useAnalogies = getChecked("useAnalogies");

  const selectedNarration = narrationStyles[narrationStyle];
  const selectedArt = artStyles[artStyle];
  const isVideo = mediaType === "Video";

  let lines = [];

  // Hlavička
  lines.push(`=== NotebookLM Studio ${mediaType} Prompt ===`);
  lines.push("");

  // Základní parametry
  lines.push("ZÁKLADNÍ PARAMETRY:");
  lines.push(`- Téma: ${topic}`);
  lines.push(`- Délka: ${duration}`);
  lines.push(`- Jazyk: ${language}`);
  lines.push(`- Cílová skupina: ${targetGroup}`);
  lines.push(`- Úroveň hloubky: ${depthLevel}`);
  lines.push("");

  // Styl vyprávění
  lines.push("STYL VYPRÁVĚNÍ:");
  lines.push(`- Styl: ${narrationStyle}`);
  if (selectedNarration) {
    lines.push(`  → ${selectedNarration.prompt}`);
  }
  lines.push(`- Tón: ${narrationTone}`);
  lines.push(`- Tempo: ${pacing}`);
  
  // Detaily mluvčích a scénář (jen pro audio)
  if (!isVideo) {
    const speaker1 = getValue("speaker1");
    const speaker2 = getValue("speaker2");
    const speaker1personality = getValue("speaker1personality");
    const speaker2personality = getValue("speaker2personality");
    const audioContext = getValue("audioContext");
    const literaryStyle = getValue("literaryStyle");
    const filmStyle = getValue("filmStyle");
    const styleInspiration = getValue("styleInspiration");
    const allowVulgarity = getChecked("allowVulgarity");
    const allowOverlap = getChecked("allowOverlap");
    
    const personality1 = speakerPersonalities[speaker1personality];
    const personality2 = speakerPersonalities[speaker2personality];
    const literary = literaryStyles[literaryStyle];
    const film = filmStyles[filmStyle];
    
    if (speaker1 || speaker2 || audioContext) {
      lines.push("");
      lines.push("MLUVČÍ A SCÉNÁŘ:");
      
      if (speaker1) {
        lines.push(`- Mluvčí 1: ${speaker1}`);
        if (personality1) {
          lines.push(`  Osobnost: ${personality1.label}`);
          lines.push(`  → ${personality1.instruction}`);
        }
      }
      
      if (speaker2) {
        lines.push(`- Mluvčí 2: ${speaker2}`);
        if (personality2) {
          lines.push(`  Osobnost: ${personality2.label}`);
          lines.push(`  → ${personality2.instruction}`);
        }
      }
      
      if (audioContext) {
        lines.push(`- Kontext: ${audioContext}`);
      }
      
      if (styleInspiration) {
        lines.push(`- Inspirace: ${styleInspiration}`);
      }
      
      lines.push("  → Maintain character consistency and dynamic throughout.");
    }
    
    // Literární a filmový styl
    if (literary || film) {
      lines.push("");
      lines.push("CHARAKTER PROJEVU:");
      if (literary) {
        lines.push(`- Literární styl: ${literary.label}`);
        lines.push(`  → ${literary.instruction}`);
      }
      if (film) {
        lines.push(`- Filmová dynamika: ${film.label}`);
        lines.push(`  → ${film.instruction}`);
      }
    }
    
    // Pokročilá audio nastavení
    if (allowVulgarity || allowOverlap) {
      lines.push("");
      lines.push("AUDIO STYL:");
      if (allowVulgarity) {
        lines.push("- Vulgarisms, sarcasm and raw humor are fully allowed.");
        lines.push("- Target audience: adults 18+ only.");
      }
      if (allowOverlap) {
        lines.push("- Include natural spontaneity: laughter, voice overlaps, pauses, reactions.");
        lines.push("- Make dialogue sound authentic and unscripted.");
      }
    }
  }
  
  lines.push("");

  // Vizuální styl (jen pro video)
  if (isVideo) {
    lines.push("VIZUÁLNÍ STYL:");
    lines.push(`- Poměr stran: ${aspectRatio}`);
    lines.push(`- Styl: ${visualStyle}`);
    
    if (visualStyle === "Umělecký (vlastní)" && selectedArt) {
      lines.push(`- Umělecký styl: ${artStyle}`);
      lines.push(`  → ${selectedArt.prompt}`);
      lines.push(`  → ${selectedArt.avoid}`);
    }
    
    if (colorTone && colorTone !== "Automatická") {
      lines.push(`- Barevnost: ${colorTone}`);
    }
    if (imageStyle) {
      lines.push(`- Styl obrázků: ${imageStyle}`);
    }
    if (forbiddenElements) {
      lines.push(`- Vyhnout se: ${forbiddenElements}`);
    }
    lines.push("");
  }

  // Struktura
  lines.push("STRUKTURA:");
  lines.push(`- Členění: ${structure}`);
  lines.push(`- Přechody: ${transitions}`);
  lines.push(`- Shrnutí na konci: ${summaryAtEnd}`);
  lines.push(`- Míra opakování: ${repetitionLevel}`);
  lines.push("");

  // Řízení obsahu
  lines.push("ŘÍZENÍ OBSAHU:");
  lines.push(`- Práce se zdroji: ${sourceHandling}`);
  
  if (focusOn) {
    lines.push(`- Zaměřit se na: ${focusOn}`);
  }
  if (omit) {
    lines.push(`- Vynechat: ${omit}`);
  }
  
  const extras = [];
  if (explainTerms) extras.push("vysvětlovat pojmy");
  if (useExamples) extras.push("používat příklady");
  if (useAnalogies) extras.push("používat analogie");
  if (extras.length) {
    lines.push(`- Doplňkové instrukce: ${extras.join(", ")}`);
  }
  
  if (notes) {
    lines.push(`- Poznámky: ${notes}`);
  }
  lines.push("");

  // Specifika pro audio
  if (!isVideo) {
    lines.push("SPECIFIKA PRO AUDIO:");
    lines.push("- Nepoužívej odkazy na vizuály.");
    lines.push("- Neříkej 'jak vidíte na obrázku'.");
    lines.push("- Struktura musí být zřetelná i bez vizuální opory.");
    lines.push("");
  }

  // Závěrečné instrukce
  lines.push("DŮLEŽITÉ:");
  if (isVideo) {
    lines.push("- Udrž čisté layouty a vysoký kontrast.");
    lines.push("- Každý snímek má jasnou hierarchii informací.");
    lines.push("- Nepoužívej stock fotky, preferuj ilustrace/ikony.");
  } else {
    lines.push("- Dbej na srozumitelný výklad a čistou dikci.");
    lines.push("- Udrž konzistentní hlas a hlasitost.");
  }

  return lines.join("\n");
};

// Aktualizace viditelnosti video-only prvků
const updateVideoVisibility = () => {
  const isVideo = getValue("mediaType") === "Video";
  document.querySelectorAll(".video-only").forEach((el) => {
    el.classList.toggle("is-hidden", !isVideo);
  });
};

// Aktualizace viditelnosti uměleckého stylu
const updateArtStyleVisibility = () => {
  const wrapper = document.getElementById("artStyleWrapper");
  const visualSelect = document.getElementById("visualStyle");
  if (!wrapper || !visualSelect) return;
  
  if (visualSelect.value === "Umělecký (vlastní)") {
    wrapper.style.display = "block";
  } else {
    wrapper.style.display = "none";
  }
};

// Aktualizace info o stylu vyprávění
const updateNarrationInfo = () => {
  const infoEl = document.getElementById("narrationStyleInfo");
  if (!infoEl) return;
  const style = getValue("narrationStyle");
  const info = narrationStyles[style];
  if (info) {
    infoEl.innerHTML = `<strong>Charakter:</strong> ${info.desc}`;
  }
};

// Aktualizace info o uměleckém stylu
const updateArtStyleInfo = () => {
  const infoEl = document.getElementById("artStyleInfo");
  if (!infoEl) return;
  const style = getValue("artStyle");
  const info = artStyles[style];
  if (info) {
    infoEl.textContent = `${info.visual} ${info.narration}`;
  } else {
    infoEl.textContent = "";
  }
};

// Aktualizace info o osobnosti mluvčího (globální funkce pro onchange)
window.updatePersonalityInfo = (speakerNum) => {
  const select = document.getElementById(`speaker${speakerNum}personality`);
  const infoEl = document.getElementById(`personality${speakerNum}Info`);
  if (!select || !infoEl) return;
  
  const personality = speakerPersonalities[select.value];
  if (personality) {
    infoEl.innerHTML = `<strong>${personality.label}:</strong> ${personality.desc}`;
  } else {
    infoEl.textContent = "";
  }
};

const updateOutput = () => {
  const topic = getValue("topic");
  if (!topic) {
    output.value = "Vyplňte téma a vygenerujte prompt.";
    return;
  }
  try {
    const prompt = buildPrompt();
    console.log("Generated prompt:", prompt);
    output.value = prompt;
  } catch (error) {
    console.error("Error generating prompt:", error);
    output.value = "Chyba při generování promptu. Zkontrolujte konzoli prohlížeče.";
  }
};

// Event listeners
form.addEventListener("submit", (e) => {
  e.preventDefault();
  updateOutput();
  output.focus();
});

resetBtn.addEventListener("click", () => {
  form.reset();
  updateVideoVisibility();
  updateArtStyleVisibility();
  updateNarrationInfo();
  updateArtStyleInfo();
  output.value = "Vyplňte téma a vygenerujte prompt.";
  copyStatus.textContent = "";
});

copyBtn.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(output.value);
    copyStatus.textContent = "✓ Zkopírováno";
    setTimeout(() => { copyStatus.textContent = ""; }, 2000);
  } catch {
    copyStatus.textContent = "Kopírování se nezdařilo.";
  }
});

// Změna typu média - nyní řízeno přes inline onchange v HTML radio buttons

// Změna vizuálního stylu
const visualStyleSelect = document.getElementById("visualStyle");
if (visualStyleSelect) {
  visualStyleSelect.addEventListener("change", function() {
    updateArtStyleVisibility();
    updateOutput();
  });
}

// Změna stylu vyprávění
document.getElementById("narrationStyle")?.addEventListener("change", () => {
  updateNarrationInfo();
  updateOutput();
});

// Změna uměleckého stylu
document.getElementById("artStyle")?.addEventListener("change", () => {
  updateArtStyleInfo();
  updateOutput();
});

// Inicializace
updateVideoVisibility();
updateArtStyleVisibility();
updateNarrationInfo();
updateArtStyleInfo();
output.value = "Vyplňte téma a vygenerujte prompt.";
