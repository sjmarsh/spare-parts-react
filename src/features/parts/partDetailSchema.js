import * as Yup from 'yup';

const PartDetailSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    weight: Yup.number().min(0).required('Weight is equired').label('Weight'),
    price: Yup.number().min(0).required().label('Price'),
    startDate: Yup.date().min('2000-01-01').required().label('Start Date')
})

export default PartDetailSchema;