<?php

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;

/**
 * Injects BO globals into Symfony admin HTML. Does not modify PrestaShop core files.
 * Uses window.* only — never var/let — to avoid colliding with ps_faviconnotificationbo.js.
 */
class EverpspopupBoGlobalsSubscriber
{
    public function onKernelResponse(ResponseEvent $event): void
    {
        if (method_exists($event, 'isMainRequest') && !$event->isMainRequest()) {
            return;
        }

        if (method_exists($event, 'isMasterRequest') && !$event->isMasterRequest()) {
            return;
        }

        $response = $event->getResponse();
        if (!$response instanceof Response) {
            return;
        }

        $contentType = (string) $response->headers->get('Content-Type');
        if ($contentType !== '' && stripos($contentType, 'text/html') === false) {
            return;
        }

        $html = $response->getContent();
        if (!is_string($html) || strpos($html, 'themes/new-theme/public/') === false) {
            return;
        }

        if (strpos($html, 'data-ba-ever-bo-globals') !== false) {
            return;
        }

        $headPos = stripos($html, '<head');
        if ($headPos === false) {
            return;
        }

        $gt = strpos($html, '>', $headPos);
        if ($gt === false) {
            return;
        }

        $script = '<script data-ba-ever-bo-globals="1">(function (w) {'
            . 'if (w.__baEverBoGlobals) { return; }'
            . 'w.__baEverBoGlobals = 1;'
            . 'if (typeof w.str2url !== "function") {'
            . 'w.str2url = function (str) {'
            . 'if (!str) { return ""; }'
            . 'str = String(str).toLowerCase();'
            . 'str = str.replace(/[àáâãäå]/g, "a").replace(/[èéêë]/g, "e").replace(/[ìíîï]/g, "i");'
            . 'str = str.replace(/[òóôõö]/g, "o").replace(/[ùúûü]/g, "u").replace(/ç/g, "c").replace(/ñ/g, "n");'
            . 'return str.replace(/[^a-z0-9\\s-]/g, "").replace(/\\s+/g, "-").replace(/-+/g, "-").replace(/^-|-$/g, "");'
            . '};}'
            . 'if (typeof w.ps_faviconnotificationbo === "undefined") {'
            . 'w.ps_faviconnotificationbo = { initialize: function () {} };'
            . '}'
            . '})(window);</script>';

        $html = substr($html, 0, $gt + 1) . $script . substr($html, $gt + 1);
        $response->setContent($html);
    }
}
