import {
  OPEN_MENU,
  OPEN_INFOFORM,
  SET_BUILD,
  OPEN_TEMPLATE,
  SET_REFERENCE,
  OPEN_FORM,
  SET_SECTIONS,
  ADD_SECTION,
  REMOVE_SECTION,
  SET_WORKITEMS,
  ADD_WORKITEM,
  REMOVE_WORKITEM,
  SET_ALLOW_ADD,
} from "features/builder/redux/Builder.types";

export const initialState = {
  dialogPage: "",
  buildType: "",
  referenceId: "",
  sections: [],
  workItems: [],
  allowAdd: true,
};

export function builderReducer(state, action) {
  switch (action.type) {
    case SET_BUILD:
      return { ...state, buildType: action.buildType };
    case OPEN_TEMPLATE:
      return { ...state, dialogPage: "template" };
    case OPEN_INFOFORM:
      return { ...state, dialogPage: "infoForm" };
    case SET_REFERENCE:
      return { ...state, referenceId: action.referenceId };
    case OPEN_FORM:
      return { ...state, dialogPage: "form" };
    case SET_SECTIONS:
      return { ...state, sections: action.sections };
    case ADD_SECTION:
      const addedSections = state.sections.concat(action.section);
      return { ...state, sections: addedSections };
    case REMOVE_SECTION:
      const hasRemovedSections = state.sections.filter(
        (element, index) => index !== action.section
      );
      return { ...state, sections: hasRemovedSections };
    case SET_WORKITEMS:
      return { ...state, workItems: action.workItems };
    case ADD_WORKITEM:
      const addedWorkItems = state.workItems.concat(action.workItem);
      return { ...state, workItems: addedWorkItems };
    case REMOVE_WORKITEM:
      const hasRemovedWorkItems = state.workItems.filter(
        (element, index) => index !== action.workItem
      );
      return { ...state, workItems: hasRemovedWorkItems };
    case SET_ALLOW_ADD:
      return { ...state, allowAdd: action.allowAdd };
    case "CLOSE_ALL":
      return initialState;
    default:
      throw new Error();
  }
}
