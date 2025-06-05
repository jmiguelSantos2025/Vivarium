"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../services/firebase";
import Image from "next/image";
import styles from "../styles/esqueceuSenha.module.css";
import background from "../assets/lado esquerdo (1).png";
import logo from "../assets/Logo.png";
import emailIcon from "../assets/email_svgrepo.com.png";

export default function EsqueceuSenha() {
  const [email, setEmail] = useState("");
  const [mensagem, setMensagem] = useState("");
  const [erro, setErro] = useState("");
  const router = useRouter();

  const handleRecuperar = async () => {
    setMensagem("");
    setErro("");

    if (!email.trim()) {
      setErro("Por favor, digite um email.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMensagem("Email de recuperação enviado com sucesso!");
      setTimeout(() => {
        router.push("/login");
      }, 3000);
    } catch (err) {
      setErro("Erro ao enviar email. Verifique o endereço e tente novamente.");
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSide}>
        <Image
          src={background}
          alt="Imagem decorativa"
          className={styles.rightImg}
          priority
        />
      </div>

      <div className={styles.leftSide}>
        <Image src={logo} alt="Logo" className={styles.logo} priority />
        <h1 className={styles.title}>Recuperação de Senha</h1>
        <p className={styles.description}>
          Por favor, informe o endereço de email vinculado à sua conta. Você
          receberá uma mensagem com instruções para a redefinição de senha.
        </p>

        <div className={styles.inputGroup}>
          <div className={styles.inputLabel}>
            <Image src={emailIcon} alt="Email Icon" className={styles.emailIcon} />
            <label htmlFor="email">Email</label>
          </div>
          <input
            id="email"
            type="email"
            placeholder="Digite seu email cadastrado"
            className={styles.inputField}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {mensagem && <p style={{ color: "green" }}>{mensagem}</p>}
        {erro && <p style={{ color: "red" }}>{erro}</p>}

        <div className={styles.actions}>
          <button className={styles.button} onClick={handleRecuperar}>
            Recuperar
          </button>
          <p className={styles.link}>
            Já tem uma conta?
            <a onClick={() => router.push("/login")}> Faça login</a>
          </p>
        </div>
      </div>
    </div>
  );
}
