import { useState, ChangeEvent } from "react";
import { InputGroup, FormControl } from "react-bootstrap";
import moment from "moment";

const PackageDateConfig: React.FC<{readonly?: boolean; value: string; onChange: (params: string|null) => void;}> = ({readonly, value, onChange} : {readonly?: boolean; value: string; onChange: (params: string|null) => void;}) => {
  const inputDisabled = readonly ? readonly: false;
  const [startDate, setStartDate] = useState(
    value 
      ? moment(JSON.parse(value).startDate).format("YYYY-MM-DD")
      : moment().format("YYYY-MM-DD")
  );
 
  onChange(JSON.stringify({ startDate}));

  return (
    <div>
      <label>Event Date</label>
      <InputGroup className="mb-3">
        <FormControl
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          type="date"
          min={startDate}
          value={startDate}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            setStartDate(e.target.value);
          }}
          disabled={inputDisabled}
        />
      </InputGroup>
      
        <span className="small text-muted">
          Set the date for this offering to be available for everyone
        </span>
     
    </div>
  );
};

export default PackageDateConfig;
