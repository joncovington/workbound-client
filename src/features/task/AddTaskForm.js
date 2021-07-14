import React from 'react';
import { Formik } from 'formik';
import { Button, Grid, Form } from 'semantic-ui-react';

export const AddTaskForm = (props) => {
    const { handleAddTask, onCancel } = props;
    const initialValues = {
        title: '',
        description: '',
        duration: 0,
        completionDays: 0
    }
    const validate = (values) => {
        const errors = {};
        if (!values.title) {
            errors.title = 'Required: Please enter a Title.';
        }
        if (!values.description) {
            errors.description = 'Required: Please enter a Description.';
        }
        if (values.duration <= 0) {
            errors.duration = 'Duration must be >= 1';
        }
        if (values.completionDays <= 0) {
            errors.completionDays = 'Completion Days must be >= 1';
        }
        
        return errors;
    }

    return (
        <Formik initialValues={initialValues}
            validate={values => validate(values)}
            onSubmit={ (values) => {
                handleAddTask(values)
            }}
            >
            {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
                /* and other goodies */
            }) => (
                
                <Form loading={isSubmitting} onSubmit={handleSubmit}>
                    <Form.Input
                        error={errors.title !== undefined && touched.title? {content: errors.title, pointing: 'below'} : false}
                        fluid
                        label='Title'
                        placeholder='Title'
                        type='text'
                        name='title'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.title}
                    />
                    <Form.Input
                        error={errors.description !== undefined && touched.description? {content: errors.description, pointing: 'below'} : false}
                        fluid
                        label='Description'
                        placeholder='Description'
                        type='text'
                        name='description'
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.description}
                    />
                    <Form.Group widths='equal'>
                        <Form.Input
                            error={errors.duration !== undefined  && touched.duration? {content: errors.duration, pointing: 'above'} : false}
                            fluid
                            label='Typical Duration'
                            type='number'
                            name='duration'
                            min='0'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.duration}
                        />
                        <Form.Input
                            error={errors.completionDays !== undefined && touched.completionDays ? {content: errors.completionDays, pointing: 'above'} : false}
                            fluid
                            label='Days for Completion'
                            type='number'
                            name='completionDays'
                            min='0'
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.completionDays}
                        />
                    </Form.Group>
                    <Grid>
                        <Grid.Row>
                            <Grid.Column width={16} textAlign='right'>
                                <Button icon='dont'
                                    as='a' 
                                    disabled={isSubmitting}
                                    color='red'
                                    content='Cancel'
                                    onClick={() => onCancel()}
                                />
                                <Button onClick={handleSubmit} icon='check' as='a' loading={isSubmitting} disabled={ isValid || isSubmitting ? false : true} color='green' content='Add Task'/>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                    
                </Form>
            )}
            
        </Formik> 
    )
}

export default AddTaskForm;