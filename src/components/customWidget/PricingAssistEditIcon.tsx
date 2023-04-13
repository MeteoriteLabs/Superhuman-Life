import React from 'react';

const PricingAssistEditIcon: React.FC<{
  rowData: {
    duration: string;
    id: string;
    modes: string;
    mrp: string;
    packageTypeId: string;
    type: string;
    updatedAt: string;
  };
}> = (props) => {
  let type = '';
  switch (props.rowData.modes) {
    case 'Online': {
      if (props.rowData.type === 'One-On-One') {
        type = 'custompersonal-training-Online.svg';
      } else if (props.rowData.type === 'Group Class') {
        type = 'customgroup-Online.svg';
      } else if (props.rowData.type === 'Classic Class') {
        type = 'customgroup-Online.svg';
      }
      break;
    }

    case 'Offline': {
      if (props.rowData.type === 'One-On-One') {
        type = 'custompersonal-training-Offline.svg';
      } else if (props.rowData.type === 'Group Class') {
        type = 'customgroup-Offline.svg';
      }
      break;
    }
  }
  return (
    <div className="d-flex  align-items-center">
      <p>Type:</p>
      <div className="ml-5">
        <img loading="lazy" src={`./assets/${type}`} alt={props.rowData.type} />
      </div>
    </div>
  );
};

export default PricingAssistEditIcon;
