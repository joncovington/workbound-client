import React, { useEffect } from 'react';
import { useFetchTasksQuery } from '../../api/apiSlice';
import { Accordion,
         Segment,
         Dimmer,
         Loader,
         Message } from 'semantic-ui-react';

const TaskList = (props) => {
    const {setTaskCount, setError, pageSize, titleSearch, page} = props;
    const { data,
            isFetching,
            isLoading,
            isSuccess,
            isError,
            error } = useFetchTasksQuery({page: page,
                                            pageSize: pageSize, 
                                            titleSearch: titleSearch},
                                            );
    
    useEffect(() => {
        if (isSuccess){
            setTaskCount(data.count)
        }
    }, [data, isSuccess, setTaskCount])

    var results = []

    useEffect(() => {
        if (isError) {
            setError({
                header: '',
                content: error.data.detail
            })
        }
    }, [isError, error, setError])

    if (isError) {
        return null
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
            results.length > 0 ?
            <Segment basic>
                <Accordion fluid styled panels={panels} />
            </Segment>
            : <Message warning>There are 0 tasks.</Message>
        )
    }

    return null
    
}

export default TaskList;