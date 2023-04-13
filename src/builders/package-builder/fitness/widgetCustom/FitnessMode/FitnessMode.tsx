import React from 'react';
import PersonaTrainingMode from './PersonaTrainingMode';

const FitnessMode: React.FC<{
  widgetProps: any;
  PTProps: any;
  type: string;
  userData: any;
  actionType: string;
  groupProps: string;
}> = (props) => {
  return (
    <div>
      <div>
        <PersonaTrainingMode
          type={props.type}
          actionType={props.actionType}
          widgetProps={props.widgetProps}
          PTProps={props.PTProps}
          groupProps={props.groupProps}
          userData={props.userData}
        />
      </div>

      <div
        className="text-center font-weight-bold mx-auto w-50 py-3 px-2 mt-5"
        style={{ boxShadow: '0px 7px 15px -5px #000000', borderRadius: '5px' }}>
        <p className="m-0">Set for {props.PTProps.properties.duration.default} days</p>
      </div>
    </div>
  );
};

export default FitnessMode;
