import { useForm, Controller, useFieldArray } from 'react-hook-form';
import style from '../style.module.css';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { useContext, useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { UPDATE_WEBSITE_SECTION } from './queries/testimonials';
import authContext from '../../../../../context/auth-context';
import { SetReceivingDataAndReset } from './libs/testimonials';
import { Data, FormData, InputProps } from './@types/testimonialsType';
import { ChangeMakerWebsiteContext } from '../../../../../context/changemakerWebsite-context';
import { GET_WEBSITE_SECTION } from './queries';
import { InputComponent } from './components/TestimonialsComponents';
import { ArrowDownShort } from 'react-bootstrap-icons';
import Toaster from '../../../../../components/Toaster';

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
        testimonials: []
    });
    const testimonials: InputProps[] = ['name', 'designation', 'image', 'text'];

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
            testimonials: []
        }
    });

    const { fields } = useFieldArray<FormData>({
        control,
        name: 'testimonials'
    });

    // * --------------------- Get the Website Section Data ---------------------

    useQuery(GET_WEBSITE_SECTION, {
        variables: {
            id: auth.userid,
            sectionPage: 'Home',
            sectionType: 'Testimonials'
        },

        onCompleted: (data: Data) => {
            const sectionData = data.websiteSections.data[0].attributes.sectionData;
            console.log('sectionData', sectionData.testimonials[0].text);
            SetReceivingDataAndReset({ sectionData, reset, setInitialValues, data, initialValues });
        }
    });

    // * --------------------- Form Submission ---------------------

    const [mutateFunction, { loading, error }] = useMutation(UPDATE_WEBSITE_SECTION);

    const onSubmit = handleSubmit(async (formData) => {
        // ! Need to add image upload
        const { title, testimonials } = formData;

        await mutateFunction({
            variables: {
                id: initialValues.sectionId,
                data: JSON.stringify({
                    title: title ? title : initialValues.title,
                    testimonials:
                        testimonials.length > 0 ? testimonials : initialValues.testimonials
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
                <Form.Group controlId="formBasicEmail">
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

                {fields.length
                    ? fields.map((item, index) => (
                          <Accordion style={{ padding: 0 }} key={index}>
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
                                                  fontWeight: 600,
                                                  marginBottom: 8,
                                                  color: 'white'
                                              }}
                                          >
                                              Testimonials {index + 1}
                                          </p>

                                          <ArrowDownShort
                                              fill="#fff"
                                              size="20"
                                              style={{
                                                  rotate:
                                                      activeKey === `${index}` ? '180deg' : '0deg',
                                                  transition: 'all .3s ease-in-out'
                                              }}
                                          />
                                      </Accordion.Toggle>

                                      <Accordion.Collapse eventKey={`${index}`}>
                                          <Card.Body>
                                              {testimonials.map((input: InputProps, id) => (
                                                  <span key={id + index}>
                                                      <InputComponent
                                                          input={input}
                                                          index={index}
                                                          control={control}
                                                      />
                                                  </span>
                                              ))}
                                          </Card.Body>
                                      </Accordion.Collapse>
                                  </Card>
                              </Accordion>
                          </Accordion>
                      ))
                    : null}

                <hr className={style.break_line} />
                {/* add */}
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
