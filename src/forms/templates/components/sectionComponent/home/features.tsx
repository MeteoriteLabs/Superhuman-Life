import { useForm, Controller } from 'react-hook-form';
import style from '../style.module.css';
import { Button, Form } from 'react-bootstrap';
import BlackBgAccordian from '../../../../../components/accordian/blackBgAccordian';

type FormData = {
  title: string;
  feature1_title: string;
  feature1_description: string;
  feature1_image: string;
  feature2_title: string;
  feature2_description: string;
  feature2_image: string;
  feature3_title: string;
  feature3_description: string;
  feature3_image: string;
  feature4_title: string;
  feature4_description: string;
  feature4_image: string;
};

function Hero(): JSX.Element {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      feature1_title: '',
      feature1_description: '',
      feature1_image: '',
      feature2_title: '',
      feature2_description: '',
      feature2_image: '',
      feature3_title: '',
      feature3_description: '',
      feature3_image: '',
      feature4_title: '',
      feature4_description: '',
      feature4_image: ''
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
          title="Feature 1"
          control_description="feature1_description"
          control_title="feature1_title"
          control_image="feature1_image"
          control={control}
          errors={errors}
          eventKey="0"
        />
        <BlackBgAccordian
          title="Feature 2"
          control_description="feature2_description"
          control_title="feature2_title"
          control_image="feature2_image"
          control={control}
          errors={errors}
          eventKey="1"
        />
        <BlackBgAccordian
          title="Feature 3"
          control_description="feature3_description"
          control_title="feature3_title"
          control_image="feature3_image"
          control={control}
          errors={errors}
          eventKey="2"
        />{' '}
        <BlackBgAccordian
          title="Feature 4"
          control_description="feature4_description"
          control_title="feature4_title"
          control_image="feature4_image"
          control={control}
          errors={errors}
          eventKey="3"
        />
        <Button variant="primary" type="submit" className={style.submitButton}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Hero;
