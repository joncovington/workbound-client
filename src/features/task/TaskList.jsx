import React, { useEffect, useReducer } from "react";
import { useSelector } from "react-redux";
import {
  useFetchTasksQuery,
  useDeleteTaskMutation,
  useAddTaskMutation,
  useUpdateTaskMutation,
} from "api/apiSlice";
import {
  Accordion,
  Label,
  Grid,
  Segment,
  Dimmer,
  Loader,
  Message,
} from "semantic-ui-react";
import { modalReducer, initialState } from "app/modalReducer";
import TaskForm from "features/task/TaskForm";

const TaskList = (props) => {
  const { user } = props;
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const isPermFetched = useSelector((state) => state.user.isPermFetched);
  const [state, dispatch] = useReducer(modalReducer, initialState);
  const MEDIA_ROOT = localStorage.getItem("wb_media_root");
  const taskPermissions = props.taskPermissions;
  const { setTaskCount, pageSize, titleSearch, page } = props;
  const {
    data: tasks,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useFetchTasksQuery(
    { page: page, pageSize: pageSize, titleSearch: titleSearch },
    { skip: !isSignedIn || !isPermFetched }
  );
  const [deleteTask] = useDeleteTaskMutation();
  const [addTask] = useAddTaskMutation();
  const [updateTask] = useUpdateTaskMutation();

  useEffect(() => {
    if (isSuccess) {
      setTaskCount(tasks.count);
    }
  }, [tasks, isSuccess, setTaskCount]);

  var results = [];

  if (isError) {
    console.log(error);
    return (
      <Segment basic>
        <Message negative>
          <Message.Content>There was an error.</Message.Content>
        </Message>
      </Segment>
    );
  }

  if (isFetching || isLoading) {
    return (
      <Segment basic>
        <Dimmer active inverted>
          <Loader inverted>Loading</Loader>
        </Dimmer>
      </Segment>
    );
  }

  const handleDelete = ({ id }) => {
    deleteTask({ taskId: id });
    dispatch({ type: "CLOSE_FORM_MODAL" });
  };

  const handleAddTask = (values) => {
    values["completion_days"] = values["completionDays"];
    delete values["completionDays"];
    values["created_by"] = user.id;
    dispatch({ type: "CLOSE_FORM_MODAL" });
    addTask(values);
  };

  const handleChangeTask = (values) => {
    const taskId = values["id"];
    delete values["id"];
    values["completion_days"] = values["completionDays"];
    delete values["completionDays"];
    dispatch({ type: "CLOSE_FORM_MODAL" });
    updateTask({ taskId: taskId, data: values });
  };

  const renderChangeTask = (task) => {
    return taskPermissions?.change_task?.status ? (
      <Label
        as="a"
        size="small"
        content="Edit"
        color="blue"
        icon="edit"
        onClick={() =>
          dispatch({
            type: "OPEN_EDIT_MODAL",
            obj: task,
            objType: "Task",
            onSubmit: handleChangeTask,
          })
        }
      />
    ) : null;
  };

  const renderAddTask = () => {
    return taskPermissions?.add_task?.status ? (
      <Label
        corner="right"
        icon="plus"
        as="a"
        color="green"
        onClick={() =>
          dispatch({
            type: "OPEN_ADD_MODAL",
            objType: "Task",
            onSubmit: handleAddTask,
          })
        }
      />
    ) : null;
  };

  const renderDeleteTask = (task) => {
    return taskPermissions?.delete_task?.status ? (
      <Label
        content="Delete"
        as="a"
        size="small"
        color="red"
        icon="remove circle"
        onClick={() =>
          dispatch({
            type: "OPEN_DELETE_MODAL",
            obj: task,
            objType: "Task",
            onSubmit: handleDelete,
          })
        }
      />
    ) : null;
  };

  const renderPanelContent = (task) => {
    let imageProps = {};
    if (task.created_by.profile.thumbnail) {
      imageProps = {
        avatar: true,
        spaced: "right",
        src: MEDIA_ROOT + task.created_by.profile.thumbnail,
      };
    }

    return (
      <>
        <Segment basic>
          <Grid>
            <Grid.Row>
              <Grid.Column width={4}>Description</Grid.Column>
              <Grid.Column width={12}>{task.description}</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>Typical Duration</Grid.Column>
              <Grid.Column width={12}>{task.duration} Minutes</Grid.Column>
            </Grid.Row>
            <Grid.Row>
              <Grid.Column width={4}>Days to Complete</Grid.Column>
              <Grid.Column width={12}>{task.completion_days} Days</Grid.Column>
            </Grid.Row>
          </Grid>
        </Segment>
        <Grid columns={2}>
          <Grid.Row>
            <Grid.Column textAlign="left" verticalAlign="middle">
              <small>Created By: </small>
              {task.created_by.profile.thumbnail ? (
                <Label
                  size="tiny"
                  color="blue"
                  content={task.created_by.email}
                  image={imageProps}
                />
              ) : (
                <Label
                  size="tiny"
                  color="blue"
                  icon="user"
                  content={task.created_by.email}
                />
              )}
            </Grid.Column>
            <Grid.Column textAlign="right" verticalAlign="bottom">
              {renderChangeTask(task)}
              {renderDeleteTask(task)}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </>
    );
  };

  if (isSuccess) {
    results = tasks.results;

    const panels = [];
    results.forEach((task, index) => {
      if (Object.keys(task).length > 0) {
        panels.push({
          key: `panel-${task["id"]}`,
          title: {
            content: task.title,
          },
          content: {
            content: renderPanelContent(task),
          },
        });
      }
    });

    const renderForm = () => {
      return (
        <TaskForm
          open={state.formOpen}
          onCancel={() => dispatch({ type: "CLOSE_FORM_MODAL" })}
          onSubmit={state.onSubmit}
          task={state.obj}
          actionButtonText={state.actionButtonText}
          isDelete={state.isDelete}
          formHeader={state.formHeader}
        />
      );
    };

    return results.length > 0 ? (
      <>
        {" "}
        {renderAddTask()}
        <Segment basic>
          <Accordion fluid styled panels={panels} />
        </Segment>
        {renderForm()}
      </>
    ) : (
      <>
        <Message warning>
          <Grid>
            <Grid.Row>
              <Grid.Column width={8}>There are 0 tasks.</Grid.Column>
              <Grid.Column textAlign="right" width={8}>
                {taskPermissions?.add_task?.status ? (
                  <Label
                    content="Add Task"
                    icon="plus"
                    as="a"
                    color="green"
                    onClick={() =>
                      dispatch({
                        type: "OPEN_ADD_MODAL",
                        objType: "Task",
                        onSubmit: handleAddTask,
                      })
                    }
                  />
                ) : null}
              </Grid.Column>
            </Grid.Row>
          </Grid>
        </Message>
        {renderForm()}
      </>
    );
  }

  return null;
};

export default TaskList;
