import {ChangeEvent, FormEvent, useEffect, useState} from "react";
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
    const [progressBar, setProgressBar] = useState<number | null>(null);
    const [isChecked, setIsCheked] = useState<boolean>(false);
    // const [disable, setDisable] = useState(true);


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
        console.log('stepWidth', stepWidth);
        console.log('currentQuestion', currentQuestion);
        console.log('stepWidth', answeredQuestions);
        console.log('stepWidth', questions.length - 1);
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

    // useEffect(() => {
    //     const currentOptions = questions[answeredQuestions].options.map(option => option.name)
    //
    //     const isOptionsSelected = currentOptions.some(name => formState[name])
    //
    //     setDisable(!isOptionsSelected)
    // }, [formState, answeredQuestions])

    const onCheckedPrived = (e: ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value)
        setIsCheked(e.target.checked)
    }


    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        try {

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

        } catch (e) {
            console.error(`Error submitting form: ${e}`)
        }


    }

    return (
        <form action="/" className={styles.quizl__form} onSubmit={handleSubmit}>
            <div className={styles.processBar} style={{width: `${progressBar}%`}}></div>
            <div className={styles.question__container}>
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
                                            onChange={(value, data, event) => handelSetForm(event, 'tel')}/></div> : (
                                        option.name === 'city' || option.name === 'name' ?
                                            <div className={styles.inputTextWrapp}>
                                                <input
                                                    type={'text'}
                                                    name={option.name}
                                                    value={formState[option.name]}
                                                    checked={formState[option.name] === option.value}
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
                        <label className={styles.labelPolicy}>
                            <input type="checkbox" onChange={onCheckedPrived}/>
                            <span className={styles.prived__policy}> Я погоджуюсь з <Link href={'/policy'} target='_blank'
                                                                                          className={styles.policy__link}>політикою конфіденційності та правилами
                        використання *</Link></span>
                        </label>
                    )
                }

                {
                    answeredQuestions === questions.length - 1 && (
                        <button type='submit' disabled={!isChecked} className={styles.btnSubmit}>Замовити</button>
                    )
                }
                <div className={styles.navigation}>
                    <button type='button' className={styles.navigationBtn} onClick={handlePrevQuestion}>prev
                    </button>
                    <button type='button' className={styles.navigationBtn} onClick={handleNextQuestion}>next
                    </button>
                </div>
            </div>

        </form>
    )
}