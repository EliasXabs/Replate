# Models Documentation

This document provides an overview of the Sequelize models used in the Replate project, their fields, data types, constraints, and associations. It serves as a reference for developers to understand the data structure and relationships within the application.

## Table of Contents

1. [User Model](#user-model)
2. [Admin Model](#admin-model)
3. [Business Model](#business-model)
4. [MenuItem Model](#menuitem-model)
5. [OrderStatus Model](#orderstatus-model)
6. [Order Model](#order-model)
7. [OrderItem Model](#orderitem-model)
8. [CustomerPoints Model](#customerpoints-model)
9. [Notification Model](#notification-model)

---

## User Model

**Description:**  
Represents users of the application including customers, business owners, and admins.

**Fields:**

- **name:** `string` (max 100, required)  
  The full name of the user.
- **email:** `string` (max 100, unique, required)  
  The user's email address.
- **password_hash:** `text` (required)  
  A hashed version of the user's password.
- **role:** `string` (max 20, required)  
  The user's role, e.g., 'customer', 'business', or 'admin'.
- **createdAt:** `timestamp` (auto-generated)  
  The date and time the record was created.

**Associations:**

- **HasOne**: `Admin` (if the user is an admin)
- **HasMany**: `Business` (if the user owns businesses)

---

## Admin Model

**Description:**  
Stores administrative details linked to a user with administrative privileges.

**Fields:**

- **user_id:** `integer` (unique, required)  
  Foreign key referencing the User model.
- **createdAt:** `timestamp` (auto-generated)  
  The date and time the admin record was created.

**Associations:**

- **BelongsTo**: `User`

---

## Business Model

**Description:**  
Represents a business entity in the system.

**Fields:**

- **user_id:** `integer` (optional)  
  Foreign key referencing the User model.
- **business_name:** `string` (max 100, required)  
  The name of the business.
- **address:** `text` (optional)  
  The physical address of the business.
- **phone_number:** `string` (max 20, optional)  
  Contact number for the business.
- **createdAt:** `timestamp` (auto-generated)  
  The date and time the business record was created.

**Associations:**

- **BelongsTo**: `User`

---

## MenuItem Model

**Description:**  
Represents items offered by a business on their menu.

**Fields:**

- **business_id:** `integer` (required)  
  Foreign key referencing the Business model.
- **name:** `string` (max 100, required)  
  The name of the menu item.
- **description:** `text` (optional)  
  A description of the menu item.
- **price:** `decimal(10,2)` (required)  
  The price of the menu item.
- **image_url:** `text` (optional)  
  URL of an image representing the menu item.
- **available:** `boolean` (default: true)  
  Availability status of the item.
- **createdAt:** `timestamp` (auto-generated)  
  The date and time the menu item record was created.

**Associations:**

- **BelongsTo**: `Business`

---

## OrderStatus Model

**Description:**  
Represents the status of an order.

**Fields:**

- **status_name:** `string` (max 50, required)  
  The name of the status (e.g., 'pending', 'confirmed', 'delivered').

**Associations:**  
No direct associations, but it is referenced as a foreign key in the Order model.

---

## Order Model

**Description:**  
Represents an order placed by a user.

**Fields:**

- **user_id:** `integer` (required)  
  Foreign key referencing the User model.
- **business_id:** `integer` (required)  
  Foreign key referencing the Business model.
- **status_id:** `integer` (required)  
  Foreign key referencing the OrderStatus model.
- **total_price:** `decimal(10,2)` (optional)  
  The total price of the order.
- **createdAt:** `timestamp` (auto-generated)  
  The date and time the order was created.

**Associations:**

- **BelongsTo**: `User`
- **BelongsTo**: `Business`
- **BelongsTo**: `OrderStatus`
- **HasMany**: `OrderItem`

---

## OrderItem Model

**Description:**  
Represents an individual item within an order.

**Fields:**

- **order_id:** `integer` (required)  
  Foreign key referencing the Order model.
- **menu_item_id:** `integer` (required)  
  Foreign key referencing the MenuItem model.
- **quantity:** `integer` (required)  
  Quantity of the menu item ordered.
- **price:** `decimal(10,2)` (required)  
  Price per unit for the menu item.

**Associations:**

- **BelongsTo**: `Order`
- **BelongsTo**: `MenuItem`

---

## CustomerPoints Model

**Description:**  
Tracks loyalty or reward points for users.

**Fields:**

- **user_id:** `integer` (unique, required)  
  Foreign key referencing the User model.
- **points:** `integer` (default: 0, required)  
  The number of points earned by the user.
- **lastUpdated:** `timestamp` (auto-generated)  
  The last time the points were updated.

**Associations:**

- **BelongsTo**: `User`

---

## Notification Model

**Description:**  
Represents notifications delivered to users.

**Fields:**

- **user_id:** `integer` (required)  
  Foreign key referencing the User model.
- **message:** `text` (required)  
  The content of the notification.
- **read:** `boolean` (default: false)  
  Whether the notification has been read.
- **timestamp:** `timestamp` (default: now, required)  
  The time the notification was created.

**Associations:**

- **BelongsTo**: `User`

---