import { useMemo, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { Badge, Button, Card, Dropdown, OverlayTrigger, Popover, TabContent,Form, Row, Col, DropdownButton } from "react-bootstrap";
import ModalView from "../../../components/modal";
import Table from "../../../components/table";
import { GET_FITNESS } from "../../../graphql/queries";
import './fitness.css'
import { Typeahead } from 'react-bootstrap-typeahead'





// const GET_FITNESS = gql`{
//     fitnesspackages {
//       packagename
//       intropicture {
//         url
//       }
//       packagetypes
//       ptoffline
//       ptonline
//       groupoffline
//       grouponline
//       recordedclasses
//       discipline {
//         disciplinename
//       }
//       fitnesspackagepricing {
//         packagepricing
//       }
//       duration
//     }
//   }
//   `;

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
    const [multiSelections, setMultiSelections] = useState([]);
    const [singleSelections, setSingleSelections] = useState([]);


    const address = [
        {
            id: '1',
            address: "303535 libiadren LasVegas"
        },
        {
            id: '2',
            address: "22425 Buffollo Los Angles"
        },
        {
            id: '3',
            address: "Client Location"
        },
    ]

    const CustomDiscipline =(props:any)=>{
        console.log(props.options.enumOptions);
        return <div>
            <label>{props.label}</label>
            <Typeahead 
            options={props.options.enumOptions} 
            placeholder="Choose your discpline ... "
            id="basic-typeahead-multiple" selected={multiSelections} onChange={setMultiSelections} multiple/>
        </div>
    }

    const ArrayLocationTemplate = (props: any) => {
        return <div>
            <label>{props.label}</label>
            {address.map((item, index) => {
                return <div key={index}>
                    <label className='ml-3'>
                        <input type="radio" id={item.id} name='address' value={item.address} onChange={(event) => props.onChange(event.target.value)} />
                        {item.address}
                    </label>
                </div>
            })}
        </div>
    };

    const CustomTextTitlePackage = () => {
        return <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
            <p className='m-0'>Set for One Month (30 days)</p>
        </div>
    };

    const CustomNumberPeople = (props: any) => {
        const { options,schema } = props;
        return <div className='text-center text-black py-3' style={{ border: '1px solid black', borderRadius: '5px', boxShadow: '0px 7px 15px -11px #000000' }}>
            <label className='d-block'>{schema.title}</label>
            <select className='px-3 py-2 rounded select-basic' value={props.value} onChange={(event) => props.onChange(event.target.value)} >
                {options.enumOptions.map((item: any, index: number) => {
                    return <option key={index} value={item.value}>{item.value}</option>
                })}
            </select>
        </div>
    }




    const CustomNumberRestDay = (props: any) => {
        const arrayOption = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
        const { label } = props
        return <div className='text-center text-black py-3' style={{ border: '1px solid black', borderRadius: '5px', boxShadow: '0px 7px 15px -11px #000000' }}>
            <label className='d-block'>{label}</label>
            <select className='px-3 py-2 rounded select-basic' value={props.value} onChange={(event) => props.onChange(event.target.value)} >
                {arrayOption.map((item, index) => {
                    return <option key={index} value={item}>{item}</option>
                })}
            </select>
        </div>
    }




    const uiSchema: any = {
        "discipline":{
            'ui:widget':CustomDiscipline
        },
        "location": {
            "ui:widget": ArrayLocationTemplate
        },
        "title_package": {
            "ui:widget": CustomTextTitlePackage
        },
 

        "number_training_classes_online":{
            "ui:widget": CustomNumberPeople
        },
        "number_training_classes_offline":{
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

    // fitnessData = data.fitnesspackages;
    console.log('fitnessData', data);



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
    
                />
            </Card.Title>
            {loading ? <code>Loading...</code> : <Table columns={columns} data={fitnessData} />}
        </TabContent>
    );
}
