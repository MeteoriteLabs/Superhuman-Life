import { createContext } from 'react'
// import { SessionReducer } from '../reducers/sessionReducers';

type SessionType = {
    id: string
    name: string
    time: string
}

type InitialStateType = {
    sessions: SessionType[]
}

const initialState = {
    sessions: []
}

// const AppContext = createContext<{
//      state: InitialStateType;
//      dispatch: React.Dispatch<any>;
//    }>({
//      state: initialState,
//      dispatch: () => null
// });

// const mainReducer = ({ sessions }, action) => ({
//      session: SessionReducer(sessions, action),
// });

export default createContext<InitialStateType>(initialState)
