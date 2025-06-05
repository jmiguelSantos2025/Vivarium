"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ref, update } from "firebase/database";
import { database } from "../services/firebase";
import "../styles/cadastroEspecie2.css";

export default function cadastroEspecie2() {
  const router = useRouter();

  const [phMax, setPhMax] = useState("");
  const [phMin, setPhMin] = useState("");
  const [turbMax, setTurbMax] = useState("");
  const [turbMin, setTurbMin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    const phMaxValue = parseFloat(phMax);
    const phMinValue = parseFloat(phMin);
    const turbMaxValue = parseFloat(turbMax);
    const turbMinValue = parseFloat(turbMin);

    if ([phMaxValue, phMinValue, turbMaxValue, turbMinValue].some(isNaN)) {
      setError("Preencha todos os campos corretamente.");
      return;
    }

    if (phMaxValue > 14) {
      setError("O pH máximo não pode ser maior que 14.");
      return;
    }

    if (phMinValue < 0 || phMaxValue < 0) {
      setError("Os valores de pH não podem ser negativos.");
      return;
    }

    if (turbMinValue < 0 || turbMaxValue < 0) {
      setError("Os valores de turbidez não podem ser negativos.");
      return;
    }

    if (phMinValue >= phMaxValue) {
      setError("O pH mínimo deve ser menor que o máximo.");
      return;
    }

    if (turbMinValue >= turbMaxValue) {
      setError("A turbidez mínima deve ser menor que a máxima.");
      return;
    }

    const updateData = {
      phMax: phMaxValue,
      phMin: phMinValue,
      turbidezMax: turbMaxValue,
      turbidezMin: turbMinValue,
    };

    try {
      const especieRef = ref(database, "Especie");
      await update(especieRef, updateData);
      alert("Dados atualizados com sucesso!");
      router.push("/home");
    } catch (err) {
      setError("Erro ao salvar os dados. Tente novamente.");
    }
  };

  return (
    <div className="especie2-container">
      <aside>
        <div className="especie2-topo-menu">
          <div className="especie2-aside">
            <Image src="/assets/Logo.png" alt="logo" width={40} height={40} className="especie2-logo" />
            <p><strong>Bem vindo <br />(a) de volta!</strong></p>
          </div>
        </div>
        <nav className="especie2-options">
          <ul>
            <li className="especie2-active" id="HOME" onClick={() => router.push("/home")}>
              <Image src="/assets/home_svgrepo.com.png" alt="Home" width={20} height={20} className="especie2-icon" />
              Home
            </li>
            <li id="SENSOR" onClick={() => router.push("/sensorPhDiario")}>
              <Image src="/assets/sensor_svgrepo.com.png" alt="Sensores" width={20} height={20} className="especie2-icon" />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <Image src="/assets/history_svgrepo.com.png" alt="Histórico de dados" width={30} height={30} className="especie2-icon2" />
              Histórico de dados
            </li>
            <li id="ALIMENT" onClick={() => router.push("/alimentacao")}>
              <Image src="/assets/fish_svgrepo.com.png" alt="Alimentação" width={20} height={20} className="especie2-icon" />
              Alimentação
            </li>
            <li id="CADESPE1" onClick={() => router.push("/cadastroEspecie")}>
              <Image src="/assets/register_svgrepo.com.png" alt="Cadastro de espécie" width={20} height={20} className="especie2-icon" />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <Image src="/assets/Vector@2x.png" alt="Menu" width={30} height={30} className="especie2-menu" />
        <Image src="/assets/perfil.png" alt="Perfil" width={40} height={40} className="especie2-perfil" />
      </header>

      <div className="especie2-content">
        <main>
          <div className="especie2-title">
            <Image src="/assets/icon.png" alt="Ícone" width={30} height={30} onClick={() => router.push("/cadastroEspecie")} />
            <h2>Cadastro de Espécies</h2>
            <span>Programação</span>
          </div>

          <div className="especie2-card">
            <section className="especie2-org-sup">
              <div className="especie2-input">
                <label>PH máximo</label>
                <input
                  type="number"
                  placeholder="Digite o PH máximo"
                  value={phMax}
                  onChange={(e) => setPhMax(e.target.value)}
                  className="especie2-input-left"
                />
              </div>

              <div className="especie2-input">
                <label>PH mínimo</label>
                <input
                  type="number"
                  placeholder="Digite o PH mínimo"
                  value={phMin}
                  onChange={(e) => setPhMin(e.target.value)}
                  className="especie2-input-left"
                />
              </div>

              <div className="especie2-input">
                <label>Turbidez máxima</label>
                <input
                  type="number"
                  placeholder="Digite a Turbidez máxima"
                  value={turbMax}
                  onChange={(e) => setTurbMax(e.target.value)}
                  className="especie2-input-left"
                />
              </div>

              <div className="especie2-input">
                <label>Turbidez mínima</label>
                <input
                  type="number"
                  placeholder="Digite a Turbidez mínima"
                  value={turbMin}
                  onChange={(e) => setTurbMin(e.target.value)}
                  className="especie2-input-left"
                />
              </div>
            </section>

            <div className="especie2-footer">
              {error && <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>}
              <button onClick={handleSave}>Finalizar</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
