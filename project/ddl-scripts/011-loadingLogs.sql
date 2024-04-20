DO $$ BEGIN

CREATE TABLE IF NOT EXISTS public."loading_logs" (
	id TEXT DEFAULT uuid_generate_v1()
);

EXECUTE public.checkPrimaryKey('loading_logs', 'loading_logs_pk');

EXECUTE public.ensureTextFieldinTable('loading_logs', 'mover_id');
ALTER TABLE public."loading_logs" ALTER COLUMN "mover_id" SET NOT NULL;

EXECUTE public.ensureTextFieldinTable('loading_logs', 'item_id');
ALTER TABLE public."loading_logs" ALTER COLUMN "item_id" SET NOT NULL;
IF public.getFieldType('loading_logs', 'item_id')  != 'ARRAY' THEN
ALTER TABLE public."loading_logs"
ALTER COLUMN "item_id" TYPE TEXT [] USING "item_id"::TEXT [];
END IF;

EXECUTE public.ensureTextFieldinTable('loading_logs', 'createDate');
IF public.getFieldType('loading_logs', 'createDate') != 'TIMESTAMP' THEN
ALTER TABLE public."loading_logs"
ALTER COLUMN "createDate" TYPE TIMESTAMP USING "createDate"::TIMESTAMP;
END IF;
ALTER TABLE public."loading_logs" ALTER COLUMN "createDate" SET DEFAULT CURRENT_TIMESTAMP;


END $$
