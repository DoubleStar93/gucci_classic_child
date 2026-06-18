<?php
/**
 * 2019-2023 Team Ever
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Academic Free License (AFL 3.0)
 * that is bundled with this package in the file LICENSE.txt.
 * It is also available through the world-wide-web at this URL:
 * http://opensource.org/licenses/afl-3.0.php
 * If you did not receive a copy of the license and are unable to
 * obtain it through the world-wide-web, please send an email
 * to license@prestashop.com so we can send you a copy immediately.
 *
 *  @author    Team Ever <https://www.team-ever.com/>
 *  @copyright 2019-2023 Team Ever
 *  @license   http://opensource.org/licenses/afl-3.0.php  Academic Free License (AFL 3.0)
 */

if (!defined('_PS_VERSION_')) {
    exit;
}

class Everpspopup extends Module
{
    public $isSeven;
    public $siteUrl;
    public $cookie_suffix;

    private $html = '';
    private $postErrors = [];
    private $postSuccess = [];
    const IMG_FOLDER  = _PS_MODULE_DIR_.'everpspopup/views/img/';
    const POPUP_IMG  = _PS_MODULE_DIR_.'everpspopup/views/img/';
    const POPUP_VIEWS  = _PS_MODULE_DIR_.'everpspopup/views/';

    public function __construct()
    {
        $this->name = 'everpspopup';
        $this->tab = 'administration';
        $this->version = '5.4.9';
        $this->author = 'Team Ever';
        $this->need_instance = 0;
        $this->bootstrap = true;
        parent::__construct();
        $this->displayName = $this->l('Ever Popup');
        $this->description = $this->l('No doubt the most famous pop up module');
        $this->ps_versions_compliancy = ['min' => '1.7', 'max' => _PS_VERSION_];
        $this->isSeven = Tools::version_compare(_PS_VERSION_, '1.7', '>=');
        $this->siteUrl = Tools::getHttpHost(true) . __PS_BASE_URI__;
        $this->cookie_suffix = $this->buildCookieSuffix();
    }

    /**
     * PS 8.1+ — Tools::encrypt() rimosso, sostituito da Tools::hash()
     */
    private function buildCookieSuffix()
    {
        $seed = 'everpspopup/cookie';

        if (method_exists('Tools', 'hash')) {
            return Tools::substr(Tools::hash($seed), 0, 10);
        }

        if (method_exists('Tools', 'encrypt')) {
            return Tools::substr(Tools::encrypt($seed), 0, 10);
        }

        $key = defined('_COOKIE_KEY_') ? _COOKIE_KEY_ : '';

        return Tools::substr(md5($seed . $key), 0, 10);
    }

    private function getModuleBasePath()
    {
        if (!empty($this->local_path)) {
            return $this->local_path;
        }

        if (method_exists($this, 'getLocalPath')) {
            return $this->getLocalPath();
        }

        return _PS_MODULE_DIR_ . $this->name . '/';
    }

    private function getConfigureAdminLink($withToken = true)
    {
        return $this->context->link->getAdminLink(
            'AdminModules',
            $withToken,
            [],
            [
                'configure' => $this->name,
                'module_name' => $this->name,
                'tab_module' => $this->tab,
            ]
        );
    }

    private function getPopupAdminLink()
    {
        return $this->context->link->getAdminLink('AdminEverPsPopup');
    }

    private function loadModel()
    {
        require_once _PS_MODULE_DIR_.'everpspopup/models/EverPsPopupClass.php';
    }

    private function getShopSslUrl()
    {
        if (method_exists('Tools', 'getShopDomainSsl')) {
            return Tools::getShopDomainSsl(true);
        }

        if (method_exists('Tools', 'getShopDomain')) {
            return Tools::getShopDomain(true);
        }

        return Tools::getHttpHost(true) . __PS_BASE_URI__;
    }

    private function fetchRemoteBody($url)
    {
        if (function_exists('curl_init')) {
            $handle = curl_init($url);
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($handle, CURLOPT_CONNECTTIMEOUT, 5);
            curl_setopt($handle, CURLOPT_TIMEOUT, 10);
            $body = curl_exec($handle);
            curl_close($handle);

            if (is_string($body)) {
                return $body;
            }
        }

        if (method_exists('Tools', 'file_get_contents')) {
            return Tools::file_get_contents($url);
        }

        return @file_get_contents($url);
    }

    /**
     * Don't forget to create update methods if needed:
     * http://doc.prestashop.com/display/PS16/Enabling+the+Auto-Update
     */
    public function install()
    {
        $this->loadModel();
        include(dirname(__FILE__) . '/sql/install.php');
        if ($this->isSeven) {
            Configuration::updateValue('EVERPSPOPUP_FANCYBOX', true);
        } else {
            Configuration::updateValue('EVERPSPOPUP_FANCYBOX', false);
        }
        Configuration::updateValue('EVERPSPOPUP_AGE', '18');
        $this->createPopupDemo();

        if (!$this->isSeven) {
            return parent::install()
                && $this->registerHook('header')
                && $this->registerHook('footer')
                && $this->installModuleTab('AdminEverPsPopup', 'Ever Popup');
        } else {
            return parent::install()
                && $this->registerHook('displayBeforeBodyClosingTag')
                && $this->registerHook('header')
                && $this->installModuleTab('AdminEverPsPopup', 'Ever Popup');
        }
    }

    public function uninstall()
    {
        include(dirname(__FILE__).'/sql/uninstall.php');
        return parent::uninstall()
            && $this->uninstallModuleTab('AdminEverPsPopup');
    }

    /**
     * The installModuleTab method
     *
     * @param string $tabClass
     * @param string $tabName
     * @param integer $idTabParent
     * @return boolean
     */
    private function installModuleTab($tabClass, $tabName)
    {
        $tab = new Tab();
        $tab->class_name = $tabClass;
        $tab->module = $this->name;
        if ($this->isSeven) {
            $tab->id_parent = (int)Tab::getIdFromClassName('AdminParentThemes');
        } else {
            $tab->id_parent = (int)Tab::getIdFromClassName('AdminPreferences');
        }
        foreach (Language::getLanguages(false) as $lang) {
            $tab->name[(int) $lang['id_lang']] = $tabName;
        }
        $tab->position = Tab::getNewLastPosition($tab->id_parent);
        return $tab->save();
    }

    /**
     * The uninstallModuleTab method
     *
     * @param string $tabClass
     * @return boolean
     */
    private function uninstallModuleTab($tabClass)
    {
        $tab = new Tab((int)Tab::getIdFromClassName($tabClass));

        return $tab->delete();
    }

    /**
     * Load the configuration form
     */
    public function getContent()
    {
        /**
         * If values have been submitted in the form, process.
         */
        if (((bool)Tools::isSubmit('submitEverpspopupModule')) == true) {
            $this->postValidation();

            if (!count($this->postErrors)) {
                $this->postProcess();
            }
        }

        // Display errors
        if (count($this->postErrors)) {
            foreach ($this->postErrors as $error) {
                $this->html .= $this->displayError($error);
            }
        }

        // Display confirmations
        if (count($this->postSuccess)) {
            foreach ($this->postSuccess as $success) {
                $this->html .= $this->displayConfirmation($success);
            }
        }
        $popup_admin_link = $this->getPopupAdminLink();

        $this->context->smarty->assign([
            'everpspopup_dir' => $this->_path,
            'popup_admin_link' => $popup_admin_link,
            'module_link' => $this->getConfigureAdminLink(),
        ]);

        $viewsPath = $this->getModuleBasePath();
        $this->html .= $this->context->smarty->fetch($viewsPath . 'views/templates/admin/header.tpl');
        if ($this->checkLatestEverModuleVersion($this->name, $this->version)) {
            $this->html .= $this->context->smarty->fetch($viewsPath . 'views/templates/admin/upgrade.tpl');
        }
        $this->html .= $this->renderForm();
        $this->html .= $this->context->smarty->fetch($viewsPath . 'views/templates/admin/configure.tpl');
        $this->html .= $this->context->smarty->fetch($viewsPath . 'views/templates/admin/footer.tpl');

        return $this->html;
    }

    /**
     * Create the form that will be displayed in the configuration of your module.
     */
    protected function renderForm()
    {
        $helper = new HelperForm();

        $helper->show_toolbar = false;
        $helper->table = $this->table;
        $helper->module = $this;
        $helper->default_form_language = $this->context->language->id;
        $helper->allow_employee_form_lang = Configuration::get('PS_BO_ALLOW_EMPLOYEE_FORM_LANG', 0);

        $helper->identifier = $this->identifier;
        $helper->submit_action = 'submitEverpspopupModule';
        $helper->currentIndex = $this->getConfigureAdminLink(false);
        $helper->token = Tools::getAdminTokenLite('AdminModules');

        $helper->tpl_vars = [
            'fields_value' => $this->getConfigFormValues(),
            'languages' => $this->context->controller->getLanguages(),
            'id_language' => $this->context->language->id,
        ];

        return $helper->generateForm([$this->getConfigForm()]);
    }

    /**
     * Create the structure of your form.
     */
    protected function getConfigForm()
    {
        return array(
            'form' => array(
                'legend' => array(
                'title' => $this->l('Settings'),
                'icon' => 'icon-smile',
                ),
                'input' => array(
                    array(
                        'col' => 3,
                        'type' => 'text',
                        'label' => $this->l('Minimum legal age'),
                        'desc' => $this->l('For adult mode'),
                        'name' => 'EVERPSPOPUP_AGE',
                        'required' => 'true',
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Ask age for adult mode ?'),
                        'desc' => $this->l('Else a simple button will be asked to be cliqued'),
                        'name' => 'EVERPSPOPUP_ASK_AGE',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'id' => 'active_on',
                                'value' => 1,
                                'label' => $this->l('Enabled'),
                            ),
                            array(
                                'id' => 'active_off',
                                'value' => 0,
                                'label' => $this->l('Disabled'),
                            )
                        ),
                    ),
                    array(
                        'type' => 'switch',
                        'label' => $this->l('Enable Fancybox'),
                        'desc' => $this->l('Use Fancybox for popups'),
                        'name' => 'EVERPSPOPUP_FANCYBOX',
                        'is_bool' => true,
                        'values' => array(
                            array(
                                'id' => 'active_on',
                                'value' => 1,
                                'label' => $this->l('Enabled'),
                            ),
                            array(
                                'id' => 'active_off',
                                'value' => 0,
                                'label' => $this->l('Disabled'),
                            )
                        ),
                    ),
                ),
                'submit' => array(
                    'title' => $this->l('Save'),
                ),
            ),
        );
    }

    /**
     * Set values for the inputs.
     */
    protected function getConfigFormValues()
    {
        return [
            'EVERPSPOPUP_AGE' => Configuration::get('EVERPSPOPUP_AGE'),
            'EVERPSPOPUP_FANCYBOX' => Configuration::get('EVERPSPOPUP_FANCYBOX'),
            'EVERPSPOPUP_ASK_AGE' => Configuration::get('EVERPSPOPUP_ASK_AGE'),
        ];
    }

    public function postValidation()
    {
        if (((bool)Tools::isSubmit('submitEverpspopupModule')) == true) {
            if (Tools::getValue('EVERPSPOPUP_AGE')
                && !Validate::isUnsignedInt(Tools::getValue('EVERPSPOPUP_AGE'))
            ) {
                $this->postErrors[] = $this->l(
                    'Error : The field "Age" is not valid'
                );
            }
            if (Tools::getValue('EVERPSPOPUP_FANCYBOX')
                && !Validate::isBool(Tools::getValue('EVERPSPOPUP_FANCYBOX'))
            ) {
                $this->postErrors[] = $this->l(
                    'Error : The field "use fancybox" is not valid'
                );
            }
            if (Tools::getValue('EVERPSPOPUP_ASK_AGE')
                && !Validate::isBool(Tools::getValue('EVERPSPOPUP_ASK_AGE'))
            ) {
                $this->postErrors[] = $this->l(
                    'Error : The field "Ask age" is not valid'
                );
            }
        }
    }

    /**
     * Save form data.
     */
    protected function postProcess()
    {
        $form_values = $this->getConfigFormValues();

        foreach (array_keys($form_values) as $key) {
            Configuration::updateValue($key, Tools::getValue($key));
        }
        $this->postSuccess[] = $this->l('All settings have been saved');
    }

    public function hookHeader()
    {
        $controller_name = Tools::getValue('controller');
        $assetVersion = $this->version;

        if ((bool) Configuration::get('EVERPSPOPUP_FANCYBOX') === true) {
            if ($controller_name != 'order') {
                if (method_exists($this->context->controller, 'registerStylesheet')) {
                    $this->context->controller->registerStylesheet(
                        'module-everpspopup-fancybox',
                        'modules/'.$this->name.'/views/css/jquery.fancybox.min.css',
                        ['media' => 'all', 'priority' => 190, 'version' => $assetVersion]
                    );
                    $this->context->controller->registerJavascript(
                        'module-everpspopup-fancybox',
                        'modules/'.$this->name.'/views/js/jquery.fancybox.min.js',
                        ['position' => 'bottom', 'priority' => 190, 'version' => $assetVersion]
                    );
                } else {
                    $this->context->controller->addCSS($this->_path . 'views/css/jquery.fancybox.min.css', 'all');
                    $this->context->controller->addJS($this->_path . 'views/js/jquery.fancybox.min.js', 'all');
                }
            }
        }

        if (method_exists($this->context->controller, 'registerStylesheet')) {
            $this->context->controller->registerStylesheet(
                'module-everpspopup-style',
                'modules/'.$this->name.'/views/css/everpspopup.css',
                ['media' => 'all', 'priority' => 195, 'version' => $assetVersion]
            );
            $this->context->controller->registerJavascript(
                'module-everpspopup-script',
                'modules/'.$this->name.'/views/js/everpspopup.js',
                ['position' => 'bottom', 'priority' => 195, 'version' => $assetVersion]
            );
        } else {
            $this->context->controller->addCSS($this->_path . 'views/css/everpspopup.css', 'all');
            $this->context->controller->addJS($this->_path . 'views/js/everpspopup.js', 'all');
        }
    }

    public function hookDisplayAmpContent()
    {
        return $this->hookHeader();
    }

    public function hookDisplayFooter()
    {
        return $this->hookDisplayBeforeBodyClosingTag();
    }

    /**
    * Hook Prestashop 1.7 only
    */
    public function hookDisplayBeforeBodyClosingTag()
    {
        $this->loadModel();
        $controller_name = Tools::getValue('controller');
        $everpopup = EverPsPopupClass::getPopupByIdController(
            (int) $this->context->shop->id,
            (int) $this->context->language->id,
            $controller_name
        );
        if (!Validate::isLoadedObject($everpopup)) {
            return;
        }
        // Allowed categories
        if ($everpopup->controller_array == 3 && $everpopup->categories) {
            $allowed_cats = json_decode(
                $everpopup->categories
            );
            if (!in_array((int)Tools::getValue('id_category'), $allowed_cats)) {
                $this->context->smarty->assign(
                    [
                        'ever_errors' => 'category not allowed',
                    ]
                );
                return $this->display(__FILE__, 'errors.tpl', $this->getCacheId());
            }
        }
        if ((bool) $this->context->customer->isLogged() === true) {
            $content = $this->changeShortcodes(
                $everpopup->content,
                (int) $this->context->customer->id
            );
        } else {
            $content = $this->changeShortcodes(
                $everpopup->content,
                false
            );
        }
        // Popup background
        if (file_exists(_PS_MODULE_DIR_.'everpspopup/views/img/everpopup_' . (int) $everpopup->id . '.jpg')) {
            $background = _PS_BASE_URL_
            . __PS_BASE_URI__
            . 'modules/everpspopup/views/img/everpopup_'
            . (int) $everpopup->id
            . '.jpg';
        } else {
            $background = false;
        }
        $date = strtotime('Y-m-d H:i:s -' . (int) Configuration::get('EVERPSPOPUP_AGE').' year');
        $date = date('Y-m-d H:i:s', $date);
        $everpopup->cookie_suffix = $this->cookie_suffix;
        $this->context->smarty->assign(
            [
                'controller_name' => $controller_name,
                'everpspopup' => $everpopup,
                'content' => $content,
                'id_lang' => $this->context->language->id,
                'background' => $background,
                'ever_ask_age' => (bool) Configuration::get('EVERPSPOPUP_ASK_AGE'),
                'ever_required_age' => $date,
            ]
        );
        return $this->display(__FILE__, 'everpspopup.tpl', $this->getCacheId());
    }

    private function changeShortcodes($message, $id_entity = false)
    {
        $link = new Link();
        $contactLink = $link->getPageLink('contact');
        if ($id_entity) {
            $entity = new Customer((int) $id_entity);
            $gender = new Gender((int) $entity->id_gender, (int) $entity->id_lang);
            $entityShortcodes = [
                '[entity_lastname]' => $entity->lastname,
                '[entity_firstname]' => $entity->firstname,
                '[entity_company]' => $entity->company,
                '[entity_siret]' => $entity->siret,
                '[entity_ape]' => $entity->ape,
                '[entity_birthday]' => $entity->birthday,
                '[entity_website]' => $entity->website,
                '[entity_gender]' => $gender->name,
            ];
        } else {
            $entityShortcodes = [
                '[entity_lastname]' => '',
                '[entity_firstname]' => '',
                '[entity_company]' => '',
                '[entity_siret]' => '',
                '[entity_ape]' => '',
                '[entity_birthday]' => '',
                '[entity_website]' => '',
                '[entity_gender]' => '',
            ];
        }
        $defaultShortcodes = [
            '[shop_url]' => $this->getShopSslUrl(),
            '[shop_name]'=> Configuration::get('PS_SHOP_NAME'),
            '[start_cart_link]' => '<a href="'
            . $this->getShopSslUrl()
            . '/index.php?controller=cart&action=show" rel="nofollow" target="_blank">',
            '[end_cart_link]' => '</a>',
            '[start_shop_link]' => '<a href="'
            . $this->getShopSslUrl()
            . '" target="_blank">',
            '[start_contact_link]' => '<a href="'.$contactLink.'" rel="nofollow" target="_blank">',
            '[end_shop_link]' => '</a>',
            '[end_contact_link]' => '</a>',
            'NULL' => '', // Useful : remove empty strings in case of NULL
            'null' => '', // Useful : remove empty strings in case of null
            'false' => '', // Useful : remove empty strings in case of false
        ];
        $shortcodes = array_merge($entityShortcodes, $defaultShortcodes);
        foreach ($shortcodes as $key => $value) {
            $message = str_replace($key, $value, $message);
        }
        return $message;
    }

    private function createPopupDemo()
    {
        $this->loadModel();
        $shops = Shop::getShops();
        foreach ($shops as $shop) {
            $groups = Group::getGroups(
                (int) Context::getContext()->language->id,
                (int) $shop['id_shop']
            );
            $group_condition = [];
            foreach ($groups as $group) {
                $group_condition[] = (int) $group['id_group'];
            }
            $categories = Category::getSimpleCategories(
                (int) Context::getContext()->language->id
            );
            $category_condition = [];
            foreach ($categories as $category) {
                $category_condition[] = (int) $category['id_category'];
            }
            // Create and save demo popup
            $popup = new EverPsPopupClass();
            $popup->id_shop = (int) $shop['id_shop'];
            $popup->groups = json_encode($group_condition);
            $popup->controller_array = 6;
            $popup->categories = json_encode($category_condition);
            $popup->cookie_time = 0;
            $popup->delay = 5000;
            $popup->active = 1;
            foreach (Language::getLanguages(false) as $language) {
                $popup->name[$language['id_lang']] = $this->l(
                    'Barbara Alvisi'
                );
                $popup->content[$language['id_lang']] = '
                <p class="gucci-everpopup__eyebrow">Newsletter</p>
                <h2 class="gucci-everpopup__title">Resta in contatto</h2>
                <p class="gucci-everpopup__lede">Iscriviti per ricevere novità, collezioni e inviti esclusivi.</p>
                ';
                $popup->link[$language['id_lang']] = '';
            }
            $popup->save();
        }
    }

    public function checkLatestEverModuleVersion($module, $version)
    {
        $upgrade_link = 'https://upgrade.team-ever.com/upgrade.php?module='
        .$module
        .'&version='
        .$version;
        try {
            $handle = curl_init($upgrade_link);
            curl_setopt($handle, CURLOPT_RETURNTRANSFER, true);
            curl_exec($handle);
            $httpCode = curl_getinfo($handle, CURLINFO_HTTP_CODE);
            curl_close($handle);
            if ($httpCode != 200) {
                return false;
            }
            $module_version = $this->fetchRemoteBody($upgrade_link);
            if ($module_version && $module_version > $version) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            PrestaShopLogger::addLog('Unable to check Team Ever latest module version');
        }
    }
}
