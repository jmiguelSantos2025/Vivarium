import React, { useEffect, useRef, useState } from "react";

// @ts-ignore
import * as tmImage from "@teachablemachine/image";

const MODEL_URL = "/model/"; // certifique-se de que model.json e metadata.json estão aqui

 const TeachableIA: React.FC = () => {
  const webcamRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [resultados, setResultados] = useState<string[]>(["Carregando modelo..."]);

  const lastCommand = useRef<string>("");
  const lastCommandTime = useRef<number>(0);

  useEffect(() => {
    let model: any;
    let webcam: any;
    let maxPredictions: number;

    const init = async () => {
      model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
      maxPredictions = model.getTotalClasses();

      webcam = new tmImage.Webcam(224, 224, true);
      await webcam.setup();
      await webcam.play();
      requestAnimationFrame(loop);

      if (webcamRef.current) {
        webcamRef.current.innerHTML = "";
        webcamRef.current.appendChild(webcam.canvas);
      }

      const metadata = await fetch(MODEL_URL + "metadata.json").then(res => res.json());
      setLabels(metadata.labels);
    };

    const loop = async () => {
      webcam.update();
      await predict();
      requestAnimationFrame(loop);
    };

    const predict = async () => {
      const prediction = await model.predict(webcam.canvas);
      const textos: string[] = [];

      let comandoDetectado = "";
      let maiorConfiança = 0;

      for (let i = 0; i < prediction.length; i++) {
        const { className, probability } = prediction[i];
        const probPercent = Math.round(probability * 100);
        textos.push(`${className}: ${probPercent}%`);

        if (probability > maiorConfiança && probability > 0.85) {
          comandoDetectado = className;
          maiorConfiança = probability;
        }
      }

      setResultados(textos);

      if (comandoDetectado) {
        const agora = Date.now();
        if (
          comandoDetectado !== lastCommand.current ||
          agora - lastCommandTime.current > 3000
        ) {
          lastCommand.current = comandoDetectado;
          lastCommandTime.current = agora;
          executarComando(comandoDetectado);
        }
      }
    };

    const executarComando = (comando: string) => {
      console.log("Comando detectado:", comando);

      switch (comando) {
        case "Ligar":
          document.body.style.backgroundColor = "#c8f7c5";
          break;
        case "Desligar":
          document.body.style.backgroundColor = "#f7c5c5";
          break;
        case "Pausar":
          document.body.style.backgroundColor = "#f7f3c5";
          break;
        default:
          document.body.style.backgroundColor = "#ffffff";
      }
    };

    init();
  }, []);

  return (
    <div ref={containerRef} style={{ textAlign: "center", padding: 20 }}>
      <h1>🌿 Controle de Irrigação com IA</h1>

      <div ref={webcamRef} style={{ margin: "20px auto", width: 224, height: 224 }} />

      <div style={{ fontSize: "1.2em", marginTop: 20 }}>
        {resultados.map((texto, index) => (
          <div key={index}>{texto}</div>
        ))}
      </div>
    </div>
  );
};
export default TeachableIA;