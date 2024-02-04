/*
  Warnings:

  - You are about to drop the column `keyboard_standard_link_buttons_supported` on the `channel_settings` table. All the data in the column will be lost.
  - You are about to drop the column `keyboard_standard_max_button_characters` on the `channel_settings` table. All the data in the column will be lost.
  - You are about to drop the column `keyboard_standard_max_buttons` on the `channel_settings` table. All the data in the column will be lost.
  - You are about to drop the column `channel_value` on the `keyboard_buttons` table. All the data in the column will be lost.
  - Made the column `channelValuesId` on table `keyboard_buttons` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "keyboard_buttons" DROP CONSTRAINT "keyboard_buttons_channelValuesId_fkey";

-- AlterTable
ALTER TABLE "channel_settings" DROP COLUMN "keyboard_standard_link_buttons_supported",
DROP COLUMN "keyboard_standard_max_button_characters",
DROP COLUMN "keyboard_standard_max_buttons",
ADD COLUMN     "keyboard_inline_supported" BOOLEAN,
ADD COLUMN     "keyboard_standart_link_buttons_supported" BOOLEAN,
ADD COLUMN     "keyboard_standart_max_button_characters" INTEGER,
ADD COLUMN     "keyboard_standart_max_buttons" INTEGER,
ADD COLUMN     "keyboard_standart_supported" BOOLEAN,
ADD COLUMN     "linkButtonsLimit" INTEGER;

-- AlterTable
ALTER TABLE "keyboard_buttons" DROP COLUMN "channel_value",
ALTER COLUMN "channelValuesId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "keyboard_buttons" ADD CONSTRAINT "keyboard_buttons_channelValuesId_fkey" FOREIGN KEY ("channelValuesId") REFERENCES "channel_values"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
