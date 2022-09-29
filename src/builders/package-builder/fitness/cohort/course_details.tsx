import React, {useState} from 'react';
import {Button, Form} from 'react-bootstrap';

const CourseDetails = (props) => {

    const inputDisabled = props.readonly;
    
    const [details, setDetails] = useState<any>(props.value === undefined ? [{title: '', description: ''}] : JSON.parse(props.value));

    function handleAddCourseDetails(data: any) {
        const newData = [...data];
        newData.push({title: '', description: ''});
        setDetails(newData);
    }

    function handleCourseDetailsTitleUpdate(value, index) {
        const newDetails = [...details];
        newDetails[index].title = value;
        setDetails(newDetails);
    }

    function handleCourseDetailsDescriptionUpdate(value, index) {
        const newDetails = [...details];
        newDetails[index].description = value;
        setDetails(newDetails);
    }

    if(details[0].title !== "" && details[0].description !== ""){
        props.onChange(JSON.stringify(details));
    }

    return (
        <>
        <div>
            <div className="text-right" style={{ justifyContent: 'end'}}>
                <Button variant='outline-info' disabled={inputDisabled} onClick={() => {handleAddCourseDetails(details)}}><i className="fa fa-plus-circle"></i>&nbsp;Add</Button>
            </div>
            <div>
                {details.map((detail, index) => {
                    return (
                        <Form key={index}>
                            <Form.Group controlId="exampleForm.ControlInput1">
                                <Form.Label>Title - {index + 1}</Form.Label>
                                <Form.Control type="text" disabled={inputDisabled} value={detail.title} onChange={(e: any) => handleCourseDetailsTitleUpdate(e.target.value, index)}/>
                            </Form.Group>
                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Description - {index + 1}</Form.Label>
                                <Form.Control as="textarea" disabled={inputDisabled} rows={3} value={detail.description} onChange={(e: any) => handleCourseDetailsDescriptionUpdate(e.target.value, index)}/>
                            </Form.Group>
                        </Form>
                    )
                })}
            </div>
        </div>
        </>
    );
};

export default CourseDetails;