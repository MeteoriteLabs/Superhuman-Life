import {Container, Row, Col} from "react-bootstrap";
import { ImageCaptions } from "./dashboard-data/data";
import {Link} from 'react-router-dom'

export default function MainLobby() {
    return (
        <>
        <Container fluid >
            <Row className="vh-100">
                {ImageCaptions.map((data) => ( 
                    <Col sm key={data.id} className="d-flex justify-content-center align-items-center" style={{background: `${data.color}`}}>
                        <Link to={data.link}>
                            <img style={{width: data.imageWidth}} src={data.image} alt=""/>
                        </Link>
                    </Col>               
                ))}   
            </Row>
                
        </Container>
        </>
    )
}
