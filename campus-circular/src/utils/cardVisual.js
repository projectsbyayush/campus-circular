export const getCardVisual = (resource) => {
  if (!resource) return { icon: "fa-solid fa-box", bg: "linear-gradient(135deg, #64748b, #475569)" };
  const name = resource.name.toLowerCase();
  // Name-specific icons (most specific first)
  if (name.includes("canon") || name.includes("sony") || name.includes("camera") && name.includes("eos")) return { icon: "fa-solid fa-camera", bg: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" };
  if (name.includes("sony alpha")) return { icon: "fa-solid fa-camera", bg: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" };
  if (name.includes("tripod")) return { icon: "fa-solid fa-video", bg: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)" };
  if (name.includes("microphone") || name.includes("mic set") || name.includes("mic stand")) {
    if (name.includes("stand")) return { icon: "fa-solid fa-microscope", bg: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" };
    return { icon: "fa-solid fa-microphone", bg: "linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)" };
  }
  if (name.includes("ring light") || name.includes("led video light")) return { icon: "fa-solid fa-lightbulb", bg: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)" };
  if (name.includes("calculator") || name.includes("casio")) return { icon: "fa-solid fa-calculator", bg: "linear-gradient(135deg, #6366f1 0%, #1e40af 100%)" };
  if (name.includes("engineering drawing kit")) return { icon: "fa-solid fa-ruler-combined", bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" };
  if (name.includes("textbook") || name.includes("question paper")) {
    if (name.includes("mathematics")) return { icon: "fa-solid fa-square-root-variable", bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" };
    if (name.includes("data structures")) return { icon: "fa-solid fa-diagram-project", bg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" };
    if (name.includes("java")) return { icon: "fa-brands fa-java", bg: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)" };
    if (name.includes("dbms")) return { icon: "fa-solid fa-database", bg: "linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)" };
    if (name.includes("operating")) return { icon: "fa-brands fa-windows", bg: "linear-gradient(135deg, #06b6d4 0%, #0ea5e9 100%)" };
    return { icon: "fa-solid fa-book-open", bg: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" };
  }
  if (name.includes("arduino") || name.includes("esp32") || name.includes("raspberry")) return { icon: "fa-solid fa-microchip", bg: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" };
  if (name.includes("breadboard") || name.includes("jumper")) return { icon: "fa-solid fa-plug", bg: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)" };
  if (name.includes("multimeter")) return { icon: "fa-solid fa-bolt", bg: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)" };
  if (name.includes("soldering")) return { icon: "fa-solid fa-fire", bg: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)" };
  if (name.includes("electronics components")) return { icon: "fa-solid fa-toolbox", bg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" };
  if (name.includes("laptop") || name.includes("asus") || name.includes("dell")) return { icon: "fa-solid fa-laptop", bg: "linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)" };
  if (name.includes("hdmi")) return { icon: "fa-solid fa-plug-circle-bolt", bg: "linear-gradient(135deg, #64748b 0%, #475569 100%)" };
  if (name.includes("projector")) {
    if (name.includes("screen")) return { icon: "fa-solid fa-film", bg: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)" };
    return { icon: "fa-solid fa-video", bg: "linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%)" };
  }
  if (name.includes("extension") || name.includes("cable")) return { icon: "fa-solid fa-plug", bg: "linear-gradient(135deg, #64748b 0%, #475569 100%)" };
  if (name.includes("camera bag")) return { icon: "fa-solid fa-bag-shopping", bg: "linear-gradient(135deg, #ec4899 0%, #6366f1 100%)" };
  if (name.includes("decoration") || name.includes("fairy lights")) return { icon: "fa-solid fa-wand-magic-sparkles", bg: "linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)" };
  if (name.includes("pa speaker") || name.includes("portable") && name.includes("speaker")) return { icon: "fa-solid fa-volume-high", bg: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)" };
  if (name.includes("whiteboard")) return { icon: "fa-solid fa-chalkboard", bg: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" };
  if (name.includes("display stand")) return { icon: "fa-solid fa-sign-hanging", bg: "linear-gradient(135deg, #f59e0b 0%, #ec4899 100%)" };
  if (name.includes("cricket bat")) return { icon: "fa-solid fa-baseball-bat-ball", bg: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)" };
  if (name.includes("cricket ball")) return { icon: "fa-solid fa-baseball", bg: "linear-gradient(135deg, #ef4444 0%, #f59e0b 100%)" };
  if (name.includes("football")) return { icon: "fa-solid fa-futbol", bg: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)" };
  if (name.includes("badminton")) {
    if (name.includes("shuttle")) return { icon: "fa-solid fa-feather", bg: "linear-gradient(135deg, #06b6d4 0%, #ec4899 100%)" };
    return { icon: "fa-solid fa-table-tennis-paddle-ball", bg: "linear-gradient(135deg, #10b981 0%, #22c55e 100%)" };
  }
  if (name.includes("volleyball")) return { icon: "fa-solid fa-volleyball", bg: "linear-gradient(135deg, #f59e0b 0%, #10b981 100%)" };
  if (name.includes("table tennis")) return { icon: "fa-solid fa-table-tennis-paddle-ball", bg: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)" };
  if (name.includes("guitar")) {
    if (name.includes("amplifier")) return { icon: "fa-solid fa-volume-high", bg: "linear-gradient(135deg, #8b5cf6 0%, #1e293b 100%)" };
    return { icon: "fa-solid fa-guitar", bg: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)" };
  }
  if (name.includes("midi") || name.includes("keyboard")) return { icon: "fa-solid fa-keyboard", bg: "linear-gradient(135deg, #1e293b 0%, #8b5cf6 100%)" };
  if (name.includes("caj")) return { icon: "fa-solid fa-drum", bg: "linear-gradient(135deg, #92400e 0%, #f59e0b 100%)" };
  if (name.includes("desk lamp") || name.includes("lamp")) return { icon: "fa-regular fa-lightbulb", bg: "linear-gradient(135deg, #f59e0b 0%, #eab308 100%)" };
  if (name.includes("speaker")) return { icon: "fa-solid fa-volume-high", bg: "linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)" };

  // Fallback by category
  const catMap = {
    Cameras: { icon: "fa-solid fa-camera", bg: "linear-gradient(135deg, #ec4899, #8b5cf6)" },
    Electronics: { icon: "fa-solid fa-microchip", bg: "linear-gradient(135deg, #6366f1, #06b6d4)" },
    Textbooks: { icon: "fa-solid fa-book", bg: "linear-gradient(135deg, #f59e0b, #d97706)" },
    Sports: { icon: "fa-solid fa-medal", bg: "linear-gradient(135deg, #10b981, #06b6d4)" },
    Musical: { icon: "fa-solid fa-music", bg: "linear-gradient(135deg, #8b5cf6, #ec4899)" },
    Event: { icon: "fa-solid fa-star", bg: "linear-gradient(135deg, #06b6d4, #8b5cf6)" },
    Other: { icon: "fa-solid fa-box", bg: "linear-gradient(135deg, #64748b, #475569)" },
  };
  return catMap[resource.category] || { icon: "fa-solid fa-box", bg: "linear-gradient(135deg, #64748b, #475569)" };
};
