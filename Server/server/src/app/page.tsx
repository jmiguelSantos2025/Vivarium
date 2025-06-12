"use client";
import React, { useEffect, useState } from 'react';
import { db } from './firebase';
import { ref, onValue, set, get, update } from 'firebase/database';

interface SensorData {
  Temperatura: number;
}

interface GraphData {
  Temperatura: number;
  date: string;
}

const SensorDataSender: React.FC = () => {
  const [sensorData, setSensorData] = useState<SensorData | null>(null);

  const fetchAndSendData = () => {
    const temperaturaRef = ref(db, 'temp'); // ✅ Corrigido de 'Tempo' para 'Temp'

    onValue(temperaturaRef, async (snapshot) => {
      const data = snapshot.val();

      if (data && typeof data === 'number') {
        const Temperatura = data;
        const now = new Date();
        const dateStr = now.toLocaleDateString('sv-SE', { timeZone: 'America/Manaus' });
        const hour = now.getHours().toString().padStart(2, '0');
        const minute = now.getMinutes().toString().padStart(2, '0');
        const hourMinute = `${hour}-${minute}`;

        const graphData: GraphData = {
          Temperatura,
          date: now.toLocaleString('pt-BR', { timeZone: 'America/Manaus' }),
        };

        try {
          const leituraRef = ref(db, `Graficos/DataHora/${dateStr}/${hourMinute}`);
          await set(leituraRef, graphData);
          console.log("Temperatura salva em:", `Graficos/DataHora/${dateStr}/${hourMinute}`);
        } catch (error) {
          console.error("Erro ao salvar leitura:", error);
        }

        // Médias
        const mediaHoraRef = ref(db, `Graficos/Medias/${dateStr}/${hour}`);
        await atualizarMedia(mediaHoraRef, Temperatura);

        const mediaDiariaRef = ref(db, `Graficos/Medias/${dateStr}/mediaDiaria`);
        await atualizarMedia(mediaDiariaRef, Temperatura);

        setSensorData({ Temperatura });
      }
    }, { onlyOnce: true });
  };

  const atualizarMedia = async (
    mediaRef: ReturnType<typeof ref>,
    temp: number
  ) => {
    const snapshot = await get(mediaRef);

    if (snapshot.exists()) {
      const oldData = snapshot.val();
      const count = oldData.count || 0;

      const novaMedia = {
        mediaTemperatura: (oldData.mediaTemperatura * count + temp) / (count + 1),
        count: count + 1,
      };

      await update(mediaRef, novaMedia);
    } else {
      await set(mediaRef, {
        mediaTemperatura: temp,
        count: 1,
      });
    }
  };

  useEffect(() => {
    fetchAndSendData();
    const interval = setInterval(fetchAndSendData, 60000); // A cada 1 minuto
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      <h2>Enviando Temperatura para o Firebase...</h2>
      {sensorData ? (
        <p><strong>Temperatura:</strong> {sensorData.Temperatura}°C</p>
      ) : (
        <p>Carregando dados...</p>
      )}
    </div>
  );
};

export default SensorDataSender;
