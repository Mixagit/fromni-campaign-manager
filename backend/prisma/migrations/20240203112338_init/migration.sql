-- CreateTable
CREATE TABLE "channel_settings" (
    "id" SERIAL NOT NULL,
    "channel_name" TEXT NOT NULL,
    "message_max_characters" INTEGER,
    "keyboard_standard_max_buttons" INTEGER,
    "keyboard_standard_max_button_characters" INTEGER,
    "keyboard_standard_link_buttons_supported" BOOLEAN,
    "keyboard_inline_max_buttons" INTEGER,
    "keyboard_inline_max_button_characters" INTEGER,
    "keyboard_inline_link_buttons_supported" BOOLEAN,

    CONSTRAINT "channel_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "channel_values" (
    "id" SERIAL NOT NULL,
    "text" TEXT,
    "channel_id" INTEGER NOT NULL,

    CONSTRAINT "channel_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "keyboard_buttons" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "text" TEXT,
    "url" TEXT,
    "channel_value" INTEGER NOT NULL,
    "channelValuesId" INTEGER,

    CONSTRAINT "keyboard_buttons_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "channel_settings_channel_name_key" ON "channel_settings"("channel_name");

-- AddForeignKey
ALTER TABLE "channel_values" ADD CONSTRAINT "channel_values_channel_id_fkey" FOREIGN KEY ("channel_id") REFERENCES "channel_settings"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "keyboard_buttons" ADD CONSTRAINT "keyboard_buttons_channelValuesId_fkey" FOREIGN KEY ("channelValuesId") REFERENCES "channel_values"("id") ON DELETE SET NULL ON UPDATE CASCADE;
