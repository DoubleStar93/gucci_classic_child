<?php
/**
 * Diagnostica configurazione email PrestaShop (one-shot via FTP).
 * Token: gucci-mail-diag-2026
 */
error_reporting(E_ALL);
ini_set('display_errors', '1');

$configFile = __DIR__ . '/config/config.inc.php';

if (!is_file($configFile)) {
    http_response_code(500);
    exit("config.inc.php not found\n");
}

require $configFile;

if (!defined('_PS_VERSION_')) {
    http_response_code(500);
    exit("PrestaShop bootstrap failed\n");
}

header('Content-Type: text/plain; charset=utf-8');

$expectedToken = 'gucci-mail-diag-2026';
$token = (string) Tools::getValue('token');

if (!hash_equals($expectedToken, $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

function line(string $label, $value): void
{
    $text = $value === null || $value === '' ? '(vuoto)' : (string) $value;
    echo str_pad($label, 34) . $text . "\n";
}

function section(string $title): void
{
    echo "\n=== {$title} ===\n";
}

try {
    section('PrestaShop');
    line('Versione', _PS_VERSION_);

    section('Configurazione email (ps_configuration)');
    $keys = [
        'PS_SHOP_EMAIL',
        'PS_SHOP_NAME',
        'PS_MAIL_METHOD',
        'PS_MAIL_SERVER',
        'PS_MAIL_USER',
        'PS_MAIL_SMTP_ENCRYPTION',
        'PS_MAIL_SMTP_PORT',
        'PS_MAIL_DOMAIN',
        'PS_MAIL_TYPE',
    ];
    $mailMethod = [
        1 => 'PHP mail()',
        2 => 'SMTP',
        3 => 'Mai inviare',
    ];

    $values = [];
    foreach ($keys as $key) {
        $values[$key] = Configuration::get($key);
        $display = $values[$key];
        if ($key === 'PS_MAIL_METHOD') {
            $display .= ' (' . ($mailMethod[(int) $values[$key]] ?? '?') . ')';
        }
        line($key, $display);
    }

    section('Contatti negozio');
    $contacts = Db::getInstance()->executeS(
        'SELECT id_contact, email, customer_service FROM ' . _DB_PREFIX_ . 'contact'
    );
    if ($contacts) {
        foreach ($contacts as $contact) {
            line(
                'Contact #' . $contact['id_contact'],
                $contact['email'] . ($contact['customer_service'] ? ' [servizio clienti]' : '')
            );
        }
    } else {
        line('Contatti', 'nessuno');
    }

    section('Dipendenti attivi');
    $employees = Db::getInstance()->executeS(
        'SELECT id_employee, email, firstname, lastname FROM ' . _DB_PREFIX_ . 'employee WHERE active = 1'
    );
    foreach ($employees as $employee) {
        line(
            '#' . $employee['id_employee'],
            $employee['email'] . ' (' . $employee['firstname'] . ' ' . $employee['lastname'] . ')'
        );
    }

    section('Symfony parameters.php');
    $paramsFile = _PS_ROOT_DIR_ . '/app/config/parameters.php';
    if (is_file($paramsFile)) {
        $params = include $paramsFile;
        $p = $params['parameters'] ?? [];
        line('mailer_transport', $p['mailer_transport'] ?? '(default)');
        line('mailer_host', $p['mailer_host'] ?? '(default)');
        line('mailer_user', $p['mailer_user'] ?? '(null)');
    } else {
        line('parameters.php', 'non trovato');
    }

    section('Mittente effettivo (come Mail::send)');
    $shopEmail = trim((string) $values['PS_SHOP_EMAIL']);
    $shopName = trim((string) $values['PS_SHOP_NAME']);
    $smtpUser = trim((string) $values['PS_MAIL_USER']);
    $mailDomain = trim((string) $values['PS_MAIL_DOMAIN']);

    line('From header (tipico)', $shopName . ' <' . $shopEmail . '>');
    line('SMTP auth user', $smtpUser);

    if ($mailDomain !== '') {
        line('PS_MAIL_DOMAIN attivo', $mailDomain . ' — può alterare MAIL FROM envelope');
    }

    section('Diagnosi');
    $issues = [];

    if ((int) $values['PS_MAIL_METHOD'] !== 2) {
        $issues[] = 'Metodo email non è SMTP (PS_MAIL_METHOD ≠ 2).';
    }
    if ($shopEmail === '') {
        $issues[] = 'PS_SHOP_EMAIL vuoto.';
    }
    if ($smtpUser === '') {
        $issues[] = 'PS_MAIL_USER vuoto.';
    }
    if ($shopEmail !== '' && $smtpUser !== '' && strcasecmp($shopEmail, $smtpUser) !== 0) {
        $issues[] = "MISMATCH: PS_SHOP_EMAIL ({$shopEmail}) ≠ PS_MAIL_USER ({$smtpUser}).";
    }
    if ($mailDomain !== '') {
        $issues[] = 'PS_MAIL_DOMAIN non è vuoto — su SiteGround va lasciato vuoto.';
    }
    if ($shopEmail !== '' && !preg_match('/@barbaraalvisi\.it$/i', $shopEmail)) {
        $issues[] = "PS_SHOP_EMAIL ({$shopEmail}) non è @barbaraalvisi.it.";
    }
    if ($smtpUser !== '' && !preg_match('/@barbaraalvisi\.it$/i', $smtpUser)) {
        $issues[] = "PS_MAIL_USER ({$smtpUser}) non è @barbaraalvisi.it.";
    }

  foreach ($employees as $employee) {
        $employeeEmail = trim((string) $employee['email']);
        if ($employeeEmail !== '' && strcasecmp($employeeEmail, $smtpUser) !== 0 && strcasecmp($employeeEmail, $shopEmail) !== 0) {
            $issues[] = "Dipendente {$employeeEmail} diverso da shop/SMTP (ok per login, ma verifica test email).";
        }
    }

    if (in_array(strtolower((string) $values['PS_MAIL_SMTP_ENCRYPTION']), ['tls', 'ssl'], true) && (int) $values['PS_MAIL_SMTP_PORT'] === 587) {
        $issues[] = "Porta 587 con encryption 'tls'/'ssl': PS 9 usa ssl:// e fallisce — imposta encryption 'off' (STARTTLS auto).";
    }
    if ((int) $values['PS_MAIL_SMTP_PORT'] === 465 && strtolower((string) $values['PS_MAIL_SMTP_ENCRYPTION']) === 'tls') {
        $issues[] = 'Porta 465 con tls: usa encryption ssl (o off+587).';
    }

    if (!$issues) {
        echo "Nessun mismatch evidente in configurazione DB.\n";
        echo "PrestaShop 9: per Aruba usare encryption off + porta 587 (STARTTLS automatico).\n";
    } else {
        foreach ($issues as $issue) {
            echo "- {$issue}\n";
        }
    }

    if ((int) Tools::getValue('smtp_probe') === 1 && (int) $values['PS_MAIL_METHOD'] === 2) {
        section('Probe SMTP (MAIL FROM)');
        $host = (string) $values['PS_MAIL_SERVER'];
        $port = (int) ($values['PS_MAIL_SMTP_PORT'] ?: 465);
        $encryption = strtolower((string) $values['PS_MAIL_SMTP_ENCRYPTION']);
        $transport = $encryption === 'ssl' ? 'ssl' : ($encryption === 'tls' ? 'tls' : '');
        $remote = ($transport ? $transport . '://' : '') . $host . ':' . $port;

        $errno = 0;
        $errstr = '';
        $fp = @stream_socket_client($remote, $errno, $errstr, 15, STREAM_CLIENT_CONNECT);
        if (!$fp) {
            line('Connessione', "FALLITA: {$errstr} ({$errno})");
        } else {
            stream_set_timeout($fp, 15);
            $read = static function () use ($fp): string {
                $data = '';
                while ($line = fgets($fp, 515)) {
                    $data .= $line;
                    if (isset($line[3]) && $line[3] === ' ') {
                        break;
                    }
                }

                return trim($data);
            };
            $cmd = static function (string $command) use ($fp, $read): string {
                fwrite($fp, $command . "\r\n");

                return $read();
            };

            line('Banner', $read());
            line('EHLO', $cmd('EHLO barbaraalvisi.it'));
            if ($encryption === 'tls') {
                line('STARTTLS', $cmd('STARTTLS'));
                stream_socket_enable_crypto($fp, true, STREAM_CRYPTO_METHOD_TLS_CLIENT);
                line('EHLO post-TLS', $cmd('EHLO barbaraalvisi.it'));
            }
            line('AUTH (user)', $smtpUser);
            $pass = (string) Configuration::get('PS_MAIL_PASSWD');
            if ($pass === '') {
                line('Password SMTP', 'VUOTA in DB');
            } else {
                line('AUTH LOGIN', $cmd('AUTH LOGIN'));
                line('User b64', $cmd(base64_encode($smtpUser)));
                $authResp = $cmd(base64_encode($pass));
                line('Auth response', $authResp);
            }
            $mailFromResp = $cmd('MAIL FROM:<' . $shopEmail . '>');
            line('MAIL FROM <' . $shopEmail . '>', $mailFromResp);
            $cmd('QUIT');
            fclose($fp);
        }
    }
} catch (Throwable $exception) {
    http_response_code(500);
    exit('ERRORE: ' . $exception->getMessage() . "\n");
}
