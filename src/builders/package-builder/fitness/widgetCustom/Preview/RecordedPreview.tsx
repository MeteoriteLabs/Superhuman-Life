import React from 'react';

const RecordedPreview: React.FC<{ packageType: string; recordedclasses: any }> = (props) => {
  return (
    <div className="px-4" style={{ borderRight: '1px solid black' }}>
      <img
        src={`/assets/${props.packageType}.svg`}
        alt={`${props.packageType}`}
        title={`${props.packageType}`}
      />
      <p>{props.recordedclasses}</p>
    </div>
  );
};

export default RecordedPreview;
