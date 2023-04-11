import React, { useEffect, useRef } from 'react';
import _ from 'lodash';
import { Form } from 'react-bootstrap';
import './MRP.css';

const MRP: React.FC<{
  actionType: string;
  fitnesspackagepricing: any;
  setFitnesspackagepricing: any;
  type: string;
  mode: string;
  widgetProps: any;
  minPrice: any;
  index: any;
  userData: any;
}> = (props) => {
  const numEle =
    props.type === 'Classic Class' ||
    props.mode === 'Online Workout' ||
    props.mode === 'Offline Workout'
      ? 1
      : 4;

  const inputRef = useRef<any>([]);
  const spanRef = useRef<any>([]);

  useEffect(() => {
    inputRef.current = inputRef.current.splice(0, props.fitnesspackagepricing.length);
    spanRef.current = spanRef.current.splice(0, props.fitnesspackagepricing.length);

    let valid = false;
    const updateMRP = _.cloneDeep(props.fitnesspackagepricing);
    let updateIndex = props.index;

    for (let i = 0; i < updateMRP.length; i++) {
      if (updateMRP[i].mrp !== '') {
        const mrp = Number(updateMRP[i].mrp);

        if (mrp > 0 && mrp >= props.minPrice[i]) {
          valid = true;
          inputRef.current[i].className = 'input';
          spanRef.current[i].className = 'd-none';
        } else {
          updateIndex = i;
          inputRef.current[i].className = 'inputError';
          spanRef.current[i].className = 'd-block text-danger';
          valid = false;
          break;
        }
      } else {
        valid = false;
        break;
      }
    }

    if (valid) {
      if (props.widgetProps.rawErrors) {
        props.widgetProps.rawErrors[0] = '';
      }
      props.widgetProps.onChange(123);
      inputRef.current[updateIndex].className = 'input';
      spanRef.current[updateIndex].className = 'd-none';
    } else {
      if (props.widgetProps.rawErrors) {
        props.widgetProps.rawErrors[0] = `MRP can't be empty or less than &#8377; ${
          props.minPrice[props.index]
        }`;
      }
      inputRef.current[updateIndex].className = 'inputError';
      spanRef.current[updateIndex].className = 'd-block text-danger';

      props.widgetProps.onChange(null);
    }
  }, [props.minPrice, props.fitnesspackagepricing]);

  const handleValidationError = (e, index) => {
    let valid = false;
    let updateMRP: any = [];
    if (
      props.mode === 'Online Workout' ||
      props.mode === 'Offline Workout' ||
      props.userData.fitness_package_type === 'Classic Class'
    ) {
      updateMRP = _.cloneDeep(props.fitnesspackagepricing.splice(0, 1));
    } else {
      updateMRP = _.cloneDeep(props.fitnesspackagepricing);
    }

    updateMRP[index].mrp = Number(e.target.value);

    props.setFitnesspackagepricing(updateMRP);

    for (let i = 0; i < updateMRP.length; i++) {
      if (updateMRP[i].mrp !== '') {
        const mrp = Number(updateMRP[i].mrp);
        if (
          (mrp > 0 && Number(updateMRP[i].mrp) >= props.minPrice[i]) ||
          Number(e.target.value) >= props.minPrice[i]
        ) {
          inputRef.current[i].className = 'input';
          spanRef.current[i].className = 'd-none';
          valid = true;
        } else {
          inputRef.current[i].className = 'inputError';
          spanRef.current[i].className = 'd-block text-danger';
          valid = false;
          break;
        }
      } else {
        valid = false;
        break;
      }
    }

    return valid;
  };

  const handleChange = (e, index) => {
    e.preventDefault();

    const valid = handleValidationError(e, index);

    if (valid) {
      if (props.widgetProps.rawErrors) {
        props.widgetProps.rawErrors[0] = '';
      }
      props.widgetProps.onChange(Number(e.target.value));
    } else {
      if (props.widgetProps.rawErrors) {
        props.widgetProps.rawErrors[0] = `MRP can't be empty or less than &#8377; ${props.minPrice[index]}`;
      }

      props.widgetProps.onChange(null);
    }
  };

  return (
    <>
      {[...Array(numEle)].map((item, index) => {
        return (
          <td key={index}>
            <Form.Control
              id={(index + 1).toString()}
              style={{ margin: '0 auto', width: '75%', textAlign: 'center' }}
              ref={(el) => (inputRef.current[index] = el)}
              required
              disabled={props.actionType === 'view' ? true : false}
              value={props.fitnesspackagepricing[index]?.mrp}
              min="0"
              type="number"
              placeholder="Enter MRP"
              onChange={(e) => handleChange(e, index)}
            />

            <span
              ref={(el) => (spanRef.current[index] = el)}
              className="d-none"
              style={{ fontSize: '0.9rem' }}>
              Can{`&apos;`}t be empty or less than &#8377; {props.minPrice[index]}
            </span>
          </td>
        );
      })}
    </>
  );
};

export default MRP;
