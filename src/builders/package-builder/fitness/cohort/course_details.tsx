import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

const CourseDetails: React.FC<{
  readonly: boolean;
  value: string;
  onChange: (args: string) => void;
}> = (props) => {
  const inputDisabled = props.readonly;
  const [details, setDetails] = useState<any>(
    props.value ? [JSON.parse(props.value)] : [{ title: '', description: '', startTime: '', endTime: '' }]
  );

  function handleAddCourseDetails(data: any) {
    const newData = [...data];
    newData.push({ title: '', description: '',  startTime: '', endTime: ''});
    setDetails(newData);
  }

  function handleCourseDetailsTitleUpdate(value, index) {
    const newDetails = [...details];
    newDetails[index].title = value;
    setDetails(newDetails);
  }

  function handleCourseDetailsStartTimeUpdate(value, index) {
    const newDetails = [...details];
    newDetails[index].startTime = value;
    setDetails(newDetails);
  }

  function handleCourseDetailsEndTimeUpdate(value, index) {
    const newDetails = [...details];
    newDetails[index].endTime = value;
    setDetails(newDetails);
  }

  function handleCourseDetailsDescriptionUpdate(value, index) {
    const newDetails = [...details];
    newDetails[index].description = value;
    setDetails(newDetails);
  }

  if (details[0].title !== '' && details[0].description !== '' && details[0].startTime !== '' && details[0].endTime !== '') {
    props.onChange(JSON.stringify(details));
  }

  return (
    <div>
      <div className="text-right" style={{ justifyContent: 'end' }}>
        <Button
          variant="outline-info"
          disabled={inputDisabled}
          onClick={() => {
            handleAddCourseDetails(details);
          }}>
          <i className="fa fa-plus-circle"></i>&nbsp;Add
        </Button>
      </div>
      <div>
        {details.map((detail, index) => {
          return (
            <div key={index}>
              {/* Title */}
              <Form.Group controlId="exampleForm.ControlInput1">
                <Form.Label>Title - {index + 1}</Form.Label>
                <Form.Control
                  type="text"
                  disabled={inputDisabled}
                  value={detail.title}
                  onChange={(e: any) => handleCourseDetailsTitleUpdate(e.target.value, index)}
                />
              </Form.Group>
               {/* Description */}
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Description - {index + 1}</Form.Label>
                <Form.Control
                  as="textarea"
                  disabled={inputDisabled}
                  rows={3}
                  value={detail.description}
                  onChange={(e: any) => handleCourseDetailsDescriptionUpdate(e.target.value, index)}
                />
              </Form.Group>
               {/* start time */}
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>Start time</Form.Label>
                <Form.Control
                  type="time"
                  disabled={inputDisabled}
                  value={detail.startTime}
                  onChange={(e: any) => handleCourseDetailsStartTimeUpdate(e.target.value, index)}
                />
              </Form.Group>
              {/* end time */}
              <Form.Group controlId="exampleForm.ControlTextarea1">
                <Form.Label>End time</Form.Label>
                <Form.Control
                  type="time"
                  disabled={inputDisabled}
                  value={detail.endTime}
                  onChange={(e: any) => handleCourseDetailsEndTimeUpdate(e.target.value, index)}
                />
              </Form.Group>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CourseDetails;
