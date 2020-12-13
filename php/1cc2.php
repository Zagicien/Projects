<?php

define('MAX_FILE_SIZE', 10000000);
require 'simple_html_dom.php';
require $argv[1] . '/t.php';
require $argv[1] . '/p.php';

$get = function ($t) use ($gH)
{
    foreach ($gH as $i => $l)
    {
        if (isset($l[$t]))
        {
            return $i;
        }
    }
};

$iJ = new RecursiveDirectoryIterator($argv[1]);
$iJ = new RecursiveIteratorIterator($iJ);
foreach ($iJ as $jK)
{
    $jK = $jK->getPathname();
    $bo = "./f";
    if (strpos($jK, '\f'))
    {
        $bo = "./../f";
    }
    if (strpos($jK, '.html'))
    {
        $kL = str_get_html(file_get_contents($jK));
        foreach ($kL->find('a') as $lM)
        {
            if (strpos($lM->href, 'a.com/index') or $lM->href == "http://a.com/" or $lM->href == "./index.php")
            {
                $lM->href = './' . substr($bo, 0, -1) . 'index.html';
            }
            else
            {
                $lM->href = str_replace('amp;', '', $lM->href);
                $mN = parse_url($lM->href);
                if (isset($mN['query']))
                {
                    parse_str($mN['query'], $nO);
                    if (isset($nO['p']) and isset($hI[$nO['p']]))
                    {
                        $oP = $hI[$nO['p']];
                        $pQ = "";
                        if ($oP[2])
                        {
                            $pQ = "-start$oP[2]";
                        }
                        $lM->href = "./$bo$oP[0]/t$oP[1]$pQ.html#p" . $nO['p'];
                    }
                    else
                    {
                        $oP = "";
                        if (isset($nO['start']))
                        {
                            $oP = "-start" . $nO['start'];
                        }
                        if (isset($nO['t']))
                        {
                            $pQ = $get($nO['t']);
                            if ($pQ)
                            {
                                $qR = "";
                                if (isset($mN['fragment']))
                                {
                                    $qR = '#' . $mN['fragment'];
                                }
                                $lM->href = "./$bo$pQ/t" . $nO['t'] . "$oP.html$qR";
                            }
                        }
                        else if (isset($nO['f']))
                        {
                            $lM->href = "./$bo" . $nO['f'] . "/index$oP.html";
                        }
                    }
                }
            }
            $kL->save($jK);
        }
    }
}