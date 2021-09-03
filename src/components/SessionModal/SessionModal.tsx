
import { useMutation, useQuery } from '@apollo/client';
import moment from 'moment';
import { useState, useContext } from 'react';
import { Modal, Button, FormControl, Form } from 'react-bootstrap'
import Select from 'react-select';
import { EDIT_PROGRAM } from '../../builders/session-builder/graphQL/mutation';
import { GET_ALL_FITNESSDISCIPLINES, GET_ALL_FITNESSEQUIPMENT, GET_PACKAGE_BY_TYPE } from '../../builders/session-builder/graphQL/queries';
import authContext from '../../context/auth-context';


interface Discipline {
    id: string,
    disciplinename: string
}

interface Equipment {
    id: string,
    name: string
}



export default function SessionModal(props) {


    const { render, setRender, rowData, actionType, packageId, type } = props;
    console.log("🚀 ~ file: SessionModal.tsx ~ line 24 ~ SessionModal ~ rowData", rowData)

    const auth = useContext(authContext);
    const startDay = moment(rowData.publishing_date, "DD/MM/YYYY");
    const endDay = moment(rowData.expiry, 'DD/MM/YYYY');
    let groupDuration = moment.duration(endDay.diff(startDay)).asDays();



    const [disciplines, setDisciplines] = useState<Discipline[]>([]);
    const [equipment, setEquipments] = useState<Equipment[]>([]);
    const [formData, setFormData] = useState<any>({

        // id:rowData.id,
        // duration_days: rowData && rowData.duration,
        // fitness_package_type: type,
        id: rowData.programId,
        title: rowData && rowData.programName,
        description: rowData && rowData.description,
        level: rowData && rowData.level,
        fitnessdisciplines: rowData && rowData.programDisciplines.map(discipline => discipline.value),
        users_permissions_user: rowData.users_permissions_user,
        Is_program: true,
    })


    const FetchDataDisciplines = () => {
        useQuery(GET_ALL_FITNESSDISCIPLINES, {
            onCompleted: (data) => loadDataDisciplines(data)
        })

    }

    const FetchDataEquipments = () => {
        useQuery(GET_ALL_FITNESSEQUIPMENT, {
            onCompleted: (data) => loadDataEquipment(data)
        })
    }


    const loadDataEquipment = (data) => {
        setEquipments(
            [...data.equipmentLists.map(equipment => {
                return {
                    value: equipment.id,
                    label: equipment.name
                }
            })]
        )

    }

    const loadDataDisciplines = (data) => {
        setDisciplines(
            [...data.fitnessdisciplines.map(discipline => {
                return {
                    value: discipline.id,
                    label: discipline.disciplinename
                }
            })]
        )
    }

    FetchDataDisciplines();
    FetchDataEquipments();




    const [editProgram] = useMutation(EDIT_PROGRAM, {
        variables:formData
    });

    const HandleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);

        editProgram();
    }







    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleChangeDisciplines = (e) => {
        const value = e.map(item => item.value);
        setFormData({
            ...formData,
            fitnessdisciplines: value
        })
    }

    const handleChangeEquiments = (e) => {
        const value = e.map(item => item.value);
        setFormData({
            ...formData,
            fitnessdisciplines: value
        })
    }



    return (
        <Modal
            show={render}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={() => setRender(false)}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    New Program
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>

                <Form onSubmit={HandleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Program Name</Form.Label>
                        <Form.Control defaultValue={(type === "Personal Training" || type === "Classic Class" || type === "Custom Class") && rowData.programName} onChange={(e) => handleChange(e)} name='title' />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Duration (days)</Form.Label>
                        <Form.Control value={rowData.duration} disabled name='duration' type="number" />
                    </Form.Group>


                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Level</Form.Label>
                        <div>
                            <Form.Check
                                defaultChecked={rowData.level === "Beginner"}
                                name="level"
                                label="Beginner"
                                type="radio"
                                id='Beginner'
                                inline
                                value="Beginner"
                                onChange={(e) => handleChange(e)}
                            />
                            <Form.Check
                                defaultChecked={rowData.level === "Intermediate"}
                                name="level"
                                label="Intermediate"
                                type="radio"
                                id='Intermediate'
                                inline
                                value="Intermediate"
                                onChange={(e) => handleChange(e)}
                            />
                            <Form.Check
                                defaultChecked={rowData.level === "Advanced"}
                                name="level"
                                label="Advanced"
                                type="radio"
                                id='Advanced'
                                inline
                                value="Advanced"
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className='font-weight-bold'>Discipline</Form.Label>
                        <Select
                            defaultValue={rowData.packageDisciplines}
                            isMulti
                            name="fitnessdisciplines"
                            options={disciplines}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            closeMenuOnSelect={true}
                        // onChange={(e) => handleChangeDisciplines(e)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label className='font-weight-bold'>Equipment</Form.Label>
                        <Select
                            defaultValue={rowData.programDisciplines}
                            isMulti
                            name="equipment"
                            options={disciplines}
                            className="basic-multi-select"
                            classNamePrefix="select"
                            closeMenuOnSelect={true}
                            onChange={(e) => handleChangeDisciplines(e)}
                        />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label className='font-weight-bold'>Details</Form.Label>
                        <FormControl defaultValue={rowData.description} onChange={(e) => handleChange(e)} name='description' as="textarea" aria-label="With textarea" />
                    </Form.Group>

                    <Modal.Footer>
                        <Button type='submit' onClick={() => {
                            // setRender(false)
                        }}>Submit</Button>
                        <Button onClick={() => {
                            setRender(false)
                        }}>Close</Button>
                    </Modal.Footer>
                </Form>
            </Modal.Body>
        </Modal>
    )
}
