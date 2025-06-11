const URL = "./model/";
let model, webcam, labelContainer, maxPredictions;

async function init() {
    const modelURL = URL + "model.json";
    const metadataURL = URL + "metadata.json";

    model = await tmImage.load(modelURL, metadataURL);
    maxPredictions = model.getTotalClasses();

    // Cria webcam
    const flip = true;
    webcam = new tmImage.Webcam(224, 224, flip);
    await webcam.setup();
    await webcam.play();
    window.requestAnimationFrame(loop);

    // Adiciona webcam ao HTML (você pode estilizar no CSS depois)
    const webcamContainer = document.createElement("div");
    webcamContainer.appendChild(webcam.canvas);
    document.body.appendChild(webcamContainer);

    labelContainer = document.createElement("div");
    labelContainer.id = "result";
    document.body.appendChild(labelContainer);
}

async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
}

async function predict() {
    const prediction = await model.predict(webcam.canvas);
    labelContainer.innerHTML = "";

    let comando = "";
    let confianca = 0;

    for (let i = 0; i < prediction.length; i++) {
        const nomeClasse = prediction[i].className;
        const probabilidade = prediction[i].probability;

        labelContainer.innerHTML += `${nomeClasse}: ${Math.round(probabilidade * 100)}%<br>`;

        if (probabilidade > confianca && probabilidade > 0.85) {
            comando = nomeClasse;
            confianca = probabilidade;
        }
    }

    if (comando !== "") {
        executarComando(comando);
    }
}

let ultimoComando = "";
let tempoUltimoComando = 0;

function executarComando(comando) {
    const agora = Date.now();

    // Evita repetir o mesmo comando rapidamente
    if (comando === ultimoComando && agora - tempoUltimoComando < 3000) return;

    ultimoComando = comando;
    tempoUltimoComando = agora;

    console.log("Comando detectado:", comando);

    // 🔧 Aqui você define as ações conforme o comando
    switch (comando) {
        case "Irrigar":
            ligarIrrigacao();
            break;
        case "Desligar":
            desligarIrrigacao();
            break;
        case "Pausar":
            pausarSistema();
            break;
        default:
            console.log("Comando não reconhecido.");
    }
}

// ⏬ Funções de controle do sistema (você adapta aqui)
function ligarIrrigacao() {
    console.log("🚿 Irrigação LIGADA");
    // Aqui você pode fazer um fetch para backend, ativar GPIO, etc.
}

function desligarIrrigacao() {
    console.log("🛑 Irrigação DESLIGADA");
    // Exemplo: fetch('/api/desligar');
}

function pausarSistema() {
    console.log("⏸️ Sistema PAUSADO");
}
