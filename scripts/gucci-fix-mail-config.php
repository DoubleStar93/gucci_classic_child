<?php
/**
 * Allinea configurazione email PrestaShop (one-shot).
 * Token: gucci-mail-fix-2026
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

$expectedToken = 'gucci-mail-fix-2026';
$token = (string) Tools::getValue('token');

if (!hash_equals($expectedToken, $token)) {
    http_response_code(403);
    exit("Forbidden\n");
}

$shopEmail = 'servizioclienti@barbaraalvisi.it';

// PrestaShop 9 + Symfony Mailer:
// - 'ssl' o 'tls' → connessione ssl:// (solo corretto su porta 465)
// - 'off' su porta 587 → connessione plain + STARTTLS (corretto per Aruba)
$updates = [
    'PS_SHOP_EMAIL' => $shopEmail,
    'PS_MAIL_DOMAIN' => '',
    'PS_MAIL_SMTP_ENCRYPTION' => 'off',
    'PS_MAIL_SMTP_PORT' => '587',
];

try {
    echo "Aggiornamento configurazione email...\n\n";
    foreach ($updates as $key => $value) {
        $before = Configuration::get($key);
        Configuration::updateValue($key, $value);
        $after = Configuration::get($key);
        echo str_pad($key, 28) . "{$before} → {$after}\n";
    }

    echo "\nVerifica allineamento:\n";
    echo 'PS_SHOP_EMAIL = ' . Configuration::get('PS_SHOP_EMAIL') . "\n";
    echo 'PS_MAIL_USER  = ' . Configuration::get('PS_MAIL_USER') . "\n";
    echo 'PS_MAIL_DOMAIN = ' . (Configuration::get('PS_MAIL_DOMAIN') ?: '(vuoto)') . "\n";
    echo 'Encryption/Port = ' . Configuration::get('PS_MAIL_SMTP_ENCRYPTION') . ' / ' . Configuration::get('PS_MAIL_SMTP_PORT') . "\n";

    if (strcasecmp((string) Configuration::get('PS_SHOP_EMAIL'), (string) Configuration::get('PS_MAIL_USER')) === 0) {
        echo "\nOK: email negozio e utente SMTP allineati.\n";
    } else {
        echo "\nATTENZIONE: mismatch residuo — controlla manualmente in BO.\n";
    }

    if ((int) Tools::getValue('send_test') === 1) {
        echo "\n=== Test Mail::sendMailTest (come BO PrestaShop) ===\n";
        $to = (string) Tools::getValue('to', $shopEmail);
        $from = new Symfony\Component\Mime\Address(
            $shopEmail,
            (string) Configuration::get('PS_SHOP_NAME')
        );
        $result = Mail::sendMailTest(
            true,
            (string) Configuration::get('PS_MAIL_SERVER'),
            'Test email Gucci diagnose — ' . date('c'),
            'Test SMTP PrestaShop',
            1,
            $to,
            $from,
            (string) Configuration::get('PS_MAIL_USER'),
            (string) Configuration::get('PS_MAIL_PASSWD'),
            (int) Configuration::get('PS_MAIL_SMTP_PORT'),
            (string) Configuration::get('PS_MAIL_SMTP_ENCRYPTION')
        );
        if ($result === true) {
            echo "OK: email inviata a {$to}\n";
        } else {
            echo "ERRORE: {$result}\n";
        }
    } else {
        echo "Riprova il test email da BO → Parametri avanzati → E-mail.\n";
    }
} catch (Throwable $exception) {
    http_response_code(500);
    exit('ERRORE: ' . $exception->getMessage() . "\n");
}
