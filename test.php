<?php

require 'utils.php';
$a = [];

$b = [];
$c = new DOMDocument();
@$c->loadHTML(fix(file_get_contents('tes.html')));

$d = $c->getElementsByTagName("table");
for ($e = 0;$e < $d->length;$e++)
  {
    $f = new DOMDocument();
    @$f->loadHTML(fix(nodeContent($d->item($e))));
    $bbl = 0;
    $des = "";
    $tit = "";
    $id = 0;
    $g = $f->getElementsByTagName("span");
    for ($h = 0;$h < $g->length;$h++)
      {
        $i = $g->item($h);
        if ($i->getAttribute('class') == "box_stitle_gris")
          {
            $des = encode(compress_html(nodeContent($i)));
          }
        if ($i->getAttribute('class') == "style_red")
          {
            $bbl = preg_replace('`[^0-9]`', '', $i->textContent);
          }
      }
    $g = $f->getElementsByTagName("a");
    for ($h = 0;$h < $g->length;$h++)
      {
        $i = $g->item($h);
        $j = $i->getElementsByTagName("u");
        for ($k = 0;$k < $j->length;$k++)
          {
            $l = $j->item($k);
            $tit = encode($l->textContent);
          }
        if ($i->getAttribute('class') == 'fofo_link3_extern')
          {
            $i = parse_url($i->getAttribute('href'));
            if (isset($i['query']))
              {
                parse_str($i['query'], $i);
                if (isset($i['giveme']))
                  {
                    $id = $i['giveme'];
                  }
              }
          }
      }
    if ($des and !isset($b[$id]))
      {
        $b[$id] = 1;
        $x = [3, "BIBLI"];
        if (strpos($tit, 'ONTURE')) $x = [2, "MONTURE"];
        $fx = 1;
        $a[] = "x;\n";
      }
  }

$c = $a[0];
unset($a[0]);
$a[] = $c;
$a = implode('', $a);
file_put_contents('tes', $a);
