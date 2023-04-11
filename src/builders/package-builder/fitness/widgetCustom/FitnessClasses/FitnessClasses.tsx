import React from 'react';
import ClassicClasses from './ClassicClasses';
import CustomClasses from './CustomClasses';
import GroupClasses from './GroupClasses';
import PTClasses from './PTClasses';

const FitnessClasses: React.FC<{
  PTProps: any;
  widgetProps: any;
  actionType: string;
  packageTypeName: string;
  classicProps: any;
  groupProps: any;
  customProps: any;
  userData: any;
}> = (props) => {
  return (
    <div className="text-center text-black py-3 w-50 d-flex justify-content-start align-items-center">
      {props.packageTypeName !== 'custom' ? (
        <div>
          <div className={props.packageTypeName !== 'classic' ? 'd-block' : 'd-none'}>
            {props.packageTypeName === 'personal-training' ? (
              <PTClasses
                packageTypeName={props.packageTypeName}
                actionType={props.actionType}
                PTProps={props.PTProps}
                widgetProps={props.widgetProps}
                userData={props.userData}
              />
            ) : (
              <GroupClasses
                packageTypeName={props.packageTypeName}
                actionType={props.actionType}
                groupProps={props.groupProps}
                widgetProps={props.widgetProps}
                userData={props.userData}
              />
            )}
          </div>

          <div className={props.packageTypeName === 'classic' ? 'd-block' : 'd-none'}>
            <ClassicClasses
              packageTypeName={props.packageTypeName}
              actionType={props.actionType}
              classicProps={props.classicProps}
              widgetProps={props}
            />
          </div>
        </div>
      ) : (
        <div>
          <CustomClasses
            customProps={props.customProps}
            widgetProps={props.widgetProps}
            packageTypeName={props.packageTypeName}
            actionType={props.actionType}
            userData={props.userData}
          />
        </div>
      )}
    </div>
  );
};

export default FitnessClasses;
