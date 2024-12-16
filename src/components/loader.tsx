import  styles from '@/styles/Loader.module.scss'

export default function Loader(){
    return(
        <div className={styles.showbox}>
            <div className={styles.loader}>
                <svg className={styles.circular} viewBox="0 0 50 50">
                    <circle className={styles.head} cx="25" cy="25" r="22.2" fill="none" strokeWidth="5.6"
                            strokeMiterlimit="10"/>
                    <circle className={styles.chin} cx="25" cy="25" r="22.2" fill="none" strokeWidth="5.6"
                            strokeMiterlimit="10"/>
                    <circle className={styles.smile} cx="25" cy="25" r="13.4" fill="none" strokeWidth="3.5"
                            strokeMiterlimit="9"/>
                </svg>
            </div>
        </div>
    )
}