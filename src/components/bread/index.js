import { Breadcrumb } from "react-bootstrap";
import { NavLink, useLocation } from "react-router-dom";

export default function Bread({ mod, page }) {
    const { pathname } = useLocation();

    return (
        <Breadcrumb>
            <NavLink className="breadcrumb-item" to="/home">Home</NavLink>
            <Breadcrumb.Item active>{mod}</Breadcrumb.Item>
            <Breadcrumb.Item active>{page}</Breadcrumb.Item>
            <NavLink className="breadcrumb-item" to={`${pathname}/add`}>Add</NavLink>
        </Breadcrumb>
    );
}