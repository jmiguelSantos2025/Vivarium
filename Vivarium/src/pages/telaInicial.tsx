import styles from '../styles/telaInicial.module.css';
import Image from 'next/image';
import logo from '../assets/Logo.png'

export default function SplashScreen() {
  return (
    <div className={styles.container}>
      <Image src={logo} alt="Logo" className={styles.logo} />
    </div>
  );
}
