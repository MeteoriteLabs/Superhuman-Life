import { useForm, Controller } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_WEBSITE_SECTION } from './queries/hero';
import { GET_WEBSITE_SECTION } from './queries';
import authContext from '../../context/auth-context';
import { useContext, useEffect, useState } from 'react';
import { ChangeMakerWebsiteContext } from '../../context/changemakerWebsite-context';
import Toaster from '../../components/Toaster';
import UploadImageToS3WithNativeSdk from '../../components/upload/upload';
import style from '../style.module.css';

type FormData = {
    title: string;
    description: string;
    image: string;
};

function Hero(): JSX.Element {
    const auth = useContext(authContext);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [initialValues, setInitialValues] = useState({
        title: '',
        description: '',
        image: '',
        sectionId: ''
    });

    const {
        handleSubmit,
        control,
        formState: { errors },
        reset
    } = useForm<FormData>({
        defaultValues: {
            title: initialValues.title,
            description: initialValues.description,
            image: initialValues.image
        }
    });

    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    useQuery(GET_WEBSITE_SECTION, {
        variables: {
            id: auth.userid,
            sectionPage: 'Home',
            sectionType: 'Hero'
        },
        onCompleted: (data) => {
            setInitialValues({
                ...initialValues,
                sectionId: data.websiteSections.data[0].id,
                title: data.websiteSections.data[0].attributes.sectionData.title,
                description: data.websiteSections.data[0].attributes.sectionData.description,
                image: data.websiteSections.data[0].attributes.sectionData.image
            });
            reset({
                title: data.websiteSections.data[0].attributes.sectionData.title,
                description: data.websiteSections.data[0].attributes.sectionData.description
            });
        }
    });

    const [mutateFunction, { loading, error }] = useMutation(UPDATE_WEBSITE_SECTION);

    const onSubmit = handleSubmit(async (formData) => {
        const { title, description, image } = formData;

        await mutateFunction({
            variables: {
                id: initialValues.sectionId,
                title: title ? title : initialValues.title,
                desc: description ? description : initialValues.description,
                image: image ? image : initialValues.image
            }
        });
    });

    useEffect(() => {
        loading
            ? setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: true })
            : setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: false });
        error ? setErrorMsg(`${error.name}: ${error.message}`) : setErrorMsg('');
    }, [loading, error]);

    return (
        <div className={style.form_container}>
            <Form onSubmit={onSubmit} className={style.form}>
                <Form.Group controlId="title">
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
                <Form.Group controlId="description">
                    <Form.Label className={style.label_text}>Description</Form.Label>
                    <Controller
                        name="description"
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

                    {errors.description && (
                        <Form.Control.Feedback tooltip>
                            {errors.description.message}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>
                <Form.Group controlId="description">
                    <Form.Label className={style.label_text}>Image</Form.Label>
                    <Controller
                        name="image"
                        control={control}
                        render={({ field }) => (
                            <UploadImageToS3WithNativeSdk
                                allowImage={true}
                                allowVideo={false}
                                onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                                    field.onChange(event);
                                }}
                                value={field.value}
                                aspectRatio={'1:1'}
                            />
                        )}
                    />
                </Form.Group>
                {errors.image && (
                    <Form.Control.Feedback tooltip>{errors.image.message}</Form.Control.Feedback>
                )}

                {/* add */}
                {errorMsg ? (
                    <Toaster type="error" msg={errorMsg} handleCallback={() => setErrorMsg('')} />
                ) : null}
                <Button variant="light" type="submit" className={style.submit_button}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Hero;
