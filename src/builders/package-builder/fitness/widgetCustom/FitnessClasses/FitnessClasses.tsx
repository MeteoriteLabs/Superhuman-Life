import React from 'react'
import ClassicClasses from './ClassicClasses';
import CustomClasses from './CustomClasses';
import GroupClasses from './GroupClasses';
import PTClasses from './PTClasses';



export default function FitnessClasses(props) {

    const { PTProps, widgetProps, actionType, packageTypeName, classicProps, groupProps, customProps } = props;

    return (
        <div className='text-center text-black py-3 w-25 d-flex justify-content-center align-items-center' >
            {packageTypeName !== "custom" ?
                <div>
                    <div className={packageTypeName !== "classic" ? "d-block" : "d-none"}>

                        {packageTypeName === "personal-training" ?
                            <PTClasses
                                packageTypeName={packageTypeName}
                                actionType={actionType}
                                PTProps={PTProps}
                                widgetProps={widgetProps}
                            /> :
                            <GroupClasses
                                packageTypeName={packageTypeName}
                                actionType={actionType}
                                groupProps={groupProps}
                                widgetProps={widgetProps}
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
                    />

                </div>
            }

        </div>

    )
}
