"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import Image from "next/image";
import ladoEsquerdo from '../assets/lado esquerdo.png';
import styles from "../styles/login.module.css";
import logo from "../assets/Logo.png";
import emailIcon from "../assets/email_svgrepo.com.png";
import passwordIcon from "../assets/password_svgrepo.com.png";

const Login: React.FC = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleLogin = async () => {
        setError(null);
        if (!email.trim() || !password.trim()) {
            setError("Por favor, preencha todos os campos.");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            router.push("/home");
        } catch (err) {
            setError("Email ou senha incorretos. Tente novamente.");
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.rightSide}>
            <Image
                    src={ladoEsquerdo}
                    alt="lado esquerdo"
                    className={styles.rightImg}
                    width={500}
                    height={500}
                />
            </div>

            <div className={styles.leftSide}>
                <Image src={logo} alt="Logo" className={styles.logo} width={60} height={60} />
                <h1 className={styles.title}>Login</h1>
                <p className={styles.description}>
                    Bem-vindo de volta! Continue cuidando do seu cultivo com<br />
                    tecnologia e eficiência
                </p>

                <div className={styles.input}>
                    <div className={styles.side}>
                        <Image src={emailIcon} alt="email-icon" className={styles.icon} width={30} height={30} />
                        <label className={styles.label}>Email</label>
                    </div>
                    <input
                        type="email"
                        placeholder="Digite seu email"
                        className={styles.inputLeft}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>

                <div className={styles.input}>
                    <div className={styles.side}>
                        <Image src={passwordIcon} alt="password-icon" className={styles.icon} width={30} height={30} />
                        <label className={styles.label}>Senha</label>
                    </div>
                    <input
                        type="password"
                        placeholder="Digite sua senha"
                        className={styles.inputLeft}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <a href="/esqueceuSenha" className={styles.forgotPassword}>Esqueceu a senha?</a>

                {error && <div className={styles.errorAlert}><p>{error}</p></div>}

                <div className={styles.org2}>
                    <button className={styles.bttSignIn} onClick={handleLogin}>Entrar</button>
                    <p>Não tem uma conta? <a className={styles.link} href="/cadastro">Cadastre-se</a></p>
                </div>
            </div>
        </div>
    );
};

export default Login;
