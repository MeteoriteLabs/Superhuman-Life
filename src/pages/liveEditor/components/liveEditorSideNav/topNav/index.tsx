import { Button, Col, Row } from 'react-bootstrap';

import style from './style.module.css';
import ArrowDown from '../../../../../components/Icons/componentIcons/arrowDown';
import ArrowRight from '../../../../../components/Icons/componentIcons/arrowRight';

function TopNav(): JSX.Element {
  return (
    <div className={style.topNav}>
      <Row className="mb-0">
        <Col className={style.topNavCol} lg="5" md="5" xs="4">
          <div className={style.svgCont}>
            <ArrowRight width={10} height={8} />
          </div>
          <p className="mb-0">Iron Man</p>
        </Col>
        <Col className={style.topNavCol} lg="5" xs="4">
          <p className="mb-0">Options</p>
          <div className={style.svgCont}>
            <ArrowDown width={7} height={7} />
          </div>
        </Col>
        <Col className={style.topNavCol} xs="1">
          <Button variant="outline-light" className={style.btnCont}>
            Preview
          </Button>
          <Button variant="primary" className={style.btnCont}>
            Publish
          </Button>
        </Col>
      </Row>
    </div>
  );
}

export default TopNav;
