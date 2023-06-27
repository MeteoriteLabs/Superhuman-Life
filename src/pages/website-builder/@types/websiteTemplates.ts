export interface Template {
    id: string
    attributes: {
        templateName: string
        CreatedBy: string
        logo: string
        thumbnail: string
        description: string | null
        features: string[]
        goodFor: string[]
        defaultData: any | null
        templateUrl: string
    }
}

export interface FetchedTemplates {
    templates: {
        data: Template[]
    }
}
