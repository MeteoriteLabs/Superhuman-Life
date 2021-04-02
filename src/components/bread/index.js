import { Breadcrumb } from "react-bootstrap";
import { NavLink } from "react-router-dom";

export default function Bread({ mod, page }) {
    return (
        <Breadcrumb className="float-right">
            <NavLink className="breadcrumb-item" to="/home">Home</NavLink>
            <Breadcrumb.Item active>{mod}</Breadcrumb.Item>
            <Breadcrumb.Item active>{page}</Breadcrumb.Item>
        </Breadcrumb>
    );
}