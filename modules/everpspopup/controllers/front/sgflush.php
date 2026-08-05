<?php
/**
 * Flush SiteGround nginx proxy cache (localhost PURGE).
 * URL: /index.php?fc=module&module=everpspopup&controller=sgflush&token=...
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class EverpspopupSgflushModuleFrontController extends ModuleFrontController
{
    public $display_header = false;
    public $display_footer = false;

    public function initContent()
    {
        header('Content-Type: text/plain; charset=utf-8');

        $token = 'barbaraalvisi-sgflush-' . substr(hash('sha256', 'barbaraalvisi-sg-flush-2026'), 0, 16);
        if (Tools::getValue('token') !== $token) {
            header('HTTP/1.1 403 Forbidden');
            echo "Forbidden. Usa: ?token={$token}\n";
            exit;
        }

        $previewFs = _PS_ROOT_DIR_ . '/themes/barbaraalvisi/preview.png';
        echo 'preview.png exists=' . (is_file($previewFs) ? 'yes' : 'no')
            . ' size=' . (is_file($previewFs) ? filesize($previewFs) : 0) . "\n\n";

        $hosts = ['barbaraalvisi.it', 'www.barbaraalvisi.it'];
        $paths = [
            '/themes/barbaraalvisi/preview.png',
            '/themes/barbaraalvisi/*',
            '/*',
        ];

        foreach ($hosts as $host) {
            foreach ($paths as $path) {
                $r = $this->sgPurge($host, $path);
                echo "PURGE {$r['host']}{$r['path']} => HTTP {$r['code']}"
                    . ($r['err'] !== '' ? " err={$r['err']}" : '') . "\n";
                if (stripos($r['body'], 'Successful purge') !== false) {
                    echo "  OK\n";
                } else {
                    echo '  ' . trim(preg_replace('/\s+/', ' ', strip_tags($r['body']))) . "\n";
                }
            }
            echo "\n";
        }

        exit;
    }

    private function sgPurge($host, $path)
    {
        $url = 'http://127.0.0.1' . $path;
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_CUSTOMREQUEST => 'PURGE',
            CURLOPT_HTTPHEADER => ['Host: ' . $host],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 20,
            CURLOPT_HEADER => true,
        ]);
        $body = curl_exec($ch);
        $err = curl_error($ch);
        $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        return [
            'host' => $host,
            'path' => $path,
            'code' => $code,
            'err' => (string) $err,
            'body' => substr((string) $body, 0, 400),
        ];
    }
}
