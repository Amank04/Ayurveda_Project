-- DROP TABLE IF EXISTS public.prakirtiinfo;

CREATE TABLE IF NOT EXISTS public.prakirtiinfo
(
    id integer NOT NULL DEFAULT nextval('prakirtiinfo_id_seq'::regclass),
    name text COLLATE pg_catalog."default",
    age text COLLATE pg_catalog."default",
    gender text COLLATE pg_catalog."default",
    birthplace text COLLATE pg_catalog."default",
    prakirtimajor text COLLATE pg_catalog."default",
    prakirtiminor text COLLATE pg_catalog."default",
    ques01 text COLLATE pg_catalog."default",
    ques02 text COLLATE pg_catalog."default",
    ques03 text COLLATE pg_catalog."default",
    ques04 text COLLATE pg_catalog."default",
    ques05 text COLLATE pg_catalog."default",
    ques06 text COLLATE pg_catalog."default",
    ques07 text COLLATE pg_catalog."default",
    ques08 text COLLATE pg_catalog."default",
    ques09 text COLLATE pg_catalog."default",
    ques10 text COLLATE pg_catalog."default",
    CONSTRAINT prakirtiinfo_pkey PRIMARY KEY (id)
)

TABLESPACE pg_default;

ALTER TABLE IF EXISTS public.prakirtiinfo
    OWNER to postgres;