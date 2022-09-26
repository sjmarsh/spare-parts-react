import * as Yup from 'yup';

const LoginSchema = Yup.object().shape({
    userName: Yup.string().required().label('User Name'),
    password: Yup.string().required().label('Password')
});

export default LoginSchema;