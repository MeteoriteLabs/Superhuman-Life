import * as _ from 'lodash'
import { Form } from 'react-bootstrap'





export default function Voucher({ actionType, setFitnesspackagepricing, fitnesspackagepricing, type, mode,minPrice  ,setMinPrice, arrSapientPrice,setIndex }) {


  
    let numEle = (type === "Classic Class" || mode === "Online Workout" || mode === "Offline Workout") ? 1 : 4


    const handleOnChange = (e, index: number) => {
        let updateVoucher: any = ''
        updateVoucher = _.cloneDeep(fitnesspackagepricing)
        updateVoucher[index].voucher = e.target.value;

      
        let updateValue = [...minPrice]
        if (e.target.value === "0%") {
            updateValue[index] = Number(arrSapientPrice[index])
      

        } else if (e.target.value === "10%") {
            updateValue[index] = Number(((arrSapientPrice[index] * 100) / (100 - 10)).toFixed(2))
       

        } else if (e.target.value === "20%") {
            updateValue[index] = Number(((arrSapientPrice[index] * 100) / (100 - 20)).toFixed(2))
           
        }
        
        setIndex(index)
        setMinPrice(updateValue)
        setFitnesspackagepricing(updateVoucher);
    }

    return <>
        {[...Array(numEle)].map((item: any, index: number) => {
            return <td key={index}>
                <Form.Group>
                    <Form.Control
                        as="select"
                        required
                        disabled={actionType === "view" ? true : false}
                        value={fitnesspackagepricing[index].voucher}
                        className='text-center w-75 mx-auto'
                        onChange={(e) => handleOnChange(e, index)} >
                        <option value="0%">Choose voucher</option>
                        <option value='10%'>Getfit - 10%</option>
                        <option value='20%'>Getfit - 20%</option>
                    </Form.Control>
                </Form.Group>
            </td>
        })}
    </>
}
