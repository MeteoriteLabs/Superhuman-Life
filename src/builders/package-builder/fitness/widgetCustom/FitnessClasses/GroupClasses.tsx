import React, { useRef, useEffect } from 'react';
import { Form } from 'react-bootstrap';

interface Properties {
  grouponlineClasses: any;
  groupofflineClasses: any;
  restDay: any;
  duration: any;
}

const GroupClasses: React.FC<{
  widgetProps: any;
  packageTypeName: string;
  groupProps: Properties;
  actionType: string;
  userData: any;
}> = (props) => {
  const dayAvailableRef = useRef<any>(null);

  useEffect(() => {
    if (props.userData.grouponline) {
      props.groupProps.grouponlineClasses.value = props.userData.grouponline;
    }

    if (props.userData.groupoffline) {
      props.groupProps.groupofflineClasses.value = props.userData.groupoffline;
    }
    if (props.userData.restDay) {
      props.groupProps.restDay.value = props.userData.restdays;
    }
  });

  const showErrorMessage = (e: { target: any }) => {
    if (dayAvailableRef.current < 0) {
      props.widgetProps.schema.maximum = 0;
      if (props.widgetProps.rawErrors) {
        props.widgetProps.rawErrors[0] = `should be <= ${
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

  const handleValidationFor30Day = (
    e: { target: any },
    widgetProps: { onChange?: (arg0: number) => void; label?: any }
  ) => {
    // online
    if (widgetProps.label === 'Online') {
      props.groupProps.grouponlineClasses.value = parseInt(e.target.value);

      dayAvailableRef.current -=
        parseInt(e.target.value) +
        props.groupProps.groupofflineClasses.value +
        props.groupProps.restDay.value;

      // error message
      showErrorMessage(e);

      // offline
    } else if (widgetProps.label === 'Offline') {
      props.groupProps.groupofflineClasses.value = parseInt(e.target.value);

      dayAvailableRef.current -=
        parseInt(e.target.value) +
        props.groupProps.grouponlineClasses.value +
        props.groupProps.restDay.value;

      // error message
      showErrorMessage(e);
    }
  };

  const handleValidation = (
    e: { target: any },
    widgetProps: { onChange: (arg0: number) => void }
  ) => {
    dayAvailableRef.current = props.groupProps.duration.value;
    handleValidationFor30Day(e, widgetProps);
  };

  const handleChange = (e: { target: any }, widgetProps: { onChange: (arg0: number) => void }) => {
    handleValidation(e, widgetProps);
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
        disabled={props.actionType === 'view' ? true : false}
        value={props.widgetProps.value && props.widgetProps.value}
        ref={dayAvailableRef}
        pattern="[0-9]+"
        onChange={(e: { target: { value: string } }) => handleChange(e, props.widgetProps)}
        type="number"
        min="0"
        max="30"
      />
    </div>
  );
};

export default GroupClasses;
