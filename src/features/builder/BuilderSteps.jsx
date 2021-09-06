import React from "react";
import { useSelector } from "react-redux";
import { Transition, Grid, Step } from "semantic-ui-react";

export const BuilderSteps = () => {
  const { dialogPage, buildType } = useSelector((state) => state.builder);
  const currentPath = useSelector((state) => state.router.location.pathname);
  const open = currentPath === '/build'

  const steps = [
    {
      key: "action",
      title: "Action",
      description: "Choose your action",
      active: dialogPage === "menu",
    },
    {
      key: "basicInfo",
      title: "Basic Info",
      description: "Provide some basic info",
      active: dialogPage === "infoForm",
    },
    {
      key: buildType === "template" ? "template" : "form",
      title: buildType === "template" ? "Template" : "Build",
      description:
        buildType === "template" ? "Select template" : "Add Sections/WorkItems",
      active: dialogPage === "form" || dialogPage === "template",
    },
    {
      key: "review",
      title: "Review",
      description: "Finalize your build",
      active: dialogPage === "review",
    },
  ];

  return (
    <Transition
      visible={open}
      animation="fade right"
      duration={{ hide: 0, show: 500 }}
    >
      <Grid columns={1}>
        <Grid.Column>
          <Step.Group size="tiny" vertical fluid items={steps} />
        </Grid.Column>
      </Grid>
    </Transition>
  );
};

export default BuilderSteps;
