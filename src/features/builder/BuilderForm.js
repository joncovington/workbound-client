import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useFetchCategoriesQuery } from 'api/apiSlice';
import { Transition,
         Grid,
         Segment,
         Button,
         Dropdown,
         Message,
         Dimmer,
         Loader,
         List,
         Header,
         Icon,
         Popup,
         Modal } from 'semantic-ui-react';

import { OPEN_INFOFORM } from './Builder.types';

export const BuilderForm = ({open, state, dispatch}) => {
    const { dialogPage } = state;
    const isSignedIn = useSelector(state => state.auth.isSignedIn);
    const [ showHelp, setShowHelp ] = useState(false);
    const [ titleSearch, setTitleSearch ] = useState('');
    const [ currentSelection, setCurrentSelection ] = useState(null);
    const [ categoryOptions, setCategoryOptions ] = useState([]);
    const [ userCategories, setUserCategories ] = useState([]);
    const { data: categories,
        isFetching,
        isLoading,
        isSuccess,
        isError,
        error } = useFetchCategoriesQuery({page: null, pageSize: null,titleSearch: titleSearch}, {skip: !isSignedIn});
    
    const handleChangeSection = (e, { value }) => {
        setCurrentSelection(value)
    }
    
    const handleAddSection = () => {
        const newUserCategories = []
        newUserCategories.push(categories?.results.find(cat => cat.id === currentSelection))
        setUserCategories(userCategories.concat(newUserCategories))
    }
    

    useEffect(() => {
        if(isSuccess && categories.results.length > 0) {
            let options = []
            categories.results.forEach(category => {
                options.push({ key: `cat_${category.id}`, value: category.id, text: category.title })
            });
            setCategoryOptions(options)
        }
    }, [isSuccess, categories, setCategoryOptions])

    useEffect(() => {
        if( dialogPage === 'menu') {
            setUserCategories([])
        }
    }, [dialogPage])

    if (isError) {
        console.log(error)
        return (
            <Transition visible={open && state.dialogPage === 'form'}>
            <Segment basic>
                <Message negative>
                    <Message.Content>There was an error.</Message.Content>
                </Message>
            </Segment>
            </Transition>
        )
    }
    
    if (isFetching || isLoading) {
        return (
            <Transition visible={open && state.dialogPage === 'form'}>
            <Segment basic>
                <Dimmer active inverted>
                    <Loader inverted>Loading</Loader>
                </Dimmer>
            </Segment>
            </Transition>
        )
    }

    if (isSuccess){
        return (
            <Transition visible={open && state.dialogPage === 'form'}  duration={{hide: 0, show: 500}} unmountOnHide>
                <div style={{height: '100%'}}>
                <Segment attached='top' style={{ height: '100%'}}>
                <Grid columns={2}>
                    <Grid.Column>
                        <Header content='Add Sections' />
                    </Grid.Column>
                    <Grid.Column verticalAlign='top' textAlign='right'>
                    <Popup content='What is a Section?'
                            size='mini'
                            position='bottom right'
                            trigger={
                            <Icon className='helpIcon' name='question circle outline' onClick={() => setShowHelp(true)}/>}
                            
                            />
                    <Modal basic onClose={() => setShowHelp(false)} open={showHelp} >
                        <Header>What is a Section?</Header>
                        <Modal.Content>
                            <p>A section is a grouping of work items that should be completed together.</p>
                            <p>Once all of the work items in a section are complete, a user will move to the next section.</p>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button basic color='red' inverted onClick={() => setShowHelp(false)}>
                            <Icon name='remove' /> Close
                            </Button>
                        </Modal.Actions>
                    </Modal>
                    </Grid.Column>
                </Grid>
                
                    <Grid columns={2}>
                        <Grid.Column textAlign='center' width={14}>
                            <Dropdown placeholder='Select Category' 
                              fluid search selection 
                              options={categoryOptions}
                              onChange={handleChangeSection}/>
                        </Grid.Column>
                        <Grid.Column textAlign='center' width={2}>
                            <Button color='blue' icon='add' onClick={handleAddSection}/>
                        </Grid.Column>
                    </Grid>
                    <Grid>
                        <Grid.Column width={16} stretched>
                            <Transition.Group
                                as={List}
                                duration={200}
                                divided
                                size='huge'
                                verticalAlign='middle'
                                >
                                {userCategories.map((item, index) => (
                                    <List.Item key={`section_${index}`}>
                                        <List.Content floated='right'>
                                            <Button>TEST</Button>
                                        </List.Content>
                                        <Header as='h5'>{item.title}</Header>
                                    
                                    </List.Item>
                                ))}
                            </Transition.Group>
                        </Grid.Column>
                    </Grid>
                </Segment>
                <Segment attached>
                    <Grid columns={2}>
                        <Grid.Column textAlign='left'>
                            <Button 
                                labelPosition='right'
                                content='Back'
                                icon='arrow left'
                                onClick={() => dispatch({type: OPEN_INFOFORM})}
                                />
                        </Grid.Column>
                        <Grid.Column textAlign='right'>
                            <Button 
                                labelPosition='left'
                                color='green'
                                content='Proceed'
                                icon='arrow right'
                                onClick={() => console.log('Proceed Clicked')}
                                />
                        </Grid.Column>
                    </Grid>
                </Segment>
                </div>
            </Transition>
        )
    }
    
    return null;
}

export default BuilderForm;