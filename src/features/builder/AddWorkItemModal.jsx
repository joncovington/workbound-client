import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Modal, TransitionablePortal, Grid, Message, Loader, Button } from "semantic-ui-react";

import { useFetchTasksQuery } from "api/apiSlice";
import AddButton from "features/builder/components/AddButton";
import BuilderList from "features/builder/components/BuilderList.component";
import { addWorkItem, removeWorkItem, setWorkItems, setAllowAddWorkItem, removeSection } from "features/builder/builderSlice";

const AddWorkItemModal = ({ open, section, close, workItems }) => {
  const dispatch = useDispatch()
  const allowProceed = useSelector((state) => state.builder.allowAddWorkItem)
  const sections = useSelector((state) => state.builder.sections)
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const {
    data: tasks,
    isFetching,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useFetchTasksQuery(
    { page: null, pageSize: null, titleSearch: null },
    { skip: !isSignedIn }
  );

  const handleAddWorkItem = (value) => {
    const oldWorkItem = tasks?.results.find((item) => item.id === value)
    console.log()
    const newWorkItem = {id: oldWorkItem.id, title: oldWorkItem.title, assignedTo: null}
    dispatch(addWorkItem({workItem: newWorkItem}))
  }

  const handleRemoveWorkItem = (value) => {
    dispatch(removeWorkItem({workItem: value}))
  }

  const handleCancel = () => {
    console.log(section)
    const sectionIndex = sections.findIndex(el => el.id === section.id)
    dispatch(setWorkItems({workItems: []}))
    close()
    dispatch(removeSection({section: sectionIndex}))
  }

  useEffect(() => {
    let assigned = []
    workItems.forEach(item => {
      assigned.push(item.assignedTo)
    })
   if (assigned.every(value => value !== null)) {
    dispatch(setAllowAddWorkItem(true))
   } else {
    dispatch(setAllowAddWorkItem(false))
   }
  }, [workItems])

  if (isFetching || isLoading) {
    return (
      <TransitionablePortal
        transition={{ animation: "fade up", duration: 500 }}
        open={open && isLoading}
      >
        <Modal
          open={true}
          dimmer
          closeOnEscape={true}
          closeOnDimmerClick={true}
        >
        <Modal.Content>
          <Loader/>
        </Modal.Content>
        </Modal>
      </TransitionablePortal>
    );
  };

  if (isError) {
    console.log(error);
    return (
      <TransitionablePortal
        transition={{ animation: "fade up", duration: 500 }}
        open={open && isError}
      >
        <Modal
          open={true}
          dimmer
          closeOnEscape={true}
          closeOnDimmerClick={true}
        >
        <Modal.Content>
          <Message negative>
            <Message.Content>There was an error.</Message.Content>
          </Message>
        </Modal.Content>
        </Modal>
      </TransitionablePortal>
    );
  };

  if (isSuccess) {
    return (
      <TransitionablePortal
        transition={{ animation: "fade up", duration: 500 }}
        open={open && isSuccess}
      >
        <Modal
          open={true}
          dimmer
          closeOnEscape={false}
          closeOnDimmerClick={false}
        >
          <Modal.Header>Add WorkItems</Modal.Header>
          <Modal.Content>
            <Grid>
              <Grid.Row>
                <Grid.Column>You selected : '{section?.title}'</Grid.Column>
              </Grid.Row>
              <Grid.Row>
                <Grid.Column>
                  <BuilderList section={section} items={workItems} removeItem={handleRemoveWorkItem} setItems={(items) => dispatch(setWorkItems({workItems: items}))}
                 />
                </Grid.Column>
              </Grid.Row>
              <Grid.Row columns='equal'>
              <Grid.Column textAlign="center">
                <Button
                  labelPosition="right"
                  content="Cancel"
                  icon="arrow left"
                  onClick={handleCancel}
                />
              </Grid.Column>
                <Grid.Column textAlign='center'><AddButton items={tasks} handleAdd={handleAddWorkItem} content='Add WorkItem'/></Grid.Column>
                <Grid.Column textAlign='center'>
                  {<Button
                    disabled={!allowProceed || workItems.length === 0}
                    labelPosition="left"
                    color="green"
                    content="Proceed"
                    icon="arrow right"
                    onClick={() => console.log("Proceed Clicked")}
                  />}
                </Grid.Column>
              </Grid.Row>
            </Grid>
          </Modal.Content>
        </Modal>
      </TransitionablePortal>
    );
  };

  return null;
  
};

export default AddWorkItemModal;
