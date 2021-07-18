import React, { useEffect, useReducer } from 'react';
import { useDispatch } from 'react-redux';
import { useFetchCategoriesQuery,
         useDeleteCategoryMutation,
         useAddCategoryMutation,
         useUpdateCategoryMutation } from '../../api/apiSlice';
import { Accordion,
         Label,
         Grid,
         Segment,
         Dimmer,
         Loader,
         Message } from 'semantic-ui-react';
import { initialState, modalReducer } from '../../app/modalReducer';

import { signOut } from '../auth/authSlice';
import { push } from 'connected-react-router';
import CategoryForm from './CategoryForm';

const CategoryList = (props) => {
    const { user,
            categoryPermissions,
            setCategoryCount,
            pageSize,
            titleSearch,
            page } = props;
    const storeDispatch = useDispatch()
    const [state, dispatch] = useReducer(modalReducer, initialState);
    const MEDIA_ROOT = localStorage.getItem('wb_media_root')
    const { data: categories,
            isFetching,
            isLoading,
            isSuccess,
            isError,
            error } = useFetchCategoriesQuery({page: page,
                                            pageSize: pageSize, 
                                            titleSearch: titleSearch},
                                            );
    const [ deleteCategory ] = useDeleteCategoryMutation()
    const [ addCategory ] = useAddCategoryMutation()
    const [ updateCategory ] = useUpdateCategoryMutation()
    
    useEffect(() => {
        if (isSuccess){
            setCategoryCount(categories.count)
        }
    }, [categories, isSuccess, setCategoryCount])

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
        deleteCategory({categoryId: id})
        dispatch({ type: 'CLOSE_FORM_MODAL' })
    }

    const handleAdd = (values) => {
        values['created_by'] = user.id
        dispatch({ type: 'CLOSE_FORM_MODAL' })
        addCategory(values)
    }

    const handleUpdate = (values) => {
        const categoryId = values['id']
        delete values['id']
        dispatch({ type: 'CLOSE_FORM_MODAL' })
        updateCategory({categoryId: categoryId, data: values})
    }

    const renderChangeButton = (category) => {
        return categoryPermissions?.change_category?.status
            ? <Label 
                as='a' 
                size='small' 
                content='Edit' 
                color='blue' 
                icon='edit'
                onClick={() => dispatch({type: 'OPEN_EDIT_MODAL', obj: category, objType: 'Category', onSubmit: handleUpdate})}
            />
            : null
    }

    const renderAddButton = () => {
        return categoryPermissions?.add_category?.status
            ? <Label corner='right'
                icon='plus'
                as='a'
                color='green'
                onClick={() => dispatch({ type: 'OPEN_ADD_MODAL', objType: 'Category', onSubmit: handleAdd })}
                />
            : null
    }

    const renderDeleteButton = (category) => {
        return categoryPermissions?.delete_category?.status
            ? <Label 
                as='a'
                size='small'
                content='Delete'
                color='red'
                icon='remove circle'
                onClick={() => dispatch({type: 'OPEN_DELETE_MODAL', obj: category, objType: 'Category', onSubmit: handleDelete})}
                />
            : null
    }

    const renderPanelContent = (category) => {
        var imageProps = {}
        if (category.created_by.profile.thumbnail) {
              imageProps = {
                avatar: true,
                spaced: 'right',
                src: MEDIA_ROOT + category.created_by.profile.thumbnail
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
                            {category.description}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>                
            </Segment>
            <Grid columns={2}>
                    <Grid.Row>
                        <Grid.Column textAlign='left' verticalAlign='middle'><small>Created By: </small>
                        {
                        category.created_by.profile.thumbnail
                        ? <Label
                            
                            size='tiny'
                            color='blue'
                            content={category.created_by.email}
                            image={imageProps}
                            />
                        : <Label
                            size='tiny'
                            color='blue'
                            icon='user'
                            content={category.created_by.email}
                            />
                        }
                        </Grid.Column>
                        <Grid.Column textAlign='right' verticalAlign='bottom'>
                            {renderChangeButton(category)}{renderDeleteButton(category)}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </>
        )

    }

    if (isSuccess){
        results = categories.results;

        const panels = []
        results.forEach((category, index) =>{
            if(Object.keys(category).length > 0) {
                panels.push({
                    key: `panel-${category['id']}`,
                    title: {
                        content: category.title
                    },
                    content: {
                        content: renderPanelContent(category)
                    }
        
                })
            }
        })

        const renderForm = () => {
            return (
                <CategoryForm 
                    open={state.formOpen}
                    onCancel={() => dispatch({ type: 'CLOSE_FORM_MODAL' })} 
                    onSubmit={state.onSubmit}
                    category={state.obj}
                    actionButtonText={state.actionButtonText}
                    isDelete={state.isDelete}
                    formHeader={state.formHeader}
                />
            )
        }

        return (
            results.length > 0 ?
            <>
                <Segment basic>
                    <Accordion fluid styled panels={panels} />
                    {renderForm()}
                </Segment>
                {renderAddButton()}
            </>
            : <>
                {renderAddButton()}
                <Message warning>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={8}>
                                There are 0 categories.
                            </Grid.Column>
                            <Grid.Column textAlign='right' width={8}>
                            <Label
                                content='Add Category'
                                icon='plus'
                                as='a'
                                color='green'
                                onClick={() => dispatch({ type: 'OPEN_ADD_MODAL', objType: 'Category', onSubmit: handleAdd })}
                            />
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </Message>
                {renderForm()}
              </>
        )
    }

    return null
    
}

export default CategoryList;