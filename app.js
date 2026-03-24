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

function updateOutputSections() {
  const media = document.querySelector('input[name="mediaType"]:checked')?.value || "Video";
  const videoSec = document.getElementById("videoOutputSection");
  const audioSec = document.getElementById("audioOutputSection");
  const cinematicSec = document.getElementById("cinematicOutputSection");
  if (!videoSec || !audioSec) return;
  if (media === "CinematicOverview") {
    videoSec.style.display = "none";
    audioSec.style.display = "none";
    if (cinematicSec) cinematicSec.style.display = "block";
  } else if (media === "Audio") {
    videoSec.style.display = "none";
    audioSec.style.display = "block";
    if (cinematicSec) cinematicSec.style.display = "none";
  } else {
    videoSec.style.display = "block";
    audioSec.style.display = "none";
    if (cinematicSec) cinematicSec.style.display = "none";
  }
}

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
  // 🎭 Emocionální / narativní styly
  "Caravaggio – dramatický kontrast": {
    visual: "Dramatický kontrast světla a tmy, chiaroscuro efekt.",
    narration: "Silné příběhy, konflikty, morální dilemata.",
    avoid: "Avoid flat lighting, cheerful colors.",
    prompt: "Visual style inspired by Caravaggio: dramatic chiaroscuro, strong light-dark contrasts. Powerful storytelling about conflicts and moral dilemmas."
  },
  "Romantismus (Delacroix / Goya)": {
    visual: "Emoce, pohyb, dramatické scény, dějiny jako drama.",
    narration: "Emotivní, dramatické, pohnuté.",
    avoid: "Avoid static compositions, cold rational approach.",
    prompt: "Romantic visual style inspired by Delacroix and Goya: emotion, movement, dramatic scenes. History presented as drama with emotional depth."
  },
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
  "Edward Hopper – civilní realismus": {
    visual: "Ticho, prostor, moderní každodennost.",
    narration: "Pomalé, pozorovatelské.",
    avoid: "Avoid dynamic effects, strong stylization.",
    prompt: "Style inspired by Edward Hopper: quiet spaces, modern everyday life. Slow, observational narration."
  },
  
  // 🧠 Myšlenkové / konceptuální styly
  "Wassily Kandinsky – abstraktní struktura": {
    visual: "Abstraktní tvary, barvy jako pojmy, struktura myšlenek.",
    narration: "Pojmy, vztahy, ideje.",
    avoid: "Avoid realistic imagery, literal representations.",
    prompt: "Abstract visual style inspired by Kandinsky: shapes and colors representing concepts and ideas. Narration focused on relationships and abstract thinking."
  },
  "Bauhaus – infografická čistota": {
    visual: "Geometrie, čisté linie, funkčnost, infografický přístup.",
    narration: "Jasné, krokové, logické, systémové.",
    avoid: "Avoid ornaments, decorative elements.",
    prompt: "Bauhaus infographic style: clean geometry, functional design, systematic approach. Clear step-by-step logical explanation of processes."
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
  
  // 🏛️ Historicko-didaktické styly
  "Renesanční ilustrace / da Vinci styl": {
    visual: "Anatomické studie, technické skicy, vysvětlující kresby.",
    narration: "Vysvětlování principů, technika, jak věci fungují.",
    avoid: "Avoid modern graphics, abstract shapes.",
    prompt: "Renaissance illustration style inspired by da Vinci: anatomical studies, technical sketches, explanatory drawings. Narration explaining principles and mechanisms."
  },
  "Barokní rytina / učebnicová grafika 18. stol.": {
    visual: "Rytiny, křížové šrafování, učebnicové ilustrace.",
    narration: "Vývoj, kauzalita, jak to funguje.",
    avoid: "Avoid modern photography, digital effects.",
    prompt: "Baroque engraving style: cross-hatching, textbook illustrations from 18th century. Narration focused on development, causality, how things work."
  },
  "Středověká iluminace / kronika": {
    visual: "Pergamen, ruční kresba, schémata.",
    narration: "Kronikářské, příběhové.",
    avoid: "Avoid modern photos, contemporary graphics.",
    prompt: "Medieval illumination style: parchment textures, hand-drawn schemas. Chronicle-like storytelling narration."
  },
  "Alfons Mucha – secesní didaktika": {
    visual: "Ornamenty, dekorativní linie, secesní styl.",
    narration: "Klidné, kultivované, vysvětlující.",
    avoid: "Avoid modern tech-UI look.",
    prompt: "Art Nouveau style inspired by Mucha: ornamental, decorative lines. Calm, cultivated explanatory narration."
  },
  
  // 📰 Moderní výkladové styly
  "Retro edukační plakáty 50.–60. let": {
    visual: "Jasné barvy, jednoduché tvary, retro estetika, plakátový styl.",
    narration: "Jasné sdělení, jednoduché metafory.",
    avoid: "Avoid complex gradients, photorealistic elements.",
    prompt: "Retro educational poster style from 1950s-60s: clear colors, simple shapes, vintage aesthetic. Clear messaging with simple metaphors."
  },
  "Whiteboard / ručně kreslené schéma": {
    visual: "Ručně kreslené čáry, schémata, kroky, whiteboard estetika.",
    narration: "Procesy, kroky, vysvětlování krok za krokem.",
    avoid: "Avoid polished graphics, photographic elements.",
    prompt: "Whiteboard hand-drawn style: sketchy lines, diagrams, step-by-step schemas. Narration explaining processes and steps clearly."
  },
  
  // 🌍 Kulturně-stylové přístupy
  "Japonská minimalistická ilustrace": {
    visual: "Klid, rovnováha, prázdný prostor, minimalistické linie.",
    narration: "Přehlednost, klid, harmonie.",
    avoid: "Avoid cluttered compositions, loud colors.",
    prompt: "Japanese minimalist illustration style: calm, balanced, empty space, clean lines. Clear, harmonious narration."
  },
  "Mexický lidový styl": {
    visual: "Tradiční motivy, symboly, živé barvy, kulturní vzory.",
    narration: "Tradice, symboly, kulturní rámec.",
    avoid: "Avoid generic modern graphics.",
    prompt: "Mexican folk art style: traditional motifs, symbols, vibrant colors, cultural patterns. Narration embedded in cultural context and traditions."
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

const updateMediaMode = () => {
  const media = getValue("mediaType");
  const studio = document.getElementById("studioFormContainer");
  const cinematic = document.getElementById("cinematicFormContainer");
  if (media === "CinematicOverview") {
    studio?.classList.add("is-hidden");
    cinematic?.classList.remove("is-hidden");
    updateOutputSections();
  } else {
    studio?.classList.remove("is-hidden");
    cinematic?.classList.add("is-hidden");
    updateVideoVisibility();
  }
};

// --- Cinematic Overview (NotebookLM) ---
const cinematicTemplates = {
  english: {
    coTopic: "Daily routine",
    coLanguageLevel: "B1 – Intermediate",
    coGrammarFocus: "present simple",
    coGrammarCustom: "",
    coNarrativeStyle: "instructional (teaching style)",
    coVisualStyle: "documentary",
    coMood: "friendly",
    coCamera: ["wide shot", "medium shot", "close-up"],
    coCameraSequence: "Wide shot → medium shot → close-up",
    coMusic: "ambient calm",
    coPacing: "medium",
    coAdditional: "simple vocabulary, clear examples, no subtitles",
    coNegative: ["no subtitles", "no rapid cuts", "no chaotic camera movement"]
  },
  technical: {
    coTopic: "Electric circuits basics",
    coLanguageLevel: "B2 – Upper-intermediate",
    coGrammarFocus: "passive voice",
    coGrammarCustom: "",
    coNarrativeStyle: "instructional (teaching style)",
    coVisualStyle: "realistic (live-action)",
    coMood: "neutral",
    coCamera: ["medium shot", "close-up", "static camera"],
    coCameraSequence: "Medium shot → close-up → static shot",
    coMusic: "electronic background",
    coPacing: "medium",
    coAdditional: "labels on diagrams, step-by-step structure",
    coNegative: ["no cartoonish style", "no surreal visuals", "no distracting background elements"]
  }
};

const randomPools = {
  topics: [
    "Daily routine",
    "Morning habits",
    "Coffee culture",
    "Electric circuits",
    "Urban planning",
    "Climate basics",
    "Job interview tips",
    "Travel vocabulary"
  ],
  cameraSequence: [
    "Establishing shot → medium shot → close-up",
    "Wide shot → medium shot → close-up",
    "Wide shot → tracking shot → close-up",
    "Close-up → medium shot → wide shot",
    "Static shot → slow zoom → close-up",
    "Panoramic shot → wide shot → medium shot",
    "Drone shot → wide shot → close-up",
    "Medium shot → close-up → static shot",
    "Tracking shot → medium shot → close-up",
    "Wide shot → panoramic shot → close-up",
    "Close-up → tracking shot → wide shot",
    "Static shot → medium shot → wide shot",
    "Slow zoom → close-up → static shot",
    "Wide shot → drone shot → panoramic shot",
    "Medium shot → tracking shot → wide shot",
    "Panoramic shot → close-up → static shot",
    "Establishing shot → tracking shot → close-up",
    "Wide shot → detail shot → close-up",
    "Medium shot → detail shot → close-up"
  ],
  additional: [
    "no subtitles, single scene",
    "clear enunciation, simple vocabulary",
    "one narrator voice, calm pacing"
  ],
  negativePresets: [
    "no subtitles",
    "no on-screen text",
    "no extra labels",
    "no fast zooms",
    "no shaky camera",
    "no chaotic camera movement",
    "no rapid cuts",
    "no excessive transitions",
    "no overly dramatic effects",
    "no dark horror mood",
    "no cartoonish style",
    "no surreal visuals",
    "no distracting background elements",
    "no advanced vocabulary",
    "no slang",
    "no idioms",
    "no complex sentence structures",
    "no grammar explanation",
    "no off-topic scenes",
    "no multiple storylines",
    "no unnecessary characters"
  ]
};

const toggleCoGrammarCustom = () => {
  const sel = document.getElementById("coGrammarFocus");
  const wrap = document.getElementById("coGrammarCustomWrap");
  if (!sel || !wrap) return;
  const show = sel.value === "custom";
  wrap.classList.toggle("is-hidden", !show);
};

const toggleCoCameraSequenceCustom = () => {
  const sel = document.getElementById("coCameraSequence");
  const wrap = document.getElementById("coCameraSequenceCustomWrap");
  if (!sel || !wrap) return;
  const show = sel.value === "custom";
  wrap.classList.toggle("is-hidden", !show);
};

const toggleCoNegativeCustom = () => {
  const sel = document.getElementById("coNegative");
  const wrap = document.getElementById("coNegativeCustomWrap");
  if (!sel || !wrap) return;
  const hasCustom = Array.from(sel.selectedOptions).some((o) => o.value === "custom");
  wrap.classList.toggle("is-hidden", !hasCustom);
};

const getCoNegativeText = () => {
  const sel = document.getElementById("coNegative");
  if (!sel) return "(none)";
  const picked = Array.from(sel.selectedOptions).map((o) => o.value);
  if (picked.length === 0) return "(none)";
  const hasCustom = picked.includes("custom");
  const presets = picked.filter((v) => v !== "custom");
  const customText = getValue("coNegativeCustom").trim();
  const parts = [...presets];
  if (hasCustom && customText) parts.push(customText);
  if (hasCustom && !customText && presets.length === 0) return "custom (specify in field)";
  if (hasCustom && !customText && presets.length > 0) {
    return parts.join("; ");
  }
  if (!parts.length) return "(none)";
  return parts.join("; ");
};

const getCoGrammarText = () => {
  const focus = getValue("coGrammarFocus");
  if (focus === "custom") {
    const c = getValue("coGrammarCustom");
    return c || "custom (specify in instructions)";
  }
  return focus;
};

const getCoCameraText = () => {
  const sel = document.getElementById("coCamera");
  if (!sel) return "not specified";
  const picked = Array.from(sel.selectedOptions).map((o) => o.value);
  return picked.length ? picked.join(", ") : "not specified";
};

const getCoCameraSequenceText = () => {
  const v = getValue("coCameraSequence");
  if (v === "custom") {
    const c = getValue("coCameraSequenceCustom");
    return c.trim() || "custom (specify above)";
  }
  return v || "not specified";
};

const buildCinematicOverviewPrompt = () => {
  const topic = getValue("coTopic");
  const lang = getValue("coLanguageLevel");
  const grammar = getCoGrammarText();
  const narrative = getValue("coNarrativeStyle");
  const visual = getValue("coVisualStyle");
  const mood = getValue("coMood");
  const camera = getCoCameraText();
  const seq = getCoCameraSequenceText();
  const pacing = getValue("coPacing");
  const music = getValue("coMusic");
  const add = getValue("coAdditional").trim() || "(none)";
  const neg = getCoNegativeText();

  return [
    "Create a cinematic educational video.",
    "",
    `Topic: ${topic}`,
    `Target audience: learners at ${lang} level.`,
    `Use language appropriate for ${lang}.`,
    "",
    `Grammar focus: ${grammar}`,
    "",
    `Narrative style: ${narrative}`,
    "",
    `Visual style: ${visual}`,
    `Mood: ${mood}`,
    "",
    `Camera: ${camera}`,
    `Camera sequence: ${seq}`,
    "",
    `Pacing: ${pacing}`,
    "",
    `Music: ${music}`,
    "",
    "Additional instructions:",
    add,
    "",
    "Negative constraints:",
    neg
  ].join("\n");
};

const applyCinematicTemplate = (key) => {
  const t = cinematicTemplates[key];
  if (!t) return;
  document.getElementById("coTopic").value = t.coTopic;
  document.getElementById("coLanguageLevel").value = t.coLanguageLevel;
  document.getElementById("coGrammarFocus").value = t.coGrammarFocus;
  document.getElementById("coGrammarCustom").value = t.coGrammarCustom || "";
  toggleCoGrammarCustom();
  document.getElementById("coNarrativeStyle").value = t.coNarrativeStyle;
  document.getElementById("coVisualStyle").value = t.coVisualStyle;
  document.getElementById("coMood").value = t.coMood;
  const cam = document.getElementById("coCamera");
  if (cam) {
    Array.from(cam.options).forEach((opt) => {
      opt.selected = t.coCamera.includes(opt.value);
    });
  }
  const seqEl = document.getElementById("coCameraSequence");
  if (seqEl) {
    const opt = Array.from(seqEl.options).find((o) => o.value === t.coCameraSequence);
    if (opt) {
      seqEl.value = t.coCameraSequence;
      document.getElementById("coCameraSequenceCustom").value = "";
    } else {
      seqEl.value = "custom";
      document.getElementById("coCameraSequenceCustom").value = t.coCameraSequence;
    }
    toggleCoCameraSequenceCustom();
  }
  document.getElementById("coMusic").value = t.coMusic;
  document.getElementById("coPacing").value = t.coPacing;
  document.getElementById("coAdditional").value = t.coAdditional;
  const negSel = document.getElementById("coNegative");
  if (negSel) {
    Array.from(negSel.options).forEach((o) => { o.selected = false; });
    const list = Array.isArray(t.coNegative) ? t.coNegative : String(t.coNegative).split(",").map((s) => s.trim()).filter(Boolean);
    list.forEach((val) => {
      const opt = Array.from(negSel.options).find((o) => o.value === val);
      if (opt) opt.selected = true;
    });
    document.getElementById("coNegativeCustom").value = "";
    toggleCoNegativeCustom();
  }
};

const randomPick = (arr) => arr[Math.floor(Math.random() * arr.length)];

const randomFromSelect = (id) => {
  const el = document.getElementById(id);
  if (!el || el.options.length === 0) return;
  const opts = Array.from(el.options);
  const i = Math.floor(Math.random() * opts.length);
  el.selectedIndex = i;
};

const randomizeCinematicForm = () => {
  document.getElementById("coTopic").value = randomPick(randomPools.topics);
  randomFromSelect("coLanguageLevel");
  randomFromSelect("coGrammarFocus");
  toggleCoGrammarCustom();
  if (getValue("coGrammarFocus") === "custom") {
    document.getElementById("coGrammarCustom").value = randomPick([
      "mixed tenses",
      "reported speech",
      "conditionals in context"
    ]);
  } else {
    document.getElementById("coGrammarCustom").value = "";
  }
  randomFromSelect("coNarrativeStyle");
  randomFromSelect("coVisualStyle");
  randomFromSelect("coMood");
  const cam = document.getElementById("coCamera");
  if (cam) {
    Array.from(cam.options).forEach((o) => o.selected = false);
    const indices = new Set();
    const n = 2 + Math.floor(Math.random() * 3);
    while (indices.size < Math.min(n, cam.options.length)) {
      indices.add(Math.floor(Math.random() * cam.options.length));
    }
    indices.forEach((i) => { cam.options[i].selected = true; });
  }
  const seqSel = document.getElementById("coCameraSequence");
  if (seqSel && seqSel.options.length > 1) {
    seqSel.value = randomPick(randomPools.cameraSequence);
    document.getElementById("coCameraSequenceCustom").value = "";
    toggleCoCameraSequenceCustom();
  }
  randomFromSelect("coMusic");
  randomFromSelect("coPacing");
  document.getElementById("coAdditional").value = randomPick(randomPools.additional);
  const negSel = document.getElementById("coNegative");
  if (negSel) {
    Array.from(negSel.options).forEach((o) => { o.selected = false; });
    const pool = [...randomPools.negativePresets];
    const n = 2 + Math.floor(Math.random() * 5);
    const shuffled = pool.sort(() => Math.random() - 0.5);
    shuffled.slice(0, Math.min(n, pool.length)).forEach((val) => {
      const opt = Array.from(negSel.options).find((o) => o.value === val);
      if (opt) opt.selected = true;
    });
  }
  document.getElementById("coNegativeCustom").value = "";
  toggleCoNegativeCustom();
  document.getElementById("coTemplate").value = "";
};

const copyCinematicOutput = async (statusEl) => {
  const out = document.getElementById("cinematicOutput");
  if (!out?.value) return;
  try {
    await navigator.clipboard.writeText(out.value);
    if (statusEl) {
      statusEl.textContent = "✓ Zkopírováno";
      setTimeout(() => { statusEl.textContent = ""; }, 2000);
    }
  } catch {
    if (statusEl) statusEl.textContent = "Kopírování se nezdařilo.";
  }
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

// Generování kompletního promptu pro Audio - PEVNÁ STRUKTURA
const buildAudioPrompt = () => {
  const lines = [];
  
  // Získání hodnot z formuláře
  const topic = getValue("topic");
  const targetGroup = getValue("targetGroup");
  const depthLevel = getValue("depthLevel");
  const narrationStyle = getValue("narrationStyle");
  const narrationTone = getValue("narrationTone");
  const pacing = getValue("pacing");
  const focusOn = getValue("focusOn");
  const notes = getValue("notes");
  const omit = getValue("omit");
  const speakerBalance = getValue("speakerBalance");
  const speaker1 = getValue("speaker1") || "Mluvčí 1";
  const speaker2 = getValue("speaker2") || "Mluvčí 2";
  const useExamples = getChecked("useExamples");
  const useAnalogies = getChecked("useAnalogies");
  const explainTerms = getChecked("explainTerms");
  
  // Určení rolí mluvčích podle speakerBalance
  let role1 = "vysvětlující, nositel obsahu";
  let role2 = "reagující, doplňující, glosující";
  
  if (speakerBalance === "speaker2_leads") {
    role1 = "reagující, doplňující, glosující";
    role2 = "vysvětlující, nositel obsahu";
  } else if (speakerBalance === "equal") {
    role1 = "rovnocenný partner v dialogu";
    role2 = "rovnocenný partner v dialogu";
  }
  
  // Způsob vysvětlení
  const explanationMethods = [];
  if (useExamples) explanationMethods.push("příkladů z praxe");
  if (useAnalogies) explanationMethods.push("přirovnání");
  if (explainTerms) explanationMethods.push("vysvětlování pojmů");
  const explanationText = explanationMethods.length > 0 
    ? "pomocí " + explanationMethods.join(", ") 
    : "srozumitelně a přístupně";
  
  // === SEKCE 1: ROLE A SITUACE ===
  lines.push("🧠 ROLE A SITUACE");
  lines.push("");
  lines.push("Jste 2 mluvčí v audio rozhovoru.");
  lines.push("");
  lines.push(`Mluvčí 1: ${speaker1} – ${role1}`);
  lines.push("");
  lines.push(`Mluvčí 2: ${speaker2} – ${role2}`);
  lines.push("");
  lines.push("Chovejte se přirozeně, jako při skutečném rozhovoru.");
  lines.push("Mluvčí se nepředstavují, nemluví o sobě ani o tom, že jsou AI.");
  lines.push("");
  
  // === SEKCE 2: STYL VYPRÁVĚNÍ A JAZYK ===
  lines.push("🎙️ STYL VYPRÁVĚNÍ A JAZYK");
  lines.push("");
  lines.push(`Používejte ${narrationStyle.toLowerCase()} jazyk:`);
  lines.push("");
  lines.push(`tón: ${narrationTone.toLowerCase()}`);
  lines.push("");
  lines.push(`tempo: ${pacing.toLowerCase()}`);
  lines.push("");
  lines.push("jazyk: přirozený, srozumitelný, bez akademického formalismu");
  lines.push("");
  lines.push(`Vysvětlujte pojmy ${explanationText}.`);
  lines.push("");
  
  // === SEKCE 3: ZAMĚŘENÍ OBSAHU ===
  lines.push("🎯 ZAMĚŘENÍ OBSAHU");
  lines.push("");
  lines.push("Téma epizody:");
  lines.push(topic);
  lines.push("");
  lines.push("Zaměřte se na:");
  lines.push("");
  lines.push(focusOn || "základní principy a praktické dopady");
  lines.push("");
  lines.push("Přizpůsobte výklad publiku:");
  lines.push("");
  lines.push(`cílová skupina: ${targetGroup}`);
  lines.push("");
  lines.push(`úroveň hloubky: ${depthLevel}`);
  lines.push("");
  
  // === SEKCE 4: OMEZENÍ A PRAVIDLA ===
  lines.push("🚫 OMEZENÍ A PRAVIDLA");
  lines.push("");
  lines.push("Nemluvte o zdrojích, analýze dokumentů ani o struktuře rozhovoru");
  lines.push("");
  lines.push('Nepoužívejte meta-komentáře typu „v této části" nebo „teď si řekneme"');
  lines.push("");
  lines.push('Nemluvte k posluchači jako k „uživateli"');
  lines.push("");
  lines.push("Držte se role, nepřebírejte role druhého mluvčího");
  lines.push("");
  
  // === SEKCE 5: STRUKTURA (IMPLICITNÍ) ===
  lines.push("🧩 STRUKTURA (IMPLICITNÍ)");
  lines.push("");
  lines.push("Rozhovor má přirozený tok:");
  lines.push("");
  lines.push("krátký kontext → rozvinutí tématu → srozumitelné uzavření");
  lines.push("Strukturu nepojmenovávejte nahlas.");
  lines.push("");
  
  // === SEKCE 6: DODATEČNÉ INSTRUKCE (VOLITELNÉ) ===
  const additionalInstructions = [];
  if (omit) additionalInstructions.push(`vyhnout se: ${omit}`);
  if (notes) additionalInstructions.push(notes);
  if (useAnalogies) additionalInstructions.push("používat analogie");
  if (useExamples) additionalInstructions.push("uvádět praktické příklady");
  
  // ROLE LOCK instrukce
  const roleLockEnabled = getChecked("roleLockEnabled");
  if (roleLockEnabled) {
    const speaker1gender = getValue("speaker1gender");
    const speaker2gender = getValue("speaker2gender");
    
    if (speaker1gender === "male") {
      additionalInstructions.push(`${speaker1} je MUŽ – používá mužské rodové tvary (řekl, udělal, byl jsem)`);
    } else if (speaker1gender === "female") {
      additionalInstructions.push(`${speaker1} je ŽENA – používá ženské rodové tvary (řekla, udělala, byla jsem)`);
    }
    
    if (speaker2gender === "male") {
      additionalInstructions.push(`${speaker2} je MUŽ – používá mužské rodové tvary (řekl, udělal, byl jsem)`);
    } else if (speaker2gender === "female") {
      additionalInstructions.push(`${speaker2} je ŽENA – používá ženské rodové tvary (řekla, udělala, byla jsem)`);
    }
    
    additionalInstructions.push("Mluvčí si nesmí přebírat role ani perspektivu druhého");
  }
  
  if (additionalInstructions.length > 0) {
    lines.push("➕ DODATEČNÉ INSTRUKCE");
    lines.push("");
    additionalInstructions.forEach(instruction => {
      lines.push(`• ${instruction}`);
    });
  }
  
  return lines.join("\n");
};

// Generování Video promptu - část 1: VIZUÁLNÍ STYL
const buildVideoVisualPrompt = () => {
  const visualStyle = getValue("visualStyle");
  const artStyle = getValue("artStyle");
  const imageStyle = getValue("imageStyle");
  const colorTone = getValue("colorTone");
  const forbiddenElements = getValue("forbiddenElements");
  
  // Určení vizuálního stylu
  let visualStyleText = visualStyle;
  if (visualStyle === "Umělecký (vlastní)" && artStyle) {
    visualStyleText = artStyle;
  }
  
  const lines = [];
  lines.push(`Vizualizace videa by měla mít styl: ${visualStyleText}.`);
  lines.push("");
  lines.push("Prosím, zahrň:");
  lines.push(`- typ ilustrací: ${imageStyle}`);
  lines.push(`- barevnou atmosféru: ${colorTone}`);
  lines.push("");
  lines.push("Vyhni se abstraktním dekorativním tvarům a prvkům, které odvádějí pozornost od obsahu.");
  
  if (forbiddenElements) {
    lines.push("");
    lines.push(`Dále se vyhni: ${forbiddenElements}`);
  }
  
  return lines.join("\n");
};

// Generování Video promptu - část 2: AI MODERÁTOŘI SE ZAMĚŘÍ
const buildVideoContentPrompt = () => {
  const topic = getValue("topic");
  const targetGroup = getValue("targetGroup");
  const depthLevel = getValue("depthLevel");
  const focusOn = getValue("focusOn");
  const omit = getValue("omit");
  
  const lines = [];
  lines.push(`Toto video má vysvětlit hlavní téma: ${topic}.`);
  lines.push("");
  lines.push(`Cílové publikum je: ${targetGroup}.`);
  lines.push("");
  lines.push(`Úroveň hloubky má být: ${depthLevel}.`);
  lines.push("");
  lines.push("Prosím, soustřeď se především na:");
  lines.push(`- ${focusOn || "základní principy a praktické dopady"}`);
  lines.push("");
  lines.push("A neuváděj:");
  lines.push(`- ${omit || "zbytečné detaily a odbočky"}`);
  lines.push("");
  lines.push("Použij jasný, přirozený výklad založený na přiložených zdrojích. Snaž se propojit klíčové body logicky a srozumitelně.");
  
  return lines.join("\n");
};

const updateOutput = () => {
  const mediaType = getValue("mediaType");
  if (mediaType === "CinematicOverview") {
    return;
  }

  const topic = getValue("topic");
  
  if (!topic) {
    if (mediaType === "Audio") {
      output.value = "Vyplňte téma a vygenerujte prompt.";
    } else {
      document.getElementById("videoVisualOutput").value = "Vyplňte téma a vygenerujte prompt.";
      document.getElementById("videoContentOutput").value = "";
    }
    return;
  }
  
  // Validace ROLE LOCK - pohlaví musí být vyplněno (jen pro Audio)
  const roleLockEnabled = getChecked("roleLockEnabled");
  if (mediaType === "Audio" && roleLockEnabled) {
    const speaker1gender = getValue("speaker1gender");
    const speaker2gender = getValue("speaker2gender");
    if (!speaker1gender || !speaker2gender) {
      output.value = "⚠️ ROLE LOCK je zapnutý, ale nemáte vyplněné pohlaví mluvčích.\n\nPro správné fungování ROLE LOCK vyplňte pohlaví obou mluvčích, nebo vypněte ROLE LOCK.";
      return;
    }
  }
  
  try {
    if (mediaType === "Audio") {
      const prompt = buildAudioPrompt();
      output.value = prompt;
    } else {
      // Video - dvě části
      const visualPrompt = buildVideoVisualPrompt();
      const contentPrompt = buildVideoContentPrompt();
      document.getElementById("videoVisualOutput").value = visualPrompt;
      document.getElementById("videoContentOutput").value = contentPrompt;
    }
  } catch (error) {
    console.error("Error generating prompt:", error);
    if (mediaType === "Audio") {
      output.value = "Chyba při generování promptu. Zkontrolujte konzoli prohlížeče.";
    } else {
      document.getElementById("videoVisualOutput").value = "Chyba při generování promptu.";
      document.getElementById("videoContentOutput").value = "";
    }
  }
};

// Event listeners
document.querySelectorAll('input[name="mediaType"]').forEach((radio) => {
  radio.addEventListener("change", () => {
    updateMediaMode();
    if (getValue("mediaType") !== "CinematicOverview") {
      updateOutput();
    }
  });
});

document.getElementById("coGrammarFocus")?.addEventListener("change", toggleCoGrammarCustom);

document.getElementById("coCameraSequence")?.addEventListener("change", toggleCoCameraSequenceCustom);

document.getElementById("coNegative")?.addEventListener("change", toggleCoNegativeCustom);

document.getElementById("coTemplate")?.addEventListener("change", (e) => {
  const v = e.target.value;
  if (v === "english" || v === "technical") {
    applyCinematicTemplate(v);
  }
});

document.getElementById("cinematicForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const topic = getValue("coTopic");
  if (!topic) {
    document.getElementById("cinematicOutput").value = "Vyplňte téma (Topic).";
    return;
  }
  const text = buildCinematicOverviewPrompt();
  document.getElementById("cinematicOutput").value = text;
  document.getElementById("cinematicOutput").focus();
});

document.getElementById("coCopyBtn")?.addEventListener("click", () => {
  copyCinematicOutput(document.getElementById("coCopyStatus"));
});

document.getElementById("coRandomBtn")?.addEventListener("click", () => {
  randomizeCinematicForm();
});

document.getElementById("coResetBtn")?.addEventListener("click", () => {
  document.getElementById("cinematicForm")?.reset();
  document.getElementById("coTemplate").value = "";
  toggleCoGrammarCustom();
  toggleCoCameraSequenceCustom();
  toggleCoNegativeCustom();
  document.getElementById("cinematicOutput").value = "";
  document.getElementById("coCopyStatus").textContent = "";
});

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
  
  // Reset Audio output
  output.value = "Vyplňte téma a vygenerujte prompt.";
  copyStatus.textContent = "";
  
  // Reset Video outputs
  const videoVisualOutput = document.getElementById("videoVisualOutput");
  const videoContentOutput = document.getElementById("videoContentOutput");
  if (videoVisualOutput) videoVisualOutput.value = "Vyplňte téma a vygenerujte prompt.";
  if (videoContentOutput) videoContentOutput.value = "";
  
  // Reset output sections visibility (Video is default)
  const videoSection = document.getElementById("videoOutputSection");
  const audioSection = document.getElementById("audioOutputSection");
  if (videoSection) videoSection.style.display = "block";
  if (audioSection) audioSection.style.display = "none";
  
  // Reset ROLE LOCK options visibility
  const roleLockOptions = document.getElementById("roleLockOptions");
  if (roleLockOptions) roleLockOptions.classList.remove("hidden");
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

// Event listenery pro Video copy buttons
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

// Změna typu média: posluchače výše (updateMediaMode)

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
toggleCoGrammarCustom();
toggleCoCameraSequenceCustom();
toggleCoNegativeCustom();
output.value = "Vyplňte téma a vygenerujte prompt.";
