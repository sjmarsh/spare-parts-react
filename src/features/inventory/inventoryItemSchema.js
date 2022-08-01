import * as Yup from 'yup';

const InventoryItemSchmea = Yup.object().shape({
    partId: Yup.number().min(1).required().label('Part ID'),
    quantity: Yup.number().min(1).required().label('Quantity')
})

export default InventoryItemSchmea;