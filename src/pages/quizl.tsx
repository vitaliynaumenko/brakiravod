import {ChangeEvent, useEffect, useState} from "react";
import PhoneInput from "react-phone-input-2";
import {questions} from "@/data/data";
import Link from "next/link";
import "react-phone-input-2/lib/style.css";
import styles from "@/styles/Quizl.module.css"

type FormStateType = {
    [key: string]: string;

}

export default function Quizl() {
    const [formState, setFormState] = useState<FormStateType>({});
    const [answeredQuestions, setAnsweredQuestions] = useState<number>(0);
    const [country, setCountry] = useState<string>('');
    // const [disable, setDisable] = useState(true);


    const handelSetForm = (e: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target
        setFormState(() => ({
            ...formState,
            [name]: value

        }))

    }

    const handleNextQuestion = () => {
        if (answeredQuestions < questions.length - 1) {
            setAnsweredQuestions(answeredQuestions + 1)
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

    // useEffect(() => {
    //     const currentOptions = questions[answeredQuestions].options.map(option => option.name)
    //
    //     const isOptionsSelected = currentOptions.some(name => formState[name])
    //
    //     setDisable(!isOptionsSelected)
    // }, [formState, answeredQuestions])

    return (
        <form action="/" className={styles.quizl__form}>
            <div className={styles.processBar}></div>
            <div className={styles.question__container}>
                <h2 className={styles.quizl__title}>{`${questions[answeredQuestions].question} ${answeredQuestions === 1 ? switchGender(formState.divorce) : ''}`}</h2>
                <div
                    className={styles.quizl__desc}>{answeredQuestions === 0 ? '(вкажіть один з варіантів відповіді)' : '(оберіть варіант відповіді)'} </div>
                <div className={styles.row}>
                    {
                        questions[answeredQuestions].options.map((option, index: number) => (
                            <>
                                {
                                    option.name === 'tel' ? <div className={styles.inputTextWrapp}><PhoneInput
                                        country={country.toLowerCase()}/></div> : (
                                        option.name === 'city' || option.name === 'name' ?
                                            <div className={styles.inputTextWrapp}>
                                                <input
                                                    type={'text'}
                                                    name={option.name}
                                                    value={option.value}
                                                    checked={formState[option.name] === option.value}
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
            </div>
            <div className={styles.navigation}>
                <button type='button' className={styles.navigationBtn} onClick={handlePrevQuestion}>prev
                </button>
                <button type='button' className={styles.navigationBtn} onClick={handleNextQuestion}>next</button>
            </div>
            {
                answeredQuestions === questions.length - 1 && (
                    <label>
                        <input type="checkbox"/>
                        <span className={styles.prived__policy}> Я погоджуюсь з <Link href={'/policy'} target='_blank'
                                                                                      className={styles.policy__link}>політикою конфіденційності та правилами
                        використання *</Link></span>
                    </label>
                )
            }
        </form>
    )
}