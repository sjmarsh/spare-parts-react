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
        let chipClass = chip.color === null ? `${styles.chip} ${styles.chipColorDefault}` : `${styles.chip} ${styles[`chipColor${chip.color}${outlined}`]}`;
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
                <span className={getChipClass(chip)} key={index}>{chip.name}<span className={styles.chipIcon}><a onClick={(e) => handleToggleChip(chip)}><span className="oi oi-circle-x"></span></a></span></span>
            )}
        </div>
    )
}

export default ChipList;