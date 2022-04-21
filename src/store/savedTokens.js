export const ADD_SAVED_TOKEN_ACTION = 'SET_USER_DATA_ACTION';


export function addSavedTokenAction(token){
    return {
        type: ADD_SAVED_TOKEN_ACTION,
        payload: { token },
    };
}


export const savedTokenReducer = (state = {}, action) => {
    switch(action.type){
        case ADD_SAVED_TOKEN_ACTION:
            console.log(state, action);

            return {

                ...state,
            };
        default:
            return state;
    }
};

