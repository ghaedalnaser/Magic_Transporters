DO $$ BEGIN

CREATE TABLE IF NOT EXISTS public."magic_item" (
	id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE public.checkPrimaryKey('magic_item', 'magic_item_pk');

EXECUTE public.ensureTextFieldinTable('magic_item', 'name');
ALTER TABLE public."magic_item" ALTER COLUMN "name" SET NOT NULL;

EXECUTE public.ensureNumericFieldinTable('magic_item', 'weight');
ALTER TABLE public."magic_item" ALTER COLUMN "weight" SET NOT NULL;


END $$
