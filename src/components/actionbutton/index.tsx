
import { Dropdown } from "react-bootstrap";
import "./button.css";
function ActionButton(props: any) {

    const { status, arrayAction } = props;


    const renderItemAction = () => {
        return (status !== "accepted" && status !== "rejected") ? arrayAction.map((item, index) => {
            return <Dropdown.Item key={index} onClick={item.actionClick}>{item.actionName}</Dropdown.Item>
        }) :
            arrayAction.slice(0, 2).map((item, index) => {
                return <Dropdown.Item key={index} onClick={item}>{item.actionName}</Dropdown.Item>
            })
    }

    return (
        <Dropdown >
            <Dropdown.Toggle id="dropdown-basic" as="button" className="dropDown">
                <i className="fas fa-ellipsis-v"></i>
            </Dropdown.Toggle>

            <Dropdown.Menu>
                {renderItemAction()}
            </Dropdown.Menu>
        </Dropdown>

    )
}

export default ActionButton
