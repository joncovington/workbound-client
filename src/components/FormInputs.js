import React from 'react';
import { Form, Message } from 'semantic-ui-react';

export const FormInputs = ({config, formik, isDelete = false}) => {

    const buildError = (name, errorPoint) => {
        if (formik.errors[name] && formik.touched[name]) {
            return {content: formik.errors[name], pointing: errorPoint}
        } else {
            return false
        }
    }

    const builder = (field, index) => {
        const { name, label = '', type, errorPoint} = field;
        switch (type) {
            case 'text':
                return (
                    <Form.Input
                    key={`key-text-${name}-${index}`}
                    error={buildError(name, errorPoint)}
                    fluid
                    label={label}
                    placeholder={label}
                    type='text'
                    name={name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[name] ? formik.values[name] : ''}
                    disabled={isDelete}
                    /> 
                )
            case 'number':
                return (
                    <Form.Input
                    key={`key-number-${name}-${index}`}
                    error={buildError(name, errorPoint)}
                    fluid
                    label={label}
                    type='number'
                    name={name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values[name] ? formik.values[name] : ''}
                    disabled={isDelete}
                    /> 
                )
            case 'group':
                const { widths, config } = field;
                return (
                    <Form.Group widths={widths} key={`group-${index}`}>
                        <FormInputs config={config} formik={formik} isDelete={isDelete}/>
                    </Form.Group>
                )
            default:
                return <Message negative>Unsupported Field Type</Message>
        }
    }

    return (
        <>
          {config.map((field, index) => {
            return builder(field, index);
          })}
        </>
      );

}

export default FormInputs;