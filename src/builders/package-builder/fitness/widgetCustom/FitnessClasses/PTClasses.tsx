import React, { useEffect } from 'react';
import { useRef } from 'react';
import { Form } from 'react-bootstrap';

interface Properties {
    ptonlineClasses: any;
    ptofflineClasses: any;
    restDay: any;
    duration: any;
}

interface Props {
    widgetProps: any;
    packageTypeName: any;
    PTProps: Properties;
    actionType: any;
    userData: any;
}

const PTClasses: React.FC<Props> = (props) => {
    const dayAvailableRef = useRef<any>(null);

    useEffect(() => {
        if (props.userData.ptonline) {
            props.PTProps.ptonlineClasses.value = props.userData.ptonline;
        }

        if (props.userData.ptoffline) {
            props.PTProps.ptofflineClasses.value = props.userData.ptoffline;
        }
        if (props.userData.restdays) {
            props.PTProps.restDay.value = props.userData.restdays;
        }
    });

    const showErrorMessage = (e: { target: { value: string } }) => {
        if (dayAvailableRef.current < 0) {
            props.widgetProps.schema.maximum = 0;
            if (props.widgetProps.rawErrors) {
                props.widgetProps.rawErrors[0] = `should be less than ${
                    parseInt(e.target.value) - dayAvailableRef.current * -1
                }`;
            }
        } else if (dayAvailableRef.current >= 0) {
            props.widgetProps.schema.maximum = 30;
            if (props.widgetProps.rawErrors) {
                props.widgetProps.rawErrors[0] = '';
            }
        }
    };

    // for Workout
    const handleValidationForOneDay = (e: { target: { value: string } }) => {
        if (props.widgetProps.label === 'Online') {
            props.PTProps.ptonlineClasses.value = parseInt(e.target.value);
            props.PTProps.restDay.maximum = 0;
            props.PTProps.ptonlineClasses.value = 0;

            dayAvailableRef.current = props.PTProps.duration.value - parseInt(e.target.value);

            if (dayAvailableRef.current < 0) {
                props.widgetProps.schema.maximum = 0;
                if (props.widgetProps.rawErrors) {
                    props.widgetProps.rawErrors[0] = `should be <= ${
                        parseInt(e.target.value) - dayAvailableRef.current * -1
                    }`;
                }
            } else if (dayAvailableRef.current === 0) {
                props.widgetProps.schema.maximum = 1;
                if (props.widgetProps.rawErrors) {
                    props.widgetProps.rawErrors[0] = '';
                }
            } else if (dayAvailableRef.current >= 0) {
                props.widgetProps.schema.maximum = -1;
                if (props.widgetProps.rawErrors) {
                    props.widgetProps.rawErrors[0] = `should be = 1`;
                }
            }
        } else if (props.widgetProps.label === 'Offline') {
            props.PTProps.ptonlineClasses.value = parseInt(e.target.value);
            props.PTProps.restDay.maximum = 0;
            props.PTProps.ptofflineClasses.value = 0;

            dayAvailableRef.current = props.PTProps.duration.value - parseInt(e.target.value);

            if (dayAvailableRef.current < 0) {
                props.widgetProps.schema.maximum = 0;
                if (props.widgetProps.rawErrors) {
                    props.widgetProps.rawErrors[0] = `should be <= ${
                        parseInt(e.target.value) - dayAvailableRef.current * -1
                    }`;
                }
            } else if (dayAvailableRef.current === 0) {
                props.widgetProps.schema.maximum = 1;
                if (props.widgetProps.rawErrors) {
                    props.widgetProps.rawErrors[0] = '';
                }
            } else if (dayAvailableRef.current >= 0) {
                props.widgetProps.schema.maximum = -1;
                if (props.widgetProps.rawErrors) {
                    props.widgetProps.rawErrors[0] = `should be = 1`;
                }
            }
        }
    };

    const handleValidationFor30Day = (e: { target: any }, widgetProps: { label: string }) => {
        // online
        if (widgetProps.label === 'Online') {
            props.PTProps.ptonlineClasses.value = parseInt(e.target.value);

            dayAvailableRef.current -=
                parseInt(e.target.value) +
                props.PTProps.ptofflineClasses.value +
                props.PTProps.restDay.value;

            // error message
            showErrorMessage(e);

            // offline
        } else if (widgetProps.label === 'Offline') {
            props.PTProps.ptofflineClasses.value = parseInt(e.target.value);

            dayAvailableRef.current -=
                parseInt(e.target.value) +
                props.PTProps.ptonlineClasses.value +
                props.PTProps.restDay.value;
            // widgetProps.schema.maximum = 0

            // error message
            showErrorMessage(e);
        }
    };

    const handleValidation = (e: { target: any }) => {
        dayAvailableRef.current = props.PTProps.duration.value;
        if (props.PTProps.duration.value === 30) {
            handleValidationFor30Day(e, props.widgetProps);
        } else if (props.PTProps.duration.value === 1) {
            handleValidationForOneDay(e);
        }
    };

    const handleChange = (
        e: { target: { value: string } },
        widgetProps: { onChange: (arg0: number) => void }
    ) => {
        handleValidation(e);
        widgetProps.onChange(parseInt(e.target.value));
    };

    return (
        <div className="d-flex justify-content-center aligns-items-center">
            {props.widgetProps.schema.title === 'Online' ? (
                <img
                    src={`/assets/${props.packageTypeName}-online.svg`}
                    alt={props.packageTypeName}
                    title={`${props.packageTypeName} online`}
                />
            ) : (
                <img
                    src={`/assets/${props.packageTypeName}-offline.svg`}
                    alt="123"
                    title={`${props.packageTypeName} offline`}
                />
            )}

            <Form.Control
                className="text-center"
                width="100%"
                disabled={props.actionType === 'view' ? true : false}
                value={props.widgetProps.value && props.widgetProps.value}
                ref={dayAvailableRef}
                pattern="[0-9]+"
                onChange={(e: { target: { value: string } }) => handleChange(e, props.widgetProps)}
                type="number"
                min="0"
                max="30"
            />

            {props.userData.duration.value === 1 ? (
                <div className="ml-3 mt-1">
                    <i style={{ color: 'gray', fontSize: '0.9rem' }}>
                        *** This field can only set to be 1
                    </i>
                </div>
            ) : (
                ''
            )}
        </div>
    );
};

export default PTClasses;
