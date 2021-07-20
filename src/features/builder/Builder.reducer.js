import { OPEN_MENU,
         OPEN_INFOFORM,
         SET_BUILD,
         OPEN_TEMPLATE,
         SET_REFERENCE, 
         OPEN_FORM} from "./Builder.types"

export const initialState = {
    dialogPage: '',
    buildType: '',
    referenceId: ''
}

export function builderReducer(state, action) {
    switch (action.type) {
        case OPEN_MENU:
            return {...state,
                    dialogPage: 'menu',
                    buildType: ''}
        case SET_BUILD:
            return {...state,
                    buildType: action.buildType
                    }
        case OPEN_TEMPLATE:
            return {...state,
                    dialogPage: 'template'}
        case OPEN_INFOFORM:
            return {...state,
                    dialogPage: 'infoForm'}
        case SET_REFERENCE:
            return {...state,
                    referenceId: action.referenceId}
        case OPEN_FORM:
            return {...state,
                    dialogPage: 'form'}
        case 'CLOSE_ALL':
            return initialState
        default:
            throw new Error()
    }
}