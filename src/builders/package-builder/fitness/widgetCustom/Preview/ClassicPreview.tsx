import React from 'react'
import { Card } from 'react-bootstrap'
import PTGroupPreview from './PTGroupPreview'
import RecordedPreview from './RecordedPreview'

type Props = {
    type: 'Personal Training' | 'Group Class' | 'Custom Fitness' | 'Classic Class';
    disciplines: any,
    beginnerTag: string,
    intermediateTag: string,
    advancedTag: string,
    level: "Beginner" | "Intermediate" | "Advanced",
    packageType: "personal-training" | "group" | "classic" | "custom",
    recordedclasses: number,
    ptonline: number,
    ptoffline: number,
    sizeType: any,
    ptclasssize: "Solo" | "Couple" | "Family",
    fitnesspackagepricing: any,
    mode: "Online" | "Offline" | "Hybird" | "Workout"
}



export default function ClassicPreview({ type, disciplines, beginnerTag, intermediateTag, advancedTag, level, packageType, recordedclasses, ptonline, ptoffline, sizeType, ptclasssize, fitnesspackagepricing, mode }: Props) {

    return (
        <Card className="text-center w-75 mx-auto" style={{ borderRadius: '20px' }}>
            <Card.Body className='pr-0 py-0'>
                <div className='d-flex justify-content-between' style={{ borderBottom: '1px dashed gray' }}>
                    <div className='pt-3'>
                        <img src="https://picsum.photos/200" style={{ borderRadius: '10px' }} alt="random" />
                    </div>
                    <div className='ml-4 pt-4 text-left d-flex flex-column justify-content-between'>
                        <Card.Title>{type} program</Card.Title>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Libero non numquam, quos ut placeat quo ducimus facere inventore facilis nostrum dolor amet doloremque molestias quasi ab consectetur, commodi maiores? Doloribus.</p>
                        <Card.Text>
                            <div className='d-flex justify-content-start align-items-center'>
                                {disciplines?.map((item, index) => {
                                    return <div key={index} className='mr-2 my-3' style={{ padding: '0.5rem 1rem', backgroundColor: '#F2E890', borderRadius: '20px' }}>
                                        <p className='mb-0'>{item.disciplinename}</p>
                                    </div>
                                })}
                            </div>
                        </Card.Text>
                    </div>
                    <div>
                        <p className={`py-2 px-4 text-white ${beginnerTag} ${intermediateTag} ${advancedTag}`} style={{ borderTopRightRadius: '20px', borderBottomLeftRadius: '20px' }}>{level}</p>
                    </div>
                </div>
                <Card.Text className='py-3 d-flex justify-content-between align-items-center '>
                    <div className='d-flex justify-content-center align-items-center'>
                        {mode === "Workout" ?
                            <PTGroupPreview
                                packageType={packageType}
                                offlineClassesType={ptoffline}
                                onlineClassesType={ptonline}
                            />
                            :
                            <RecordedPreview
                                packageType={packageType}
                                recordedclasses={recordedclasses}
                            />
                        }


                        {(packageType !== "classic" && packageType !== 'custom') ? <div className='ml-4'>
                            <h4>Class Size</h4>
                            {mode === "Workout" ?
                                <p className='mb-0' style={{ color: 'purple', fontSize: '1.3rem' }}>{ptclasssize}</p>
                                :
                                <p className='mb-0' style={{ color: 'purple', fontSize: '1.3rem' }}>{sizeType}</p>
                            }

                        </div> : ""}
                    </div>
                    <div>
                        <p className='mb-0 mr-3' style={{ color: '#72B54C', fontSize: '2rem' }}>{"\u20B9"} {fitnesspackagepricing[0].mrp}</p>
                        <p>per {fitnesspackagepricing[0].duration} days</p>
                    </div>
                </Card.Text>
            </Card.Body>
        </Card>

    )
}
