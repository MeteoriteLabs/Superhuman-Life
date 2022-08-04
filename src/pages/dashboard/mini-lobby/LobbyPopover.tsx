import { Row, Col, Dropdown, Image } from "react-bootstrap";
import { LobbyData } from "./LobbyData";
import { Link } from "react-router-dom";

export const MiniLobbyComponent = () => {
  return (
    <Dropdown>
      <Dropdown.Toggle variant="dark">
        <i className="fas fa-th"></i>
      </Dropdown.Toggle>

      <Dropdown.Menu className="p-0">
        <Dropdown.Item className="p-0 h-100">
          <Row className="m-0 h-100">
            <Col
              className="d-flex justify-content-center align-items-center"
              md={{ span: 12, offset: 0 }}
            >
              <Link to="/lobby">
                <h5>Lobby</h5>
              </Link>
            </Col>
            {LobbyData.map((data) => (
                <Col
                  key={data.id}
                  className="d-flex justify-content-center align-items-center p-2"
                  style={{ background: data.color }}
                  md={{ span: 4, offset: 0 }}
                >
                  <Link to={data.link}>
                    {data.image === null ? " " : <Image fluid src={data.image} />}
                  </Link>
                </Col>
            ))}
          </Row>
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};
