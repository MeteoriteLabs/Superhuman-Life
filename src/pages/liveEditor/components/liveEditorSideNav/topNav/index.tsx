import { Button, Col, Row } from 'react-bootstrap';
import ArrowRight from '../../../../../react-svgs/arrowRight';

import style from './style.module.css';
import ArrowDown from '../../../../../react-svgs/arrowDown';

function TopNav(): JSX.Element {
  return (
    <div className={style.topNav}>
      <Row className="mb-0">
        <Col className="d-flex align-items-center" style={{ gap: '15px' }} xs="5">
          <div style={{ marginBottom: '-15px' }}>
            <ArrowRight width={10} height={8} />
          </div>
          <p className="mb-0">Iron Man Template</p>
        </Col>
        <Col className="d-flex align-items-center" style={{ gap: '10px' }} xs="5">
          <p className="mb-0">Options</p>
          <div style={{ marginBottom: '-15px' }}>
            <ArrowDown width={7} height={7} />
          </div>
        </Col>
        <Col className="d-flex align-items-center" style={{ gap: '10px' }} xs="1">
          <Button variant="outline-light" className="mb-0" style={{ fontSize: 12 }}>
            Preview
          </Button>
          <Button variant="primary" className="mb-0" style={{ fontSize: 12 }}>
            Publish
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default TopNav;
