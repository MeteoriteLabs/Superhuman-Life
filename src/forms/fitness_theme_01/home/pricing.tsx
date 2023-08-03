import { useForm, Controller, useFieldArray } from 'react-hook-form';
import style from '../style.module.css';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { UPDATE_WEBSITE_SECTION } from './queries/pricing';
import { GET_WEBSITE_SECTION } from './queries';
import { useContext, useEffect, useState } from 'react';
import authContext from 'context/auth-context';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { useMutation, useQuery } from '@apollo/client';
import { ArrowDownShort } from 'react-bootstrap-icons';
import { Data, FormData, InputProps } from './@types/pricingType';
import { InputComponent } from './components/PricingComponents';
import { FormatStateToServerData, SetReceivingDataAndReset } from './libs/pricing';

function Hero(): JSX.Element {
    const auth = useContext(authContext);
    const [activeKey, setActiveKey] = useState('');
    const planData: InputProps[] = [
        'actual',
        'buttonLink',
        'buttonText',
        'discount',
        'features',
        'price',
        'recurring',
        'title'
    ];

    const handleToggle = (val: string) => {
        setActiveKey((prev) => (prev === val ? '' : val));
    };

    // * --------------------- Initial Values ---------------------

    const [initialValues, setInitialValues] = useState<FormData>({
        title: '',
        sectionId: 0,
        plans: [],
        currency: ''
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
            plans: [],
            currency: '$'
        }
    });

    const { fields } = useFieldArray<FormData>({
        control,
        name: 'plans'
    });

    // * --------------------- Get the Website Section Data ---------------------

    useQuery(GET_WEBSITE_SECTION, {
        variables: {
            id: auth.userid,
            sectionPage: 'Home',
            sectionType: 'Pricing'
        },

        onCompleted: (data: Data) => {
            const sectionData = data.websiteSections.data[0].attributes.sectionData;
            SetReceivingDataAndReset({ sectionData, reset, setInitialValues, data, initialValues });
        }
    });

    // * --------------------- Form Submission ---------------------

    const [mutateFunction, { loading, error }] = useMutation(UPDATE_WEBSITE_SECTION);

    const onSubmit = handleSubmit(async (formData) => {
        // ! Need to add image upload
        const { title, plans, currency } = formData;

        await mutateFunction({
            variables: {
                id: initialValues.sectionId,
                data: JSON.stringify({
                    title: title ? title : initialValues.title,
                    plans:
                        plans.length > 0
                            ? FormatStateToServerData(plans)
                            : FormatStateToServerData(initialValues.plans),
                    currency: currency ? currency : initialValues.currency
                })
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

                <Form.Group controlId="currency">
                    <Form.Label className={style.label_text}>Currency</Form.Label>
                    <Controller
                        name="currency"
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
                                          Pricing {index + 1}
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
                                          {planData.map((input: InputProps, id) => (
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
                      ))
                    : null}

                <Button variant="light" type="submit" className={style.submit_button}>
                    Submit
                </Button>
            </Form>
        </div>
    );
}

export default Hero;
