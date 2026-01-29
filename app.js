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
  // Speciální případ pro speakerBalance (radio buttons)
  if (id === "speakerBalance") {
    const checked = document.querySelector('input[name="speakerBalance"]:checked');
    return checked ? checked.value : "speaker1_leads";
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
    
    // ROLE LOCK blok
    const roleLockLines = buildRoleLockBlock(speaker1, speaker2);
    if (roleLockLines.length > 0) {
      lines.push(...roleLockLines);
    }
    
    // Vyvážení rolí mluvčích
    const speakerBalance = getValue("speakerBalance");
    const structureLevel = getValue("structureLevel");
    const silenceHandling = getValue("silenceHandling");
    const implicitStructure = getChecked("implicitStructure");
    const noMetaComments = getChecked("noMetaComments");
    const subtleVulgarity = getChecked("subtleVulgarity");
    
    lines.push("");
    lines.push("DYNAMIKA DIALOGU:");
    
    // Vyvážení mluvčích
    if (speakerBalance === "speaker1_leads") {
      lines.push("- Speaker 1 carries the main content and drives the conversation.");
      lines.push("- Speaker 2 reacts, comments, asks clarifying questions, adds humor.");
    } else if (speakerBalance === "speaker2_leads") {
      lines.push("- Speaker 2 carries the main content and drives the conversation.");
      lines.push("- Speaker 1 reacts, comments, asks clarifying questions, adds humor.");
    } else {
      lines.push("- Both speakers contribute equally to the content.");
      lines.push("- Natural back-and-forth, balanced exchange of ideas.");
    }
    
    // Míra struktury
    if (structureLevel === "low") {
      lines.push("- Structure: Very loose, feels like natural conversation with tangents.");
    } else if (structureLevel === "high") {
      lines.push("- Structure: Clear thematic blocks, but NO explicit chapter names or transitions.");
    } else {
      lines.push("- Structure: Medium - clear flow but organic transitions.");
    }
    
    // Práce s tichem
    if (silenceHandling === "minimum") {
      lines.push("- Minimal pauses, keep the energy flowing.");
    } else if (silenceHandling === "dramatic") {
      lines.push("- Use meaningful silence when something lands hard. Let moments breathe.");
    } else {
      lines.push("- Natural pauses for emphasis and reflection.");
    }
    
    // Pokročilá pravidla
    lines.push("");
    lines.push("PRAVIDLA PROJEVU:");
    
    if (implicitStructure) {
      lines.push("- NEVER say 'now chapter', 'let's summarize', 'in this section'.");
      lines.push("- Structure must be FELT from the flow, never announced.");
    }
    
    if (noMetaComments) {
      lines.push("- NO meta-commentary: never say 'in this podcast', 'as we discuss'.");
      lines.push("- Stay fully IN CHARACTER. Speak only as the personas, never as hosts.");
    }
    
    if (subtleVulgarity) {
      lines.push("- Use natural Czech vulgarisms ONLY when it fits the moment.");
      lines.push("- Not for shock value or constant comedy. Situational and authentic.");
    }
    
    if (allowOverlap) {
      lines.push("- Include natural spontaneity: laughter, voice overlaps, interruptions.");
      lines.push("- Make dialogue sound authentic and unscripted.");
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
  // Přepni také output sekce
  updateOutputSections();
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

// Toggle pro ROLE LOCK options
window.toggleRoleLockOptions = () => {
  const enabled = getChecked("roleLockEnabled");
  const options = document.getElementById("roleLockOptions");
  if (options) {
    options.classList.toggle("hidden", !enabled);
  }
};

// Generování ROLE LOCK bloku pro prompt
const buildRoleLockBlock = (speaker1Name, speaker2Name) => {
  const roleLockEnabled = getChecked("roleLockEnabled");
  if (!roleLockEnabled) return [];
  
  const speaker1gender = getValue("speaker1gender");
  const speaker2gender = getValue("speaker2gender");
  const enforceGenderForms = getChecked("enforceGenderForms");
  const preventRoleSwitch = getChecked("preventRoleSwitch");
  const autoCorrectRole = getChecked("autoCorrectRole");
  
  const lines = [];
  lines.push("");
  lines.push("=== ROLE A HLAS (ZÁVAZNÉ) ===");
  lines.push("");
  
  // Mluvčí 1
  const name1 = speaker1Name || "Mluvčí 1";
  if (speaker1gender === "male") {
    lines.push(`- ${name1} je MUŽ.`);
    lines.push(`  Mluví výhradně MUŽSKÝM hlasem a z MUŽSKÉ perspektivy.`);
    lines.push(`  Používá důsledně mužské rodové tvary (řekl, udělal, byl jsem...).`);
  } else if (speaker1gender === "female") {
    lines.push(`- ${name1} je ŽENA.`);
    lines.push(`  Mluví výhradně ŽENSKÝM hlasem a z ŽENSKÉ perspektivy.`);
    lines.push(`  Používá důsledně ženské rodové tvary (řekla, udělala, byla jsem...).`);
  }
  if (preventRoleSwitch) {
    lines.push(`  Nikdy nepřebírá roli, hlas ani perspektivu ostatních mluvčích.`);
  }
  lines.push("");
  
  // Mluvčí 2
  const name2 = speaker2Name || "Mluvčí 2";
  if (speaker2gender === "male") {
    lines.push(`- ${name2} je MUŽ.`);
    lines.push(`  Mluví výhradně MUŽSKÝM hlasem a z MUŽSKÉ perspektivy.`);
    lines.push(`  Používá důsledně mužské rodové tvary (řekl, udělal, byl jsem...).`);
  } else if (speaker2gender === "female") {
    lines.push(`- ${name2} je ŽENA.`);
    lines.push(`  Mluví výhradně ŽENSKÝM hlasem a z ŽENSKÉ perspektivy.`);
    lines.push(`  Používá důsledně ženské rodové tvary (řekla, udělala, byla jsem...).`);
  }
  if (preventRoleSwitch) {
    lines.push(`  Nikdy nepřebírá roli, hlas ani perspektivu ostatních mluvčích.`);
  }
  lines.push("");
  
  // Globální pravidla
  lines.push("GLOBÁLNÍ PRAVIDLA ROLE LOCK:");
  lines.push("- Každý mluvčí musí po celou dobu audia dodržovat svou identitu, hlas a jazykové tvary.");
  lines.push("- Mluvčí si nesmí přebírat repliky, role ani vypravěčskou perspektivu.");
  lines.push("- Každá replika musí být jasně přiřazena jednomu mluvčímu.");
  
  if (enforceGenderForms) {
    lines.push("- V češtině VŽDY používej správné rodové tvary podle pohlaví mluvčího.");
    lines.push("- Kontroluj shodu podmětu a přísudku (on řekl / ona řekla).");
  }
  
  if (autoCorrectRole) {
    lines.push("");
    lines.push("AUTOMATICKÁ SEBEKOREKCE:");
    lines.push("- Pokud by došlo k porušení role (špatný rod, hlas nebo perspektiva),");
    lines.push("  okamžitě se vrať k poslední správné replice a pokračuj správně v dané roli.");
  }
  
  return lines;
};

// Generování promptu pro Audio - část CUSTOMIZE
const buildAudioCustomizePrompt = () => {
  const lines = [];
  
  // Povinná instrukce na začátku
  lines.push("⚠️ DŮLEŽITÉ:");
  lines.push("Dokument SCÉNÁŘ není zdroj informací ke shrnutí, ale PŘÍSNÉ REŽIJNÍ ZADÁNÍ.");
  lines.push("Vaším úkolem je tento dokument PŘEHRÁT (perform), nikoliv o něm referovat.");
  lines.push("Nikdy nezmiňujte existenci scénáře ani jeho název.");
  lines.push("Začněte rovnou první replikou v roli.");
  lines.push("");
  lines.push("---");
  lines.push("");
  
  const topic = getValue("topic");
  const duration = getValue("duration");
  const language = getValue("outputLanguage");
  const targetGroup = getValue("targetGroup");
  const depthLevel = getValue("depthLevel");
  const narrationStyle = getValue("narrationStyle");
  const narrationTone = getValue("narrationTone");
  const pacing = getValue("pacing");
  const structure = getValue("structure");
  const transitions = getValue("transitions");
  const summaryAtEnd = getValue("summaryAtEnd");
  const focusOn = getValue("focusOn");
  const omit = getValue("omit");
  const sourceHandling = getValue("sourceHandling");
  const repetitionLevel = getValue("repetitionLevel");
  
  const selectedNarration = narrationStyles[narrationStyle];
  
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
  lines.push("");
  
  // Dynamika dialogu
  const speakerBalance = getValue("speakerBalance");
  const structureLevel = getValue("structureLevel");
  const silenceHandling = getValue("silenceHandling");
  const implicitStructure = getChecked("implicitStructure");
  const noMetaComments = getChecked("noMetaComments");
  const subtleVulgarity = getChecked("subtleVulgarity");
  const allowOverlap = getChecked("allowOverlap");
  
  lines.push("DYNAMIKA DIALOGU:");
  
  if (speakerBalance === "speaker1_leads") {
    lines.push("- Mluvčí 1 nese hlavní obsah a vede konverzaci.");
    lines.push("- Mluvčí 2 reaguje, komentuje, ptá se, přidává humor.");
  } else if (speakerBalance === "speaker2_leads") {
    lines.push("- Mluvčí 2 nese hlavní obsah a vede konverzaci.");
    lines.push("- Mluvčí 1 reaguje, komentuje, ptá se, přidává humor.");
  } else {
    lines.push("- Oba mluvčí přispívají rovnocenně.");
    lines.push("- Přirozená výměna názorů a myšlenek.");
  }
  
  if (structureLevel === "low") {
    lines.push("- Struktura: Volná, přirozený rozhovor s odbočkami.");
  } else if (structureLevel === "high") {
    lines.push("- Struktura: Jasné tematické bloky, ale BEZ pojmenování kapitol.");
  } else {
    lines.push("- Struktura: Střední - jasný tok, organické přechody.");
  }
  
  if (silenceHandling === "minimum") {
    lines.push("- Minimální pauzy, plynulá energie.");
  } else if (silenceHandling === "dramatic") {
    lines.push("- Používej výrazné ticho když něco dolehne. Nech momenty dýchat.");
  } else {
    lines.push("- Přirozené pauzy pro důraz a reflexi.");
  }
  lines.push("");
  
  // Pravidla projevu
  lines.push("PRAVIDLA PROJEVU:");
  
  if (implicitStructure) {
    lines.push("- NIKDY neříkej 'teď kapitola', 'pojďme shrnout', 'v této části'.");
    lines.push("- Struktura musí být CÍTĚNA z toku řeči, nikdy oznamována.");
  }
  
  if (noMetaComments) {
    lines.push("- ŽÁDNÁ meta-komentáře: nikdy neříkej 'v tomto podcastu', 'jak probíráme'.");
    lines.push("- Zůstaň PLNĚ V ROLI. Mluv pouze jako postavy, nikdy jako moderátoři.");
  }
  
  if (subtleVulgarity) {
    lines.push("- Používej české vulgarismy JEN když to sedí situaci.");
    lines.push("- Ne pro šok nebo konstantní komedii. Situační a autentické.");
  }
  
  if (allowOverlap) {
    lines.push("- Zahrnuj přirozenou spontánnost: smích, překrývání hlasů, přerušení.");
    lines.push("- Dialog musí znít autenticky a nescenárovaně.");
  }
  lines.push("");
  
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
  if (focusOn) lines.push(`- Zaměřit se na: ${focusOn}`);
  if (omit) lines.push(`- Vynechat: ${omit}`);
  
  // Audio-specifická omezení
  lines.push("");
  lines.push("⚠️ AUDIO OMEZENÍ:");
  lines.push("- Žádné odkazy na vizuály ('jak vidíte na obrázku')");
  lines.push("- Žádné členění podle slideů");
  lines.push("- Vše musí fungovat čistě zvukově");
  
  return lines.join("\n");
};

// Generování promptu pro Audio - část ZDROJ (postavy)
const buildAudioSourcePrompt = () => {
  const lines = [];
  const speaker1 = getValue("speaker1");
  const speaker2 = getValue("speaker2");
  const speaker1personality = getValue("speaker1personality");
  const speaker2personality = getValue("speaker2personality");
  const audioContext = getValue("audioContext");
  const literaryStyle = getValue("literaryStyle");
  const filmStyle = getValue("filmStyle");
  const styleInspiration = getValue("styleInspiration");
  
  const personality1 = speakerPersonalities[speaker1personality];
  const personality2 = speakerPersonalities[speaker2personality];
  const literary = literaryStyles[literaryStyle];
  const film = filmStyles[filmStyle];
  
  lines.push("=== CHARAKTERY MLUVČÍCH ===");
  lines.push("");
  
  // Mluvčí 1
  const name1 = speaker1 || "Mluvčí 1";
  lines.push(`📌 ${name1.toUpperCase()}`);
  if (personality1) {
    lines.push(`Osobnost: ${personality1.label}`);
    lines.push(`Charakteristika: ${personality1.desc}`);
    lines.push(`Styl projevu: ${personality1.instruction}`);
  }
  
  // ROLE LOCK pro mluvčího 1
  const roleLockEnabled = getChecked("roleLockEnabled");
  const speaker1gender = getValue("speaker1gender");
  if (roleLockEnabled && speaker1gender) {
    lines.push("");
    if (speaker1gender === "male") {
      lines.push(`🔒 ROLE LOCK: ${name1} je MUŽ.`);
      lines.push(`   Mluví výhradně MUŽSKÝM hlasem a z MUŽSKÉ perspektivy.`);
      lines.push(`   Používá důsledně mužské rodové tvary (řekl, udělal, byl jsem...).`);
    } else {
      lines.push(`🔒 ROLE LOCK: ${name1} je ŽENA.`);
      lines.push(`   Mluví výhradně ŽENSKÝM hlasem a z ŽENSKÉ perspektivy.`);
      lines.push(`   Používá důsledně ženské rodové tvary (řekla, udělala, byla jsem...).`);
    }
  }
  lines.push("");
  
  // Mluvčí 2
  const name2 = speaker2 || "Mluvčí 2";
  lines.push(`📌 ${name2.toUpperCase()}`);
  if (personality2) {
    lines.push(`Osobnost: ${personality2.label}`);
    lines.push(`Charakteristika: ${personality2.desc}`);
    lines.push(`Styl projevu: ${personality2.instruction}`);
  }
  
  // ROLE LOCK pro mluvčího 2
  const speaker2gender = getValue("speaker2gender");
  if (roleLockEnabled && speaker2gender) {
    lines.push("");
    if (speaker2gender === "male") {
      lines.push(`🔒 ROLE LOCK: ${name2} je MUŽ.`);
      lines.push(`   Mluví výhradně MUŽSKÝM hlasem a z MUŽSKÉ perspektivy.`);
      lines.push(`   Používá důsledně mužské rodové tvary (řekl, udělal, byl jsem...).`);
    } else {
      lines.push(`🔒 ROLE LOCK: ${name2} je ŽENA.`);
      lines.push(`   Mluví výhradně ŽENSKÝM hlasem a z ŽENSKÉ perspektivy.`);
      lines.push(`   Používá důsledně ženské rodové tvary (řekla, udělala, byla jsem...).`);
    }
  }
  lines.push("");
  
  // Kontext a scénář
  if (audioContext) {
    lines.push("=== SCÉNÁŘ / KONTEXT ===");
    lines.push(audioContext);
    lines.push("");
  }
  
  // Literární a filmový styl
  if (literary || film || styleInspiration) {
    lines.push("=== INSPIRACE A STYL ===");
    if (literary) {
      lines.push(`Literární styl: ${literary.label}`);
      lines.push(`→ ${literary.instruction}`);
    }
    if (film) {
      lines.push(`Filmová dynamika: ${film.label}`);
      lines.push(`→ ${film.instruction}`);
    }
    if (styleInspiration) {
      lines.push(`Inspirace: ${styleInspiration}`);
    }
    lines.push("");
  }
  
  // ROLE LOCK globální pravidla
  if (roleLockEnabled) {
    const enforceGenderForms = getChecked("enforceGenderForms");
    const preventRoleSwitch = getChecked("preventRoleSwitch");
    const autoCorrectRole = getChecked("autoCorrectRole");
    
    lines.push("=== ROLE LOCK - ZÁVAZNÁ PRAVIDLA ===");
    lines.push("- Každý mluvčí musí po celou dobu dodržovat svou identitu a hlas.");
    lines.push("- Mluvčí si nesmí přebírat repliky, role ani perspektivu.");
    lines.push("- Každá replika musí být jasně přiřazena jednomu mluvčímu.");
    
    if (enforceGenderForms) {
      lines.push("- V češtině VŽDY používej správné rodové tvary podle pohlaví.");
    }
    if (preventRoleSwitch) {
      lines.push("- ZAKÁZÁNO přebírat styl, hlas nebo perspektivu druhého mluvčího.");
    }
    if (autoCorrectRole) {
      lines.push("- Při porušení role se okamžitě vrať a pokračuj správně.");
    }
  }
  
  return lines.join("\n");
};

// Přepínání output sekcí podle typu média (function declaration pro hoisting)
function updateOutputSections() {
  const mediaType = getValue("mediaType");
  const videoSection = document.getElementById("videoOutputSection");
  const audioSection = document.getElementById("audioOutputSection");
  
  if (mediaType === "Audio") {
    if (videoSection) videoSection.style.display = "none";
    if (audioSection) audioSection.style.display = "block";
  } else {
    if (videoSection) videoSection.style.display = "block";
    if (audioSection) audioSection.style.display = "none";
  }
}

const updateOutput = () => {
  const topic = getValue("topic");
  const mediaType = getValue("mediaType");
  
  // Přepni output sekce
  updateOutputSections();
  
  if (!topic) {
    if (mediaType === "Audio") {
      document.getElementById("audioCustomizeOutput").value = "Vyplňte téma a vygenerujte prompt.";
      document.getElementById("audioSourceOutput").value = "";
    } else {
      output.value = "Vyplňte téma a vygenerujte prompt.";
    }
    return;
  }
  
  // Validace ROLE LOCK - pohlaví musí být vyplněno
  const roleLockEnabled = getChecked("roleLockEnabled");
  if (mediaType === "Audio" && roleLockEnabled) {
    const speaker1gender = getValue("speaker1gender");
    const speaker2gender = getValue("speaker2gender");
    if (!speaker1gender || !speaker2gender) {
      document.getElementById("audioCustomizeOutput").value = "⚠️ ROLE LOCK je zapnutý, ale nemáte vyplněné pohlaví mluvčích.\n\nPro správné fungování ROLE LOCK vyplňte pohlaví obou mluvčích, nebo vypněte ROLE LOCK.";
      document.getElementById("audioSourceOutput").value = "";
      return;
    }
  }
  
  try {
    if (mediaType === "Audio") {
      // Dva oddělené výstupy pro Audio
      const customizePrompt = buildAudioCustomizePrompt();
      const sourcePrompt = buildAudioSourcePrompt();
      document.getElementById("audioCustomizeOutput").value = customizePrompt;
      document.getElementById("audioSourceOutput").value = sourcePrompt;
    } else {
      // Jeden výstup pro Video
      const prompt = buildPrompt();
      output.value = prompt;
    }
  } catch (error) {
    console.error("Error generating prompt:", error);
    if (mediaType === "Audio") {
      document.getElementById("audioCustomizeOutput").value = "Chyba při generování promptu.";
      document.getElementById("audioSourceOutput").value = "";
    } else {
      output.value = "Chyba při generování promptu. Zkontrolujte konzoli prohlížeče.";
    }
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

// Event listenery pro Audio copy buttons
document.querySelectorAll(".copy-btn[data-target]").forEach(btn => {
  btn.addEventListener("click", async () => {
    const targetId = btn.getAttribute("data-target");
    const textarea = document.getElementById(targetId);
    const statusEl = btn.nextElementSibling;
    if (textarea) {
      try {
        await navigator.clipboard.writeText(textarea.value);
        if (statusEl) {
          statusEl.textContent = "✓ Zkopírováno";
          setTimeout(() => { statusEl.textContent = ""; }, 2000);
        }
      } catch {
        if (statusEl) statusEl.textContent = "Kopírování se nezdařilo.";
      }
    }
  });
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
updateOutputSections();
updateArtStyleVisibility();
updateNarrationInfo();
updateArtStyleInfo();
output.value = "Vyplňte téma a vygenerujte prompt.";
