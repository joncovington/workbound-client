import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { Grid } from "semantic-ui-react";

import { openMenu } from "features/builder/builderSlice";
import BuilderHeader from "features/builder/BuilderHeader";
import BuilderSteps from "features/builder/BuilderSteps";
import "./builder.css";
import BuilderMenu from "features/builder/BuilderMenu";
import BuilderInfoForm from "features/builder/BuilderInfoForm";
import BuilderForm from "features/builder/BuilderForm";
import BuilderBreadcrumbs from "features/builder/BuilderBreadcrumbs";

const Builder = (props) => {
  const { open } = props;
  const dispatch = useDispatch();
  const currentPath = useSelector((state) => state.router.location.pathname);
  const state = useSelector((state) => state.builder);

  useEffect(() => {
    if (currentPath !== "/build") {
      dispatch(openMenu());
    }
  }, [currentPath, dispatch]);

  useEffect(() => {
    console.log("Builder State: ", state);
  }, [state]);

  function closeFn() {
    dispatch(push("/"));
  }

  function resetFn() {
    dispatch(openMenu());
  }

  return (
    <div>
      <BuilderHeader
        state={state}
        open={open}
        closeFn={closeFn}
        resetFn={resetFn}
      />
      <Grid>
        <Grid.Column only="mobile">
          <BuilderBreadcrumbs open={open} state={state} dispatch={dispatch} />
        </Grid.Column>
      </Grid>
      <Grid centered>
        <Grid.Column width={4} only="tablet computer">
          <BuilderSteps state={state} open={open} />
        </Grid.Column>
        <Grid.Column widescreen={12} tablet={12} computer={12} mobile={16}>
          <BuilderMenu open={open} state={state} dispatch={dispatch} />
          <BuilderInfoForm open={open} />
          <BuilderForm open={open} />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Builder;
