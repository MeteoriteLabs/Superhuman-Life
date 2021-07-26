import React, {useState, useEffect} from 'react';
import { Table } from 'react-bootstrap';

const Schedular = (props: any) => {

    const [days, setDays] = useState<any[]>([]);
    const [show, setShow] = useState(false)
    const [timeSlots, setTimeSlots] = useState<any[]>([]);
    // var days: any = [];

    const [arr, setArr] = useState<any[]>([]);
    // var arr: any[][] = [];
    
    function handleRenderTable() {
        for(var d=0; d<=props.days; d++){
            for(var h=0; h<=23; h++){
                console.log(typeof(arr[d]));
                if(typeof arr[d] == 'undefined'){
                    arr[d] = [];
                }
                console.log(arr[d]);
                arr[d][h] = {"coldId": d, "title": `Day ${d}`, "rowId": h, "timeSlot": `${h}:00`};
                setArr(arr);
            }
        }
        console.log(arr);
    }

    useEffect(() => {
        handleRenderTable();
        setTimeout(() => {
            setShow(true)
       }, 100)
    }, [show]);
    

    function handleTextChange(col: any, row: any){
        alert("col: " + col + "row: " + row);
        const values = [...days];
        let a = values.find((e) => (e.colId === col && e.rowId === row) );
        console.log(a);
        // a.text = "hello";
        // a.rowId = row;
        // setDays(values);
    }
    // console.log(arr);

    if (!show) return <span style={{ color: 'red' }}>Loading...</span>;
    else return (
        <Table striped bordered responsive>
            <thead>
                <tr>
                    <th></th>
                    {arr.map(val => {
                        return (
                            <th key={val.coldId}>{val[0].title}</th>
                        )
                    })}
                </tr>
            </thead>
            <tbody>
                {arr.splice(0, 1).map(row => {
                    return (
                        row.map(val => {
                            console.log(val);
                        return (
                            <tr key={val.rowId}>
                                <td>{val.timeSlot ? val.timeSlot : null}</td>
                                <td onClick={(e) => console.log(val.colId)}></td>
                            </tr>
                        )
                        })
                    )
                })}
            </tbody>
        </Table>
    );
};
{/* <div data-day={1}></div> */ }
export default Schedular;