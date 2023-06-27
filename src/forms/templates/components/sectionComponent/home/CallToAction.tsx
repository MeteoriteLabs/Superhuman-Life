import { useForm, Controller } from 'react-hook-form'
import style from '../style.module.css'
import { Button, Form } from 'react-bootstrap'
import authContext from '../../../../../context/auth-context'
import { useContext, useEffect, useState } from 'react'
import { ChangeMakerWebsiteContext } from '../../../../../context/changemakerWebsite-context'
import { GET_WEBSITE_SECTION } from './queries'
import { useMutation, useQuery } from '@apollo/client'
import { UPDATE_WEBSITE_SECTION } from './queries/cta'
import Toaster from '../../../../../components/Toaster'

type FormData = {
    sectionId: number
    title: string
    buttonText: string
    link: string
}

function CallToAction(): JSX.Element {
    const auth = useContext(authContext)
    const [errorMsg, setErrorMsg] = useState<string>('')
    const [initialValues, setInitialValues] = useState<FormData>({
        sectionId: 0,
        title: '',
        buttonText: '',
        link: '/'
    })

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            title: initialValues.title,
            buttonText: initialValues.buttonText,
            link: initialValues.link
        }
    })

    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext)

    useQuery(GET_WEBSITE_SECTION, {
        variables: {
            id: auth.userid,
            sectionPage: 'Home',
            sectionType: 'CTA'
        },
        onCompleted: (data) => {
            setInitialValues({
                ...initialValues,
                sectionId: data.websiteSections.data[0].id,
                title: data.websiteSections.data[0].attributes.sectionData.title,
                buttonText: data.websiteSections.data[0].attributes.sectionData.button.text,
                link: data.websiteSections.data[0].attributes.sectionData.button.link
            })

            reset({
                title: data.websiteSections.data[0].attributes.sectionData.title,
                buttonText: data.websiteSections.data[0].attributes.sectionData.button.text,
                link: data.websiteSections.data[0].attributes.sectionData.button.link
            })
        }
    })

    const [mutateFunction, { loading, error }] = useMutation(UPDATE_WEBSITE_SECTION)

    const onSubmit = handleSubmit(async (formData) => {
        // ! Need to add image upload
        const { title, buttonText, link } = formData

        await mutateFunction({
            variables: {
                id: initialValues.sectionId,
                title: title ? title : initialValues.title,
                buttonText: buttonText ? buttonText : initialValues.buttonText,
                link: link ? link : initialValues.link
            }
        })
    })

    useEffect(() => {
        loading
            ? setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: true })
            : setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: false })
        error ? setErrorMsg(`${error.name}: ${error.message}`) : setErrorMsg('')
    }, [loading, error])

    return (
        <div className={style.form_container}>
            <Form onSubmit={onSubmit} className={style.form}>
                <Form.Group controlId="home_cta">
                    <Form.Label className={style.label_text}>Title</Form.Label>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field }) => (
                            <Form.Control
                                type="text"
                                className={style.input_text}
                                as="input"
                                {...field}
                            ></Form.Control>
                        )}
                    />

                    {errors.title && <p>{errors.title.message}</p>}
                </Form.Group>
                <Form.Group controlId="home_cta">
                    <Form.Label>Button </Form.Label>
                    <Controller
                        name="buttonText"
                        control={control}
                        render={({ field }) => (
                            <Form.Control
                                type="textarea"
                                className={style.input_text}
                                as="input"
                                {...field}
                            ></Form.Control>
                        )}
                    />

                    {errors.buttonText && (
                        <Form.Control.Feedback tooltip>
                            {errors.buttonText.message}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Form.Group controlId="home_cta">
                    <Form.Label>Button Link </Form.Label>
                    <Controller
                        name="link"
                        control={control}
                        render={({ field }) => (
                            <Form.Control
                                type="textarea"
                                className={style.input_text}
                                as="input"
                                {...field}
                            ></Form.Control>
                        )}
                    />

                    {errors.link && (
                        <Form.Control.Feedback tooltip>{errors.link.message}</Form.Control.Feedback>
                    )}
                </Form.Group>
                {errorMsg ? (
                    <Toaster type="error" msg={errorMsg} handleCallback={() => setErrorMsg('')} />
                ) : null}
                <Button variant="primary" type="submit" className={style.submit_button}>
                    Submit
                </Button>
            </Form>
        </div>
    )
}

export default CallToAction
