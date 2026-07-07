<?php
/**
 * Bonifico — redirect a conferma se l'ordine esiste già (doppio submit / retry dopo timeout).
 */
if (!defined('_PS_VERSION_')) {
    exit;
}

class Ps_WirepaymentValidationModuleFrontControllerOverride extends Ps_WirepaymentValidationModuleFrontController
{
    public function postProcess()
    {
        $cart = $this->context->cart;
        $cartId = $this->resolveCartId();

        if (Validate::isLoadedObject($cart) && $cart->OrderExists()) {
            $cartId = (int) $cart->id;
        }

        if ($cartId > 0 && $this->redirectToExistingOrder($cartId)) {
            return;
        }

        try {
            parent::postProcess();
        } catch (Throwable $exception) {
            if ($cartId > 0 && $this->redirectToExistingOrder($cartId)) {
                return;
            }

            throw $exception;
        }
    }

    private function resolveCartId(): int
    {
        $cart = $this->context->cart;

        if (Validate::isLoadedObject($cart) && (int) $cart->id > 0) {
            return (int) $cart->id;
        }

        $fromRequest = (int) Tools::getValue('id_cart');
        if ($fromRequest > 0) {
            return $fromRequest;
        }

        if (isset($this->context->cookie->id_cart)) {
            return (int) $this->context->cookie->id_cart;
        }

        return 0;
    }

    private function redirectToExistingOrder(int $cartId): bool
    {
        $orderId = (int) Order::getIdByCartId($cartId);

        if ($orderId <= 0) {
            return false;
        }

        $order = new Order($orderId);
        $customer = new Customer((int) $order->id_customer);

        if (!Validate::isLoadedObject($order) || !Validate::isLoadedObject($customer)) {
            return false;
        }

        Tools::redirect(
            'index.php?controller=order-confirmation'
            . '&id_cart=' . $cartId
            . '&id_module=' . (int) $this->module->id
            . '&id_order=' . $orderId
            . '&key=' . $customer->secure_key
        );

        return true;
    }
}
