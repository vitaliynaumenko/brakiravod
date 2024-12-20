import {ChangeEvent, FormEvent, useEffect, useState} from "react";
import PhoneInput from "react-phone-input-2";
import {questions} from "@/data/data";
import Link from "next/link";

import "react-phone-input-2/lib/style.css";
import styles from "@/styles/Quizl.module.css"
import Loader from "@/components/loader";
import {useRouter} from "next/router";
import SocialButton from "@/components/SocialButton";

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

    const calculationWith = (currentQuestion: number) => {
        const stepWidth = (currentQuestion / (questions.length - 1)) * 100
        setProgressBar(stepWidth)
    }

    const handleNextQuestion = () => {
        if (answeredQuestions < questions.length - 1) {
            const currentQuestion = answeredQuestions + 1
            setAnsweredQuestions(currentQuestion)
            calculationWith(currentQuestion)
        }
    }
    const handlePrevQuestion = () => {
        if (answeredQuestions > 0) {
            const currentQuestion = answeredQuestions - 1
            setAnsweredQuestions(answeredQuestions - 1)
            calculationWith(currentQuestion)
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
        if (answeredQuestions < questions.length - 1) {

            const currentOptions = questions[answeredQuestions].options.filter(option => option.type !== 'text')
                .map(option => option.name)
            const isOptionsSelected = currentOptions.some(name => formState[name])

            if (isOptionsSelected) {
                handleNextQuestion()
            }
            if (formState.city?.length) {
                setDisable(false)
            }
        }

    }, [formState])

    const onCheckedPrived = (e: ChangeEvent<HTMLInputElement>) => {
        setIsCheked(e.target.checked)
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()

        try {
            const {tel, ...otherProps} = formState
            const newTel = tel.replace(/\D/g, "")
            const formData = {
                tel: newTel,
                ...otherProps
            }

            setLoading(true)
            const response = await fetch('/api/sentMessageToBot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            })

            if (!response.ok) {
                throw new Error(`Error submitting form: ${response.statusText}`)
            }

            await router.push('/thankYouPage')

        } catch (e) {
            console.error(`Error submitting form: ${e}`)
        } finally {
            // setFormState({})
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
                                        <span className={styles.prived__policy}> Я погоджуюсь з
                                            <Link href={'/policy'}
                                                  target='_blank'
                                                  className={styles.policy__link}>політикою конфіденційності та правилами використання *</Link></span>
                                    </label>
                                    <button type='submit' disabled={!isChecked} className={styles.btnSubmit}>
                                        Замовити
                                    </button>
                                    <div className={styles.socialMedia}>
                                        <div className={styles.socialMediaTitle}>
                                            <span>або</span>
                                        </div>
                                        <p>Натисніть на улюблений месенджер і ми зв’яжемось з вами</p>
                                        <SocialButton/>
                                    </div>
                                </>
                            )
                        }
                    </div>

                    {
                        answeredQuestions < questions.length - 1 && (
                            <div className={styles.navigation}>
                                <button type='button' disabled={answeredQuestions === 0} className={styles.navigationBtn}
                                        onClick={handlePrevQuestion}>
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
                        )

                    }

                </div>

            </form>
            {loading && <Loader/>}
        </>
    )
}