DO $$ BEGIN

CREATE TABLE IF NOT EXISTS public."magic_mover" (
	id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE public.checkPrimaryKey('magic_mover', 'magic_over_pk');

EXECUTE public.ensureNumericFieldinTable('magic_mover', 'weight_limit');
ALTER TABLE public."magic_mover" ALTER COLUMN "weight_limit" SET NOT NULL;

EXECUTE public.ensureNumericFieldinTable('magic_mover', 'energy');
ALTER TABLE public."magic_mover" ALTER COLUMN "energy" SET NOT NULL;

EXECUTE public.ensureTextFieldinTable('magic_mover', 'quest_state');
ALTER TABLE public."magic_mover" ALTER COLUMN "quest_state" SET NOT NULL;
ALTER TABLE public."magic_mover" ALTER COLUMN "quest_state" SET DEFAULT  'resting';



END $$
