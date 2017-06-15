var main = require('./main'),
    config = require('../config'),
    error404 = require('./error404'),
    getModels = require('./getModels'),
    getTypes = require('./getTypes'),
    catalog = require('./catalog'),
    catalog_section = require('./catalog_section'),
    catalog_category_products = require ('./catalog_category_products'),
    simple_products_list_filtered = require ('./simple_products_list_filtered'),
    getAutoMasla = require ('./catalog_auto_masla'),
    getAutoMaslaFilter = require ('./catalog_auto_masla_filter'),
    getAntifreeze = require ('./catalog_antifreeze'),
    getAntifreezeFilter = require('./catalog_antifreeze_filter'),
    getWasherliquid = require('./catalog_washerliquid'),
    getWasherliquideFilter = require('./catalog_washerliquid_filter'),
    getMaslyaniiFiltr = require('./catalog/maintenance/catalog-maslyanii-filter'),
    getMaslyaniiFiltrFilter = require('./catalog/maintenance/catalog-maslyanii-filter-filter'),
    getVozdyshniiFiltr = require('./catalog/maintenance/catalog-vozdyshnii-filter'),
    getVozdyshniiFiltrFilter = require('./catalog/maintenance/catalog-vozdyshnii-filter-filter'),
    getToplivniiFiltr = require('./catalog/maintenance/catalog-toplivnii-filter'),
    getToplivniiFiltrFilter = require('./catalog/maintenance/catalog-toplivnii-filter-filter'),
    getFilterSalona = require('./catalog/maintenance/catalog-filtr-salona'),
    getFilterSalonaFilter = require('./catalog/maintenance/catalog-filtr-salona-filter'),
    getRemenGRM = require('./catalog/engine/catalog-remen-grm'),
    getRemenGRMFilter = require('./catalog/engine/catalog-remen-grm-filter'),
    getRemenGeneratora = require('./catalog/engine/catalog-remen-generatora'),
    getRemenGeneratoraFilter = require('./catalog/engine/catalog-remen-generatora-filter'),
    getBoltGBC = require('./catalog/engine/catalog-bolt-gbc'),
    getBoltGBCFilter = require('./catalog/engine/catalog-bolt-gbc-filter'),
    getTormoznoyDisk = require('./catalog/brake-system/catalog-tormoznoy-disk'),
    getTormoznoyDiskFilter = require('./catalog/brake-system/catalog-tormoznoy-disk-filter'),
    getTormoznyieKolodki = require('./catalog/brake-system/catalog-tormoznyie-kolodki'),
    getTormoznyieKolodkiFilter = require('./catalog/brake-system/catalog-tormoznyie-kolodki-filter'),
    getTormoznyieKolodkiBaraban = require('./catalog/brake-system/catalog-tormoznyie-kolodki-baraban'),
    getTormoznyieKolodkiBarabanFilter = require('./catalog/brake-system/catalog-tormoznyie-kolodki-baraban-filter'),
    getRabochiiTormoznoiCilindr = require('./catalog/brake-system/catalog-rabochii-tormoznoi-cilindr'),
    getRabochiiTormoznoiCilindrFilter = require('./catalog/brake-system/catalog-rabochii-tormoznoi-cilindr-filter'),
    getGlavniiTormoznoiCilindr = require('./catalog/brake-system/catalog-glavnii-tormoznoi-cilindr'),
    getGlavniiTormoznoiCilindrFilter = require('./catalog/brake-system/catalog-glavnii-tormoznoi-cilindr-filter'),
    getAmortizator = require('./catalog/suspension/catalog-amortizator'),
    getAmortizatorFilter = require('./catalog/suspension/catalog-amortizator-filter'),
    getSharovayaOpora = require('./catalog/suspension/catalog-sharovaya-opora'),
    getSharovayaOporaFilter = require('./catalog/suspension/catalog-sharovaya-opora-filter'),
    getPyilnikAmortizatora = require('./catalog/suspension/catalog-pyilnik-amortizatora'),
    getPyilnikAmortizatoraFilter = require('./catalog/suspension/catalog-pyilnik-amortizatora-filter'),
    getSaylentblokRyichaga = require('./catalog/suspension/catalog-saylentblok-ryichaga'),
    getSaylentblokRyichagaFilter = require('./catalog/suspension/catalog-saylentblok-ryichaga-filter'),
    getKomplektScepleniya = require('./catalog/transmission/catalog-komplekt-scepleniya'),
    getKomplektScepleniyaFilter = require('./catalog/transmission/catalog-komplekt-scepleniya-filter'),
    getShrys = require('./catalog/transmission/catalog-shrys'),
    getShrysFilter = require('./catalog/transmission/catalog-shrys-filter'),
    getPolyos = require('./catalog/transmission/catalog-polyos'),
    getPolyosFilter = require('./catalog/transmission/catalog-polyos-filter'),
    getTermostat = require('./catalog/cooling/catalog-termostat'),
    getTermostatFilter = require('./catalog/cooling/catalog-termostat-filter'),



    getProductByUrl = require ('./productCard'),
    getProductsCart = require ('./productsCart'),
    getCartOrder = require ('./cartOrder'),
    getMainSearch = require ('./mainSearch'),
    getStatPageKontakti = require('./statik_page/kontakti'),
    getStatPageOplataIdostavka = require('./statik_page/oplata-i-dostavka')
    getStatPageGarantiya = require('./statik_page/garantiya');

    // Admin part
    getAdminIndex = require('./admin/index'),
    getAdminImport = require('./admin/import'),
    getAdminImportBusmarket = require('./admin/import-busmarket'),
    getAdminImportOil = require('./admin/import-oil'),
    getAdminImportAntifreeze = require('./admin/import-antifreeze'),
    getAdminImportSomePart = require('./admin/import-busmarket-ajax'),
    getAdminImportOilSomePart = require('./admin/import-oil-ajax'),
    getAdminImportAntifreezeAJAX = require('./admin/import-antifreeze-ajax'),
    getAdminImportWasherliquid = require('./admin/import-washerliquid'),
    getAdminImportWasherliquidAJAX = require('./admin/import-washerliquid-ajax'),
    getAdminImportOmegaautopostavka = require('./admin/import/import-omegaautopostavka'),
    getAdminImportOmegaautopostavkaAJAX = require('./admin/import/import-omegaautopostavka-ajax'),
    getOrdersList = require('./admin/orders-list'),
    getOrderById = require('./admin/order-details'),
    getProductsList = require('./admin/products-list'),
    editProductById = require('./admin/product-description'),
    editProductHendlingForm = require('./admin/edit-product-hendling-form'),
    getYMLExportSettings = require('./admin/yml-export-settings'),
    getYMLExportFileId1 = require('./admin/yml_export/yml-export-file-id-1'),
    getGAdwords1 = require('./admin/g_adwords/g-adwords-1'),
    getGeneralInformation = require('./admin/general-imformation');
    getCabinet = require('./admin/cabinet');
    getCabinetAJAX = require('./admin/cabinet-ajax')
    adminAPI = require('./admin/api')
    getAdminIndexSPA = require('./admin/index-spa')

module.exports = function (app) {

    app.get('/', main);
    app.post('/get-models', getModels);
    app.post('/get-types', getTypes);
    app.get('/car/:type_id', catalog);
    app.get('/car/:type_id/:catalog_section', catalog_section);
    app.get('/car/:type_id/:catalog_section/:lat_ga_id', catalog_category_products);
    app.get('/car/:type_id/:catalog_section/:lat_ga_id/sim-prod-filter', simple_products_list_filtered);
    app.get('/catalog/avtomobilnye-masla', getAutoMasla);
    app.get('/catalog/avtomobilnye-masla/:auto_oil_url', getAutoMaslaFilter);
    app.get('/catalog/antifreeze/', getAntifreeze);
    app.get('/catalog/antifreeze/filter', getAntifreezeFilter);
    app.get('/catalog/washerliquid/', getWasherliquid);
    app.get('/catalog/washerliquid/filter', getWasherliquideFilter);
    app.get('/catalog/maslyanii-filtr/', getMaslyaniiFiltr);
    app.get('/catalog/maslyanii-filtr/:manufacturers_url', getMaslyaniiFiltrFilter);
    app.get('/catalog/vozdyshnii-filtr/', getVozdyshniiFiltr);
    app.get('/catalog/vozdyshnii-filtr/:manufacturers_url', getVozdyshniiFiltrFilter);
    app.get('/catalog/toplivnii-filtr/', getToplivniiFiltr);
    app.get('/catalog/toplivnii-filtr/:manufacturers_url', getToplivniiFiltrFilter);
    app.get('/catalog/filtr-salona/', getFilterSalona);
    app.get('/catalog/filtr-salona/:manufacturers_url', getFilterSalonaFilter);
    app.get('/catalog/remen-grm/', getRemenGRM);
    app.get('/catalog/remen-grm/:manufacturers_url', getRemenGRMFilter);
    app.get('/catalog/remen-generatora/', getRemenGeneratora);
    app.get('/catalog/remen-generatora/:manufacturers_url', getRemenGeneratoraFilter);
    app.get('/catalog/bolt-golovki-bloka-cilindrov/', getBoltGBC),
    app.get('/catalog/bolt-golovki-bloka-cilindrov/:manufacturers_url', getBoltGBCFilter);
    app.get('/catalog/tormoznoy-disk/', getTormoznoyDisk);
    app.get('/catalog/tormoznoy-disk/:manufacturers_url', getTormoznoyDiskFilter);
    app.get('/catalog/tormoznyie-kolodki/', getTormoznyieKolodki);
    app.get('/catalog/tormoznyie-kolodki/:manufacturers_url', getTormoznyieKolodkiFilter);
    app.get('/catalog/tormoznyie-kolodki-baraban/', getTormoznyieKolodkiBaraban);
    app.get('/catalog/tormoznyie-kolodki-baraban/:manufacturers_url', getTormoznyieKolodkiBarabanFilter);
    app.get('/catalog/rabochii-tormoznoi-cilindr/', getRabochiiTormoznoiCilindr);
    app.get('/catalog/rabochii-tormoznoi-cilindr/:manufacturers_url', getRabochiiTormoznoiCilindrFilter);
    app.get('/catalog/glavnii-tormoznoi-cilindr/', getGlavniiTormoznoiCilindr);
    app.get('/catalog/glavnii-tormoznoi-cilindr/:manufacturers_url', getGlavniiTormoznoiCilindrFilter);
    app.get('/catalog/amortizator/', getAmortizator);
    app.get('/catalog/amortizator/:manufacturers_url', getAmortizatorFilter);
    app.get('/catalog/sharovaya-opora/', getSharovayaOpora);
    app.get('/catalog/sharovaya-opora/:manufacturers_url', getSharovayaOporaFilter);
    app.get('/catalog/pyilnik-amortizatora/', getPyilnikAmortizatora);
    app.get('/catalog/pyilnik-amortizatora/:manufacturers_url', getPyilnikAmortizatoraFilter);
    app.get('/catalog/saylentblok-ryichaga/', getSaylentblokRyichaga);
    app.get('/catalog/saylentblok-ryichaga/:manufacturers_url', getSaylentblokRyichagaFilter);
    app.get('/catalog/komplekt-scepleniya/', getKomplektScepleniya);
    app.get('/catalog/komplekt-scepleniya/:manufacturers_url', getKomplektScepleniyaFilter);
    app.get('/catalog/shrys/', getShrys);
    app.get('/catalog/shrys/:manufacturers_url', getShrysFilter);
    app.get('/catalog/polyos/', getPolyos);
    app.get('/catalog/polyos/:manufacturers_url', getPolyosFilter);
    app.get('/catalog/termostat/', getTermostat);
    app.get('/catalog/termostat/:manufacturers_url', getTermostatFilter);



    app.get('/products/:product_url', getProductByUrl);
    app.get('/cart', getProductsCart);
    app.post('/cart/success/', getCartOrder);
    app.get('/search', getMainSearch);
    app.get('/kontakti/', getStatPageKontakti);
    app.get('/oplata-i-dostavka/', getStatPageOplataIdostavka);
    app.get('/garantiya/', getStatPageGarantiya);
// Admin part
    app.get('/' + config.get('admin_spa_url') + '/', getAdminIndexSPA);
    app.get('/'+ config.get('admin_url') + '/', getAdminIndex);
    app.get('/'+ config.get('admin_url') + '/import', getAdminImport);
    app.get('/'+ config.get('admin_url') + '/import/busmarket', getAdminImportBusmarket);
    app.get('/'+ config.get('admin_url') + '/import/busmarket/:id_part', getAdminImportSomePart);
    app.get('/'+ config.get('admin_url') + '/import/oil', getAdminImportOil);
    app.get('/'+ config.get('admin_url') + '/import/oil/:id_part', getAdminImportOilSomePart);
    app.get('/'+ config.get('admin_url') + '/import/antifreeze/', getAdminImportAntifreeze);
    app.get('/'+ config.get('admin_url') + '/import/antifreeze/ajax/', getAdminImportAntifreezeAJAX);
    app.get('/'+ config.get('admin_url') + '/import/washerliquid/', getAdminImportWasherliquid);
    app.get('/'+ config.get('admin_url') + '/import/washerliquid/ajax/', getAdminImportWasherliquidAJAX);
    app.get('/'+ config.get('admin_url') + '/import/omegaautopostavka/', getAdminImportOmegaautopostavka);
    app.get('/'+ config.get('admin_url') + '/import/omegaautopostavka/:id_part', getAdminImportOmegaautopostavkaAJAX);
    app.get('/'+ config.get('admin_url') + '/orders/', getOrdersList);
    app.get('/'+ config.get('admin_url') + '/orders/:order_id', getOrderById);
    app.get('/'+ config.get('admin_url') + '/catalog/', getProductsList);
    app.get('/'+ config.get('admin_url') + '/catalog/:product_id', editProductById);
    app.post('/'+ config.get('admin_url') + '/catalog/:product_id/edit', editProductHendlingForm);
    app.get('/'+ config.get('admin_url') + '/yexport/', getYMLExportSettings);
    app.get('/'+ config.get('admin_url') + '/general-imformation/', getGeneralInformation);
    app.get('/'+ config.get('admin_url') + '/cabinet/', getCabinet);
    app.get('/'+ config.get('admin_url') + '/cabinet/ajax', getCabinetAJAX);
// Admin API
    adminAPI(app)
// YML Export part
    app.get('/yexport/file/id/1', getYMLExportFileId1);
// Google Adwords
    app.get('/gadwords/1', getGAdwords1);
// 404 error hendling
    app.get('*', error404);
}