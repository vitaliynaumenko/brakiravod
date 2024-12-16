import styles from "@/styles/Home.module.css";


export default function ThankYouPage() {

    return (
        <div
            className={`${styles.page}`}
        >
            <main className={styles.quiz}>
                <div className={styles.block__img}>

                </div>

                <div className={styles.block__info}>
                    <div className={styles.block__wrapp}>
                        <h1>Дякуємо що пройшли наше опитування!</h1>
                        <p>
                            З вами зв’яжеться наш спеціаліст і напротязі 24 годин ваш прорахунок буде готовий.
                        </p>

                    </div>

                </div>

            </main>
        </div>

    )

}

