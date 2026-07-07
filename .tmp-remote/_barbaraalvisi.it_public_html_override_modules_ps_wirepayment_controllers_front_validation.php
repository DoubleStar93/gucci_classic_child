<?php
/**
 * Bonifico — se l'ordine esiste già (doppio submit), redirect a conferma invece di errore.
 *
 * Log server: "Il carrello non può essere caricato o un ordine è già stato creato
 * con questo carrello" (PaymentModule.php:263).
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_WirepaymentValidationModuleFrontControllerOverride extends Ps_WirepaymentValidationModuleFrontController
{
    public function postProcess()
    {
        $cart = $this->context->cart;

        if (Validate::isLoadedObject($cart)) {
            $orderId = (int) Order::getIdByCartId((int) $cart->id);

            if ($orderId > 0) {
                $order = new Order($orderId);
                $customer = new Customer((int) $order->id_customer);

                if (Validate::isLoadedObject($order) && Validate::isLoadedObject($customer)) {
                    Tools::redirect(
                        'index.php?controller=order-confirmation'
                        . '&id_cart=' . (int) $cart->id
                        . '&id_module=' . (int) $this->module->id
                        . '&id_order=' . $orderId
                        . '&key=' . $customer->secure_key
                    );
                }
            }
        }

        parent::postProcess();
    }
}
