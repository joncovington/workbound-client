import { 
    SIGN_IN,
    SIGN_OUT,
    SIGN_IN_SUCCESS,
    SIGN_IN_FAILURE
} from "../actions/types";

const INITIAL_STATE = {
    isSignedIn: null,
    error: null,
    token: null
};

 const authReducer =  (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case SIGN_IN:
            return { ...state }
        case SIGN_IN_SUCCESS:
            return { ...state, ...action.payload, isSignedIn: true }
        case SIGN_IN_FAILURE:
            return { ...state, error: action.payload }
        case SIGN_OUT:
            return { ...state, isSignedIn: false, token: null }
        default:
            return state;
    }
};

export default authReducer;