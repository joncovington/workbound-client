import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Button, Grid, Form, TransitionablePortal, Modal } from 'semantic-ui-react';

export const TaskForm = (props) => {
    const { onCancel, actionButtonText, onSubmit, deleteTask, task, open, formHeader} = props;

    let initialValues = {
        id: null,
        title: '',
        description: '',
        duration: 0,
        completionDays: 0
    }

    if (task !== null){
        initialValues = {
            id: task.id,
            title: task.title,
            description: task.description,
            duration: task.duration,
            completionDays: task.completion_days
        }
    }

    const taskSchema = Yup.object().shape({
        title: Yup.string().required('Title is required.').matches(/^[A-Za-z0-9]+$/, 'Must be alphanumeric. No special characters'),
        description: Yup.string().required('Description is required.'),
        duration: Yup.number().required('Duration is required.').min(1, 'Must be greater than zero.'),
        completionDays: Yup.number().required('Duration is required.').min(1, 'Must be greater than zero.')
    })

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: taskSchema,
        onSubmit: values => onSubmit(values),
        enableReinitialize: true
    })

    const { isSubmitting,
            isValid,
            errors,
            values,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            resetForm } = formik;

    return (
        <TransitionablePortal
            transition={{animation:'fade up', duration: 500}}
            open={open}
        >
            <Modal
                closeIcon
                open={true}
                dimmer='blurring'
                onClose={() => {
                    onCancel()
                    resetForm()
                }}
            >
                <Modal.Header>{formHeader}</Modal.Header>
                <Modal.Content>
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
                            disabled={deleteTask}
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
                            disabled={deleteTask}
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
                                disabled={deleteTask}
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
                                disabled={deleteTask}
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
                                        onClick={() => {
                                            onCancel()
                                            resetForm()
                                        }}
                                    />
                                    <Button onClick={handleSubmit} icon='check' as='a' loading={isSubmitting} disabled={ isValid || isSubmitting ? false : true} color='green' content={actionButtonText || 'Submit'}/>
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                        
                    </Form>
                </Modal.Content>
            </Modal>
        </TransitionablePortal>
    )
}

export default TaskForm;