import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase";
import "../styles/home.css"; // Importando o CSS externo
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const [temperature, setTemperature] = useState<number | null>(null);
  const [ph, setPh] = useState<number | null>(null);
  const [turbidity, setTurbidity] = useState<number | null>(null);
  const [limits, setLimits] = useState<{
    temperaturaMin?: number;
    temperaturaMax?: number;
    phMin?: number;
    phMax?: number;
    turbidezMin?: number;
    turbidezMax?: number;
  }>({});

  useEffect(() => {
    const temperatureRef = ref(database, "Sensores/Temperatura");
    const phRef = ref(database, "Sensores/PH");
    const turbidityRef = ref(database, "Sensores/Turbidez");
    const especieRef = ref(database, "Especie");

    onValue(temperatureRef, (snapshot) => {
      setTemperature(snapshot.val());
    });

    onValue(phRef, (snapshot) => {
      setPh(snapshot.val());
    });

    onValue(turbidityRef, (snapshot) => {
      setTurbidity(snapshot.val());
    });

    onValue(especieRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setLimits({
          temperaturaMin: data.temperaturaMin,
          temperaturaMax: data.temperaturaMax,
          phMin: data.phMin,
          phMax: data.phMax,
          turbidezMin: data.turbidezMin,
          turbidezMax: data.turbidezMax,
        });
      }
    });
  }, []);

  const verificarValor = (
    valor: number | null,
    min?: number,
    max?: number
  ): string => {
    if (min == null || max == null) {
      return "Espécie ainda não foi cadastrada";
    }
    if (valor == null) return "Carregando...";
    if (valor < min) return "Abaixo do ideal";
    if (valor > max) return "Acima do ideal";
    return "Adequado";
  };

  return (
    <div className="home-container">
      <aside>
        <div className="home-topo-menu">
          <div className="home-aside">
            <img src="/assets/Logo.png" alt="logo" className="home-logo" />
            <p>
              <strong>
                Bem vindo <br /> (a) de volta!
              </strong>
            </p>
          </div>
        </div>

        <nav className="home-options">
          <ul>
            <li className="home-active" id="HOME1" onClick={() => router.push("/home")}>
              <img src="/assets/home_svgrepo.com.png" className="home-icon" alt="Home" />
              Home
            </li>
            <li id="SENSOR" onClick={() => router.push("/sensorPhDiario")}>
              <img src="/assets/sensor_svgrepo.com.png" className="home-icon" alt="Sensores" />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <img src="/assets/history_svgrepo.com.png" className="home-icon2" alt="Histórico" />
              Histórico de dados
            </li>
            <li id="ALIMENT" onClick={() => router.push("/alimentacao")}>
              <img src="/assets/fish_svgrepo.com.png" className="home-icon" alt="Alimentação" />
              Alimentação
            </li>
            <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
              <img src="/assets/register_svgrepo.com.png" className="home-icon" alt="Cadastro" />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <img src="/assets/Vector@2x.png" alt="Menu" className="home-menu" />
        <img src="/assets/perfil.png" alt="Perfil" className="home-perfil" />
      </header>

      <div className="home-content">
        <main>
          <h2>Sensoriamento Recente</h2>
          <div className="home-cards">
            <div className="home-card">
              <h3>Temperatura</h3>
              <p>Atual da água</p>
              <div className="home-valor">
                <img
                  src="/assets/thermometer-hot_svgrepo.com.png"
                  className="home-icon-card"
                  alt="Temperatura"
                />
                <div className="home-dados">
                  <p id="Temperatura">{temperature !== null ? `${temperature}°C` : "Carregando..."}</p>
                </div>
              </div>
              <small id="info-temp">
                {verificarValor(temperature, limits.temperaturaMin, limits.temperaturaMax)}
              </small>
            </div>

            <div className="home-card">
              <h3>Ph da água</h3>
              <p>Atual da água</p>
              <div className="home-valor">
                <img
                  src="/assets/chemistry-education-lab_svgrepo.com.png"
                  className="home-icon-card"
                  alt="pH"
                />
                <div className="home-dados">
                  <p id="Ph">{ph !== null ? ph : "Carregando..."}</p>
                </div>
              </div>
              <small id="info-ph">
                {verificarValor(ph, limits.phMin, limits.phMax)}
              </small>
            </div>

            <div className="home-card">
              <h3>Nível de turbidez</h3>
              <p>Atual da água</p>
              <div className="home-valor">
                <img
                  src="/assets/drop_svgrepo.com.png"
                  className="home-icon-card"
                  alt="Turbidez"
                />
                <div className="home-dados">
                  <p id="Turbidez">{turbidity !== null ? `${turbidity} NTU` : "Carregando..."}</p>
                </div>
              </div>
              <small id="info-turb">
                {verificarValor(turbidity, limits.turbidezMin, limits.turbidezMax)}
              </small>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

