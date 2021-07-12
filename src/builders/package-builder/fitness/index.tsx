import { useMemo, useState, useContext } from "react";
import { gql, useQuery } from "@apollo/client";
import { Badge, Button, Card, Dropdown, OverlayTrigger, Popover, TabContent, Table} from "react-bootstrap";
import ModalView from "../../../components/modal";
import CustomTable from "../../../components/table";
import { Typeahead } from 'react-bootstrap-typeahead'
import { GET_ADDRESS, GET_FITNESS_DISCIPLINES } from "../../../graphQL/queries";
import AuthContext from "../../../context/auth-context";
import './fitness.css'
import _ from 'lodash'
import ModalCustomClasses from "./ModalCustom/ModalCustomClasses";
import ModalCustomRestday from "./ModalCustom/ModalCustomRestday";
import ModalPreview from "./ModalCustom/ModalPreview";




export default function FitnessTab(props) {
    const auth = useContext(AuthContext);
    // console.log({auth})
    const GET_FITNESS = gql`
    query fitnesspackages($id:String){
        fitnesspackages(sort:"updateAt", where: { users_permissions_user: { id: $id}})
        {
            packagename
            ptoffline
            ptonline
            groupoffline
            grouponline
            recordedclasses
            users_permissions_user{
                id
            }
            discipline{
                disciplinename
           }
           fitnesspackagepricing{
             packagepricing
           }
           duration
         }
        }
      
  
  `;

    // function FetchData(_variables: {} = { id: auth.userid }) {
    //     useQuery(GET_FITNESS, { variables: _variables, onCompleted: loadData })
    // }
    // FetchData({ id: auth.userid });



    // const loadData = (data: any) => {
    //     console.log('fitnessData', data);
    // }



    // // fitnessData = data.fitnesspackages;
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

    const { loading, error, data } = useQuery(GET_FITNESS, {
        variables: { id: auth.userid }
    });

    let fitnessData: String[] = [];
    if (!loading && !error) {
        fitnessData = data.fitnesspackages;
        console.log('fitnessData', data)
    }

    const [userData, setUserData] = useState<any>('');
    const [arrPrice, setArrPrice] = useState<any>({
        arrPlan: [
            {
                duration: 30,
                voucher: "",
                mrp: "",
            },
            {
                duration: 90,
                voucher: "",
                mrp: "",
            },
            {
                duration: 180,
                voucher: "",
                mrp: "",
            },
            {
                duration: 360,
                voucher: "",
                mrp: "",
            },
        ]
    })


    const classicSchema: any = require("./classic.json");
    const customSchema: any = require("./custom.json");
    const groupSchema: any = require("./group.json");
    const ptSchema: any = require("./pt.json");
    // const [multiSelections, setMultiSelections] = useState([]);



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
                    onChange={(e) => { props.onChange(JSON.stringify(e)) }}
                    multiple />
            </div>
        }
    }



    const ArrayLocationTemplate = ({ onChange, label }: any) => {
        const { data, loading, error } = useQuery(GET_ADDRESS);
        if (loading) return <p>...loading</p>
        if (!loading && !error) {
            return <div>
                <label>{label}</label>
                {data.addresses?.map((item: any, index: any) => {
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

    const customTextTitlePackage = ({ schema }: any) => {
        return <div className='text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5' style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
            <p className='m-0'>Set for One Month ({schema.duration} days)</p>
        </div>
    };


    const renderClasses = (numberClass: number) => {
        let arrayNumberClass: number[] = []
        arrayNumberClass[0] = numberClass
        for (let i = 1; i < 4; i++) {
            i === 1 ? numberClass *= 3 : numberClass *= 2;
            arrayNumberClass.push(numberClass);
        }
        return arrayNumberClass.map((item, index) => {
            return <>
                <td key={index}>{item} Class</td>
            </>
        })

    }


    const renderVoucher = () => {
        return [...Array(4)].map((item, index: number) => {
            let updateVouhcer = { ...arrPrice.arrPlan[index].voucher }
            return <td key={index}><select
                onChange={(e) => {
                    updateVouhcer = e.target.value;
                    arrPrice.arrPlan[index].voucher = updateVouhcer;
                    setArrPrice(arrPrice)
                }}
            >
                <option value='0'>Choose voucher</option>
                <option value='10%'>Getfit - 10%</option>
                <option value='20%'>Getfit - 20%</option>
            </select></td>
        })
    }

    const renderClassSessions = (classOnline: number, classOffline: number) => {
        let numberClassSessions = 0;
        console.log("classOnline", classOnline, "classOffline", classOffline)
        let arrNumberClass: number[] = [];
        if ((classOnline && classOffline) || classOnline !== 0 || classOffline !== 0) {
            numberClassSessions = classOnline + classOffline;
        }
        arrNumberClass[0] = numberClassSessions
        for (let i = 1; i < 4; i++) {
            i === 1 ? numberClassSessions *= 3 : numberClassSessions *= 2;
            arrNumberClass.push(numberClassSessions);
        }
        return arrNumberClass.map((item, index) => {
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
            let updateMRP = { ...arrPrice.arrPlan[index].mrp }
            return <td key={index}>
                <input
                    className='w-75'
                    min="0"
                    max="6000"
                    type="number"
                    placeholder='Enter MRP'
                    onChange={(e) => {
                        updateMRP = e.target.value;
                        arrPrice.arrPlan[index].mrp = parseInt(updateMRP)
                        setArrPrice(arrPrice)
                    }} /></td>
        })
    }



    const customPricingTable = (props: any) => {
        // console.log("userData", userData)
        let { number_classes_online, number_classes_offline, mode } = userData
        if (mode === "Online" && number_classes_offline > 0) {
            number_classes_offline = 0;
            setUserData({ ...userData, number_classes_offline })
        } else if (mode === "Offline" && number_classes_online > 0) {
            number_classes_online = 0
            setUserData({ ...userData, number_classes_online })
        }
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
                        {number_classes_online !== undefined && number_classes_online !== 0 &&
                            <>
                                <td><img src="/assets/PT-Online.svg" alt='123' />Online</td>
                                {renderClasses(number_classes_online)}
                            </>
                        }
                    </tr>
                    <tr>
                        {number_classes_offline !== undefined && number_classes_offline !== 0 &&
                            <>
                                <td><img src="/assets/PT-Offline.svg" alt='123' />Offline</td>
                                {renderClasses(number_classes_offline)}
                            </>
                        }
                    </tr>
                    <tr>
                        <td></td>
                        {renderVoucher()}
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


    const widgets = {
        ModalCustomClasses,
        ModalCustomRestday
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
            "ui:widget": (props) => <ModalCustomClasses PTProps={ptSchema[3]} props={props} />
      
            // "ui:widget": ModalCustomClasses
        },
        "number_classes_offline": {
            "ui:widget": (props) =>  <ModalCustomClasses PTProps={ptSchema[3]} props={props} />
          
        },

        "number_of_rests": {
            "ui:widget": (props: any) => <ModalCustomRestday PTProps={ptSchema[3]} props={props} />
       
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
                "inline": true
            }
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

        "carousel": {
            "ui:widget": () =><ModalPreview userData={userData} arrPrice={arrPrice.arrPlan}/>
        },
    }


    function onSubmit(formData: any) {
        // setTimeout(() => {
        //     alert("Values submitted: " + JSON.stringify(formData, null, 2));
        // }, 1000);
    }



    // console.log('userData', userData);


    return (
        <TabContent>
            <hr />
            <Card.Title className="text-center">
                {/* <ModalView
                    name="Classic Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={classicSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                    widgets={{}}
                />{" "}
                <ModalView
                    name="Custom Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={customSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                    widgets={{}}
                />{" "}
                <ModalView
                    name="Group Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={groupSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                    setUserData={setUserData}
                    arrPlan={arrPrice.arrPlan}
                    widgets={{}}
                />{" "} */}
                <ModalView
                    name="PT Package"
                    isStepper={true}
                    isPreview={true}
                    formUISchema={uiSchema}
                    formSchema={ptSchema}
                    formSubmit={onSubmit}
                    formData={{}}
                    userData={userData}
                    setUserData={setUserData}
                    arrPlan={arrPrice.arrPlan}
                    widgets={widgets}

                />
            </Card.Title>
            {loading ? <code>Loading...</code> : <CustomTable columns={columns} data={fitnessData} />}
        </TabContent>
    );
}
