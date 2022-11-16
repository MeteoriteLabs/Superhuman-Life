export const SessionReducer = (state: any, action: any) => {
     switch(action.type) {
          case 'CREATE_SESSION':
               console.log('CREATE_SESSION');
               console.log(state);
               return state;
          default:
               return state;
     }
}