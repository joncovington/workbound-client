import React, { Fragment, useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useFetchTasksQuery,
         useDeleteTaskMutation,
         useAddTaskMutation,
         useUpdateTaskMutation } from '../../api/apiSlice';
import { Accordion,
         Label,
         Grid,
         Segment,
         Dimmer,
         Loader,
         Message } from 'semantic-ui-react';

import TaskForm from './TaskForm';
import { signOut } from '../auth/authSlice';
import { push } from 'connected-react-router';

const initialState = {
    taskFormOpen: false,
    task: null,
    deleteTask: false,
    formHeader: '',
    actionButtonText: '',
    onSubmit: null
}

function localReducer(state, action) {
    switch (action.type) {
        case 'OPEN_DELETE_MODAL':
            return {...state,
                    taskFormOpen: true,
                    formHeader: `Are you sure you want to delete task "${action.task.title}"?`,
                    task: action.task,
                    deleteTask: true,
                    actionButtonText: 'Delete Task',
                    onSubmit: action.onSubmit}
        case 'OPEN_ADD_MODAL':
            return {...state,
                    taskFormOpen: true,
                    formHeader: 'Add a Task',
                    actionButtonText: 'Add Task',
                    task: null,
                    onSubmit: action.onSubmit}
        case 'OPEN_EDIT_MODAL':
            return {...state,
                    taskFormOpen: true,
                    formHeader: `Edit Task: "${action.task.title}"`,
                    actionButtonText: 'Update Task', 
                    task: action.task,
                    onSubmit: action.onSubmit}
        case 'CLOSE_FORM_MODAL':
            return {...state,
                    taskFormOpen: false,
                    formHeader: '',
                    actionButtonText: '',
                    task: null,
                    deleteTask: false,
                    onSubmit: null}
        default:
            throw new Error()
    }
}

const TaskList = (props) => {
    const { user } = props;
    const storeDispatch = useDispatch()
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
    const [ updateTask ] = useUpdateTaskMutation()
    
    useEffect(() => {
        if (isSuccess){
            setTaskCount(tasks.count)
        }
    }, [tasks, isSuccess, setTaskCount])

    var results = []

    useEffect(() => {
        if (isError && error.status === undefined){
            console.log('Unknown Error')
            storeDispatch(signOut(localStorage.getItem('refresh_token')))
            storeDispatch(push('/'))
        }
    }, [error, isError, storeDispatch])

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

    const handleDelete = ({id}) => {
        deleteTask({taskId: id})
        dispatch({ type: 'CLOSE_FORM_MODAL' })
    }

    const handleAddTask = (values) => {
        values['completion_days'] = values['completionDays']
        delete values['completionDays']
        values['created_by'] = user.id
        dispatch({ type: 'CLOSE_FORM_MODAL' })
        addTask(values)
    }

    const handleChangeTask = (values) => {
        const taskId = values['id']
        delete values['id']
        values['completion_days'] = values['completionDays']
        delete values['completionDays']
        dispatch({ type: 'CLOSE_FORM_MODAL' })
        updateTask({taskId: taskId, data: values})
    }

    const renderChangeTask = (task) => {
        return taskPermissions?.change_task?.status
            ? <Label 
                as='a' 
                size='small' 
                content='Edit' 
                color='blue' 
                icon='edit'
                onClick={() => dispatch({type: 'OPEN_EDIT_MODAL', task: task, onSubmit: handleChangeTask})}
            />
            : null
    }

    const renderAddTask = () => {
        return taskPermissions?.add_task?.status
            ? <Label corner='right'
                icon='plus'
                as='a'
                color='green'
                onClick={() => dispatch({ type: 'OPEN_ADD_MODAL', onSubmit: handleAddTask })}
                />
            : null
    }

    const renderDeleteTask = (task) => {
        return taskPermissions?.delete_task?.status
            ? <Label 
                as='a' 
                size='small' 
                content='Delete' 
                color='red' 
                icon='remove circle'
                onClick={() => dispatch({type: 'OPEN_DELETE_MODAL', task: task, onSubmit: handleDelete})}
                />
            : null
    }

    const renderPanelContent = (task) => {
        let imageProps = {}
        if (task.created_by.profile.thumbnail) {
              imageProps =   {
                avatar: true,
                spaced: 'right',
                src: MEDIA_ROOT + task.created_by.profile.thumbnail
            }
        }            

        return (
            <>
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
                            {renderChangeTask(task)}{renderDeleteTask(task)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
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
                <TaskForm 
                    open={state.taskFormOpen}
                    onCancel={() => dispatch({ type: 'CLOSE_FORM_MODAL' })} 
                    onSubmit={state.onSubmit}
                    task={state.task}
                    actionButtonText={state.actionButtonText}
                    isDelete={state.deleteTask}
                    formHeader={state.formHeader}
                />
            </Fragment>
            : <Message warning>There are 0 tasks.</Message>
        )
    }

    return null
    
}

export default TaskList;