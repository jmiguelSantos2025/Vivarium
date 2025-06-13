import React, { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../services/firebase";
import "../styles/home.css";
import { useRouter } from "next/navigation";


export default function Home() {
  const router = useRouter();
  const [temperature, setTemperature] = useState<number | null>(null);

  useEffect(() => {
    const temperatureRef = ref(database, "temp");

    onValue(temperatureRef, (snapshot) => {
      setTemperature(snapshot.val());
    });
  }, []);

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
            <li id="SENSOR" onClick={() => router.push("/sensorTempDiario")}>
              <img src="/assets/sensor_svgrepo.com.png" className="home-icon" alt="Sensores" />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <img src="/assets/history_svgrepo.com.png" className="home-icon2" alt="Histórico" />
              Histórico de dados
            </li>
            <li id="IA" onClick={() => router.push("/TeachableIA")}>
              <img src="/assets/icons8-inteligência-artificial-100.png" style={{width: "25px",height: "25px",}} alt="IA" />
              IA
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
                  <p id="Temperatura">
                    {temperature !== null ? `${temperature}°C` : "Carregando..."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
