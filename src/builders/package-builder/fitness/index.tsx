import { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Badge, Button, Card, Dropdown, OverlayTrigger, Popover, TabContent, Table } from "react-bootstrap";
import ModalView from "../../../components/modal";
import CustomTable from "../../../components/table";
import { Typeahead } from 'react-bootstrap-typeahead'
import { GET_ADDRESS, GET_FITNESS_DISCIPLINES } from "../../../graphQL/queries";
import './fitness.css'
import _ from 'lodash'
import { useRef } from "react";

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

export default function FitnessTab(props) {
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
    const [userData, setUserData] = useState<any>('');
    const [restDay, setRestday] = useState("0");
    const [classSessions, setClassSessions] = useState<number[] | null>(null)
    const restDayRef = useRef(null)



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

    const customTextTitlePackage = () => {
        return <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
            <p className='m-0'>Set for One Month (30 days)</p>
        </div>
    };


    const customNumberClass = ({ options, schema, value, label, onChange }: any) => {
        return <div className='text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
            {label === 'Online' ? <img src="/assets/PT-Online.svg" alt='123' /> : <img src="/assets/PT-Offline.svg" alt='123' />}
            <label className='d-block font-weight-bold mb-0 mr-5'>{schema.title}</label>
            <input
                className="py-2 px-2"
                value={value}
                pattern="[0-9]+"
                onChange={(event: any) => {
                    onChange(event.target.value)
                }}
                type="number"
                min="0"
                max="31"
            />
        </div>
    }


    const customNumberRestDay = ({ label, onChange, value }: any) => {
        return <div className=' text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
            <img src="/assets/rest-icon.svg" alt='123' />
            <label className='d-block font-weight-bold mb-0 mr-3'>{label}</label>
            <input
                className="py-2 px-2"
                value={value}
                // pattern="[0-9]+"
                onChange={(event: any) => {
                    onChange(event.target.value)
                }}
                type="number"
                min="0"
                max="31"
            />
        </div>
    }


    const renderClasses = (numberClass: number) => {
        let arrayNumberClass: number[] = []
        for (let i = 0; i < 4; i++) {
            numberClass *= 2;
            arrayNumberClass.push(numberClass);
        }
        return arrayNumberClass.map((item, index) => {
            return <>
                <td key={index}>{item} Class</td>
            </>
        })

    }

    const renderVoucher = (props: any) => {
        console.log(props)
        return [...Array(4)].map((item, index) => {
            return <td key={index}>
                <select   onChange={(event) => props.onChange(event.target.value)}>
                    <option value='0'></option>
                    <option value='1'>Getfit - 10%</option>
                    <option value='2'>Getfit - 20%</option>
                </select>
            </td>
        })
    }

    const renderClassSessions = (classOnline, classOffline) => {
        let numberClassSessions = classOnline + classOffline;
        const arrNumberClass: number[] = [];
        for (let i = 0; i < 4; i++) {
            numberClassSessions *= 2;
            arrNumberClass.push(numberClassSessions);
        }
        return arrNumberClass?.map((item, index) => {
            return <td key={index} className='font-weight-bold'>{item} Class</td>
        })
    }

    const renderSuggestedPricing = () => {
        const arrPrice = [2500, 2500, 2500, 2500];
        return arrPrice.map((item, index) => {
            return <td key={index}>Rs {item}</td>
        })
    }

    const renderMRPInput = (props: any) => {
        return [...new Array(4)].map((item, index) => {
            return <td>
                <input placeholder='Enter MRP' value={props.value} onChange={(e) => props.onChange(e.target.value)} />
            </td>
        })
    }



    const customPricingTable = (props: any) => {
        console.log(userData);
        const { number_classes_online, number_classes_offline } = userData
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
                        {number_classes_online !== undefined && number_classes_online !== 0 ?
                            <>
                                <td><img src="/assets/PT-Online.svg" alt='123' />Online</td>
                                {renderClasses(number_classes_online)}
                            </>
                            : ''}
                    </tr>
                    <tr>
                        {number_classes_online !== undefined && number_classes_offline !== 0 ? <>
                            <td><img src="/assets/PT-Offline.svg" alt='123' />Offline</td>
                            {renderClasses(number_classes_offline)}
                        </>
                            : ''}
                    </tr>
                    <tr>
                        <td></td>
                        {renderVoucher(props)}
                    </tr>
                    <tr>
                        <td className='font-weight-bold'>Total Sessions</td>
                        {renderClassSessions(number_classes_online, number_classes_offline)}
                    </tr>
                    <tr>
                        <td>Suggested Pricing</td>
                        {renderSuggestedPricing()}
                    </tr>
                    <tr>
                        <td>Set MRP</td>
                        {renderMRPInput(props)}
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
            "ui:widget": customTextTitlePackage
        },


        "number_classes_online": {
            "ui:widget": customNumberClass
        },
        "number_classes_offline": {
            "ui:widget": customNumberClass
        },

        "number_of_rests": {
            "ui:widget": customNumberRestDay
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
                    setUserData={setUserData}

                />
            </Card.Title>
            {loading ? <code>Loading...</code> : <CustomTable columns={columns} data={fitnessData} />}
        </TabContent>
    );
}
