import { OPEN_MENU,
         OPEN_INFOFORM,
         SET_BUILD,
         OPEN_TEMPLATE,
         SET_REFERENCE, 
         OPEN_FORM,
         SET_SECTIONS } from "features/builder/redux/Builder.types"

export const initialState = {
    dialogPage: '',
    buildType: '',
    referenceId: '',
    sections: []
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
        case SET_SECTIONS:
            return {...state,
                    sections: action.sections}
        case 'CLOSE_ALL':
            return initialState
        default:
            throw new Error()
    }
}