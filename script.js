/**********************************************************
 * Malla TO – U. Mayor (interactiva con desbloqueos)
 * - Multi-prerrequisitos
 * - Persistencia en localStorage
 * - Exportar / Importar progreso
 * - Estructura modular para editar ramos fácilmente
 **********************************************************/

/* ============ UTIL: STORAGE KEYS ============ */
const LS_KEY = "to_umayor_progreso_v1";

/* ============ AREAS (para estilos y etiquetas) ============ */
const AREAS = {
  PROF: { label: "Formación Profesional", class: "area-prof", badge: "prof" },
  BIO:  { label: "Formación Biomédica",   class: "area-bio",  badge: "bio"  },
  ELEC: { label: "Electivo",              class: "area-elec", badge: "elec" },
  C2:   { label: "Ciclo 2 / Titulación",  class: "area-c2",   badge: "c2"   },
};

/* ==========================================================
   ==== DATA: MALLA (ajusta libremente nombres/prerreqs) ====
   - id: único (usa snake_case)
   - nombre: mostrado en la tarjeta
   - semestre: 1..10
   - area: "PROF" | "BIO" | "ELEC" | "C2"
   - prereqs: [ids] (todas deben estar aprobadas para desbloquear)
   ========================================================== */
const RAMOS = [
  // --- Semestre 1 ---
  { id: "desarrollo_personal", nombre: "Desarrollo Personal y Autoconocimiento", semestre: 1, area: "PROF", prereqs: [] },
  { id: "fundamentos_to", nombre: "Fundamentos de Terapia Ocupacional", semestre: 1, area: "PROF", prereqs: [] },
  { id: "anatomia_humana", nombre: "Anatomía Humana", semestre: 1, area: "BIO", prereqs: [] },
  { id: "salud_publica_intro", nombre: "Introducción a Salud Pública", semestre: 1, area: "PROF", prereqs: [] },
  { id: "electivo_1", nombre: "Electivo 1", semestre: 1, area: "ELEC", prereqs: [] },

  // --- Semestre 2 ---
  { id: "participacion_i", nombre: "Participación Ocupacional I", semestre: 2, area: "PROF", prereqs: ["fundamentos_to"] },
  { id: "creatividad", nombre: "Desarrollo de la Creatividad", semestre: 2, area: "PROF", prereqs: [] },
  { id: "fisiologia", nombre: "Fisiología General", semestre: 2, area: "BIO", prereqs: ["anatomia_humana"] },
  { id: "anatomia_funcional_i", nombre: "Anatomía Funcional y Biomecánica I", semestre: 2, area: "BIO", prereqs: ["anatomia_humana"] },
  { id: "electivo_2", nombre: "Electivo 2", semestre: 2, area: "ELEC", prereqs: [] },

  // --- Semestre 3 ---
  { id: "participacion_ii", nombre: "Participación Ocupacional II", semestre: 3, area: "PROF", prereqs: ["participacion_i"] },
  { id: "neurociencias_i", nombre: "Neurociencias I", semestre: 3, area: "BIO", prereqs: ["fisiologia"] },
  { id: "psicologia_ciclo_vital", nombre: "Psicología del Ciclo Vital", semestre: 3, area: "PROF", prereqs: [] },
  { id: "evaluacion_funcional_i", nombre: "Evaluación Funcional I", semestre: 3, area: "PROF", prereqs: ["anatomia_funcional_i"] },
  { id: "anatomia_funcional_ii", nombre: "Anatomía Funcional y Biomecánica II", semestre: 3, area: "BIO", prereqs: ["anatomia_funcional_i"] },

  // --- Semestre 4 ---
  { id: "participacion_iii", nombre: "Participación Ocupacional III", semestre: 4, area: "PROF", prereqs: ["participacion_ii"] },
  { id: "enfoques_metodos", nombre: "Enfoques y Métodos de Práctica", semestre: 4, area: "PROF", prereqs: ["participacion_ii"] },
  { id: "neurociencias_ii", nombre: "Neurociencias II", semestre: 4, area: "BIO", prereqs: ["neurociencias_i"] },
  { id: "evaluacion_funcional_ii", nombre: "Evaluación Funcional II", semestre: 4, area: "PROF", prereqs: ["evaluacion_funcional_i"] },
  { id: "practica_integrada_inicial", nombre: "Práctica Integrada Inicial", semestre: 4, area: "PROF", prereqs: ["participacion_iii","enfoques_metodos"] },

  // --- Semestre 5 ---
  { id: "ocupacion_infancia", nombre: "Ocupación en Infancia y Adolescencia", semestre: 5, area: "PROF", prereqs: ["participacion_iii","neurociencias_ii"] },
  { id: "ocupacion_adulto", nombre: "Ocupación en Persona Adulta", semestre: 5, area: "PROF", prereqs: ["participacion_iii","neurociencias_ii"] },
  { id: "salud_mental_i", nombre: "Salud Mental I", semestre: 5, area: "PROF", prereqs: ["psicologia_ciclo_vital"] },
  { id: "investigacion_i", nombre: "Metodología de la Investigación I", semestre: 5, area: "PROF", prereqs: ["enfoques_metodos"] },

  // --- Semestre 6 ---
  { id: "rehab_fisica_i", nombre: "Rehabilitación Física I", semestre: 6, area: "PROF", prereqs: ["ocupacion_adulto","evaluacion_funcional_ii"] },
  { id: "salud_mental_ii", nombre: "Salud Mental II", semestre: 6, area: "PROF", prereqs: ["salud_mental_i"] },
  { id: "gerontologia", nombre: "Gerontología y Envejecimiento", semestre: 6, area: "PROF", prereqs: ["ocupacion_adulto"] },
  { id: "investigacion_ii", nombre: "Metodología de la Investigación II", semestre: 6, area: "PROF", prereqs: ["investigacion_i"] },

  // --- Semestre 7 ---
  { id: "rehab_fisica_ii", nombre: "Rehabilitación Física II", semestre: 7, area: "PROF", prereqs: ["rehab_fisica_i"] },
  { id: "integracion_sensorial", nombre: "Integración Sensorial", semestre: 7, area: "PROF", prereqs: ["neurociencias_ii","ocupacion_infancia"] },
  { id: "salud_comunitaria", nombre: "Salud Comunitaria", semestre: 7, area: "PROF", prereqs: ["salud_publica_intro","participacion_iii"] },
  { id: "gestion_servicios", nombre: "Gestión de Servicios en Salud", semestre: 7, area: "PROF", prereqs: ["enfoques_metodos"] },

  // --- Semestre 8 ---
  { id: "practica_intermedia", nombre: "Práctica Integrada Intermedia", semestre: 8, area: "PROF", prereqs: ["rehab_fisica_ii","salud_mental_ii"] },
  { id: "intervencion_comunidad", nombre: "Intervención Comunitaria", semestre: 8, area: "PROF", prereqs: ["salud_comunitaria"] },
  { id: "proyecto_titulo_i", nombre: "Proyecto de Título I", semestre: 8, area: "C2", prereqs: ["investigacion_ii"] },

  // --- Semestre 9 (Ciclo 2) ---
  { id: "practica_prof_i", nombre: "Práctica Profesional I", semestre: 9, area: "C2", prereqs: ["practica_intermedia","rehab_fisica_ii","salud_mental_ii"] },
  { id: "seminario_grado", nombre: "Seminario de Grado", semestre: 9, area: "C2", prereqs: ["proyecto_titulo_i"] },
  { id: "proyecto_titulo_ii", nombre: "Proyecto de Título II", semestre: 9, area: "C2", prereqs: ["proyecto_titulo_i"] },

  // --- Semestre 10 (Ciclo 2) ---
  { id: "practica_prof_ii", nombre: "Práctica Profesional II", semestre: 10, area: "C2", prereqs: ["practica_prof_i"] },
  { id: "examen_titulo", nombre: "Examen de Título", semestre: 10, area: "C2", prereqs: ["proyecto_titulo_ii","practica_prof_ii"] },

  // Electivos avanzados (pueden cursarse desbloqueados desde sem 5–8)
  { id: "electivo_clinico", nombre: "Electivo Clínico", semestre: 6, area: "ELEC", prereqs: ["participacion_iii"] },
  { id: "electivo_comunidad", nombre: "Electivo en Comunidad", semestre: 7, area: "ELEC", prereqs: ["salud_comunitaria"] },
];

/* ============ Estado (aprobados) ============ */
let aprobados = new Set(loadProgress()); // ids aprobados

/* ============ Render ============ */
const $malla = document.getElementById("malla");
const $tpl = document.getElementById("cardTemplate");
const $aprobados = document.getElementById("aprobados");
const $total = document.getElementById("total");
const $progresoPorc = document.getElementById("progresoPorc");
const $progressBar = document.getElementById("progressBar");

function groupBySemestre(data){
  const map = new Map();
  data.forEach(r => {
    if(!map.has(r.semestre)) map.set(r.semestre, []);
    map.get(r.semestre).push(r);
  });
  return [...map.entries()].sort((a,b)=>a[0]-b[0]);
}

function crearColumnas(){
  $malla.innerHTML = "";
  const grupos = groupBySemestre(RAMOS);
  grupos.forEach(([sem, items])=>{
    const col = document.createElement("div");
    col.className = "col";
    const title = document.createElement("div");
    title.className = "semTitle";
    title.textContent = `Semestre ${sem}`;
    col.appendChild(title);

    items.forEach(r => {
      const node = $tpl.content.firstElementChild.cloneNode(true);
      node.dataset.id = r.id;
      node.dataset.semestre = r.semestre;
      node.dataset.area = r.area;

      node.querySelector(".nombre").textContent = r.nombre;
      node.querySelector(".semestre").textContent = `S${r.semestre}`;
      const areaInfo = AREAS[r.area];
      const $area = node.querySelector(".area");
      $area.textContent = areaInfo.label;
      $area.classList.add("area-badge", areaInfo.badge);

      const $pre = node.querySelector(".prereqs");
      if (r.prereqs && r.prereqs.length){
        const nombres = r.prereqs.map(id => RAMOS.find(x=>x.id===id)?.nombre || id);
        $pre.innerHTML = `<strong>Prerrequisitos:</strong> ${nombres.join(" · ")}`;
      } else {
        $pre.textContent = "Sin prerrequisitos";
      }

      const $btn = node.querySelector(".toggle");
      $btn.addEventListener("click", () => toggleAprobado(r.id));

      col.appendChild(node);
    });

    $malla.appendChild(col);
  });
}

/* ============ Lógica de bloqueo/desbloqueo ============ */
function requisitosOk(ramo){
  return (ramo.prereqs || []).every(pid => aprobados.has(pid));
}

function applyLocks(){
  const cards = [...document.querySelectorAll(".ramo")];
  cards.forEach(card=>{
    const id = card.dataset.id;
    const info = RAMOS.find(r=>r.id===id);
    const isDone = aprobados.has(id);
    const unlocked = info.semestre === 1 || requisitosOk(info);

    card.classList.toggle("done", isDone);
    card.classList.toggle("locked", !unlocked && !isDone);
    card.classList.toggle("unlocked", unlocked || isDone);

    const btn = card.querySelector(".toggle");
    btn.textContent = isDone ? "Quitar aprobación" : "Marcar aprobado";
  });
}

function toggleAprobado(id){
  if (aprobados.has(id)) aprobados.delete(id);
  else aprobados.add(id);
  saveProgress([...aprobados]);
  applyLocks();
  updateProgress();
}

/* ============ Progreso ============ */
function updateProgress(){
  const total = RAMOS.length;
  const done = aprobados.size;
  const pct = Math.round((done / total) * 100);
  $total.textContent = total;
  $aprobados.textContent = done;
  $progresoPorc.textContent = `${isNaN(pct)?0:pct}%`;
  $progressBar.style.width = `${isNaN(pct)?0:pct}%`;
}

/* ============ Persistencia ============ */
function loadProgress(){
  try{
    const raw = localStorage.getItem(LS_KEY);
    if(!raw) return [];
    const data = JSON.parse(raw);
    return Array.isArray(data) ? data : [];
  }catch(e){ return []; }
}
function saveProgress(arr){
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

/* ============ Export / Import / Reset ============ */
document.getElementById("exportar").addEventListener("click", ()=>{
  const payload = {
    version: 1,
    fecha: new Date().toISOString(),
    aprobados: [...aprobados]
  };
  const blob = new Blob([JSON.stringify(payload,null,2)], {type:"application/json"});
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "progreso_to_umayor.json";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
});

document.getElementById("importar").addEventListener("change", async (e)=>{
  const file = e.target.files?.[0];
  if(!file) return;
  try{
    const text = await file.text();
    const json = JSON.parse(text);
    if (json && Array.isArray(json.aprobados)) {
      aprobados = new Set(json.aprobados);
      saveProgress([...aprobados]);
      applyLocks();
      updateProgress();
      alert("Progreso importado con éxito ✅");
    } else {
      alert("Archivo inválido");
    }
  }catch(err){
    alert("No se pudo importar el archivo");
  } finally {
    e.target.value = "";
  }
});

document.getElementById("reiniciar").addEventListener("click", ()=>{
  if(confirm("¿Seguro que quieres borrar todo tu progreso?")){
    aprobados = new Set();
    saveProgress([]);
    applyLocks();
    updateProgress();
  }
});

/* ============ Init ============ */
crearColumnas();
applyLocks();
updateProgress();
