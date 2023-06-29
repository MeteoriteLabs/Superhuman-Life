import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { UPDATE_WEBSITE_SECTION } from './queries/features';
import { GET_WEBSITE_SECTION } from './queries';
import { useContext, useEffect, useState } from 'react';
import authContext from '../../context/auth-context';
import { ChangeMakerWebsiteContext } from '../../context/changemakerWebsite-context';
import { useMutation, useQuery } from '@apollo/client';
import { ArrowDownShort } from 'react-bootstrap-icons';
import Toaster from '../../components/Toaster';
import style from '../style.module.css';
// * --------------------- Types ---------------------

type FormData = {
    sectionId: number;
    title: string;
    features: {
        title: string;
        text: string;
        icons: string;
    }[];
};

function Hero(): JSX.Element {
    const auth = useContext(authContext);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [activeKey, setActiveKey] = useState('');

    const handleToggle = (val: string) => {
        setActiveKey((prev) => (prev === val ? '' : val));
    };

    // * --------------------- Initial Values ---------------------

    const [initialValues, setInitialValues] = useState<FormData>({
        title: '',
        sectionId: 0,
        features: []
    });

    const { setChangemakerWebsiteState, changemakerWebsiteState } =
        useContext(ChangeMakerWebsiteContext);

    // * --------------------- Form Configuration ---------------------

    const {
        handleSubmit,
        control,
        reset,
        formState: { errors }
    } = useForm<FormData>({
        defaultValues: {
            title: '',
            features: [{}]
        }
    });

    const { fields } = useFieldArray<FormData>({
        control,
        name: 'features'
    });

    // * --------------------- Get the Website Section Data ---------------------

    useQuery(GET_WEBSITE_SECTION, {
        variables: {
            id: auth.userid,
            sectionPage: 'Home',
            sectionType: 'Feature'
        },

        onCompleted: (data) => {
            if (initialValues.features.length === 0) {
                setInitialValues({
                    ...initialValues,
                    sectionId: data.websiteSections.data[0].id,
                    title: data.websiteSections.data[0].attributes.sectionData.titile,
                    features: data.websiteSections.data[0].attributes.sectionData.features
                });

                reset({
                    title: data.websiteSections.data[0].attributes.sectionData.titile,
                    features: data.websiteSections.data[0].attributes.sectionData.features
                });
            }
        }
    });

    // * --------------------- Form Submission ---------------------

    const [mutateFunction, { loading, error }] = useMutation(UPDATE_WEBSITE_SECTION);

    const onSubmit = handleSubmit(async (formData) => {
        // ! Need to add image upload
        const { title, features } = formData;

        await mutateFunction({
            variables: {
                id: initialValues.sectionId,
                data: JSON.stringify({
                    titile: title ? title : initialValues.title,
                    features: features.length > 0 ? features : initialValues.features
                })
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

                {fields.length > 0
                    ? fields.map((item, index) => (
                          <Accordion style={{ padding: 0 }} key={index}>
                              <Card style={{ backgroundColor: 'transparent', border: 'none' }}>
                                  <Accordion.Toggle
                                      variant="text"
                                      as={Button}
                                      onClick={() => handleToggle(`${index}`)}
                                      className="text-left d-flex justify-content-between align-items-center"
                                      eventKey={`${index}`}
                                      style={{ padding: '8px 0px' }}
                                  >
                                      <p
                                          style={{
                                              marginBottom: 8,
                                              color: 'white',
                                              fontSize: 14
                                          }}
                                      >
                                          Feature {index + 1}
                                      </p>

                                      <ArrowDownShort
                                          fill="#fff"
                                          size="20"
                                          style={{
                                              rotate: activeKey === `${index}` ? '180deg' : '0deg',
                                              transition: 'all .3s ease-in-out'
                                          }}
                                      />
                                  </Accordion.Toggle>

                                  <Accordion.Collapse eventKey={`${index}`}>
                                      <Card.Body>
                                          <Form.Group>
                                              <Form.Label>Title</Form.Label>
                                              <Controller
                                                  name={`features.${index}.title`}
                                                  control={control}
                                                  render={({ field }) => (
                                                      <Form.Control
                                                          type="text"
                                                          style={{ fontSize: 14 }}
                                                          as="input"
                                                          {...field}
                                                      ></Form.Control>
                                                  )}
                                              />
                                          </Form.Group>
                                          <Form.Group>
                                              <Form.Label>Description</Form.Label>
                                              <Controller
                                                  name={`features.${index}.text`}
                                                  control={control}
                                                  render={({ field }) => (
                                                      <Form.Control
                                                          type="text"
                                                          style={{ fontSize: 14 }}
                                                          as="input"
                                                          {...field}
                                                      ></Form.Control>
                                                  )}
                                              />
                                          </Form.Group>
                                          <Form.Group>
                                              {/* <Form.Label>Image</Form.Label>
                        <Controller
                          name={`features.${index}.icons`}
                          control={control}
                          render={({ field }) => (
                            <Form.Control
                              type="file"
                              style={{ fontSize: 14 }}
                              as="input"
                              {...field}></Form.Control>
                          )}
                        /> */}
                                          </Form.Group>
                                      </Card.Body>
                                  </Accordion.Collapse>
                              </Card>
                          </Accordion>
                      ))
                    : null}

                {errorMsg ? (
                    <Toaster type="error" msg={errorMsg} handleCallback={() => setErrorMsg('')} />
                ) : null}
                <Button variant="primary" type="submit" className={style.submit_button}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Hero;
