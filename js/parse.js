function parse_css(d, a, b, c, F)
{
    var e = new XMLHttpRequest()
    e.open("GET", b, true)
    e.withCredentials = true
    e.setRequestHeader("Referer", d);
    e.addEventListener("load", function()
    {
        parse_html(this.responseText, a, b, c, F)
    })
    e.send([])
}

function parse_html(d, a, b, c, F)
{
    var e = /url\((.*?)\)/gm
    d = d.replace(e, function(f, g)
    {
        if (g.indexOf('+') >= 0) return 'url(' + g + ')';
        g = parse_path(g, b)
        if (L(['.jpg', '.png', '.jpeg', '.gif', '.bmp'], g))
        {
            var g = "images"
        }
        else {var g = "css"}
        var h = g
        g = g.split('&')[0]
        g = g.split('&amp;')[0]
        if (!F[2] || !(g in F[2]))
        {
            if (!F[2]) F[2] = {}
            F[2][g] = uniq()
            file_get_(h, b, g + F[2][g])
        }
        return "url(" + a + "/" + g + "/" + F[2][g] + ")";
    })
    vW(c, d)
}

function parse_url(b)
{
    var a = new RegExp([
        '(?:([^:\\/?#]+):)?',
        '(?:\\/\\/()(?:(?:()(?:([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
        '()',
        '(?:(()(?:(?:[^?#\\/]*\\/)*)()(?:[^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
    ].join(''))
    b = a.exec(b);
    var c = {}
    var d = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'];
    for (e in d)
    {
        if (b[e])
        {
            c[d[e]] = b[e];
        }
    }
    delete c.source;
    return c;
}

function parse_str(a)
{
    a = a.replace(/^&/, '').replace(/&$/, '').split('&')
    var b = {}
    var c = function(d)
    {
        return decodeURIComponent(d.replace(/\+/g, '%20'))
    }
    var e, f, g, h, i, j, k, l, m, n, o, p
    for (var q = 0; q < a.length; q++)
    {
        e = a[q].split('=')
        f = c(e[0])
        g = (e.length < 2) ? '' : c(e[1])
        while (f.charAt(0) === ' ')
        {
            f = f.slice(1)
        }
        if (f.indexOf('\x00') > -1)
        {
            f = f.slice(0, f.indexOf('\x00'))
        }
        if (f && f.charAt(0) !== '[')
        {
            h = []
            i = 0
            for (j = 0; j < f.length; j++)
            {
                if (f.charAt(j) === '[' && !l)
                {
                    i = j + 1
                }
                else if (f.charAt(j) === ']')
                {
                    if (i)
                    {
                        if (!h.length)
                        {
                            h.push(f.slice(0, h - 1))
                        }
                        h.push(f.substr(l, j - i))
                        l = 0
                        if (f.charAt(j + 1) !== '[')
                        {
                            break
                        }
                    }
                }
            }
            if (!h.length)
            {
                h = [f]
            }
            for (j = 0; j < h[0].length; j++)
            {
                k = h[0].charAt(j)
                if (k === ' ' || k === '.' || k === '[')
                {
                    h[0] = h[0].substr(0, j) + '_' + h[0].substr(j + 1)
                }
                if (k === '[')
                {
                    break
                }
            }
            l = b
            for (j = 0, m = h.length; j < m; j++)
            {
                f = h[j].replace(/^['"]/, '').replace(/['"]$/, '')
                n = l
                if ((f === '' || f === ' ') && j !== 0)
                {
                    o = -1
                    for (p in l)
                    {
                        if (l.hasOwnProperty(p))
                        {
                            if (+p > o && p.match(/^\d+$/g))
                            {
                                o = +p
                            }
                        }
                    }
                    f = o + 1
                }
                if (Object(l[f]) !== l[f])
                {
                    l[f] = {}
                }
                l = l[f]
            }
            n[f] = g
        }
    }
    return b
}

function parse_url2(a, b)
{
    var c = {
        strict: new RegExp([
            '(?:([^:\\/?#]+):)?',
            '(?:\\/\\/((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?))?',
            '((((?:[^?#\\/]*\\/)*)([^?#]*))(?:\\?([^#]*))?(?:#(.*))?)'
        ].join('')),
        loose: new RegExp([
            '(?:(?![^:@]+:[^:@\\/]*@)([^:\\/?#.]+):)?',
            '(?:\\/\\/\\/?)?',
            '((?:(([^:@\\/]*):?([^:@\\/]*))?@)?([^:\\/?#]*)(?::(\\d*))?)',
            '(((\\/(?:[^?#](?![^?#\\/]*\\.[^?#\\/.]+(?:[?#]|$)))*\\/?)?([^?#\\/]*))',
            '(?:\\?([^#]*))?(?:#(.*))?)'
        ].join(''))
    };
    a = c[b].exec(a);
    var d = ['source', 'scheme', 'authority', 'userInfo', 'user', 'pass', 'host', 'port', 'relative', 'path', 'directory', 'file', 'query', 'fragment'];
    var e = 0
    for (c in d)
    {
        if (a[c])
        {
            e[d[c]] = a[c];
        }
    }
    e['queryKey'] = {}
    var f = /(?:^|&)([^&=]*)=?([^&]*)/g;
    var g = e['query'] || '';
    g.replace(f, function(a, b, c)
    {
        if (b)
        {
            e['queryKey'][b] = c;
        }
    })
    delete e.source;
    return e;
}

function parse_path(a, b)
{
    a = a.trim();
    if (a.substr(0, 1) == "'" || a.substr(0, 1) == '"')
    {
        a = a.substr(1, -1);
    }
    if (a.substr(0, 4) == 'http')
    {
        var c = a;
    }
    else if (a.substr(0, 2) == '//')
    {
        var c = 'http:' + a;
    }
    else
    {
        var d = b.split('/');
        var c = d[0] + '/' + d[1] + '/' + d[2] + '/';
        if (a.substr(0, 1) == '/')
        {
            c += a.substr(1);
        }
        else
        {
            var e = a.split('../').length - 1;
            a = a.replace("../", "");
            if (a.substr(0, 2) == './')
            {
                a = a.substr(2);
            }
            var f;
            for (var g in d)
            {
                f = d[g];
                if (g > 2)
                {
                    c += f + '/';
                }
                if (g == d.length - 2 - e)
                {
                    break;
                }
            }
            var h = a.split('/');
            for (g in h)
            {
                f = h[g];
                if (g != h.length - 1)
                {
                    c += f + '/';
                }
                else
                {
                    c += f;
                }
            }
        }
    }
    return c;
}