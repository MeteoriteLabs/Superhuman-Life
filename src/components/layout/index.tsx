import { Col, Container, Row } from "react-bootstrap";
import SideNav from "./side";
import TopNav from "./top";

export default function Layout(props: any) {
  return (
    <>
      <header>
        <TopNav />
      </header>
      <main className="bg-light min-vh-100 py-4">
        <Container fluid>
          <Row>
            <Col xs lg="2" className="d-none d-lg-block">
              <SideNav />
            </Col>
            <Col xs lg="10">
              {props.children}
            </Col>
          </Row>
        </Container>
      </main>
      <footer className="py-2 mt-5 float-right">
        <Container>
          <p className="text-muted">
            2021 ©{" "}
            <a href="https://sapien.systems/" target="_blank" rel="noreferrer">
              Sapien
            </a>{" "}
            - Partner Dashboard
          </p>
        </Container>
      </footer>
    </>
  );
}
