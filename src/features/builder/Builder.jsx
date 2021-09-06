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
  
  const dispatch = useDispatch();
  
  const builderState = useSelector((state) => state.builder);
  const currentPath = useSelector((state) => state.router.location.pathname);

  useEffect(() => {
    if (currentPath !== "/build") {
      dispatch(openMenu());
    }
  }, [currentPath, dispatch]);

  useEffect(() => {
    console.log("Builder State: ", builderState);
  }, [builderState]);

  function closeFn() {
    dispatch(push("/"));
  }

  function resetFn() {
    dispatch(openMenu());
  }

  return (
    <div>
      <BuilderHeader
        closeFn={closeFn}
        resetFn={resetFn}
      />
      <Grid>
        <Grid.Column only="mobile">
          <BuilderBreadcrumbs />
        </Grid.Column>
      </Grid>
      <Grid centered>
        <Grid.Column width={4} only="tablet computer">
          <BuilderSteps />
        </Grid.Column>
        <Grid.Column widescreen={12} tablet={12} computer={12} mobile={16}>
          <BuilderMenu state={builderState} dispatch={dispatch} />
          <BuilderInfoForm />
          <BuilderForm />
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default Builder;
