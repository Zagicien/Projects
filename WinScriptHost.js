// http://www.java2s.com/Tutorial/JavaScript/0600__MS-JScript/FileSystemObjectGetFolder.htm

if (false) {

    XMLHttpRequest('test.txt', {}, function() {
        if (this.responseXML) {
            WScript.Echo(WScript.ScriptFullName)
        }
    })

}

function XMLHttpRequest(a, b, c) {
    var d
    var e
    var f
    if (a.split(':').length == 1) {
        d = WScript.ScriptFullName.split('\\')
        e = ""
        for (f = 0; f < d.length - 1; f++) {
            e = e + d[f] + '/'
        }
        a = e + a
    }
    d = 'GET';
    e = []
    if (!object_equal( b , {} )) {
        d = 'POST';
        for (f in b) {
            e.push(f + '=' + encodeURIComponent(b[f]))
        }
        b = e.join('&');
    }
    var g = new ActiveXObject("Microsoft.XMLHTTP");
    g.open(d, a, true);
    g.onreadystatechange = function() {
        if (g.readyState == 4) {
            var a = {
                responseXML: g.responseXML,
                responseText: g.responseText,
                b: c
            }
            a.b()
        }
    }
    g.send(b); // or g.send() if GET
}


function object_equal(a, b) {
    for (var c in a) {
        if (!b.hasOwnProperty(c)) {
            return false;
        }
        if (a[c] != b[c]) {
            return false;
        }
    }
    for (c in b) {
        if (!a.hasOwnProperty(c)) {
            return false;
        }
        if (a[c] != b[c]) {
            return false;
        }
    }
    return true;
}

function scandir(a) {
    var b = new ActiveXObject("Scripting.FileSystemObject");
    var c = [a];
    var d = [];
    var e;
    var f;
    var g;
    while (e = c.pop()) {
        f = b.GetFolder(e);
        e = new Enumerator(f.SubFolders);
        for (; !e.atEnd(); e.moveNext()) {
            g = e.item().path
            c.push(g.replace(/\\/g, '/'))
        }
        e = new Enumerator(f.Files);
        for (; !e.atEnd(); e.moveNext()) {
            g = e.item().path
            d.push(g.replace(/\\/g, '/'))
        }
    }
    return d
}

function echo(a) {
    WScript.Echo(a);
}

function alert(a) {
    new ActiveXObject("WScript.Shell").Popup(a);
}

function() {
    var a = new ActiveXObject("Scripting.FileSystemObject");

    if (WScript.Arguments.length) {

        var b = WScript.Arguments(0);

        var c = a.OpenTextFile(b, 1, true);

        var d = c.ReadAll() è

        d = d.replace(/Bing/g, function(a) {

            WScript.Echo(d);

        });
    }
}