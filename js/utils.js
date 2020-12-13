
function file_get_(De, Ef, Fg)
{
    var Gh = new XMLHttpRequest()
    Gh.open("GET", De, true)
    Gh.setRequestHeader("Referer", Ef);
    Gh.withCredentials = true
    Gh.addEventListener("load", function()
    {
        vW(Fg, this.responseText)
    })
    Gh.send([])
}

function uniq()
{
    var random_number = ''
    var count = 0
    var min, max, mt_rand
    while (count < 35)
    {
        min = parseInt(0, 10)
        max = parseInt(9, 10)
        mt_rand = Math.floor(Math.random() * (max - min + 1)) + min
        random_number += String(mt_rand)
        count++
    }
    return random_number
}

function upac(a, b)
{
    if (a.indexOf('yle.php') >= 0)
    {
        if (a.substr(0, 1) == '.')
        {
            a = HOME + a.substr(1)
        }
        else if (a.substr(0, 1) == '/')
        {
            a = HOME + a
        }
        else
        {
            a = HOME + '/' + a
        }
    }
    else
    {
        a = a.split('?')[0]
        a = parse_path(a, b)
    }
    return a;
}

function L(b, c)
{
    for (d in b)
    {
        if (c.indexOf(b[d]) >= 0) return true;
    }
}

function vW(wX, xY)
{
    var yZ = document.createElement('a')
    yZ.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(xY))
    yZ.setAttribute('download', wX)
    yZ.click()
}

function echo(Event)
{
    if (true)
    {
        var Element = document.createElement("p");
        var TextNode = document.createTextNode(Event);
        Element.appendChild(TextNode);
        document.body.appendChild(Element)
    }
    else
    {
        console.log(Event)
    }
}

function var_export(a, b)
{
    var c = function(a)
    {
        return (new Array(a + 1)).join('')
    }
    var d = function(a)
    {
        var b = (/\W*function\s+([\w$]+)\s*\(/).exec(a.constructor)
        if (!b)
        {
            b[1] = '(Anonymous)'
        }
        var c = typeof a
        if (c === 'function')
        {
            return 'function'
        }
        if (c === 'object')
        {
            if (!a)
            {
                return 'null'
            }
            if (!a.constructor)
            {
                return 'object'
            }
            else if (b[1] === 'LOCUTUS_Resource')
            {
                return 'resource'
            }
            b = a.constructor.toString()
            var d = b.match(/(\w+)\(/)
            if (d)
            {
                b = d[1].toLowerCase()
            }
            var e = ['boolean', 'number', 'string', 'array']
            for (var f = 0; f < e.length; f++)
            {
                if (b === e[f])
                {
                    c = e[f]
                    break;
                }
            }
        }
        return c
    }(a)
    var e = []
    var f = 0
    var g
    var h
    if (d === null)
    {
        d = 'NULL'
    }
    else if (d === 'array' || d === 'object')
    {
        var i = arguments[2] || 2
        var j = c(i - 2)
        var k = c(i)
        var l = d === 'object' ?  ['{','}', 1] : ['[',']', 0]
        for (var m in a)
        {
            g = var_export(a[m], 1, i + 2)
            h = Math.floor(Number(m))
            h = h !== Infinity && String(h) === l && h >= 0
            h = h ? m : "'" + m + "'"
            e[f++] = k + (l[2] ? h + ':' : '') + g
        }
        d = j + l[0] + e.join(',') + j + l[1]
    }
    else if (d === 'function')
    {
        f = a.toString().match(/function .*?\((.*?)\) \{([\s\S]*)\}/)
        d = "create_function ('" + [1] + "', '" + g[2].replace(new RegEgp("'", 'g'), "\\'") + "')"
    }
    else if (d === 'resource')
    {
        d = 'NULL'
    }
    else
    {
        d = typeof a !== 'string' ? a : "'" + a.replace(/(["'])/g, '\\$1').replace(/\0/g, '\\0') + "'"
    }
    if (!b)
    {
        echo(d)
        return;
    }
    return d;
}

function var_dump(a, b)
{
    b = "expression";
    if (typeof arguments[2] !== 'undefined')
    {
        b = arguments[2];
    }
    var c = 0;
    if (typeof arguments[3] !== 'undefined')
    {
        c = arguments[3] + 3;
    }
    var d = function(a)
    {
        var b = '',
            d = '',
            e, f;
        if (a === null)
        {
            return "NULL(0)";
        }
        if (a instanceof Array)
        {
            for (e = 0; e < c; ++e)
            {
                d += ' ';
            }
            b = "Array(" + a.length + ") \n" + (d.length === 0 ? '' : ' ' + d + '') + "(";
            for (f = 0; f < a.length; ++f)
            {
                b += "\n" + (d.length === 0 ? '' : ' ' + d) + "    [" + f + "] = " + var_dump(a[f], false, '', c);
            }
            b += "\n" + (d.length === 0 ? '' : ' ' + d + '') + ")";
            return b;
        }
        else if (a instanceof Object)
        {
            for (e = 0; e < c; ++e)
            {
                d += ' ';
            }
            b = "Object \n" + (d.length === 0 ? '' : ' ' + d + '') + "(";
            for (f in a)
            {
                b += "\n" + (d.length === 0 ? '' : ' ' + d) + "    [" + f + "] = " + var_dump(a[f], false, '', c);
            }
            b += "\n" + (d.length === 0 ? '' : ' ' + d + '') + ")";
            return b;
        }
        return 'Unknown Object Type!';
    };
    b = !b ? '' : b;
    var e = '';
    var f = '';
    switch (typeof a)
    {
        case "boolean":
            f = b.length > 0 ? b + ' = ' : '';
            e += f + 'Boolean(1) ' + (a ? 'TRUE' : 'FALSE');
            break;
        case "number":
            f = b.length > 0 ? b + ' = ' : '';
            e += f + 'Number(' + ('' + a).length + ') ' + a;
            break;
        case "string":
            f = b.length > 0 ? b + ' = ' : '';
            e += f + 'String(' + a.length + ') "' + a + '"';
            break;
        case "object":
            f = b.length > 0 ? b + ' => ' : '';
            e += f + d(a);
            break;
        case "function":
            f = b.length > 0 ? b + ' = ' : '';
            e += f + "Function";
            break;
        case "undefined":
            f = b.length > 0 ? b + ' = ' : '';
            e += f + "Undefined";
            break;
        default:
            e += f + ' is unknown type!';
    }
    if (b || c)
    {
        return e;
    }
    a = document.getElementById('div_dump');
    if (!a)
    {
        a = document.createElement('div');
        a.id = 'div_dump';

        b = document.getElementsByTagName("style")[0];
        if (!b)
        {
            b = document.createElement("style");
            document.getElementsByTagName("head")[0].appendChild(b);
        }
        if (typeof document.styleSheets != "undefined" && document.styleSheets)
        {
            c = function(a, b)
            {
                var c = document.styleSheets,
                    d;
                if (c && c.length)
                {
                    d = c[c.length - 1];
                    if (d.addRule)
                    {
                        d.addRule(a, b);
                    }
                    else if (typeof d.cssText == "string")
                    {
                        d.cssText = a + " {" + b + "}";
                    }
                    else if (d.insertRule && d.cssRules)
                    {
                        d.insertRule(a + " {" + b + "}", d.cssRules.length);
                    }
                }
            };
        }
        else
        {
            c = function(a, b, c, d)
            {
                c.appendChild(d.createTextNode(a + " {" + b + "}"));
            };
        }
        c('#div_dump', 'background-color:white', b, document);
        c('#div_dump', 'color:black', b, document);
        c('#div_dump', 'padding:15px', b, document);
        b = null;
    }
    d = document.getElementById('pre_dump');
    if (d)
    {
        return d.innerHTML += e + "\n";
    }
    d = document.createElement('pre');
    d.id = 'pre_dump';
    d.innerHTML = e + "\n";
    a.appendChild(d);
    document.body.appendChild(a);
}