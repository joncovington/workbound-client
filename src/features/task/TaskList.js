import React, { Fragment, useEffect, useReducer } from 'react';
import { useFetchTasksQuery,
         useDeleteTaskMutation,
         useAddTaskMutation } from '../../api/apiSlice';
import { Accordion,
         Label,
         Grid,
         Segment,
         Dimmer,
         Loader,
         Message,
         TransitionablePortal,
         Modal,
         Button,
         Icon } from 'semantic-ui-react';

import AddTaskForm from './AddTaskForm';

const initialState = {
    addOpen: false,
    deleteOpen: false,
    task: null
}

function localReducer(state, action) {
    switch (action.type) {
        case 'OPEN_DELETE_MODAL':
            return {...state, deleteOpen: true, task: action.task}
        case 'CLOSE_DELETE_MODAL':
            return {...state, deleteOpen: false, task: null }
        case 'OPEN_ADD_MODAL':
            return {...state, addOpen: true, task: null}
        case 'CLOSE_ADD_MODAL':
            return {...state, addOpen: false, task: null }
        default:
            throw new Error()
    }
}

const TaskList = (props) => {
    const { user } = props;
    const [state, dispatch] = useReducer(localReducer, initialState);
    const MEDIA_ROOT = localStorage.getItem('wb_media_root')
    const taskPermissions = props.taskPermissions
    const {setTaskCount, pageSize, titleSearch, page} = props;
    const { data: tasks,
            isFetching,
            isLoading,
            isSuccess,
            isError,
            error } = useFetchTasksQuery({page: page,
                                            pageSize: pageSize, 
                                            titleSearch: titleSearch},
                                            );
    const [ deleteTask ] = useDeleteTaskMutation()
    const [ addTask ] = useAddTaskMutation()

    useEffect(() => {
        if (isSuccess){
            setTaskCount(tasks.count)
        }
    }, [tasks, isSuccess, setTaskCount])

    var results = []

    if (isError) {
        console.log(error)
        return (
            <Segment basic>
                <Message negative>
                    <Message.Content>There was an error.</Message.Content>
                </Message>
            </Segment>
        )
    }
    
    if (isFetching || isLoading) {
        return (
            <Segment basic>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            </Segment>
        )
    }

    const handleDelete = (id) => {
        deleteTask({taskId: id})
        dispatch({ type: 'CLOSE_DELETE_MODAL' })
    }

    const handleAddTask = (values) => {
        values['completion_days'] = values['completionDays']
        delete values['completionDays']
        values['created_by'] = user.id
        console.log(values)
        dispatch({ type: 'CLOSE_ADD_MODAL' })
        addTask(values)
    }

    const renderChangeTask = () => {
        if (taskPermissions.change_task !== undefined) {
            return taskPermissions.change_task.status
                ? <Label 
                    as='a' 
                    size='small' 
                    content='Edit' 
                    color='blue' 
                    icon='edit'
                />
                : null
        }
    }

    const renderAddTask = () => {
        if (taskPermissions.add_task !== undefined) {
            return taskPermissions.add_task.status
                ? <Label corner='right'
                    icon='plus'
                    as='a'
                    color='green'
                    onClick={() => dispatch({ type: 'OPEN_ADD_MODAL' })}
                    />
                : null
        }
    }

    const renderDeleteTask = (task) => {
        if (taskPermissions.delete_task !== undefined){
            return taskPermissions.delete_task.status
                ? <Label 
                   as='a' 
                   size='small' 
                   content='Delete' 
                   color='red' 
                   icon='remove circle'
                   onClick={() => dispatch({type: 'OPEN_DELETE_MODAL', task: task})}
                   />
                : null
        }
    }

    const renderPanelContent = (task) => {
        var imageProps = {}
        if (task.created_by.profile.thumbnail) {
              imageProps =   {
                avatar: true,
                spaced: 'right',
                src: MEDIA_ROOT + task.created_by.profile.thumbnail
            }
        }            

        return (
            <Fragment>
            <Segment basic>
                <Grid>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            Description
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {task.description}
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            Typical Duration
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {task.duration} Minutes
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column width={4}>
                            Days to Complete
                        </Grid.Column>
                        <Grid.Column width={12}>
                            {task.completion_days} Days
                        </Grid.Column>
                        
                    </Grid.Row>
                </Grid>                
            </Segment>
                <Grid columns={2}>
                        <Grid.Row>
                            <Grid.Column textAlign='left' verticalAlign='middle'><small>Created By: </small>
                            {
                            task.created_by.profile.thumbnail
                            ? <Label
                                
                                size='tiny'
                                color='blue'
                                content={task.created_by.email}
                                image={imageProps}
                                />
                            : <Label
                                size='tiny'
                                color='blue'
                                icon='user'
                                content={task.created_by.email}
                                />
                            }
                            </Grid.Column>
                            <Grid.Column textAlign='right' verticalAlign='bottom'>
                                {renderChangeTask()}{renderDeleteTask(task)}
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
            </Fragment>
        )

    }


    if (isSuccess){
        results = tasks.results;

        const panels = []
        results.forEach((task, index) =>{
            if(Object.keys(task).length > 0) {
                panels.push({
                    key: `panel-${task['id']}`,
                    title: {
                        content: task.title
                    },
                    content: {
                        content: renderPanelContent(task)
                    }
        
                })
            }
        })

        return (
            results.length > 0 ?
            <Fragment>
                <Segment basic>
                    {renderAddTask()}
                    <Accordion fluid styled panels={panels} />
                </Segment>
                <TransitionablePortal
                    transition={{animation:'fade up', duration: 500}}
                    open={state.deleteOpen}
                >
                    <Modal
                        closeIcon
                        open={true}
                        dimmer='blurring'
                        onClose={() => dispatch({ type: 'CLOSE_DELETE_MODAL' })}
                    >
                        <Modal.Header>Delete Task</Modal.Header>
                        <Modal.Content>Are you sure you want to delete task "{state.task ? state.task.title : null}"?</Modal.Content>
                        <Modal.Actions>
                            <Button color='red' onClick={() => dispatch({ type: 'CLOSE_DELETE_MODAL' })}>
                            <Icon name='remove' /> No
                            </Button>
                            <Button color='green' onClick={(task) => handleDelete(state.task.id)}>
                            <Icon name='checkmark' /> Yes
                            </Button>
                        </Modal.Actions>
                    </Modal>
                </TransitionablePortal>
                <TransitionablePortal
                    transition={{animation:'fade up', duration: 500}}
                    open={state.addOpen}
                >
                    <Modal
                        closeIcon
                        open={true}
                        dimmer='blurring'
                        onClose={() => dispatch({ type: 'CLOSE_ADD_MODAL' })}
                    >
                        <Modal.Header>Add a Task</Modal.Header>
                        <Modal.Content>
                            <AddTaskForm 
                            onCancel={() => dispatch({ type: 'CLOSE_ADD_MODAL' })} 
                            handleAddTask={handleAddTask}/>
                        </Modal.Content>
                    </Modal>
                </TransitionablePortal>
            </Fragment>
            : <Message warning>There are 0 tasks.</Message>
        )
    }

    return null
    
}

export default TaskList;