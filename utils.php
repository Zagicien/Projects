<?php

function bytes($swf)
  {
    $file = file_get_contents($swf);
    $buffer = unpack("C*", $file);
    $bytes = array_slice($buffer, 0, 9);
    $bytes[0] = 70;
    $buffer = zlib_decode(substr($file, 8));
    $buffer = unpack("C*", $buffer);
    unset($buffer[1]);
    $bytes = array_merge($bytes, $buffer);
    return $bytes;
  }

function uint($a)
  {
    if ($a >= 4294967296)
      {
        $a = 4294967296 - $a;
      }
    return $a;
  }

function getBytes($bytes)
  {
    $loc2 = 0;
    $loc3 = 0;
    while ($loc2 < count($bytes) -8)
      {
        $loc3 = uint($loc3 + $loc2 * $bytes[$loc2 +8]);
        $loc2 = $loc2 +5;
      }
    return $loc3;
  }

function nodeContent($a)
  {
    $b = '';
    foreach ($a->childNodes as $a)
      {
        $b .= $a->ownerDocument->saveHTML($a);
      }
    return $b;
  }

function compress_html($a)
  {
    return str_replace(array(
        "\n",
        "\r",
        "\t"
    ) , '', $a);
  }

function encode($a)
  {
    $b = "";
    foreach (preg_split('//u', $a, null, PREG_SPLIT_NO_EMPTY) as $a)
      {
        $c = ord($a);
        if ($a == "'") $b .= "\'";
        elseif ($c <= 127) $b .= $a;
        else $b .= '&#' . uniord($a) . ';';
      }
    return $b;
  }

function uniord($a)
  {
    $a = mb_convert_encoding($a, 'UCS-2LE', 'UTF-8');
    $b = ord(substr($a, 0, 1));
    $c = ord(substr($a, 1, 1));
    return $c * 256 + $b;
  }

function fix($a)
  {
    return mb_convert_encoding($a, 'HTML-ENTITIES', 'UTF-8');
  }
 