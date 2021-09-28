
import {Dropdown} from "react-bootstrap";
import "./button.css";
function ActionButton(props: any) {
    return (
       
            <Dropdown >
                        <Dropdown.Toggle  id="dropdown-basic" as="button" className="dropDown">
                        <i className="fas fa-ellipsis-v"></i>
                        </Dropdown.Toggle>

                    <Dropdown.Menu>
                    <Dropdown.Item onClick={props.actionClick1}>{props.action1}</Dropdown.Item>
                    <Dropdown.Item onClick={props.actionClick2}>{props.action2}</Dropdown.Item>
                    <Dropdown.Item onClick={props.actionClick3}>{props.action3}</Dropdown.Item>
                    <Dropdown.Item onClick={props.actionClick4}>{props.action4}</Dropdown.Item>
                    <Dropdown.Item onClick={props.actionClick5}>{props.action5}</Dropdown.Item>
                    </Dropdown.Menu>
                    </Dropdown> 
        
    )
}

export default ActionButton
