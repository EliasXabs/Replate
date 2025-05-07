DELETE FROM users
WHERE email = 'owner@example.com';

SELECT * FROM USERS

SELECT * FROM BUSINESSES

SELECT * FROM menu_items;

SELECT * FROM orders;

SELECT * FROM Order_status;

SELECT * FROM customer_points;

INSERT INTO order_status (id, status_name) VALUES
  (1, 'pending'),
  (2, 'confirmed'),
  (3, 'delivered')
ON CONFLICT DO NOTHING;