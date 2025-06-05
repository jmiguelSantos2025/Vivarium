"use client";

import React, { useState } from 'react';
import styles from '../styles/cadastro.module.css';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import logo from "../assets/Logo.png";
import ladoEsquerdo from '../assets/lado esquerdo.png';
import emailIcon from '../assets/email_svgrepo.com.png';
import passwordIcon from '../assets/password_svgrepo.com.png';


const Cadastro: React.FC = () => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null);
    const router = useRouter();


    const handleCadastro = async () => {
        setError(null);
        setMessage(null);

        if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
            setError("Por favor, preencha todos os campos.");
            return;
        }

        if (password !== confirmPassword) {
            setError("As senhas não coincidem.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            setMessage("Cadastro realizado com sucesso!");
            setTimeout(() => router.push("/login"), 2000);
        } catch (error: any) {
            if (error.code === "auth/email-already-in-use") {
                setError("Este email já está em uso.");
            } else if (error.code === "auth/weak-password") {
                setError("A senha deve ter pelo menos 6 caracteres.");
            } else {
                setError("Erro ao criar conta. Tente novamente mais tarde.");
            }
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.rightSide}>
                <Image
                    src={ladoEsquerdo}
                    alt="lado esquerdo"
                    className={styles.rightImg}
                    layout="intrinsic"
                    width={500}
                    height={500}
                />
            </div>

            <div className={styles.leftSide}>

            <Image
                    src={logo}
                    alt="logo"
                    className={styles.logo}
                    width={60}
                    height={60}
                />
                <h1 className={styles.title}>Cadastro</h1>
                <p className={styles.description}>
                    Preencha com seus dados e tenha acesso a uma plataforma pensada
                    <br />
                    para facilitar o cuidado com seu cultivo
                </p>

                <div className={styles.input}>
                    <div className={styles.side}>
                        <Image src={emailIcon} alt="user-icon" className={styles.icon} width={30} height={30} />
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
                        <Image src={passwordIcon} alt="email-icon" className={styles.icon} width={30} height={30} />
                        <label className={styles.label}>Senha</label>
                    </div>
                    <input
                        type={passwordVisible ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        className={styles.inputLeft}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div className={styles.input}>
                    <div className={styles.side}>
                        <Image src={passwordIcon} alt="password-icon" className={styles.icon} width={30} height={30} />
                        <label className={styles.label}>Confirmar Senha</label>
                    </div>
                    <div className={styles.side}>
                        <input
                            type={passwordVisible ? 'text' : 'password'}
                            placeholder="Confirme sua senha"
                            className={styles.inputLeft}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>

                {error && <div className={styles.errorAlert}><p>{error}</p></div>}
                {message && <div className={styles.successAlert}><p>{message}</p></div>}

                <div className={styles.org2}>
                    <button className={styles.bttSignIn} onClick={handleCadastro}>Cadastrar</button>
                    <p>Já tem uma conta? <a className={styles.link} href="/login">faça login</a></p>
                </div>
            </div>
        </div>
    );
};

export default Cadastro;
