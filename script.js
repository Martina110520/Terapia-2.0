// Guardar y cargar progreso en LocalStorage
document.addEventListener("DOMContentLoaded", () => {
  const ramos = document.querySelectorAll(".ramo");
  let aprobados = JSON.parse(localStorage.getItem("aprobados")) || [];

  // Cargar estado previo
  ramos.forEach(ramo => {
    if (aprobados.includes(ramo.dataset.id)) {
      ramo.classList.add("aprobado");
    }
  });

  // Manejar clics
  ramos.forEach(ramo => {
    ramo.addEventListener("click", () => {
      const id = ramo.dataset.id;
      const prereq = ramo.dataset.prereq.split(",").filter(p => p);

      // Verificar requisitos
      if (prereq.length > 0 && !prereq.every(p => aprobados.includes(p))) {
        alert(`No puedes aprobar "${ramo.textContent}" aún. Te faltan: ${prereq.join(", ")}`);
        return;
      }

      // Alternar estado
      if (ramo.classList.contains("aprobado")) {
        ramo.classList.remove("aprobado");
        aprobados = aprobados.filter(r => r !== id);
      } else {
        ramo.classList.add("aprobado");
        aprobados.push(id);
      }

      localStorage.setItem("aprobados", JSON.stringify(aprobados));
    });
  });
});
