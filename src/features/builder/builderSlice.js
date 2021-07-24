import { createSlice } from "@reduxjs/toolkit";

const builderSlice = createSlice({
  name: "builder",
  initialState: {
    dialogPage: "",
    buildType: "",
    referenceId: "",
    sections: [],
    workItems: [],
    allowAddWorkItem: true,
  },
  reducers: {
    openMenu: (state) => {
      state.dialogPage = "menu";
      state.buildType = "";
    },
    resetBuilder: (state) => {
      state.dialogPage = "";
      state.buildType = "";
      state.referenceId = "";
      state.sections = [];
      state.workItems = [];
      state.allowAdd = true;
    },
    openInfoForm: (state) => {
      state.dialogPage = "infoForm";
    },
    setBuildType: (state, action) => {
      state.buildType = action.payload.buildType;
    },
    setReference: (state, action) => {
      state.referenceId = action.payload.referenceId;
    },
    openTemplate: (state) => {
      state.dialogPage = "template";
    },
    openForm: (state) => {
      state.dialogPage = "form";
    },
    setSections: (state, action) => {
      state.sections = action.payload.sections;
    },
    addSection: (state, action) => {
      const addedSections = state.sections.concat(action.payload.section);
      state.sections = addedSections;
    },
    removeSection: (state, action) => {
      const hasRemovedSections = state.sections.filter(
        (element, index) => index !== action.payload.section
      );
      state.sections = hasRemovedSections;
    },
    setWorkItems: (state, action) => {
      state.workItems = action.payload.workItems;
    },
    addWorkItem: (state, action) => {
      const addedWorkItems = state.workItems.concat(action.payload.workItem);
      state.workItems = addedWorkItems;
    },
    removeWorkItem: (state, action) => {
      const hasRemovedWorkItems = state.workItems.filter(
        (element, index) => index !== action.payload.workItem
      );
      state.workItems = hasRemovedWorkItems;
    },
    setAllowAddWorkItem: (state, action) => {
      state.allowAddWorkItem = action.payload
    },
  },
});

export const {
  openMenu,
  resetBuilder,
  openInfoForm,
  setBuildType,
  setReference,
  openForm,
  openTemplate,
  setSections,
  addSection,
  removeSection,
  setWorkItems,
  addWorkItem,
  removeWorkItem,
  setAllowAddWorkItem
} = builderSlice.actions;

export default builderSlice.reducer;
