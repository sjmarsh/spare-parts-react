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
    
    try {
        if(!isNaN(Date.parse(target))) {
            let date = new Date(target);
            return date.toLocaleDateString('en-au');
        }
    } catch(e) {
        console.log('not a date');
        return null;
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