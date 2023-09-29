import * as Yup from 'yup';

const PartDetailSchema = Yup.object().shape({
    name: Yup.string().required().label('Name'),
    weight: Yup.number().moreThan(0).required().label('Weight'),
    price: Yup.number().moreThan(0).required().label('Price'),
    startDate: Yup.date().min('2000-01-01').required().label('Start Date'),
    attributes: Yup.array().of(
        Yup.object().shape({
            name: Yup.string().required().label('Attribute Name'),
            value: Yup.string().required().label('Attribute Value')
        })
    )
})

export default PartDetailSchema;