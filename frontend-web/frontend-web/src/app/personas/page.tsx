"use client";

import { createPersona } from "@/services/personas.service";
import { useState } from "react";

export default function PersonasPage() {
  const [form, setForm] = useState({
    primernombre: "",
    primerapellido: "",
    telefono: "",
    direccion: "",
  });

  const handleSubmit = async () => {
    try {
      await createPersona(form);

      alert("Persona creada");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <input
        placeholder="Primer Nombre"
        value={form.primernombre}
        onChange={(e) =>
          setForm({
            ...form,
            primernombre: e.target.value,
          })
        }
      />

      <input
        placeholder="Primer Apellido"
        value={form.primerapellido}
        onChange={(e) =>
          setForm({
            ...form,
            primerapellido: e.target.value,
          })
        }
      />

      <button onClick={handleSubmit}>Guardar</button>
    </div>
  );
}
