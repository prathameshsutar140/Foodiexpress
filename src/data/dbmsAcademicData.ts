export interface SqlQueryExample {
  id: string;
  category: 'DDL' | 'DML' | 'SELECT & CLAUSES' | 'JOINS' | 'AGGREGATES' | 'SUBQUERIES' | 'VIEWS' | 'INDEXES' | 'PROCEDURES & TRIGGERS' | 'TRANSACTIONS';
  title: string;
  description: string;
  sql: string;
  explanation: string;
  executionTimeMs: number;
  columns: string[];
  rows: (string | number)[][];
}

export interface ERDEntity {
  name: string;
  tableName: string;
  primaryKey: string;
  foreignKeys: { field: string; references: string }[];
  attributes: { name: string; type: string; constraints: string }[];
  color: string;
}

export const DBMS_ERD_ENTITIES: ERDEntity[] = [
  {
    name: 'User',
    tableName: 'users',
    primaryKey: 'user_id',
    foreignKeys: [],
    attributes: [
      { name: 'user_id', type: 'VARCHAR(128)', constraints: 'PK, NOT NULL' },
      { name: 'email', type: 'VARCHAR(128)', constraints: 'UNIQUE, NOT NULL' },
      { name: 'display_name', type: 'VARCHAR(128)', constraints: 'NOT NULL' },
      { name: 'phone', type: 'VARCHAR(20)', constraints: 'NULL' },
      { name: 'role', type: 'ENUM(...)', constraints: 'DEFAULT "customer"' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' },
    ],
    color: 'from-amber-500 to-orange-600',
  },
  {
    name: 'Restaurant',
    tableName: 'restaurants',
    primaryKey: 'restaurant_id',
    foreignKeys: [{ field: 'owner_id', references: 'users(user_id)' }],
    attributes: [
      { name: 'restaurant_id', type: 'VARCHAR(64)', constraints: 'PK, NOT NULL' },
      { name: 'name', type: 'VARCHAR(128)', constraints: 'NOT NULL' },
      { name: 'cuisine_type', type: 'VARCHAR(100)', constraints: 'NOT NULL' },
      { name: 'rating', type: 'DECIMAL(2,1)', constraints: 'CHECK(rating >= 0 AND rating <= 5)' },
      { name: 'is_open', type: 'BOOLEAN', constraints: 'DEFAULT TRUE' },
      { name: 'delivery_time_min', type: 'INT', constraints: 'NOT NULL' },
      { name: 'owner_id', type: 'VARCHAR(128)', constraints: 'FK -> users' },
    ],
    color: 'from-emerald-500 to-teal-600',
  },
  {
    name: 'Food Item',
    tableName: 'food_items',
    primaryKey: 'item_id',
    foreignKeys: [{ field: 'restaurant_id', references: 'restaurants(restaurant_id)' }],
    attributes: [
      { name: 'item_id', type: 'VARCHAR(64)', constraints: 'PK, NOT NULL' },
      { name: 'restaurant_id', type: 'VARCHAR(64)', constraints: 'FK, NOT NULL' },
      { name: 'name', type: 'VARCHAR(128)', constraints: 'NOT NULL' },
      { name: 'price', type: 'DECIMAL(10,2)', constraints: 'CHECK(price > 0)' },
      { name: 'category', type: 'VARCHAR(64)', constraints: 'NOT NULL' },
      { name: 'is_veg', type: 'BOOLEAN', constraints: 'NOT NULL' },
      { name: 'is_available', type: 'BOOLEAN', constraints: 'DEFAULT TRUE' },
    ],
    color: 'from-blue-500 to-cyan-600',
  },
  {
    name: 'Order',
    tableName: 'orders',
    primaryKey: 'order_id',
    foreignKeys: [
      { field: 'customer_id', references: 'users(user_id)' },
      { field: 'restaurant_id', references: 'restaurants(restaurant_id)' },
      { field: 'delivery_partner_id', references: 'delivery_partners(partner_id)' },
    ],
    attributes: [
      { name: 'order_id', type: 'VARCHAR(64)', constraints: 'PK, NOT NULL' },
      { name: 'customer_id', type: 'VARCHAR(128)', constraints: 'FK, NOT NULL' },
      { name: 'restaurant_id', type: 'VARCHAR(64)', constraints: 'FK, NOT NULL' },
      { name: 'subtotal', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'tax', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'delivery_fee', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'discount', type: 'DECIMAL(10,2)', constraints: 'DEFAULT 0.00' },
      { name: 'total_amount', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'status', type: 'ENUM(...)', constraints: 'NOT NULL' },
      { name: 'payment_status', type: 'ENUM(...)', constraints: 'DEFAULT "pending"' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' },
    ],
    color: 'from-purple-500 to-indigo-600',
  },
  {
    name: 'Order Item',
    tableName: 'order_items',
    primaryKey: 'order_item_id',
    foreignKeys: [
      { field: 'order_id', references: 'orders(order_id)' },
      { field: 'food_item_id', references: 'food_items(item_id)' },
    ],
    attributes: [
      { name: 'order_item_id', type: 'BIGINT AUTO_INCREMENT', constraints: 'PK, NOT NULL' },
      { name: 'order_id', type: 'VARCHAR(64)', constraints: 'FK, NOT NULL' },
      { name: 'food_item_id', type: 'VARCHAR(64)', constraints: 'FK, NOT NULL' },
      { name: 'quantity', type: 'INT', constraints: 'CHECK(quantity > 0)' },
      { name: 'unit_price', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'item_total', type: 'DECIMAL(10,2)', constraints: 'GENERATED / NOT NULL' },
    ],
    color: 'from-pink-500 to-rose-600',
  },
  {
    name: 'Delivery Partner',
    tableName: 'delivery_partners',
    primaryKey: 'partner_id',
    foreignKeys: [{ field: 'user_id', references: 'users(user_id)' }],
    attributes: [
      { name: 'partner_id', type: 'VARCHAR(64)', constraints: 'PK, NOT NULL' },
      { name: 'name', type: 'VARCHAR(128)', constraints: 'NOT NULL' },
      { name: 'phone', type: 'VARCHAR(20)', constraints: 'UNIQUE, NOT NULL' },
      { name: 'vehicle_type', type: 'VARCHAR(50)', constraints: 'NOT NULL' },
      { name: 'rating', type: 'DECIMAL(2,1)', constraints: 'DEFAULT 5.0' },
      { name: 'status', type: 'ENUM("available","busy","offline")', constraints: 'DEFAULT "available"' },
    ],
    color: 'from-violet-500 to-purple-700',
  },
  {
    name: 'Review',
    tableName: 'reviews',
    primaryKey: 'review_id',
    foreignKeys: [
      { field: 'restaurant_id', references: 'restaurants(restaurant_id)' },
      { field: 'customer_id', references: 'users(user_id)' },
      { field: 'order_id', references: 'orders(order_id)' },
    ],
    attributes: [
      { name: 'review_id', type: 'VARCHAR(64)', constraints: 'PK, NOT NULL' },
      { name: 'restaurant_id', type: 'VARCHAR(64)', constraints: 'FK, NOT NULL' },
      { name: 'customer_id', type: 'VARCHAR(128)', constraints: 'FK, NOT NULL' },
      { name: 'rating', type: 'INT', constraints: 'CHECK(rating BETWEEN 1 AND 5)' },
      { name: 'comment', type: 'TEXT', constraints: 'NULL' },
      { name: 'created_at', type: 'TIMESTAMP', constraints: 'DEFAULT CURRENT_TIMESTAMP' },
    ],
    color: 'from-yellow-500 to-amber-600',
  },
  {
    name: 'Coupon',
    tableName: 'coupons',
    primaryKey: 'coupon_code',
    foreignKeys: [],
    attributes: [
      { name: 'coupon_code', type: 'VARCHAR(30)', constraints: 'PK, NOT NULL' },
      { name: 'discount_percent', type: 'DECIMAL(5,2)', constraints: 'CHECK(discount_percent <= 100)' },
      { name: 'max_discount', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'min_order_amount', type: 'DECIMAL(10,2)', constraints: 'NOT NULL' },
      { name: 'is_active', type: 'BOOLEAN', constraints: 'DEFAULT TRUE' },
      { name: 'expiry_date', type: 'DATE', constraints: 'NOT NULL' },
    ],
    color: 'from-red-500 to-orange-600',
  },
];

export const DBMS_SQL_QUERIES: SqlQueryExample[] = [
  {
    id: 'q1',
    category: 'JOINS',
    title: '3-Table INNER JOIN: Comprehensive Order Details',
    description: 'Combines Orders, Customer Profiles, and Restaurants with computed item counts and total spend.',
    sql: `SELECT 
    o.order_id,
    u.display_name AS customer_name,
    u.phone AS customer_phone,
    r.name AS restaurant_name,
    r.city,
    o.total_amount,
    o.status,
    o.payment_status
FROM orders o
INNER JOIN users u ON o.customer_id = u.user_id
INNER JOIN restaurants r ON o.restaurant_id = r.restaurant_id
ORDER BY o.created_at DESC
LIMIT 5;`,
    explanation: 'Performs relational joining over Foreign Key references (orders.customer_id -> users.user_id and orders.restaurant_id -> restaurants.restaurant_id) to reconstruct customer order details without data redundancy.',
    executionTimeMs: 1.8,
    columns: ['order_id', 'customer_name', 'customer_phone', 'restaurant_name', 'city', 'total_amount', 'status', 'payment_status'],
    rows: [
      ['ORD-98214', 'Aarav Mehta', '+91 98199 88776', 'The Royal Biryani Durbar', 'Mumbai', '₹1,267.00', 'out_for_delivery', 'completed'],
      ['ORD-98188', 'Aarav Mehta', '+91 98199 88776', 'Firehouse Smash Burgers', 'Mumbai', '₹605.00', 'delivered', 'completed'],
      ['ORD-98150', 'Sneha Patil', '+91 97654 32100', 'Bella Napoli Pizzeria', 'Mumbai', '₹1,048.00', 'delivered', 'completed'],
      ['ORD-98122', 'Rohan Verma', '+91 98221 44556', 'Kyoto Zen Sushi House', 'Mumbai', '₹918.00', 'delivered', 'completed'],
      ['ORD-98099', 'Vikram Seth', '+91 99300 22114', 'Green Harvest Bowls', 'Mumbai', '₹658.00', 'delivered', 'completed'],
    ],
  },
  {
    id: 'q2',
    category: 'AGGREGATES',
    title: 'GROUP BY & HAVING: High-Performing Restaurants',
    description: 'Calculates total revenue, order count, and average order value per restaurant, filtering only those with > ₹500 avg spend.',
    sql: `SELECT 
    r.restaurant_id,
    r.name AS restaurant_name,
    COUNT(o.order_id) AS total_orders,
    ROUND(SUM(o.total_amount), 2) AS gross_revenue,
    ROUND(AVG(o.total_amount), 2) AS avg_order_value,
    r.rating
FROM restaurants r
LEFT JOIN orders o ON r.restaurant_id = o.restaurant_id
GROUP BY r.restaurant_id, r.name, r.rating
HAVING COUNT(o.order_id) >= 1 AND AVG(o.total_amount) > 500
ORDER BY gross_revenue DESC;`,
    explanation: 'Demonstrates aggregate functions SUM(), AVG(), and COUNT() grouped by restaurant ID. The HAVING clause applies post-aggregation criteria, which is a key concept in relational database query optimization.',
    executionTimeMs: 2.3,
    columns: ['restaurant_id', 'restaurant_name', 'total_orders', 'gross_revenue', 'avg_order_value', 'rating'],
    rows: [
      ['rest-1', 'The Royal Biryani Durbar', 142, '₹1,42,890.00', '₹1,006.26', '4.8 ⭐'],
      ['rest-3', 'Bella Napoli Woodfired Pizzeria', 98, '₹94,080.00', '₹960.00', '4.9 ⭐'],
      ['rest-4', 'Kyoto Zen Sushi & Ramen House', 64, '₹58,752.00', '₹918.00', '4.6 ⭐'],
      ['rest-2', 'Firehouse Smash Burgers', 189, '₹1,14,345.00', '₹605.00', '4.7 ⭐'],
    ],
  },
  {
    id: 'q3',
    category: 'SUBQUERIES',
    title: 'Correlated Subquery: Premium Dishes Above Category Average',
    description: 'Identifies luxury dishes whose price exceeds the average price of their specific culinary category.',
    sql: `SELECT 
    f.name AS dish_name,
    f.category,
    f.price AS dish_price,
    ROUND(cat_avg.avg_category_price, 2) AS category_avg_price,
    ROUND(f.price - cat_avg.avg_category_price, 2) AS price_premium
FROM food_items f
INNER JOIN (
    SELECT category, AVG(price) AS avg_category_price
    FROM food_items
    GROUP BY category
) cat_avg ON f.category = cat_avg.category
WHERE f.price > cat_avg.avg_category_price
ORDER BY price_premium DESC;`,
    explanation: 'Demonstrates an inline view / derived table subquery to calculate category benchmarks and filter outer records based on dynamic thresholds.',
    executionTimeMs: 1.5,
    columns: ['dish_name', 'category', 'dish_price', 'category_avg_price', 'price_premium'],
    rows: [
      ['Burrata & Truffle Pesto Pizza (12-inch)', 'Pizza', '₹549.00', '₹524.00', '+₹25.00'],
      ['Hyderabadi Dum Gosht Biryani', 'Biryani', '₹449.00', '₹379.00', '+₹70.00'],
      ['Truffle Double Angus Smash Burger', 'Burgers', '₹349.00', '₹309.00', '+₹40.00'],
      ['Flamed Salmon Aburi Nigiri & Maki', 'Sushi', '₹489.00', '₹459.00', '+₹30.00'],
    ],
  },
  {
    id: 'q4',
    category: 'VIEWS',
    title: 'SQL View Definition: Real-Time Restaurant Sales Leaderboard',
    description: 'Encapsulates complex multi-table analytics into an indexed virtual table for fast dashboard reporting.',
    sql: `CREATE OR REPLACE VIEW vw_restaurant_performance AS
SELECT 
    r.restaurant_id,
    r.name,
    r.cuisine_type,
    r.rating,
    COUNT(DISTINCT o.order_id) AS orders_fulfilled,
    COALESCE(SUM(o.total_amount), 0) AS total_sales,
    COUNT(DISTINCT rev.review_id) AS total_reviews,
    r.is_open
FROM restaurants r
LEFT JOIN orders o ON r.restaurant_id = o.restaurant_id AND o.status = 'delivered'
LEFT JOIN reviews rev ON r.restaurant_id = rev.restaurant_id
GROUP BY r.restaurant_id, r.name, r.cuisine_type, r.rating, r.is_open;

-- Querying the newly created view:
SELECT * FROM vw_restaurant_performance ORDER BY total_sales DESC;`,
    explanation: 'Views provide data abstraction, logical independence, and security by exposing pre-computed metrics without granting direct table alteration privileges to presentation layers.',
    executionTimeMs: 0.9,
    columns: ['restaurant_id', 'name', 'cuisine_type', 'rating', 'orders_fulfilled', 'total_sales', 'total_reviews', 'is_open'],
    rows: [
      ['rest-1', 'The Royal Biryani Durbar', 'Biryani, Mughlai', '4.8', 138, '₹1,38,890.00', 1420, 'Open (1)'],
      ['rest-2', 'Firehouse Smash Burgers', 'Burgers, American', '4.7', 182, '₹1,10,110.00', 980, 'Open (1)'],
      ['rest-3', 'Bella Napoli Pizzeria', 'Pizza, Italian', '4.9', 94, '₹90,240.00', 2150, 'Open (1)'],
      ['rest-4', 'Kyoto Zen Sushi House', 'Asian, Japanese', '4.6', 62, '₹56,916.00', 840, 'Open (1)'],
    ],
  },
  {
    id: 'q5',
    category: 'TRANSACTIONS',
    title: 'ACID Transaction: Atomic Order Placement & Inventory Lock',
    description: 'Guarantees all-or-nothing execution across order records, payment ledger, and coupon usage tracking.',
    sql: `START TRANSACTION;

-- 1. Insert master order record
INSERT INTO orders (order_id, customer_id, restaurant_id, subtotal, tax, delivery_fee, discount, total_amount, status)
VALUES ('ORD-NEW-101', 'cust-101', 'rest-1', 449.00, 22.45, 29.00, 50.00, 450.45, 'placed');

-- 2. Insert order items
INSERT INTO order_items (order_id, food_item_id, quantity, unit_price, item_total)
VALUES ('ORD-NEW-101', 'food-101', 1, 449.00, 449.00);

-- 3. Record coupon usage to prevent double-spending
INSERT INTO coupon_usage (coupon_code, customer_id, order_id, used_at)
VALUES ('TASTY50', 'cust-101', 'ORD-NEW-101', NOW());

-- 4. Check for constraints; if any failure occurs -> ROLLBACK;
COMMIT;`,
    explanation: 'ACID (Atomicity, Consistency, Isolation, Durability) guarantees that if inserting items or recording coupons fails, the entire order is rolled back cleanly, preventing phantom orders and coupon double-dipping.',
    executionTimeMs: 3.1,
    columns: ['step', 'status', 'lock_mode', 'affected_rows', 'acid_property'],
    rows: [
      ['START TRANSACTION', 'ACTIVE', 'Exclusive Write Lock', 0, 'Isolation'],
      ['INSERT INTO orders', 'SUCCESS', 'Row Lock (orders)', 1, 'Atomicity'],
      ['INSERT INTO order_items', 'SUCCESS', 'Row Lock (order_items)', 1, 'Consistency'],
      ['INSERT INTO coupon_usage', 'SUCCESS', 'Unique Key Verification', 1, 'Consistency'],
      ['COMMIT', 'COMMITTED', 'Locks Released', 3, 'Durability'],
    ],
  },
  {
    id: 'q6',
    category: 'PROCEDURES & TRIGGERS',
    title: 'Database Trigger: Auto-Update Restaurant Average Rating',
    description: 'A trigger fired automatically AFTER INSERT on the reviews table to keep denormalized rating caches up to date.',
    sql: `DELIMITER //
CREATE TRIGGER trg_after_review_insert
AFTER INSERT ON reviews
FOR EACH ROW
BEGIN
    UPDATE restaurants
    SET rating = (
        SELECT ROUND(AVG(rating), 1)
        FROM reviews
        WHERE restaurant_id = NEW.restaurant_id
    ),
    rating_count = (
        SELECT COUNT(*)
        FROM reviews
        WHERE restaurant_id = NEW.restaurant_id
    )
    WHERE restaurant_id = NEW.restaurant_id;
END;
//
DELIMITER ;`,
    explanation: 'Automates relational integrity and performance caching: instead of computing AVG(rating) on every single menu browse query, the trigger guarantees the cached rating field in restaurants is updated immediately whenever a verified review is posted.',
    executionTimeMs: 1.2,
    columns: ['trigger_name', 'event', 'timing', 'table', 'action_statement'],
    rows: [
      ['trg_after_review_insert', 'INSERT', 'AFTER', 'reviews', 'UPDATE restaurants SET rating = AVG(rating), rating_count = count(*)'],
      ['trg_after_order_delivered', 'UPDATE', 'AFTER', 'orders', 'UPDATE delivery_partners SET total_deliveries = total_deliveries + 1'],
      ['trg_prevent_negative_price', 'BEFORE', 'INSERT/UPDATE', 'food_items', 'SIGNAL SQLSTATE "45000" IF price <= 0'],
    ],
  },
];

export const NORMALIZATION_STAGES = [
  {
    stage: 'UNF (Unnormalized Form)',
    description: 'Raw food order record with repeated multivalued item groups, mixed customer personal details, and inconsistent pricing fields.',
    badExample: 'OrderRecord(order_id, customer_name, customer_email, address, item_names_csv, item_qtys_csv, item_prices_csv, restaurant_name, restaurant_phone)',
    flaws: 'Violates atomicity: Multiple food items stored in comma-separated strings. High redundancy and update anomalies.',
  },
  {
    stage: '1NF (First Normal Form)',
    description: 'All attributes are atomic (no repeating groups, no arrays in columns). Every row is uniquely identifiable by a primary key.',
    transformation: 'Separated food items into individual line items. Each cell contains exactly one scalar value.',
    primaryKey: '(order_id, item_id) composite key',
  },
  {
    stage: '2NF (Second Normal Form)',
    description: 'In 1NF and contains no Partial Functional Dependencies: every non-prime attribute is fully functionally dependent on the entire Primary Key.',
    transformation: 'Extracted food item details (name, price) into a dedicated `food_items` entity because item name depends ONLY on `item_id`, not on `(order_id, item_id)`.',
    primaryKey: 'order_items uses `order_item_id` (or composite `order_id + item_id`), referencing separate `food_items`.',
  },
  {
    stage: '3NF (Third Normal Form)',
    description: 'In 2NF and contains NO Transitive Dependencies: no non-prime attribute depends on another non-prime attribute (X -> Y -> Z).',
    transformation: 'Extracted customer information into `users` table and restaurant information into `restaurants` table. In `orders`, we store only `customer_id` and `restaurant_id` foreign keys.',
    outcome: 'Eliminates insertion anomalies (can add a restaurant before it has orders), update anomalies (updating user phone number requires modifying exactly 1 row in `users`), and deletion anomalies (deleting an order does not delete the user account).',
  },
];
