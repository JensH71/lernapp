import { useState } from "react";
import EinstufungstestLernapp from "./EinstufungstestLernapp";
import Lernpfad from "./lektion/Lernpfad";
export default function App() {
  const [ansicht, setAnsicht] = useState<"lernpfad" | "test">("lernpfad");
  return (
    <>
      {/* Kleiner Umschalter: Lektionen ↔ Einstufungstest bleiben beide erreichbar */}
      <nav
        style={{
          display: "flex",
          gap: 8,
          justifyContent: "center",
          padding: "12px 16px 4px",
          maxWidth: 480,
          margin: "0 auto",
        }}
      >
        <button
          className={`press-btn press-btn--ghost ${ansicht === "lernpfad" ? "is-active" : ""}`}
          onClick={() => setAnsicht("lernpfad")}
          style={{ flex: 1, fontSize: ".95rem", padding: "10px 14px" }}
        >
          Lektionen
        </button>
        <button
          className={`press-btn press-btn--ghost ${ansicht === "test" ? "is-active" : ""}`}
          onClick={() => setAnsicht("test")}
          style={{ flex: 1, fontSize: ".95rem", padding: "10px 14px" }}
        >
          Einstufungstest
        </button>
      </nav>
      {ansicht === "lernpfad" ? <Lernpfad /> : <EinstufungstestLernapp />}
    </>
  );
}
