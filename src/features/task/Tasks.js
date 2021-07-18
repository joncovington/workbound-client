import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Segment,
         Label,
         Header,
         Icon,
         Dropdown,
         Grid,
         Input,
         Pagination,
         Message } from 'semantic-ui-react';
import TaskList from './TaskList';



const Tasks = (props) => {
    const isSignedIn = useSelector(state => state.auth.isSignedIn);
    const permissionsFetched = useSelector(state => state.user.isPermFetched)
    const user = useSelector(state => state.user)
    const taskPermissions = user.permissions.task
    const viewTaskPermission = user.permissions.task.view_task.status

    const [pageSize, setPageSize] = useState(10)
    const [page, setPage] = useState(1);
    const [titleSearch, setTitleSearch] = useState('')
    const [taskCount, setTaskCount] = useState(0)
    const [displayError, setDisplayError] = useState(false)
    const [displayList, setDisplayList] = useState(false)
    const [error, setError] = useState({header: '', content: ''})

    const handlePageSizeChange = (e, { value }) => {
        setPage(1)
        setPageSize(value)
    }

    const onSearchChange = (e, { value }) => {
        setTitleSearch(value)
    }

    const handlePaginationChange = (e, { activePage }) => {
        setPage(activePage)
    };

    const options = [
        { key: 5, text: '5', value: 5 },
        { key: 10, text: '10', value: 10 },
        { key: 20, text: '20', value: 20 },
        { key: 50, text: '50', value: 50 },
    ]
    
    useEffect(() => {
        if (isSignedIn && permissionsFetched && viewTaskPermission) {
            setDisplayList(true)
            setDisplayError(false)
        }
        if (isSignedIn && permissionsFetched && !viewTaskPermission) {
            setDisplayError(true)
            setError({
                header: 'No Permissions To View Tasks',
                content: 'Please contact administrator to upgrade your permissions.'
            })
        }
    }, [isSignedIn, viewTaskPermission, permissionsFetched])


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
                <Grid.Row>
                    <Grid.Column width={4} />
                    <Grid.Column textAlign='center' width={8}>
                        {taskCount > 0 && displayList === true
                            ? <Pagination
                            size='mini'
                            activePage={page}
                            totalPages={Math.ceil(taskCount / pageSize)}
                            onPageChange={handlePaginationChange}
                            firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                            lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                            prevItem={{ content: <Icon name='angle left' />, icon: true }}
                            nextItem={{ content: <Icon name='angle right' />, icon: true }}
                            />
                            : null
                        }
                    </Grid.Column>
                    <Grid.Column width={4} >
                    </Grid.Column>
                </Grid.Row>
                {displayError
                    ? <Grid.Row>
                        <Grid.Column>
                        <Message negative>
                            <Message.Header>{error.header}</Message.Header>
                            <Message.Content>{error.content}</Message.Content>
                        </Message>
                        </Grid.Column>
                    </Grid.Row>
                    : null
                    }
            </Grid>
            {displayList
                ? <TaskList
                    user={user}
                    page={page}
                    setTaskCount={setTaskCount}
                    pageSize={pageSize} 
                    titleSearch={titleSearch}
                    taskPermissions={taskPermissions}
                />
                : null
            }
                
        </Segment>
    )
}

export default Tasks;