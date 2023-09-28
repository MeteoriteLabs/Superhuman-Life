import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { UPDATE_WEBSITE_SECTION } from '../queries/features';
import { GET_WEBSITE_SECTION } from '../queries';
import { useContext, useEffect, useState } from 'react';
import authContext from 'context/auth-context';
import { ChangeMakerWebsiteContext } from 'context/changemakerWebsite-context';
import { useMutation, useQuery } from '@apollo/client';
import { ArrowDownShort } from 'react-bootstrap-icons';
import MinusIcon from 'components/Icons/minusIcon';
import PlusIcon from 'components/Icons/plusIcon';

import style from './style.module.css';
import UploadImageToS3WithNativeSdk from 'components/upload/upload';
// * --------------------- Types ---------------------

type FormData = {
    sectionId: number;
    title: string;
    description: string;
    team: {
        name: string;
        description: string;
        image: string;
        designation: string;
    }[];
};

function Team({ page }: { page: string }): JSX.Element {
    const auth = useContext(authContext);
    const [activeKey, setActiveKey] = useState('');

    const handleToggle = (val: string) => {
        setActiveKey((prev) => (prev === val ? '' : val));
    };

    // * --------------------- Initial Values ---------------------

    const [initialValues, setInitialValues] = useState<FormData>({
        title: '',
        sectionId: 0,
        description: '',
        team: []
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
            description: '',
            team: [{}]
        }
    });

    const { fields, append, remove } = useFieldArray<FormData>({
        control,

        name: 'team'
    });

    // * --------------------- Get the Website Section Data ---------------------

    useQuery(GET_WEBSITE_SECTION, {
        variables: {
            id: auth.userid,
            sectionPage: page,
            sectionType: 'Team'
        },

        onCompleted: (data) => {
            if (!initialValues.team.length) {
                setInitialValues({
                    ...initialValues,
                    sectionId: data.websiteSections.data[0].id,
                    title: data.websiteSections.data[0].attributes.sectionData.title,
                    description: data.websiteSections.data[0].attributes.sectionData.description,
                    team: data.websiteSections.data[0].attributes.sectionData.team
                });

                reset({
                    title: data.websiteSections.data[0].attributes.sectionData.title,
                    description: data.websiteSections.data[0].attributes.sectionData.description,
                    team: data.websiteSections.data[0].attributes.sectionData.team
                });
            }
        }
    });

    // * --------------------- Form Submission ---------------------

    const [mutateFunction, { loading }] = useMutation(UPDATE_WEBSITE_SECTION);

    const onSubmit = handleSubmit(async (formData) => {
        // ! Need to add image upload
        const { title, team } = formData;
        localStorage.setItem('team', `${team.length}`);
        await mutateFunction({
            variables: {
                id: initialValues.sectionId,
                data: JSON.stringify({
                    title: title ? title : initialValues.title,
                    team: team.length ? team : initialValues.team
                })
            }
        });
    });

    useEffect(() => {
        loading
            ? setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: true })
            : setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: false });
    }, [loading]);

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
                                type="text"
                                className={style.input_text}
                                as="textarea"
                                rows={6}
                                {...field}
                            ></Form.Control>
                        )}
                    />
                    {errors.description && <p>{errors.description.message}</p>}
                </Form.Group>

                <Form.Group
                    controlId="removeAndAddTeams"
                    style={{ display: 'flex', gap: '4px', justifyContent: 'flex-end' }}
                >
                    <div
                        className={`${style.minus_icon} ${style.svg_icons}`}
                        onClick={() => remove(fields.length - 1)}
                    >
                        <MinusIcon />
                    </div>
                    <div className={`${style.plus_icon} ${style.svg_icons}`}>
                        <PlusIcon />
                    </div>
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
                                          {item.name}
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
                                                  name={`team.${index}.name`}
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
                                                  name={`team.${index}.description`}
                                                  control={control}
                                                  render={({ field }) => (
                                                      <Form.Control
                                                          type="text"
                                                          style={{ fontSize: 14 }}
                                                          as="textarea"
                                                          rows={6}
                                                          {...field}
                                                      ></Form.Control>
                                                  )}
                                              />
                                          </Form.Group>
                                          <Form.Group controlId="image">
                                              <Form.Label className={style.label_text}>
                                                  Image
                                              </Form.Label>
                                              <Controller
                                                  name={`team.${index}.image`}
                                                  control={control}
                                                  render={({ field }) => (
                                                      <UploadImageToS3WithNativeSdk
                                                          allowImage={true}
                                                          allowVideo={false}
                                                          form={true}
                                                          uploadInterface="modal"
                                                          onChange={(
                                                              event: React.ChangeEvent<HTMLInputElement>
                                                          ) => {
                                                              field.onChange(event);
                                                          }}
                                                          value={field.value}
                                                          aspectRatio={'1:1'}
                                                      />
                                                  )}
                                              />
                                          </Form.Group>
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

export default Team;
