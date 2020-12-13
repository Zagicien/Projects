//require php.js
var a = new ActiveXObject("Scripting.FileSystemObject");
eval(a.OpenTextFile('php.js', 1).ReadAll());

var HDOM = {
    QUOTE_DOUBLE: 0,
    INFO_BEGIN: 0,
    SMARTY_AS_TEXT: 1,
    QUOTE_SINGLE: 1,
    TYPE_ELEMENT: 1,
    INFO_END: 1,
    TYPE_COMMENT: 2,
    INFO_QUOTE: 2,
    QUOTE_NO: 3,
    TYPE_TEXT: 3,
    INFO_SPACE: 3,
    TYPE_ENDTAG: 4,
    INFO_TEXT: 4,
    TYPE_ROOT: 5,
    INFO_INNER: 5,
    TYPE_UNKNOWN: 6,
    INFO_OUTER: 6,
    INFO_ENDSPACE: 7
};
var DEFAULT = {
    TARGET_CHARSET: 'UTF-8',
    BR_TEXT: "\r\n",
    SPAN_TEXT: ' '
};
var MAX_FILE_SIZE = 600000;

function simple_html_dom_node(dom)
{

    this.nodetype = HDOM.TYPE_TEXT;
    this.tag = 'text';
    this.attr = [];
    this.children = [];
    this.nodes = [this];
    this.parent = 0;
    this._ = [];
    this.tag_start = 0;
    this.dom = dom;

    this.destruct = function()
    {
        this.clear();
    };

    this.toString = function()
    {
        return this.outertext();
    };

    this.clear = function()
    {
        this.dom = 0;
        this.nodes = 0;
        this.parent = 0;
        this.children = 0;
    };

    this.dump = function(show_attr, depth)
    {
        if (undefined === show_attr) show_attr = true;
        if (undefined === depth) depth = 0;
        var output;
        if (show_attr && count(this.attr))
        {
            output = '(';
            for (var key in this.nodes)
            {
                output += "[" + key + "]=>\"" + this.nodes[key] + "\", ";
            }
            output += ")";
        }

        output += "\n";

        if (this.nodes)
        {
            for (var k in this.nodes)
            {
                output += this.nodes[k].dump(show_attr, depth + 1);
            }
        }

        return output;
    };

    this.dump_node = function(echo)
    {
        if (undefined === echo) echo = true;

        var string = this.tag;

        if (count(this.attr))
        {
            string += '(';
            for (var key in this.attr)
            {
                string += "[" + key + "]=>\"" + this.attr[key] + "\", ";
            }
            string += ')';
        }

        if (count(this._))
        {
            string += ' $_ (';
            for (var k in this._)
            {
                if (isArray(this._[k]))
                {
                    string += "[" + k + "]=>(";
                    for (var ke in this._[k])
                    {
                        string += "[" + ke + "]=>\"" + this._[k][ke] + "\", ";
                    }
                }
                else
                {
                    string += "[" + k + "]=>\"" + this._[k] + "\", ";
                }
            }
            string += ')';
        }

        if (this.text())
        {
            string += " text: (" + this.text() + ")";
        }

        if (HDOM.INFO_INNER in node._)
        {
            string += "'" + node._[HDOM.INFO_INNER] + "'";
        }
        else
        {
            string += ' NULL ';
        }

        string += ' children: ' + count(this.children);
        string += ' nodes: ' + count(this.nodes);
        string += ' tag_start: ' + this.tag_start;
        string += "\n";

        return string;
    };

    this.parent = function(parent)
    {
        if (undefined !== parent)
        {
            this.parent = parent;
            this.parent.nodes.push(this);
            this.parent.children.push(this);
        }
        return this.parent;
    };

    this.has_child = function()
    {
        return count(this.children);
    };

    this.children = function(idx)
    {
        if (undefined === idx)
        {
            return this.children;
        }
        if (idx in this.children)
        {
            return this.children[idx];
        }
    };

    this.first_child = function()
    {
        if (0 in this.children)
        {
            return this.children[0];
        }
    };

    this.last_child = function()
    {
        if (this.children.length)
        {
            return this.children[this.children.length - 1];
        }
    };

    this.next_sibling = function()
    {
        if (this.parent)
        {
            var idx = array_search(this, this.parent.children, true);
            if (idx !== false && (idx + 1) in this.parent.children)
            {
                return this.parent.children[idx + 1];
            }
        }
    };

    this.prev_sibling = function()
    {
        if (this.parent)
        {
            var index = array_search(this, this.parent.children, true);
            if (index && (index - 1) in this.parent.children)
            {
                return this.parent.children[index - 1];
            }
        }
    };

    this.find_ancestor_tag = function(tag)
    {
        if (this.parent)
        {
            var ancestor = this.parent;
            while (ancestor)
            {
                if (ancestor.tag === tag)
                {
                    break;
                }
                ancestor = ancestor.parent;
            }
            return ancestor;
        }
    };

    this.innertext = function()
    {
        if (HDOM.INFO_INNER in this._)
        {
            return this._[HDOM.INFO_INNER];
        }
        if (HDOM.INFO_TEXT in this._)
        {
            return this.dom.restore_noise(this._[HDOM.INFO_TEXT]);
        }
        var ret = '';
        for (var key in this.nodes)
        {
            ret += this.nodes[key].outertext();
        }
        return ret;
    };

    this.outertext = function()
    {
        if (this.tag === 'root')
        {
            return this.innertext();
        }
        if (this.dom && this.dom.callback)
        {
            this.dom.callback(this);
        }
        if (HDOM.INFO_OUTER in this._)
        {
            return this._[HDOM.INFO_OUTER];
        }
        if (HDOM.INFO_TEXT in this._)
        {
            return this.dom.restore_noise(this._[HDOM.INFO_TEXT]);
        }
        var ret = '';
        if (this.dom && this.dom.nodes[this._[HDOM.INFO_BEGIN]])
        {
            ret += this.dom.nodes[this._[HDOM.INFO_BEGIN]];
        }
        if (HDOM.INFO_INNER in this._)
        {
            if (this.tag !== 'br')
            {
                ret += this._[HDOM.INFO_INNER];
            }
        }
        else if (this.nodes)
        {
            for (var key in this.nodes)
            {
                ret += this.convert_text(this.nodes[key].outertext());
            }

        }
        if (HDOM.INFO_END in this._)
        {
            ret += '</' + this.tag + '>';
        }
        return ret;
    };

    this.text = function()
    {
        if (HDOM.INFO_INNER in this._)
        {
            return this._[HDOM.INFO_INNER];
        }
        if (this.nodetype == HDOM.TYPE_TEXT)
        {
            return this.dom.restore_noise(this._[HDOM.INFO_TEXT]);
        }
        if (this.nodetype == HDOM.TYPE_COMMENT)
        {
            return '';
        }
        if (this.nodetype == HDOM.TYPE_UNKNOWN)
        {
            return '';
        }
        if (strcasecmp(this.tag, 'script'))
        {
            return '';
        }
        if (strcasecmp(this.tag, 'style'))
        {
            return '';
        }
        var ret = '';
        if (this.nodes && this.nodes.length)
        {
            for (var key in this.nodes)
            {
                if (this.nodes[key].tag === 'p')
                {
                    ret = trim(ret) + "\n\n";
                }
                ret += this.convert_text(this.nodes[key].text());
                if (this.nodes[key].tag === 'span')
                {
                    ret += this.dom.span_text;
                }
            }
        }
        return ret;
    };

    this.xmltext = function()
    {
        ret = this.innertext();
        ret = ret.replace('<![CDATA[', '');
        return ret.replace(']]>', '');
    };

    this.makeup = function()
    {
        if (HDOM.INFO_TEXT in this._)
        {
            return this.dom.restore_noise(this._[HDOM.INFO_TEXT]);
        }
        var ret = '<' + this.tag,
            i = -1;
        for (var key in this.attr)
        {
            ++i;
            if (this.attr[key] === null) continue;
            ret += this._[HDOM.INFO_SPACE][i][0];
            if (this.attr[key] === true)
            {
                ret += key;
            }
            else
            {
                var quote = '';
                if (this._[HDOM.INFO_QUOTE][i] == HDOM.QUOTE_DOUBLE)
                {
                    quote = '"';
                }
                if (this._[HDOM.INFO_QUOTE][i] == HDOM.QUOTE_SINGLE)
                {
                    quote = "'";
                }
                ret += key + this._[HDOM.INFO_SPACE][1] + '=' + this._[HDOM.INFO_SPACE][2] + quote + this.attr[key] + quote;
            }
        }
        ret = this.dom.restore_noise(ret);
        return ret + this._[HDOM.INFO_ENDSPACE] + '>';
    };

    this.find = function(selector, idx, lowercase)
    {
        if (undefined === idx) idx = null;
        if (undefined === lowercase) lowercase = false;

        var selectors = this.parse_selector(selector),
            count = selectors.length,
            levle, head, cmd, ret, n;

        if (!count)
        {
            return [];
        }

        var found_keys = [];
        for (var c = 0; c < count; ++c)
        {
            levle = selectors[c].length;
            if (!levle || !(HDOM.INFO_BEGIN in this._))
            {
                return [];
            }
            head = [];
            head[this._[HDOM.INFO_BEGIN]] = 1;
            cmd = ' ';
            for (var l = 0; l < levle; ++l)
            {
                ret = [];
                for (var key in head)
                {
                    if (key === -1)
                    {
                        n = this.dom.root;
                    }
                    else
                    {
                        n = this.dom.nodes[key];
                    }
                    ret = n.seek(selectors[c][l], cmd, lowercase);
                }
                head = ret;
                cmd = selectors[c][l][4];
            }
            for (var k in head)
            {
                if (!(k in found_keys))
                {
                    found_keys[k] = 1;
                }
            }
        }

        found_keys = ksort(found_keys);

        var found = [];
        for (var ke in found_keys)
        {
            found.push(this.dom.nodes[ke]);
        }

        if (idx === null)
        {
            return found;
        }
        else if (idx < 0)
        {
            idx = found.length + idx;
        }

        return idx in found ? found[idx] : null;
    };

    this.seek = function(selector, parent_cmd, lowercase)
    {
        if (undefined === lowercase) lowercase = false;

        var tag = selector[0],
            id = selector[1],
            clas = selector[2],
            attributes = selector[3],
            cmb = selector[4],
            nodes = [],
            ret = [],
            index;

        if (parent_cmd === ' ')
        {
            var end = 0;
            if (this._[HDOM.INFO_END])
            {
                end = this._[HDOM.INFO_END];
                var parent = this.parent;
                while (parent && !(HDOM.INFO_END in parent._))
                {
                    end -= 1;
                    parent = parent.parent;
                }
                end += parent._[HDOM.INFO_END];
            }
            var nodes_start = this._[HDOM.INFO_BEGIN] + 1;
            var nodes_count = end - nodes_start;
            nodes = array_slice(this.dom.nodes, nodes_start, nodes_count, true);
        }
        else if (parent_cmd === '>')
        {
            nodes = this.children;
        }
        else if (parent_cmd === '+' && this.parent && this.parent.children[this])
        {
            index = array_search(this, this.parent.children, true) + 1;
            if (index < this.parent.children.length)
            {
                nodes.push(this.parent.children[index]);
            }
        }
        else if (parent_cmd === '~' && this.parent && this.parent.children[this])
        {
            index = array_search(this, this.parent.children, true);
            nodes = array_slice(this.parent.children, index);
        }

        var c, check, count, node, nodeKeyValue, node_classes, pass, att_name, att_expr, att_val, att_inv, att_case_sensitivity, i = [];
        for (var key in nodes)
        {
            node = nodes[key];
            pass = true;

            if (!node.parent)
            {
                pass = false;
            }
            else if (tag === 'text' && node.tag === 'text')
            {
                ret[array_search(node, this.dom.nodes, true)] = 1;
                delete node;
                continue;
            }
            else if (!in_array(node, node.parent.children, true))
            {
                pass = false;
            }
            else if (tag !== '' && tag !== node.tag && tag !== '*')
            {
                pass = false;
            }
            else if (id !== '' && !('id' in node.attr))
            {
                pass = false;
            }
            else if (id !== '' && 'id' in node.attr)
            {
                if (id !== trim(node.attr.id).split(' ')[0])
                {
                    pass = false;
                }
            }
            else if (clas !== '' && isArray(clas) && clas.length)
            {
                if ('class' in node.attr)
                {
                    node_classes = node.attr['class'].split(' ');
                    if (lowercase)
                    {
                        node_classes = array_map(function(str)
                        {
                            return str.toLowerCase();
                        }, node_classes);
                    }
                    for (var k in clas)
                    {
                        if (in_array(clas[k], node_classes))
                        {
                            pass = false;
                            break;
                        }
                    }
                }
                else
                {
                    pass = false;
                }
            }

            if (pass && attributes !== '' && is_array(attributes) && attributes.length)
            {
                for (var ke in attributes)
                {
                    att_name = attributes[ke][0];
                    att_expr = attributes[ke][1];
                    att_val = attributes[ke][2];
                    att_inv = attributes[ke][3];
                    att_case_sensitivity = attributes[ke][4];

                    if (is_numeric(att_name) && att_expr === '' && att_val === '')
                    {
                        count = 0;
                        for (var key2 in node.parent.children)
                        {
                            c = node.parent.children[key2];
                            if (c.tag === node.tag) ++count;
                            if (c === node) break;
                        }
                        if (count === Number(att_name)) continue;
                    }

                    if (att_inv)
                    {
                        if (att_name in node.attr)
                        {
                            pass = false;
                            break;
                        }
                    }
                    else
                    {
                        if (att_name !== 'plaintext' && !(att_name in node.attr))
                        {
                            pass = false;
                            break;
                        }
                    }

                    if (att_expr === '') continue;

                    if (att_name == 'plaintext')
                    {
                        nodeKeyValue = node.text();
                    }
                    else nodeKeyValue = node.attr[att_name];

                    if (lowercase)
                    {
                        att_val = strtolower(att_val);
                        nodeKeyValue = strtolower(nodeKeyValue);
                    }

                    check = this.match(att_expr, att_val, nodeKeyValue, att_case_sensitivity);
                    if (!check)
                    {
                        pass = false;
                        break;
                    }
                }
            }
            if (pass) ret[node._[HDOM.INFO_BEGIN]] = 1;
            delete node;
        }
        return ret;
    };

    this.match = function(exp, pattern, value, case_sensitivity)
    {
        if (case_sensitivity === 'i')
        {
            if (typeof pattern === 'string' || pattern instanceof String)
            {
                pattern = pattern.toLowerCase();
            }
            if (typeof value === 'string' || value instanceof String)
            {
                value = value.toLowerCase();
            }
        }
        if (exp == '=')
        {
            return value === pattern;
        }
        if (exp == '!=')
        {
            return value !== pattern;
        }
        if (exp == '^=')
        {
            return (new RegExp('^' + preg_quote(pattern, '/')).test(value);
        }
        if (exp == '$=')
        {
            return (new RegExp(preg_quote(pattern, '/') + '$').test(value);
        }
        if (exp == '*=')
        {
            return (new RegExp(preg_quote(pattern, '/')).test(value);
        }
        if (exp == '|=')
        {
            var i = value.indexOf(pattern, 0);
            return (i === -1 ? false : i) === 0;
        }
        if (exp == '~=')
        {
            return in_array(pattern, trim(value).split(' '), true);
        }
    };

    this.parse_selector = function(selector_string)
    {
        var matches = preg_match_all(
                "([\w:\*-]*)(?:\#([\w-]+))?(?:|\.([\w\.-]+))?((?:\[@?(?:!?[\w:-]+)(?:(?:[!*^$|~]?=)[\"']?(?:.*?)[\"']?)?(?:\s*?(?:[iIsS])?)?\])+)?([\/, >+~]+)",
                this.doc,
                ["PREG_SET_ORDER", "PREG_OFFSET_CAPTURE"]
            ),
            selectors = [],
            result = [],
            m, attributes, inversed, is_list;
        for (var key in matches)
        {
            m = matches[key];
            m[0] = trim(m[0]);
            if (m[0] === '' || m[0] === '/' || m[0] === '//')
            {
                continue;
            }
            if (this.dom.lowercase)
            {
                if (typeof m[1] === 'string' || m[1] instanceof String)
                {
                    m[1] = m[1].toLowerCase();
                }
            }
            if (m[3] !== '')
            {
                m[3] = m[3].split('.');
            }
            if (m[4] !== '')
            {
                attributes = "\[@?(!?[\w:-]+)(?:([!*^$|~]?=)[\"']?(.*?)[\"']?)?(?:\s+?([iIsS])?)?\]";
                attributes = preg_match_all(attributes, trim(m[4]), ["PREG_SET_ORDER"]);
                m[4] = [];
                for (var k in attributes)
                {
                    att = attributes[k];
                    if (trim(att[0]) === '') continue;
                    inverted = 0 in att[1] && att[1][0] === '!';
                    m[4].push([inverted ? att[1].substr(1) : att[1], att[2] ? 2 in att : '', att[3] ? 3 in att : '', inverted, 4 in att && typeof att[4] === 'string' ? att[4].toLowerCase() : '']);
                }
            }
            if (m[5] !== '' && trim(m[5]) === '')
            {
                m[5] = ' ';
            }
            else
            {
                m[5] = trim(m[5]);
            }
            is_list = m[5] === ',';
            if (is_list)
            {
                m[5] = '';
            }
            m.shift();
            result.push(m);
            if (is_list)
            {
                selectors.push(result);
                result = [];
            }
        }
        if (result.length)
        {
            selectors.push(result);
        }
        return selectors;
    };

    this.getAttribute = function(name)
    {
        if (name in this.attr)
        {
            return this.convert_text(this.attr[name]);
        }
        if (name == 'outertext')
        {
            return this.outertext();
        }
        if (name == 'innertext')
        {
            return this.innertext();
        }
        if (name == 'text')
        {
            return this.text();
        }
        if (name == 'xmltext')
        {
            return this.xmltext();
        }
        return this.attr.hasOwnProperty(name);
    };

    this.setAttribute = function(name, value)
    {
        if (name == 'outertext')
        {
            this._[HDOM.INFO_OUTER] = value;
            return value;
        }
        if (name == 'innertext')
        {
            if (HDOM.INFO_TEXT in this._)
            {
                this._[HDOM.INFO_TEXT] = value;
                return value;
            }
            this._[HDOM.INFO_INNER] = value;
            return value;
        }
        if (!(name in this.attr))
        {
            this._[HDOM.INFO_SPACE].push([' ', '', '']);
            this._[HDOM.INFO_QUOTE].push(HDOM.QUOTE_DOUBLE);
        }
        this.attr[name] = value;
    };

    this.hasAttribute = function(name)
    {
        if (name == 'outertext' || name == 'innertext' || name == 'plaintext')
        {
            return true;
        }
        return name in this.attr;
    };

    this.__unset = function(name)
    {
        if (name in this.attr)
        {
            delete this.attr[name];
        }
    };

    this.convert_text = function(text)
    {
        var converted_text = text,
            sourceCharset = '',
            targetCharset = '';
        if (this.dom)
        {
            sourceCharset = strtoupper(this.dom._charset);
            targetCharset = strtoupper(this.dom._target_charset);
        }
        if (sourceCharset && targetCharset && strcasecmp(sourceCharset, targetCharset))
        {
            if (!strcasecmp(targetCharset, 'UTF-8') && this.is_utf8(text))
            {
                converted_text = text;
            }
        }

        if (targetCharset === 'UTF-8')
        {
            if (converted_text.substr(0, 3) === "\xef\xbb\xbf")
            {
                converted_text = converted_text.substr(3);
            }
            if (converted_text.substr(-3) === "\xef\xbb\xbf")
            {
                converted_text = converted_text.substr(0, -3);
            }
        }
        return converted_text;
    };

    this.is_utf8 = function(str)
    {
        var c = 0,
            b = 0,
            bits = 0,
            len = str.length;
        for (var i = 0; i < len; i++)
        {
            c = ord(str[i]);
            if (c > 128)
            {
                if (c >= 254) return;
                if (c > 252)
                {
                    bits = 6;
                }
                else if (c > 252)
                {
                    bits = 5;
                }
                else if (c > 252)
                {
                    bits = 4;
                }
                else if (c > 252)
                {
                    bits = 3;
                }
                else if (c > 252)
                {
                    bits = 2;
                }
                else return;
                if ((i + bits) > len) return;
                while (bits > 1)
                {
                    i++;
                    b = ord(str[i]);
                    if (b < 128 || b > 191)
                    {
                        return;
                    }
                    bits--;
                }
            }
        }
        return true;
    };

    this.get_display_size = function()
    {
        if (this.tag == 'img')
        {
            var width = -1,
                height = -1;
            if ('width' in this.attr)
            {
                width = this.attr.width;
            }
            if ('height' in this.attr)
            {
                width = this.attr.height;
            }
            if ('style' in this.attr)
            {
                var attributes = [];
                var matches = preg_match_all('([\w-]+)\s*:\s*([^;]+)\s*;?', this.attr.style, ["PREG_SET_ORDER"]);
                for (var key in matches)
                {
                    attributes[matches[key][1]] = matches[key][2];
                }
                if ('width' in attributes && width == -1)
                {
                    if (strtolower(attributes.width.substr(-2)) == 'px')
                    {
                        var proposed_width = attributes.width.substr(0, -2);
                        if (filter_var(proposed_width, 257))
                        {
                            width = proposed_width;
                        }
                    }
                }
                if ('height' in attributes && height == -1)
                {
                    if (strtolower(attributes.height.substr(-2)) == 'px')
                    {
                        var proposed_height = attributes.height.substr(0, -2);
                        if (filter_var(proposed_height, 257))
                        {
                            height = proposed_height;
                        }
                    }
                }
            }
            return {
                height: height,
                width: width
            };
        }
    };

    this.save = function()
    {
        return this.outertext();
    };

    this.addClass = function(clas)
    {
        if (typeof clas === 'string' || clas instanceof String)
        {
            clas = clas.split(' ');
        }
        if (is_array(clas))
        {
            for (var key in clas)
            {
                c = clas[key];
                if ('class' in this.attr)
                {
                    if (this.hasClass(c))
                    {
                        continue;
                    }
                    else
                    {
                        this.attr['class'] += ' ' + c;
                    }
                }
                else
                {
                    this.attr['class'] = c;
                }
            }
        }

    };

    this.hasClass = function(clas)
    {
        if (typeof clas === 'string' || clas instanceof String)
        {
            return in_array(clas, this.attr['class'].split(' '), true);
        }
    };

    this.removeClass = function(clas)
    {
        if ('class' in this.attr)
        {
            if (clas === null)
            {
                this.removeAttribute('class');
                return;
            }
            if (typeof clas === 'string' || clas instanceof String)
            {
                clas = clas.split(' ');
            }
            if (is_array(clas))
            {
                if (clas.length)
                {
                    this.attr['class'] = clas.join(' ');
                }
                else
                {
                    this.removeAttrivute('class');
                }
            }
        }
    };

    this.getAllAttributes = function()
    {
        return this.attr;
    };

    this.removeAttribute = function(name)
    {
        return this.attr;
    };

    this.remove = function()
    {
        if (this.parent)
        {
            this.parent.removeChild(this);
        }
    };

    this.removeChild = function(node)
    {
        var nidx = array_search(node, this.nodes, true);
        var cidx = array_search(node, this.children, true);
        var didx = array_search(node, this.dom.nodes, true);
        if (nidx !== false && cidx !== false && didx !== false)
        {
            var copy = node.children.slice();
            for (var k in copy)
            {
                node.removeChild(copy[k]);
            }
            var enidx, edidx, copy = node.nodes.slice();
            for (var key in copy)
            {
                entity = copy[key];
                enidx = array_search(entity, node.nodes, true);
                edidx = array_search(entity, node.dom.nodes, true);
                if (enidx !== false && edidx !== false)
                {
                    node.nodes.splice(enidx, 1);
                    node.dom.nodes.splice(edidx, 1);
                }
            }
            this.nodes.splice(nidx, 1);
            this.children.splice(cidx, 1);
            this.dom.nodes.splice(didx, 1);
        }
    };

    this.getElementById = function(id)
    {
        return this.find("#" + id, 0);
    };

    this.getElementsById = function(id, idx)
    {
        if (undefined === idx) idx = null;
        return this.find("#" + id, idx);
    };

    this.getElementByTagName = function(name)
    {
        return this.find(name, 0);
    };

    this.getElementsByTagName = function(name, idx)
    {
        if (undefined === idx) idx = null;
        return this.find(name, idx);
    };

    this.parentNode = function()
    {
        return this.parent();
    };

    this.childNodes = function(idx)
    {
        if (undefined === idx) idx = -1;
        return this.children(idx);
    };

    this.firstChild = function()
    {
        return this.first_child();
    };

    this.lastChild = function()
    {
        return this.last_child();
    };

    this.nextSibling = function()
    {
        return this.next_sibling();
    };

    this.previousSibling = function()
    {
        return this.prev_sibling();
    };

    this.hasChildNodes = function()
    {
        return this.has_child();
    };

    this.nodeName = function()
    {
        return this.tag;
    };

    this.appendChild = function(node)
    {
        node.parent(this);
        return node;
    };

}

function simple_html_dom(str, lowercase, forceTagsClosed, target_charset, stripRN, defaultBRText, defaultSpanText, options)
{
    this.root = 0;
    this.nodes = [];
    this.callback = 0;
    this.lowercase = false;
    this.original_size = 0;
    this.size = 0;
    this.pos = 0;
    this.doc = 0;
    this.char = 0;
    this.cursor = 0;
    this.parent = 0;
    this.noise = [];
    this.token_blank = " \t\r\n";
    this.token_equal = ' =/>';
    this.token_slash = " />\r\n\t";
    this.token_attr = ' >';
    this.charset = '';
    this.target_charset = '';
    this.br_text = '';
    this.span_text = '';
    this.self_closing = {
        'area': 1,
        'base': 1,
        'br': 1,
        'col': 1,
        'embed': 1,
        'hr': 1,
        'img': 1,
        'input': 1,
        'link': 1,
        'meta': 1,
        'param': 1,
        'source': 1,
        'track': 1,
        'wbr': 1

    };
    this.block_tags = {
        'body': 1,
        'div': 1,
        'form': 1,
        'root': 1,
        'span': 1,
        'table': 1
    };
    this.optional_closing = {
        'b':
        {
            'b': 1
        },
        'dd':
        {
            'dd': 1,
            'dt': 1
        },
        'dl':
        {
            'dd': 1,
            'dt': 1
        },
        'dt':
        {
            'dd': 1,
            'dt': 1
        },
        'li':
        {
            'li': 1
        },
        'optgroup':
        {
            'optgroup': 1,
            'option': 1
        },
        'option':
        {
            'optgroup': 1,
            'option': 1
        },
        'p':
        {
            'p': 1
        },
        'rp':
        {
            'rp': 1,
            'rt': 1
        },
        'rt':
        {
            'rp': 1,
            'rt': 1
        },
        'td':
        {
            'td': 1,
            'th': 1
        },
        'th':
        {
            'td': 1,
            'th': 1
        },
        'tr':
        {
            'td': 1,
            'th': 1,
            'tr': 1
        }
    };



    if (undefined === str) str = null;
    if (undefined === lowercase) lowercase = true;
    if (undefined === forceTagsClosed) forceTagsClosed = true;
    if (undefined === target_charset) target_charset = DEFAULT.TARGET_CHARSET;
    if (undefined === stripRN) stripRN = true;
    if (undefined === defaultBRText) defaultBRText = DEFAULT.BR_TEXT;
    if (undefined === defaultSpanText) defaultSpanText = DEFAULT.SPAN_TEXT;
    if (undefined === options) options = 0;
    if (str)
    {
        this.load(str, lowercase, stripRN, defaultBRText, defaultSpanText, options);

    }
    if (!forceTagsClosed)
    {
        this.optional_closing = [];
    }
    this._target_charset = target_charset;

    this.__destruct = function()
    {
        this.clear();
    };

    this.load = function(str, lowercase, stripRN, defaultBRText, defaultSpanText, options)
    {
        if (undefined === lowercase) lowercase = true;
        if (undefined === stripRN) stripRN = true;
        if (undefined === defaultBRText) defaultBRText = DEFAULT.BR_TEXT;
        if (undefined === defaultSpanText) defaultSpanText = DEFAULT.SPAN_TEXT;
        if (undefined === options) options = 0;
        this.prepare(str, lowercase, defaultBRText, defaultSpanText);
        this.remove_noise("'<\s*script[^>]*[^/]>(.*?)<\s*/\s*script\s*>'is");
        this.remove_noise("'<\s*script\s*>(.*?)<\s*/\s*script\s*>'is");
        if (stripRN)
        {
            this.doc = this.doc.split("\r").join(' ');
            this.doc = this.doc.split("\n").join(' ');
            this.size = this.doc.length;
        }
        this.remove_noise("'<!\[CDATA\[(.*?)\]\]>'is");
        this.remove_noise("'<!--(.*?)-->'is");
        this.remove_noise("'<\s*style[^>]*[^/]>(.*?)<\s*/\s*style\s*>'is");
        this.remove_noise("'<\s*style\s*>(.*?)<\s*/\s*style\s*>'is");
        this.remove_noise("'<\s*(?:code)[^>]*>(.*?)<\s*/\s*(?:code)\s*>'is");
        this.remove_noise("'(<\?)(.*?)(\?>)'s", true);
        if (options & HDOM.SMARTY_AS_TEXT)
        {
            this.remove_noise("'(\{\w)(.*?)(\})'s", true);
        }
        this.parse();
        this.roo._[HDOM.INFO_END] = this.cursor;
        this.parse_charset();
        return this;
    };

    this.save = function()
    {
        return this.root.innertext();
    };

    this.find = function(selector, idx, lowercase)
    {
        if (undefined === idx) idx = null;
        if (undefined === lowercase) lowercase = false;
        return this.root.find(selector, idx, lowercase);
    };

    this.clear = function()
    {
        if (this.nodes && this.nodes.length)
        {
            for (var key in this.nodes)
            {
                n = this.nodes[key];
                n.clear();
                n = null;
            }
        }
        if (this.parent)
        {
            this.parent.clear();
            delete this.parent;
        }
        if (this.root)
        {
            this.root.clear();
            delete this.root;
        }
        delete this.doc;
        delete this.noise;
    };

    this.dump = function(show_attr)
    {
        if (undefined === show_attr) show_attr = true;
        this.root.dump(show_attr);
    };

    this.prepare = function(str, lowercase, defaultBRText, defaultCharset)
    {
        if (undefined === lowercase) lowercase = true;
        if (undefined === defaultBRText) defaultBRText = DEFAULT.BR_TEXT;
        if (undefined === defaultSpanText) defaultSpanText = DEFAULT.SPAN_TEXT;

        this.clear();

        this.doc = trim(str);
        this.size = this.doc.length;
        this.original_size = this.size;
        this.pos = 0;
        this.cursor = 1;
        this.noise = [];
        this.nodes = [];
        this.lowercase = lowercase;
        this.br_text = defaultBRText;
        this.span_text = defaultSpanText;
        this.root = new simple_html_dom_node(this);
        this.root.tag = 'root';
        this.root._[HDOM.INFO_BEGIN] = -1;
        this.root.nodetype = HDOM.TYPE_ROOT;
        this.parent = this.root;
        if (this.size)
        {
            this.char = this.doc[0];
        }
    };

    this.parse = function()
    {
        var s, node;
        while (true)
        {
            s = this.copy_until_char('<');
            if (s === '')
            {
                if (this.read_tag())
                {
                    continue;
                }
                else
                {
                    return true;
                }
            }
            node = new simple_html_dom_node(this);
            ++this.cursor;
            node._[HDOM.INFO_TEXT] = s;
            this.links_nodes(node, false);
        }
    };

    this.parse_charset = function()
    {
        var charset = null,
            el = this.root.find('meta[http-equiv=Content-Type]', 0, true);
        if (el)
        {
            var fullvalue = el.content;
            if (fullvalue)
            {
                var matches = fullvalue.match(/charset=(.+)/i)
                if (matches && 1 in matches && matches[1])
                {
                    charset = matches[1];
                }
                else
                {
                    charset = 'ISO-8859-1';
                }
            }
        }
        if (!charset)
        {
            var meta = this.root.find('meta[charset]', 0);
            if (meta)
            {
                charset = meta.charset;
            }
        }
        if (!charset)
        {
            charset = 'UTF-8';
        }
        if ((strtolower(charset) == 'iso-8859-1') || (strtolower(charset) == 'latin1') || (strtolower(charset) == 'latin-1'))
        {
            charset = 'CP1252';
        }
        this._charset = charset;
        return charset;
    };

    this.read_tag = function()
    {

        if (this.char !== '<')
        {
            this.root._[HDOM.INFO_END] = this.cursor;
            return;
        }

        var tag, tag_lower, begin_tag_pos = this.pos;

        if (++this.pos < this.size)
        {
            this.char = this.doc[this.pos];
        }
        else
        {
            this.char = null;
        }

        if (this.char === '/')
        {

            if (++this.pos < this.size)
            {
                this.char = this.doc[this.pos];
            }
            else
            {
                this.char = null;
            }

            this.skip(this.token_blank);
            tag = this.copy_until_char('>'),
                pos = strpos(tag + '', ' ');
            if (pos !== false)
            {
                tag = tag.substr(0, pos);
            }

            var parent_lower = strtolower(this.parent.tag);
            tag_lower = strtolower(tag);

            if (parent_lower !== tag_lower)
            {
                if (parent_lower in this.optional_closing && tag_lower in this.block_tags)
                {

                    this.parent._[HDOM.INFO_END] = 0;
                    org_parent = this.parent;

                    while (this.parent.parent && strtolower(this.parent.tag) !== tag_lower)
                    {
                        this.parent = this.parent.parent;
                    }

                    if (strtolower(this.parent.tag) !== tag_lower)
                    {
                        this.parent = org_parent;
                        if (this.parent.parent)
                        {
                            this.parent = this.parent.parent;
                        }
                        this.parent._[HDOM.INFO_END] = this.cursor;
                        return this.as_text_node(tag);
                    }

                }
                else if (this.parent.parent && tag_lower in this.block_tags)
                {

                    this.parent._[HDOM.INFO_END] = 0;
                    org_parent = this.parent;

                    while (this.parent.parent && strtolower(this.parent.tag) !== tag_lower)
                    {
                        this.parent = this.parent.parent;
                    }

                    if (strtolower(this.parent.tag) !== tag_lower)
                    {
                        this.parent = org_parent;
                        this.parent._[HDOM.INFO_END] = this.cursor;
                        return this.as_text_node(tag);
                    }

                }
                else if (this.parent.parent && strtolower(this.parent.parent.tag) === tag_lower)
                {

                    this.parent._[HDOM.INFO_END] = 0;
                    this.parent = this.parent.parent;

                }
                else
                {
                    return this.as_text_node(tag);
                }
            }
            this.parent._[HDOM.INFO_END] = this.cursor;

            if (this.parent.parent)
            {
                this.parent = this.parent.parent;
            }

            if (++this.pos < this.size)
            {
                this.char = this.doc[this.pos];
            }
            else
            {
                this.char = null;
            }

            return true;
        }

        var node = new simple_html_dom_node(this);
        node._[HDOM.INFO_BEGIN] = this.cursor;
        ++this.cursor;
        tag = this.copy_until(this.token_slash);
        node.tag_start = begin_tag_pos;

        if (tag && 0 in tag && tag[0] === '!')
        {
            node._[HDOM.INFO_TEXT] = '<' + tag + this.copy_until_char('>');

            if (2 in tag && tag[1] === '-' && tag[2] === '-')
            {
                node.nodetype = HDOM.TYPE_COMMENT;
                node.tag = 'comment';
            }
            else
            {
                node.nodetype = HDOM.TYPE_UNKNOWN;
                node.tag = 'unknown';
            }

            if (this.char === '>')
            {
                node._[HDOM.TYPE_UNKNOWN] += '>';
            }

            this.link_nodes(node, true);

            if (++this.pos < this.size)
            {
                this.char = this.doc[this.pos];
            }
            else
            {
                this.char = null;
            }

            return true;
        }

        var pos = strpos(tag + '', '<');
        if (pos !== false)
        {
            tag = '<' + tag.substr(0, -1);
            node._[HDOM.INFO_TEXT] = tag;
            this.link_nodes(node, false);
            this.char = this.doc[--this.pos];
            return true;
        }

        if (!/^\w[\w:-]*$/.test(tag)))(
        {
            node._[HDOM.INFO_TEXT] = '<' + tag + this.copy_until('<>');

            if (this.char === '<')
            {
                this.link_nodes(node, false);
                return true;
            }
            if (this.char === '>')
            {
                node._[HDOM.INFO_TEXT] += '>';
            }

            this.link_nodes(node, false);

            if (++this.pos < this.size)
            {
                this.char = this.doc[this.pos];
            }
            else
            {
                this.char = null;
            }

            return true;
        }

        node.nodetype = HDOM.TYPE_ELEMENT;
        tag_lower = strtolower(tag);
        node.tag = this.lowercase ? tag_lower : tag;

        if (tag_lower in this.optional_closing)
        {
            while (strtolower(this.parent.tag) in this.optional_closing[tag_lower])
            {
                this.parent._[HDOM.INFO_END] = 0;
                this.parent = this.parent.parent;
            }
            node.parent = this.parent;
        }

        var guard = 0,
            name,
            space = [this.copy_skip(this.token_blank), '', ''];

        do {
            name = this.copy_until(this.token_equal);

            if (name === '' && this.char !== null && space[0] === '')
            {
                break;
            }


            if (guard === this.pos)
            {
                if (++this.pos < this.size)
                {
                    this.char = this.doc[this.pos];
                }
                else
                {
                    this.char = null;
                }
            }

            guard = this.pos;

            if (this.pos >= this.size - 1 && this.char !== '>')
            {
                node.nodetype = HDOM.TYPE_TEXT;
                node._[HDOM.INFO_END] = 0;
                node._[HDOM.INFO_TEXT] = '<' + tag + space[0] + name;
                node.tag = 'text';

                this.link_nodes(node, false);

                return true;
            }

            if (this.doc[this.pos - 1] == '<')
            {
                node.nodetype = HDOM.TYPE_TEXT;
                node.tag = 'text';
                node.attr = [];
                node._[HDOM.INFO_END] = 0;
                node._[HDOM.INFO_TEXT] = this.doc.substr(begin_tag_pos, this.pos - begin_tag_pos - 1);
                this.pos -= 2;

                if (++this.pos < this.size)
                {
                    this.char = this.doc[this.pos];
                }
                else
                {
                    this.char = null;
                }

                this.link_nodes(node, false);

                return true;
            }

            if (name !== '/' && name !== '')
            {
                space[1] = this.copy_skip(this.token_blank);
                name = this.restore_noise(name);
                if (this.lowercase) name = strtolower(name);

                if (this.char === '=')
                {

                    if (++this.pos < this.size)
                    {
                        this.char = this.doc[this.pos];
                    }
                    else
                    {
                        this.char = null;
                    }

                    space = this.parse_attr(node, name, space);

                }
                else
                {
                    node._[HDOM.INFO_QUOTE].push(HDOM.QUOTE_NO);
                    node.attr[name] = true;

                    if (this.char != '>')
                    {
                        this.char = this.doc[--this.pos];
                    }
                    else
                    {
                        this.char = null;
                    }
                }

                node._[HDOM.INFO_SPACE].push(space);
                space = [this.copy_skip(this.token_blank), '', ''];

            }
            else
            {
                break;
            }
        }
        while (this.char !== '>' && this.char !== '/');

        this.link_nodes(node, true);
        node._[HDOM.INFO_ENDSPACE] = space[0];

        if (this.copy_until_char('>') === '/')
        {
            node._[HDOM.INFO_ENDSPACE] += '/';
            node._[HDOM.INFO_END] = 0;
        }
        else
        {
            if (!(strtolower(node.tag) in this.self_closing))
            {
                this.parent = node;
            }
        }

        if (++this.pos < this.size)
        {
            this.char = this.doc[this.pos];
        }
        else
        {
            this.char = null;
        }

        if (node.tag === 'br')
        {
            node._[HDOM.INFO_INNER] = this.br_text;
        }

        return true;
    };
	
    this.parse_attr = function(node, name, space)
    {
        var is_duplicate = name in node.attr;
        if (!is_duplicate)
        {
            space[2] = this.copy_skip(this.token_blank);
        }
        var quote_type, value;
        switch (this.char)
        {
            case '"':
                quote_type = HDOM.QUOTE_DOUBLE;
                this.char = (++this.pos < this.size) ? this.doc[this.pos] : null;
                value = this.copy_until_char('"');
                this.char = (++this.pos < this.size) ? this.doc[this.pos] : null;
                break;
            case '\'':
                quote_type = HDOM.QUOTE_SINGLE;
                this.char = (++this.pos < this.size) ? this.doc[this.pos] : null;
                value = this.copy_until_char("'");
                this.char = (++this.pos < this.size) ? this.doc[this.pos] : null;
                break;
            default:
                quote_type = HDOM.QUOTE_NO;
                value = this.copy_until(this.token_attr);
        }
        value = this.restore_noise(value);
        value = value.replace("\r", '');
        value = value.replace("\n", '');
        if (name === 'class')
        {
            value = trim(value);
        }

        if (!is_duplicate)
        {
            node._[HDOM.INFO_QUOTE].push(quote_type);
            node.attr[name] = value;
        }
        return space;
    };

    this.link_nodes = function(node, is_child)
    {
        node.parent = this.parent;
        this.parent.nodes.push(node);
        if (is_child)
        {
            this.parent.children.push(node);
        }
    };

    this.as_text_node = function(tag)
    {
        var node = new simple_html_dom_node(this);
        ++this.cursor;
        node._[HDOM.INFO_TEXT] = '</' + tag + '>';
        this.link_nodes(node, false);
        this.char = (++this.pos < this.size) ? this.doc[this.pos] : null;
        return true;
    };

    this.skip = function(chars)
    {
        this.pos += strspn(this.doc, chars, this.pos);
        this.char = (this.pos < this.size) ? this.doc[this.pos] : null;
    };

    this.copy_skip = function(chars)
    {
        var pos = this.pos;
        var len = strspn(this.doc, chars, pos);
        this.pos += len;
        this.char = (this.pos < this.size) ? this.doc[this.pos] : null;
        if (len === 0)
        {
            return '';
        }
        return this.doc.substr(pos, len);
    };

    this.copy_until = function(chars)
    {
        var pos = this.pos;
        var len = strcspn(this.doc, chars, pos);
        this.pos += len;
        this.char = (this.pos < this.size) ? this.doc[this.pos] : null;
        return this.doc.substr(pos, len);
    };

    this.copy_until_char = function(char)
    {
        if (this.char === null)
        {
            return '';
        }
        var pos = strpos(this.doc, char, this.pos);
        if (pos === false)
        {
            var ret = this.doc.substr(this.pos, this.size - this.pos);
            this.char = null;
            this.pos = this.size;
            return ret;
        }
        if (pos === this.pos)
        {
            return '';
        }
        this.char = this.doc[pos];
        this.pos = pos;
        return this.doc.substr(this.pos, pos - this.pos);
    };

    this.remove_noise = function(pattern, remove_tag)
    {
        if (undefined === remove_tag) remove_tag = false;
        var matches = preg_match_all(
            pattern,
            this.doc,
            ["PREG_SET_ORDER", "PREG_OFFSET_CAPTURE"]
        );
        for (i = matches[0].length - 1; i > -1; --i)
        {
            key = '___noise___' + this.noise.length + 1000;
            idx = remove_tag ? 0 : 1;
            this.noise[key] = matches[i][idx][0];
            this.doc = substr_replace(this.doc, key, matches[i][idx][1], matches[i][idx][0].length);
        }
        this.size = this.doc.length;
        if (this.size > 0)
        {
            this.char = this.doc[0];
        }
    };

    this.restore_noise = function (text)
    {
        var pos = strpos(text, '___noise___'),
            key;
        while (pos !== false)
        {
            if (text.length > pos + 15)
            {
                key = '___noise___' +
                    text[pos + 11] +
                    text[pos + 12] +
                    text[pos + 13] +
                    text[pos + 14] +
                    text[pos + 15];

                if (key in this.noise)
                {
                    text = text.substr(0, pos) +
                        this.noise[$key] +
                        text.substr(pos + 16);
                }
                else
                {
                    text = text.substr(0, pos) +
                        'UNDEFINED NOISE FOR KEY: ' +
                        key +
                        text.substr(pos + 16);
                }
            }
            else
            {
                text = text.substr(0, pos) +
                    'NO NUMERIC NOISE KEY' +
                    text.substr(pos + 11);
            }
            pos = strpos(text, '___noise___');
        }
        return text;
    };
}


function str_get_html(str, lowercase, forceTagsClosed, target_charset, stripRN, defaultBRText, defaultSpanText)
{
    if (undefined === lowercase) lowercase = true;
    if (undefined === forceTagsClosed) forceTagsClosed = true;
    if (undefined === target_charset) target_charset = DEFAULT.TARGET_CHARSET;
    if (undefined === stripRN) stripRN = true;
    if (undefined === defaultBRText) defaultBRText = DEFAULT.BR_TEXT;
    if (undefined === defaultSpanText) defaultSpanText = DEFAULT.SPAN_TEXT;
    var dom = new simple_html_dom(null, lowercase, forceTagsClosed, stripRN, defaultBRText, defaultSpanText);
    if (!str || str.length > MAX_FILE_SIZE)
    {
        dom.clear();
        return false;
    }
    return dom.load(str, lowercase, stripRN);
}

function dump_html_tree(node)
{
    return node.dump(node);
}