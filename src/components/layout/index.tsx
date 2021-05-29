import { useState } from "react";
import { Col, Row } from "react-bootstrap";
import { SideNav } from "./side";
import { AuthenticatedNav, UnauthenticatedNav } from "./top";

export default function Layout({ token, children }: any) {
  const [collapse, setCollapse] = useState<boolean>(false);

  return (
    <>
      <header>
        {token ? <AuthenticatedNav /> : <UnauthenticatedNav />}
      </header>
      <main>
        {token ?
          <Row noGutters className="bg-light">
            <Col lg={collapse ? "1" : "2"} className="d-none d-lg-block">
              <SideNav collapse={collapse} setCollapse={setCollapse} />
            </Col>
            <Col lg={collapse ? "11" : "10"} className="px-4 py-2">
              {children}
            </Col>
          </Row> :
          <>{children}</>
        }
      </main>
      {/* <footer className="float-right p-2">
        <p className="text-muted">
          2021 ©{" "}
          <a href="https://sapien.systems/" target="_blank" rel="noreferrer">
            Sapien
            </a>{" "}
            - Partner Dashboard
          </p>
      </footer> */}
    </>
  );
}
