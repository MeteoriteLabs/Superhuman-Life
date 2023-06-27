import React, { Fragment, useEffect, useState } from 'react';
import { Carousel, Card } from 'react-bootstrap';
import './fitnessPreview.css';
import ClassicPreview from './ClassicPreview';
import CustomPreview from './CustomPreview';
import PTGroupPreview from './PTGroupPreview';
import RecordedPreview from './RecordedPreview';
import SocialMediaComponent from '../../../../../components/customWidgets/SocialMediaComponent';

interface UserData {
    disciplines: any;
    ptclasssize: any;
    ptonline: any;
    ptoffline: any;
    URL: string;
    level: any;
    grouponline: any;
    groupoffline: any;
    recordedclasses: any;
    classsize: any;
    mode: any;
}

const FitnessPreview: React.FC<{
    userData: UserData;
    fitnesspackagepricing: any;
    packageType: any;
    type: any;
    actionType: any;
}> = (props) => {
    const [onlineClassesType, setOnlineClassesType] = useState<number>();
    const [offlineClassesType, setOffineClassesType] = useState<number>();
    const [updatePricing] = useState(props.fitnesspackagepricing);
    const [sizeType, setSizeType] = useState<string | number>();
    const [index, setIndex] = useState<number>(0);
    const handleSelect = (selectedIndex, e) => {
        setIndex(selectedIndex);
    };

    if (typeof props.userData.disciplines !== 'object')
        props.userData.disciplines = JSON.parse(props.userData.disciplines);

    useEffect(() => {
        if (props.packageType === 'personal-training') {
            setOnlineClassesType(props.userData.ptonline);
            setOffineClassesType(props.userData.ptoffline);
            setSizeType(props.userData.ptclasssize);
        } else if (props.packageType === 'group') {
            setOnlineClassesType(props.userData.grouponline);
            setOffineClassesType(props.userData.groupoffline);
            setSizeType(props.userData.classsize);
        }
    }, [
        props.packageType,
        props.actionType,
        props.userData.ptonline,
        props.userData.ptoffline,
        props.userData.grouponline,
        props.userData.groupoffline,
        props.userData.classsize,
        props.userData.ptclasssize
    ]);

    return (
        <Fragment>
            {props.packageType === 'classic' ||
            props.userData.mode === 'Online Workout' ||
            props.userData.mode === 'Offline Workout' ? (
                <ClassicPreview
                    type={props.type}
                    mode={props.userData.mode}
                    disciplines={props.userData.disciplines}
                    level={props.userData.level}
                    packageType={props.packageType}
                    ptonline={props.userData.ptonline}
                    ptoffline={props.userData.ptoffline}
                    recordedclasses={props.userData.recordedclasses}
                    ptclasssize={props.userData.ptclasssize}
                    sizeType={sizeType}
                    fitnesspackagepricing={props.fitnesspackagepricing}
                />
            ) : (
                <Carousel slide={true} touch={true} activeIndex={index} onSelect={handleSelect}>
                    {updatePricing.map((item, idx: number) => {
                        let beginnerTag = '';
                        let intermediateTag = '';
                        let advancedTag = '';

                        if (props.userData.level === 'Beginner') {
                            beginnerTag = 'beginnerTag';
                        } else if (props.userData.level === 'Intermediate') {
                            intermediateTag = 'intermediateTag';
                        } else if (props.userData.level === 'Advanced') {
                            advancedTag = 'advancedTag';
                        }

                        return (
                            <Carousel.Item key={idx}>
                                <Card
                                    className="text-center mx-auto"
                                    style={{ borderRadius: '20px', width: '80%' }}
                                >
                                    <Card.Body className="pr-0 py-0">
                                        <div
                                            className="d-flex justify-content-between"
                                            style={{ borderBottom: '1px dashed gray' }}
                                        >
                                            <div className="pt-3">
                                                <img
                                                    src="https://picsum.photos/200"
                                                    style={{ borderRadius: '10px' }}
                                                    alt="random"
                                                />
                                            </div>
                                            <div className="ml-4 pt-4 text-left d-flex flex-column justify-content-between">
                                                <Card.Title>{props.type} program</Card.Title>
                                                <p>
                                                    Lorem ipsum dolor, sit amet consectetur
                                                    adipisicing elit. Libero non numquam, quos ut
                                                    placeat quo ducimus facere inventore facilis
                                                    nostrum dolor amet doloremque molestias quasi ab
                                                    consectetur, commodi maiores? Doloribus.
                                                </p>
                                                <div>
                                                    <div className="d-flex justify-content-start align-items-center">
                                                        {props.userData.disciplines?.map(
                                                            (item, index) => {
                                                                return (
                                                                    <div
                                                                        key={index}
                                                                        className="mr-2 my-3"
                                                                        style={{
                                                                            padding: '0.5rem 1rem',
                                                                            backgroundColor:
                                                                                '#F2E890',
                                                                            borderRadius: '20px'
                                                                        }}
                                                                    >
                                                                        <p className="mb-0">
                                                                            {item.disciplinename}
                                                                        </p>
                                                                    </div>
                                                                );
                                                            }
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <p
                                                    className={`py-2 px-4 text-white ${beginnerTag} ${intermediateTag} ${advancedTag}`}
                                                    style={{
                                                        borderTopRightRadius: '20px',
                                                        borderBottomLeftRadius: '20px'
                                                    }}
                                                >
                                                    {props.userData.level}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="pt-3 d-flex justify-content-between align-items-center ">
                                            <div className="d-flex justify-content-center align-items-center">
                                                {props.packageType !== 'custom' ? (
                                                    props.packageType !== 'classic' ? (
                                                        <PTGroupPreview
                                                            packageType={props.packageType}
                                                            offlineClassesType={offlineClassesType}
                                                            onlineClassesType={onlineClassesType}
                                                        />
                                                    ) : (
                                                        <RecordedPreview
                                                            packageType={props.packageType}
                                                            recordedclasses={
                                                                props.userData.recordedclasses
                                                            }
                                                        />
                                                    )
                                                ) : (
                                                    <CustomPreview
                                                        packageType={props.packageType}
                                                        ptonline={props.userData.ptonline}
                                                        ptoffline={props.userData.ptoffline}
                                                        grouponline={props.userData.grouponline}
                                                        groupoffline={props.userData.groupoffline}
                                                        recordedclasses={
                                                            props.userData.recordedclasses
                                                        }
                                                    />
                                                )}
                                                {props.packageType !== 'classic' &&
                                                    props.packageType !== 'custom' && (
                                                        <div className="ml-4">
                                                            <h4>Class Size</h4>
                                                            <p
                                                                className="mb-0"
                                                                style={{
                                                                    color: 'purple',
                                                                    fontSize: '1.3rem'
                                                                }}
                                                            >
                                                                {sizeType}
                                                            </p>
                                                        </div>
                                                    )}
                                            </div>
                                            <div>
                                                <p
                                                    className="mb-0 mr-3"
                                                    style={{ color: '#72B54C', fontSize: '2rem' }}
                                                >
                                                    {'\u20B9'} {item.mrp}
                                                </p>
                                                <p>per {item.duration} days</p>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Carousel.Item>
                        );
                    })}
                </Carousel>
            )}

            <SocialMediaComponent url={props.userData.URL} />
        </Fragment>
    );
};

export default FitnessPreview;
