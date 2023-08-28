import { useForm, Controller } from 'react-hook-form';
import { Button, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_WEBSITE_SECTION } from '../queries/offerings';
import { GET_WEBSITE_SECTION } from '../queries';
import authContext from 'context/auth-context';
import { useContext, useEffect, useState } from 'react';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';

import style from './style.module.css';

type FormData = {
    title: string;
    description: string;
    image: string;
};

function Offering({ type }: { type: string }): JSX.Element {
    const auth = useContext(authContext);
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
            description: initialValues.description
        }
    });

    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    useQuery(GET_WEBSITE_SECTION, {
        variables: {
            id: auth.userid,
            sectionPage: 'Offerings',
            sectionType: type
        },
        onCompleted: (data) => {
            setInitialValues({
                ...initialValues,
                sectionId: data.websiteSections.data[0].id,
                title: data.websiteSections.data[0].attributes.sectionData.intro.title,
                description: data.websiteSections.data[0].attributes.sectionData.intro.description
            });
            reset({
                title: data.websiteSections.data[0].attributes.sectionData.intro.title,
                description: data.websiteSections.data[0].attributes.sectionData.intro.description
            });
        }
    });

    const [mutateFunction, { loading, error }] = useMutation(UPDATE_WEBSITE_SECTION);

    const onSubmit = handleSubmit(async (formData) => {
        const { title, description } = formData;

        await mutateFunction({
            variables: {
                id: initialValues.sectionId,
                title: title ? title : initialValues.title,
                desc: description ? description : initialValues.description
            }
        });
    });

    useEffect(() => {
        loading
            ? setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: true })
            : setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: false });
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
                                as="textarea"
                                className={style.input_text}
                                {...field}
                                rows={8}
                                type="text"
                            ></Form.Control>
                        )}
                    />

                    {errors.description && (
                        <Form.Control.Feedback tooltip>
                            {errors.description.message}
                        </Form.Control.Feedback>
                    )}
                </Form.Group>

                {errors.image && (
                    <Form.Control.Feedback tooltip>{errors.image.message}</Form.Control.Feedback>
                )}

                <Button variant="light" type="submit" className={style.submit_button}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Offering;
