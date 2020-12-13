function is_array(arg)
{
    return Object.prototype.toString.call(arg) === '[object Array]';
}

function array_map(callback)
{
    var argc = arguments.length,
        argv = arguments,
        obj = null,
        cb = callback,
        j = argv[1].length,
        i = 0,
        k = 1,
        m = 0,
        tmp = [],
        tmpArr = [],
        $global = 0;
    while (i < j)
    {
        while (k < argc)
        {
            tmp[m++] = argv[k++][i];
        }
        m = 0;
        k = 1;
        if (callback)
        {
            if (typeof callback === 'string')
            {
                cb = $global[callback];
            }
            else if (typeof callback === 'object' && callback.length)
            {
                obj = typeof callback[0] === 'string' ? $global[callback[0]] : callback[0];
                if (typeof obj === 'undefined')
                {
                    throw new Error('Object not found: ' + callback[0]);
                }
                cb = typeof callback[1] === 'string' ? obj[callback[1]] : callback[1];
            }
            tmpArr[i++] = cb.apply(obj, tmp);
        }
        else
        {
            tmpArr[i++] = tmp;
        }
        tmp = [];
    }
    return tmpArr;
}

function array_search(needle, haystack, argStrict)
{
    var strict = !!argStrict,
        key = '';
    if (typeof needle === 'object' && needle.exec)
    {
        if (!strict)
        {
            var flags = 'i' + (needle.global ? 'g' : '') +
                (needle.multiline ? 'm' : '') +
                (needle.sticky ? 'y' : '');
            needle = new RegExp(needle.source, flags);
        }
        for (key in haystack)
        {
            if (haystack.hasOwnProperty(key))
            {
                if (needle.test(haystack[key]))
                {
                    return key;
                }
            }
        }
        return false;
    }
    for (key in haystack)
    {
        if (haystack.hasOwnProperty(key))
        {
            if ((strict && haystack[key] === needle) || (!strict && haystack[key] == needle))
            {
                return key;
            }
        }
    }
    return false;
}

function strcasecmp(fString1, fString2)
{
    var string1 = (fString1 + '').toLowerCase(),
        string2 = (fString2 + '').toLowerCase();
    if (string1 > string2)
    {
        return 1;
    }
    else if (string1 === string2)
    {
        return 0;
    }
    return -1;
}

function trim(x)
{
    return x.replace(/^\s+|\s+$/gm, '');
}

function str_ireplace(search, replace, subject)
{
    var i, k = '',
        searchl = search.length,
        reg,
        escapeRegex = function(s)
        {
            return s.replace(/([\\\^\$*+\[\]?{}.=!:(|)])/g, '\\$1');
        };
    if (Object.prototype.toString.call(replace) !== '[object Array]')
    {
        replace = [replace];
        if (Object.prototype.toString.call(search) === '[object Array]')
        {
            while (searchl > replace.length)
            {
                replace[replace.length] = replace[0];
            }
        }
    }
    if (Object.prototype.toString.call(search) !== '[object Array]')
    {
        search = [search];
    }
    while (search.length > replace.length)
    {
        replace[replace.length] = '';
    }
    if (Object.prototype.toString.call(subject) === '[object Array]')
    {
        for (k in subject)
        {
            if (subject.hasOwnProperty(k))
            {
                subject[k] = str_ireplace(search, replace, subject[k]);
            }
        }
        return subject;
    }
    searchl = search.length;
    for (i = 0; i < searchl; i++)
    {
        reg = new RegExp(escapeRegex(search[i]), 'gi');
        subject = subject.replace(reg, replace[i]);
    }
    return subject;
}

function ksort(src)
{
    var keys = Object.keys(src),
        target = {};
    keys.sort();
    keys.forEach(function(key)
    {
        target[key] = src[key];
    });
    return target;
}

function array_slice(arr, offst, lgth, preserveKeys)
{
    var key;
    if (Object.prototype.toString.call(arr) !== '[object Array]' || (preserveKeys && offst !== 0))
    {
        var lgt = 0,
            newAssoc = {};
        for (key in arr)
        {
            lgt += 1;
            newAssoc[key] = arr[key];
        }
        arr = newAssoc;
        offst = (offst < 0) ? lgt + offst : offst;
        lgth = lgth === undefined ? lgt : (lgth < 0) ? lgt + lgth - offst : lgth;
        var assoc = {},
            start = false,
            it = -1,
            arrlgth = 0,
            noPkIdx = 0;
        for (key in arr)
        {
            ++it;
            if (arrlgth >= lgth)
            {
                break;
            }
            if (it === offst)
            {
                start = true;
            }
            if (!start)
            {
                continue;
            }++arrlgth;
            if (isInt(key) && !preserveKeys)
            {
                assoc[noPkIdx++] = arr[key];
            }
            else
            {
                assoc[key] = arr[key];
            }
        }
        return assoc;
    }
    if (lgth === undefined)
    {
        return arr.slice(offst);
    }
    else if (lgth >= 0)
    {
        return arr.slice(offst, offst + lgth);
    }
    else
    {
        return arr.slice(offst, lgth);
    }
}

function isInt(value)
{
    return !isNaN(value) &&
        parseInt(Number(value), 0) == value &&
        !isNaN(parseInt(value, 10));
}

function in_array(needle, haystack, argStrict)
{
    var key;
    if (!!argStrict)
    {
        for (key in haystack)
        {
            if (haystack[key] === needle)
            {
                return true;
            }
        }
    }
    else
    {
        for (key in haystack)
        {
            if (haystack[key] == needle)
            {
                return true;
            }
        }
    }
    return false;
}

function is_numeric(mixedVar)
{
    var whitespace = [
        ' ',
        '\n',
        '\r',
        '\t',
        '\f',
        '\x0b',
        '\xa0',
        '\u2000',
        '\u2001',
        '\u2002',
        '\u2003',
        '\u2004',
        '\u2005',
        '\u2006',
        '\u2007',
        '\u2008',
        '\u2009',
        '\u200a',
        '\u200b',
        '\u2028',
        '\u2029',
        '\u3000'
    ].join('');
    return (typeof mixedVar === 'number' ||
            (typeof mixedVar === 'string' &&
                whitespace.indexOf(mixedVar.slice(-1)) === -1)) &&
        mixedVar !== '' &&
        !isNaN(mixedVar);
}

function strtolower(att_var)
{
    if (typeof att_val === 'string' || att_val instanceof String)
    {
        att_val = att_val.toLowerCase();
    }
    return att_val;
}

function strtoupper(str)
{
    return (str + '').toUpperCase();
}

function ord(string)
{
    var str = string + '',
        code = str.charCodeAt(0);
    if (code >= 0xD800 && code <= 0xDBFF)
    {
        var hi = code;
        if (str.length === 1)
        {
            return code;
        }
        var low = str.charCodeAt(1);
        return ((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000;
    }
    if (code >= 0xDC00 && code <= 0xDFFF)
    {
        return code;
    }
    return code;
}

function filter_var(input, filter, options)
{
    var is = function(val, type)
    {
        if (val === null)
        {
            return type === "null";
        }
        if (type === "primitive")
        {
            return val !== Object(val);
        }
        var actual = typeof val;
        if (actual === "object")
        {
            return {
                "[object Array]": "array",
                "[object RegExp]": "regex"
            } [Object.prototype.toString.call(val)] || "object";
        }
        if (actual === "number")
        {
            if (isNaN(val))
            {
                return type === "nan";
            }

            if (!isFinite(val))
            {
                return "inf";
            }
        }
        return type === actual;
    }
    var supportedFilters = {
            FILTER_VALIDATE_INT: 257,
            FILTER_VALIDATE_BOOLEAN: 258,
            FILTER_VALIDATE_FLOAT: 259,
            FILTER_VALIDATE_REGEXP: 272,
            FILTER_VALIDATE_URL: 273,
            FILTER_VALIDATE_EMAIL: 274,
            FILTER_VALIDATE_IP: 275,
            FILTER_SANITIZE_STRING: 513,
            FILTER_SANITIZE_STRIPPED: 513,
            FILTER_SANITIZE_ENCODED: 514,
            FILTER_SANITIZE_SPECIAL_CHARS: 515,
            FILTER_UNSAFE_RAW: 516,
            FILTER_DEFAULT: 516,
            FILTER_SANITIZE_EMAIL: 517,
            FILTER_SANITIZE_URL: 518,
            FILTER_SANITIZE_NUMBER_INT: 519,
            FILTER_SANITIZE_NUMBER_FLOAT: 520,
            FILTER_SANITIZE_MAGIC_QUOTES: 521,
            FILTER_SANITIZE_FULL_SPECIAL_CHARS: -1,
            FILTER_CALLBACK: 1024
        },
        supportedFlags = {
            FILTER_FLAG_ALLOW_OCTAL: 1,
            FILTER_FLAG_ALLOW_HEX: 2,
            FILTER_FLAG_STRIP_LOW: 4,
            FILTER_FLAG_STRIP_HIGH: 8,
            FILTER_FLAG_ENCODE_LOW: 16,
            FILTER_FLAG_ENCODE_HIGH: 32,
            FILTER_FLAG_ENCODE_AMP: 64,
            FILTER_FLAG_NO_ENCODE_QUOTES: 128,
            FILTER_FLAG_ALLOW_FRACTION: 4096,
            FILTER_FLAG_ALLOW_THOUSAND: 8192,
            FILTER_FLAG_ALLOW_SCIENTIFIC: 16384,
            FILTER_FLAG_PATH_REQUIRED: 262144,
            FILTER_FLAG_QUERY_REQUIRED: 524288,
            FILTER_FLAG_IPV4: 1048576,
            FILTER_FLAG_IPV6: 2097152,
            FILTER_FLAG_NO_RES_RANGE: 4194304,
            FILTER_FLAG_NO_PRIV_RANGE: 8388608,
            FILTER_NULL_ON_FAILURE: 134217728
        };
    if (is(filter, "null"))
    {
        filter = supportedFilters.FILTER_DEFAULT;
    }
    else if (is(filter, "string"))
    {
        filter = supportedFilters[filter];
    }
    var flags = 0;
    if (is(options, "number"))
    {
        flags = options;
    }
    else if (is(options, "string"))
    {
        flags = supportedFlags[options] || 0;
    }
    else if (is(options, "object") && is(options.flags, "number"))
    {
        flags = options.flags;
    }
    var opts = {};
    if (is(options, "object"))
    {
        opts = options.options ||
        {};
    }
    var failure = (flags & supportedFlags.FILTER_NULL_ON_FAILURE) ? null : false;
    if (!is(filter, "number"))
    {
        return failure;
    }
    if (input === Object(input))
    {
        return failure;
    }
    var data = is(input, "string") ? input.replace(/(^\s+)|(\s+$)/g, '') : input;
    switch (filter)
    {
        case supportedFilters.FILTER_VALIDATE_BOOLEAN:
            return (/^(?:1|true|yes|on)$/i.test(data) || (/^(?:0|false|no|off)$/i).test(data) ? false : failure);
        case supportedFilters.FILTER_VALIDATE_INT:
            var numValue = +data;
            if (!/^(?:0|[+\-]?[1-9]\d*)$/.test(data))
            {
                if ((flags & supportedFlags.FILTER_FLAG_ALLOW_HEX) && /^0x[\da-f]+$/i.test(data))
                {
                    numValue = parseInt(data, 16);
                }
                else if ((flags & supportedFlags.FILTER_FLAG_ALLOW_OCTAL) && /^0[0-7]+$/.test(data))
                {
                    numValue = parseInt(data, 8);
                }
                else
                {
                    return failure;
                }
            }
            var minValue = is(opts.min_range, "number") ? opts.min_range : -Infinity;
            var maxValue = is(opts.max_range, "number") ? opts.max_range : Infinity;
            if (!is(numValue, "number") || numValue % 1 || numValue < minValue || numValue > maxValue)
            {
                return failure;
            }
            return numValue;
        case supportedFilters.FILTER_VALIDATE_REGEXP:
            if (is(options.regexp, "regex"))
            {
                var matches = options.regexp(data);
                return matches ? matches[0] : failure;
            }
            break;
        case supportedFilters.FILTER_VALIDATE_IP:
            var ipv4 = /^(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)\.(25[0-5]|2[0-4]\d|[01]?\d?\d)$/;
            var ipv4privrange = /^(?:0?10|172\.0?(?:1[6-9]|2\d|3[01])|192\.168)\./;
            var ipv4resrange = /^(?:0?0?0\.|127\.0?0?0\.0?0?0\.0?0?1|128\.0?0?0\.|169\.254\.|191\.255\.|192\.0?0?0\.0?0?2\.|25[0-5]\.|2[34]\d\.|22[4-9]\.)/;
            var ipv6 = /^((([0-9A-Fa-f]{1,4}:){7}([0-9A-Fa-f]{1,4}|:))|(([0-9A-Fa-f]{1,4}:){6}(:[0-9A-Fa-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){5}(((:[0-9A-Fa-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9A-Fa-f]{1,4}:){4}(((:[0-9A-Fa-f]{1,4}){1,3})|((:[0-9A-Fa-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){3}(((:[0-9A-Fa-f]{1,4}){1,4})|((:[0-9A-Fa-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){2}(((:[0-9A-Fa-f]{1,4}){1,5})|((:[0-9A-Fa-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9A-Fa-f]{1,4}:){1}(((:[0-9A-Fa-f]{1,4}){1,6})|((:[0-9A-Fa-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9A-Fa-f]{1,4}){1,7})|((:[0-9A-Fa-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))(%.+)?$/;
            var mode = (supportedFlags.FILTER_FLAG_IPV4 | supportedFlags.FILTER_FLAG_IPV6),
                ip;
            if (flags !== 0)
            {
                mode &= flags;
            }
            if (mode & supportedFlags.FILTER_FLAG_IPV4)
            {
                ip = ipv4.test(input);
                if (ip)
                {
                    if ((flags & supportedFlags.FILTER_FLAG_NO_PRIV_RANGE) && privrange.test(data))
                    {
                        return failure;
                    }
                    if ((flags & supportedFlags.FILTER_FLAG_NO_RES_RANGE) && resrange.test(data))
                    {
                        return failure;
                    }
                    return input;
                }
            }
            if (mode & supportedFlags.FILTER_FLAG_IPV6)
            {
                ip = ipv6.test(input);
                if (ip) return input;
            }
            return failure;
        case supportedFilters.FILTER_CALLBACK:
            var fn = opts;
            if (is(fn, "string"))
            {
                fn = this.window[fn];
            }
            if (is(fn, "function"))
            {
                return fn(input);
            }
            return failure;
        case supportedFilters.FILTER_SANITIZE_NUMBER_INT:
            return ("" + input).replace(/[^\d+\-]/g, "");
        case supportedFilters.FILTER_SANITIZE_NUMBER_FLOAT:
            return ('' + input).replace(/[^\deE.,+\-]/g, '').replace(/[eE.,]/g,
                function(m)
                {
                    return {
                        '.': (filter & supportedFilters.FILTER_FLAG_ALLOW_FRACTION) ? '.' : '',
                        ',': (filter & supportedFilters.FILTER_FLAG_ALLOW_THOUSAND) ? ',' : '',
                        'e': (filter & supportedFilters.FILTER_FLAG_ALLOW_SCIENTIFIC) ? 'e' : '',
                        'E': (filter & supportedFilters.FILTER_FLAG_ALLOW_SCIENTIFIC) ? 'e' : ''
                    } [m];
                });
        case supportedFilters.FILTER_SANITIZE_URL:
            return ("" + data).replace(/[^a-zA-Z\d$\-_.+!*'(),{}|\\\^~\[\]`<>#%";\/?:@&=]/g, '');
        case supportedFilters.FILTER_SANITIZE_EMAIL:
            return ("" + data).replace(/[^a-zA-Z\d!#$%&'*+\-\/=?\^_`{|}~@.\[\]]/g, '');
        case supportedFilters.FILTER_DEFAULT:
        case supportedFilters.FILTER_UNSAFE_RAW:
            data = input + "";
            if (flags & supportedFlags.FILTER_FLAG_ENCODE_AMP)
            {
                data = data.replace(/&/g, "&#38");
            }
            if ((supportedFlags.FILTER_FLAG_ENCODE_LOW |
                    supportedFlags.FILTER_FLAG_STRIP_LOW |
                    supportedFlags.FILTER_FLAG_ENCODE_HIGH |
                    supportedFlags.FILTER_FLAG_STRIP_HIGH) &
                flags)
            {
                data = data.replace(/[\s\S]/g,
                    function(c)
                    {
                        var charCode = c.charCodeAt(0);

                        if (charCode < 32)
                        {
                            return (flags & supportedFlags.FILTER_FLAG_STRIP_LOW) ? "" :
                                (flags & supportedFlags.FILTER_FLAG_ENCODE_LOW) ? "&#" + charCode : c;
                        }
                        else if (charCode > 127)
                        {
                            return (flags & supportedFlags.FILTER_FLAG_STRIP_HIGH) ? "" : (flags & supportedFlags.FILTER_FLAG_ENCODE_HIGH) ? "&#" + charCode : c;
                        }
                        return c;
                    });
            }
            return data;
        default:
            return false;
    }
    return false;
}

function count(obj)
{
    return Object.keys(obj).length;
}

function strspn(str1, str2, start, lgth)
{
    let found;
    let stri;
    let strj;
    let j = 0;
    let i = 0;
    start = start ? (start < 0 ? (str1.length + start) : start) : 0;
    lgth = lgth ? ((lgth < 0) ? (str1.length + lgth - start) : lgth) : str1.length - start;
    str1 = str1.substr(start, lgth);
    for (i = 0; i < str1.length; i++)
    {
        found = 0;
        stri = str1.substring(i, i + 1);
        for (j = 0; j <= str2.length; j++)
        {
            strj = str2.substring(j, j + 1);
            if (stri === strj)
            {
                found = 1;
                break;
            }
        }
        if (found !== 1)
        {
            return i;
        }
    }
    return i;
}

function substr_replace(str, replace, start, length)
{
    if (start < 0)
    {
        start = start + str.length
    }
    length = length !== undefined ? length : str.length
    if (length < 0)
    {
        length = length + str.length - start
    }
    return [
        str.slice(0, start),
        replace.substr(0, length),
        replace.slice(length),
        str.slice(start + length)
    ].join('')
}

function preg_match_all(pattern, subject, flags)
{
    flags = Object.prototype.toString.call(flags) === '[object Array]' ? flags : [];
    var a;
    try
    {
        a = new RegExp(pattern, "gm");
    }
    catch (a)
    {
        alert(a);
        return;
    }
    var b = [],
        c = subject.match(a),
        d = [],
        e, f, g, h, i, j, k;
    if (!c)
    {
        return;
    }
    if (flags.includes("PREG_OFFSET_CAPTURE"))
    {
        h = a.exec(subject);
        while (h)
        {
            d.push(h.index);
            h = a.exec(subject);
        }
    }
    a = new RegExp(pattern, "");
    for (f = 0; f < c.length; f++)
    {
        e = c[f].match(a);
        for (g = 0; g < e.length; g++)
        {
            if (typeof(b[g]) === "undefined")
            {
                b[g] = [];
            }
            k = b[g];
            if (flags.includes("PREG_OFFSET_CAPTURE"))
            {
                k[f] = [e[g]];
                if (g)
                {
                    h = b[g - 1][f][1];
                    i = b[g - 1][f][0];
                    j = k[f][0];
                    k[f][1] = h + i.indexOf(j);
                }
                else k[f][1] = d[f];
            }
            else
            {
                k[f] = e[g];
            }
        }
    }
    if (flags.includes("PREG_SET_ORDER"))
    {
        a = [];
        if (b.length && b[0].length)
        {
            for (f = 0; f < b[0].length; f++)
            {
                a[f] = [];
                for (g = 0; g < b.length; g++)
                {
                    a[f].push(b[g][f]);
                }
            }
        }
        b = a;
    }
    return b;
}

function strpos(haystack, needle, offset)
{
    var i = (haystack + '').indexOf(needle, (offset || 0));
    return i === -1 ? false : i;
}

function preg_quote(str, delimiter)
{
    return (str + '').replace(new RegExp('[.\\\\+*?\\[\\^\\]$(){}=!<>|:\\' + (delimiter || '') + '-]', 'g'), '\\$&');
}