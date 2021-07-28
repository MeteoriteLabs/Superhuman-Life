import React, {useState, useEffect} from 'react';
import { Table, Row, Col } from 'react-bootstrap';

const Schedular = (props: any) => {

    const [show, setShow] = useState(false)
    const [arr, setArr] = useState<any[]>([]);
    
    function handleRenderTable() {
        for(var d=1; d<=props.days; d++){
            for(var h=0; h<=23; h++){
                if(typeof arr[d] == 'undefined'){
                    arr[d] = [];
                }
                // console.log(arr[d]);
                // if(d===5 && h===3){
                //     arr[d][h] = {"title": "event", "color": "green"};
                    
                // }
                // setArr(arr);
            }
        }
    }

    const days: number[] = [];
    function handleDays() {
        for(var i=1; i<=props.days; i++){
            days.push(i);
        }
    }
    handleDays();
    const hours: number[] = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

    useEffect(() => {
        handleRenderTable();
        setTimeout(() => {
            setShow(true)
       }, 100)
    }, [show]);    

    function handleUserInput(d: any, h: any){
        alert("day: " + d + "hour: " + h);
        const values = [...arr];
        values[d][h] = {"title": "event", "color": "crimson", "day": d, "hour": h};
        setArr(values);
    }

    
    console.log(arr);

    if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <Table striped bordered responsive>
            <thead>
                <tr>
                    <th></th>
                    {days.map(val => {
                        return (
                            <th >{`Day ${val}`}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {hours.map(h => {
                    return (<tr>
                        <td>{`${h}:00`}</td>
                        {days.map(d => {
                            return (
                                <td 
                                    data-day={d} 
                                    data-hour={h} 
                                    onClick={(e) => handleUserInput(d, h)}>
                                        <div
                                        style={{ backgroundColor: `${typeof arr[d][h] == 'undefined'? 'none' : arr[d][h].color }`}}>
                                            <Col>
                                                <Row>
                                                    <span>{typeof arr[d][h] == 'undefined' ? null : `Day - ${arr[d][h].day}`}</span>
                                                </Row>
                                                <Row>
                                                    <span>{typeof arr[d][h] == 'undefined'? null : arr[d][h].title}</span>
                                                </Row>
                                            </Col>
                                        </div>
                                </td>
                            )
                        })}
                    </tr>);
                })}
                
            </tbody>
        </Table>
    );
};

// if(!d)
//                             return <td>{arr[d][h].timeSlot ? arr[d][h].timeSlot : null}</td>
// {arr.splice(0, 1).map(row => {
//                     return (
//                         row.map(val => {
//                             console.log(val);
//                         return (
//                             <tr key={val.rowId}>
//                                 <td >{val.timeSlot ? val.timeSlot : null}</td>
//                                 <td onClick={(e) => console.log(val.colId)}></td>
//                             </tr>
//                         )
//                         })
//                     )
//                 })}
{/* <div data-day={1}></div> */ }
export default Schedular;