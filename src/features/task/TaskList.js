import React from 'react';
import { useFetchTasksQuery } from '../../api/apiSlice';
import { Accordion, Segment, Dimmer, Loader, Label, Divider, Header, Icon } from 'semantic-ui-react';


const TaskList = (props) => {
    const { data, isFetching, isLoading, isSuccess, isError } = useFetchTasksQuery();

    var results = []
    if (isError) {
        return (
            <Segment>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='tasks' circular />
                    <Header.Content>Tasks</Header.Content>
                </Header>
                An error has occurred
            </Segment>
        )
    }
    if (isFetching || isLoading) {
        return (
            <Segment>
                <Header as='h2' icon textAlign='center'>
                    <Icon name='tasks' circular />
                    <Header.Content>Tasks</Header.Content>
                </Header>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            </Segment>
        )
    }
    if (isSuccess){
        results = data.results;
        console.log(results)
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
        console.log(panels)
        return (
            <Segment>
                 <Header as='h2' icon textAlign='center'>
                    <Icon name='tasks' circular />
                    <Header.Content>Tasks</Header.Content>
                </Header>
                <Label>{data.count} Task{ data.count > 1 ? 's' : null}</Label>
                <Divider hidden/>
                    <Accordion fluid styled panels={panels} />
            </Segment>

        )
    }
    
}

export default TaskList;