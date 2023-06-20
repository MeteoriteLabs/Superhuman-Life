import { useForm, Controller } from 'react-hook-form';
import style from '../style.module.css';
import { Button, Form } from 'react-bootstrap';
import { useMutation, useQuery } from '@apollo/client';
import { GET_WEBSITE_SECTION_ID, UPDATE_WEBSITE_SECTION } from './quries/home';
import authContext from '../../../../../context/auth-context';
import { useContext, useEffect, useState } from 'react';
import { ChangeMakerWebsiteContext } from '../../../../../context/changemakerWebsite-context';

type FormData = {
  title: string;
  description: string;
  image: string;
};

function Hero(): JSX.Element {
  const auth = useContext(authContext);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [initalValues, setInitalValues] = useState({
    title: '',
    description: '',
    image: '',
    sectionId: ''
  });

  const { setChangemakerWebsiteState, changemakerWebsiteState } =
    useContext(ChangeMakerWebsiteContext);

  useQuery(GET_WEBSITE_SECTION_ID, {
    variables: {
      id: auth.userid,
      sectionPage: 'Home',
      sectionType: 'Hero'
    },
    onCompleted: (data) => {
      setInitalValues({
        ...initalValues,
        sectionId: data.websiteSections.data[0].id,
        title: data.websiteSections.data[0].attributes.sectionData.title,
        description: data.websiteSections.data[0].attributes.sectionData.description,
        image: data.websiteSections.data[0].attributes.sectionData.image
      });
    }
  });

  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      title: initalValues.title,
      description: initalValues.description,
      image: initalValues.image
    }
  });

  const [mutateFunction, { loading, error }] = useMutation(UPDATE_WEBSITE_SECTION);

  const onSubmit = handleSubmit(async (formData) => {
    // ! Need to add image upload
    const { title, description, image } = formData;

    await mutateFunction({
      variables: {
        id: initalValues.sectionId,
        title: title ? title : initalValues.title,
        desc: description ? description : initalValues.description,
        image: image ? image : initalValues.image
      }
    });
  });

  useEffect(() => {
    loading
      ? setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: true })
      : setChangemakerWebsiteState({ ...changemakerWebsiteState, loading: false });
    error ? setErrorMsg(`${error.name}: ${error.message}`) : setErrorMsg('');
  }, [loading, error]);

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
        <Form.Group controlId="description">
          <Form.Label>Description</Form.Label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <Form.Control
                type="textarea"
                style={{ fontSize: 14 }}
                as="input"
                {...field}></Form.Control>
            )}
          />

          {errors.description && (
            <Form.Control.Feedback tooltip>{errors.description.message}</Form.Control.Feedback>
          )}
        </Form.Group>
        <Form.Group controlId="hero image">
          <Form.Label>Hero Image</Form.Label>
          <Controller
            name="image"
            control={control}
            render={({ field }) => (
              <Form.Control
                type="file"
                accept="image/*"
                style={{ fontSize: 14 }}
                as="input"
                {...field}></Form.Control>
            )}
          />
          {errors.image && (
            <Form.Control.Feedback tooltip>{errors.image.message}</Form.Control.Feedback>
          )}
        </Form.Group>
        {errorMsg ? <p>{errorMsg}</p> : null}
        <Button
          variant="primary"
          type="submit"
          style={{
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
