import { useState } from 'react';
import { Accordion, Button, Card, Form } from 'react-bootstrap';
import { Controller } from 'react-hook-form';
import { ArrowDownShort } from 'react-bootstrap-icons';

function BlackBgAccordian({
    title,
    control_description,
    control_title,
    control_image,
    control,
    errors,
    eventKey
}: {
    title: string;
    control_description: string;
    control_title: string;
    control_image: string;
    control: any;
    errors: any;
    eventKey: string;
}): JSX.Element {
    const [activeKey, setActiveKey] = useState(false);

    const handleToggle = () => {
        setActiveKey((prev) => !prev);
    };

    return (
        <Accordion style={{ padding: 0 }}>
            <Card style={{ backgroundColor: 'transparent', border: 'none' }}>
                <Accordion.Toggle
                    variant="text"
                    as={Button}
                    onClick={handleToggle}
                    className="text-left d-flex justify-content-between align-items-center"
                    eventKey={eventKey}
                    style={{ padding: '8px 0px' }}
                >
                    <p style={{ fontWeight: 600, marginBottom: 8, color: 'white' }}>{title}</p>

                    <ArrowDownShort
                        fill="#fff"
                        size="20"
                        style={{
                            rotate: activeKey ? '180deg' : '0deg',
                            transition: 'all .3s ease-in-out'
                        }}
                    />
                </Accordion.Toggle>

                <Accordion.Collapse eventKey={eventKey}>
                    <Card.Body>
                        <Form.Group controlId={control_title}>
                            <Form.Label>Title</Form.Label>
                            <Controller
                                name={control_title}
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
                            {errors.feature1_title && <p>{errors.feature1_title.message}</p>}
                        </Form.Group>
                        <Form.Group controlId={control_description}>
                            <Form.Label>Description</Form.Label>
                            <Controller
                                name={control_description}
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
                            {errors.feature1_description && (
                                <p>{errors.feature1_description.message}</p>
                            )}
                        </Form.Group>
                        <Form.Group controlId={control_image}>
                            <Form.Label>Image</Form.Label>
                            <Controller
                                name={control_image}
                                control={control}
                                render={({ field }) => (
                                    <Form.Control
                                        type="file"
                                        style={{ fontSize: 14 }}
                                        as="input"
                                        {...field}
                                    ></Form.Control>
                                )}
                            />
                            {errors.feature1_image && <p>{errors.feature1_image.message}</p>}
                        </Form.Group>
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
}

export default BlackBgAccordian;
