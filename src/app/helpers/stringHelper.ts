// ref: https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case?page=1&tab=scoredesc#tab-top
const underscoreRegex = /(?:[^\w\s]|_)+/g,
    sandwichNumberRegex = /(\d)\s+(?=\d)/g,
    camelCaseRegex = /(?:^\s*\w|\b\w|\W+)/g;

const camelize = (target: string) : string => {
    if (/^\s*_[\s_]*$/g.test(target)) {
        return '_';
    }

    target = target.toLowerCase();

    return target.replace(underscoreRegex, ' ')
        .replace(sandwichNumberRegex, '$1_')
        .replace(camelCaseRegex, function(match, index) {
            if (/^\W+$/.test(match)) {
                return '';
            }
            return index == 0 ? match.trimStart().toLowerCase() : match.toUpperCase();
        });
}

/** Attempts to convert value to date and return a locally formated string. Returns null if value is not a date.*/
const getFormattedDate = (target: any | null) : string | null => {
    if(!target){
        return null;
    }

    if(target instanceof Date) {
        return target.toLocaleDateString('en-au');
    }
    
    // expects yyyy/MM/dd or dd/MM/yyy or yyyy-MM-dd or dd-MM-yyyy (and variations of single or double digit days/months)
    const dateFormatExp = /(\d{1,4})(\/|-)(\d{1,2})(\/|-)(\d{1,4})/;  
    const targetStr = target.toString() as string;
    if(dateFormatExp.test(targetStr)) {
        const date = new Date(target);
        return date.toLocaleDateString('en-au');    
    }

    return null;
}

const getFormattedNumber = (target: any | null) : string | null => {
    if(!target){
        return null;
    }

    if(!isNaN(parseFloat(target))){
        try{
            return Number(target).toFixed(2);
        } catch(e) {
            console.log('not a number');
            return null;
        }
    }

    return null;
}

const getFormattedValue = (target: any | null) : string => {
    if(!target){
        return "";
    }
    
    if(typeof target === 'boolean') {
        return `${target}`;
    }

    let date = getFormattedDate(target);
    if(date) {
        return date;
    }
    let number = getFormattedNumber(target);
    if(number) {
        return number;
    }
    return target;
}

export {
    camelize,
    getFormattedDate,
    getFormattedNumber,
    getFormattedValue
}