<?php

define('MAX_FILE_SIZE', 10000000);
require 'simple_html_dom.php';

if (!is_file("$argv[1]/t.php"))
{
    file_put_contents("$argv[1]/t.php", "<?php \$gH = [];");
}
if (!is_file("$argv[1]/p.php"))
{
    file_put_contents("$argv[1]/p.php", "<?php \$hI = [];");
}

require "$argv[1]/t.php";
require "$argv[1]/p.php";

$iJ = [];
$jK = new RecursiveDirectoryIterator($argv[1]);
$jK = new RecursiveIteratorIterator($jK);
foreach ($jK as $kL)
{
    $kL = $kL->getPathname();
    if (!strpos($kL, 'index') && strpos($kL, '.html'))
    {
        $lM = explode('\\f', $kL) [1];
        $lM = (int)explode('\\', $lM) [0];
        $mN = explode('\\t', $kL) [1];
        $mN = explode('.', $mN) [0];
        $mN = (int)explode('-', $mN) [0];
        $nO = 0;
        if (!isset($gH[$lM][$mN]))
        {
            $gH[$lM][$mN] = [0, 0];
        }
        if (strpos($kL, 'start'))
        {
            $nO = explode('start', $kL) [1];
            $nO = (int)explode('.', $nO) [0];
            if ($nO > $gH[$lM][$mN][0])
            {
                $gH[$lM][$mN][0] = $nO;
            }
        }
        $oP = str_get_html(file_get_contents($kL));
        foreach ($oP->find('div') as $pQ)
        {
            if (isset($pQ->id) and isset($pQ->class) and strpos($pQ->class, 'as-profile'))
            {
                $qR = (int)substr($pQ->id, 1);
                if ($qR > $gH[$lM][$mN][1])
                {
                    $gH[$lM][$mN][1] = $qR;
                }
                $hI[$qR] = [$lM, $mN, $nO];
                if (!in_array([$lM, $mN], $iJ))
                {
                    $iJ[] = [$lM, $mN];
                }
            }
        }
    }
}

$rS = [];
foreach ($iJ as $sT)
{

    $tU = $gH[$sT[0]][$sT[1]];
    if ($tU[0])
    {
        $uV = $tU[0];
        while ($uV >= 8)
        {
            if (!is_file("$argv[1]/f$sT[0]/t$sT[1]-start$uV.html"))
            {
                $rS[] = "$argv[1]/f$sT[0]/t$sT[1]-start$uV.html";
            }
            $uV -= 8;
        }
    }

}

$gH = var_export($gH, true);
file_put_contents("$argv[1]/t.php", "<?php \$gH = $gH;");
$hI = var_export($hI, true);
file_put_contents("$argv[1]/p.php", "<?php \$hI = $hI;");
if ($rS)
{
    $rS = var_export($rS, true);
    file_put_contents("$argv[1]/MISSING", $rS);
}