import React, {useState, useEffect} from "react";

import ButtonType from "./buttonType";
import ButtonIcon from "./buttonIcon";

interface InputProps {
    buttonTitle: string;
    isTitleVisible?: boolean | null;
    buttonClassName?: string | null;
    buttonType?: ButtonType | null;
    icon: ButtonIcon;
    iconClassName?: string | null;
    onClick?: ()=> void | null;
}

const IconButton = (props: InputProps) => {
    
    const [isTitleVisible, setIsTitleVisible] = useState(true);
    const [buttonType, setButtonType] = useState(ButtonType.Button);

    useEffect(() => {
        setIsTitleVisible(props.isTitleVisible === true || props.isTitleVisible === undefined);
    }, [isTitleVisible, props])

    useEffect(() => {
        setButtonType(props.buttonType ?? ButtonType.Button);
    }, [buttonType, props])

    const handleClick = () => {
        if(props.onClick){
            props.onClick();
        }
    }

    return(
        <button type={buttonType} className={`btn ${props.buttonClassName}`} onClick={e => handleClick()}>
            <span className={`${props.icon} ${props.iconClassName}`} title={props.buttonTitle} aria-hidden="true"></span>
            { isTitleVisible &&
                <span>{props.buttonTitle}</span>
            }
        </button>
    );
}

export default IconButton;