import workboundApi from "../api/workboundApi";
import { 
    SIGN_IN,
    SIGN_IN_FAILURE,
    SIGN_IN_SUCCESS,
    SIGN_OUT,
} from "./types";

export const signIn = (formValues, history) => async dispatch => {
    dispatch({type: SIGN_IN})
    await workboundApi.post('/api/v1/user/token/', { ...formValues })
    .then(response => {
        if (response.data.token){
            dispatch({
                type: SIGN_IN_SUCCESS,
                payload: response.data
            });
            history.push('/');
        }
    })
    .catch(error => {
        dispatch({
            type: SIGN_IN_FAILURE,
            payload: error.response
        });
    })
};

export const signOut = (history) => dispatch => {
    console.log('Signing Out');
    dispatch({ type: SIGN_OUT});
    history.push('/');
};