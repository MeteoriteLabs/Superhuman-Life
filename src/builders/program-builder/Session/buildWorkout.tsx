import { useState } from 'react';
import { Accordion, Card } from 'react-bootstrap';
import Chevron from '../search-builder/Chevron';
import Build from './build';

const BuildWorkout = (props: any) => {
    const [active, setActive] = useState(null);

    function toggleAccodian(id) {
        setActive(id);
    }

    const build: any = {};

    function OnChangeWarmUp(e: any) {
        build.warmup = e;
        const objectToString = JSON.stringify(build);
        props.onChange(objectToString);
    }

    function OnChangeMainMovement(e: any) {
        build.mainMovement = e;
        const objectToString = JSON.stringify(build);
        props.onChange(objectToString);
    }

    function OnChangeCoolDown(e: any) {
        build.coolDown = e;
        const objectToString = JSON.stringify(build);
        props.onChange(objectToString);
    }

    return (
        <Accordion defaultActiveKey="">
            <Card>
                <Accordion.Toggle
                    as={Card.Header}
                    eventKey="0"
                    className={`${active}`}
                    onClick={() => toggleAccodian(active === 0 ? null : 0)}
                >
                    Warm up
                    <Chevron
                        className={'accordion__icon float-right ' + (active === 0 ? 'rotate' : '')}
                        width={10}
                        fill={'#777'}
                    />
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="0">
                    <Card.Body>
                        <Build onChange={OnChangeWarmUp} buildId={1} value={props?.value?.warmup} />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle
                    as={Card.Header}
                    eventKey="1"
                    className={`${active}`}
                    onClick={() => toggleAccodian(active === 1 ? null : 1)}
                >
                    Main movement
                    <Chevron
                        className={'accordion__icon float-right ' + (active === 1 ? 'rotate' : '')}
                        width={10}
                        fill={'#777'}
                    />
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="1">
                    <Card.Body>
                        <Build
                            onChange={OnChangeMainMovement}
                            buildId={2}
                            value={props?.value?.mainmovement}
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
            <Card>
                <Accordion.Toggle
                    as={Card.Header}
                    eventKey="2"
                    className={`${active}`}
                    onClick={() => toggleAccodian(active === 2 ? null : 2)}
                >
                    Cool down
                    <Chevron
                        className={'accordion__icon float-right ' + (active === 2 ? 'rotate' : '')}
                        width={10}
                        fill={'#777'}
                    />
                </Accordion.Toggle>
                <Accordion.Collapse eventKey="2">
                    <Card.Body>
                        <Build
                            onChange={OnChangeCoolDown}
                            buildId={3}
                            value={props?.value?.cooldown}
                        />
                    </Card.Body>
                </Accordion.Collapse>
            </Card>
        </Accordion>
    );
};

export default BuildWorkout;
