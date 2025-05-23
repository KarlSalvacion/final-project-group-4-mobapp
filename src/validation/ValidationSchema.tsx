import * as Yup from 'yup';

export const listingValidationSchema = Yup.object().shape({
    listingType: Yup.string()
        .oneOf(['lost', 'found'], 'Type must be either lost or found')
        .required('Type is required'),
    title: Yup.string()
        .required('Title is required')
        .trim(),
    description: Yup.string()
        .required('Description is required'),
    category: Yup.string()
        .oneOf(
            ['clothes', 'electronics', 'accessories', 'documents', 'books', 'jewelry', 'bags', 'other'],
            'Please select a valid category'
        )
        .required('Category is required'),
    date: Yup.string()
        .required('Date is required'),
    time: Yup.string()
        .required('Time is required'),
    location: Yup.string()
        .required('Location is required'),
    images: Yup.array()
        .min(1, 'At least one image is required')
        .max(5, 'Maximum 5 images allowed')
        .required('At least one image is required'),
});

export const signUpValidationSchema = Yup.object().shape({
    name: Yup.string()
        .required('Name is required')
        .min(2, 'Name must be at least 2 characters')
        .max(50, 'Name must not exceed 50 characters')
        .matches(
            /^[A-Za-z\s]+$/,
            'Name can only contain letters and single spaces'
        ),
    username: Yup.string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(20, 'Username must not exceed 20 characters')
        .matches(
            /^[A-Za-z0-9._]+$/,
            'Username can only contain letters, numbers, dots, and underscores'
        ),
    email: Yup.string()
        .required('Email is required')
        .matches(
            /^[A-Za-z0-9._%+-]+@dlsl\.edu\.ph$/,
            'Email must be a valid DLSL email address (@dlsl.edu.ph)'
        ),
    password: Yup.string()
        .required('Password is required')
        .min(8, 'Password must be at least 8 characters')
        .matches(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~])[A-Za-z\d!"#$%&'()*+,\-./:;<=>?@[\\\]^_`{|}~]{8,}$/,
            'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character (!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~)'
        ),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Passwords must match')
        .required('Confirm password is required'),
});

export const loginValidationSchema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    password: Yup.string()
        .required('Password is required'),
});

