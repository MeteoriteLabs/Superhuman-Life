import {useState} from 'react';

const YearOfPassing = (props: any) => {
     const [date, setDate] = useState(props.value);

     props.onChange(date);

     return (
          <div>
               <label>Year Of Passing</label><br />
               <input type="month" value={date} onChange={(d) => {setDate(d.target.value)}}/>
          </div>
     );
};

export default YearOfPassing;