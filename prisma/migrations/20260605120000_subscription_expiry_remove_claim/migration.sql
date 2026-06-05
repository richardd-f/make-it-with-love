-- Add subscription expiry date (1-month active window)
ALTER TABLE "users_subscriptions" ADD COLUMN "end_date" TIMESTAMP(3);

-- Backfill existing active subscriptions with a 30-day window from their start date
UPDATE "users_subscriptions"
SET "end_date" = "start_date" + INTERVAL '30 days'
WHERE "status" = 'active';

-- Remove the deprecated "claim 3 courses" quota
ALTER TABLE "users_subscriptions" DROP COLUMN "courses_claimed_left";
