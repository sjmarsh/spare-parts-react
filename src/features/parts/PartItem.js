const PartItem = (props) => {

    return (
        <div>{props.part.name} - {props.part.weight} - {props.part.dateStart}</div>
    )
};

export default PartItem;