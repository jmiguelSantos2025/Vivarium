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

  const [leituras, setLeituras] = useState({ temperatura: 0, turbidez: 0, ph: 0 });
  const [mediaHora, setMediaHora] = useState({ temperatura: 0, turbidez: 0, ph: 0 });
  const [mediaDiaria, setMediaDiaria] = useState({ temperatura: 0, turbidez: 0, ph: 0 });
  const [status, setStatus] = useState({ temperatura: '...', turbidez: '...', ph: '...' });
  const [statusDiario, setStatusDiario] = useState({ temperatura: '...', turbidez: '...', ph: '...' });

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

    setLeituras({ temperatura: 0, turbidez: 0, ph: 0 });
    setMediaHora({ temperatura: 0, turbidez: 0, ph: 0 });
    setMediaDiaria({ temperatura: 0, turbidez: 0, ph: 0 });
    setStatus({ temperatura: '...', turbidez: '...', ph: '...' });
    setStatusDiario({ temperatura: '...', turbidez: '...', ph: '...' });

    const dia = dataSelecionada;
    const [hora, minuto] = horaSelecionada.split(':');
    const horaMinuto = `${hora.padStart(2, '0')}-${minuto.padStart(2, '0')}`;

    try {
      const dadosRef = ref(database, `Graficos/DataHora/${dia}/${horaMinuto}`);
      const snapshot = await get(dadosRef);
      let leiturasAtual = { temperatura: 0, turbidez: 0, ph: 0 };

      if (snapshot.exists()) {
        const dados = snapshot.val();
        leiturasAtual = {
          temperatura: dados.Temperatura || 0,
          turbidez: dados.Turbidez || 0,
          ph: dados.PH || 0,
        };
        setLeituras(leiturasAtual);
      }

      const mediaRef = ref(database, `Graficos/Medias/${dia}/${hora}`);
      const mediaSnap = await get(mediaRef);
      let mediaHoraAtual = { temperatura: 0, turbidez: 0, ph: 0 };

      if (mediaSnap.exists()) {
        const media = mediaSnap.val();
        mediaHoraAtual = {
          temperatura: media.mediaTemperatura || 0,
          turbidez: media.mediaTurbidez || 0,
          ph: media.mediaPH || 0,
        };
        setMediaHora(mediaHoraAtual);
      }

      const diariaRef = ref(database, `Graficos/Medias/${dia}/mediaDiaria`);
      const diariaSnap = await get(diariaRef);
      let mediaDiariaAtual = { temperatura: 0, turbidez: 0, ph: 0 };

      if (diariaSnap.exists()) {
        const diaria = diariaSnap.val();
        mediaDiariaAtual = {
          temperatura: diaria.mediaTemperatura || 0,
          turbidez: diaria.mediaTurbidez || 0,
          ph: diaria.mediaPH || 0,
        };
        setMediaDiaria(mediaDiariaAtual);
      }

      const especieRef = ref(database, `Especie`);
      const especieSnap = await get(especieRef);
      if (especieSnap.exists()) {
        const especie = especieSnap.val();

        const verificarStatus = (valor: number, min: number, max: number) => {
          if (valor < min) return 'Abaixo';
          if (valor > max) return 'Acima';
          return 'Normal';
        };

        // ⬇️ Usando as variáveis locais, não os states
        const statusHora = {
          temperatura: verificarStatus(mediaHoraAtual.temperatura, especie.temperaturaMin, especie.temperaturaMax),
          turbidez: verificarStatus(mediaHoraAtual.turbidez, especie.turbidezMin, especie.turbidezMax),
          ph: verificarStatus(mediaHoraAtual.ph, especie.phMin, especie.phMax),
        };

        const statusDia = {
          temperatura: verificarStatus(mediaDiariaAtual.temperatura, especie.temperaturaMin, especie.temperaturaMax),
          turbidez: verificarStatus(mediaDiariaAtual.turbidez, especie.turbidezMin, especie.turbidezMax),
          ph: verificarStatus(mediaDiariaAtual.ph, especie.phMin, especie.phMax),
        };

        setStatus(statusHora);
        setStatusDiario(statusDia);
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
            <li id="SENSOR" onClick={() => router.push("/sensorPhDiario")}>
              <Image src="/assets/sensor_svgrepo.com.png" alt="sensor" width={20} height={20} className="hsensor-icon" />
              Sensores
            </li>
            <div className="hsensor-sub-div">
              <li id="HIST1" className="hsensor-op-hist">
                <Image src="/assets/history_svgrepo.com.png" alt="hist" width={30} height={30} className="hsensor-icon2" />
                Histórico de dados
              </li>
              <li id="HIST1" className="hsensor-sub-op">Sensores</li>
              <li id="HIST1" className="hsensor-sub-op" onClick={() => router.push("/historicoAlimentacao")}>Alimentação</li>
            </div>
            <li id="ALIMENT" onClick={() => router.push("/alimentacao")}>
              <Image src="/assets/fish_svgrepo.com.png" alt="alimentacao" width={20} height={20} className="hsensor-icon" />
              Alimentação
            </li>
            <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
              <Image src="/assets/register_svgrepo.com.png" alt="cadastro" width={20} height={20} className="hsensor-icon" />
              Cadastro de espécie
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
            <span>Sensores</span>
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
                <span className="hsensor-desc-span">Turbidez</span>
                <span className="hsensor-desc-span">PH</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Data</span>
                <span className="hsensor-desc-span2">{dataFormatada}</span>
                <span className="hsensor-desc-span2">{dataFormatada}</span>
                <span className="hsensor-desc-span2">{dataFormatada}</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Hora</span>
                <span className="hsensor-desc-span2">{horaFormatada}</span>
                <span className="hsensor-desc-span2">{horaFormatada}</span>
                <span className="hsensor-desc-span2">{horaFormatada}</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Leituras</span>
                <span className="hsensor-desc-span2">{leituras.temperatura}°C</span>
                <span className="hsensor-desc-span2">{leituras.turbidez}</span>
                <span className="hsensor-desc-span2">{leituras.ph} NTU</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Média horária</span>
                <span className="hsensor-desc-span2">{mediaHora.temperatura.toFixed(2)}°C</span>
                <span className="hsensor-desc-span2">{mediaHora.turbidez.toFixed(2)}</span>
                <span className="hsensor-desc-span2">{mediaHora.ph.toFixed(2)} NTU</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Média diária</span>
                <span className="hsensor-desc-span2">{mediaDiaria.temperatura.toFixed(2)}°C</span>
                <span className="hsensor-desc-span2">{mediaDiaria.turbidez.toFixed(2)}</span>
                <span className="hsensor-desc-span2">{mediaDiaria.ph.toFixed(2)} NTU</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Status horário</span>
                <span className="hsensor-desc-span2">{status.temperatura}</span>
                <span className="hsensor-desc-span2">{status.turbidez}</span>
                <span className="hsensor-desc-span2">{status.ph}</span>
              </div>

              <div className="hsensor-desc2">
                <span className="hsensor-info">Status diário</span>
                <span className="hsensor-desc-span2">{statusDiario.temperatura}</span>
                <span className="hsensor-desc-span2">{statusDiario.turbidez}</span>
                <span className="hsensor-desc-span2">{statusDiario.ph}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
