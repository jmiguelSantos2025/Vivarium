"use client";
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue, set, get, update } from 'firebase/database';

interface SensorData {
  PH: number;
  Temperatura: number;
  Turbidez: number;
}

interface GraphData {
  PH: number;
  Temperatura: number;
  Turbidez: number;
  timestamp: number;
  date: string;
}

const SensorDataSender: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  const fetchAndSendData = () => {
    const sensoresRef = ref(db, 'Sensores');

    onValue(sensoresRef, async (snapshot) => {
      const data = snapshot.val();

      if (data) {
        const { PH, Temperatura, Turbidez } = data;
        const timestamp = Date.now();
        const now = new Date(timestamp);
        const dateStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Manaus' });
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const hourMinute = `${hour}-${minute}`;
        const graphData: GraphData = {
          PH,
          Temperatura,
          Turbidez,
          timestamp,
          date: now.toLocaleString(),
        };

        try {
          const leituraRef = ref(db, `Graficos/DataHora/${dateStr}/${hourMinute}`);
          await set(leituraRef, graphData);
          console.log("Leitura salva em:", `Graficos/DataHora/${dateStr}/${hourMinute}`);
        } catch (error) {
          console.error("Erro ao salvar leitura:", error);
        }

        const mediaHoraRef = ref(db, `Graficos/Medias/${dateStr}/${hour}`);
        await atualizarMedia(mediaHoraRef, PH, Temperatura, Turbidez);

        const mediaDiariaRef = ref(db, `Graficos/Medias/${dateStr}/mediaDiaria`);
        await atualizarMedia(mediaDiariaRef, PH, Temperatura, Turbidez);

        setSensorData({ PH, Temperatura, Turbidez });
      }
    }, { onlyOnce: true });
  };

  const atualizarMedia = async (
    mediaRef: ReturnType<typeof ref>,
    ph: number,
    temp: number,
    turbidez: number
  ) => {
    const snapshot = await get(mediaRef);

    if (snapshot.exists()) {
      const oldData = snapshot.val();
      const count = oldData.count || 0;

      const novaMedia = {
        mediaPH: (oldData.mediaPH * count + ph) / (count + 1),
        mediaTemperatura: (oldData.mediaTemperatura * count + temp) / (count + 1),
        mediaTurbidez: (oldData.mediaTurbidez * count + turbidez) / (count + 1),
        count: count + 1,
      };

      await update(mediaRef, novaMedia);
    } else {
      await set(mediaRef, {
        mediaPH: ph,
        mediaTemperatura: temp,
        mediaTurbidez: turbidez,
        count: 1,
      });
    }
  };

  const checkFeedingTime = async () => {
    const horariosRef = ref(db, 'Alimentacao/Horario');
    const snapshot = await get(horariosRef);

    if (snapshot.exists()) {
      const horariosObj = snapshot.val(); // Ex: { "1": "07:30", "2": "12:00" }
      const horarios: string[] = Object.values(horariosObj); // ["07:30", "12:00"]

      const now = new Date();
      const horaManaus = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'America/Manaus',
      }); // Ex: "07:30"

      if (horarios.includes(horaManaus)) {
        const servoRef = ref(db, 'Servo');
        await set(servoRef, true);
        console.log(`Servo ativado às ${horaManaus}`);

        setTimeout(async () => {
          await set(servoRef, false);
          console.log(`Servo desativado após 1 minuto`);
        }, 60000); // 1 minuto
      }
    }
  };

  useEffect(() => {
    fetchAndSendData();
    const interval = setInterval(fetchAndSendData, 60000); // A cada 1 minuto

    const horarioInterval = setInterval(checkFeedingTime, 60000); // Verifica horário a cada 1 minuto
    checkFeedingTime(); // Também executa ao iniciar

    return () => {
      clearInterval(interval);
      clearInterval(horarioInterval);
    };
  }, []);

  return (
    <div>
      <h2>Enviando Dados para o Firebase...</h2>
      {sensorData ? (
        <div>
          <p><strong>pH:</strong> {sensorData.PH}</p>
          <p><strong>Temperatura:</strong> {sensorData.Temperatura}</p>
          <p><strong>Turbidez:</strong> {sensorData.Turbidez}</p>
        </div>
      ) : (
        <p>Carregando dados dos sensores...</p>
      )}
    </div>
  );
};

export default SensorDataSender;
