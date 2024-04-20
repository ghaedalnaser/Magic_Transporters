DO $$ BEGIN

CREATE TABLE IF NOT EXISTS public."mission" (
	id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE public.checkPrimaryKey('mission', 'mission_pk');

EXECUTE public.ensureTextFieldinTable('mission', 'mover_id');
ALTER TABLE public."mission" ALTER COLUMN "mover_id" SET NOT NULL;
EXECUTE public.checkForeignkey('mission','mission_fk','mover_id','magic_mover','id');


EXECUTE public.ensureTextFieldinTable('mission', 'start_time');
IF public.getFieldType('mission', 'start_time') != 'TIMESTAMP' THEN
ALTER TABLE public."mission"
ALTER COLUMN "start_time" TYPE TIMESTAMP USING "start_time"::TIMESTAMP;
END IF;
ALTER TABLE public."mission" ALTER COLUMN "start_time" SET DEFAULT CURRENT_TIMESTAMP;

EXECUTE public.ensureTextFieldinTable('mission', 'end_time');
IF public.getFieldType('mission', 'end_time') != 'TIMESTAMP' THEN
ALTER TABLE public."mission"
ALTER COLUMN "end_time" TYPE TIMESTAMP USING "end_time"::TIMESTAMP;
END IF;

END $$