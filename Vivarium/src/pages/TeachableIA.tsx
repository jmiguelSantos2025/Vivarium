import React, { useEffect, useRef, useState } from "react";
import * as tmImage from "@teachablemachine/image";
import { ref, set } from "firebase/database";
import { database } from "../services/firebase";
import "../styles/TeachableIA.css";
import { useRouter } from "next/navigation";

const MODEL_URL = "/model/";

const coresPorClasse: Record<string, string> = {
  Irigar: "#4caf50",
  IrigarDireita: "#2196f3",
  IrigarEsquerdo: "#ff9800",
  Parar: "#ffeb3b",
  Fundo: "#ffffff",
};

const TeachableIA: React.FC = () => {
  const webcamRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [labels, setLabels] = useState<string[]>([]);
  const [resultados, setResultados] = useState<string[]>(["Carregando modelo..."]);
  const lastCommand = useRef<string>("");
  const lastCommandTime = useRef<number>(0);
  const router = useRouter();

  useEffect(() => {
    let model: any;
    let webcam: any;

    const init = async () => {
      model = await tmImage.load(MODEL_URL + "model.json", MODEL_URL + "metadata.json");
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

    const executarComando = async (comando: string) => {
      console.log("Comando detectado:", comando);
      const cor = coresPorClasse[comando] || "#ffffff";
      document.body.style.backgroundColor = cor;

      // Atualiza o Firebase conforme comando
      switch (comando) {
        case "Irigar":
          await set(ref(database, "bomba"), true);
          break;
        case "Parar":
          await set(ref(database, "bomba"), false);
          break;
        case "IrigarDireita":
          await set(ref(database, "direitaServo"), true);
          await set(ref(database, "esquerdaServo"), false);
          break;
        case "IrigarEsquerdo":
          await set(ref(database, "direitaServo"), false);
          await set(ref(database, "esquerdaServo"), true);
          break;
        default:
          // Pode resetar tudo se quiser, ou não fazer nada
          await set(ref(database, "bomba"), false);
          await set(ref(database, "direitaServo"), false);
          await set(ref(database, "esquerdaServo"), false);
      }
    };

    init();
  }, []);

  return (
    <div
      ref={containerRef}
      className="teachable-container"
      style={{
        backgroundImage: "url('/assets/Background.jpeg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        padding: 20,
        color: "#fff",
      }}
    >
      <h1 className="teachable-title">🌿 Controle de Irrigação com IA</h1>

      <div ref={webcamRef} className="teachable-webcam" />

      <div className="teachable-resultados">
        {resultados.map((texto, index) => {
          const classe = texto.split(":")[0];
          const cor = coresPorClasse[classe] || "white";

          return (
            <div
              key={index}
              style={{ color: cor, fontWeight: "bold", margin: 4 }}
            >
              {texto}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TeachableIA;
