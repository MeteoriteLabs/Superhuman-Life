import { Breadcrumb } from 'react-bootstrap';
import { NavLink, useLocation } from 'react-router-dom';

type AppProps = {
    mod: string;
    page: string;
};

export default function Bread({ mod, page }: AppProps) {
    const { pathname } = useLocation();

    return (
        <Breadcrumb>
            <NavLink className="breadcrumb-item" to="/home">
                Home
            </NavLink>
            <Breadcrumb.Item active>{mod}</Breadcrumb.Item>
            <Breadcrumb.Item active>{page}</Breadcrumb.Item>
            <NavLink className="breadcrumb-item" to={`${pathname}/add`}>
                Add
            </NavLink>
        </Breadcrumb>
    );
}
