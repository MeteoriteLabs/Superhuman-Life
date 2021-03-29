import { Breadcrumb } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Bread() {
    return (
        <Breadcrumb>
            <NavLink className="breadcrumb-item" to="/home">Home</NavLink>
            <Breadcrumb.Item active>Resources</Breadcrumb.Item>
            <Breadcrumb.Item active>Fitness</Breadcrumb.Item>
        </Breadcrumb>
    );
}