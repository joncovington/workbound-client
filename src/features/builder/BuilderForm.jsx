import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useFetchCategoriesQuery } from "api/apiSlice";
import {
  Transition,
  Grid,
  Segment,
  Button,
  Message,
  Dimmer,
  Loader,
  Header,
  Icon,
  Popup,
  Modal,
} from "semantic-ui-react";

import {
  openInfoForm,
  setSections,
  addSection,
  removeSection,
} from "features/builder/builderSlice";

import BuilderList from "features/builder/components/BuilderList.component";
import AddButton from "features/builder/components/AddButton";
import AddWorkItemModal from "features/builder/AddWorkItemModal";

export const BuilderForm = () => {
  const { workItems, sections, dialogPage } = useSelector(
    (state) => state.builder
  );
  const currentPath = useSelector((state) => state.router.location.pathname);
  const open = currentPath === '/build'

  const dispatch = useDispatch();
  const isSignedIn = useSelector((state) => state.auth?.isSignedIn);
  const isPermFetched = useSelector((state) => state.user?.isPermFetched);
  const [showHelp, setShowHelp] = useState(false);
  const [openAddWorkItem, setOpenAddWorkItem] = useState(false);

  const {
    data: categories,
    isFetching: catFetching,
    isLoading: catLoading,
    isSuccess: catSuccess,
    isError: isCatError,
    error: catError,
  } = useFetchCategoriesQuery(
    { page: null, pageSize: null, titleSearch: null },
    { skip: !isSignedIn || !isPermFetched }
  );

  const handleAddSection = (value) => {
    let oldSection = categories?.results.find((cat) => cat.id === value);
    const newSection = {
      id: oldSection.id,
      title: oldSection.title,
      tasks: [],
    };
    dispatch(addSection({ section: newSection }));
    setOpenAddWorkItem(true);
  };

  const handleRemoveSection = (index) => {
    dispatch(removeSection({ section: index }));
  };

  const setNewSections = (sections) => {
    dispatch(setSections({ sections: sections }));
  };

  if (isCatError) {
    console.log(catError);
    return (
      <Transition visible={open && dialogPage === "form"}>
        <Segment basic>
          <Message negative>
            <Message.Content>There was an error.</Message.Content>
          </Message>
        </Segment>
      </Transition>
    );
  }

  if (catFetching || catLoading) {
    return (
      <Transition visible={open && dialogPage === "form"}>
        <Segment basic>
          <Dimmer active inverted>
            <Loader inverted>Loading</Loader>
          </Dimmer>
        </Segment>
      </Transition>
    );
  }

  if (catSuccess) {
    return (
      <Transition
        visible={open && dialogPage === "form"}
        duration={{ hide: 0, show: 500 }}
        unmountOnHide
      >
        <Grid as={Segment} style={{ marginTop: 0 }}>
          <Grid.Row columns={2} style={{ paddingTop: "10px" }}>
            <Grid.Column>
              <Header as="h4" className="builderHeader">
                Set Up Sections/WorkItems
              </Header>
            </Grid.Column>
            <Grid.Column verticalAlign="top" textAlign="right">
              <Popup
                content="What is a Section?"
                size="mini"
                position="bottom right"
                trigger={
                  <Icon
                    className="helpIcon"
                    name="question circle outline"
                    onClick={() => setShowHelp(true)}
                  />
                }
              />
              <Modal basic onClose={() => setShowHelp(false)} open={showHelp}>
                <Header>What is a Section?</Header>
                <Modal.Content>
                  <p>
                    A section is a grouping of work items that should be
                    completed together.
                  </p>
                  <p>
                    Once all of the work items in a section are complete, a user
                    will move to the next section.
                  </p>
                </Modal.Content>
                <Modal.Actions>
                  <Button
                    basic
                    color="red"
                    inverted
                    onClick={() => setShowHelp(false)}
                  >
                    <Icon name="remove" /> Close
                  </Button>
                </Modal.Actions>
              </Modal>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column textAlign="center">
              <AddButton
                items={categories}
                handleAdd={handleAddSection}
                content="Add Section"
              />
              <AddWorkItemModal
                open={openAddWorkItem}
                close={() => setOpenAddWorkItem(false)}
                section={sections[sections.length - 1]}
                dispatch={dispatch}
                workItems={workItems}
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column style={{ height: "100%" }}>
              <BuilderList
                items={sections}
                setItems={setNewSections}
                removeItem={handleRemoveSection}
              ></BuilderList>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row
            style={{ borderTop: "1px solid rgba(34,36,38,.15)" }}
            columns={2}
          >
            <Grid.Column textAlign="left">
              <Button
                labelPosition="right"
                content="Back"
                icon="arrow left"
                onClick={() => dispatch(openInfoForm)}
              />
            </Grid.Column>
            <Grid.Column textAlign="right">
              <Button
                labelPosition="left"
                color="green"
                content="Proceed"
                icon="arrow right"
                onClick={() => console.log("Proceed Clicked")}
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Transition>
    );
  }

  return null;
};

export default BuilderForm;
