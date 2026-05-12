import { useState } from "react";

// ─── STRUCTURE ───────────────────────────────────────────────────────────────
// Cook days: Sunday (Mon+Tue dinners), Tuesday (Wed dinner), Thursday (Fri+Sat dinners)
// Lunch = previous night's dinner
// Proteins: pollo x2, salmón x1, merluza x1, carne picada x1, atún x1, sábado flexible
// Shopping: Monday (pollo+carne), Tuesday (frutas+verduras), Wednesday (pescado+pasta)
// Breakfast: rotates, either yogur-based OR café con leche based, never both
// Snack AM: banana or yogur, simple
// Merienda: complements protein gap for the day

const dinnersByDay = {
  Domingo:   { emoji: "🥗", name: "Bowl de atún con arroz y tomate", desc: "2 latas atún al natural (240g), 150g arroz cocido, tomate, cebolla morada, oliva, limón", kcal: 540, p: 54, c: 50, f: 10, cookDay: null, note: "Sin cocción — solo armás el bowl" },
  Lunes:     { emoji: "🍗", name: "Pollo al horno con boniato y brócoli", desc: "220g pechuga de pollo, 150g boniato en cubos, 200g brócoli congelado — asadera con oliva y sal, 200°C 25 min", kcal: 590, p: 52, c: 24, f: 12, cookDay: "domingo" },
  Martes:    { emoji: "🥩", name: "Carne picada con arroz y verduras", desc: "180g carne picada 90% magra, 150g arroz cocido, zanahoria, cebolla, tomate, ajo", kcal: 620, p: 48, c: 54, f: 16, cookDay: "domingo" },
  Miércoles: { emoji: "🐟", name: "Salmón al horno con calabaza", desc: "200g salmón, 200g calabaza en cubos — misma asadera, oliva y sal, 200°C 25 min", kcal: 620, p: 48, c: 30, f: 22, cookDay: "martes" },
  Jueves:    { emoji: "🍲", name: "Pollo con lentejas y verduras", desc: "120g pechuga pollo desmenuzada, 150g lentejas cocidas (1 lata), mezcla congelada brócoli+coliflor+zanahoria, ajo y oliva", kcal: 560, p: 52, c: 46, f: 8, cookDay: null, note: "Recalentás el tupper del miércoles" },
  Viernes:   { emoji: "🐟", name: "Merluza al horno con papa y ensalada", desc: "250g merluza, 150g papa hervida, lechuga, tomate, aceite de oliva y limón", kcal: 540, p: 52, c: 42, f: 10, cookDay: "jueves" },
  Sábado:    { emoji: "🍽️", name: "Comida flexible", desc: "Tu elección — usá las proteínas que queden en casa o salí a comer. Meta: ~600 kcal, ~45g proteína", kcal: 600, p: 45, c: 50, f: 15, cookDay: "jueves", flexible: true },
};

// Wait — fix Thursday: it cooks Friday+Saturday, so Thursday's own dinner comes from Tuesday's cook
// Tuesday cooks: Wednesday dinner (salmon) — so Thursday lunch = Wednesday dinner ✓
// Thursday cooks: Friday + Saturday dinners
// Thursday dinner itself = cooked Thursday (pollo con lentejas)

const breakfasts = {
  Lunes:     { emoji: "☕", name: "Café con leche + 2 huevos revueltos y tostada", desc: "250ml café con leche descremada, 2 huevos revueltos, 1 tostada integral", kcal: 420, p: 24, c: 26, f: 16 },
  Martes:    { emoji: "🥛", name: "Yogur griego con granola y fruta", desc: "200g yogur griego natural, 25g granola, 1 banana o fruta a elección", kcal: 380, p: 22, c: 46, f: 6 },
  Miércoles: { emoji: "☕", name: "Café con leche + huevo a la plancha y tostada", desc: "250ml café con leche descremada, 2 huevos a la plancha, 1 tostada integral", kcal: 400, p: 22, c: 24, f: 16 },
  Jueves:    { emoji: "🥛", name: "Yogur griego con tostada y fruta", desc: "200g yogur griego, 1 tostada integral con queso crema light, 1 fruta", kcal: 370, p: 22, c: 36, f: 8 },
  Viernes:   { emoji: "☕", name: "Café con leche + yogur griego", desc: "250ml café con leche descremada, 150g yogur griego natural", kcal: 330, p: 20, c: 22, f: 6 },
  Sábado:    { emoji: "🥛", name: "Yogur griego con granola y fruta", desc: "200g yogur griego, 25g granola, 1 fruta a elección", kcal: 380, p: 22, c: 46, f: 6 },
  Domingo:   { emoji: "☕", name: "Café con leche + tostadas con mantequilla de maní", desc: "250ml café con leche descremada, 2 tostadas integrales con mantequilla de maní", kcal: 420, p: 20, c: 36, f: 16 },
};

const morningSnacks = {
  Lunes:     { emoji: "🍌", name: "Banana", desc: "1 banana mediana", kcal: 90, p: 1, c: 23, f: 0 },
  Martes:    { emoji: "🥛", name: "Yogur griego", desc: "150g yogur griego natural", kcal: 130, p: 13, c: 8, f: 4 },
  Miércoles: { emoji: "🍌", name: "Banana", desc: "1 banana mediana", kcal: 90, p: 1, c: 23, f: 0 },
  Jueves:    { emoji: "🥛", name: "Yogur griego", desc: "150g yogur griego natural", kcal: 130, p: 13, c: 8, f: 4 },
  Viernes:   { emoji: "🍌", name: "Banana", desc: "1 banana mediana", kcal: 90, p: 1, c: 23, f: 0 },
  Sábado:    { emoji: "🍌", name: "Banana", desc: "1 banana mediana", kcal: 90, p: 1, c: 23, f: 0 },
  Domingo:   { emoji: "🥛", name: "Yogur griego", desc: "150g yogur griego natural", kcal: 130, p: 13, c: 8, f: 4 },
};

// Merienda complements protein gap — target ~180g/day total
// Lunch+dinner provide ~95-110g, breakfast ~20-25g, snack AM ~1-13g
// Gap to fill in merienda: ~40-60g protein needed from merienda
const afternoonSnacks = {
  Lunes:     { emoji: "🐟", name: "Tostada con atún + yogur griego", desc: "1 lata atún al natural + 1 tostada integral + 150g yogur griego", kcal: 310, p: 42, c: 18, f: 5 },
  Martes:    { emoji: "🐟", name: "Tostada con atún + yogur griego", desc: "1 lata atún al natural + 1 tostada integral + 150g yogur griego", kcal: 310, p: 42, c: 18, f: 5 },
  Miércoles: { emoji: "🥚", name: "2 huevos duros + yogur griego", desc: "2 huevos duros + 150g yogur griego natural", kcal: 270, p: 28, c: 8, f: 14 },
  Jueves:    { emoji: "🐟", name: "Tostada con atún + yogur griego", desc: "1 lata atún al natural + 1 tostada integral + 150g yogur griego", kcal: 310, p: 42, c: 18, f: 5 },
  Viernes:   { emoji: "🥚", name: "2 huevos duros + yogur griego", desc: "2 huevos duros + 150g yogur griego natural", kcal: 270, p: 28, c: 8, f: 14 },
  Sábado:    { emoji: "🐟", name: "Tostada con atún + yogur griego", desc: "1 lata atún al natural + 1 tostada integral + 150g yogur griego", kcal: 310, p: 42, c: 18, f: 5 },
  Domingo:   { emoji: "🥚", name: "2 huevos duros + tostada con queso crema", desc: "2 huevos duros + 1 tostada integral + queso crema light", kcal: 260, p: 22, c: 16, f: 12 },
};

const dayNames = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const prevDay = { Lunes: "Domingo", Martes: "Lunes", Miércoles: "Martes", Jueves: "Miércoles", Viernes: "Jueves", Sábado: "Viernes", Domingo: "Sábado" };

const plan = dayNames.map(day => {
  const dinner = dinnersByDay[day];
  const lunch = dinnersByDay[prevDay[day]];
  const breakfast = breakfasts[day];
  const ms = morningSnacks[day];
  const as = afternoonSnacks[day];
  return {
    day,
    kcal: breakfast.kcal + ms.kcal + lunch.kcal + as.kcal + dinner.kcal,
    protein: breakfast.p + ms.p + lunch.p + as.p + dinner.p,
    carbs: breakfast.c + ms.c + lunch.c + as.c + dinner.c,
    fat: breakfast.f + ms.f + lunch.f + as.f + dinner.f,
    breakfast, morningSnack: ms, lunch, afternoonSnack: as, dinner,
  };
});

const cookDays = {
  domingo: {
    label: "Cocina · Domingo",
    color: "#f97316",
    forDays: "Lunes · Martes",
    meals: [dinnersByDay.Lunes, dinnersByDay.Martes],
    tips: [
      "Pollo + boniato en asadera — 200°C, 25 min",
      "Brócoli congelado entra a la asadera los últimos 15 min",
      "Carne picada en sartén con arroz en olla — al mismo tiempo",
      "2 tuppers etiquetados: Lun / Mar",
      "Aprovechá y hervís 6 huevos duros para la semana",
    ],
    shopping: "🛒 Compraste el lunes: pollo + carne picada",
  },
  martes: {
    label: "Cocina · Martes",
    color: "#60A5FA",
    forDays: "Miércoles",
    meals: [dinnersByDay.Miércoles],
    tips: [
      "Salmón + calabaza en asadera — 200°C, 25 min",
      "Cocinás doble: 1 porción para la cena, 1 para el almuerzo del miércoles",
      "1 tupper etiquetado: Mié almuerzo",
    ],
    shopping: "🛒 Compraste hoy: salmón + pasta fresca",
  },
  jueves: {
    label: "Cocina · Jueves",
    color: "#C084FC",
    forDays: "Viernes · Sábado",
    meals: [dinnersByDay.Viernes, dinnersByDay.Sábado],
    tips: [
      "Merluza + papa en asadera — 200°C, 20 min",
      "Para el sábado dejás ingredientes listos (flexible) — no cocinás nada fijo",
      "1 tupper etiquetado: Vie almuerzo",
    ],
    shopping: "🛒 Compraste el miércoles: merluza",
  },
};

const shoppingDays = [
  {
    day: "Lunes",
    discount: "Pollo y carne",
    color: "#f97316",
    items: ["Pechuga de pollo (600g — para 2 cenas dobles)", "Carne picada 90% magra (400g — para 1 cena doble)"],
  },
  {
    day: "Martes",
    discount: "Frutas y verduras",
    color: "#4ADE80",
    items: ["Bananas (x5)", "Manzanas o frutas a elección (x4)", "Naranjas / mandarinas (x3)", "Brócoli congelado (x2 bolsas)", "Mezcla congelada brócoli+coliflor+zanahoria (x1 bolsa)", "Boniato (x2)", "Calabaza (ya tenés)", "Tomates (x6)", "Lechuga", "Cebolla morada", "Zanahoria (x3)", "Papa (x3)", "Zapallitos (ya tenés si quedan)"],
  },
  {
    day: "Miércoles",
    discount: "Pescados y pasta",
    color: "#60A5FA",
    items: ["Salmón fresco (400g — para cena doble)", "Merluza (500g — para cena doble)", "Pasta fresca (opcional, para reemplazar arroz algún día)"],
  },
  {
    day: "Siempre en casa",
    discount: "Sin descuento específico",
    color: "#94a3b8",
    items: ["Atún al natural (x8 latas)", "Huevos (x14)", "Yogur griego 0% (x10)", "Granola", "Pan integral / tostadas", "Queso crema light", "Mantequilla de maní", "Arroz (500g)", "Lentejas en lata (x2)", "Aceite de oliva", "Café", "Leche descremada"],
  },
];

const typeColors = {
  "Desayuno": "#FB923C",
  "Snack AM": "#4ADE80",
  "Almuerzo": "#60A5FA",
  "Merienda": "#C084FC",
  "Cena":     "#FB7185",
};

function ShoppingItem({ label }) {
  const [checked, setChecked] = useState(false);
  const isOwned = label.includes("ya tenés");
  return (
    <div onClick={() => !isOwned && setChecked(c => !c)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: isOwned ? "default" : "pointer", opacity: checked ? 0.35 : 1, transition: "opacity 0.2s" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0, border: isOwned ? "none" : checked ? "none" : "1.5px solid #475569", background: isOwned ? "#16a34a" : checked ? "linear-gradient(135deg, #f97316, #e11d48)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {(checked || isOwned) && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
      </div>
      <span style={{ fontSize: "14px", color: isOwned ? "#4ADE80" : "#e2e8f0", fontFamily: "sans-serif", textDecoration: checked ? "line-through" : "none" }}>{label}</span>
    </div>
  );
}

function MealCard({ type, meal }) {
  const dot = typeColors[type];
  const isLunch = type === "Almuerzo";
  return (
    <div style={{ background: "rgba(30,41,59,0.7)", border: `1px solid ${isLunch ? "rgba(96,165,250,0.3)" : "#334155"}`, borderRadius: "14px", padding: "14px 16px", borderLeft: `4px solid ${dot}`, position: "relative" }}>
      {isLunch && (
        <div style={{ position: "absolute", top: "10px", right: "12px", fontSize: "10px", color: "#60A5FA", fontFamily: "sans-serif", background: "rgba(96,165,250,0.1)", padding: "2px 8px", borderRadius: "999px", border: "1px solid rgba(96,165,250,0.3)" }}>
          = cena de anoche
        </div>
      )}
      {meal.flexible && (
        <div style={{ position: "absolute", top: "10px", right: "12px", fontSize: "10px", color: "#FBBF24", fontFamily: "sans-serif", background: "rgba(251,191,36,0.1)", padding: "2px 8px", borderRadius: "999px", border: "1px solid rgba(251,191,36,0.3)" }}>
          flexible
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", paddingRight: (isLunch || meal.flexible) ? "110px" : 0 }}>
        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: dot, fontFamily: "sans-serif" }}>{type}</span>
        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
          <span style={{ fontSize: "11px", color: "#4ADE80", fontFamily: "sans-serif" }}>{meal.p}g prot</span>
          <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "sans-serif", background: "#1e293b", padding: "2px 8px", borderRadius: "999px" }}>{meal.kcal} kcal</span>
        </div>
      </div>
      <div style={{ fontSize: "15px", color: "#f1f5f9", marginBottom: "4px" }}>{meal.emoji} {meal.name}</div>
      <div style={{ fontSize: "13px", color: "#94a3b8", lineHeight: "1.5", fontFamily: "sans-serif" }}>{meal.desc}</div>
    </div>
  );
}

function CookView() {
  return (
    <div>
      {Object.values(cookDays).map(cook => (
        <div key={cook.label} style={{ marginBottom: "20px" }}>
          <div style={{ background: "rgba(30,41,59,0.9)", borderRadius: "16px", padding: "16px 20px", marginBottom: "12px", border: `1px solid ${cook.color}40` }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "3px", color: cook.color, fontFamily: "sans-serif", marginBottom: "4px" }}>{cook.label}</div>
            <div style={{ fontSize: "13px", color: "#64748b", fontFamily: "sans-serif", marginBottom: "6px" }}>Cocinás para: <strong style={{ color: "#f1f5f9" }}>{cook.forDays}</strong></div>
            <div style={{ fontSize: "12px", color: cook.color, fontFamily: "sans-serif", opacity: 0.8 }}>{cook.shopping}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {cook.meals.map((meal, i) => (
              <div key={i} style={{ background: "rgba(30,41,59,0.7)", border: "1px solid #334155", borderRadius: "12px", padding: "12px 16px", display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ fontSize: "22px" }}>{meal.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "14px", color: "#f1f5f9" }}>{meal.name}</div>
                  <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "sans-serif" }}>{meal.desc}</div>
                </div>
                <span style={{ fontSize: "11px", color: "#4ADE80", fontFamily: "sans-serif", whiteSpace: "nowrap" }}>{meal.p}g P</span>
              </div>
            ))}
          </div>
          <div style={{ background: `${cook.color}10`, border: `1px solid ${cook.color}30`, borderRadius: "12px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: cook.color, fontFamily: "sans-serif", marginBottom: "10px" }}>⚡ Cómo organizarte</div>
            {cook.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px", alignItems: "flex-start" }}>
                <span style={{ color: cook.color, fontFamily: "sans-serif", fontSize: "13px", flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif", lineHeight: "1.5" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ShoppingView() {
  return (
    <div>
      <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #334155", borderRadius: "14px", padding: "14px 18px", marginBottom: "14px" }}>
        <p style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "sans-serif", margin: 0 }}>
          Todo comprado en <strong style={{ color: "#f1f5f9" }}>Tienda Inglesa</strong> los días de descuento. Las verduras que ya tenés aparecen en verde.
        </p>
      </div>
      {shoppingDays.map(s => (
        <div key={s.day} style={{ background: "rgba(30,41,59,0.7)", border: `1px solid ${s.color}30`, borderRadius: "14px", padding: "14px 16px", marginBottom: "10px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: s.color, fontFamily: "sans-serif" }}>{s.day}</div>
            <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "sans-serif", background: "#1e293b", padding: "2px 8px", borderRadius: "999px" }}>{s.discount}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            {s.items.map(item => <ShoppingItem key={item} label={item} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MealPlan() {
  const [selectedDay, setSelectedDay] = useState(0);
  const [view, setView] = useState("plan");
  const current = plan[selectedDay];
  const proteinPct = Math.round((current.protein * 4 / current.kcal) * 100);
  const carbsPct = Math.round((current.carbs * 4 / current.kcal) * 100);
  const fatPct = Math.round((current.fat * 9 / current.kcal) * 100);
  const isCookDay = ["Domingo", "Martes", "Jueves"].includes(current.day);
  const cookInfo = current.day === "Domingo" ? cookDays.domingo : current.day === "Martes" ? cookDays.martes : current.day === "Jueves" ? cookDays.jueves : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", fontFamily: "'Georgia', serif", padding: "24px 16px", color: "#f8fafc" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Plan · Pérdida de grasa · Uruguay</div>
        <h1 style={{ fontSize: "26px", fontWeight: "normal", margin: 0, color: "#f1f5f9" }}>🍽️ Tu semana en piloto automático</h1>
        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>~2.100 kcal · ~180g proteína · compras alineadas con Tienda Inglesa</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[["plan","📅 Plan"],["cook","🍳 Cocina"],["shopping","🛒 Compras"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "8px 16px", borderRadius: "999px", border: view === v ? "none" : "1px solid #334155", background: view === v ? "linear-gradient(135deg, #f97316, #e11d48)" : "rgba(30,41,59,0.8)", color: view === v ? "#fff" : "#94a3b8", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", fontWeight: view === v ? "bold" : "normal" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {view === "plan" && <>
          <div style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "wrap", justifyContent: "center" }}>
            {plan.map((d, i) => {
              const isCook = ["Domingo", "Martes", "Jueves"].includes(d.day);
              return (
                <button key={d.day} onClick={() => setSelectedDay(i)} style={{ padding: "7px 14px", borderRadius: "999px", border: selectedDay === i ? "none" : `1px solid ${isCook ? "#f9731640" : "#334155"}`, background: selectedDay === i ? "linear-gradient(135deg, #f97316, #e11d48)" : isCook ? "rgba(249,115,22,0.1)" : "rgba(30,41,59,0.8)", color: selectedDay === i ? "#fff" : isCook ? "#fb923c" : "#94a3b8", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", fontWeight: selectedDay === i || isCook ? "bold" : "normal" }}>
                  {isCook ? `🍳 ${d.day}` : d.day}
                </button>
              );
            })}
          </div>

          <div style={{ background: "rgba(30,41,59,0.9)", borderRadius: "16px", padding: "16px 20px", marginBottom: "14px", border: "1px solid #334155" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
              <span style={{ fontSize: "20px", fontWeight: "bold", color: "#f1f5f9" }}>{current.day}</span>
              <span style={{ background: "linear-gradient(135deg, #f97316, #e11d48)", borderRadius: "999px", padding: "4px 14px", fontSize: "13px", color: "#fff", fontWeight: "bold" }}>{current.kcal} kcal</span>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              {[
                { label: "Proteína", val: current.protein, pct: proteinPct, color: "#4ADE80" },
                { label: "Carbos", val: current.carbs, pct: carbsPct, color: "#60A5FA" },
                { label: "Grasas", val: current.fat, pct: fatPct, color: "#FBBF24" },
              ].map(m => (
                <div key={m.label} style={{ flex: 1, background: "#0f172a", borderRadius: "10px", padding: "10px 12px" }}>
                  <div style={{ fontSize: "10px", color: "#64748b", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>{m.label}</div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: m.color, fontFamily: "sans-serif" }}>{m.val}<span style={{ fontSize: "11px", color: "#64748b" }}>g</span></div>
                  <div style={{ height: "4px", borderRadius: "2px", background: "#1e293b", marginTop: "6px" }}>
                    <div style={{ height: "4px", borderRadius: "2px", background: m.color, width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {isCookDay && cookInfo && (
            <div style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "12px", padding: "12px 16px", marginBottom: "14px" }}>
              <div style={{ fontSize: "13px", color: "#fb923c", fontFamily: "sans-serif", fontWeight: "bold", marginBottom: "4px" }}>🍳 Hoy cocinás para {cookInfo.forDays}</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif" }}>Abrí la pestaña <strong style={{ color: "#f1f5f9" }}>Cocina</strong> para ver cómo organizarte.</div>
            </div>
          )}

          {!isCookDay && (
            <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "12px", padding: "10px 16px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>♨️</span>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif" }}>Hoy solo recalentás — la cena ya está lista en el tupper.</span>
            </div>
          )}

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <MealCard type="Desayuno" meal={current.breakfast} />
            <MealCard type="Snack AM" meal={current.morningSnack} />
            <MealCard type="Almuerzo" meal={current.lunch} />
            <MealCard type="Merienda" meal={current.afternoonSnack} />
            <MealCard type="Cena" meal={current.dinner} />
          </div>

          <div style={{ marginTop: "18px", background: "rgba(30,41,59,0.7)", border: "1px solid #334155", borderRadius: "14px", padding: "14px 18px" }}>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#64748b", textTransform: "uppercase", marginBottom: "10px", fontFamily: "sans-serif" }}>Resumen semanal</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {plan.map((d, i) => (
                <div key={d.day} onClick={() => setSelectedDay(i)} style={{ cursor: "pointer", textAlign: "center", padding: "7px 10px", borderRadius: "10px", background: i === selectedDay ? "rgba(249,115,22,0.2)" : "rgba(15,23,42,0.8)", border: i === selectedDay ? "1px solid #f97316" : "1px solid #1e293b", minWidth: "64px" }}>
                  <div style={{ fontSize: "10px", color: i === selectedDay ? "#fb923c" : "#64748b", fontFamily: "sans-serif" }}>{d.day.slice(0,3)}</div>
                  <div style={{ fontSize: "12px", color: "#f1f5f9", fontWeight: "bold", fontFamily: "sans-serif" }}>{d.kcal}</div>
                  <div style={{ fontSize: "10px", color: "#4ADE80", fontFamily: "sans-serif" }}>{d.protein}g P</div>
                </div>
              ))}
            </div>
          </div>
        </>}

        {view === "cook" && <CookView />}
        {view === "shopping" && <ShoppingView />}
      </div>
    </div>
  );
}
