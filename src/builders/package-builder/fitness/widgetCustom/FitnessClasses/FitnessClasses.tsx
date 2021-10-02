import React from 'react'
import ClassicClasses from './ClassicClasses';
import CustomClasses from './CustomClasses';
import GroupClasses from './GroupClasses';
import PTClasses from './PTClasses';



export default function FitnessClasses(props) {

    const { PTProps, widgetProps, actionType, packageTypeName, classicProps, groupProps, customProps,userData } = props;

    return (
        <div className='text-center text-black py-3 w-50 d-flex justify-content-start align-items-center' >
            {packageTypeName !== "custom" ?
                <div>
                    <div className={packageTypeName !== "classic" ? "d-block" : "d-none"}>
                        {packageTypeName === "personal-training" ?
                            <PTClasses
                                packageTypeName={packageTypeName}
                                actionType={actionType}
                                PTProps={PTProps}
                                widgetProps={widgetProps}
                                userData={userData}
                            /> :
                            <GroupClasses
                                packageTypeName={packageTypeName}
                                actionType={actionType}
                                groupProps={groupProps}
                                widgetProps={widgetProps}
                                userData={userData}
                            />
                        }
                    </div>

                    <div className={packageTypeName === "classic" ? "d-block" : "d-none"}>
                        <ClassicClasses
                            packageTypeName={packageTypeName}
                            actionType={actionType}
                            classicProps={classicProps}
                            widgetProps={props} />
                    </div>
                </div>
                :
                <div>
                    <CustomClasses
                        customProps={customProps}
                        widgetProps={widgetProps}
                        packageTypeName={packageTypeName}
                        actionType={actionType}
                        userData={userData}
                    />

                </div>
            }

        </div>

    )
}
