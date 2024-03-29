import {
  getAuth,
  getFirestore
} from "../lib/fabrica.js";
import {
  getString,
  muestraError
} from "../lib/util.js";
import {
  muestraSeguros
} from "./navegacion.js";
import {
  tieneRol
} from "./seguridad.js";

const daoSeguro =
  getFirestore().
    collection("Seguro");
const params =
  new URL(location.href).
    searchParams;
const id = params.get("id");
/** @type {HTMLFormElement} */
const forma = document["forma"];

getAuth().onAuthStateChanged(
  protege, muestraError);

/** @param {import(
    "../lib/tiposFire.js").User}
    usuario */
async function protege(Asegurado) {
  if (tieneRol(Asegurado,
    ["Administrador"])) {
    busca();
  }
}

/** Busca y muestra los datos que
 * corresponden al id recibido. */
async function busca() {
  try {
    const doc =
      await daoSeguro.
        doc(id).
        get();
    if (doc.exists) {
      /**
       * @type {
          import("./tipos.js").
                  } */
      const data = doc.data();
      forma.matricula.value = data.matricula;
      forma.nombre.value = data.nombre || "";
      forma.nombres.value = data.nombres || "";
      forma.auto.value = data.auto || "";
      forma.modeloa.value = data.modeloa || "";
      forma.poliza.value = data.poliza || "";
      forma.telefono.value = data.telefono || "";
      forma.correo.value = data.correo || "";
      forma.fecha.value = data.fecha || "";
      forma.addEventListener(
        "submit", guarda);
      forma.eliminar.
        addEventListener(
          "click", elimina);
    } else {
      throw new Error(
        "No se encontró.");
    }
  } catch (e) {
    muestraError(e);
    muestraSeguros();
  }
}

/** @param {Event} evt */
async function guarda(evt) {
  try {
    evt.preventDefault();
    const formData =
      new FormData(forma);
    const matricula = getString(
        formData, "matricula").trim();  
    const nombre = getString(formData, "Nombre Completo").trim();
    const nombres = getString(formData, "Nombre Seguro").trim();
    const auto = getString(formData, "Auto").trim();
    const modeloa = getString(formData, "Modelo").trim();
    const poliza = getString(formData, "Poliza").trim();
    const telefono = getString(formData, "telefono").trim();
    const correo = getString(formData, "correo").trim();
    const fecha = getString(formData, "fecha").trim();
    /**
     * @type {
        import("./tipos.js").
                Alumno} */
    const modelo = {
      matricula, 
      nombre,
      nombres,
      auto,
      modeloa,
      poliza,
      telefono,
      correo,
      fecha
    };
    await daoSeguro.
      doc(id).
      set(modelo);
    muestraSeguros();
  } catch (e) {
    muestraError(e);
  }
}

async function elimina() {
  try {
    if (confirm("Confirmar la " +
      "eliminación")) {
      await daoSeguro.
        doc(id).
        delete();
      muestraSeguros();
    }
  } catch (e) {
    muestraError(e);
  }
}

