import { useForm, Controller } from 'react-hook-form';
import style from '../style.module.css';
import { Button, Form } from 'react-bootstrap';

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
      feature3_image: ''
    }
  });
  const onSubmit = handleSubmit((data) => console.log(data));

  return (
    <div className={style.form}>
      <Form onSubmit={onSubmit} style={{ width: 257 }}>
        <Form.Group controlId="title">
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
          <p style={{ fontWeight: 600, marginBottom: 8 }}>FEATURE 1</p>
          <Form.Group controlId="feature1_title">
            <Form.Label>Title</Form.Label>
            <Controller
              name="feature1_title"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature1_title && <p>{errors.feature1_title.message}</p>}
          </Form.Group>
          <Form.Group controlId="feature1_description">
            <Form.Label>Description</Form.Label>
            <Controller
              name="feature1_description"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature1_description && <p>{errors.feature1_description.message}</p>}
          </Form.Group>
          <Form.Group controlId="feature1_image">
            <Form.Label>Image</Form.Label>
            <Controller
              name="feature1_image"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="file"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature1_image && <p>{errors.feature1_image.message}</p>}
          </Form.Group>
        </div>
        <div style={{ marginTop: 25 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>FEATURE 2</p>
          <Form.Group controlId="feature2_title">
            <Form.Label>Title</Form.Label>
            <Controller
              name="feature2_title"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature2_title && <p>{errors.feature2_title.message}</p>}
          </Form.Group>
          <Form.Group controlId="feature2_description">
            <Form.Label>Description</Form.Label>
            <Controller
              name="feature2_description"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature2_description && <p>{errors.feature2_description.message}</p>}
          </Form.Group>
          <Form.Group controlId="feature2_image">
            <Form.Label>Image</Form.Label>
            <Controller
              name="feature2_image"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="file"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature2_image && <p>{errors.feature2_image.message}</p>}
          </Form.Group>
        </div>

        <div style={{ marginTop: 25 }}>
          <p style={{ fontWeight: 600, marginBottom: 8 }}>FEATURE 3</p>
          <Form.Group controlId="feature3_title">
            <Form.Label>Title</Form.Label>
            <Controller
              name="feature3_title"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature3_title && <p>{errors.feature3_title.message}</p>}
          </Form.Group>
          <Form.Group controlId="feature3_description">
            <Form.Label>Description</Form.Label>
            <Controller
              name="feature3_description"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="text"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature3_description && <p>{errors.feature3_description.message}</p>}
          </Form.Group>
          <Form.Group controlId="feature3_image">
            <Form.Label>Image</Form.Label>
            <Controller
              name="feature3_image"
              control={control}
              render={({ field }) => (
                <Form.Control
                  type="file"
                  style={{ fontSize: 14 }}
                  as="input"
                  {...field}></Form.Control>
              )}
            />
            {errors.feature3_image && <p>{errors.feature3_image.message}</p>}
          </Form.Group>
        </div>

        <Button
          variant="primary"
          type="submit"
          style={{
            paddingBlock: 4,
            float: 'right',
            marginBlock: 20,
            marginBottom: 80
          }}>
          Submit
        </Button>
      </Form>
    </div>
  );
}

export default Hero;
