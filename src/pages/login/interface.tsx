export interface Schema {
    password: {
        'ui:widget': string
        'ui:help': string
        classNames: string
    }
}

export interface FormData {
    email: string
    password: string
}

export interface LoginPayload {
    jwt: string
    user: {
        email: string
        id: string
        username: string
        __typename: string
    }
    __typename: string
}

export interface LoginData {
    login: LoginPayload
}

export interface LoginJSON {
    title: string
    description: string
    type: string
    required: string[]
    properties: {
        email: {
            type: string
            format: string
            title: string
        }
        password: {
            type: string
            title: string
            minLength: number
        }
    }
}
