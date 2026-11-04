-- =============================================================================
-- HELLO Hyperlocal Business Discovery & Enquiry Platform
-- Complete Production Database Schema & Seed Data for XAMPP / MariaDB / MySQL 8
-- Database Name: hello_db
-- Character Set: utf8mb4 (utf8mb4_unicode_ci)
-- =============================================================================

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+05:30";

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- -----------------------------------------------------------------------------
-- 1. DATABASE CREATION
-- -----------------------------------------------------------------------------
CREATE DATABASE IF NOT EXISTS `hello_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `hello_db`;

SET FOREIGN_KEY_CHECKS = 0;

-- -----------------------------------------------------------------------------
-- 2. DROP EXISTING TABLES
-- -----------------------------------------------------------------------------
DROP TABLE IF EXISTS `audit_logs`;
DROP TABLE IF EXISTS `saved_businesses`;
DROP TABLE IF EXISTS `reviews`;
DROP TABLE IF EXISTS `enquiry_events`;
DROP TABLE IF EXISTS `enquiries`;
DROP TABLE IF EXISTS `business_services`;
DROP TABLE IF EXISTS `business_media`;
DROP TABLE IF EXISTS `business_hours`;
DROP TABLE IF EXISTS `business_categories`;
DROP TABLE IF EXISTS `business_locations`;
DROP TABLE IF EXISTS `business_staff`;
DROP TABLE IF EXISTS `business_owners`;
DROP TABLE IF EXISTS `businesses`;
DROP TABLE IF EXISTS `curated_collections`;
DROP TABLE IF EXISTS `services`;
DROP TABLE IF EXISTS `categories`;
DROP TABLE IF EXISTS `localities`;
DROP TABLE IF EXISTS `cities`;
DROP TABLE IF EXISTS `districts`;
DROP TABLE IF EXISTS `states`;
DROP TABLE IF EXISTS `user_permissions`;
DROP TABLE IF EXISTS `roles`;
DROP TABLE IF EXISTS `otp_challenges`;
DROP TABLE IF EXISTS `user_sessions`;
DROP TABLE IF EXISTS `users`;

-- -----------------------------------------------------------------------------
-- 3. USER MANAGEMENT & AUTHENTICATION
-- -----------------------------------------------------------------------------
CREATE TABLE `users` (
  `id` VARCHAR(64) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL UNIQUE,
  `full_name` VARCHAR(150) DEFAULT NULL,
  `email` VARCHAR(191) DEFAULT NULL UNIQUE,
  `avatar_url` TEXT DEFAULT NULL,
  `status` ENUM('ACTIVE', 'SUSPENDED', 'DELETED') NOT NULL DEFAULT 'ACTIVE',
  `phone_verified_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_sessions` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `refresh_token_hash` VARCHAR(255) NOT NULL,
  `device_info` VARCHAR(255) DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `expires_at` DATETIME NOT NULL,
  `revoked_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_session_user` (`user_id`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `otp_challenges` (
  `id` VARCHAR(64) NOT NULL,
  `phone_number` VARCHAR(20) NOT NULL,
  `otp_code_hash` VARCHAR(255) NOT NULL,
  `attempts_count` INT NOT NULL DEFAULT 0,
  `purpose` ENUM('LOGIN', 'REGISTER', 'VERIFY_PHONE', 'CLAIM_BIZ') NOT NULL DEFAULT 'LOGIN',
  `expires_at` DATETIME NOT NULL,
  `verified_at` DATETIME DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_otp_phone` (`phone_number`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `roles` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(50) NOT NULL UNIQUE,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `user_permissions` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `role_id` VARCHAR(64) NOT NULL,
  `resource_id` VARCHAR(64) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_perm_user` (`user_id`),
  KEY `idx_perm_role` (`role_id`),
  CONSTRAINT `fk_perm_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_perm_role` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 4. GEOGRAPHY & PILOT LOCATIONS (ANDHRA PRADESH)
-- -----------------------------------------------------------------------------
CREATE TABLE `states` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(100) NOT NULL UNIQUE,
  `code` VARCHAR(10) NOT NULL UNIQUE,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `districts` (
  `id` VARCHAR(64) NOT NULL,
  `state_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_dist_state` (`state_id`),
  CONSTRAINT `fk_dist_state` FOREIGN KEY (`state_id`) REFERENCES `states` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `cities` (
  `id` VARCHAR(64) NOT NULL,
  `district_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(100) NOT NULL,
  `slug` VARCHAR(100) NOT NULL UNIQUE,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_city_slug` (`slug`),
  KEY `idx_city_dist` (`district_id`),
  CONSTRAINT `fk_city_district` FOREIGN KEY (`district_id`) REFERENCES `districts` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `localities` (
  `id` VARCHAR(64) NOT NULL,
  `city_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `pincode` VARCHAR(10) DEFAULT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_loc_city_slug` (`city_id`, `slug`),
  KEY `idx_loc_pincode` (`pincode`),
  CONSTRAINT `fk_loc_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 5. CATEGORIES, SERVICES & CURATED COLLECTIONS
-- -----------------------------------------------------------------------------
CREATE TABLE `categories` (
  `id` VARCHAR(64) NOT NULL,
  `parent_id` VARCHAR(64) DEFAULT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL UNIQUE,
  `icon_name` VARCHAR(100) DEFAULT NULL,
  `meta_title` VARCHAR(255) DEFAULT NULL,
  `meta_description` TEXT DEFAULT NULL,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_cat_slug` (`slug`),
  KEY `idx_cat_parent` (`parent_id`),
  CONSTRAINT `fk_cat_parent` FOREIGN KEY (`parent_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `services` (
  `id` VARCHAR(64) NOT NULL,
  `category_id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_srv_cat` (`category_id`),
  CONSTRAINT `fk_srv_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `curated_collections` (
  `id` VARCHAR(64) NOT NULL,
  `category_id` VARCHAR(64) NOT NULL,
  `title` VARCHAR(150) NOT NULL,
  `slug` VARCHAR(150) NOT NULL,
  `badge_label` VARCHAR(50) DEFAULT NULL,
  `cover_image` TEXT DEFAULT NULL,
  `places_count` INT NOT NULL DEFAULT 0,
  `sort_order` INT NOT NULL DEFAULT 0,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_col_cat` (`category_id`),
  CONSTRAINT `fk_col_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 6. BUSINESS ENTITIES & RELATIONS
-- -----------------------------------------------------------------------------
CREATE TABLE `businesses` (
  `id` VARCHAR(64) NOT NULL,
  `name` VARCHAR(200) NOT NULL,
  `legal_name` VARCHAR(255) DEFAULT NULL,
  `slug` VARCHAR(200) NOT NULL UNIQUE,
  `description` TEXT DEFAULT NULL,
  `primary_phone` VARCHAR(20) NOT NULL,
  `whatsapp_number` VARCHAR(20) DEFAULT NULL,
  `support_email` VARCHAR(191) DEFAULT NULL,
  `logo_url` TEXT DEFAULT NULL,
  `cover_image_url` TEXT DEFAULT NULL,
  `status` ENUM('PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'SUSPENDED') NOT NULL DEFAULT 'APPROVED',
  `is_verified` TINYINT(1) NOT NULL DEFAULT 0,
  `verified_at` DATETIME DEFAULT NULL,
  `is_featured` TINYINT(1) NOT NULL DEFAULT 0,
  `average_rating` DECIMAL(3, 2) NOT NULL DEFAULT 0.00,
  `total_reviews` INT NOT NULL DEFAULT 0,
  `total_enquiries` INT NOT NULL DEFAULT 0,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_biz_slug` (`slug`),
  KEY `idx_biz_status_ver` (`status`, `is_verified`),
  KEY `idx_biz_featured` (`is_featured`),
  KEY `idx_biz_rating` (`average_rating`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `business_owners` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `ownership_type` ENUM('FOUNDER', 'PARTNER', 'CLAIMANT') NOT NULL DEFAULT 'FOUNDER',
  `is_primary` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_biz_owner` (`business_id`, `user_id`),
  KEY `idx_owner_user` (`user_id`),
  CONSTRAINT `fk_owner_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_owner_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `business_staff` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `role` VARCHAR(50) NOT NULL DEFAULT 'STAFF',
  `status` ENUM('ACTIVE', 'INACTIVE') NOT NULL DEFAULT 'ACTIVE',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_biz_staff` (`business_id`, `user_id`),
  CONSTRAINT `fk_staff_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_staff_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `business_locations` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `city_id` VARCHAR(64) NOT NULL,
  `locality_id` VARCHAR(64) DEFAULT NULL,
  `address_line1` VARCHAR(255) NOT NULL,
  `landmark` VARCHAR(200) DEFAULT NULL,
  `pincode` VARCHAR(10) NOT NULL,
  `latitude` DECIMAL(10, 7) NOT NULL,
  `longitude` DECIMAL(10, 7) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `idx_bloc_biz` (`business_id`),
  KEY `idx_bloc_city` (`city_id`),
  KEY `idx_bloc_loc` (`locality_id`),
  KEY `idx_bloc_lat_lng` (`latitude`, `longitude`),
  CONSTRAINT `fk_bloc_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bloc_city` FOREIGN KEY (`city_id`) REFERENCES `cities` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `fk_bloc_loc` FOREIGN KEY (`locality_id`) REFERENCES `localities` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `business_categories` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `category_id` VARCHAR(64) NOT NULL,
  `is_primary` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_biz_cat` (`business_id`, `category_id`),
  KEY `idx_bcat_cat` (`category_id`),
  CONSTRAINT `fk_bcat_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_bcat_cat` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `business_hours` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `day_of_week` TINYINT NOT NULL COMMENT '0=Sun, 1=Mon, ..., 6=Sat',
  `opens_at` TIME DEFAULT NULL,
  `closes_at` TIME DEFAULT NULL,
  `is_closed` TINYINT(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_biz_day` (`business_id`, `day_of_week`),
  CONSTRAINT `fk_bhours_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `business_media` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `media_url` TEXT NOT NULL,
  `media_type` ENUM('IMAGE', 'VIDEO', 'DOCUMENT') NOT NULL DEFAULT 'IMAGE',
  `sort_order` INT NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`),
  KEY `idx_bmedia_biz` (`business_id`),
  CONSTRAINT `fk_bmedia_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `business_services` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `service_name` VARCHAR(150) NOT NULL,
  `price` DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  `duration_minutes` INT DEFAULT NULL,
  `inclusions` TEXT DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `idx_bsrv_biz` (`business_id`),
  CONSTRAINT `fk_bsrv_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 7. ENQUIRIES & LEAD MANAGEMENT
-- -----------------------------------------------------------------------------
CREATE TABLE `enquiries` (
  `id` VARCHAR(64) NOT NULL,
  `reference_no` VARCHAR(50) NOT NULL UNIQUE,
  `business_id` VARCHAR(64) NOT NULL,
  `customer_id` VARCHAR(64) NOT NULL,
  `customer_name` VARCHAR(150) NOT NULL,
  `customer_phone` VARCHAR(20) NOT NULL,
  `message` TEXT NOT NULL,
  `status` ENUM('NEW', 'CONTACTED', 'QUOTED', 'RESOLVED', 'CLOSED', 'SPAM') NOT NULL DEFAULT 'NEW',
  `priority` ENUM('LOW', 'NORMAL', 'HIGH', 'URGENT') NOT NULL DEFAULT 'NORMAL',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_enq_ref` (`reference_no`),
  KEY `idx_enq_biz` (`business_id`),
  KEY `idx_enq_cust` (`customer_id`),
  KEY `idx_enq_status` (`status`),
  CONSTRAINT `fk_enq_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_enq_cust` FOREIGN KEY (`customer_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `enquiry_events` (
  `id` VARCHAR(64) NOT NULL,
  `enquiry_id` VARCHAR(64) NOT NULL,
  `actor_user_id` VARCHAR(64) DEFAULT NULL,
  `previous_status` VARCHAR(50) DEFAULT NULL,
  `new_status` VARCHAR(50) NOT NULL,
  `notes` TEXT DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_event_enq` (`enquiry_id`),
  CONSTRAINT `fk_event_enq` FOREIGN KEY (`enquiry_id`) REFERENCES `enquiries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 8. REVIEWS, SAVED FAVORITES & AUDIT TRAIL
-- -----------------------------------------------------------------------------
CREATE TABLE `reviews` (
  `id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `rating` TINYINT NOT NULL COMMENT '1 to 5 stars',
  `review_text` TEXT DEFAULT NULL,
  `owner_reply` TEXT DEFAULT NULL,
  `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'APPROVED',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_rev_biz` (`business_id`),
  KEY `idx_rev_user` (`user_id`),
  CONSTRAINT `fk_rev_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_rev_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `saved_businesses` (
  `id` VARCHAR(64) NOT NULL,
  `user_id` VARCHAR(64) NOT NULL,
  `business_id` VARCHAR(64) NOT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_saved_biz_user` (`user_id`, `business_id`),
  KEY `idx_saved_biz` (`business_id`),
  CONSTRAINT `fk_saved_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_saved_biz` FOREIGN KEY (`business_id`) REFERENCES `businesses` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `audit_logs` (
  `id` VARCHAR(64) NOT NULL,
  `actor_user_id` VARCHAR(64) DEFAULT NULL,
  `action` VARCHAR(100) NOT NULL,
  `entity_name` VARCHAR(100) NOT NULL,
  `entity_id` VARCHAR(64) NOT NULL,
  `payload_before` JSON DEFAULT NULL,
  `payload_after` JSON DEFAULT NULL,
  `ip_address` VARCHAR(45) DEFAULT NULL,
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_audit_entity` (`entity_name`, `entity_id`),
  KEY `idx_audit_actor` (`actor_user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------------------------------
-- 9. PRODUCTION SEED DATA (PILOT MARKET: ANDHRA PRADESH)
-- -----------------------------------------------------------------------------

-- Roles
INSERT INTO `roles` (`id`, `name`, `description`) VALUES
('role-superadmin', 'SUPER_ADMIN', 'Platform root administrative privileges'),
('role-owner', 'VENDOR_OWNER', 'Business owner with full rights over business profiles and leads'),
('role-staff', 'VENDOR_STAFF', 'Business staff managing assigned leads and response workflows'),
('role-cust', 'CUSTOMER', 'Consumer discovering local businesses and sending leads');

-- Users
INSERT INTO `users` (`id`, `phone_number`, `full_name`, `email`, `status`, `phone_verified_at`, `created_at`, `updated_at`) VALUES
('user-admin-1', '+919848000001', 'Vikram Super Admin', 'admin@hello-hi.in', 'ACTIVE', NOW(), NOW(), NOW()),
('user-vendor-1', '+919848011111', 'Suresh Varma (Amravati Grand)', 'suresh.varma@amravatigrand.in', 'ACTIVE', NOW(), NOW(), NOW()),
('user-vendor-2', '+919848022222', 'Rao Srinivasa (Packers & Movers)', 'contact@srinivasapackers.in', 'ACTIVE', NOW(), NOW(), NOW()),
('user-vendor-3', '+919848033333', 'Dr. Siri Vardhan (Siri Dental)', 'dr.siri@siridental.in', 'ACTIVE', NOW(), NOW(), NOW()),
('user-vendor-4', '+919848044444', 'Dr. Fernat Reddy (Fernat Dental)', 'dr.fernat@fernatdental.in', 'ACTIVE', NOW(), NOW(), NOW()),
('user-vendor-5', '+919848055555', 'Bawarchi Royal Foods', 'manager@bawarchiroyal.in', 'ACTIVE', NOW(), NOW(), NOW()),
('user-cust-1', '+919848012345', 'Ravi Teja', 'ravi.teja@gmail.com', 'ACTIVE', NOW(), NOW(), NOW()),
('user-cust-2', '+919848077777', 'Kavitha Rao', 'kavitha.rao@yahoo.com', 'ACTIVE', NOW(), NOW(), NOW()),
('user-cust-3', '+919848099999', 'Explore Tester', 'tester@hello-hi.in', 'ACTIVE', NOW(), NOW(), NOW());

-- User Permissions
INSERT INTO `user_permissions` (`id`, `user_id`, `role_id`) VALUES
('perm-admin-1', 'user-admin-1', 'role-superadmin'),
('perm-vendor-1', 'user-vendor-1', 'role-owner'),
('perm-vendor-2', 'user-vendor-2', 'role-owner'),
('perm-vendor-3', 'user-vendor-3', 'role-owner'),
('perm-vendor-4', 'user-vendor-4', 'role-owner'),
('perm-vendor-5', 'user-vendor-5', 'role-owner'),
('perm-cust-1', 'user-cust-1', 'role-cust'),
('perm-cust-2', 'user-cust-2', 'role-cust'),
('perm-cust-3', 'user-cust-3', 'role-cust');

-- Geography: States
INSERT INTO `states` (`id`, `name`, `code`, `is_active`) VALUES
('state-ap', 'Andhra Pradesh', 'AP', 1),
('state-ts', 'Telangana', 'TS', 1);

-- Geography: Districts
INSERT INTO `districts` (`id`, `state_id`, `name`) VALUES
('dist-krishna', 'state-ap', 'Krishna'),
('dist-guntur', 'state-ap', 'Guntur'),
('dist-hyd', 'state-ts', 'Hyderabad');

-- Geography: Cities
INSERT INTO `cities` (`id`, `district_id`, `name`, `slug`, `latitude`, `longitude`, `is_active`) VALUES
('city-vja', 'dist-krishna', 'Vijayawada', 'vijayawada', 16.5062000, 80.6480000, 1),
('city-gun', 'dist-guntur', 'Guntur', 'guntur', 16.3067000, 80.4365000, 1),
('city-hyd', 'dist-hyd', 'Hyderabad', 'hyderabad', 17.3850000, 78.4867000, 1);

-- Geography: Localities
INSERT INTO `localities` (`id`, `city_id`, `name`, `slug`, `pincode`, `latitude`, `longitude`, `is_active`) VALUES
('loc-nahamar', 'city-vja', 'Nahamar', 'nahamar', '520008', 16.5120000, 80.6515000, 1),
('loc-benz', 'city-vja', 'Benz Circle', 'benz-circle', '520010', 16.5015000, 80.6430000, 1),
('loc-onetown', 'city-vja', 'One Town', 'one-town', '520001', 16.5180000, 80.6190000, 1),
('loc-brodipet', 'city-gun', 'Brodipet', 'brodipet', '522002', 16.3050000, 80.4380000, 1),
('loc-arundelpet', 'city-gun', 'Arundelpet', 'arundelpet', '522002', 16.3120000, 80.4320000, 1),
('loc-lakshmipuram', 'city-gun', 'Lakshmipuram', 'lakshmipuram', '522007', 16.3210000, 80.4410000, 1);

-- Categories (14 Master Categories Matching UI Navigation Ribbon)
INSERT INTO `categories` (`id`, `parent_id`, `name`, `slug`, `icon_name`, `meta_title`, `meta_description`, `sort_order`, `is_active`) VALUES
('cat-restaurants', NULL, 'Restaurants', 'restaurants', 'UtensilsCrossed', 'Best Restaurants & Food in AP', 'Discover authentic dining, biryani, family restaurants and cafes', 1, 1),
('cat-hotels', NULL, 'Hotels', 'hotels', 'Hotel', 'Luxury & Budget Hotels & Lodges', 'Book 3-star, 4-star, business suites, and AC lodges', 2, 1),
('cat-beauty-spa', NULL, 'Beauty Spa', 'beauty-spa', 'Sparkles', 'Salons, Luxury Spas & Wellness', 'Bridal makeovers, Swedish massages, skin brightening and parlours', 3, 1),
('cat-home-decor', NULL, 'Home Decor', 'home-decor', 'Armchair', 'Interior Designers & Modular Kitchens', 'Custom furniture, false ceiling contractors and modular wardrobes', 4, 1),
('cat-ask-astro', NULL, 'Ask Astro', 'ask-astro', 'Sparkle', 'Vedic Astrologers & Vastu Consultants', 'Horoscope matching, Vastu dosha remedies and muhurtham dates', 5, 1),
('cat-wedding-planning', NULL, 'Wedding Planning', 'wedding-planning', 'HeartHandshake', 'Wedding Planners & Kalyana Mandapams', 'Convention halls, flower decor, photographers and royal catering', 6, 1),
('cat-education', NULL, 'Education', 'education', 'GraduationCap', 'Coaching Institutes & Academies', 'Top CBSE schools, NEET/IIT coaching academies and tutoring', 7, 1),
('cat-rent-hire', NULL, 'Rent & Hire', 'rent-hire', 'Key', 'Equipment Rentals & Self-Drive Cars', 'Rent self-drive cars, tempo travellers, audio systems and generators', 8, 1),
('cat-hospitals', NULL, 'Hospitals', 'hospitals', 'Hospital', 'Multispeciality Hospitals & Trauma', '24/7 emergency casualty, cardiology, orthopedic surgery and ICU', 9, 1),
('cat-contractors', NULL, 'Contractors', 'contractors', 'HardHat', 'Civil Building Contractors', 'Licensed civil contractors, waterproofing, electrical and borewells', 10, 1),
('cat-pet-shops', NULL, 'Pet Shops', 'pet-shops', 'PawPrint', 'Pet Shops & Veterinary Clinics', 'Dog/cat food, pet accessories, veterinary clinics and spa grooming', 11, 1),
('cat-pg-hostels', NULL, 'PG/Hostels', 'pg-hostels', 'Bed', 'Men, Women & Executive PGs', 'Paying guest accommodations with South Indian food and AC rooms', 12, 1),
('cat-estate-agent', NULL, 'Estate Agent', 'estate-agent', 'Building2', 'Real Estate Brokers & CRDA Plots', 'Find apartments, commercial office spaces and open plots', 13, 1),
('cat-dentists', NULL, 'Dentists', 'dentists', 'SmilePlus', 'Certified Dentists & Laser Dental', 'Orthodontists, single-sitting root canals and invisible aligners', 14, 1),
('cat-food', NULL, 'Restaurants & Dining', 'restaurants-food', 'UtensilsCrossed', 'Best Restaurants & Food in AP', 'Discover authentic dining, biryani, family restaurants and cafes', 15, 1),
('cat-doctors', NULL, 'Doctors & Clinics', 'doctors-clinics', 'Stethoscope', 'Top Doctors & Medical Clinics', 'Find verified doctors, general physicians and pediatricians', 16, 1),
('cat-dental', NULL, 'Dental Care & Clinics', 'dental-care', 'SmilePlus', 'Dental Clinics & Dentists', 'Expert dentists, root canal, dental implants and braces', 17, 1),
('cat-movers', NULL, 'Packers & Movers', 'packers-movers', 'Truck', 'Verified Packers & Movers', 'Household shifting, office relocation and transport services', 18, 1),
('cat-home', NULL, 'Home Services', 'home-services', 'Home', 'Reliable Home Maintenance & Services', 'Deep cleaning, painting, carpentry and pest control', 19, 1),
('cat-tours', NULL, 'Tours & Travel', 'tours-travel', 'Plane', 'Travel Agencies & Car Rentals', 'Outstation cabs, tourism packages, airport taxi and buses', 20, 1),
('cat-electric', NULL, 'Electrical & Plumbing', 'electrical-plumbing', 'Zap', 'Electricians & Plumbers', 'Emergency electricians, wiring, pipe leakage and sanitary works', 21, 1);

-- Services
INSERT INTO `services` (`id`, `category_id`, `name`, `slug`) VALUES
('srv-1', 'cat-food', 'Family Dining', 'family-dining'),
('srv-2', 'cat-food', 'Royal Claypot Biryani', 'royal-claypot-biryani'),
('srv-3', 'cat-food', 'Authentic Andhra Bhojanam', 'authentic-andhra-bhojanam'),
('srv-4', 'cat-dental', 'Laser Root Canal Treatment', 'laser-root-canal'),
('srv-5', 'cat-dental', 'Invisible Clear Aligners', 'invisible-clear-aligners'),
('srv-6', 'cat-dental', 'Dental Implants', 'dental-implants'),
('srv-7', 'cat-movers', 'Household Shifting 100% Insured', 'household-shifting'),
('srv-8', 'cat-movers', 'Office Corporate Relocation', 'office-relocation'),
('srv-9', 'cat-electric', 'Emergency 24/7 Electrician', 'emergency-electrician'),
('srv-10', 'cat-electric', 'AC Jet Cleaning & Gas Charging', 'ac-service');

-- Curated Collections
INSERT INTO `curated_collections` (`id`, `category_id`, `title`, `slug`, `badge_label`, `cover_image`, `places_count`, `sort_order`, `is_active`) VALUES
('col-food-1', 'cat-food', 'Royal Andhra Claypot Biryani', 'royal-claypot-biryani', 'MUST TRY', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80', 8, 1, 1),
('col-food-2', 'cat-food', 'Authentic Veg Thali & Meals', 'veg-thali-meals', 'FAMILY FAVORITE', 'https://images.unsplash.com/photo-1610057099431-d73a1c9d2f2f?w=500&auto=format&fit=crop&q=80', 6, 2, 1),
('col-dent-1', 'cat-dental', 'Painless Laser Root Canals', 'laser-root-canals', 'TOP RATED', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=500&auto=format&fit=crop&q=80', 7, 1, 1),
('col-dent-2', 'cat-dental', 'Clear Aligners & Braces', 'clear-aligners-braces', 'COSMETIC', 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=500&auto=format&fit=crop&q=80', 5, 2, 1),
('col-mov-1', 'cat-movers', 'Zero-Damage Home Shifting', 'zero-damage-shifting', '100% INSURED', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=500&auto=format&fit=crop&q=80', 6, 1, 1),
('col-elec-1', 'cat-electric', 'Emergency 24/7 Electricians', 'emergency-electricians', '30-MIN ARRIVAL', 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=500&auto=format&fit=crop&q=80', 8, 1, 1);

-- Businesses
INSERT INTO `businesses` (
  `id`, `name`, `legal_name`, `slug`, `description`, `primary_phone`, `whatsapp_number`, `support_email`,
  `logo_url`, `cover_image_url`, `status`, `is_verified`, `verified_at`, `is_featured`,
  `average_rating`, `total_reviews`, `total_enquiries`, `created_at`, `updated_at`
) VALUES
(
  'biz-siri-dental',
  'Siri Dental Clinic',
  'Siri Multispeciality Dental Healthcare Pvt Ltd',
  'siri-dental-clinic',
  'State-of-the-art dental hospital in Vijayawada offering microscopic root canal therapy, painless laser teeth whitening, ceramic dental implants, and invisible aligners.',
  '+919848033333',
  '+919848033333',
  'care@siridental.in',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80',
  'APPROVED',
  1,
  NOW(),
  1,
  4.80,
  132,
  248,
  NOW(),
  NOW()
),
(
  'biz-fernat-dental',
  'Fernat Dental Business',
  'Fernat Health & Laser Dental Clinic',
  'fernat-dental-business',
  'Advanced dental clinic in Vijayawada providing orthodontic braces, laser gum contouring, dental bridge works, and 24/7 dental trauma emergency assistance.',
  '+919848044444',
  '+919848044444',
  'appointments@fernatdental.com',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80',
  'APPROVED',
  1,
  NOW(),
  1,
  4.80,
  120,
  194,
  NOW(),
  NOW()
),
(
  'biz-amravati',
  'Amravati Grand Restaurant',
  'Amravati Hospitality Pvt Ltd',
  'amravati-grand-restaurant',
  'Premier authentic Andhra cuisine, royal bhojanam thali, aromatic clay-pot biryani, and family fine dining in the heart of Vijayawada.',
  '+919848011111',
  '+919848011111',
  'contact@amravatigrand.in',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
  'APPROVED',
  1,
  NOW(),
  1,
  4.80,
  128,
  312,
  NOW(),
  NOW()
),
(
  'biz-srinivasa-packers',
  'Srinivasa Packers & Movers',
  'Srinivasa Logistics & Relocations India Ltd',
  'srinivasa-packers-movers',
  'ISO 9001 certified packing and moving specialists across Vijayawada and Guntur. Household shifting, office relocation, closed container vehicle transit, and transit insurance.',
  '+919848022222',
  '+919848022222',
  'leads@srinivasapackers.in',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80',
  'APPROVED',
  1,
  NOW(),
  1,
  4.70,
  89,
  165,
  NOW(),
  NOW()
),
(
  'biz-bawarchi-royal',
  'Bawarchi Royal Hyderabadi Biryani',
  'Bawarchi Royal Foods Andhra',
  'bawarchi-royal-hyderabadi-biryani',
  'World-famous slow dum cooked Hyderabadi mutton biryani, chicken 65, butter garlic naan, and Mughlai family banquet.',
  '+919848055555',
  '+919848055555',
  'info@bawarchiroyal.in',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80',
  'APPROVED',
  1,
  NOW(),
  1,
  4.90,
  240,
  480,
  NOW(),
  NOW()
);

-- Business Owners
INSERT INTO `business_owners` (`id`, `business_id`, `user_id`, `ownership_type`, `is_primary`) VALUES
('bown-1', 'biz-siri-dental', 'user-vendor-3', 'FOUNDER', 1),
('bown-2', 'biz-fernat-dental', 'user-vendor-4', 'FOUNDER', 1),
('bown-3', 'biz-amravati', 'user-vendor-1', 'FOUNDER', 1),
('bown-4', 'biz-srinivasa-packers', 'user-vendor-2', 'FOUNDER', 1),
('bown-5', 'biz-bawarchi-royal', 'user-vendor-5', 'FOUNDER', 1);

-- Business Locations
INSERT INTO `business_locations` (
  `id`, `business_id`, `city_id`, `locality_id`, `address_line1`, `landmark`, `pincode`, `latitude`, `longitude`, `is_primary`
) VALUES
('bloc-siri', 'biz-siri-dental', 'city-vja', 'loc-nahamar', 'D.No 40-1-52, MG Road, Nahamar', 'Opposite City Center Mall', '520008', 16.5120000, 80.6515000, 1),
('bloc-fernat', 'biz-fernat-dental', 'city-vja', 'loc-nahamar', 'Plot 18, Bandar Road, Nahamar', 'Near NTR Circle', '520008', 16.5090000, 80.6480000, 1),
('bloc-amravati', 'biz-amravati', 'city-vja', 'loc-benz', 'MG Road, Benz Circle', 'Beside Grand Hotel', '520010', 16.5015000, 80.6430000, 1),
('bloc-srinivasa', 'biz-srinivasa-packers', 'city-gun', 'loc-brodipet', '4th Lane, Brodipet Main Road', 'Near Hindu College', '522002', 16.3050000, 80.4380000, 1),
('bloc-bawarchi', 'biz-bawarchi-royal', 'city-vja', 'loc-benz', 'NH-16 Highway, Benz Circle', 'Opposite PVP Mall', '520010', 16.5030000, 80.6410000, 1);

-- Business Categories
INSERT INTO `business_categories` (`id`, `business_id`, `category_id`, `is_primary`) VALUES
('bcat-siri', 'biz-siri-dental', 'cat-dental', 1),
('bcat-fernat', 'biz-fernat-dental', 'cat-dental', 1),
('bcat-amravati', 'biz-amravati', 'cat-food', 1),
('bcat-srinivasa', 'biz-srinivasa-packers', 'cat-movers', 1),
('bcat-bawarchi', 'biz-bawarchi-royal', 'cat-food', 1);

-- Business Hours (0=Sun to 6=Sat)
INSERT INTO `business_hours` (`id`, `business_id`, `day_of_week`, `opens_at`, `closes_at`, `is_closed`) VALUES
('bhr-siri-1', 'biz-siri-dental', 1, '09:00:00', '22:00:00', 0),
('bhr-siri-2', 'biz-siri-dental', 2, '09:00:00', '22:00:00', 0),
('bhr-siri-3', 'biz-siri-dental', 3, '09:00:00', '22:00:00', 0),
('bhr-siri-4', 'biz-siri-dental', 4, '09:00:00', '22:00:00', 0),
('bhr-siri-5', 'biz-siri-dental', 5, '09:00:00', '22:00:00', 0),
('bhr-siri-6', 'biz-siri-dental', 6, '09:00:00', '22:00:00', 0),
('bhr-siri-0', 'biz-siri-dental', 0, '10:00:00', '14:00:00', 0),
('bhr-fernat-1', 'biz-fernat-dental', 1, '09:30:00', '21:30:00', 0),
('bhr-amravati-1', 'biz-amravati', 1, '11:00:00', '23:00:00', 0),
('bhr-srinivasa-1', 'biz-srinivasa-packers', 1, '08:00:00', '22:00:00', 0);

-- Business Services / Rate Cards
INSERT INTO `business_services` (`id`, `business_id`, `service_name`, `price`, `duration_minutes`, `inclusions`) VALUES
('bsrv-1', 'biz-siri-dental', 'Complete Dental Health Consultation & Digital X-Ray', 300.00, 30, 'Full mouth intraoral scanner, digital diagnostic report, consultation'),
('bsrv-2', 'biz-siri-dental', 'Single Sitting Rotary Root Canal Treatment (RCT)', 3500.00, 60, 'Crown prep, pain-free rotary instrumentation, temporary seal'),
('bsrv-3', 'biz-siri-dental', 'Clear Invisible Aligners (Starter Pack)', 28000.00, 45, '3D digital smile simulation, 10 custom aligner trays'),
('bsrv-4', 'biz-amravati', 'Royal Special Andhra Mutton Dum Biryani (Family Pack)', 799.00, 20, 'Fragrant aged Basmati rice, double masala, Mirchi Ka Salan, Raitha'),
('bsrv-5', 'biz-srinivasa-packers', '1-BHK Local Household Shifting within Vijayawada', 4500.00, 180, 'Multi-layer bubble wrap, packing, loading, dedicated closed truck transit');

-- Business Media
INSERT INTO `business_media` (`id`, `business_id`, `media_url`, `media_type`, `sort_order`) VALUES
('bmed-1', 'biz-siri-dental', 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&auto=format&fit=crop&q=80', 'IMAGE', 1),
('bmed-2', 'biz-fernat-dental', 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=800&auto=format&fit=crop&q=80', 'IMAGE', 1),
('bmed-3', 'biz-amravati', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80', 'IMAGE', 1),
('bmed-4', 'biz-srinivasa-packers', 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&auto=format&fit=crop&q=80', 'IMAGE', 1),
('bmed-5', 'biz-bawarchi-royal', 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&auto=format&fit=crop&q=80', 'IMAGE', 1);

-- Enquiries (Real Leads)
INSERT INTO `enquiries` (
  `id`, `reference_no`, `business_id`, `customer_id`, `customer_name`, `customer_phone`, `message`, `status`, `priority`, `created_at`, `updated_at`
) VALUES
(
  'enq-101',
  'ENQ-2026-57295',
  'biz-siri-dental',
  'user-cust-3',
  'Explore Tester',
  '+919848099999',
  'Need dental consultation for clear aligners via Explore website portal',
  'NEW',
  'HIGH',
  NOW(),
  NOW()
),
(
  'enq-102',
  'ENQ-2026-48210',
  'biz-amravati',
  'user-cust-2',
  'Kavitha Rao',
  '+919848077777',
  'Need table reservation for 12 guests this Sunday for Andhra Bhojanam',
  'CONTACTED',
  'NORMAL',
  NOW(),
  NOW()
),
(
  'enq-103',
  'ENQ-2026-31908',
  'biz-srinivasa-packers',
  'user-cust-1',
  'Ravi Teja',
  '+919848012345',
  'Looking for 2-BHK house shifting quote from Benz Circle to Hyderabad next week',
  'RESOLVED',
  'HIGH',
  NOW(),
  NOW()
);

-- Reviews
INSERT INTO `reviews` (`id`, `business_id`, `user_id`, `rating`, `review_text`, `owner_reply`, `status`, `created_at`, `updated_at`) VALUES
('rev-1', 'biz-siri-dental', 'user-cust-1', 5, 'Dr. Siri Vardhan did my root canal painlessly in just 45 minutes! Highly recommend Siri Dental Clinic.', 'Thank you Ravi garu! Glad you had a comfortable treatment.', 'APPROVED', NOW(), NOW()),
('rev-2', 'biz-amravati', 'user-cust-2', 5, 'Authentic Guntur and Andhra flavours. Claypot biryani and natu kodi pulao are top tier!', 'Thank you Kavitha garu, looking forward to welcoming your family again!', 'APPROVED', NOW(), NOW());

-- Audit Logs
INSERT INTO `audit_logs` (`id`, `actor_user_id`, `action`, `entity_name`, `entity_id`, `payload_before`, `payload_after`, `ip_address`, `created_at`) VALUES
('audit-1', 'user-admin-1', 'KYC_APPROVED', 'businesses', 'biz-siri-dental', '{"status":"UNDER_REVIEW"}', '{"status":"APPROVED","is_verified":1}', '127.0.0.1', NOW()),
('audit-2', 'user-admin-1', 'KYC_APPROVED', 'businesses', 'biz-amravati', '{"status":"UNDER_REVIEW"}', '{"status":"APPROVED","is_verified":1}', '127.0.0.1', NOW()),
('audit-3', 'user-admin-1', 'LOCALITY_CREATED', 'localities', 'loc-nahamar', NULL, '{"name":"Nahamar","cityName":"Vijayawada"}', '127.0.0.1', NOW());

SET FOREIGN_KEY_CHECKS = 1;
COMMIT;

-- =============================================================================
-- HELLO Platform: XAMPP SQL Schema & Seed Data Generation Complete!
-- Import this file into phpMyAdmin -> hello_db or run via mysql CLI
-- =============================================================================
