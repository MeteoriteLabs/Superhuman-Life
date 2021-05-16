import { Col, Container, Row } from "react-bootstrap";
import SideNav from "./side";
import TopNav from "./top";

export default function Layout({ token, children }: any) {
  return (
    <>
      <header>
        <TopNav token={token} />
      </header>
      <main className="bg-light min-vh-100 py-4">
        <Container fluid>
          {token ?
            <Row>
              <Col xs lg="2" className="d-none d-lg-block">
                <SideNav />
              </Col>
              <Col xs lg="10">
                {children}
              </Col>
            </Row> :
            <>{children}</>
          }
        </Container>
      </main>
      <footer className="float-right py-2">
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
