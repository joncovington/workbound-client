import React, { useReducer, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { push } from 'connected-react-router';
import { Grid } from 'semantic-ui-react';

import { builderReducer, initialState } from './Builder.reducer';
import { OPEN_MENU } from 'features/builder/Builder.types';
import BuilderHeader from 'features/builder/BuilderHeader';
import BuilderSteps from 'features/builder/BuilderSteps';
import './builder.css'
import BuilderMenu from 'features/builder/BuilderMenu';
import BuilderInfoForm from 'features/builder/BuilderInfoForm';
import BuilderForm from 'features/builder/BuilderForm';
import BuilderBreadcrumbs from 'features/builder/BuilderBreadcrumbs';

const Builder = (props) => {
    const { open } = props;
    const storeDispatch = useDispatch()
    const currentPath = useSelector(state => state.router.location.pathname)
    const [ state, dispatch ] = useReducer(builderReducer, initialState);

    useEffect(() => {
        if (currentPath !== '/build') {
            dispatch({type: OPEN_MENU})
        }
    }, [currentPath, dispatch])

    useEffect(() => {
        console.log(state)
    }, [state])

    function closeFn() {
        storeDispatch(push('/'))
    }

    function resetFn() {
        dispatch({type: OPEN_MENU})
    }

    return (
        <div>
            <BuilderHeader state={state} open={open} closeFn={closeFn} resetFn={resetFn}/>
            <Grid>
                <Grid.Column only='mobile'>
                    <BuilderBreadcrumbs open={open} state={state} dispatch={dispatch}/>
                </Grid.Column>
            </Grid>
            <Grid centered>
                <Grid.Column width={4} only='tablet computer'>
                    <BuilderSteps state={state} open={open} />
                </Grid.Column>
                <Grid.Column widescreen={12} tablet={12} computer={12} mobile={16}>
                    <BuilderMenu open={open} state={state} dispatch={dispatch}/>
                    <BuilderInfoForm open={open} state={state} dispatch={dispatch}/>
                    <BuilderForm open={open} state={state} dispatch={dispatch}/>
                </Grid.Column>
            </Grid>
            
            
        </div>
    )
}

export default Builder;