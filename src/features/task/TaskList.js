import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFetchTasksQuery } from '../../api/apiSlice';
import { Accordion,
         Segment,
         Dimmer,
         Loader,
         Pagination,
         Message } from 'semantic-ui-react';


const TaskList = (props) => {
    const {setTaskCount, pageSize, titleSearch} = props;
    const isSignedIn = useSelector(state => state.auth.isSignedIn);
    const user = useSelector(state => state.user)
    const taskPermissions = user.permissions.task
    const [page, setPage] = useState(1);
    const { data,
            isFetching,
            isLoading,
            isSuccess,
            isError,
            error } = useFetchTasksQuery({page: page,
                                            pageSize: pageSize, 
                                            titleSearch: titleSearch},
                                            {skip: !isSignedIn || !taskPermissions.view_task.status});
    

    const handlePaginationChange = (e, { activePage }) => {
        setPage(activePage)
    };
    
    useEffect(() => {
        if (isSuccess){
            setTaskCount(data.count)
        }
    }, [data, isSuccess, setTaskCount])

    if (isSignedIn && !taskPermissions.view_task.status) {
        return (
            <Segment basic>
                <Message negative>
                    <Message.Header>No View Permission Found for Tasks.</Message.Header>
                    <Message.Content>Please contact administrator to obtain the correct permissions.</Message.Content>
                </Message>
            </Segment>
        )
    }

    var results = []
    if (isError || !isSignedIn) {
        return (
            <Segment basic>
                {isError
                    ? <Message negative>{error.data.detail}</Message>
                    : null
                }
                {!isSignedIn ? 'Your login has expired. Please sign in.' : null}
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
    if (isSuccess){
        results = data.results;

        const panels = []
        results.forEach((task, index) =>{
            if(Object.keys(task).length > 0) {
                panels.push({
                    key: `panel-${task['id']}`,
                    title: {
                        content: task.title
                    },
                    content: {
                        content: task.description
                    }
        
                })
            }
        })

        return (
            <Segment basic>
                
                    <Pagination
                        size='mini'
                        activePage={page}
                        totalPages={Math.ceil(data.count / pageSize)}
                        onPageChange={handlePaginationChange}
                    />

                <Accordion fluid styled panels={panels} />
            </Segment>
        )
    }
    
}

export default TaskList;