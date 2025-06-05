"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import "../styles/alimentacao.css"; // Caminho para o arquivo de CSS externo
import { ref, set } from "firebase/database";
import { database } from "../services/firebase";
import { setFrequencia } from "../services/frequencia"; // Função para salvar a frequência

export default function Alimentacao() {
  const router = useRouter();
  const [frequencia, setFrequenciaLocal] = useState<number | "">('');
  const [quantidadeRacao, setQuantidadeRacao] = useState<number | "">('');
  const [horario, setHorario] = useState<string | "">('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = () => {
    // Verifica se os campos estão válidos
    if (frequencia === '' || quantidadeRacao === '' || frequencia === 0 || quantidadeRacao === 0 || horario === '') {
      setErrorMessage("Por favor, preencha todos os campos com valores válidos (maiores que 0).");
      return;
    }
    if (frequencia > 6) {
      setErrorMessage("A frequência não pode ser maior que 6.");
      return;
    }
    if (frequencia < 0) {
      setErrorMessage("A frequência precisa ser um número positivo maior que 0.");
      return;
    }
    if (quantidadeRacao < 0) {
      setErrorMessage("A quantidade de ração precisa ser um número positivo maior que 0.");
      return;
    }

    setErrorMessage('');

    // Salva a frequência e a quantidade no Firebase
    set(ref(database, 'Alimentacao/'), {
      Frequencia: frequencia,
      Quantidade: quantidadeRacao,
    })
    .then(() => {
      console.log("Dados salvos com sucesso");

      // Salva a frequência utilizando a função setFrequencia
      setFrequencia(frequencia);

      // Se a frequência for 1, salva o horário no caminho específico (Alimentacao/Horario/1)

        set(ref(database, `Alimentacao/Horario/`), {
          [`1`]: horario,
        })
        .then(() => {
          console.log("Horário 1 salvo com sucesso");
          router.push("/alimentacao2");
        })
        .catch((error) => {
          console.error("Erro ao salvar o horário 1: ", error);
          setErrorMessage("Ocorreu um erro ao salvar o horário.");
        });
       if(frequencia > 1) {
        // Se a frequência for maior que 1, vai para a tela de cadastro de horários
        router.push(`/teste?frequencia=${frequencia}`);
      }
    })
    .catch((error) => {
      console.error("Erro ao salvar os dados: ", error);
      setErrorMessage("Ocorreu um erro ao salvar os dados.");
    });
  };

  return (
    <div className="alimentacao-container">
      <aside>
        <div className="alimentacao-topo-menu">
          <div className="alimentacao-aside">
            <Image src="/assets/Logo.png" alt="logo" width={40} height={40} className="alimentacao-logo" />
            <p><strong>Bem vindo <br />(a) de volta!</strong></p>
          </div>
        </div>

        <nav className="alimentacao-options">
          <ul>
            <li className="alimentacao-active" id="HOME" onClick={() => router.push("/home")}>
              <Image src="/assets/home_svgrepo.com.png" alt="Home" width={20} height={20} className="alimentacao-icon" />
              Home
            </li>
            <li id="SENSOR" onClick={() => router.push("/sensorPhDiario")}>
              <Image src="/assets/sensor_svgrepo.com.png" alt="Sensores" width={20} height={20} className="alimentacao-icon" />
              Sensores
            </li>
            <li id="HIST" onClick={() => router.push("/historicoSensores")}>
              <Image src="/assets/history_svgrepo.com.png" alt="Histórico" width={30} height={30} className="alimentacao-icon2" />
              Histórico de dados
            </li>
            <li id="ALIMENT1" onClick={() => router.push("/alimentacao")}>
              <Image src="/assets/fish_svgrepo.com.png" alt="Alimentação" width={20} height={20} className="alimentacao-icon" />
              Alimentação
            </li>
            <li id="CADESPE" onClick={() => router.push("/cadastroEspecie")}>
              <Image src="/assets/register_svgrepo.com.png" alt="Cadastro" width={20} height={20} className="alimentacao-icon" />
              Cadastro de espécie
            </li>
          </ul>
        </nav>
      </aside>

      <header className="alimentacao-header">
        <Image src="/assets/Vector@2x.png" alt="Menu" width={30} height={30} className="alimentacao-menu" />
        <Image src="/assets/perfil.png" alt="Perfil" width={40} height={40} className="alimentacao-perfil" />
      </header>

      <div className="alimentacao-content">
        <main>
          <div className="alimentacao-title">
            <h2>Alimentação</h2>
            <span>Programação</span>
          </div>

          <div className="alimentacao-card">
            <section className="alimentacao-org-sup">
              <div className="alimentacao-input">
                <label>Frequência</label>
                <input
                  type="number"
                  value={frequencia !== '' ? frequencia : ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value < 0) {
                      setFrequenciaLocal(0);
                    } else {
                      setFrequenciaLocal(value);
                    }
                  }}
                  placeholder="Digite a frequência (máximo 6)"
                  className="alimentacao-input-left"
                />
              </div>
              <div className="alimentacao-input">
                <label>Quantidade de Ração</label>
                <input
                  type="number"
                  value={quantidadeRacao !== '' ? quantidadeRacao : ''}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value < 0) {
                      setQuantidadeRacao(0);
                    } else {
                      setQuantidadeRacao(value);
                    }
                  }}
                  placeholder="Digite a quantidade de ração"
                  className="alimentacao-input-left"
                />
              </div>
              <div className="alimentacao-input">
                <label>Defina Horário</label>
                <input
                  type="time"
                  value={horario !== '' ? horario : ''}
                  onChange={(e) => setHorario(e.target.value)}
                  className="alimentacao-input-left"
                />
              </div>
            </section>

            <div className="alimentacao-footer">
              {errorMessage && <div style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</div>}
              <button onClick={handleSubmit}>Confirmar</button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
