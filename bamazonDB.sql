DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE products (
item_id INT NOT NULL AUTO_INCREMENT,
product_name VARCHAR(20) NOT NULL,
department_name VARCHAR(20) NULL,
price DECIMAL(10,2) NULL,
stock_quantity INT NULL,
PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
 VALUES ("Dell Laptop", "Electronics", 500, 25),
 ("Toshiba Laptop", "Electronics", 450, 24),
 ("Sony Laptop", "Electronics", 550, 23),
 ("hp Laptop", "Electronics", 500, 23),
 ("Lenovo Laptop", "Electronics", 600, 24),
 ("Samsung Tablet", "Electronics", 200, 25),
 ("MacBook Air", "Electronics", 1000, 24),
 ("Samsung 55' 4K TV", "TV and Home", 650, 22),
 ("LG 65' 4K TV", "TV and Home", 750, 23),
 ("RCA 55' 4K TV", "TV and Home", 450, 22);
 
 select * from products;
