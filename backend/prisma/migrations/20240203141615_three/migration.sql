-- AlterTable
ALTER TABLE "channel_values" ALTER COLUMN "text" SET DEFAULT '';

-- AlterTable
ALTER TABLE "keyboard_buttons" ALTER COLUMN "type" SET DEFAULT 'quick_reply',
ALTER COLUMN "text" SET DEFAULT '',
ALTER COLUMN "url" SET DEFAULT '';
