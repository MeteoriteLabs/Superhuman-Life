import { useEffect } from "react";
import { useRef } from "react";
import { Form } from "react-bootstrap";

export default function PTClasses({
  widgetProps,
  packageTypeName,
  PTProps: { properties },
  actionType,
  userData,
}) {
  const dayAvailableRef = useRef<any>(null);
  const { ptonlineClasses, ptofflineClasses, restDay, duration } = properties;

  useEffect(() => {
    if (userData.ptonline) {
      ptonlineClasses.value = userData.ptonline;
    }

    if (userData.ptoffline) {
      ptofflineClasses.value = userData.ptoffline;
    }
    if (userData.restdays) {
      restDay.value = userData.restdays;
    }
  });

  const showErrorMessage = (e: { target: { value: string } }) => {
    if (dayAvailableRef.current < 0) {
      widgetProps.schema.maximum = 0;
      if (widgetProps.rawErrors) {
        widgetProps.rawErrors[0] = `should be less than ${
          parseInt(e.target.value) - dayAvailableRef.current * -1
        }`;
      }
    } else if (dayAvailableRef.current >= 0) {
      widgetProps.schema.maximum = 30;
      if (widgetProps.rawErrors) {
        widgetProps.rawErrors[0] = "";
      }
    }
  };

  // for Workout
  const handleValidationForOneDay = (e: { target: { value: string } }) => {
    if (widgetProps.label === "Online") {
      ptonlineClasses.value = parseInt(e.target.value);
      restDay.maximum = 0;
      ptonlineClasses.value = 0;

      dayAvailableRef.current = duration.value - parseInt(e.target.value);

      if (dayAvailableRef.current < 0) {
        widgetProps.schema.maximum = 0;
        if (widgetProps.rawErrors) {
          widgetProps.rawErrors[0] = `should be <= ${
            parseInt(e.target.value) - dayAvailableRef.current * -1
          }`;
        }
      } else if (dayAvailableRef.current === 0) {
        widgetProps.schema.maximum = 1;
        if (widgetProps.rawErrors) {
          widgetProps.rawErrors[0] = "";
        }
      } else if (dayAvailableRef.current >= 0) {
        widgetProps.schema.maximum = -1;
        if (widgetProps.rawErrors) {
          widgetProps.rawErrors[0] = `should be = 1`;
        }
      }
    } else if (widgetProps.label === "Offline") {
      ptonlineClasses.value = parseInt(e.target.value);
      restDay.maximum = 0;
      ptofflineClasses.value = 0;

      dayAvailableRef.current = duration.value - parseInt(e.target.value);

      if (dayAvailableRef.current < 0) {
        widgetProps.schema.maximum = 0;
        if (widgetProps.rawErrors) {
          widgetProps.rawErrors[0] = `should be <= ${
            parseInt(e.target.value) - dayAvailableRef.current * -1
          }`;
        }
      } else if (dayAvailableRef.current === 0) {
        widgetProps.schema.maximum = 1;
        if (widgetProps.rawErrors) {
          widgetProps.rawErrors[0] = "";
        }
      } else if (dayAvailableRef.current >= 0) {
        widgetProps.schema.maximum = -1;
        if (widgetProps.rawErrors) {
          widgetProps.rawErrors[0] = `should be = 1`;
        }
      }
    }
  };

  const handleValidationFor30Day = (
    e: { target: any },
    widgetProps: { label: string }
  ) => {
    // online
    if (widgetProps.label === "Online") {
      ptonlineClasses.value = parseInt(e.target.value);

      dayAvailableRef.current -=
        parseInt(e.target.value) + ptofflineClasses.value + restDay.value;

      // error message
      showErrorMessage(e);

      // offline
    } else if (widgetProps.label === "Offline") {
      ptofflineClasses.value = parseInt(e.target.value);

      dayAvailableRef.current -=
        parseInt(e.target.value) + ptonlineClasses.value + restDay.value;
      // widgetProps.schema.maximum = 0

      // error message
      showErrorMessage(e);
    }
  };

  const handleValidation = (e: { target: any }) => {
    dayAvailableRef.current = duration.value;
    if (duration.value === 30) {
      handleValidationFor30Day(e, widgetProps);
    } else if (duration.value === 1) {
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
      {widgetProps.schema.title === "Online" ? (
        <img
          src={`/assets/${packageTypeName}-online.svg`}
          alt={packageTypeName}
          title={`${packageTypeName} online`}
        />
      ) : (
        <img
          src={`/assets/${packageTypeName}-offline.svg`}
          alt="123"
          title={`${packageTypeName} offline`}
        />
      )}

      <Form.Control
        className="text-center"
        width="100%"
        disabled={actionType === "view" ? true : false}
        value={widgetProps.value && widgetProps.value}
        ref={dayAvailableRef}
        pattern="[0-9]+"
        onChange={(e: { target: { value: string } }) =>
          handleChange(e, widgetProps)
        }
        type="number"
        min="0"
        max="30"
      />

      {duration.value === 1 ? (
        <div className="ml-3 mt-1">
          <i style={{ color: "gray", fontSize: "0.9rem" }}>
            *** This field can only set to be 1
          </i>
        </div>
      ) : (
        ""
      )}
    </div>
  );
}
