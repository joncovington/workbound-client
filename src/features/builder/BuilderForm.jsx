import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useFetchCategoriesQuery } from "api/apiSlice";
import {
  Transition,
  Grid,
  Segment,
  Button,
  Dropdown,
  Message,
  Dimmer,
  Loader,
  Header,
  Icon,
  Popup,
  Modal
} from "semantic-ui-react";

import { OPEN_INFOFORM, SET_SECTIONS } from "features/builder/redux/Builder.types";

import BuilderList from "features/builder/components/BuilderList.component";

export const BuilderForm = ({ open, state, dispatch }) => {
  const { dialogPage, sections } = state;
  const isSignedIn = useSelector((state) => state.auth.isSignedIn);
  const [showHelp, setShowHelp] = useState(false);
  const [titleSearch, setTitleSearch] = useState("");
  const [categoryOptions, setCategoryOptions] = useState([]);

  const {
    data: categories,
    isFetching: catFetching,
    isLoading: catLoading,
    isSuccess: catSuccess,
    isError: isCatError,
    error: catError,
  } = useFetchCategoriesQuery(
    { page: null, pageSize: null, titleSearch: titleSearch },
    { skip: !isSignedIn }
  );

  const handleChangeSection = (e, { value }) => {
    handleAddSection(value);
  };

  const handleAddSection = (value) => {
    const newUserSections = [];
    let oldSection = categories?.results.find((cat) => cat.id === value)
    const newSection = {id: oldSection.id, title: oldSection.title, tasks: []}
    newUserSections.push(newSection);
    dispatch({type: SET_SECTIONS, sections: (sections.concat(newUserSections))})
  };

  const setSections = (sections) => {
    dispatch({type: SET_SECTIONS, sections: sections})
  }

  useEffect(() => {
    if (catSuccess && categories.results.length > 0) {
      let options = [];
      categories.results.forEach((category) => {
        options.push({
          key: `cat_${category.id}`,
          value: category.id,
          text: category.title,
        });
      });
      setCategoryOptions(options);
    }
  }, [catSuccess, categories, setCategoryOptions]);

  useEffect(() => {
    if (dialogPage === "menu") {
      dispatch({type: SET_SECTIONS, sections: []})
    }
  }, [dialogPage, dispatch]);

  if (isCatError) {
    console.log(catError);
    return (
      <Transition visible={open && state.dialogPage === "form"}>
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
      <Transition visible={open && state.dialogPage === "form"}>
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
        visible={open && state.dialogPage === "form"}
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
              <Dropdown
                text="Add Section"
                labeled
                button
                options={categoryOptions}
                onChange={handleChangeSection}
                icon="add"
                className="icon"
              />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row columns={1}>
            <Grid.Column style={{ height: "100%" }}>
              <BuilderList items={sections} setItems={setSections}></BuilderList>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row style={{ borderTop: "1px" }} columns={2}>
            <Grid.Column textAlign="left">
              <Button
                labelPosition="right"
                content="Back"
                icon="arrow left"
                onClick={() => dispatch({ type: OPEN_INFOFORM })}
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
