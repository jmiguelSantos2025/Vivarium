"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../styles/alimentacao2.css";
import { ref, set, get } from "firebase/database";
import { database } from "../services/firebase";
import { getFrequencia } from "../services/frequencia";

export default function Alimentacao2() {
  const router = useRouter();
  const [frequencia, setFrequenciaLocal] = useState<number>(1);
  const [horarios, setHorarios] = useState<string[]>([]);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const freq = getFrequencia() || 1;
    setFrequenciaLocal(freq);
    setHorarios(Array(freq - 1).fill(""));
  }, []);

  const handleChange = (index: number, value: string) => {
    const novosHorarios = [...horarios];
    novosHorarios[index] = value;
    setHorarios(novosHorarios);
  };

  const handleSubmit = async () => {
    if (horarios.some((horario) => horario.trim() === "")) {
      setErro("Por favor, preencha todos os horários antes de continuar.");
      return;
    }

    try {
      // Recupera o horário 1 já salvo no Firebase
      const snapshot = await get(ref(database, "Alimentacao/Horario/1"));
      const horario1 = snapshot.exists() ? snapshot.val() : "";

      // Monta objeto com todos os horários, incluindo o horário 1 recuperado
      const horariosObject: Record<string, string> = {
        "1": horario1,
      };

      // Adiciona os outros horários a partir da chave 2
      horarios.forEach((horario, index) => {
        horariosObject[(index + 2).toString()] = horario;
      });

      await set(ref(database, "Alimentacao/Horario"), horariosObject);
      router.push("/home");
    } catch (error) {
      console.error("Erro ao salvar os horários: ", error);
      setErro("Erro ao salvar os horários. Tente novamente.");
    }
  };

  return (
    <div className="alimentacao2-container">
      <aside>
        <div className="alimentacao2-topo-menu">
          <div className="alimentacao2-aside">
            <Image src="/assets/Logo.png" alt="logo" width={40} height={40} className="alimentacao2-logo" />
            <p><strong>Bem-vindo <br />(a) de volta!</strong></p>
          </div>
        </div>

        <nav className="alimentacao2-options">
          <ul>
            <li className="active" id="HOME" onClick={() => router.push("/home")}>
              <Image src="/assets/home_svgrepo.com.png" alt="Home" width={20} height={20} className="alimentacao2-icon" />
              Home
            </li>
            <li id="SENSOR" onClick={() => router.push("/sensorPhDiario")}>
              <Image src="/assets/sensor_svgrepo.com.png" alt="Sensores" width={20} height={20} className="alimentacao2-icon" />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <Image src="/assets/history_svgrepo.com.png" alt="Histórico" width={30} height={30} className="alimentacao2-icon2" />
              Histórico de dados
            </li>
            <li id="ALIMENT1" onClick={() => router.push("/alimentacao")}>
              <Image src="/assets/fish_svgrepo.com.png" alt="Alimentação" width={20} height={20} className="alimentacao2-icon" />
              Alimentação
            </li>
            <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
              <Image src="/assets/register_svgrepo.com.png" alt="Cadastro" width={20} height={20} className="alimentacao2-icon" />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header className="alimentacao2-header">
        <Image src="/assets/Vector@2x.png" alt="Menu" width={30} height={30} className="alimentacao2-menu" />
        <Image src="/assets/perfil.png" alt="Perfil" width={40} height={40} className="alimentacao2-perfil" />
      </header>

      <div className="alimentacao2-content">
        <main>
          <div className="alimentacao2-card">
            <section className="alimentacao-org-sup">
              {horarios.map((horario, index) => (
                <div key={index} className="alimentacao2-input">
                  <label>Defina Horário {index + 2}</label>
                  <input
                    type="time"
                    value={horario}
                    onChange={(e) => handleChange(index, e.target.value)}
                    className="alimentacao2-input-left"
                  />
                </div>
              ))}
            </section>

            <div className="alimentacao2-footer">
              {erro && <div style={{ color: 'red', marginTop: '10px' }}>{erro}</div>}
              <button onClick={handleSubmit}>Confirmar</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
