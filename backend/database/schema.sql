-- =============================================================================
-- Rentora — Reference database schema (MySQL 8, InnoDB, utf8mb4)
-- =============================================================================
-- This file is a DDL reference derived from the current Laravel migrations
-- (database/migrations/*.php) plus recommended additions. It is NOT the
-- source of truth for the existing tables — the migrations are. Use this to:
--   1. See the whole schema in one place.
--   2. Spot 3 columns that application code already reads/writes but that
--      no migration creates yet (marked "-- FIX" below).
--   3. Get a starting DDL for the tables the product needs but doesn't have
--      yet — Pagos, Mensajes, Favoritos, review moderation (marked "-- NEW").
--
-- Status enums (role/status/type columns) are stored as plain VARCHAR, not
-- native MySQL ENUM, matching how the existing migrations do it (PHP-side
-- backed enums in app/Enums/*.php cast to/from strings). Valid values are
-- listed in a comment above each column.
-- =============================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =============================================================================
-- SECTION 1 — Existing tables (from current migrations)
-- =============================================================================

-- Stores all registered users (hosts and renters)
CREATE TABLE users (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    first_name              VARCHAR(255)    NOT NULL,
    last_name               VARCHAR(255)    NOT NULL,
    email                   VARCHAR(255)    NOT NULL,
    phone                   VARCHAR(255)    NULL,
    password                VARCHAR(255)    NOT NULL,
    remember_token          VARCHAR(100)    NULL,
    -- role: renter | host | both | admin
    role                    VARCHAR(20)     NOT NULL DEFAULT 'renter',
    -- status: pending_verification | active | suspended | banned
    status                  VARCHAR(30)     NOT NULL DEFAULT 'pending_verification',
    avatar_path             VARCHAR(255)    NULL,
    identity_verified_at    TIMESTAMP       NULL,
    email_verified_at       TIMESTAMP       NULL,
    phone_verified_at       TIMESTAMP       NULL,
    last_login_at           TIMESTAMP       NULL,
    metadata                JSON            NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,
    deleted_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_users_uuid (uuid),
    UNIQUE KEY uq_users_email (email),
    KEY idx_users_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Stores all registered users (hosts and renters)';

-- Stores storage listings created by hosts
CREATE TABLE spaces (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    host_id                 BIGINT UNSIGNED NOT NULL,
    title                   VARCHAR(100)    NOT NULL,
    description             TEXT            NOT NULL,
    -- type: garage | room | warehouse | closet | other
    type                    VARCHAR(20)     NOT NULL,
    -- status: draft | pending_review | active | rejected | paused
    status                  VARCHAR(20)     NOT NULL DEFAULT 'draft',
    price_per_month         DECIMAL(10,2)   NOT NULL,
    minimum_months          TINYINT         NOT NULL DEFAULT 1,
    max_months              TINYINT         NULL,
    width_meters            DECIMAL(5,2)    NULL,
    height_meters           DECIMAL(5,2)    NULL,
    depth_meters            DECIMAL(5,2)    NULL,
    floor_number            TINYINT         NULL,
    address_line            VARCHAR(255)    NOT NULL,
    neighborhood            VARCHAR(255)    NOT NULL,
    city                    VARCHAR(255)    NOT NULL DEFAULT 'Tegucigalpa',
    department              VARCHAR(255)    NOT NULL DEFAULT 'Francisco Morazán',
    country                 VARCHAR(255)    NOT NULL DEFAULT 'HN',
    latitude                DECIMAL(10,7)   NULL,
    longitude               DECIMAL(10,7)   NULL,
    amenities               JSON            NOT NULL,
    rules                   TEXT            NULL,
    view_count              INT UNSIGNED    NOT NULL DEFAULT 0,  -- FIX: written by Jobs/SyncSpaceViewCounts.php, missing from migration
    published_at            TIMESTAMP       NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,
    deleted_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_spaces_uuid (uuid),
    KEY idx_spaces_status (status),
    KEY idx_spaces_city (city),
    KEY idx_spaces_lat_lng (latitude, longitude),
    KEY idx_spaces_published_at (published_at),
    CONSTRAINT fk_spaces_host FOREIGN KEY (host_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Stores storage listings created by hosts';

-- Stores photo S3 keys for spaces
CREATE TABLE space_photos (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    space_id                BIGINT UNSIGNED NOT NULL,
    -- FIX: original_path/large_path/medium_path/thumbnail_path/processing/failed
    -- are already read/written by SpacePhotoController::store() and the
    -- ProcessSpacePhoto job, but only `path` exists in the current migration.
    original_path           VARCHAR(255)    NULL COMMENT 'Temp upload path before processing',
    path                    VARCHAR(255)    NULL COMMENT 'Legacy/fallback single path',
    large_path              VARCHAR(255)    NULL,
    medium_path             VARCHAR(255)    NULL,
    thumbnail_path          VARCHAR(255)    NULL,
    `order`                 TINYINT         NOT NULL DEFAULT 0,
    is_primary              TINYINT(1)      NOT NULL DEFAULT 0,
    processing              TINYINT(1)      NOT NULL DEFAULT 0,
    failed                  TINYINT(1)      NOT NULL DEFAULT 0,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_space_photos_uuid (uuid),
    KEY idx_space_photos_space (space_id),
    CONSTRAINT fk_space_photos_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Stores photo S3 keys for spaces';

-- Stores reservations/bookings of spaces
CREATE TABLE bookings (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    space_id                BIGINT UNSIGNED NOT NULL,
    renter_id               BIGINT UNSIGNED NOT NULL,
    host_id                 BIGINT UNSIGNED NOT NULL,
    -- status: pending | confirmed | active | completed | disputed | cancelled_by_renter | cancelled_by_host
    status                  VARCHAR(30)     NOT NULL DEFAULT 'pending',
    start_date              DATE            NOT NULL,
    end_date                DATE            NULL,
    months_duration         TINYINT         NOT NULL,
    price_per_month         DECIMAL(10,2)   NOT NULL,
    total_amount            DECIMAL(10,2)   NOT NULL,
    platform_fee_amount     DECIMAL(10,2)   NOT NULL,
    host_payout_amount      DECIMAL(10,2)   NOT NULL,
    cancellation_reason     TEXT            NULL,
    confirmed_at            TIMESTAMP       NULL,
    cancelled_at            TIMESTAMP       NULL,
    completed_at            TIMESTAMP       NULL,
    renter_notes            TEXT            NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,
    deleted_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_bookings_uuid (uuid),
    KEY idx_bookings_status (status),
    CONSTRAINT fk_bookings_space  FOREIGN KEY (space_id)  REFERENCES spaces(id) ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_renter FOREIGN KEY (renter_id) REFERENCES users(id)  ON DELETE RESTRICT,
    CONSTRAINT fk_bookings_host   FOREIGN KEY (host_id)   REFERENCES users(id)  ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Stores reservations/bookings of spaces';

-- Stores user reviews for bookings
CREATE TABLE reviews (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    booking_id              BIGINT UNSIGNED NOT NULL,
    reviewer_id             BIGINT UNSIGNED NOT NULL,
    reviewee_id             BIGINT UNSIGNED NOT NULL,
    -- reviewee_type: host | renter
    reviewee_type           VARCHAR(20)     NOT NULL,
    rating                  TINYINT         NOT NULL,
    comment                 TEXT            NULL,
    is_visible              TINYINT(1)      NOT NULL DEFAULT 1,
    is_flagged              TINYINT(1)      NOT NULL DEFAULT 0,  -- FIX: read by AdminReviewController::flagged(), missing from migration
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_reviews_uuid (uuid),
    UNIQUE KEY uq_reviews_booking_reviewer (booking_id, reviewer_id),
    KEY idx_reviews_is_flagged (is_flagged),
    CONSTRAINT fk_reviews_booking  FOREIGN KEY (booking_id)  REFERENCES bookings(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id)    ON DELETE CASCADE,
    CONSTRAINT fk_reviews_reviewee FOREIGN KEY (reviewee_id) REFERENCES users(id)    ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Stores user reviews for bookings';

-- Laravel built-in notifications table
CREATE TABLE notifications (
    id                      CHAR(36)        NOT NULL PRIMARY KEY,
    type                    VARCHAR(255)    NOT NULL,
    notifiable_type         VARCHAR(255)    NOT NULL,
    notifiable_id           BIGINT UNSIGNED NOT NULL,
    data                    TEXT            NOT NULL,
    read_at                 TIMESTAMP       NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    KEY idx_notifications_notifiable (notifiable_type, notifiable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Laravel built-in notifications table';

-- Laravel Sanctum API tokens
CREATE TABLE personal_access_tokens (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type          VARCHAR(255)    NOT NULL,
    tokenable_id            BIGINT UNSIGNED NOT NULL,
    name                    TEXT            NOT NULL,
    token                   VARCHAR(64)     NOT NULL,
    abilities               TEXT            NULL,
    last_used_at            TIMESTAMP       NULL,
    expires_at              TIMESTAMP       NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_personal_access_tokens_token (token),
    KEY idx_personal_access_tokens_tokenable (tokenable_type, tokenable_id),
    KEY idx_personal_access_tokens_expires_at (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Laravel database cache (fallback store)
CREATE TABLE cache (
    `key`                   VARCHAR(255)    NOT NULL PRIMARY KEY,
    value                   MEDIUMTEXT      NOT NULL,
    expiration              INT             NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cache_locks (
    `key`                   VARCHAR(255)    NOT NULL PRIMARY KEY,
    owner                   VARCHAR(255)    NOT NULL,
    expiration              INT             NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =============================================================================
-- SECTION 2 — New tables (recommended additions, not yet migrated)
-- =============================================================================

-- NEW: backs the admin "Pagos" screen and gives an auditable transaction
-- ledger instead of just the computed amounts already sitting on `bookings`.
-- One row per charge, refund, or host payout.
CREATE TABLE payments (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    booking_id              BIGINT UNSIGNED NULL COMMENT 'Null for aggregated host payouts covering several bookings',
    payer_id                BIGINT UNSIGNED NULL COMMENT 'Renter being charged; null for payout rows',
    payee_id                BIGINT UNSIGNED NULL COMMENT 'Host being paid out; null for renter-charge rows',
    -- type: charge | refund | payout
    type                    VARCHAR(20)     NOT NULL DEFAULT 'charge',
    -- status: pending | processing | completed | failed | cancelled
    status                  VARCHAR(20)     NOT NULL DEFAULT 'pending',
    amount                  DECIMAL(10,2)   NOT NULL,
    currency                CHAR(3)         NOT NULL DEFAULT 'HNL',
    payment_method          VARCHAR(50)     NULL COMMENT 'e.g. card, bank_transfer, tigo_money',
    gateway                 VARCHAR(50)     NULL COMMENT 'e.g. stripe, tigo_money',
    gateway_reference       VARCHAR(191)    NULL,
    failure_reason          TEXT            NULL,
    paid_at                 TIMESTAMP       NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_payments_uuid (uuid),
    KEY idx_payments_status (status),
    KEY idx_payments_type (type),
    KEY idx_payments_gateway_reference (gateway_reference),
    CONSTRAINT fk_payments_booking FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE RESTRICT,
    CONSTRAINT fk_payments_payer   FOREIGN KEY (payer_id)   REFERENCES users(id)    ON DELETE RESTRICT,
    CONSTRAINT fk_payments_payee   FOREIGN KEY (payee_id)   REFERENCES users(id)    ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Transaction ledger: renter charges, refunds, host payouts';

-- NEW: backs the admin "Mensajes" screen (currently mocked in the frontend)
-- and any renter<->host chat on the client side. One conversation per
-- host/renter pair, optionally scoped to a specific space.
CREATE TABLE conversations (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    space_id                BIGINT UNSIGNED NULL,
    host_id                 BIGINT UNSIGNED NOT NULL,
    renter_id               BIGINT UNSIGNED NOT NULL,
    last_message_at         TIMESTAMP       NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_conversations_uuid (uuid),
    -- NOTE: MySQL treats NULLs as distinct in unique keys, so two rows with
    -- the same host/renter and space_id=NULL are both allowed. Enforce the
    -- "one general conversation per pair" rule in application code, or add
    -- a generated column that maps NULL -> 0 if you need it DB-enforced.
    UNIQUE KEY uq_conversations_participants (host_id, renter_id, space_id),
    KEY idx_conversations_last_message_at (last_message_at),
    CONSTRAINT fk_conversations_space  FOREIGN KEY (space_id)  REFERENCES spaces(id) ON DELETE SET NULL,
    CONSTRAINT fk_conversations_host   FOREIGN KEY (host_id)   REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_conversations_renter FOREIGN KEY (renter_id) REFERENCES users(id)  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='One thread per host/renter pair, optionally scoped to a space';

CREATE TABLE messages (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    conversation_id         BIGINT UNSIGNED NOT NULL,
    sender_id               BIGINT UNSIGNED NOT NULL,
    body                    TEXT            NOT NULL,
    attachment_path         VARCHAR(255)    NULL,
    read_at                 TIMESTAMP       NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_messages_uuid (uuid),
    KEY idx_messages_conversation_created (conversation_id, created_at),
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender       FOREIGN KEY (sender_id)       REFERENCES users(id)          ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Individual chat messages within a conversation';

-- NEW: renter-side "save for later" — standard on a rental marketplace,
-- has no screen yet in either frontend but no product reason to omit it.
CREATE TABLE favorites (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    user_id                 BIGINT UNSIGNED NOT NULL,
    space_id                BIGINT UNSIGNED NOT NULL,
    created_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_favorites_uuid (uuid),
    UNIQUE KEY uq_favorites_user_space (user_id, space_id),
    CONSTRAINT fk_favorites_user  FOREIGN KEY (user_id)  REFERENCES users(id)  ON DELETE CASCADE,
    CONSTRAINT fk_favorites_space FOREIGN KEY (space_id) REFERENCES spaces(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Spaces a renter has bookmarked';

-- NEW: gives AdminReviewController::flagged() something real to query, and
-- keeps the `reason` from FlagReviewRequest (currently received but
-- discarded in ReviewController::flag()) instead of losing it. Multiple
-- users can flag the same review, each with their own reason.
CREATE TABLE review_flags (
    id                      BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid                    CHAR(36)        NOT NULL,
    review_id               BIGINT UNSIGNED NOT NULL,
    reported_by             BIGINT UNSIGNED NOT NULL,
    reason                  TEXT            NOT NULL,
    resolved_at             TIMESTAMP       NULL,
    resolved_by             BIGINT UNSIGNED NULL,
    created_at              TIMESTAMP       NULL,
    updated_at              TIMESTAMP       NULL,

    UNIQUE KEY uq_review_flags_uuid (uuid),
    UNIQUE KEY uq_review_flags_review_reporter (review_id, reported_by),
    KEY idx_review_flags_resolved_at (resolved_at),
    CONSTRAINT fk_review_flags_review      FOREIGN KEY (review_id)   REFERENCES reviews(id) ON DELETE CASCADE,
    CONSTRAINT fk_review_flags_reporter    FOREIGN KEY (reported_by) REFERENCES users(id)   ON DELETE CASCADE,
    CONSTRAINT fk_review_flags_resolver    FOREIGN KEY (resolved_by) REFERENCES users(id)   ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='Individual reports filed against a review, for moderation';

SET FOREIGN_KEY_CHECKS = 1;

-- =============================================================================
-- Considered but NOT included — flagged here for a future pass, not built
-- now because they are not blocking any screen that exists today:
--
--   * admin_action_logs — AdminActionObserver currently only writes to the
--     `admin_audit` log channel (a file), not a table. A queryable table
--     would help if the admin "Configuración" area ever needs an audit
--     trail view, but nothing reads it today.
--   * Normalizing `spaces.amenities` (JSON) into an `amenities` +
--     `space_amenity` pivot — only worth it if/when search needs to filter
--     listings by specific amenity. The JSON column works fine for display.
--   * `payment_methods` (saved cards/accounts) — deferred until an actual
--     payment gateway integration is chosen; `payments.payment_method` /
--     `gateway` columns above are enough to record what happened without
--     committing to a gateway's tokenization model yet.
-- =============================================================================
