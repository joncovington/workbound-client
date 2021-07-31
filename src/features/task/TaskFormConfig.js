import * as Yup from "yup";

export const taskSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required.")
    .matches(/^[A-Za-z0-9 ]+$/, "Must be alphanumeric. No special characters"),
  description: Yup.string().required("Description is required."),
  duration: Yup.number()
    .required("Duration is required.")
    .min(1, "Must be greater than zero."),
  completionDays: Yup.number()
    .required("Duration is required.")
    .min(1, "Must be greater than zero."),
});

export const taskFormConfig = [
  {
    name: "title",
    label: "Title",
    type: "text",
  },
  {
    name: "description",
    label: "Description",
    type: "text",
  },
  {
    type: "group",
    name: "number-group",
    widths: "equal",
    config: [
      {
        name: "duration",
        label: "Duration",
        type: "number",
        min: "0",
        errorPoint: "above",
      },
      {
        name: "completionDays",
        label: "Days until Completion",
        type: "number",
        min: "0",
        errorPoint: "above",
      },
    ],
  },
];

export const taskInitialValues = (task = null) => {
  let initialValues = {
    id: -1,
    title: "",
    description: "",
    duration: "0",
    completionDays: "0",
  };

  if (task !== null) {
    initialValues = {
      id: task.id,
      title: task.title,
      description: task.description,
      duration: task.duration,
      completionDays: task.completion_days,
    };
  }

  return initialValues;
};
