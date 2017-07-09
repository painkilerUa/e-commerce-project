CREATE DATABASE example_mk CHARACTER SET utf8 COLLATE utf8_general_ci;



CREATE TABLE customers (
id INT(11) NOT NULL AUTO_INCREMENT,
customer_surname VARCHAR(50) DEFAULT NULL,
customer_name VARCHAR(50) DEFAULT NULL,
customer_patronymic VARCHAR(50) DEFAULT NULL,
customer_main_phone BIGINT(12) NOT NULL,
customer_add_phone BIGINT(12) DEFAULT NULL,
customer_add_1_phone BIGINT(12) DEFAULT NULL,
customer_email VARCHAR(50) DEFAULT NULL,
customer_city VARCHAR(20) DEFAULT NULL,
customer_del_name ENUM('new_post', 'intime', 'delivery') DEFAULT NULL,
customer_del_depart_num INT(3) DEFAULT NULL,
customer_local_address VARCHAR(255) DEFAULT NULL,
customer_comment LONGBLOB DEFAULT NULL,
PRIMARY KEY(id)
);

CREATE TABLE orders (
id INT(11) NOT NULL AUTO_INCREMENT,
order_user_id INT(11) NOT NULL,
order_del_city VARCHAR(50) NOT NULL,
order_del_depart_num INT(3) DEFAULT NULL,
order_del_address VARCHAR(255) DEFAULT NULL,
order_date BIGINT(13) NOT NULL,
order_status ENUM('created') NOT NULL,
order_status_date BIGINT(13) NOT NULL,
order_tracking_num BIGINT(13) DEFAULT NULL,
order_is_notificated BIT NOT NULL DEFAULT 0,
PRIMARY KEY(id)
);

ORDERS
id
order_user_id
order_del_city
order_del_depart_num
order_del_address
order_date
order_status
order_status_date
order_tracking_num
order_is_notificated

ORDERDETAIL
id
detail_order_id
detail_product_id
detail_sell_price
detail_bought_price
detail_quantity



PRODUCTS
id
price
quantity


CREATE TABLE authorization (
    id INT(11) NOT NULL AUTO_INCREMENT,
    login VARCHAR(30) NOT NULL,
    hash VARCHAR(255) NOT NULL,
    role ENUM('manager', 'm_manager'),
    PRIMARY KEY(id),
    UNIQUE (login)
);

// INSERT INTO authorization (login, hash, role) VALUES ('painkiller', '226607400fd9f34913bd3fc8c8345de21f4097b1f9071e6de0b668fb75802c28', 'm_manager')
INSERT INTO authorization (login, hash, role) VALUES ('insolent', '14bc3c2f3e3254b8054cd8218f9344f712ffb33b92cdaa90706adbdde9c2af22', 'manager')
//ignat93
//9379992



CREATE DATABASE test CHARACTER SET utf8 COLLATE utf8_general_ci;

CREATE TABLE products (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price FLOAT (7,2) UNSIGNED NOT NULL,
    purchase_price FLOAT (6,2) UNSIGNED DEFAULT NULL,
    status BIT NOT NULL DEFAULT 1,
    meta_title VARCHAR(255) DEFAULT NULL,
    product_url VARCHAR(255) NOT NULL DEFAULT '',
    img_url VARCHAR(255) NOT NULL DEFAULT '',
    quantity INT(3) UNSIGNED NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    category_id INT(11) UNSIGNED NOT NULL,
    attr_type VARCHAR(40) DEFAULT NULL,
    attr_manufacturer VARCHAR(40) DEFAULT NULL,
    attr_vid VARCHAR(40) DEFAULT NULL,
    attr_sae VARCHAR(10) DEFAULT NULL,
    attr_capacity FLOAT (10,3) UNSIGNED DEFAULT NULL,
    attr_color VARCHAR(20) DEFAULT NULL,
    attr_antifreeze_class VARCHAR(20) DEFAULT NULL,
    update_time BIGINT(13) UNSIGNED Default NULL,
    provider_num INT(3) UNSIGNED Default NULL,
    CONSTRAINT pkId PRIMARY KEY (id),
    INDEX index_cat_id (category_id),
    INDEX product_url (category_id),
    CONSTRAINT UKVendor UNIQUE KEY (vendor)
);
// ENGINE = MYISAM;

INSERT INTO products (name, short_description, description, price, img_url, quantity, vendor, category_id, attr_type, attr_manufacturer, attr_vid, attr_sae, attr_capacity)
    VALUES ('Масло Aral HighTronic 5W-40 1л', '', '', 152, '/static/catalog/1/aral/20478.jpg', 9, 'a001', 1,'engoil', 'aral', 'synth', '5w40', '1'),
            ('Масло Aral SuperTronic Longlife III 5W-30 4л', '', '', 135, '/static/catalog/1/aral/20478.jpg', 9, 'a002', 1,'engoil', 'aral', 'synth', '5w30', '4'),
            ('Масло Elf EVOLUTION 900 NF 5W-40 5л', '', '', 100, '/static/catalog/1/aral/20478.jpg', 9, 'a003', 1,'engoil', 'elf', 'synth', '5w40', '5'),
            ('Масло Elf Evolution 900 SXR 5W-30 5л', '', '', 105, '/static/catalog/1/aral/20478.jpg', 9, 'a004', 1,'engoil', 'elf', 'synth', '5w30', '5'),
            ('Масло GM Dexos 2 Longlife 5W-30 5л', '', '', 92, '/static/catalog/1/aral/20478.jpg', 9, 'a005', 1,'engoil', 'gm', 'synth', '5w30', '5'),
            ('Масло Total Quartz 7000 10W-40 5л', '', '', 92, '/static/catalog/1/aral/20478.jpg', 9, 'a006', 1,'engoil', 'total', 'semisynth', '10w40', '5');

CREATE TABLE import (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    description TEXT NOT NULL,
    price FLOAT (7,2) UNSIGNED NOT NULL,
    purchase_price FLOAT (6,2) UNSIGNED DEFAULT NULL,
    status BIT NOT NULL DEFAULT 1,
    meta_title VARCHAR(255) DEFAULT NULL,
    product_url VARCHAR(255) NOT NULL DEFAULT '',
    img_url VARCHAR(255) NOT NULL DEFAULT '',
    quantity INT(3) UNSIGNED NOT NULL,
    vendor VARCHAR(255) NOT NULL,
    category_id INT(11) UNSIGNED NOT NULL,
    attr_type VARCHAR(40) DEFAULT NULL,
    attr_manufacturer VARCHAR(40) DEFAULT NULL,
    attr_vid VARCHAR(40) DEFAULT NULL,
    attr_sae VARCHAR(10) DEFAULT NULL,
    attr_capacity FLOAT (10,3) UNSIGNED DEFAULT NULL,
    attr_color VARCHAR(20) DEFAULT NULL,
    attr_antifreeze_class VARCHAR(20) DEFAULT NULL,
    CONSTRAINT pkId PRIMARY KEY (id)
);
CREATE TABLE orders (
    id INT(11) UNSIGNED NOT NULL AUTO_INCREMENT,
    products_name TEXT NOT NULL,
    products_quantity TEXT NOT NULL,
    products_price TEXT NOT NULL,
    last_name VARCHAR(40) NOT NULL,
    first_name VARCHAR(40) NOT NULL,
    surname_name VARCHAR(40) DEFAULT NULL,
    phone_number VARCHAR(20) NOT NULL,
    is_pikup_from_ofice VARCHAR(10) DEFAULT NULL,
    is_local_delivery VARCHAR(10) DEFAULT NULL,
    adress_in_kharkiv VARCHAR(255) DEFAULT NULL,
    is_delivery_transport_company VARCHAR(10) DEFAULT NULL,
    city_name VARCHAR(40) DEFAULT NULL,
    carrier VARCHAR(40) DEFAULT NULL,
    carrier_num_office VARCHAR(10) DEFAULT NULL,CREATE TABLE general_information (
    id INT(3) UNSIGNED NOT NULL AUTO_INCREMENT,
    last_update_products TIMESTAMP(6),
    CONSTRAINT pkId PRIMARY KEY (id)
);
    comment TEXT NOT NULL,
    CONSTRAINT pkId PRIMARY KEY (id)
);


INSERT INTO products (provider_num, attr_color, short_description, quantity, meta_title, attr_manufacturer, description, img_url, category_id, attr_sae, attr_capacity, vendor, attr_antifreeze_class, name, attr_vid, purchase_price, price, update_time, status, attr_type, product_url) VALUES ('2', '', '', '0', '', '', '', '', 0, '', '', 'ssss45', '', 'Шестеренка задней полуоси', '', '100', '149', '', '0', '', 'ssss45');