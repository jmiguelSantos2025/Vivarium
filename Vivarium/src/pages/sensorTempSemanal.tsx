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

const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function getManausDateNDaysAgo(n: number): { label: string; dateStr: string } {
  const now = new Date();
  const offsetManaus = -4 * 60; // Manaus = UTC-4
  const localOffset = now.getTimezoneOffset();
  const diff = offsetManaus - localOffset;

  const manausDate = new Date(now.getTime() + diff * 60000);
  manausDate.setDate(manausDate.getDate() - n);

  const label = diasSemana[manausDate.getDay()];
  const dateStr = manausDate.toLocaleDateString('sv-SE', { timeZone: 'America/Manaus' }); // yyyy-mm-dd

  return { label, dateStr };
}

export default function SensorTemperaturaSemanal() {
  const [chartData, setChartData] = useState<ChartPoint[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const newChartData: ChartPoint[] = [];

      for (let i = 6; i >= 0; i--) {
        const { label, dateStr } = getManausDateNDaysAgo(i);

        try {
          const diaRef = ref(database, `Graficos/Medias/${dateStr}/mediaDiaria`);
          const snapshot = await get(diaRef);

          if (snapshot.exists()) {
            const valor = snapshot.val().mediaTemperatura || 0;
            newChartData.push({ name: label, leitura: valor });
          } else {
            newChartData.push({ name: label, leitura: 0 });
          }
        } catch (error) {
          console.error(`Erro ao buscar dados do dia ${dateStr}:`, error);
          newChartData.push({ name: label, leitura: 0 });
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
            <li id="IA" onClick={() => router.push("/TeachableIA")}>
              <img src="/assets/icons8-inteligência-artificial-100.png" style={{width: "25px",height: "25px",}} alt="IA" />
              IA
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <Image src="/assets/Vector@2x.png" alt="Menu" className="sted-menu" width={30} height={30} />
        {/* Removidos os botões PH, Temperatura e Turbidez */}
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
                <button id="BUTTON" className="sted-side-btn">Semanal</button>
                <button className="sted-side-btn" onClick={() => router.push("/sensorTempDiario")}>Diário</button>
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
