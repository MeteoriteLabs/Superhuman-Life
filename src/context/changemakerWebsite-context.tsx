import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import authContext from './auth-context';
import { useLazyQuery } from '@apollo/client';
import { FETCH_USER_WEBSITE } from 'pages/website-builder/queries/changemakerWebsite';
import {
    changeMakerWebsiteStateTs,
    changeMakerWebsiteTs
} from '../types/changemakerWebsiteContext';
import { FETECH_SELECTED_TEMPLATE } from 'pages/website-builder/queries/templates';

export const ChangeMakerWebsiteContext = createContext<changeMakerWebsiteTs>({
    changemakerWebsiteState: {
        domain: null,
        subdomain: null,
        selectedTemplate: null,
        thumbnail: null,
        templateUrl: null,
        loading: false,
        section: null,
        page: null
    },
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setChangemakerWebsiteState: () => {}
});

function ChangemakerWebsiteContextProvider({ children }: { children: ReactNode }): JSX.Element {
    const auth = useContext(authContext); // * auth context is wrapped over this context, so we can use it here

    const [changemakerWebsiteState, setChangemakerWebsiteState] =
        useState<changeMakerWebsiteStateTs>({
            domain: '',
            subdomain: '',
            selectedTemplate: '',
            thumbnail: '',
            templateUrl: '',
            loading: false,
            section: 'Home: Hero',
            page: 'Home'
        });

    const [getUserWebsite, { data, error }] = useLazyQuery(FETCH_USER_WEBSITE, {
        variables: {
            id: auth.userid
        },
        onCompleted: () => {
            setChangemakerWebsiteState({
                ...changemakerWebsiteState,
                subdomain: data.changemakerWebsites.data[0].attributes.subdomain as string,
                selectedTemplate: data.changemakerWebsites.data[0].attributes
                    .selectedTemplate as string
            });
        },
        onError: () => {
            if (error?.message) {
                console.log('not error:', error.message);
            }
        }
    });

    useEffect(() => {
        if (auth.userid) {
            getUserWebsite();
        }
    }, [changemakerWebsiteState.subdomain, changemakerWebsiteState.selectedTemplate, auth.userid]);

    const [getUserSelectedTemplate, { data: templateData, error: templateError }] = useLazyQuery(
        FETECH_SELECTED_TEMPLATE,
        {
            variables: {
                templateName: changemakerWebsiteState.selectedTemplate
            },
            onCompleted: () => {
                setChangemakerWebsiteState({
                    ...changemakerWebsiteState,
                    thumbnail: templateData?.templates?.data[0]?.attributes?.thumbnail as string,
                    templateUrl: templateData?.templates?.data[0]?.attributes?.templateUrl as string
                });
            },
            onError: () => {
                if (templateError?.message) {
                    console.log(templateError?.message);
                }
            }
        }
    );

    useEffect(() => {
        if (auth.userid) {
            getUserSelectedTemplate();
        }
    }, [changemakerWebsiteState.selectedTemplate, auth.userid]);

    //  * user selected template to get the thumbnail and templateUrl ends here

    return (
        <ChangeMakerWebsiteContext.Provider
            value={{
                changemakerWebsiteState,
                setChangemakerWebsiteState
            }}
        >
            {children}
        </ChangeMakerWebsiteContext.Provider>
    );
}

export default ChangemakerWebsiteContextProvider;
