import React from "react";

import Chip from './types/chip';
import styles from './ChipList.module.css';

interface InputProps {
    chips: Array<Chip>;
    title?: string | null;
    onToggleChip?: (chip: Chip) => void | null;
}

    
const ChipList = (props: InputProps) => {

    const getChipClass = (chip: Chip) : string => {
        let outlined = chip.isActive ? '' : 'Outlined';
        const chipColorClass = `chipColor${chip.color}${outlined}`;
        return (chip.color === null || chip.color === undefined) ? `${styles.chip} ${styles.chipColorDefault}` : `${styles.chip} ${styles[chipColorClass]}`;
    }    

    const handleToggleChip = (chip: Chip) => {
        if(props.onToggleChip){
            chip.isActive = !chip.isActive;
            props.onToggleChip(chip);
        }
    }

    return (
        <div aria-label="Chip List" role="listbox">
            { props.chips.map((chip, index) => 
                <span className={getChipClass(chip)} key={index} title={chip.tooltip ?? ""} role="option">{chip.name}<span className={styles.chipIcon}><a onClick={(e) => handleToggleChip(chip)}><span className="oi oi-circle-x"></span></a></span></span>
            )}
        </div>
    )
}

export default ChipList;