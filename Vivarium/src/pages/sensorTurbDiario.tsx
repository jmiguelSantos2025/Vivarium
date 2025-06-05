'use client';

import React, { useEffect, useState } from 'react';
import '../styles/sensorTurbDiario.css';
import Image from 'next/image';
import LineChartExample from './grafico';
import { database } from '../services/firebase';
import { ref, get } from 'firebase/database';
import { useRouter } from "next/navigation";

interface ChartPoint {
  name: string;
  leitura: number;
}

export default function SensorTurbidezDiario() {
  const router = useRouter();
  const [chartData, setChartData] = useState<ChartPoint[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const now = new Date();
      const dateStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Manaus' });
      const newChartData: ChartPoint[] = [];

      for (let hour = 0; hour < 24; hour++) {
        const hourStr = hour.toString().padStart(2, '0');
        const hourLabel = `${hourStr}:00`;

        try {
          const hourRef = ref(database, `Graficos/Medias/${dateStr}/${hourStr}`);
          const snapshot = await get(hourRef);

          if (snapshot.exists()) {
            const data = snapshot.val();
            const turbidez = data.mediaTurbidez || 0;
            newChartData.push({ name: hourLabel, leitura: turbidez });
          } else {
            newChartData.push({ name: hourLabel, leitura: 0 });
          }
        } catch (error) {
          console.error(`Erro ao buscar hora ${hourStr}:`, error);
          newChartData.push({ name: hourLabel, leitura: 0 });
        }
      }

      setChartData(newChartData);
    };

    fetchData();
  }, []);

  return (
    <div className="stud-container">
      <aside>
        <div className="stud-topo-menu">
          <div className="stud-aside">
            <Image src="/assets/Logo.png" alt="logo" className="stud-logo" width={40} height={40} />
            <p><strong>Bem vindo <br />(a) de volta!</strong></p>
          </div>
        </div>

        <nav className="stud-options">
          <ul>
            <li className="stud-active" id="HOME" onClick={() => router.push("/home")}>
              <Image src="/assets/home_svgrepo.com.png" alt="Home" className="stud-icon" width={20} height={20} />
              Home
            </li>
            <li id="SENSOR1">
              <Image src="/assets/sensor_svgrepo.com.png" alt="Sensor" className="stud-icon" width={20} height={20} />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <Image src="/assets/history_svgrepo.com.png" alt="Histórico" className="stud-icon2" width={30} height={30} />
              Histórico de dados
            </li>
            <li id="ALIMENT" onClick={() => router.push("/alimentacao")}>
              <Image src="/assets/fish_svgrepo.com.png" alt="Alimentação" className="stud-icon" width={20} height={20} />
              Alimentação
            </li>
            <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
              <Image src="/assets/register_svgrepo.com.png" alt="Cadastro" className="stud-icon" width={20} height={20} />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <Image src="/assets/Vector@2x.png" alt="Menu" className="stud-menu" width={30} height={30} />
        <div className="stud-op-up">
          <button id="PH" onClick={() => router.push("/sensorPhDiario")}>PH</button>
          <button id="Temperatura" onClick={() => router.push("/sensorTempDiario")}>Temperatura</button>
          <button id="Turbidez1">Turbidez</button>
        </div>
        <Image src="/assets/perfil.png" alt="Perfil" className="stud-perfil" width={40} height={40} />
      </header>

      <div className="stud-content">
        <main>
          <div className="stud-title-with-buttons">
            <div className="stud-title">
              <h2>Sensores</h2>
              <span>Gráficos</span>
            </div>
          </div>

          <div className="stud-card">
            <div className="stud-h1-title">
              <h2>Gráfico de Turbidez</h2>
              <div className="stud-side-buttons">
                <button className="stud-side-btn" onClick={() => router.push("/sensorTurbSemanal")}>Semanal</button>
                <button id='BUTTON' className="stud-side-btn">Diário</button>
              </div>
            </div>
            <div className="stud-chart-area">
              <LineChartExample data={chartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
