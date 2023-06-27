import { Control, Controller } from 'react-hook-form'
import {
    SetFirstLetterToUpperCase,
    SplitAtUpperCase
} from './../../../../../../lib/StringManipulation'
import { Form } from 'react-bootstrap'
import { FormData, InputProps } from '../@types/pricingType'

export const InputComponent = ({
    input,
    index,
    control
}: {
    input: InputProps
    index: number
    control: Control<FormData>
}): JSX.Element => {
    return (
        <Form.Group>
            <Form.Label>{SetFirstLetterToUpperCase(SplitAtUpperCase(input))}</Form.Label>
            <Controller
                name={`plans.${index}.${input}`}
                control={control}
                render={({ field }) => (
                    <Form.Control
                        type="text"
                        style={{ fontSize: 14 }}
                        as="input"
                        {...field}
                    ></Form.Control>
                )}
            />
        </Form.Group>
    )
}
