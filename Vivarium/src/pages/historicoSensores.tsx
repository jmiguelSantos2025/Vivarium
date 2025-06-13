'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import '../styles/historicoSensores.css';

import { database } from '../services/firebase';
import { ref, get } from 'firebase/database';
import { useRouter } from "next/navigation";

export default function Historico() {
  const router = useRouter();
  const [dataInput, setDataInput] = useState('');
  const [horaInput, setHoraInput] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [horaSelecionada, setHoraSelecionada] = useState('');

  const [temperatura, setTemperatura] = useState(0);
  const [mediaHoraTemp, setMediaHoraTemp] = useState(0);
  const [mediaDiariaTemp, setMediaDiariaTemp] = useState(0);

  const formatarData = (data: string) => {
    if (!data) return '';
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  const dataFormatada = dataSelecionada ? formatarData(dataSelecionada) : '00/00/00';
  const horaFormatada = horaSelecionada || '00:00';
  const titulo = dataSelecionada ? `Leitura do dia (${dataFormatada})` : 'Escolha o dia';

  useEffect(() => {
    const buscarDados = async () => {
      if (!dataSelecionada || !horaSelecionada) return;

      setTemperatura(0);
      setMediaHoraTemp(0);
      setMediaDiariaTemp(0);

      const dia = dataSelecionada;
      const [hora, minuto] = horaSelecionada.split(':');
      const horaMinuto = `${hora.padStart(2, '0')}-${minuto.padStart(2, '0')}`;

      try {
        const dadosRef = ref(database, `Graficos/DataHora/${dia}/${horaMinuto}`);
        const snapshot = await get(dadosRef);

        if (snapshot.exists()) {
          const dados = snapshot.val();
          setTemperatura(dados.Temperatura || 0);
        }

        const mediaRef = ref(database, `Graficos/Medias/${dia}/${hora}`);
        const mediaSnap = await get(mediaRef);

        if (mediaSnap.exists()) {
          const media = mediaSnap.val();
          setMediaHoraTemp(media.mediaTemperatura || 0);
        }

        const diariaRef = ref(database, `Graficos/Medias/${dia}/mediaDiaria`);
        const diariaSnap = await get(diariaRef);

        if (diariaSnap.exists()) {
          const diaria = diariaSnap.val();
          setMediaDiariaTemp(diaria.mediaTemperatura || 0);
        }
      } catch (error) {
        console.error('Erro ao buscar dados do Firebase:', error);
      }
    };

    buscarDados();
  }, [dataSelecionada, horaSelecionada]);

  return (
    <div className="hsensor-container">
      <aside>
        <div className="hsensor-topo-menu">
          <div className="hsensor-aside">
            <Image src="/assets/Logo.png" alt="logo" width={40} height={40} className="hsensor-logo" />
            <p><strong>Bem vindo <br />(a) de volta!</strong></p>
          </div>
        </div>

        <nav className="hsensor-options">
          <ul>
            <li className="active" id="HOME" onClick={() => router.push("/home")}>
              <Image src="/assets/home_svgrepo.com.png" alt="home" width={20} height={20} className="hsensor-icon" />
              Home
            </li>
            <li id="SENSOR" onClick={() => router.push("/sensorTempDiario")}>
              <Image src="/assets/sensor_svgrepo.com.png" alt="sensor" width={20} height={20} className="hsensor-icon" />
              Sensores
            </li>
            <div className="hsensor-sub-div">
              <li className="hsensor-op-hist">
                <Image src="/assets/history_svgrepo.com.png" alt="hist" width={30} height={30} className="hsensor-icon2" />
                Histórico de dados
              </li>
                
            </div>
            <li id="IA" onClick={() => router.push("/TeachableIA")}>
                  <img src="/assets/icons8-inteligência-artificial-100.png" style={{width: "25px",height: "25px",}} alt="IA" />
              IA
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <Image src="/assets/Vector@2x.png" alt="menu" width={30} height={30} className="hsensor-menu" />
        <Image src="/assets/perfil.png" alt="perfil" width={40} height={40} className="hsensor-perfil" />
      </header>

      <div className="hsensor-content">
        <main>
          <div className="hsensor-title">
            <h2>Histórico de Dados</h2>
            <span>Temperatura</span>
          </div>

          <div className="hsensor-card">
            <div className="hsensor-h1-title hsensor-date-inputs">
              <h2>{titulo}</h2>
              <input
                type="date"
                className="hsensor-input-data"
                onChange={(e) => setDataInput(e.target.value)}
                value={dataInput}
              />
              <input
                type="time"
                className="hsensor-input-hora"
                onChange={(e) => setHoraInput(e.target.value)}
                value={horaInput}
              />
              <button
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  backgroundColor: '#0948A5',
                  color: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
                onClick={() => {
                  setDataSelecionada(dataInput);
                  setHoraSelecionada(horaInput);
                }}
              >
                Atualizar
              </button>
            </div>

            <div className="hsensor-info-org">
              <div className="hsensor-desc">
                <span className="hsensor-info">Descrição</span>
                <span className="hsensor-desc-span">Temperatura</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Data</span>
                <span className="hsensor-desc-span2">{dataFormatada}</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Hora</span>
                <span className="hsensor-desc-span2">{horaFormatada}</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Leitura</span>
                <span className="hsensor-desc-span2">{temperatura}°C</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Média horária</span>
                <span className="hsensor-desc-span2">{mediaHoraTemp.toFixed(2)}°C</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Média diária</span>
                <span className="hsensor-desc-span2">{mediaDiariaTemp.toFixed(2)}°C</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
