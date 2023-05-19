export interface Exercise {
    exercises: {
      data: {
        attributes: {
          equipment_lists: {
            data: {
              attributes: {
                name: string;
                updatedAt: string;
              };
              id: string;
              __typename: string;
            }[];
            length: number;
            __typename: string;
          };
          exerciselevel: string;
          exercisename: string;
          exercisetext: null;
          exerciseurl: string;
          fitnessdisciplines: {
            data: {
              attributes: {
                disciplinename: string;
              };
              id: string;
              __typename: string;
            }[];
            length: number;
            __typename: string;
          };
          muscle_groups: {
            data: {
              attributes: {
                name: string;
              };
              id: string;
              __typename: string;
            }[];
            length: number;
            __typename: string;
          };
          updatedAt: string;
          users_permissions_user: {
            data: {
              id: string;
              __typename: string;
            };
            __typename: string;
          };
          __typename: string;
        };
        id: string;
        __typename: string;
      };
      __typename: string;
    };
    id: string;
    __typename: string;
  }
  
  export interface FlattenExercise {
    exercises: {
      equipment_lists: {
        id: string;
        name: string;
        updatedAt: string;
        __typename: string;
      }[];
      exerciselevel: string;
      exercisename: string;
      exercisetext: null;
      exerciseurl: string;
      fitnessdisciplines: {
        disciplinename: string;
        id: string;
        __typename: string;
      }[];
      id: string;
      muscle_groups: {
        id: string;
        name: string;
        __typename: string;
      }[];
      updatedAt: string;
      users_permissions_user: {
        id: string;
        __typename: string;
      };
      __typename: string;
    }[];
    id: string;
    __typename: string;
  }
  