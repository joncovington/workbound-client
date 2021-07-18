import React from 'react';
import { useFormik } from 'formik';
import { Button, Grid, Form, TransitionablePortal, Modal } from 'semantic-ui-react';

import FormInputs from '../../components/FormInputs'
import { categorySchema,
         categoryFormConfig,
         categoryInitialValues } from './CategoryFormConfig';

export const CategoryForm = ({ onCancel,
                           actionButtonText,
                           onSubmit,
                           isDelete,
                           category,
                           open,
                           formHeader}) => {

    const formik = useFormik({
        initialValues: categoryInitialValues(category),
        validationSchema: categorySchema,
        onSubmit: values => onSubmit(values),
        enableReinitialize: true
    })

    const { isSubmitting,
            isValid,
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
                        <FormInputs config={categoryFormConfig} isDelete={isDelete} formik={formik} />
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

export default CategoryForm;