import { useState } from 'react'
import { Form } from 'react-bootstrap'
import OrganizationSelect from '../../components/customWidgets/organizationTypeList'

const Organization = (props: any) => {
    const [haveOrganization, setHaveOrganization] = useState(props.value)

    return (
        <div>
            <label>Do you own an Organization?</label>
            <br />
            <Form.Check
                inline
                label="Yes"
                name="group1"
                type={'radio'}
                onChange={(e) => {
                    setHaveOrganization('yes')
                }}
                id={`inline-${'radio'}-1`}
            />
            <Form.Check
                inline
                label="No"
                name="group1"
                type={'radio'}
                onChange={(e) => {
                    setHaveOrganization('no')
                }}
                id={`inline-${'radio'}-2`}
            />
            <br />
            <br />
            {haveOrganization === 'yes' && (
                <div>
                    <Form.Group controlId="formBasicEmail">
                        <Form.Label>Organization Name</Form.Label>
                        <Form.Control type="text" placeholder="" />
                    </Form.Group>
                    <OrganizationSelect {...props} />
                    <br />
                    <Form.Group controlId="exampleForm.ControlTextarea1">
                        <Form.Label>About Organization</Form.Label>
                        <Form.Control as="textarea" rows={3} />
                    </Form.Group>
                </div>
            )}
        </div>
    )
}

export default Organization
