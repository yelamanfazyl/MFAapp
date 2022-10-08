
function CheckPassword(str) {
    var result = {
        score: 0,
        crack_time: 0.0,
        state: "very weak"
    };

    if (str.length === 0) return 0;

    var uppercaseLetters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    var lowercaseLetters = 'abcdefghijklmnopqrstuvwxyz';
    var numbers = '1234567890';

    function isNumber(str) {
        if (!str)
            return false;
        
        const pattern = /^\d+$/;
        return pattern.test(str);
    }

    function isLetter(str) {
        if (!str)
            return false;

        const pattern = /^[a-zA-Z]+$/;
        return pattern.test(str);        
    }

    function isUppercaseLetter(str) {
        if (!str)
            return false;

        const pattern = /^[A-Z]+$/;
        return pattern.test(str);
    }

    function isLowercaseLetter(str) {
        if (!str)
            return false;
            
        const pattern = /^[a-z]+$/;
        return pattern.test(str);
    }

    function isSymbol(str) {
        if (!str)
            return false;
        
        return !(isLetter(str) || isNumber(str));
    }

    // n * 9
    function lengthScore(str) {
        if (!str)
            return 0;
        return str.length * 9;
    }

    // (len(str) - n) * 2
    function uppercaseScore(str) {
        if (!str)
            return 0;
        
        var res = 0;

        str.split('').forEach(element => {
            if (isUppercaseLetter(element))
                res++;
        });

        if (res == 0) 
            return 0;

        return (str.length - res) * 2;
    }

    // (len(str) - n) * 2
    function lowercaseScore(str) {
        if (!str)
            return 0;
        
        var res = 0;

        str.split('').forEach(element => {
            if (isLowercaseLetter(element))
                res++;
        });

        if (res == 0) 
            return 0;

        return (str.length - res) * 2;
    }

    // (len(str) - n) * 4
    function numbersScore(str) {
        if (!str)
            return 0;
        
        var res = 0;

        str.split('').forEach(element => {
            if (isNumber(element))
                res++;
        });

        if (res == 0) 
            return 0;

        return (str.length - res) * 4;
    }


    // (len(str) - n) * 6
    function symbolsScore(str) {
        if (!str)
            return 0;
        
        var res = 0;

        str.split('').forEach(element => {
            if (isSymbol(element))
                res++;
        });

        if (res == 0) 
            return 0;

        return (str.length - res) * 6;
    }

    // -len(str)
    function onlyLettersScore(str) {
        if (!str)
            return 0;
        
        if (isLetter(str))
            return -str.length;
        return 0;
    }

    // -len(str)
    function onlyNumbersScore(str) {
        if (!str)
            return 0;
        
        if (isNumber(str))
            return -str.length;
        return 0;
    }

    // -len(str) * 2
    function consecutiveUppercaseLettersScore(str) {
        if (!str)
            return 0;

        const pattern = /[A-Z]+/g;
        const matches = str.match(pattern);
        if (!matches)
            return 0;
        
        let res = 0;
        matches.forEach(element => {
            if (element.length > 1)
                res += (element.length - 1) * -2
        });
        return res;
    }

    // -len(str) * 2
    function consecutiveLowercaseLettersScore(str) {
        if (!str)
            return 0;

        const pattern = /[a-z]+/g;
        const matches = str.match(pattern);
        if (!matches)
            return 0;

        let res = 0;
        matches.forEach(element => {
            if (element.length > 1)
                res += (element.length - 1) * -2
        });
        return res;
    }

    // -len(str) * 2
    function consecutiveNumbersScore(str) {
        if (!str)
            return 0;

        const pattern = /[0-9]+/g;
        const matches = str.match(pattern);
        if (!matches)
            return 0;

        let res = 0;
        matches.forEach(element => {
            if (element.length > 1)
                res += (element.length - 1) * -2
        });
        return res;
    }

    function chunk(str, len) {
        const size = Math.ceil(str.length / len);
        const ret = new Array(size);
        let offset = 0;
        for (let i=0; i<size; i++) {
            offset = i * len;
            ret[i] = str.substring(offset, offset + len);
        }
        return ret;
    }

    function uniqArr(arr) {
        const res = [];
        for (let i=0; i<arr.length; i++) 
            if (res.indexOf(arr[i]) === -1 && arr[i] !== '')
                res.push(arr[i]);
        return res;
    }

    function sortByLen(arr, limit) {
        arr.sort(function(a, b) { return b.length - a.length});
        const list = [];

        for (let i=0; i<arr.length; i++) {
            if (limit) {
                if (arr[i]?.length >= limit)
                    list.push(arr[i]);
            } else {
                list.push(arr[i]);
            }
        }

        return list;
    }

    function reverse(str) {
        if (!str) return str;
        return str.split('').reverse().join('');
    }

    function buildSequence(str, num) {
        if (!str)
            return [];

        const len = str.length - num;
        const list = [];

        for (let i=0; i<len; i++) {
            for (let j=0; j<len; j++) {
                const newStr = str.substring(j, str.length);
                const arr = chunk(newStr, i + num);

                for (let k=0; k<arr.length; k++) {
                    list.push(arr[j]);
                    list.push(reverse(arr[j]));
                }
            }
        }

        const res = uniqArr(sortByLen(list, num));
        return res;
    }

    // -n * 3
    function sequenceLetterScore(str) {
        if (!str)
            return 0;

        const str1 = buildSequence(uppercaseLetters, 3);
        const str2 = buildSequence(lowercaseLetters, 3);

        let score = 0;
        let strCopy1 = str;
        let strCopy2 = str;

        str1.forEach(element => {
            if (strCopy1.indexOf(element) != -1) {
                score += element.length - 2;
                strCopy1 = strCopy1.replace(element, '');
            }
        });
        str2.forEach(element => {
            if (strCopy2.indexOf(element) != -1) {
                score += element.length - 2;
                strCopy2 = strCopy2.replace(element, '');
            }
        });

        return score * -3;
    }

    // -n * 3
    function sequenceNumbersScore(str) {
        if (!str)
            return 0;

        const num = buildSequence(numbers, 3);

        let score = 0;
        let numCopy = str;

        num.forEach(element => {
            if (numCopy.indexOf(element) != -1) {
                score += element.length - 2;
                numCopy = numCopy.replace(element, '');
            }
        });

        return score * -3;
    }

    function symbols(str) {
        if (!str)
            return undefined;
            
        let res = '';
        for (let i=0; i<str.length; i++) {
            if (isSymbol(str[i]))
                res += str[i];
        }

        return res;
    }

    // -n * 3
    function sequenceSymbolsScore(str) {
        if (!str)
            return 0;

        const num = buildSequence(symbols(), 3);

        if (!num)
            return 0;

        let score = 0;
        let numCopy = str;

        num.forEach(element => {
            if (numCopy.indexOf(element) != -1) {
                score += element.length - 2;
                numCopy = numCopy.replace(element, '');
            }
        });
        
        return score * -3;
    }

    function repeatCharactersScore(str) {
        if (!str)
            return 0;

        const pattern = /(.+)(?=.*?\1)/g;
        const matches = str.match(pattern);

        if (!matches)
            return 0;

        const resLen = sortByLen(matches)[0].length;
        let ratio = 0;

        if (resLen >= 1 &&  resLen <= 5) ratio = -8;
        if (resLen >= 6 &&  resLen <= 10) ratio = -5;
        if (resLen >= 11) ratio = -2;

        const res = ratio * resLen + (str.length - resLen * 2);
        return res;
    }

    function toWords(number) {
        //is merely seconds, just return rounded numebr
        if (number < 120) {
            return getNumberWords(number, true) + " seconds";
        }
        var hour = 60 * 60;
        if (number < hour) {
            let minutes = number / 60;
            return getNumberWords(minutes, true) + " minutes";
        }
        var day = hour * 24;
        if (number < (2 * day)) {
            let hours = number / hour;
            return getNumberWords(hours) + " hours";
        }
        var month = day * 30;
        if (number < month) {
            let days = number / day;
            return getNumberWords(days) + " days";
        }
        var year = day * 365;
        if (number < year) {
            let months = number / month;
            return getNumberWords(months) + " months";
        }
        var century = year * 100;
        if (number < century * 10) {
            let years = number / year;
            return getNumberWords(years) + " years";
        }
        if (number < century * 100) {
            let centuries = number / century;
            return getNumberWords(centuries) + " centuries";
        }
        let years = number / year;
        return getNumberWords(years) + " years";
    }

    function getNumberWords(number, twoDP) {
        var numberWords = "";
        var trillion = Math.pow(10, 12);
        var billion = Math.pow(10, 9);
        var million = Math.pow(10, 6);
        var thousand = Math.pow(10, 4);
        var hundred = Math.pow(10, 3);
        let decimalPoint = 0;
        while (number / trillion >= 1) {
            numberWords = " trillion " + numberWords;
            number = number / trillion;
        }
        while (number / billion >= 1) {
            numberWords = " billion " + numberWords;
            number = number / billion;
        }
        while (number / million >= 1) {
            numberWords = " million " + numberWords;
            number = number / million;
        }
        while (number / thousand >= 1) {
            numberWords = " thousand " + numberWords;
            number = number / thousand;
        }
        while (number / hundred >= 1) {
            numberWords = " hundred " + numberWords;
            number = number / hundred;
        }
        if (twoDP) {
            decimalPoint = 100;
        } else {
            decimalPoint = 1;
        }
        number = (Math.round(number * decimalPoint) / decimalPoint)
        numberWords = number + numberWords;
        return numberWords;
    }

    result.score = lengthScore(str)
                + uppercaseScore(str)
                + lowercaseScore(str)
                + numbersScore(str)
                + symbolsScore(str)
                + onlyLettersScore(str)
                + onlyNumbersScore(str)
                + consecutiveUppercaseLettersScore(str)
                + consecutiveLowercaseLettersScore(str)
                + consecutiveNumbersScore(str)
                + sequenceLetterScore(str)
                + sequenceNumbersScore(str)
                + sequenceSymbolsScore(str)
                + repeatCharactersScore(str);

    let crack_time_in_secs = Math.pow(80, str.length) / (100 * Math.pow(10, 12));
    result.crack_time = toWords(crack_time_in_secs);

    if (result.score < 40) result.state = "very weak";
    if (40 <= result.score && result.score < 80) result.state = "weak";
    if (80 <= result.score && result.score < 120) result.state = "medium";
    if (120 <= result.score && result.score < 180) result.state = "strong";
    if (180 <= result.score && result.score < 200) result.state = "very strong";
    if (200 <= result.score) result.state = "perfect";


    return result;
}

export default CheckPassword;