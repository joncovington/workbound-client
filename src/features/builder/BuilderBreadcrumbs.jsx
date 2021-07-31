import React from "react";
import { Transition, Grid, Breadcrumb } from "semantic-ui-react";

export const BuilderBreadcrumbs = ({ open, state }) => {
  const { dialogPage, buildType } = state;

  const sections = [
    {
      key: "action",
      content: "Action",
      active: dialogPage === "menu",
      style: dialogPage === "menu" ? { color: "#5fa5d9" } : {},
      divider: "right chevron",
    },
    {
      key: "basicInfo",
      content: "Basic Info",
      active: dialogPage === "infoForm",
      style: dialogPage === "infoForm" ? { color: "#5fa5d9" } : {},
    },
    {
      key: buildType === "template" ? "template" : "form",
      content: buildType === "template" ? "Template" : "Build",
      active: dialogPage === "form" || dialogPage === "template",
      style:
        dialogPage === "template" || dialogPage === "form"
          ? { color: "#5fa5d9" }
          : {},
    },
    {
      key: "review",
      content: "Review",
      active: dialogPage === "review",
      style: dialogPage === "review" ? { color: "#5fa5d9" } : {},
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
          <Breadcrumb sections={sections} divider={"\u27A3"} />
        </Grid.Column>
      </Grid>
    </Transition>
  );
};

export default BuilderBreadcrumbs;
