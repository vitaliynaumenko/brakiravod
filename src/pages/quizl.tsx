import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import PhoneInput from "react-phone-input-2";
import {questions} from "@/data/data";
import Link from "next/link";

import "react-phone-input-2/lib/style.css";
import styles from "@/styles/Quizl.module.css"
import Loader from "@/components/loader";
import {useRouter} from "next/router";

type FormStateType = {
    [key: string]: string;

}

export default function Quizl() {
    const [formState, setFormState] = useState<FormStateType>({});
    const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
    const [country, setCountry] = useState<string>('');
    const [progressBar, setProgressBar] = useState<number | null>(null);
    const [isChecked, setIsCheked] = useState<boolean>(false);
    const [disable, setDisable] = useState(true);
    const [loading, setLoading] = useState<boolean>(false);

    const router = useRouter()


    const handelSetForm = (e: ChangeEvent<HTMLInputElement>, inputName?: string) => {
        const {name, value} = e.target
        setFormState(() => ({
            ...formState,
            [inputName ?? name]: value

        }))


    }


    const handleNextQuestion = () => {
        const currentQuestion = answeredQuestions + 1
        const stepWidth = (currentQuestion / (questions.length - 1)) * 100

        if (answeredQuestions < questions.length - 1) {
            setAnsweredQuestions(answeredQuestions + 1)
            setProgressBar(stepWidth)
        }
    }
    const handlePrevQuestion = () => {
        if (answeredQuestions !== 0) {
            setAnsweredQuestions(answeredQuestions - 1)
        }
    }
    const switchGender =
        (gender: 'З чоловіком' | 'З Жінкою' | string) => {
            switch (gender) {
                case 'З чоловіком':
                    return 'ваш чоловік';
                case 'З жінкою':
                    return 'ваша жінка'
                default:
                    return ''
            }
        }

    useEffect(() => {
        const fetchGeoData = async () => {
            try {
                const response = await fetch('https://ipapi.co/json/')
                const data = await response.json()
                setCountry(data.country)
            } catch (e) {
                throw new Error(`Error fetching geo data:${e}`)
            }
        }
        fetchGeoData()

    }, [])

    useEffect(() => {
        const currentOptions = questions[answeredQuestions].options.map(option => option.name)

        const isOptionsSelected = currentOptions.some(name => formState[name])

        setDisable(!isOptionsSelected)
    }, [formState, answeredQuestions])

    const onCheckedPrived = (e: ChangeEvent<HTMLInputElement>) => {
        setIsCheked(e.target.checked)
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            setLoading(true)
            const response = await fetch('/api/sentMessageToBot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formState),
            })

            if (!response.ok) {
                throw new Error(`Error submitting form: ${response.statusText}`)
            }
            if (response.ok){
               await router.push('/thankYouPage')
            }

        } catch (e) {
            console.error(`Error submitting form: ${e}`)
        } finally {
            setFormState({})
            setLoading(false)
            setIsCheked(false)

        }


    }

    return (
        <>
            <form action="/" className={styles.quizl__form} onSubmit={handleSubmit}>
                <div className={styles.processBar} style={{width: `${progressBar}%`}}></div>
                <div className={styles.question__container}>
                    <div className={styles.containerWrapp}>
                        <h2 className={styles.quizl__title}>{`${questions[answeredQuestions].question} ${answeredQuestions === 1 ? switchGender(formState.divorce) : ''}`}</h2>
                        <div
                            className={styles.quizl__desc}>{
                            (answeredQuestions === 0)
                                ? '(вкажіть один з варіантів відповіді)'
                                : (questions[answeredQuestions]?.desc || '(оберіть варіант відповіді)')
                        }
                        </div>
                        <div className={styles.row}>
                            {
                                questions[answeredQuestions].options.map((option, index: number) => (
                                    <>
                                        {
                                            option.name === 'tel' ? <div className={styles.inputTextWrapp}>
                                                <PhoneInput
                                                    country={country.toLowerCase()}
                                                    onChange={(value, data, event) => handelSetForm(event, 'tel')}/>
                                            </div> : (
                                                option.name === 'city' || option.name === 'name' ?
                                                    <div className={styles.inputTextWrapp}>
                                                        <input
                                                            type={'text'}
                                                            name={option.name}
                                                            value={formState[option.name] || ''}
                                                            // checked={formState[option.name] === option.value}
                                                            placeholder={'placeholder' in option ? option.placeholder : option.label}
                                                            onChange={handelSetForm}
                                                        />
                                                    </div>
                                                    :
                                                    <label key={index}
                                                           className={`${styles.label} ${formState[option.name] === option.value ? styles.labelChecked : undefined}`}>
                                                        <input
                                                            type={option.name === 'city' || option.name === 'name' ? 'text' : 'radio'}
                                                            name={option.name}
                                                            value={option.value}
                                                            checked={formState[option.name] === option.value}
                                                            onChange={handelSetForm}
                                                        />

                                                        <span className={styles.custom__radio}></span>
                                                        <span> {option.label}</span>
                                                    </label>
                                            )}
                                    </>
                                ))}
                        </div>
                        {
                            answeredQuestions === questions.length - 1 && (
                                <>
                                    <label className={styles.labelPolicy}>
                                        <input type="checkbox" onChange={onCheckedPrived}/>
                                        <span className={styles.prived__policy}> Я погоджуюсь з <Link href={'/policy'}
                                                                                                      target='_blank'
                                                                                                      className={styles.policy__link}>політикою конфіденційності та правилами
                        використання *</Link></span>
                                    </label>
                                    <button type='submit' disabled={!isChecked} className={styles.btnSubmit}>Замовити
                                    </button>
                                    <div className={styles.socialMedia}>
                                        <div className={styles.socialMediaTitle}>
                                            <span>або</span>
                                        </div>
                                        <p>Натисніть на улюблений месенджер і ми зв’яжемось з вами</p>
                                        <div className={styles.socialMediaLink}>
                                            <Link href={''}>
                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <rect width="50" height="50" rx="11.1743" fill="#7360F2"/>
                                                    <g clip-path="url(#clip0_18_213)">
                                                        <path
                                                            d="M38.285 10.7368C37.4044 9.9242 33.8457 7.34081 25.919 7.30571C25.919 7.30571 16.5714 6.74202 12.0146 10.9218C9.47796 13.4589 8.58563 17.1713 8.49151 21.7739C8.39738 26.3764 8.2756 35.0019 16.59 37.3407H16.598L16.5926 40.9094C16.5926 40.9094 16.5395 42.3543 17.4908 42.6489C18.6416 43.0063 19.317 41.9081 20.4156 40.7244C21.0187 40.0745 21.8514 39.12 22.4789 38.3904C28.1653 38.869 32.5386 37.7751 33.0353 37.6135C34.1834 37.2412 40.6802 36.409 41.7368 27.784C42.8275 18.8943 41.2093 13.2712 38.285 10.7368ZM39.2486 27.1464C38.3568 34.3478 33.0874 34.8003 32.1159 35.112C31.7027 35.2449 27.8616 36.2005 23.0314 35.8852C23.0314 35.8852 19.4324 40.2272 18.3082 41.3561C18.1327 41.5327 17.9264 41.6039 17.7886 41.5688C17.5951 41.5215 17.5419 41.2923 17.544 40.9573C17.5472 40.4787 17.5748 35.0269 17.5748 35.0269C10.5415 33.0742 10.9515 25.733 11.0313 21.8887C11.1111 18.0445 11.8332 14.8953 13.9784 12.7772C17.8328 9.28606 25.7728 9.80774 25.7728 9.80774C32.478 9.83698 35.691 11.8562 36.436 12.5326C38.9099 14.6507 40.1702 19.7191 39.2486 27.1443V27.1464Z"
                                                            fill="white"/>
                                                        <path
                                                            d="M29.1819 21.5723C29.0947 19.8142 28.2017 18.8909 26.5028 18.8022"
                                                            stroke="white" stroke-width="0.896582" stroke-linecap="round"
                                                            stroke-linejoin="round"/>
                                                        <path
                                                            d="M31.4821 22.3439C31.5175 20.706 31.0324 19.3375 30.0266 18.2385C29.0162 17.1356 27.6176 16.5283 25.8229 16.397"
                                                            stroke="white" stroke-width="0.896582" stroke-linecap="round"
                                                            stroke-linejoin="round"/>
                                                        <path
                                                            d="M33.8366 23.2652C33.815 20.423 32.9657 18.1846 31.2889 16.5499C29.612 14.9152 27.5265 14.0891 25.0325 14.0718"
                                                            stroke="white" stroke-width="0.896582" stroke-linecap="round"
                                                            stroke-linejoin="round"/>
                                                        <path
                                                            d="M26.5918 27.5776C26.5918 27.5776 27.2219 27.6308 27.5612 27.2128L28.2227 26.3806C28.5418 25.9679 29.3118 25.7047 30.0659 26.1248C30.631 26.4471 31.1796 26.7974 31.7096 27.1746C32.21 27.5426 33.2348 28.3977 33.238 28.3977C33.7261 28.8098 33.8389 29.4149 33.5065 30.0531C33.5065 30.0568 33.5039 30.0632 33.5039 30.0664C33.1378 30.701 32.6731 31.2732 32.1271 31.7617C32.1207 31.7649 32.1207 31.7681 32.1148 31.7713C31.6405 32.1676 31.1745 32.3929 30.7168 32.4472C30.6494 32.459 30.5809 32.4632 30.5126 32.4599C30.3108 32.4619 30.11 32.431 29.9181 32.3685L29.9032 32.3467C29.198 32.1478 28.0207 31.65 26.06 30.5684C24.9254 29.9498 23.8452 29.2363 22.831 28.4354C22.3227 28.0342 21.8378 27.6042 21.3787 27.1474L21.3298 27.0985L21.2809 27.0496L21.232 27.0001C21.2155 26.9842 21.1995 26.9677 21.183 26.9512C20.7263 26.4921 20.2963 26.0073 19.8951 25.4989C19.0943 24.4848 18.3808 23.4048 17.7621 22.2705C16.6804 20.3093 16.1827 19.133 15.9838 18.4268L15.962 18.4119C15.8997 18.2199 15.869 18.0191 15.8711 17.8173C15.8674 17.749 15.8715 17.6805 15.8833 17.6131C15.9404 17.1565 16.166 16.6903 16.5603 16.2146C16.5635 16.2087 16.5666 16.2087 16.5698 16.2023C17.0582 15.6564 17.6305 15.1918 18.2652 14.8261C18.2683 14.8261 18.2747 14.8229 18.2784 14.8229C18.9166 14.4905 19.5218 14.6033 19.9334 15.0888C19.9365 15.092 20.79 16.1167 21.1564 16.6171C21.5336 17.1477 21.884 17.6968 22.2062 18.2624C22.6263 19.016 22.3631 19.7876 21.9504 20.1056L21.1182 20.7671C20.6981 21.1064 20.7534 21.7366 20.7534 21.7366C20.7534 21.7366 21.986 26.4019 26.5918 27.5776Z"
                                                            fill="white"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_18_213">
                                                            <rect width="33.608" height="35.4394" fill="white"
                                                                  transform="translate(8.4707 7.28027)"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>

                                            </Link>
                                            <Link href={''}>
                                                <svg width="44" height="44" viewBox="0 0 44 44" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <path
                                                        d="M22 43.774C34.0256 43.774 43.7742 34.0253 43.7742 21.9998C43.7742 9.97422 34.0256 0.225586 22 0.225586C9.97447 0.225586 0.22583 9.97422 0.22583 21.9998C0.22583 34.0253 9.97447 43.774 22 43.774Z"
                                                        fill="url(#paint0_linear_18_222)"/>
                                                    <path
                                                        d="M7.8616 22.9271C10.4192 21.5295 13.2741 20.3629 15.9416 19.1905C20.5308 17.27 25.1382 15.3829 29.7921 13.626C30.6975 13.3266 32.3245 13.0339 32.484 14.3652C32.3966 16.2496 32.0373 18.123 31.7908 19.9964C31.1652 24.1162 30.4421 28.2218 29.737 32.328C29.494 33.6958 27.767 34.4038 26.662 33.5285C24.0063 31.7489 21.3302 29.9865 18.7085 28.1655C17.8497 27.2998 18.6461 26.0565 19.4131 25.4382C21.6003 23.2996 23.92 21.4827 25.993 19.2336C26.5521 17.894 24.8999 19.023 24.355 19.3689C21.3606 21.4161 18.4394 23.5883 15.2824 25.3876C13.6698 26.2683 11.7902 25.5157 10.1784 25.0242C8.73314 24.4306 6.6153 23.8324 7.86145 22.9273L7.8616 22.9271Z"
                                                        fill="white"/>
                                                    <defs>
                                                        <linearGradient id="paint0_linear_18_222" x1="15.897" y1="-19.9341"
                                                                        x2="-13.864"
                                                                        y2="28.1838" gradientUnits="userSpaceOnUse">
                                                            <stop stop-color="#34B0DF"/>
                                                            <stop offset="1" stop-color="#1E88D3"/>
                                                        </linearGradient>
                                                    </defs>
                                                </svg>

                                            </Link>
                                            <Link href={''}>
                                                <svg width="50" height="50" viewBox="0 0 50 50" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <mask id="mask0_18_225" style={{maskType: "luminance"}}
                                                          maskUnits="userSpaceOnUse" x="0"
                                                          y="0" width="50" height="50">
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                              d="M11.3667 0.0246582C10.2516 0.0642929 8.81448 0.151531 8.16127 0.283371C7.16417 0.484726 6.22255 0.790012 5.43948 1.18913C4.51943 1.65801 3.69484 2.25625 2.98282 2.96715C2.26917 3.67943 1.66854 4.50479 1.19777 5.42621C0.799767 6.20509 0.494654 7.14098 0.292443 8.13242C0.15795 8.79222 0.0690015 10.2401 0.0286793 11.3623C0.0123278 11.821 0.00393805 12.4146 0.00393805 12.6884L0 37.3077C0 37.5804 0.00830416 38.1742 0.02457 38.6334C0.0642074 39.7484 0.151444 41.1855 0.283369 41.8387C0.484637 42.8357 0.790008 43.7774 1.18904 44.5605C1.65801 45.4807 2.25616 46.3051 2.96707 47.0172C3.67934 47.7307 4.50479 48.3314 5.42612 48.8022C6.20509 49.2001 7.14097 49.5053 8.13234 49.7076C8.79213 49.842 10.2401 49.931 11.3623 49.9712C11.8208 49.9877 12.4145 49.9961 12.6883 49.9961L37.3077 50C37.5804 50 38.1742 49.9918 38.6332 49.9754C39.7483 49.9357 41.1855 49.8486 41.8386 49.7166C42.8357 49.5153 43.7775 49.2099 44.5604 48.811C45.4805 48.342 46.3051 47.7438 47.0171 47.0329C47.7307 46.3206 48.3313 45.4953 48.8021 44.5739C49.2001 43.7949 49.5053 42.8591 49.7075 41.8677C49.842 41.2079 49.9309 39.7599 49.9712 38.6377C49.9877 38.1791 49.996 37.5855 49.996 37.3117L50 12.6923C50 12.4196 49.9917 11.8258 49.9753 11.3667C49.9356 10.2517 49.8485 8.81456 49.7165 8.16136C49.5153 7.16426 49.2099 6.22264 48.8109 5.43957C48.342 4.51943 47.7437 3.69492 47.0329 2.98282C46.3206 2.26935 45.4951 1.66862 44.5738 1.19786C43.7948 0.799858 42.859 0.494656 41.8676 0.292534C41.2078 0.158039 39.7599 0.0690918 38.6377 0.0288544C38.179 0.0123329 37.5854 0.00402832 37.3116 0.00402832L12.6923 8.7738e-05C12.4195 8.7738e-05 11.8257 0.0083046 11.3667 0.0246582Z"
                                                              fill="white"/>
                                                    </mask>
                                                    <g mask="url(#mask0_18_225)">
                                                        <path
                                                            d="M11.3667 0.0246582C10.2516 0.0642929 8.81448 0.151531 8.16127 0.283371C7.16417 0.484726 6.22255 0.790012 5.43948 1.18913C4.51943 1.65801 3.69484 2.25625 2.98282 2.96715C2.26917 3.67943 1.66854 4.50479 1.19777 5.42621C0.799767 6.20509 0.494654 7.14098 0.292443 8.13242C0.15795 8.79222 0.0690015 10.2401 0.0286793 11.3623C0.0123278 11.821 0.00393805 12.4146 0.00393805 12.6884L0 37.3077C0 37.5804 0.00830416 38.1742 0.02457 38.6334C0.0642074 39.7484 0.151444 41.1855 0.283369 41.8387C0.484637 42.8357 0.790008 43.7774 1.18904 44.5605C1.65801 45.4807 2.25616 46.3051 2.96707 47.0172C3.67934 47.7307 4.50479 48.3314 5.42612 48.8022C6.20509 49.2001 7.14097 49.5053 8.13234 49.7076C8.79213 49.842 10.2401 49.931 11.3623 49.9712C11.8208 49.9877 12.4145 49.9961 12.6883 49.9961L37.3077 50C37.5804 50 38.1742 49.9918 38.6332 49.9754C39.7483 49.9357 41.1855 49.8486 41.8386 49.7166C42.8357 49.5153 43.7775 49.2099 44.5604 48.811C45.4805 48.342 46.3051 47.7438 47.0171 47.0329C47.7307 46.3206 48.3313 45.4953 48.8021 44.5739C49.2001 43.7949 49.5053 42.8591 49.7075 41.8677C49.842 41.2079 49.9309 39.7599 49.9712 38.6377C49.9877 38.1791 49.996 37.5855 49.996 37.3117L50 12.6923C50 12.4196 49.9917 11.8258 49.9753 11.3667C49.9356 10.2517 49.8485 8.81456 49.7165 8.16136C49.5153 7.16426 49.2099 6.22264 48.8109 5.43957C48.342 4.51943 47.7437 3.69492 47.0329 2.98282C46.3206 2.26935 45.4951 1.66862 44.5738 1.19786C43.7948 0.799858 42.859 0.494656 41.8676 0.292534C41.2078 0.158039 39.7599 0.0690918 38.6377 0.0288544C38.179 0.0123329 37.5854 0.00402832 37.3116 0.00402832L12.6923 8.7738e-05C12.4195 8.7738e-05 11.8257 0.0083046 11.3667 0.0246582Z"
                                                            fill="url(#paint0_linear_18_225)"/>
                                                        <path fill-rule="evenodd" clip-rule="evenodd"
                                                              d="M33.6674 28.291C33.2221 28.0681 31.0326 26.9911 30.6243 26.8425C30.2161 26.694 29.9193 26.6197 29.6224 27.0654C29.3255 27.5111 28.4721 28.5138 28.2123 28.811C27.9525 29.108 27.6928 29.1453 27.2475 28.9223C26.8021 28.6996 25.3672 28.2294 23.6662 26.7127C22.3424 25.5323 21.4486 24.0743 21.1888 23.6286C20.929 23.1829 21.1611 22.942 21.3841 22.72C21.5844 22.5206 21.8294 22.2001 22.052 21.9401C22.2747 21.6801 22.3489 21.4944 22.4974 21.1973C22.6458 20.9002 22.5716 20.6402 22.4602 20.4173C22.3489 20.1945 21.4583 18.0032 21.0872 17.1119C20.7258 16.2438 20.3586 16.3612 20.0852 16.3476C19.8258 16.3347 19.5286 16.332 19.2317 16.332C18.9348 16.332 18.4524 16.4434 18.0441 16.889C17.636 17.3347 16.4855 18.4118 16.4855 20.603C16.4855 22.7943 18.0813 24.9113 18.304 25.2084C18.5266 25.5056 21.4442 30.0023 25.9115 31.9307C26.974 32.3894 27.8036 32.6632 28.4503 32.8685C29.5171 33.2073 30.488 33.1595 31.2553 33.0449C32.1109 32.9171 33.8901 31.9678 34.2612 30.9279C34.6322 29.888 34.6322 28.9966 34.521 28.811C34.4097 28.6253 34.1128 28.5138 33.6674 28.291ZM25.5418 39.3822H25.5358C22.8776 39.3811 20.2704 38.6673 17.996 37.318L17.4551 36.997L11.8484 38.4673L13.3449 33.0026L12.9927 32.4424C11.5098 30.0845 10.7267 27.3593 10.7278 24.5611C10.731 16.396 17.3765 9.75312 25.5477 9.75312C29.5044 9.75466 33.2238 11.2971 36.0207 14.0962C38.8176 16.8954 40.357 20.6162 40.3554 24.5731C40.3521 32.7388 33.7067 39.3822 25.5418 39.3822ZM38.1494 11.9691C34.7844 8.60128 30.3094 6.74569 25.5416 6.7438C15.7179 6.7438 7.7225 14.7361 7.71857 24.5599C7.71728 27.7002 8.53794 30.7655 10.0976 33.4673L7.56909 42.7002L17.0173 40.2226C19.6206 41.6421 22.5515 42.39 25.5345 42.3913H25.5418H25.5419C35.3646 42.3913 43.3607 34.398 43.3647 24.5741C43.3665 19.8133 41.5144 15.3368 38.1494 11.9691Z"
                                                              fill="white"/>
                                                    </g>
                                                    <defs>
                                                        <linearGradient id="paint0_linear_18_225" x1="-5.36442e-05" y1="50"
                                                                        x2="-5.36442e-05" y2="3.02898e-05"
                                                                        gradientUnits="userSpaceOnUse">
                                                            <stop stop-color="#25CF43"/>
                                                            <stop offset="1" stop-color="#61FD7D"/>
                                                        </linearGradient>
                                                    </defs>
                                                </svg>
                                            </Link>
                                        </div>
                                    </div>
                                </>
                            )
                        }
                    </div>


                    <div className={styles.navigation}>
                        <button type='button' className={styles.navigationBtn} onClick={handlePrevQuestion}>
                            <svg width="15" height="16" viewBox="0 0 15 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M0.292893 7.29289C-0.0976315 7.68342 -0.0976315 8.31658 0.292893 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292893 7.29289ZM15 7L1 7V9L15 9V7Z"
                                    fill="#101B23"/>
                            </svg>
                        </button>
                        <button type='button' disabled={disable} className={styles.navigationBtn}
                                onClick={handleNextQuestion}>
                            <svg width="15" height="16" viewBox="0 0 15 16" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path
                                    d="M14.7071 8.70711C15.0976 8.31658 15.0976 7.68342 14.7071 7.29289L8.34315 0.928932C7.95262 0.538408 7.31946 0.538408 6.92893 0.928932C6.53841 1.31946 6.53841 1.95262 6.92893 2.34315L12.5858 8L6.92893 13.6569C6.53841 14.0474 6.53841 14.6805 6.92893 15.0711C7.31946 15.4616 7.95262 15.4616 8.34315 15.0711L14.7071 8.70711ZM0 9L14 9V7L0 7L0 9Z"
                                    fill="#101B23"/>
                            </svg>
                        </button>
                    </div>
                </div>

            </form>
            { loading && <Loader/>}
        </>
    )
}