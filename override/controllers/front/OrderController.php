<?php
/**
 * Checkout order page — forza HTTP 200 sulla risposta HTML.
 *
 * Su PS 9.0.3 la pagina cassa viene renderizzata correttamente ma il server
 * risponde con status 400, visibile in console come errore su controller=order.
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class OrderController extends OrderControllerCore
{
    public function initContent(): void
    {
        parent::initContent();

        if (!$this->ajax) {
            http_response_code(200);
        }
    }

    public function display(): void
    {
        if (!$this->ajax) {
            http_response_code(200);
        }

        parent::display();
    }
}
