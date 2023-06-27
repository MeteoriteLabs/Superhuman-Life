import React, { ChangeEvent, useState } from 'react'
import { InputGroup, Row, Col, Form } from 'react-bootstrap'
import { gql, useQuery } from '@apollo/client'
import ActivityBuilder from './activityBuilder'
import { flattenObj } from '../utils/responseFlatten'

interface Activity {
    id: string
    title: string
}

interface Activities {
    id: string
    attributes: {
        title: string
    }
    __typename: string
}

interface ActivityEntityResponseCollection {
    data: Activities[]
    length: number
    __typename: string
}

const ActivityField: React.FC<{ onChange: (params: string | null) => void }> = ({ onChange }) => {
    const [activity, setActivity] = useState<Activity[]>([])
    const [selected, setSelected] = useState<Activity>({} as Activity)

    const FETCH_ACTIVITIES = gql`
        query activities {
            activities(sort: ["updatedAt:desc"]) {
                data {
                    id
                    attributes {
                        title
                    }
                }
            }
        }
    `

    function FetchData() {
        useQuery<ActivityEntityResponseCollection>(FETCH_ACTIVITIES, { onCompleted: loadData })
    }

    function loadData(data: ActivityEntityResponseCollection) {
        const flattenedData = flattenObj({ ...data })
        setActivity(
            [...flattenedData.activities].map((activity) => {
                return {
                    id: activity.id,
                    title: activity.title
                }
            })
        )
    }

    FetchData()

    function OnChange(data: string | null) {
        if (data) {
            const objectToString = JSON.stringify(data)

            onChange(objectToString)
        }
    }

    function handleSelect(data: string) {
        const values = [...activity]
        const a = values.find((e) => e.title === data)
        a && setSelected(a)
    }

    return (
        <>
            <label>Select Activity</label>
            <Row className="pl-2 pr-2">
                <Col xs={12}>
                    <InputGroup>
                        <Form.Control
                            as="select"
                            defaultValue=""
                            placeholder="Choose one Activity"
                            onChange={(e: ChangeEvent<HTMLInputElement>) => {
                                handleSelect(e.target.value)
                            }}
                        >
                            <option></option>
                            {activity.map((activity) => {
                                return <option key={activity.id}>{activity.title}</option>
                            })}
                        </Form.Control>
                    </InputGroup>
                </Col>
            </Row>
            <div>
                <ActivityBuilder activity={selected} onChange={OnChange} />
            </div>
        </>
    )
}

export default ActivityField
