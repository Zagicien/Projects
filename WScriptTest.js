A = new ActiveXObject("Scripting.FileSystemObject");
// deplace = A.MoveFile(a, b)
//  folder = A.CreateFolder(a)

for (C in B = scandir('.')) {
    if ((D = B[C]) != WScript.ScriptFullName.split().pop()) {

        E = D.split('/')
        F = E[E.length - 1]
        if (F != 'desktop.ini' && F != WScript.ScriptFullName.split('\\').pop()) {

            if (F == 'index.html.txt') {
                A.MoveFile(D, D.split('.t')[0])
            } else {

                E[E.length - 1] = ''

                if (F.indexOf('ndex') > 0) {
                    if (F.indexOf('-') > 0) {
                        G = F.split('-p')[1]
                        G = G.split('.h')[0]
                        G = 'index-start' + G + '.html'
                    } else {
                        G = 'index.html'
                    }
                } else if (F.indexOf('-') > 0) {
                    G = F.split('-p')[1]
                    G = G.split('.h')[0]
                    H = F.split('id')[1]
                    H = H.split('-p')[0]
                    G = 't' + H + '-start' + G + '.html'
                } else {
                    G = F.split('id')[1]
                    if (G == null) continue
                    G = G.split('.h')[0]
                    G = 't' + G + '.html'
                }

                F = F.split('id')[0]
                F = F.split('in')[0]
                if (!A.FolderExists('f' + F)) {
                    A.CreateFolder('f' + F)
                }
                A.MoveFile(D, E.join('\\') + 'f' + F + '\\' + G)

            }
        }
    }
}

function scandir(a) {
    var c = [a];
    var d = [];
    var e;
    var f;
    var g;
    while (e = c.pop()) {
        f = A.GetFolder(e);
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