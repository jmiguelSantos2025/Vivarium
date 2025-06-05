'use client';

import Image from 'next/image';
import '../styles/historicoAlimentacao.css';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { database } from "../services/firebase";
import { ref, get, child } from "firebase/database";

export default function Historico() {
  const router = useRouter();

  const [ultimaAlimentacao, setUltimaAlimentacao] = useState<string>('');
  const [proximaAlimentacao, setProximaAlimentacao] = useState<string>('');
  const [quantidade, setQuantidade] = useState<string>('');
  const [especie, setEspecie] = useState<string>('');
  const [exemplares, setExemplares] = useState<string>('');

  useEffect(() => {
    async function fetchData() {
      try {
        const dbRef = ref(database);

        // Buscar horários
        const horarioSnap = await get(child(dbRef, 'Alimentacao/Horario'));
        if (horarioSnap.exists()) {
          const horarios = horarioSnap.val();
          const now = new Date();
          const horaAtual = now.getHours();
          const minutoAtual = now.getMinutes();
          const horaMinAtual = horaAtual * 60 + minutoAtual;

          let ultima = '';
          let proxima = '';
          let minDiferenca = Infinity;

          Object.values(horarios).forEach((h: any) => {
            const [hora, minuto] = h.split(':').map(Number);
            const totalMin = hora * 60 + minuto;

            if (totalMin <= horaMinAtual && (!ultima || totalMin > getMinutes(ultima))) {
              ultima = h;
            }

            const diferenca = totalMin - horaMinAtual;
            if (diferenca > 0 && diferenca < minDiferenca) {
              proxima = h;
              minDiferenca = diferenca;
            }
          });

          setUltimaAlimentacao(ultima);
          setProximaAlimentacao(proxima);
        }

        // Quantidade
        const quantidadeSnap = await get(child(dbRef, 'Alimentacao/Quantidade'));
        if (quantidadeSnap.exists()) {
          setQuantidade(String(quantidadeSnap.val()));
        }

        // Espécie
        const especieSnap = await get(child(dbRef, 'Especie/especie'));
        if (especieSnap.exists()) {
          setEspecie(String(especieSnap.val()));
        }

        // Número de exemplares
        const exemplaresSnap = await get(child(dbRef, 'Especie/quantidade'));
        if (exemplaresSnap.exists()) {
          setExemplares(String(exemplaresSnap.val()));
        }

      } catch (error) {
        console.error('Erro ao buscar dados do Firebase:', error);
      }
    }

    fetchData();
  }, []);

  function getMinutes(horario: string): number {
    const [h, m] = horario.split(':').map(Number);
    return h * 60 + m;
  }

  return (
    <div className="halimentacao-container">
      <aside>
        <div className="halimentacao-topo-menu">
          <div className="halimentacao-aside">
            <Image src="/assets/Logo.png" alt="logo" width={40} height={40} className="halimentacao-logo" />
            <p><strong>Bem vindo <br />(a) de volta!</strong></p>
          </div>
        </div>

        <nav className="halimentacao-options">
          <ul>
            <li className="halimentacao-active" id="HOME" onClick={() => router.push("/home")}>
              <Image src="/assets/home_svgrepo.com.png" alt="home" width={20} height={20} className="halimentacao-icon" />
              Home
            </li>
            <li id="SENSOR" onClick={() => router.push("/sensorPhDiario")}>
              <Image src="/assets/sensor_svgrepo.com.png" alt="sensor" width={20} height={20} className="halimentacao-icon" />
              Sensores
            </li>
            <div className="halimentacao-sub-div">
              <li id="HIST1" className="halimentacao-op-hist">
                <Image src="/assets/history_svgrepo.com.png" alt="hist" width={30} height={30} className="halimentacao-icon2" />
                Histórico de dados
              </li>
              <li className="halimentacao-sub-op" onClick={() => router.push("/historicoSensores")}>Sensores</li>
              <li className="halimentacao-sub-op">Alimentação</li>
            </div>
            <li id="ALIMENT" onClick={() => router.push("/alimentacao")}>
              <Image src="/assets/fish_svgrepo.com.png" alt="alimentacao" width={20} height={20} className="halimentacao-icon" />
              Alimentação
            </li>
            <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
              <Image src="/assets/register_svgrepo.com.png" alt="cadastro" width={20} height={20} className="halimentacao-icon" />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <Image src="/assets/Vector@2x.png" alt="menu" width={30} height={30} className="halimentacao-menu" />
        <Image src="/assets/perfil.png" alt="perfil" width={40} height={40} className="halimentacao-perfil" />
      </header>

      <div className="halimentacao-content">
        <main>
          <div className="halimentacao-title">
            <h2>Histórico de Dados</h2>
            <span>Últimos dados relevantes</span>
          </div>

          <div className="halimentacao-card">
            <div className="halimentacao-h1-title halimentacao-date-inputs">
              <h2>Últimos dados relevantes</h2>
            </div>

            <div className="halimentacao-info-org">
              <div className="halimentacao-desc">
                <span className="halimentacao-info">Última alimentação</span>
                <span className="halimentacao-desc-span2">{ultimaAlimentacao || '---'}</span>
              </div>

              <div className="halimentacao-desc2">
                <span className="halimentacao-info">Quantidade</span>
                <span className="halimentacao-desc-span2">{quantidade || '---'}g</span>
              </div>

              <div className="halimentacao-desc2">
                <span className="halimentacao-info">Próxima alimentação</span>
                <span className="halimentacao-desc-span2">{proximaAlimentacao || '---'}</span>
              </div>

              <div className="halimentacao-desc2">
                <span className="halimentacao-info">Espécie</span>
                <span className="halimentacao-desc-span2">{especie || '---'}</span>
              </div>

              <div className="halimentacao-desc2">
                <span className="halimentacao-info">Número de Exemplares</span>
                <span className="halimentacao-desc-span2">{exemplares || '---'}</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}