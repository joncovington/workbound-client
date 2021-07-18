import * as Yup from 'yup';

export const categorySchema = Yup.object().shape({
    title: Yup.string().required('Title is required.').matches(/^[A-Za-z0-9 ]+$/, 'Must be alphanumeric. No special characters'),
    description: Yup.string().required('Description is required.'),
})

export const categoryFormConfig = [
    {
        name: 'title',
        label: 'Title',
        type: 'text'
    },
    {
        name: 'description',
        label: 'Description',
        type: 'text'
    },
];

export const categoryInitialValues = (category = null) => {
    let initialValues = {
        id: -1,
        title: '',
        description: '',
    }

    if (category !== null){
        initialValues = {
            id: category.id,
            title: category.title,
            description: category.description,
        }
    }
    
    return initialValues;
}