import authReducer from "reducers/authReducer";
import { 
    SIGN_IN,
    SIGN_IN_FAILURE,
    SIGN_IN_SUCCESS,
    SIGN_OUT
} from 'actions/types';


const INITIAL_STATE = {
    isSignedIn: false,
    error: null,
    token: null
};

it("handles SIGN_IN action", () => {
    const action = {
        type: SIGN_IN
    }
    
    const newState = authReducer(INITIAL_STATE, action)
    expect(newState.isSignedIn).toEqual(false)
    expect(newState.error).toEqual(null)
    expect(newState.token).toEqual(null)
});

it("handles SIGN_IN_SUCCESS action", () => {
    const action = {
        type: SIGN_IN_SUCCESS,
        payload: {token: 'faketoken12345'}
    }

    const newState = authReducer(INITIAL_STATE, action)
    expect(newState.isSignedIn).toEqual(true)
    expect(newState.error).toEqual(null)
    expect(newState.token).toEqual('faketoken12345')
});

it("handles SIGN_IN_FAILURE action", () => {
    const action = {
        type: SIGN_IN_FAILURE,
        payload: {data: {non_field_errors: ["error message"]}}
    }

    const newState = authReducer(INITIAL_STATE, action)
    expect(newState.isSignedIn).toEqual(false)
    expect(newState.error.data.non_field_errors[0]).toEqual("error message")
    expect(newState.token).toEqual(null)
});

it("handles SIGN_OUT action", () => {
    const action = {
        type: SIGN_OUT
    };

    const LOGGED_IN_STATE = {
        isSignedIn: true,
        error: null,
        token: 'sometoken12345'
    };
    const newState = authReducer(LOGGED_IN_STATE, action)
    expect(newState.isSignedIn).toEqual(false)
    expect(newState.error).toEqual(null)
    expect(newState.token).toEqual(null)
});

it("handles unkoown action", () => {
    const action = {
        type: 'UNKNOWN_ACTION'
    };

    const newState = authReducer(INITIAL_STATE, action)
    expect(newState.isSignedIn).toEqual(false)
    expect(newState.error).toEqual(null)
    expect(newState.token).toEqual(null)
});