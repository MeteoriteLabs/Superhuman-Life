
import {Dropdown} from "react-bootstrap";
import "./button.css";
function ActionButton(props: any) {

//    const Wrap = ({action1Click}: any) => { return(<div>{action1Click}</div>)}

    // function wrapper(x: any){
    //     return(<div>{x}</div>)
    // }
    // function click() {
    //   return(<Wrap/>);
      
    // }
    // const [show,setShow] = usestate(false);
    return (
       
            <Dropdown >
                        <Dropdown.Toggle  id="dropdown-basic" as="button" className="dropDown">
                        <i className="fas fa-ellipsis-v"></i>
                        </Dropdown.Toggle>

                    <Dropdown.Menu>
                    <Dropdown.Item >{props.action1}</Dropdown.Item>
                    <Dropdown.Item href="#/action-2">{props.action2}</Dropdown.Item>
                    <Dropdown.Item href="#/action-3">{props.action3}</Dropdown.Item>
                    <Dropdown.Item href="#/action-4">{props.action4}</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown> 
        
    )
}

export default ActionButton
