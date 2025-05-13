import * as Yup from 'yup';

export const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    description: Yup.string().required('Description is required'),
    date: Yup.string().required('Date is required'),
    time: Yup.string().required('Time is required'),
    location: Yup.string().required('Location is required'),
    images: Yup.array().min(1, 'At least one image is required').max(5, 'Maximum 5 images allowed'),
});

