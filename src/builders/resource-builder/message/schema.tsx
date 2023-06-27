import Upload from '../../../components/upload/upload'

export const widgets = {
    upload: Upload
}
export const schema: any = {
    description: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 4
        }
    },
    minidesc: {
        'ui:widget': 'textarea',
        'ui:options': {
            rows: 2
        }
    },
    addMedia: {
        upload: {
            'ui:widget': (props: any) => {
                return (
                    <Upload
                        allowImage={true}
                        allowVideo={true}
                        onChange={props.onChange}
                        value={props.value}
                    />
                )
            }
        }
    },
    mediaurl: {
        'ui:placeholder': 'Enter URL eg: https://www.google.com'
    }
}
