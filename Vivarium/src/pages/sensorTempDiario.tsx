// SensorTemperatura.tsx
'use client';

import React, { useEffect, useState } from 'react';
import '../styles/sensorTempDiario.css';
import Image from 'next/image';
import LineChartExample from './grafico';
import { database } from '../services/firebase';
import { ref, get } from 'firebase/database';
import { useRouter } from "next/navigation";

interface ChartPoint {
  name: string;
  leitura: number;
}

export default function SensorTemperaturaDiario() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const router = useRouter();

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
            const temperatura = data.mediaTemperatura || 0;
            newChartData.push({ name: hourLabel, leitura: temperatura });
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
    <div className="sted-container">
      <aside>
        <div className="sted-topo-menu">
          <div className="sted-aside">
            <Image src="/assets/Logo.png" alt="logo" className="sted-logo" width={40} height={40} />
            <p><strong>Bem vindo <br />(a) de volta!</strong></p>
          </div>
        </div>

        <nav className="sted-options">
          <ul>
            <li className="active" id="HOME" onClick={() => router.push("/home")}>
              <Image src="/assets/home_svgrepo.com.png" alt="Home" className="sted-icon" width={20} height={20} />
              Home
            </li>
            <li id="SENSOR1">
              <Image src="/assets/sensor_svgrepo.com.png" alt="Sensor" className="sted-icon" width={20} height={20} />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <Image src="/assets/history_svgrepo.com.png" alt="Histórico" className="sted-icon2" width={30} height={30} />
              Histórico de dados
            </li>
            <li id="ALIMENT" onClick={() => router.push("/alimentacao")}>
              <Image src="/assets/fish_svgrepo.com.png" alt="Alimentação" className="sted-icon" width={20} height={20} />
              Alimentação
            </li>
            <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
              <Image src="/assets/register_svgrepo.com.png" alt="Cadastro" className="sted-icon" width={20} height={20} />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <Image src="/assets/Vector@2x.png" alt="Menu" className="sted-menu" width={30} height={30} />
        <div className="sted-op-up">
          <button id="PH" onClick={() => router.push("/sensorPhDiario")}>PH</button>
          <button id="Temperatura1">Temperatura</button>
          <button id="Turbidez" onClick={() => router.push("/sensorTurbDiario")}>Turbidez</button>
        </div>
        <Image src="/assets/perfil.png" alt="Perfil" className="sted-perfil" width={40} height={40} />
      </header>

      <div className="sted-content">
        <main>
          <div className="sted-title-with-buttons">
            <div className="sted-title">
              <h2>Sensores</h2>
              <span>Gráficos</span>
            </div>
          </div>

          <div className="sted-card">
            <div className="sted-h1-title">
              <h2>Gráfico de Temperatura</h2>
              <div className="sted-side-buttons">
                <button className="sted-side-btn" onClick={() => router.push("/sensorTempSemanal")}>Semanal</button>
                <button id='BUTTON' className="sted-side-btn">Diário</button>
              </div>
            </div>
            <div className="sted-chart-area">
              <LineChartExample data={chartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
