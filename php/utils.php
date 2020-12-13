<?php

function file_get($contents, $REF, $post = [])
{
    global $COOKIES;
    $try = 0;
    while (true)
    {
        $ch = curl_init($contents);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_USERAGENT, "Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0");
        curl_setopt($ch, CURLOPT_REFERER, $REF);
        if ($COOKIES)
        {
            curl_setopt($ch, CURLOPT_COOKIE, $COOKIES);
        }
        if (strpos($contents, '.com'))
        {
            curl_setopt($ch, CURLOPT_PROXY, "localhost:80");
            curl_setopt($ch, CURLOPT_PROXYTYPE, 0);
        }
        if ($post)
        {
            curl_setopt($ch, CURLOPT_HEADER, 1); 
            curl_setopt($ch, CURLOPT_POST, 1);
            curl_setopt($ch, CURLOPT_POSTFIELDS, $post);
        }
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
        $result = curl_exec($ch);
        curl_close($ch);
        unset($ch);
        $try += 1;
        if ($result or $try == 3)
        {
            break;
        }
        else sleep(3);
    }
    return $result;
}

$mkdir = function ($fold)
{
    if (!file_exists($fold))
    {
        mkdir($fold);
    }
};

function array_split($a, $b)
{
    $c = count($a);
    $d = floor($c / $b);
    $e = $c % $b;
    $c = 0;
    for ($f = 0;$f < $b;$f++)
    {
        $g = ($f < $e) ? $d + 1 : $d;
        $h[$f] = array_slice($a, $c, $g);
        $c += $g;
    }
    return $h;
}

if (isset($gH))
{
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
}

function A($B, $C)
{
    $B = trim($B);
    if (substr($B, 0, 1) == "'" or substr($B, 0, 1) == '"')
    {
        $B = substr($B, 1, -1);
    }
    if (substr($B, 0, 4) == 'http')
    {
        $D = $B;
    }
    elseif (substr($B, 0, 2) == '//')
    {
        $D = "http:$B";
    }
    else
    {
        $E = explode('/', $C);
        $D = "$E[0]/$E[1]/$E[2]/";
        if (substr($B, 0, 1) == '/')
        {
            $D .= substr($B, 1);
        }
        else
        {
            $F = substr_count($B, '../');
            $B = str_replace("../", "", $B);
            if (substr($B, 0, 2) == './')
            {
                $B = substr($B, 2);
            }
            $G = explode('/', $B);
            foreach ($E as $H => $I)
            {
                if ($H > 2)
                {
                    $D .= "$I/";
                }
                if ($H == count($E) - 2 - $F)
                {
                    break;
                }
            }
            foreach ($G as $J => $K)
            {
                if ($J != count($G) - 1)
                {
                    $D .= "$K/";
                }
                else
                {
                    $D .= "$K";
                }
            }
        }
    }
    return $D;
}

function debug($self, $n = 'jb/result')
{
    fopen($n, "a+");
    $m = file_get_contents($n);
    $m .= $self . "\n";
    file_put_contents($n, $m);
}

function uniq()
{
    $random_number = '';
    $count = 0;
    while ($count < 35)
    {
        $random_digit = mt_rand(0, 9);
        $random_number .= $random_digit;
        $count++;
    }
    return $random_number;
}

$import = function ($h, $u, $p, $c, &$e)
{
    return preg_replace_callback('/url\((.*)\)/U', function ($r) use ($u, $p, $c, &$e)
    {
        if (strpos($r[1], '+')) return "url($r[1])";
        $r[1] = A($r[1], $u);

        if (b(['.jpg', '.png', '.jpeg', '.gif', '.bmp'], $r[1]))
        {
            $file = "images/";
        }
        else
        {
            $file = "css/";
        }
        $b = $r[1];
        $r[1] = explode('&', $r[1]) [0];
        $r[1] = explode('&amp;', $r[1]) [0];
        if (!isset($e[$r[1]]))
        {
            $ab = file_get($b, $u);
            $e[$r[1]] = uniq();
            file_put_contents("$p/$file" . $e[$r[1]], $ab);
        }

        return "url($c/$file" . $e[$r[1]] . ')';
    }
    , $h);
};

function b($b, $c)
{
    foreach ($b as $d)
    {
        if (strpos($c, $d)) return true;
    }
}

function upac($a, $b)
{
    if (strpos($a, 'yle.php'))
    {
        if (substr($a, 0, 1) == '.')
        {
            $a = HOME . substr($a, 1);
        }
        else if (substr($a, 0, 1) == '/')
        {
            $a = HOME . $a;
        }
        else
        {
            $a = HOME . '/' . $a;
        }
    }
    else
    {
        $a = explode('?', $a) [0];
        $a = A($a, $b);
    }
    return $a;
}

function keepAlive()
{
    global $COOKIES;
    global $POST;
    while (true)
    {
        $COOKIES = "";
        $H = file_get(HOME . "/ucp.php?mode=login", HOME);
        $H = str_get_html($H);
        if (is_object($H))
        {
            foreach ($H->find('input') as $I)
            {
                if (isset($I->name))
                {
                    if ($I->name != "username" && $I->name != "password")
                    {
                        $POST[$I->name] = $I->value;
                    }
                }
            }
            if (isset($POST["form_token"]))
            {
                $form = "";
                foreach($POST as $key => $value) $form.= "$key=" . urlencode($value) . "&";
                unset($POST["form_token"]);
                $post = substr($form, 0, -1);
                $H = file_get(HOME . "/ucp.php?mode=login", HOME . "/ucp.php?mode=login", $post);
                if ($H)
                {
                    list($header, $H) = explode("\r\n\r\n", file_get(HOME . "/ucp.php?mode=login", HOME . "/ucp.php?mode=login", $post) , 2);
                    $headers = [];
                    foreach (explode("\r\n", $header) as $i => $line)
                    {
                        if ($i === 0) $headers['http_code'] = $line;
                        else
                        {
                            list($key, $value) = explode(': ', $line);
                            $headers[$key] = $value;
                        }
                    }
                    if (isset($headers['Set-Cookie']))
                    {
                        $sid = explode('sid=', $headers['Set-Cookie']);
                        if (isset($sid[1]))
                        {
                            $sid = explode(';', $sid[1]) [0];
                            $COOKIES = "phpbb3_eduwh_u=1; phpbb3_eduwh_k=; phpbb3_eduwh_sid=$sid";
                            break;
                        }
                    }
                }
            }
        }
        sleep(5);
    }
}

class Navigator
{
    var $content = "";
    var $cookie = "";

    function get($b)
    {
        while (true)
        {
            if (is_resource($c = curl_init($b)))
            {
                curl_setopt($c, CURLOPT_HEADERFUNCTION, [$this,'savecookies'] );
                curl_setopt($c, CURLOPT_USERAGENT, 'Mozilla/5.0 (Windows NT 10.0; rv:68.0) Gecko/20100101 Firefox/68.0');
                curl_setopt($c, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($c, CURLOPT_REFERER, $b);
                curl_setopt($c, CURLOPT_TIMEOUT, 45);
                curl_setopt($c, CURLOPT_SSL_VERIFYHOST, 0);
                curl_setopt($c, CURLOPT_SSL_VERIFYPEER, 0);
                if ($this->cookies) curl_setopt($c, CURLOPT_COOKIE, $this->cookies);
                $d = curl_exec($c);
                if (false and curl_errno($c))
                {
                    echo curl_error($c);
                }
                curl_close($c);
                return $this->content = $d;
            }
            sleep(2);
        }
    }

    function savecookies($c, $e)
    {
        if (preg_match('/^Set-Cookie:\s*([^;]*)/mi', $e, $f) == 1)

            $this->cookies = $f[1];

        return strlen($e);
    }

}
