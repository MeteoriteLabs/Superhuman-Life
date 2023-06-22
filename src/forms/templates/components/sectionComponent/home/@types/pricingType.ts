export type DataTs = {
    websiteSections: {
      data: {
        id: number;
        attributes: {
          sectionData: SectionDataTs;
        };
      }[];
    };
  };

  export type SectionDataTs = {
        title: string;
        plans: ServerPlansTs;
        currency: string;
  }

export type ServerPlansTs = {
    actual: string;
    button: { link: string; text: string };
    discount: string;
    features: [string];
    price: string;
    recurring: string;
    title: string;
  }[];

export type ClientPlansTs = {
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
    plans: ClientPlansTs[];
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