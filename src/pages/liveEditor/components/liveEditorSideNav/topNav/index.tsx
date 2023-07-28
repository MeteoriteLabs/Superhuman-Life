import { Button, Col, Row } from 'react-bootstrap';

import style from './style.module.css';
import ArrowDown from '../../../../../components/Icons/componentIcons/arrowDown';
import ArrowRight from '../../../../../components/Icons/componentIcons/arrowRight';
import { useContext } from 'react';
import { ChangeMakerWebsiteContext } from '../../../../../context/changemakerWebsite-context';
import { Link } from 'react-router-dom';

function TopNav(): JSX.Element {
    const { changemakerWebsiteState } = useContext(ChangeMakerWebsiteContext);
    return (
        <div className={style.top_nav}>
            <Row className="mb-0">
                <Col lg="5" md="5" xs="4">
                    <Link to="/website" className={style.top_nav_col}>
                        <div className={style.svg_cont}>
                            <ArrowRight width={10} height={8} />
                        </div>
                        <p className="mb-0">{changemakerWebsiteState.selectedTemplate}</p>
                    </Link>
                </Col>

                <Col className={style.top_nav_col} lg="5" xs="4">
                    <p className="mb-0">Options</p>
                    <div className={style.svg_cont}>
                        <ArrowDown width={7} height={7} />
                    </div>
                </Col>
                <Col className={style.top_nav_col} xs="1">
                    <Button variant="outline-light" className={style.btn_cont}>
                        Preview
                    </Button>
                    <Button variant="light" className={style.btn_cont}>
                        Publish
                    </Button>
                </Col>
            </Row>
        </div>
    );
}

export default TopNav;
