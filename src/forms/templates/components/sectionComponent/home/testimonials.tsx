import { useForm, Controller } from 'react-hook-form';
import style from '../style.module.css';
import { Button, Form } from 'react-bootstrap';

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
    <div className={style.form}>
      <Form onSubmit={onSubmit} style={{ width: 257 }}>
        <Form.Group controlId="formBasicEmail">
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

        <div style={{ marginTop: 25 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Testimonial 1</p>
          <Form.Group controlId="testimonial1_name">
            <Form.Label>Title</Form.Label>
            <Controller
              name="testimonial1_name"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial1_name && <p>{errors.testimonial1_name.message}</p>}
          </Form.Group>
          <Form.Group controlId="testimonial1_designation">
            <Form.Label>Designation</Form.Label>
            <Controller
              name="testimonial1_designation"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial1_designation && <p>{errors.testimonial1_designation.message}</p>}
          </Form.Group>
          <Form.Group controlId="testimonial1_message">
            <Form.Label>Message</Form.Label>
            <Controller
              name="testimonial1_message"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial1_message && <p>{errors.testimonial1_message.message}</p>}
          </Form.Group>

          <Form.Group controlId="testimonial1_image">
            <Form.Label>Image</Form.Label>
            <Controller
              name="testimonial1_image"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="file"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial1_image && <p>{errors.testimonial1_image.message}</p>}
          </Form.Group>
        </div>

        <div style={{ marginTop: 25 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Testimonial 2</p>
          <Form.Group controlId="testimonial2_name">
            <Form.Label>Title</Form.Label>
            <Controller
              name="testimonial2_name"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial2_name && <p>{errors.testimonial2_name.message}</p>}
          </Form.Group>
          <Form.Group controlId="testimonial2_designation">
            <Form.Label>Designation</Form.Label>
            <Controller
              name="testimonial2_designation"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial2_designation && <p>{errors.testimonial2_designation.message}</p>}
          </Form.Group>
          <Form.Group controlId="testimonial2_message">
            <Form.Label>Message</Form.Label>
            <Controller
              name="testimonial2_message"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial2_message && <p>{errors.testimonial2_message.message}</p>}
          </Form.Group>

          <Form.Group controlId="testimonial2_image">
            <Form.Label>Image</Form.Label>
            <Controller
              name="testimonial2_image"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="file"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial2_image && <p>{errors.testimonial2_image.message}</p>}
          </Form.Group>
        </div>
        <div style={{ marginTop: 25 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>Testimonial 3</p>
          <Form.Group controlId="testimonial3_name">
            <Form.Label>Title</Form.Label>
            <Controller
              name="testimonial3_name"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial3_name && <p>{errors.testimonial3_name.message}</p>}
          </Form.Group>
          <Form.Group controlId="testimonial3_designation">
            <Form.Label>Designation</Form.Label>
            <Controller
              name="testimonial3_designation"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial3_designation && <p>{errors.testimonial3_designation.message}</p>}
          </Form.Group>
          <Form.Group controlId="testimonial3_message">
            <Form.Label>Message</Form.Label>
            <Controller
              name="testimonial3_message"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial3_message && <p>{errors.testimonial3_message.message}</p>}
          </Form.Group>

          <Form.Group controlId="testimonial3_image">
            <Form.Label>Image</Form.Label>
            <Controller
              name="testimonial3_image"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="file"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.testimonial3_image && <p>{errors.testimonial3_image.message}</p>}
          </Form.Group>
        </div>

        <Button
          variant="primary"
          type="submit"
          style={{
            // paddingInline: 20,
            paddingBlock: 4,
            float: 'right',
            marginBlock: 20,
            marginBottom: 70
          }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Hero;
