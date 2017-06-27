CREATE DATABASE example_mk CHARACTER SET utf8 COLLATE utf8_general_ci;



CREATE TABLE customers (
id INT(11) NOT NULL AUTO_INCREMENT,
customer_surname VARCHAR(50),
customer_name VARCHAR(50),
customer_patronymic VARCHAR(50),
customer_main_phone BIGINT(12) NOT NULL,
customer_add_phone BIGINT(12),
customer_add_1_phone BIGINT(12),
customer_email VARCHAR(50),
customer_city VARCHAR(20),
customer_del_name ENUM('new_post', 'intime', 'delivery'),
customer_del_depart_num INT(3),
customer_local_address VARCHAR(255),
customer_comment LONGBLOB,
PRIMARY KEY(id)
);

customers
id
          customer_surname: '',
          customer_name: '',
          customer_patronymic: '',
          customer_main_phone: '',
          customer_add_phone: '',
          customer_add_1_phone: '',
          customer_email: '',
          customer_city: '',
          customer_del_name: '',
          customer_del_depart_num: '',
          customer_local_address: '',
          customer_comment: ''


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