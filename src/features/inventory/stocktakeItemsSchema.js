import * as Yup from 'yup';

const StocktakeItemsSchema = Yup.object().shape({
    items: Yup.array().of(Yup.object().shape({
        quantity: Yup.number().min(0).required().label('Quantity')
    }))
});

export default StocktakeItemsSchema;