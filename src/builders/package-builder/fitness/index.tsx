import { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Badge, Button, Card, Dropdown, OverlayTrigger, Popover, TabContent, Table } from "react-bootstrap";
import ModalView from "../../../components/modal";
import CustomTable from "../../../components/table";
import { Typeahead } from 'react-bootstrap-typeahead'
import { GET_ADDRESS, GET_FITNESS_DISCIPLINES } from "../../../graphQL/queries";
import './fitness.css'
import _ from 'lodash'

const GET_FITNESS = gql`{
    fitnesspackages {
      packagename
      intropicture {
        url
      }
      packagetypes
      ptoffline
      ptonline
      groupoffline
      grouponline
      recordedclasses
      discipline {
        disciplinename
      }
      fitnesspackagepricing {
        packagepricing
      }
      duration
    }
  }
  `;

export default function FitnessTab() {

    const columns = useMemo<any>(() => [
        {
            accessor: "intropicture",
            Header: "-",
            Cell: (v: any) => <img src={v.url} height="32" alt="thumbnail" />
        },
        { accessor: "packagename", Header: "Name" },
        { accessor: "packagetype", Header: "Type" },
        {
            accessor: "discipline",
            Header: "Details",
            Cell: (v: any) => <>{v.value.disciplinename}</>
        },
        { accessor: "duration", Header: "Duration" },
        {
            accessor: "fitnesspackagepricing",
            Header: "Price",
            Cell: (v: any) => <>{v.value[0].packagepricing[0].mrp}</>
        },
        {
            id: "status",
            Header: "Status",
            Cell: (v: any) => <Badge variant="success">Active</Badge>
        },
        {
            id: "edit",
            Header: "Actions",
            Cell: ({ row }: any) => (
                <OverlayTrigger
                    trigger="click"
                    placement="right"
                    overlay={
                        <Popover id="action-popover">
                            <Popover.Content>
                                <Dropdown.Item>View</Dropdown.Item>
                                <Dropdown.Item>Status</Dropdown.Item>
                                <Dropdown.Item>Edit</Dropdown.Item>
                                <Dropdown.Item>Delete</Dropdown.Item>
                            </Popover.Content>
                        </Popover>
                    }
                >
                    <Button variant="white">
                        <i className="fas fa-ellipsis-v"></i>
                    </Button>
                </OverlayTrigger>
            ),
        }
    ], []);

    const { loading, error, data } = useQuery(GET_FITNESS);


    const classicSchema: any = require("./classic.json");
    const customSchema: any = require("./custom.json");
    const groupSchema: any = require("./group.json");
    const ptSchema: any = require("./pt.json");
    // const [multiSelections, setMultiSelections] = useState([]);



    const arrProps = [] as any;
    const CustomDiscipline = (props: any) => {
        const { data, loading, error } = useQuery(GET_FITNESS_DISCIPLINES);
        const { label } = props;
        if (loading) return <p>...loading</p>
        if (!loading && !error) {
            const serverKeyMap = {
                __typename: "value",
                disciplinename: "label"
            };
            const resObj = data.fitnessdisciplines.map((item: any) => _.mapKeys(item, (value: any, key: any) => {
                return serverKeyMap[key]
            }))
            return <div>
                <label>{props.label}</label>
                <Typeahead
                    options={resObj}
                    placeholder="Choose your discpline ... "
                    id="basic-typeahead-multiple"
                    onChange={(e) => {
                        arrProps.push(e);
                    }}
                    multiple />
            </div>
        }
    }


    const ArrayLocationTemplate = ({ onChange, label }: any) => {
        const { data, loading, error } = useQuery(GET_ADDRESS);
        if (loading) return <p>...loading</p>
        if (!loading && !error) {
            const arrAddresses = data.addresses;
            return <div>
                <label>{label}</label>
                {arrAddresses?.map((item: any, index: any) => {
                    return <div key={index}>
                        <label className='ml-3'>
                            <input type="radio" id={item.id} name='address' value={item.id} onChange={(event) => onChange(event.target.value)} />
                            <span className='ml-3'>{item.address1} {item.address2} {item.city} {item.state} {item.country}</span>
                        </label>
                    </div>
                })}
            </div>

        }

    };

    const CustomTextTitlePackage = () => {
        return <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
            <p className='m-0'>Set for One Month (30 days)</p>
        </div>
    };


    const CustomNumberPeople = ({ options, schema, value, label, onChange }: any) => {
        return <div className='text-center text-black py-3' style={{ border: '1px solid black', borderRadius: '5px', boxShadow: '0px 7px 15px -11px #000000' }}>
            {label === 'Online' ? <img src="/assets/PT-Online.svg" alt='123' /> : <img src="/assets/PT-Offline.svg" alt='123' />}
            <label className='d-block'>{schema.title}</label>
            <select className='px-3 py-2 rounded select-basic' value={value} onChange={(event) => onChange(event.target.value)} >
                {options.enumOptions.map((item: any, index: number) => {
                    return <option key={index} value={item.value}>{item.value}</option>
                })}
            </select>
        </div>
    }


    const CustomNumberRestDay = ({ label, onChange, value }: any) => {
        const arrayOption = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']

        return <div className='text-center text-black py-3' style={{ border: '1px solid black', borderRadius: '5px', boxShadow: '0px 7px 15px -11px #000000' }}>
            <label className='d-block'>{label}</label>
            <select className='px-3 py-2 rounded select-basic' value={value} onChange={(event) => onChange(event.target.value)} >
                {arrayOption.map((item, index) => {
                    return <option key={index} value={item}>{item}</option>
                })}
            </select>
        </div>
    }


    const customPricingTable = (props: any) => {
        return <div className='text-center mt-3'>
            <p className=' font-weight-bold' style={{ fontSize: '1.5rem' }}>Pricing Plan</p>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Details</th>
                        <th>Monthly</th>
                        <th>Quaterly</th>
                        <th>Half Yearly</th>
                        <th>Yearly</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Offline</td>
                        <td>15 Class</td>
                        <td>36 Class</td>
                        <td>36 Class</td>
                        <td>36 Class</td>
                    </tr>
                    <tr>
                        <td>Online</td>
                        <td>15 Class</td>
                        <td>36 Class</td>
                        <td>36 Class</td>
                        <td>36 Class</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    }


    const uiSchema: any = {
        "discipline": {
            'ui:widget': CustomDiscipline
        },
        "location": {
            "ui:widget": ArrayLocationTemplate
        },
        "title_package": {
            "ui:widget": CustomTextTitlePackage
        },


        "number_training_classes_online": {
            "ui:widget": CustomNumberPeople
        },
        "number_training_classes_offline": {
            "ui:widget": CustomNumberPeople
        },

        "number_of_rests": {
            "ui:widget": CustomNumberRestDay
        },
        "level": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },
        "visiblity": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true
            }
        },
        "mode": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },
        "about": {
            "ui:widget": "textarea",
            "ui:autofocus": true,
            "ui:options": {
                "rows": 3
            }
        },
        "benefits": {
            "ui:widget": "textarea",
            "ui:options": {
                "rows": 3,
            },
        },

        "size": {
            "ui:widget": "radio",
            "ui:options": {
                "inline": true,
            },
        },
        "URL": {
            "ui:placeholder": "http://"
        },



        "number_of_classes": {
            "ui:widget": "select",
        },


        "start_day_after": {
            "ui:widget": 'select',
        },

        "days": {
            "ui:widget": "checkboxes"
        },

        "pricing_plan": {
            "ui:widget": customPricingTable
        },

        "group-schedule": {
            "ui:placeholder": "Number of minutes",
        },
        "custom-schedule": {
            "ui:placeholder": "Number of days",
        },


    }
    let fitnessData: String[] = [];

    function onSubmit(formData: any) {
        setTimeout(() => {
            alert("Values submitted: " + JSON.stringify(formData, null, 2));
        }, 1000);
    }

    if (!loading && !error) {
        fitnessData = data.fitnesspackages;
        console.log('fitnessData', data)
    }

    // // fitnessData = data.fitnesspackages;
    // console.log('fitnessData', data);



    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                <ModalView
                    name="Classic Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={classicSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Custom Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={customSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                />{" "}
                <ModalView
                    name="Group Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSubmit={onSubmit}
                    formSchema={groupSchema}
                    formData={{}}
                />{" "}
                <ModalView
                    name="PT Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={ptSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                    arrProps={arrProps}
                />
            </Card.Title>
            {loading ? <code>Loading...</code> : <CustomTable columns={columns} data={fitnessData} />}
        </TabContent>
    );
}
