'use client';

import React, { useEffect, useState } from 'react';
import '../styles/sensorPhDiario.css';
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

export default function SensorPhSemanal() {
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
            const valor = snapshot.val().mediaPH || 0;
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
    <div className="spd-container">
            <aside>
              <div className="spd-topo-menu">
                <div className="spd-aside">
                  <Image src="/assets/Logo.png" alt="logo" className="spd-logo" width={40} height={40} />
                  <p><strong>Bem vindo <br />(a) de volta!</strong></p>
                </div>
              </div>
      
              <nav className="spd-options">
                <ul>
                  <li className="spd-active" id="HOME" onClick={() => router.push("/home")}>
                    <Image src="/assets/home_svgrepo.com.png" alt="Home" className="spd-icon" width={20} height={20} />
                    Home
                  </li>
                  <li id="SENSOR1">
                    <Image src="/assets/sensor_svgrepo.com.png" alt="Sensor" className="spd-icon" width={20} height={20} />
                    Sensores
                  </li>
                  <li id="HIST" onClick={() => router.push("/historicoSensores")}>
                    <Image src="/assets/history_svgrepo.com.png" alt="Histórico" className="spd-icon2" width={30} height={30} />
                    Histórico de dados
                  </li>
                  <li id="ALIMENT" onClick={() => router.push("/alimentacao")}>
                    <Image src="/assets/fish_svgrepo.com.png" alt="Alimentação" className="spd-icon" width={20} height={20} />
                    Alimentação
                  </li>
                  <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
                    <Image src="/assets/register_svgrepo.com.png" alt="Cadastro" className="spd-icon" width={20} height={20} />
                    Cadastro de espécie
                  </li>
                </ul>
              </nav>
            </aside>
      
            <header>
              <Image src="/assets/Vector@2x.png" alt="Menu" className="spd-menu" width={30} height={30} />
              <div className="spd-op-up">
                <button id="PH1">PH</button>
                <button id="Temperatura" onClick={() => router.push("/sensorTempDiario")}>Temperatura</button>
                <button id="Turbidez" onClick={() => router.push("/sensorTurbDiario")}>Turbidez</button>
              </div>
              <Image src="/assets/perfil.png" alt="Perfil" className="spd-perfil" width={40} height={40} />
            </header>

      <div className="spd-content">
        <main>
          <div className="spd-title-with-buttons">
            <div className="spd-title">
              <h2>Sensores</h2>
              <span>Gráficos</span>
            </div>
          </div>

          <div className="spd-card">
            <div className="spd-h1-title">
              <h2>Gráfico de Ph</h2>
              <div className="spd-side-buttons">
                <button id="BUTTON" className="spd-side-btn">Semanal</button>
                <button className="spd-side-btn" onClick={() => router.push('/sensorPhDiario')}>Diário</button>
              </div>
            </div>
            <div className="spd-chart-area">
              <LineChartExample data={chartData} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
