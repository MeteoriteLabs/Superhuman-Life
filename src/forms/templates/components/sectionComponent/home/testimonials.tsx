import { useForm, Controller } from 'react-hook-form';
import style from '../style.module.css';
import { Button, Form } from 'react-bootstrap';
import BlackBgAccordian from '../../../../../components/accordian/blackBgAccordian';

type FormData = {
  title: string;
  testimonial1_name: '';
  testimonial1_message: '';
  testimonial1_designation: '';
  testimonial1_image: '';
  testimonial2_name: '';
  testimonial2_message: '';
  testimonial2_designation: '';
  testimonial2_image: '';
  testimonial3_name: '';
  testimonial3_message: '';
  testimonial3_designation: '';
  testimonial3_image: '';
};

function Hero(): JSX.Element {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: ''
    }
  });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className={style.formContainer}>
      <Form onSubmit={onSubmit} className={style.form}>
        <Form.Group controlId="formBasicEmail">
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

        <hr className={style.breakLine} />
        <BlackBgAccordian
          title="Testimonial 1"
          control_description="testimonial1_description"
          control_title="testimonial1_title"
          control_image="testimonial1_image"
          control={control}
          errors={errors}
          eventKey="0"
        />
        <BlackBgAccordian
          title="Testimonial 2"
          control_description="testimonial2_description"
          control_title="testimonial2_title"
          control_image="testimonial2_image"
          control={control}
          errors={errors}
          eventKey="1"
        />
        <BlackBgAccordian
          title="Testimonial 3"
          control_description="testimonial3_description"
          control_title="testimonial3_title"
          control_image="testimonial3_image"
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
