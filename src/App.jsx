import { useState } from "react";

// BATCH COOKING LOGIC:
// Saturday: cook dinners for Sunday, Monday, Tuesday (3 meals)
// Tuesday: cook dinners for Wednesday, Thursday, Friday (3 meals)
// Saturday dinner: cooked that same night (fresh)
//
// Dinner groups chosen so they share oven/stovetop:
// SAT batch (Sun+Mon+Tue dinners): pollo al horno + batata/brócoli + lentejas (oven + pot)
// TUE batch (Wed+Thu+Fri dinners): carne picada con pasta + merluza al horno + wok pollo (stovetop + oven)
// SAT dinner (fresh): bowl atún (no cocción)
// SUN dinner = SAT batch item 1
// MON dinner = SAT batch item 2
// TUE dinner = SAT batch item 3  → and Tuesday they also cook Wed/Thu/Fri batch
// WED dinner = TUE batch item 1
// THU dinner = TUE batch item 2
// FRI dinner = TUE batch item 3

// Remember: lunch[i] = dinner[i-1]

const dinnersByDay = {
  // Saturday (cooked fresh that night — no cooking needed, just assembly)
  Sábado:   { emoji: "🥗", name: "Bowl de atún con arroz y vegetales", desc: "2 latas atún al natural (240g), 150g arroz cocido, tomate, cebolla morada, oliva, limón", kcal: 540, p: 54, c: 50, f: 10, batch: null },
  // SAT batch → eaten Sun/Mon/Tue
  Domingo:  { emoji: "🍗", name: "Pollo al horno con brócoli", desc: "220g pechuga de pollo, 150g brócoli al vapor con ajo y oliva", kcal: 580, p: 52, c: 18, f: 12, batch: "sábado" },
  Lunes:    { emoji: "🍲", name: "Lentejas con pollo desmenuzado", desc: "150g lentejas cocidas, 120g pechuga pollo desmenuzada, zanahoria, apio, tomate, especias", kcal: 560, p: 52, c: 48, f: 8, batch: "sábado" },
  Martes:   { emoji: "🐟", name: "Salmón al horno con batata y zucchini", desc: "200g salmón, 150g batata asada, 150g zucchini salteado con ajo y oliva", kcal: 640, p: 48, c: 44, f: 22, batch: "sábado" },
  // TUE batch → eaten Wed/Thu/Fri
  Miércoles:{ emoji: "🥩", name: "Carne picada magra con pasta integral", desc: "180g carne picada 90% magra, 130g pasta integral cocida, tomate natural, cebolla, ajo", kcal: 660, p: 50, c: 56, f: 16, batch: "martes" },
  Jueves:   { emoji: "🐟", name: "Merluza al horno con papa y ensalada", desc: "250g merluza, 150g papa hervida, lechuga, tomate, aceite de oliva y limón", kcal: 540, p: 52, c: 42, f: 10, batch: "martes" },
  Viernes:  { emoji: "🍜", name: "Wok de pollo con vegetales y fideos de arroz", desc: "200g pollo, pimiento, cebolla, zanahoria, zucchini, 100g fideos de arroz, salsa de soja", kcal: 580, p: 48, c: 52, f: 10, batch: "martes" },
};

const breakfasts = {
  Lunes:     { emoji: "☕", name: "Café con leche + claras revueltas y tostadas", desc: "250ml café con leche descremada, 3 claras + 1 huevo revueltos, 2 tostadas integrales", kcal: 420, p: 28, c: 34, f: 10 },
  Martes:    { emoji: "☕", name: "Café con leche + yogur griego con granola", desc: "250ml café con leche, 200g yogur griego natural, 25g granola, 1 fruta", kcal: 430, p: 26, c: 48, f: 6 },
  Miércoles: { emoji: "☕", name: "Café con leche + huevos revueltos y tostada", desc: "250ml café con leche, 3 huevos revueltos, 1 tostada integral", kcal: 450, p: 28, c: 26, f: 18 },
  Jueves:    { emoji: "☕", name: "Café con leche + tostadas con huevo y tomate", desc: "250ml café con leche, 2 tostadas integrales, 2 huevos a la plancha, tomate en rodajas", kcal: 410, p: 24, c: 34, f: 12 },
  Viernes:   { emoji: "☕", name: "Café con leche + yogur griego con fruta", desc: "250ml café con leche, 200g yogur griego, 1 banana, 1 cda miel", kcal: 420, p: 24, c: 52, f: 4 },
  Sábado:    { emoji: "☕", name: "Café con leche + omelette y tostada", desc: "250ml café con leche, omelette de 3 huevos + espinaca, 1 tostada integral", kcal: 480, p: 30, c: 26, f: 20 },
  Domingo:   { emoji: "☕", name: "Café con leche + yogur griego con granola", desc: "250ml café con leche, 200g yogur griego, 25g granola, frutos rojos", kcal: 420, p: 26, c: 44, f: 6 },
};

const morningSnacks = {
  Lunes:     { emoji: "🥚", name: "2 huevos duros + fruta", desc: "2 huevos duros + 1 manzana", kcal: 190, p: 14, c: 18, f: 10 },
  Martes:    { emoji: "🧀", name: "Yogur griego con fruta", desc: "150g yogur griego + 1 naranja", kcal: 190, p: 16, c: 14, f: 2 },
  Miércoles: { emoji: "🥚", name: "2 huevos duros + fruta", desc: "2 huevos duros + 1 mandarina", kcal: 185, p: 14, c: 12, f: 10 },
  Jueves:    { emoji: "🧀", name: "Yogur griego con fruta", desc: "150g yogur griego + 1 manzana", kcal: 180, p: 16, c: 18, f: 2 },
  Viernes:   { emoji: "🥚", name: "2 huevos duros + fruta", desc: "2 huevos duros + 1 banana", kcal: 200, p: 14, c: 20, f: 10 },
  Sábado:    { emoji: "🧀", name: "Yogur griego con fruta", desc: "150g yogur griego + 1 naranja", kcal: 175, p: 16, c: 16, f: 2 },
  Domingo:   { emoji: "🥚", name: "2 huevos duros + fruta", desc: "2 huevos duros + 1 manzana", kcal: 190, p: 14, c: 18, f: 10 },
};

const afternoonSnacks = {
  Lunes:     { emoji: "🐟", name: "Tostada con atún", desc: "1 tostada integral + 1 lata de atún al natural + tomate", kcal: 220, p: 26, c: 16, f: 3 },
  Martes:    { emoji: "🥛", name: "Yogur griego con tostada", desc: "150g yogur griego + 1 tostada con queso crema light", kcal: 230, p: 20, c: 22, f: 6 },
  Miércoles: { emoji: "🐟", name: "Tostada con atún", desc: "1 tostada integral + 1 lata de atún al natural + tomate", kcal: 210, p: 26, c: 14, f: 3 },
  Jueves:    { emoji: "🥛", name: "Yogur griego con granola", desc: "200g yogur griego + 20g granola", kcal: 240, p: 20, c: 24, f: 5 },
  Viernes:   { emoji: "🐟", name: "Tostada con atún", desc: "1 tostada integral + 1 lata de atún al natural + tomate", kcal: 220, p: 26, c: 16, f: 3 },
  Sábado:    { emoji: "🥛", name: "Yogur griego con tostada", desc: "150g yogur griego + 1 tostada con queso crema light", kcal: 230, p: 20, c: 22, f: 6 },
  Domingo:   { emoji: "🥛", name: "Yogur griego con tostada", desc: "150g yogur griego + 1 tostada con queso crema light", kcal: 200, p: 20, c: 18, f: 4 },
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

const batchDays = {
  sábado: {
    label: "Batch cooking · Sábado",
    color: "#f97316",
    meals: [dinnersByDay.Domingo, dinnersByDay.Lunes, dinnersByDay.Martes],
    days: "Domingo · Lunes · Martes",
    tips: [
      "Pollo y salmón van al horno al mismo tiempo (200°C, 20 min)",
      "Lentejas en la olla mientras el horno trabaja",
      "Batata y zucchini entran al horno junto al salmón",
      "Dividís todo en 3 tuppers etiquetados con el día",
    ],
  },
  martes: {
    label: "Batch cooking · Martes",
    color: "#60A5FA",
    meals: [dinnersByDay.Miércoles, dinnersByDay.Jueves, dinnersByDay.Viernes],
    days: "Miércoles · Jueves · Viernes",
    tips: [
      "Merluza al horno (200°C, 15 min) mientras cocinás la carne picada en sartén",
      "Papa hervida en olla junto a la pasta",
      "Wok de pollo: último, tarda 10 min, lo hacés en caliente",
      "Dividís todo en 3 tuppers etiquetados con el día",
    ],
  },
};

const typeColors = {
  "Desayuno": "#FB923C",
  "Snack AM": "#4ADE80",
  "Almuerzo": "#60A5FA",
  "Merienda": "#C084FC",
  "Cena":     "#FB7185",
};

const shoppingList = {
  "🏠 Siempre en casa": ["Aceite de oliva", "Sal y pimienta", "Ajo", "Salsa de soja", "Especias básicas"],
  "☕ Desayuno & Merienda": ["Café", "Leche descremada", "Pan integral / tostadas", "Yogur griego 0% (x8–10)", "Granola (poca)", "Queso crema light"],
  "🍎 Frutas": ["Bananas (x3)", "Manzanas (x4)", "Naranjas / mandarinas (x4)"],
  "🥩 Proteínas": ["Pechuga de pollo (700g — para batch sáb + martes)", "Salmón fresco (200g)", "Merluza (250g)", "Carne picada 90% magra (200g)", "Atún al natural (x7 latas)", "Huevos (x14)"],
  "🍚 Carbohidratos": ["Arroz (500g)", "Pasta integral (400g)", "Batata (x2)", "Papa (x3)", "Fideos de arroz (200g)"],
  "🥦 Vegetales": ["Brócoli (x1)", "Espinaca", "Tomates (x6)", "Lechuga", "Cebolla morada", "Zanahoria (x3)", "Pimiento", "Zucchini (x2)", "Apio"],
  "🫘 Legumbres": ["Lentejas (1 lata o 250g secas)"],
};

function ShoppingItem({ label }) {
  const [checked, setChecked] = useState(false);
  return (
    <div onClick={() => setChecked(c => !c)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", opacity: checked ? 0.35 : 1, transition: "opacity 0.2s" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0, border: checked ? "none" : "1.5px solid #475569", background: checked ? "linear-gradient(135deg, #f97316, #e11d48)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
      </div>
      <span style={{ fontSize: "14px", color: "#e2e8f0", fontFamily: "sans-serif", textDecoration: checked ? "line-through" : "none" }}>{label}</span>
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
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "5px", paddingRight: isLunch ? "110px" : 0 }}>
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

function BatchView() {
  return (
    <div>
      {Object.values(batchDays).map(batch => (
        <div key={batch.label} style={{ marginBottom: "20px" }}>
          <div style={{ background: "rgba(30,41,59,0.9)", borderRadius: "16px", padding: "16px 20px", marginBottom: "12px", border: `1px solid ${batch.color}40` }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "3px", color: batch.color, fontFamily: "sans-serif", marginBottom: "4px" }}>{batch.label}</div>
            <div style={{ fontSize: "13px", color: "#64748b", fontFamily: "sans-serif" }}>Cocinás para: <strong style={{ color: "#f1f5f9" }}>{batch.days}</strong></div>
          </div>

          {/* Meals to cook */}
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
            {batch.meals.map((meal, i) => (
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

          {/* Tips */}
          <div style={{ background: `${batch.color}10`, border: `1px solid ${batch.color}30`, borderRadius: "12px", padding: "14px 16px" }}>
            <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: batch.color, fontFamily: "sans-serif", marginBottom: "10px" }}>⚡ Cómo organizarte</div>
            {batch.tips.map((tip, i) => (
              <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "7px", alignItems: "flex-start" }}>
                <span style={{ color: batch.color, fontFamily: "sans-serif", fontSize: "13px", flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif", lineHeight: "1.5" }}>{tip}</span>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* Huevos note */}
      <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #334155", borderRadius: "12px", padding: "14px 16px" }}>
        <div style={{ fontSize: "11px", textTransform: "uppercase", letterSpacing: "2px", color: "#C084FC", fontFamily: "sans-serif", marginBottom: "8px" }}>🥚 Siempre el domingo</div>
        <div style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif", lineHeight: "1.6" }}>
          Hervís <strong style={{ color: "#f1f5f9" }}>6–8 huevos duros</strong> de una vez — duran toda la semana en la heladera y cubren todos los snacks AM.
        </div>
      </div>
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

  const isBatchDay = current.day === "Sábado" || current.day === "Martes";
  const batchInfo = current.day === "Sábado" ? batchDays.sábado : current.day === "Martes" ? batchDays.martes : null;

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", fontFamily: "'Georgia', serif", padding: "24px 16px", color: "#f8fafc" }}>

      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Plan · Pérdida de grasa</div>
        <h1 style={{ fontSize: "26px", fontWeight: "normal", margin: 0, color: "#f1f5f9" }}>🍽️ Tu semana en piloto automático</h1>
        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>~2.100 kcal · ~180g proteína · cocinás sábado y martes</p>
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "24px", flexWrap: "wrap" }}>
        {[["plan","📅 Plan"],["batch","🍳 Batch cooking"],["shopping","🛒 Compras"]].map(([v,label]) => (
          <button key={v} onClick={() => setView(v)} style={{ padding: "8px 16px", borderRadius: "999px", border: view === v ? "none" : "1px solid #334155", background: view === v ? "linear-gradient(135deg, #f97316, #e11d48)" : "rgba(30,41,59,0.8)", color: view === v ? "#fff" : "#94a3b8", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", fontWeight: view === v ? "bold" : "normal" }}>{label}</button>
        ))}
      </div>

      <div style={{ maxWidth: "600px", margin: "0 auto" }}>

        {view === "plan" && <>
          <div style={{ display: "flex", gap: "6px", marginBottom: "18px", flexWrap: "wrap", justifyContent: "center" }}>
            {plan.map((d, i) => {
              const isBatch = d.day === "Sábado" || d.day === "Martes";
              return (
                <button key={d.day} onClick={() => setSelectedDay(i)} style={{ padding: "7px 14px", borderRadius: "999px", border: selectedDay === i ? "none" : `1px solid ${isBatch ? "#f9731640" : "#334155"}`, background: selectedDay === i ? "linear-gradient(135deg, #f97316, #e11d48)" : isBatch ? "rgba(249,115,22,0.1)" : "rgba(30,41,59,0.8)", color: selectedDay === i ? "#fff" : isBatch ? "#fb923c" : "#94a3b8", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", fontWeight: selectedDay === i || isBatch ? "bold" : "normal" }}>
                  {isBatch ? `🍳 ${d.day}` : d.day}
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

          {/* Batch cooking banner on SAT/TUE */}
          {isBatchDay && batchInfo && (
            <div style={{ background: "rgba(249,115,22,0.1)", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "12px", padding: "12px 16px", marginBottom: "14px" }}>
              <div style={{ fontSize: "13px", color: "#fb923c", fontFamily: "sans-serif", fontWeight: "bold", marginBottom: "4px" }}>🍳 Hoy es día de batch cooking</div>
              <div style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif" }}>
                Cocinás para {batchInfo.days}. Abrí la pestaña <strong style={{ color: "#f1f5f9" }}>Batch cooking</strong> para ver cómo organizarte.
              </div>
            </div>
          )}

          {!isBatchDay && (
            <div style={{ background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.2)", borderRadius: "12px", padding: "10px 16px", marginBottom: "14px", display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "16px" }}>♨️</span>
              <span style={{ fontSize: "13px", color: "#94a3b8", fontFamily: "sans-serif" }}>
                Hoy solo recalentás — la cena ya está lista en el tupper.
              </span>
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

        {view === "batch" && <BatchView />}

        {view === "shopping" && <>
          <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #334155", borderRadius: "14px", padding: "14px 18px", marginBottom: "14px" }}>
            <p style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "sans-serif", margin: 0 }}>
              Comprá esto <strong style={{ color: "#f1f5f9" }}>una vez por semana</strong>. Batch cooking sábado y martes — el resto de los días solo recalentás.
            </p>
          </div>
          {Object.entries(shoppingList).map(([category, items]) => (
            <div key={category} style={{ background: "rgba(30,41,59,0.7)", border: "1px solid #334155", borderRadius: "14px", padding: "14px 16px", marginBottom: "10px" }}>
              <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "2px", color: "#f97316", fontFamily: "sans-serif", marginBottom: "10px" }}>{category}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {items.map(item => <ShoppingItem key={item} label={item} />)}
              </div>
            </div>
          ))}
        </>}

      </div>
    </div>
  );
}
