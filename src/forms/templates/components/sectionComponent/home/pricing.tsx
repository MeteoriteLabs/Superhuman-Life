import { useForm, Controller } from 'react-hook-form';
import style from '../style.module.css';
import { Button, Form } from 'react-bootstrap';
import BlackBgAccordian from '../../../../../components/accordian/blackBgAccordian';

type FormData = {
  title: string;
  pricing1_title: string;
  pricing1_description: string;
  pricing1_image: string;
  pricing2_title: string;
  pricing2_description: string;
  pricing2_image: string;
  pricing3_title: string;
  pricing3_description: string;
  pricing3_image: string;
};

function Hero(): JSX.Element {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      pricing1_title: '',
      pricing1_description: '',
      pricing1_image: '',
      pricing2_title: '',
      pricing2_description: '',
      pricing2_image: '',
      pricing3_title: '',
      pricing3_description: '',
      pricing3_image: ''
    }
  });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className={style.formContainer}>
      <Form onSubmit={onSubmit} className={style.form}>
        <Form.Group controlId="title">
          <Form.Label className={style.labelText}>Title</Form.Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Control
                type="text"
                className={style.inputText}
                as="input"
                {...field}></Form.Control>
            )}
          />
          {errors.title && <p>{errors.title.message}</p>}
        </Form.Group>
        <BlackBgAccordian
          title="Pricing 1"
          control_description="pricing1_description"
          control_title="pricing1_title"
          control_image="pricing1_image"
          control={control}
          errors={errors}
          eventKey="0"
        />
        <BlackBgAccordian
          title="Pricing 2"
          control_description="pricing2_description"
          control_title="pricing2_title"
          control_image="pricing2_image"
          control={control}
          errors={errors}
          eventKey="1"
        />
        <BlackBgAccordian
          title="Pricing 3"
          control_description="pricing3_description"
          control_title="pricing3_title"
          control_image="pricing3_image"
          control={control}
          errors={errors}
          eventKey="2"
        />

        <Button variant="primary" type="submit" className={style.submitButton}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Hero;
