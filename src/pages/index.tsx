import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";


export default function Home() {
    return (
        <>
            <Head>
                <title>Розлучення онлайн</title>
                <meta name="description" content="Generated by create next app"/>
                <meta name="viewport"
                      content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
                <main className={styles.quiz}>
                    <div className={styles.block__img}></div>
                    <div className={styles.block__info}>
                        <div className={styles.block__wrapp}>
                            <h1>Швидке розлучення без стресу</h1>
                            <p>
                                Процес розлучення може бути не простим, але ми допоможемо вирішити всі юридичні питання:
                            </p>
                            <ul>
                                <li>Підготовка документів і подання заяви до суду</li>
                                <li>Супровід на всіх етапах процесу</li>
                                <li>Врегулювання спорів щодо дітей і майна</li>
                            </ul>
                            <p>Дайте відповідь на 5 запитань та Дізнайтесь вартість розірвання шлюбу</p>
                            <p className={styles.text__bold}>Дізнайтесь вартість розірвання шлюбу</p>
                        </div>
                        <div style={{textAlign: 'right'}}>
                            <Link href='/quizl' className={styles.link}>Розпочати</Link>
                            <span className={styles.text__terms}>Terms of use and Privacy policy</span>
                        </div>
                    </div>

                </main>
        </>
    );
}
