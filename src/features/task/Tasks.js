import React, { useState } from 'react';
import { Segment,
         Label,
         Header,
         Icon,
         Dropdown,
         Grid,
         Input } from 'semantic-ui-react';
import TaskList from './TaskList';


const Tasks = (props) => {
    const [pageSize, setPageSize] = useState(10)
    const [titleSearch, setTitleSearch] = useState('')
    const [taskCount, setTaskCount] = useState(0)

    const handlePageSizeChange = (e, { value }) => {
        setPageSize(value)
    }

    const onSearchChange = (e, { value }) => {
        setTitleSearch(value)
    }

    const options = [
        { key: 5, text: '5', value: 5 },
        { key: 10, text: '10', value: 10 },
        { key: 20, text: '20', value: 20 },
        { key: 50, text: '50', value: 50 },
      ]

    return (
        <Segment>
            <Header as='h2' icon textAlign='center'>
                    <Icon name='tasks' circular />
                    <Header.Content>Tasks</Header.Content>
                </Header>
                <Segment basic textAlign='center'>
                    Tasks are added to WorkItems as a requirement for completion.
                </Segment>
                <Grid>
                    <Grid.Row>
                        <Grid.Column textAlign='left' width={4}>
                            <Label>{taskCount} Task{ taskCount !== 1 ? 's' : null}</Label>
                        </Grid.Column>
                        <Grid.Column textAlign='center' width={8}>
                            <Input 
                                fluid 
                                icon='search' 
                                placeholder='Search Tasks...'
                                onChange={onSearchChange}
                                value={titleSearch}
                                />
                        </Grid.Column>
                        <Grid.Column textAlign='right' width={4}>
                            <Dropdown 
                                options={options}
                                compact
                                selection
                                onChange={handlePageSizeChange}
                                value={pageSize}/> Per Page
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <TaskList setTaskCount={setTaskCount} pageSize={pageSize} titleSearch={titleSearch}/>
        </Segment>
    )
}

export default Tasks;