export const initialState = {
    formOpen: false,
    obj: null,
    isDelete: false,
    formHeader: '',
    actionButtonText: '',
    onSubmit: null
}

export function modalReducer(state, action) {
    switch (action.type) {
        case 'OPEN_DELETE_MODAL':
            return {...state,
                    formOpen: true,
                    formHeader: `Delete ${action.objType}: "${action.obj.title}"`,
                    obj: action.obj,
                    isDelete: true,
                    actionButtonText: `Delete ${action.objType}`,
                    onSubmit: action.onSubmit}
        case 'OPEN_ADD_MODAL':
            return {...state,
                    formOpen: true,
                    formHeader: `Add a ${action.objType}`,
                    actionButtonText: `Add ${action.objType}`,
                    obj: null,
                    onSubmit: action.onSubmit}
        case 'OPEN_EDIT_MODAL':
            return {...state,
                    formOpen: true,
                    formHeader: `Edit ${action.objType}: "${action.obj.title}"`,
                    actionButtonText: `Update ${action.objType}`, 
                    obj: action.task,
                    onSubmit: action.onSubmit}
        case 'CLOSE_FORM_MODAL':
            return {...state,
                    formOpen: false,
                    formHeader: '',
                    actionButtonText: '',
                    category: null,
                    isDelete: false,
                    onSubmit: null}
        default:
            throw new Error()
    }
}