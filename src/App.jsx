import { useState } from "react";

// CENAS:
// Lunes     → Merluza con papa y ensalada        (tupper sábado)
// Martes    → Pollo al horno con brócoli y boniato (cocinado martes)
// Miércoles → Pollo con lentejas y verduras       (tupper martes)
// Jueves    → Salmón al horno con calabaza        (tupper martes)
// Viernes   → Pasta con carne picada              (fresca viernes)
// Sábado    → Milanesas de pollo con puré         (cocinado sábado)
// Domingo   → Tarta de atún con ensalada          (tupper sábado)
//
// ALMUERZOS = cena del día anterior
// COCINA: Martes · Viernes · Sábado

const dinnersByDay = {
  Lunes:     { emoji: "🐟", name: "Merluza al horno con papa y ensalada", desc: "250g merluza, 150g papa hervida, lechuga, tomate, oliva y limón", kcal: 540, p: 52, c: 42, f: 10 },
  Martes:    { emoji: "🍗", name: "Pollo al horno con brócoli y boniato", desc: "220g pechuga de pollo, 150g boniato en cubos, 200g brócoli congelado — asadera con oliva y sal, 200°C 25 min", kcal: 590, p: 52, c: 24, f: 12 },
  Miércoles: { emoji: "🍲", name: "Pollo con lentejas y verduras al horno", desc: "120g pechuga pollo desmenuzada, 150g lentejas cocidas (1 lata), calabaza + zanahoria + morrón asados con oliva y sal", kcal: 580, p: 52, c: 48, f: 10 },
  Jueves:    { emoji: "🐟", name: "Salmón al horno con calabaza", desc: "200g salmón, 200g calabaza en cubos — asadera con oliva y sal, 200°C 25 min", kcal: 620, p: 48, c: 30, f: 22 },
  Viernes:   { emoji: "🍝", name: "Pasta con carne picada", desc: "130g pasta cocida, 180g carne picada 90% magra, tomate natural, cebolla, ajo, especias", kcal: 660, p: 50, c: 56, f: 16 },
  Sábado:    { emoji: "🍗", name: "Milanesas de pollo al horno con puré", desc: "220g milanesas de pollo al horno rebozadas, puré de papa con leche descremada", kcal: 640, p: 52, c: 48, f: 16 },
  Domingo:   { emoji: "🥧", name: "Tarta de atún con ensalada", desc: "Porción tarta (atún + cebolla + morrón + huevo + queso crema + masa) + ensalada de calabaza asada y lechuga con oliva y limón", kcal: 590, p: 38, c: 42, f: 22 },
};

const breakfasts = {
  Lunes:     { emoji: "🥛", name: "Yogur griego con granola y fruta", desc: "200g yogur griego natural, 25g granola, 1 fruta a elección", kcal: 380, p: 22, c: 46, f: 6 },
  Martes:    { emoji: "🥛", name: "Yogur griego con granola y fruta", desc: "200g yogur griego natural, 25g granola, 1 fruta a elección", kcal: 380, p: 22, c: 46, f: 6 },
  Miércoles: { emoji: "☕", name: "Café con leche + huevos y tostadas", desc: "250ml café con leche descremada, 2 huevos revueltos, 2 tostadas integrales", kcal: 450, p: 26, c: 30, f: 16 },
  Jueves:    { emoji: "🥛", name: "Yogur griego con granola y fruta", desc: "200g yogur griego natural, 25g granola, 1 fruta a elección", kcal: 380, p: 22, c: 46, f: 6 },
  Viernes:   { emoji: "☕", name: "Café con leche + huevos y tostadas", desc: "250ml café con leche descremada, 2 huevos revueltos, 2 tostadas integrales", kcal: 450, p: 26, c: 30, f: 16 },
  Sábado:    { emoji: "☕", name: "Café con leche + huevos y tostadas", desc: "250ml café con leche descremada, 2 huevos a la plancha, 2 tostadas integrales", kcal: 450, p: 26, c: 30, f: 16 },
  Domingo:   { emoji: "☕", name: "Café con leche + huevos y tostadas", desc: "250ml café con leche descremada, 2 huevos a la plancha, 2 tostadas integrales", kcal: 450, p: 26, c: 30, f: 16 },
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
  Lunes:     { emoji: "🐟", name: "Tostadas con atún + yogur griego", desc: "1 lata atún al natural + 1 tostada integral + 150g yogur griego", kcal: 310, p: 42, c: 18, f: 5 },
  Martes:    { emoji: "☕", name: "Café con leche + 2 huevos + tostadas", desc: "250ml café con leche descremada, 2 huevos duros, 1 tostada integral", kcal: 340, p: 28, c: 20, f: 16 },
  Miércoles: { emoji: "🐟", name: "Tostadas con atún + yogur griego", desc: "1 lata atún al natural + 1 tostada integral + 150g yogur griego", kcal: 310, p: 42, c: 18, f: 5 },
  Jueves:    { emoji: "🐟", name: "Tostadas con atún + yogur griego", desc: "1 lata atún al natural + 1 tostada integral + 150g yogur griego", kcal: 310, p: 42, c: 18, f: 5 },
  Viernes:   { emoji: "☕", name: "Café con leche + 2 huevos + tostadas", desc: "250ml café con leche descremada, 2 huevos duros, 1 tostada integral", kcal: 340, p: 28, c: 20, f: 16 },
  Sábado:    { emoji: "🥛", name: "Yogur griego con granola y fruta", desc: "200g yogur griego natural, 25g granola, 1 fruta a elección", kcal: 380, p: 22, c: 46, f: 6 },
  Domingo:   { emoji: "🥛", name: "Yogur griego con granola y fruta", desc: "200g yogur griego natural, 25g granola, 1 fruta a elección", kcal: 380, p: 22, c: 46, f: 6 },
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
  Martes: {
    label: "Cocina · Martes", color: "#f97316",
    forDays: "Mar cena · Mié alm · Mié cena · Jue alm · Jue cena · Vie alm",
    meals: [dinnersByDay.Martes, dinnersByDay.Miércoles, dinnersByDay.Jueves],
    tips: [
      "Pollo A (para martes) + boniato en asadera A — 200°C, 25 min",
      "Pollo B (para miércoles) + calabaza + zanahoria + morrón en asadera B — mismo horno",
      "Salmón + calabaza extra en asadera C — 200°C, 25 min (mismo horno)",
      "Lentejas en olla mientras el horno trabaja",
      "Desmenuzás el pollo B para mezclar con las lentejas",
      "6 tuppers: Mar cena / Mié alm / Mié cena / Jue alm / Jue cena / Vie alm",
      "Aprovechá y hervís 6–8 huevos duros para la semana",
    ],
  },
  Viernes: {
    label: "Cocina · Viernes", color: "#C084FC",
    forDays: "Vie cena (fresca)",
    meals: [dinnersByDay.Viernes],
    tips: [
      "Carne picada en sartén con cebolla, ajo y tomate — 15 min",
      "Pasta en olla al mismo tiempo — 10 min",
      "Se come en el momento, no hace falta tupper",
    ],
  },
  Sábado: {
    label: "Cocina · Sábado", color: "#60A5FA",
    forDays: "Sáb cena · Dom alm · Dom cena · Lun alm · Lun cena",
    meals: [dinnersByDay.Sábado, dinnersByDay.Domingo, dinnersByDay.Lunes],
    tips: [
      "Milanesas de pollo en asadera A — 200°C, 20 min",
      "Merluza + papa en asadera B — 200°C, 20 min (mismo horno)",
      "Tarta de atún: armás el relleno, volcás en masa, 180°C 35 min",
      "Asás calabaza extra para la ensalada de la tarta",
      "Puré: papas hervidas + leche descremada + sal",
      "6 tuppers: Sáb cena / Dom alm / Dom cena / Lun alm / Lun cena / Mar alm",
    ],
  },
};

const shoppingDays = [
  { day: "Lunes", discount: "Pollo y carne", color: "#f97316", items: ["Pechuga de pollo (800g — pollo + milanesas)", "Carne picada 90% magra (400g)", "Milanesas de pollo (o pedís que corten finas)"] },
  { day: "Martes", discount: "Frutas y verduras", color: "#4ADE80", items: ["Bananas (x5)", "Fruta a elección (x4)", "Naranjas / mandarinas (x3)", "Brócoli congelado (x2 bolsas)", "Boniato (x2)", "Calabaza", "Zanahoria (x4)", "Morrón (x3)", "Papa (x5)", "Lechuga", "Tomates (x4)", "Cebolla (x3)"] },
  { day: "Miércoles", discount: "Pescados y pasta", color: "#60A5FA", items: ["Salmón fresco (400g)", "Merluza (500g)", "Pasta (400g)"] },
  { day: "Siempre en casa", discount: "Sin descuento específico", color: "#94a3b8", items: ["Atún al natural (x8 latas)", "Huevos (x14)", "Yogur griego 0% (x10)", "Granola", "Pan integral / tostadas", "Queso crema light", "Mantequilla de maní", "Lentejas en lata (x2)", "Aceite de oliva", "Café", "Leche descremada", "Masa para tarta (x1)", "Pan rallado (para milanesas)"] },
];

const typeColors = { "Desayuno": "#FB923C", "Snack AM": "#4ADE80", "Almuerzo": "#60A5FA", "Merienda": "#C084FC", "Cena": "#FB7185" };
const COOK_DAYS = ["Martes", "Viernes", "Sábado"];
const cookColorMap = { Martes: "#f97316", Viernes: "#C084FC", Sábado: "#60A5FA" };

function Accordion({ title, subtitle, color, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ marginBottom: "10px", borderRadius: "14px", overflow: "hidden", border: `1px solid ${color ? color + "40" : "#334155"}` }}>
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 16px", background: "rgba(30,41,59,0.9)", cursor: "pointer", userSelect: "none" }}>
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
  return (
    <div onClick={() => setChecked(c => !c)} style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", opacity: checked ? 0.35 : 1, transition: "opacity 0.2s", marginBottom: "8px" }}>
      <div style={{ width: "18px", height: "18px", borderRadius: "5px", flexShrink: 0, border: checked ? "none" : "1.5px solid #475569", background: checked ? "linear-gradient(135deg, #f97316, #e11d48)" : "transparent", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {checked && <span style={{ color: "#fff", fontSize: "11px" }}>✓</span>}
      </div>
      <span style={{ fontSize: "14px", color: "#e2e8f0", fontFamily: "sans-serif", textDecoration: checked ? "line-through" : "none" }}>{label}</span>
    </div>
  );
}

function MealRow({ type, meal }) {
  const dot = typeColors[type];
  const isLunch = type === "Almuerzo";
  return (
    <div style={{ background: "rgba(30,41,59,0.5)", borderRadius: "10px", padding: "12px 14px", borderLeft: `3px solid ${dot}`, marginBottom: "8px", position: "relative" }}>
      {isLunch && <div style={{ position: "absolute", top: "8px", right: "10px", fontSize: "10px", color: "#60A5FA", fontFamily: "sans-serif", background: "rgba(96,165,250,0.1)", padding: "1px 7px", borderRadius: "999px", border: "1px solid rgba(96,165,250,0.3)" }}>= cena de anoche</div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "3px", paddingRight: isLunch ? "110px" : 0 }}>
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

function PlanSection() {
  return (
    <div>
      {plan.map(d => {
        const cook = COOK_DAYS.includes(d.day);
        const cc = cookColorMap[d.day];
        const proteinPct = Math.round((d.protein * 4 / d.kcal) * 100);
        const carbsPct = Math.round((d.carbs * 4 / d.kcal) * 100);
        const fatPct = Math.round((d.fat * 9 / d.kcal) * 100);
        return (
          <Accordion key={d.day} title={`${cook ? "🍳 " : ""}${d.day}`} subtitle={`${d.kcal} kcal · ${d.protein}g proteína${cook ? " · día de cocina" : ""}`} color={cook ? cc : null}>
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
            {cook ? (
              <div style={{ background: `${cc}15`, border: `1px solid ${cc}30`, borderRadius: "8px", padding: "9px 12px", marginBottom: "12px" }}>
                <span style={{ fontSize: "12px", color: cc, fontFamily: "sans-serif" }}>🍳 Hoy cocinás para <strong>{cookDays[d.day]?.forDays}</strong> — ver pestaña Cocina</span>
              </div>
            ) : (
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
        <Accordion key={day} title={cook.label} subtitle={`Para: ${cook.forDays}`} color={cook.color}>
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
    </div>
  );
}

function ShoppingSection() {
  return (
    <div>
      <div style={{ background: "rgba(30,41,59,0.6)", border: "1px solid #334155", borderRadius: "12px", padding: "12px 16px", marginBottom: "12px" }}>
        <p style={{ color: "#94a3b8", fontSize: "13px", fontFamily: "sans-serif", margin: 0 }}>Todo en <strong style={{ color: "#f1f5f9" }}>Tienda Inglesa</strong> los días de descuento.</p>
      </div>
      {shoppingDays.map(s => (
        <Accordion key={s.day} title={s.day} subtitle={s.discount} color={s.color}>
          {s.items.map(item => <ShoppingItem key={item} label={item} />)}
        </Accordion>
      ))}
    </div>
  );
}

export default function App() {
  const [section, setSection] = useState("plan");
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)", fontFamily: "'Georgia', serif", padding: "24px 16px", color: "#f8fafc" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#94a3b8", textTransform: "uppercase", marginBottom: "6px" }}>Plan · Pérdida de grasa · Uruguay</div>
        <h1 style={{ fontSize: "24px", fontWeight: "normal", margin: 0, color: "#f1f5f9" }}>🍽️ Tu semana en piloto automático</h1>
        <p style={{ color: "#64748b", fontSize: "13px", marginTop: "6px" }}>~2.100 kcal · ~180g proteína · Tienda Inglesa</p>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginBottom: "20px", flexWrap: "wrap" }}>
        {[["plan","📅 Plan"],["cook","🍳 Cocina"],["shopping","🛒 Compras"]].map(([id, label]) => (
          <button key={id} onClick={() => setSection(id)} style={{ padding: "8px 18px", borderRadius: "999px", border: section === id ? "none" : "1px solid #334155", background: section === id ? "linear-gradient(135deg, #f97316, #e11d48)" : "rgba(30,41,59,0.8)", color: section === id ? "#fff" : "#94a3b8", fontFamily: "inherit", fontSize: "13px", cursor: "pointer", fontWeight: section === id ? "bold" : "normal" }}>{label}</button>
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
