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

export {
    camelize
}