<?php

$bytes = [
    [159,135,134,130,119,110,108,107,106],
    [105,104,103,99,95,86,85],
    [83,82,80,70,69,68,67],
    [66,37,32,18,15,12,10],
    [17],
    [34],
    [30],
    [31,29,28,26,25,23,24,22],
    [21,20,16,14]
];

define('HOME', $argv[1]);
define('THIS', $argv[2]);
$Bc = explode(',', $argv[3]);
define('BYPASS', isset($argv[4]) and $argv[4]);
define('UPDATE', isset($argv[5]) and $argv[5]);

if ($COOKIES = isset($argv[7]))
{
    $Bc = $bytes[$argv[3]];
    $POST = ["username" => $argv[6], "password" => $argv[7]];
}

define('ROOT', THIS . '/f');

$Bcc = $Bc;
$STEP = time() -10;
function context($N)
{
    $opts = array(
        'http' => array(
            'header' => array(
                "Referer: $N\r\n",
                'User-Agent: Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0\r\n'
            )
        )
    );
    return stream_context_create($opts);
}

define('MAX_FILE_SIZE', 10000000);
require 'simple_html_dom.php';

$gH = [];
if (UPDATE)
{
    require THIS . '/t.php';
}

require 'html.php';

$mkdir(THIS);
$a = [];
$AB = [];

$mkdir(THIS . "/css");
$mkdir(THIS . "/images");

$D = [];
$E = [];

if (file_exists(THIS . '/css.php'))
{
    require THIS . '/css.php';
}

$before = false;
while ($Bc)
{

    $STAGE = array_pop($Bc);;
    $ROOT = ROOT . $STAGE;
    $mkdir($ROOT);
    $ROOT = "$ROOT/index.html";
    $B = [[HOME . "/viewforum.php?f=$STAGE", $ROOT, $STAGE]];

    if (!$before)
    {
        $before = true;
        $B[] = [HOME, THIS . '/index.html'];
        $C = $B[1][0];
    }

    while ($B)
    {
        if ($COOKIES and time() > $STEP)
        {
            $STEP = time() + 4500;
            keepAlive();
        }
        $F = array_pop($B);
        file_put_contents(THIS . "/current", $F[0] . " " . count($B));

        $G = './..';
        if ($F[0] == $C)
        {
            $G = '.';
            if (file_exists($F[1]))
            {
                continue;
            }
        }

        $title = "";
        while (true)
        {
            $H = file_get($F[0], $F[0]);
            $H = str_get_html($H);
            if (is_object($H))
            {
                foreach ($H->find('title') as $I)
                {
                    $title = $I->innertext != "503 Service Unavailable";
                }
            }
            if ($title) break;
            else sleep(5);
        }

        foreach ($H->find('a') as $I)
        {
            $I->href = A($I->href, $F[0]);
            if (strpos($I->href, '/view'))
            {
                $I->href = str_replace('amp;', '', $I->href);
                $J = parse_url($I->href);
                if (isset($J['query']))
                {
                    parse_str($J['query'], $K);
                    if (isset($K['watch'])) continue;
                    if (isset($K['p']))
                    {
                        if ($F[0] != $C and isset($K['t']))
                        {
                            $L = $K['f'];
                            $M = $K['t'];
                            if (UPDATE and $L == $STAGE)
                            {
                                if (isset($gH[$STAGE][$M]))
                                {
                                    if ($K['p'] > $gH[$L][$M][1])
                                    {
                                        if (!isset($AB[$M]))
                                        {
                                            $AB[$M] = $gH[$STAGE][$M][0];
                                            $N = "";
                                            $O = "";
                                            if ($AB[$M])
                                            {
                                                $N = "&start=" . $AB[$M];
                                                $O = "-start" . $AB[$M];
                                            }
                                            $D[] = [HOME . "/viewtopic.php?f=$L&t=$M$N" . $J['query'], ROOT . "$L/t$M$O.html", $L];
                                        }
                                    }
                                }
                                else
                                {
                                    if (!isset($AB[$K['t']]))
                                    {
                                        $AB[$K['t']] = 0;
                                        $D[] = [HOME . "/viewtopic.php?f=$L&t=$M", ROOT . "$L/t$M.html", $L];
                                    }
                                }
                            }
                        }
                    }
                    else
                    {
                        if (isset($K['start']))
                        {
                            $L = $K['start'];
                            if (isset($K['f']) and !isset($K['t']))
                            {
                                $M = $K['f'];
                                if (!isset($E[0][$M][$L]) and (BYPASS or $M == $STAGE))
                                {
                                    $B[] = [HOME . '/viewforum.php?' . $J['query'], ROOT . "$M/index-start$L.html", $M];
                                    $E[0][$M][$L] = 1;
                                }
                            }
                        }
                        else if (isset($K['t']))
                        {
                            if (!isset($F[2]))
                            {
                                $F[2] = $K['f'];
                            }
                            $L = $K['t'];
                            if (!isset($E[1][$L][0]) and $F[2] == $STAGE)
                            {
                                $E[1][$L][0] = $F[2];
                                if (!UPDATE)
                                {
                                    $D[] = [HOME . "/viewtopic.php?" . $J['query'], ROOT . "$F[2]/t$L.html", $F[2]];
                                }
                            }
                        }
                        else if (isset($K['f']))
                        {
                            $L = $K['f'];
                            if (BYPASS and !in_array($L, $Bcc))
                            {
                                $Bc[] = $L;
                                $Bcc[] = $L;
                                $E[0][$L][0] = 1;
                            }
                        }
                    }
                }
            }
            if (substr($I->href, 0, 11) == "./index.php" or $I->href == "/")
            {
                $I->href = "$G/index.html";
            }
        }

        foreach ($H->find('img') as $I)
        {
            if (!strpos($I->src, '//'))
            {
                $I->src = explode('?', $I->src) [0];
                $I->src = A($I->src, $F[0]);
                if (!isset($E[2][$I->src]))
                {
                    $J = file_get($I->src, $F[0]);
                    $E[2][$I->src] = uniq();
                    file_put_contents(THIS . '/css/' . $E[2][$I->src], $J);
                }
                $I->src = "$G/css/" . $E[2][$I->src];
            }
        }

        foreach ($H->find('link') as $I)
        {
            if (strpos('yle.php', $I->href) or (isset($I->rel) and strpos($I->rel, 'tylesheet')))
            {
                $I->href = upac($I->href, $F[0]);
                if (!isset($E[2][$I->href]))
                {
                    $J = file_get($I->href, $F[0]);
                    $J = $import($J, $I->href, THIS, './..', $E[2]);
                    $K = uniq();
                    file_put_contents(THIS . "/css/$K", $J);
                    $E[2][$I->href] = $K;
                }
                $I->href = "$G/css/" . $E[2][$I->href];
            }
        }

        $H->save($F[1]);
        $H = $import(file_get_contents($F[1]) , $F[0], THIS, $G, $E[2]);
        file_put_contents($F[1], $H);
    }

    while ($D)
    {
        if ($COOKIES and time() > $STEP)
        {
            $STEP = time() + 4500;
            keepAlive();
        }
        $F = array_pop($D);
        file_put_contents(THIS . "/current", $F[0] . " " . count($D));

        $G = './..';

        $H = file_get($F[0], $F[0]);
        $H = str_get_html($H);

        $title = "";
        while (true)
        {
            $H = file_get($F[0], $F[0]);
            $H = str_get_html($H);
            if (is_object($H))
            {
                foreach ($H->find('title') as $I)
                {
                    $title = $I->innertext != "503 Service Unavailable";
                }
            }
            if ($title) break;
            else sleep(5);
        }

        foreach ($H->find('a') as $I)
        {
            $I->href = A($I->href, $F[0]);
            if (strpos($I->href, '/view') and (isset($I->class) or BYPASS))
            {
                $I->href = str_replace('amp;', '', $I->href);
                $J = parse_url($I->href);
                if (isset($J['query']))
                {
                    parse_str($J['query'], $K);
                    if (isset($K['watch'])) continue;
                    if (!isset($K['p']) and (BYPASS or (isset($I->class) and $I->class == 'button')))
                    {
                        if (isset($K['start']))
                        {
                            $L = $K['start'];
                            if (isset($K['t']))
                            {
                                $M = $K['t'];
                                if (!isset($E[1][$M][$L]))
                                {
                                    if (!UPDATE or (isset($AB[$M]) and $AB[$M] < $L))
                                    {
                                        $D[] = [HOME . "/viewtopic.php?" . $J['query'], ROOT . "$F[2]/t$M-start$L.html", $F[2]];
                                        $E[1][$M][$L] = 1;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (BYPASS)
            {
                $J = $I->href;
                $K = b(['.jpg', '.png', '.jpeg', '.gif', '.bmp'], $J);
                if ($K)
                {
                    if (strpos($J, 'href.li'))
                    {
                        $J = substr($J, 17);
                    }
                    if (!isset($E[$J]))
                    {
                        $K = @file_get($J, $F[0]);
                        $E[$J] = uniq();
                        file_put_contents(THIS . '/css/' . $E[$J], $K);
                    }
                    $J = "$G/css/" . $E[$J];
                }
                else if (strpos($J, 'bit.ly') or (isset($I->innertext) and stripos($I->innertext, 'preview')))
                {
                    $J = explode('?', $J) [0];
                    if (!isset($a[$J]))
                    {
                        debug($J, THIS . '/result');
                        $a[$J] = 1;
                    }
                }
                $I->href = $J;
            }
            if (substr($I->href, 0, 11) == "./index.php" or $I->href == "/")
            {
                $I->href = "$G/index.html";
            }
        }

        foreach ($H->find('img') as $I)
        {
            $J = $I->src;
            if (substr($J, 0, 3) == './d')
            {
                $J = str_replace('amp;', '', $J);
                $K = parse_url($J);
                if (isset($K['query']))
                {
                    parse_str($K['query'], $L);
                    if (isset($L['avatar']))
                    {
                        $J = HOME . '/download.php?avatar=' . $L['avatar'];
                    }
                }
            }
            if (BYPASS or !strpos($J, '//'))
            {
                $J = A($J, $F[0]);
                if (!isset($E[2][$J]))
                {
                    $K = file_get($J, $F[0]);
                    $E[2][$J] = uniq();
                    file_put_contents(THIS . '/css/' . $E[2][$J], $K);
                }
                $I->src = "$G/css/" . $E[2][$J];
            }
        }
 
       foreach ($H->find('link') as $I)
        {
            if (strpos('yle.php', $I->href) or (isset($I->rel) and strpos($I->rel, 'tylesheet')))
            {
                $I->href = upac($I->href, $F[0]);
                if (!isset($E[2][$I->href]))
                {
                    $J = file_get($I->href, $F[0]);
                    $J = $import($J, $I->href, THIS, './..', $E[2]);
                    $K = uniq();
                    file_put_contents(THIS . "/css/$K", $J);
                    $E[2][$I->href] = $K;
                }
                $I->href = "$G/css/" . $E[2][$I->href];
            }
        }

        $H->save($F[1]);
        $H = $import(file_get_contents($F[1]) , $F[0], THIS, $H, $E[2]);
        file_put_contents($F[1], $H);
    }

}

if (!file_exists(THIS . '/css.php'))
{
    $A = var_export($E[2], true);
    file_put_contents(THIS . '/css.php', "<?php \$E[2] = $A;");
}
