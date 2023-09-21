import React from "react";

import Chip from './types/chip';

import './ChipList.css';

interface InputProps {
    chips: Array<Chip>;
    title?: string | null;
    onToggleChip?: (chip: Chip) => void | null;
}

    
const ChipList = (props: InputProps) => {

    const getChipClass = (chip: Chip) : string => {
        let chipClass = chip.color === null ? "chip chip-color-default" : `chip chip-color-${chip.color?.toLowerCase()}`;
        if(!chip.isActive) {
            chipClass = `${chipClass}-outlined`;
        }
        return chipClass;
    }    

    const handleToggleChip = (chip: Chip) => {
        if(props.onToggleChip){
            chip.isActive = !chip.isActive;
            props.onToggleChip(chip);
        }
    }

    return (
        <div aria-label="Chip List">
            { props.chips.map((chip, index) => 
                <span className={getChipClass(chip)} key={index}>{chip.name}<span className="chip-icon"><a onClick={(e) => handleToggleChip(chip)}><span className="oi oi-circle-x"></span></a></span></span>
            )}
        </div>
    )
}

export default ChipList;