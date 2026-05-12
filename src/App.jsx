import { useState } from "react";

const dinnersByDay = {
  Domingo:   { emoji: "🥗", name: "Bowl de atún con arroz y tomate", desc: "2 latas atún al natural (240g), 150g arroz cocido, tomate, cebolla morada, oliva, limón", kcal: 540, p: 54, c: 50, f: 10 },
  Lunes:     { emoji: "🍗", name: "Pollo al horno con boniato y brócoli", desc: "220g pechuga de pollo, 150g boniato en cubos, 200g brócoli congelado — asadera con oliva y sal, 200°C 25 min", kcal: 590, p: 52, c: 24, f: 12 },
  Martes:    { emoji: "🥩", name: "Carne picada con arroz y verduras", desc: "180g carne picada 90% magra, 150g arroz cocido, zanahoria, cebolla, tomate, ajo", kcal: 620, p: 48, c: 54, f: 16 },
  Miércoles: { emoji: "🐟", name: "Salmón al horno con calabaza", desc: "200g salmón, 200g calabaza en cubos — misma asadera, oliva y sal, 200°C 25 min", kcal: 620, p: 48, c: 30, f: 22 },
  Jueves:    { emoji: "🍲", name: "Pollo con lentejas y verduras", desc: "120g pechuga pollo desmenuzada, 150g lentejas cocidas (1 lata), mezcla congelada brócoli+coliflor+zanahoria, ajo y oliva", kcal: 560, p: 52, c: 46, f: 8 },
  Viernes:   { emoji: "🐟", name: "Merluza al horno con papa y ensalada", desc: "250g merluza, 150g papa hervida, lechuga, tomate, aceite de oliva y limón", kcal: 540, p: 52, c: 42, f: 10 },
  Sábado:    { emoji: "🍽️", name: "Comida flexible", desc: "Tu elección — usá las proteínas que queden en casa o salí a comer. Meta: ~600 kcal, ~45g proteína", kcal: 600, p: 45, c: 50, f: 15, flexible: true },
};

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
  Domingo: {
    label: "Cocina · Domingo", color: "#f97316", forDays: "Lunes · Martes",
    meals: [dinnersByDay.Lunes, dinnersByDay.Martes],
    shopping: "🛒 Compraste el lunes: pollo + carne picada",
    tips: [
      "Pollo + boniato en asadera — 200°C, 25 min",
      "Brócoli congelado entra los últimos 15 min",
      "Carne picada en sartén + arroz en olla al mismo tiempo",
      "2 tuppers etiquetados: Lun / Mar",
      "Hervís 6 huevos duros para la semana",
    ],
  },
  Martes: {
    label: "Cocina · Martes", color: "#60A5FA", forDays: "Miércoles",
    meals: [dinnersByDay.Miércoles],
    shopping: "🛒 Compraste hoy: salmón + pasta fresca",
    tips: [
      "Salmón + calabaza en asadera — 200°C, 25 min",
      "Doble porción: 1 para cenar, 1 tupper para mañana",
      "1 tupper etiquetado: Mié almuerzo",
    ],
  },
  Jueves: {
    label: "Cocina · Jueves", color: "#C084FC", forDays: "Viernes · Sábado",
    meals: [dinnersByDay.Viernes],
    shopping: "🛒 Compraste el miércoles: merluza",
    tips: [
      "Merluza + papa en asadera — 200°C, 20 min",
      "Doble porción: 1 para cenar, 1 tupper para el viernes",
      "Sábado es flexible — no cocinás nada fijo",
    ],
  },
};

const shoppingDays = [
  { day: "Lunes", discount: "Pollo y carne", color: "#f97316", items: ["Pechuga de pollo (600g)", "Carne picada 90% magra (400g)"] },
  { day: "Martes", discount: "Frutas y verduras", color: "#4ADE80", items: ["Bananas (x5)", "Manzanas o fruta a elección (x4)", "Naranjas / mandarinas (x3)", "Brócoli congelado (x2 bolsas)", "Mezcla congelada brócoli+coliflor+zanahoria (x1)", "Boniato (x2)", "Calabaza (ya tenés)", "Tomates (x6)", "Lechuga", "Cebolla morada", "Zanahoria (x3)", "Papa (x3)"] },
  { day: "Miércoles", discount: "Pescados y pasta", color: "#60A5FA", items: ["Salmón fresco (400g)", "Merluza (500g)", "Pasta fresca (opcional)"] },
  { day: "Siempre en casa", discount: "Sin descuento específico", color: "#94a3b8", items: ["Atún al natural (x8 latas)", "Huevos (x14)", "Yogur griego 0% (x10)", "Granola", "Pan integral / tostadas", "Queso crema light", "Mantequilla de maní", "Arroz (500g)", "Lentejas en lata (x2)", "Aceite de oliva", "Café", "Leche descremada"] },
];

const typeColors = { "Desayuno": "#FB923C", "Snack AM": "#4ADE80", "Almuerzo": "#60A5FA", "Merienda": "#C084FC", "Cena": "#FB7185" };
const isCookDay = d => ["Domingo", "Martes", "Jueves"].includes(d);

// ── Accordion ────────────────────────────────────────────────────────────────
function Accordion({ title, subtitle, color, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "10px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${color ? color + "40" : "#334155"}` }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgba(30,41,59,0.9)", cursor: "pointer", userSelect: "none" }}
      >
        <div>
          <div style={{ fontSize: "15px", color: "#f1f5f9", fontWeight: "bold" }}>{title}</div>
          {subtitle && <div style={{ fontSize: "12px", color: "#64748b", fontFamily: "sans-serif", marginTop: "2px" }}>{subtitle}</div>}
        </div>
        <span style={{ color: color || "#94a3b8", fontSize: "18px", transition: "transform 0.2s", display: "inline-block", transform: open ? "rotate(180deg)" : "rotate(0deg)" }}>⌄</span>
      </div>
      {open && (
        <div style={{ background: "rgba(15,23,42,0.6)", padding: "14px 16px", borderTop: `1px solid ${color ? color + "20" : "#1e293b"}` }}>
          {children}
        </div>
      )}
    </div>
  );
}

function ShoppingItem({ label }) {
  const [checked, setChecked] = useState(false);
  const isOwned = label.includes("ya tenés");
  return (
    <div onClick={() => !isOwned && setChecked(c => !c)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: isOwned ? "default" : "pointer", opacity: checked ? 0.35 : 1, transition: "opacity 0.2s", marginBottom: "8px" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0, border: isOwned ? "none" : checked ? "none" : "1.5px solid #475569", background: isOwned ? "#16a34a" : checked ? "linear-gradient(135deg, #f97316, #e11d48)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {(checked || isOwned) && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
      </div>
      <span style={{ fontSize: "14px", color: isOwned ? "#4ADE80" : "#e2e8f0", fontFamily: "sans-serif", textDecoration: checked ? "line-through" : "none" }}>{label}</span>
    </div>
  );
}

function MealRow({ type, meal }) {
  const dot = typeColors[type];
  const isLunch = type === "Almuerzo";
  return (
    <div style={{ background: "rgba(30,41,59,0.5)", borderRadius: "10px", padding: "12px 14px", borderLeft: `3px solid ${dot}`, marginBottom: "8px", position: "relative" }}>
      {isLunch && <div style={{ position: "absolute", top: "8px", right: "10px", fontSize: "10px", color: "#60A5FA", fontFamily: "sans-serif", background: "rgba(96,165,250,0.1)", padding: "1px 7px", borderRadius: "999px", border: "1px solid rgba(96,165,250,0.3)" }}>= cena de anoche</div>}
      {meal.flexible && <div style={{ position: "absolute", top: "8px", right: "10px", fontSize: "10px", color: "#FBBF24", fontFamily: "sans-serif", background: "rgba(251,191,36,0.1)", padding: "1px 7px", borderRadius: "999px", border: "1px solid rgba(251,191,36,0.3)" }}>flexible</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px", paddingRight: (isLunch || meal.flexible) ? "110px" : 0 }}>
        <span style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: dot, fontFamily: "sans-serif" }}>{type}</span>
        <div style={{ display: "flex", gap: "5px" }}>
          <span style={{ fontSize: "11px", color: "#4ADE80", fontFamily: "sans-serif" }}>{meal.p}g P</span>
          <span style={{ fontSize: "11px", color: "#64748b", fontFamily: "sans-serif" }}>{meal.kcal} kcal</span>
        </div>
      </div>
      <div style={{ fontSize: "14px", color: "#f1f5f9", marginBottom: "2px" }}>{meal.emoji} {meal.name}</div>
      <div style={{ fontSize: "12px", color: "#94a3b8", lineHeight: "1.5", fontFamily: "sans-serif" }}>{meal.desc}</div>
    </div>
  );
}

// ── Sections ─────────────────────────────────────────────────────────────────
function PlanSection() {
  return (
    <div>
      {plan.map((d) => {
        const cook = isCookDay(d.day);
        const proteinPct = Math.round((d.protein * 4 / d.kcal) * 100);
        const carbsPct = Math.round((d.carbs * 4 / d.kcal) * 100);
        const fatPct = Math.round((d.fat * 9 / d.kcal) * 100);
        return (
          <Accordion
            key={d.day}
            title={`${cook ? "🍳 " : ""}${d.day}`}
            subtitle={`${d.kcal} kcal · ${d.protein}g proteína${cook ? " · día de cocina" : ""}`}
            color={cook ? "#f97316" : null}
          >
            {/* Macro bars */}
            <div style={{ display: "flex", gap: "8px", marginBottom: "14px" }}>
              {[
                { label: "Proteína", val: d.protein, pct: proteinPct, color: "#4ADE80" },
                { label: "Carbos", val: d.carbs, pct: carbsPct, color: "#60A5FA" },
                { label: "Grasas", val: d.fat, pct: fatPct, color: "#FBBF24" },
              ].map(m => (
                <div key={m.label} style={{ flex: 1, background: "#0f172a", borderRadius: "8px", padding: "8px 10px" }}>
                  <div style={{ fontSize: "9px", color: "#64748b", fontFamily: "sans-serif", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "3px" }}>{m.label}</div>
                  <div style={{ fontSize: "16px", fontWeight: "bold", color: m.color, fontFamily: "sans-serif" }}>{m.val}<span style={{ fontSize: "10px", color: "#64748b" }}>g</span></div>
                  <div style={{ height: "3px", borderRadius: "2px", background: "#1e293b", marginTop: "5px" }}>
                    <div style={{ height: "3px", borderRadius: "2px", background: m.color, width: `${m.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {cook && (
              <div style={{ background: "rgba(249,115,22,0.08)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "8px", padding: "9px 12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#fb923c", fontFamily: "sans-serif" }}>🍳 Hoy cocinás para <strong>{cookDays[d.day]?.forDays}</strong> — ver pestaña Cocina</span>
              </div>
            )}
            {!cook && (
              <div style={{ background: "rgba(30,41,59,0.4)", border: "1px solid #1e293b", borderRadius: "8px", padding: "9px 12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: "#64748b", fontFamily: "sans-serif" }}>♨️ Hoy solo recalentás — la cena ya está en el tupper</span>
              </div>
            )}
            <MealRow type="Desayuno" meal={d.breakfast} />
            <MealRow type="Snack AM" meal={d.morningSnack} />
            <MealRow type="Almuerzo" meal={d.lunch} />
            <MealRow type="Merienda" meal={d.afternoonSnack} />
            <MealRow type="Cena" meal={d.dinner} />
          </Accordion>
        );
      })}
    </div>
  );
}

function CookSection() {
  return (
    <div>
      {Object.entries(cookDays).map(([day, cook]) => (
        <Accordion key={day} title={cook.label} subtitle={`Para: ${cook.forDays}`} color={cook.color} defaultOpen={false}>
          <div style={{ fontSize: "12px", color: cook.color, fontFamily: "sans-serif", marginBottom: "12px", opacity: 0.9 }}>{cook.shopping}</div>
          {cook.meals.map((meal, i) => (
            <div key={i} style={{ background: "rgba(30,41,59,0.5)", borderRadius: "10px", padding: "10px 14px", marginBottom: "8px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "20px" }}>{meal.emoji}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", color: "#f1f5f9" }}>{meal.name}</div>
                <div style={{ fontSize: "11px", color: "#64748b", fontFamily: "sans-serif" }}>{meal.desc}</div>
              </div>
              <span style={{ fontSize: "11px", color: "#4ADE80", fontFamily: "sans-serif" }}>{meal.p}g P</span>
            </div>
          ))}
          <div style={{ background: `${cook.color}10`, border: `1px solid ${cook.color}25`, borderRadius: "10px", padding: "12px 14px", marginTop: "4px" }}>
            <div style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "2px", color: cook.color, fontFamily: "sans-serif", marginBottom: "8px" }}>⚡ Cómo organizarte</div>
            {cook.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "6px" }}>
                <span style={{ color: cook.color, fontFamily: "sans-serif", fontSize: "12px", flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: "12px", color: "#94a3b8", fontFamily: "sans-serif", lineHeight: "1.5" }}>{tip}</span>
              </div>
            ))}
          </div>
        </Accordion>
      ))}
      <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #334155", borderRadius: "12px", padding: "14px 16px", marginTop: "4px" }}>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C084FC", fontFamily: "sans-serif", marginBottom: "6px" }}>🥚 Siempre el domingo</div>
        <div style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif" }}>Hervís <strong style={{ color: "#f1f5f9" }}>6–8 huevos duros</strong> — duran toda la semana, cubren todos los snacks AM.</div>
      </div>
    </div>
  );
}

function ShoppingSection() {
  return (
    <div>
      <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #334155", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px" }}>
        <p style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "sans-serif", margin: 0 }}>
          Todo en <strong style={{ color: "#f1f5f9" }}>Tienda Inglesa</strong> los días de descuento. Verde = ya tenés.
        </p>
      </div>
      {shoppingDays.map(s => (
        <Accordion key={s.day} title={s.day} subtitle={s.discount} color={s.color}>
          {s.items.map(item => <ShoppingItem key={item} label={item} />)}
        </Accordion>
      ))}
    </div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("plan");

  const sections = [
    { id: "plan", label: "📅 Plan" },
    { id: "cook", label: "🍳 Cocina" },
    { id: "shopping", label: "🛒 Compras" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", fontFamily: "'Georgia', serif", padding: "24px 16px", color: "#f8fafc" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Plan · Pérdida de grasa · Uruguay</div>
        <h1 style={{ fontSize: "24px", fontWeight: "normal", margin: 0, color: "#f1f5f9" }}>🍽️ Tu semana en piloto automático</h1>
        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>~2.100 kcal · ~180g proteína · Tienda Inglesa</p>
      </div>

      {/* Section tabs as accordions trigger */}
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)} style={{ padding: "8px 18px", borderRadius: "999px", border: section === s.id ? "none" : "1px solid #334155", background: section === s.id ? "linear-gradient(135deg, #f97316, #e11d48)" : "rgba(30,41,59,0.8)", color: section === s.id ? "#fff" : "#94a3b8", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", fontWeight: section === s.id ? "bold" : "normal" }}>{s.label}</button>
        ))}
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        {section === "plan" && <PlanSection />}
        {section === "cook" && <CookSection />}
        {section === "shopping" && <ShoppingSection />}
      </div>
    </div>
  );
}
