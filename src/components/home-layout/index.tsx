import { Col, Container, Row } from "react-bootstrap";
import HomeTopNav from "./header";
import HomeFooter from "./footer";
export default function HomeLayout(props: any) {
    return (
        <>
            <header>
                <Container fluid>
                    <HomeTopNav />
                </Container>
            </header>
            <main className="bg-light min-vh-100 pt-5">
                <Container fluid>
                    <Row>
                        {props.children}
                    </Row>
                </Container>
            </main>
            <footer className="py-2 mt-5">
                <Container fluid>
                    <HomeFooter/>
                </Container>
            </footer>
        </>
    );
}
