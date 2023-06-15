import { useForm, Controller } from 'react-hook-form';
import style from '../style.module.css';
import { Button, Form } from 'react-bootstrap';

type FormData = {
  title: string;
  buttonText: string;
};

function Hero(): JSX.Element {
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: '',
      buttonText: ''
    }
  });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className={style.form}>
      <Form onSubmit={onSubmit} style={{ width: 257 }}>
        <Form.Group controlId="home_cta">
          <Form.Label>Title</Form.Label>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <Form.Control
                type="text"
                style={{ fontSize: 14 }}
                as="input"
                {...field}></Form.Control>
            )}
          />

          {errors.title && <p>{errors.title.message}</p>}
        </Form.Group>
        <Form.Group controlId="home_cta">
          <Form.Label>Button </Form.Label>
          <Controller
            name="buttonText"
            control={control}
            render={({ field }) => (
              <Form.Control
                type="textarea"
                style={{ fontSize: 14 }}
                as="input"
                {...field}></Form.Control>
            )}
          />

          {errors.buttonText && (
            <Form.Control.Feedback tooltip>{errors.buttonText.message}</Form.Control.Feedback>
          )}
        </Form.Group>

        <Button
          variant="primary"
          type="submit"
          style={{
            // paddingInline: 20,
            paddingBlock: 4,
            float: 'right',
            marginBlock: 20
          }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Hero;
