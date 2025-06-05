'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ref, update } from 'firebase/database';
import { database } from '../services/firebase';
import '../styles/cadastroEspecie.css';

export default function CadastroEspecie() {
  const router = useRouter();

  const [especie, setEspecie] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [temperaturaMax, setTemperaturaMax] = useState('');
  const [temperaturaMin, setTemperaturaMin] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setError(null);

    const qt = parseInt(quantidade);
    const tMax = parseFloat(temperaturaMax);
    const tMin = parseFloat(temperaturaMin);

    if (!especie || isNaN(qt) || isNaN(tMax) || isNaN(tMin)) {
      setError('Preencha todos os campos corretamente.');
      return;
    }

    if (qt < 0) {
      setError('A quantidade não pode ser negativa.');
      return;
    }

    if (tMin >= tMax) {
      setError('A temperatura mínima deve ser menor que a máxima.');
      return;
    }

    const especieData = {
      especie,
      quantidade: qt,
      temperaturaMax: tMax,
      temperaturaMin: tMin,
    };

    try {
      const especieRef = ref(database, 'Especie');
      await update(especieRef, especieData);
      alert('Espécie cadastrada com sucesso!');
      router.push('/cadastroEspecie2');
    } catch (err) {
      setError('Erro ao salvar os dados. Tente novamente.');
    }
  };

  return (
    <div className="especie-container">
      <aside>
        <div className="especie-topo-menu">
          <div className="especie-aside">
            <Image src="/assets/Logo.png" alt="logo" width={40} height={40} className="especie-logo" />
            <p><strong>Bem vindo <br />(a) de volta!</strong></p>
          </div>
        </div>

        <nav className="especie-options">
          <ul>
            <li className="especie-active" id="HOME" onClick={() => router.push('/home')}>
              <Image src="/assets/home_svgrepo.com.png" alt="Home" width={20} height={20} className="especie-icon" />
              Home
            </li>
            <li id="SENSOR" onClick={() => router.push("/sensorPhDiario")}>
              <Image src="/assets/sensor_svgrepo.com.png" alt="Sensores" width={20} height={20} className="especie-icon" />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <Image src="/assets/history_svgrepo.com.png" alt="Histórico" width={30} height={30} className="especie-icon2" />
              Histórico de dados
            </li>
            <li id="ALIMENT" onClick={() => router.push('/alimentacao')}>
              <Image src="/assets/fish_svgrepo.com.png" alt="Alimentação" width={20} height={20} className="especie-icon" />
              Alimentação
            </li>
            <li id="CADESPE1" onClick={() => router.push('/cadastroEspecie')}>
              <Image src="/assets/register_svgrepo.com.png" alt="Cadastro" width={20} height={20} className="especie-icon" />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header>
        <Image src="/assets/Vector@2x.png" alt="Menu" width={30} height={30} className="especie-menu" />
        <Image src="/assets/perfil.png" alt="Perfil" width={40} height={40} className="especie-perfil" />
      </header>

      <div className="especie-content">
        <main>
          <div className="especie-title">
            <h2>Cadastro de Espécies</h2>
            <span>Programação</span>
          </div>

          <div className="especie-card">
            <section className="especie-org-sup">
              <div className="especie-input">
                <label>Espécie</label>
                <input type="text" placeholder="Digite a espécie" value={especie} onChange={(e) => setEspecie(e.target.value)} className="especie-input-left" />
              </div>

              <div className="especie-input">
                <label>Quantidade de Exemplares</label>
                <input type="number" placeholder="Digite a quantidade" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} className="especie-input-left" />
              </div>

              <div className="especie-input">
                <label>Temperatura Máxima</label>
                <input type="number" placeholder="Digite a temperatura máxima" value={temperaturaMax} onChange={(e) => setTemperaturaMax(e.target.value)} className="especie-input-left" />
              </div>

              <div className="especie-input">
                <label>Temperatura Mínima</label>
                <input type="number" placeholder="Digite a temperatura mínima" value={temperaturaMin} onChange={(e) => setTemperaturaMin(e.target.value)} className="especie-input-left" />
              </div>

            </section>

            <div className="especie-footer">
               {error && <div style={{ color: 'red', marginTop: '10px' }}>{error}</div>}
              <button onClick={handleSave}>Próximo</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
