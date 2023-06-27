export type Data = {
    websiteSections: {
      data: {
        id: number;
        attributes: {
          sectionData: SectionData;
        };
      }[];
    };
  };

  export type SectionData = {
        title: string;
        plans: ServerPlans;
        currency: string;
  }

export type ServerPlans = {
    actual: string;
    button: { link: string; text: string };
    discount: string;
    features: [string];
    price: string;
    recurring: string;
    title: string;
  }[];

export type ClientPlans = {
    actual: string;
    buttonLink: string;
    buttonText: string;
    discount: string;
    features: [string];
    price: string;
    recurring: string;
    title: string;
}
  
 export type FormData = {
    sectionId: number;
    title: string;
    currency: string;
    plans: ClientPlans[];
  };
  
 export type InputProps =
    | 'actual'
    | 'buttonLink'
    | 'buttonText'
    | 'discount'
    | 'features'
    | 'price'
    | 'recurring'
    | 'title';