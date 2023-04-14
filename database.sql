//CREATE DATABASE antisonnik;

CREATE TABLE dreams(
  doc_id SERIAL,
  user_id character varying(255) NOT NULL,
  dream_id character varying(255) NOT NULL,
  role character varying(50),
  gender character varying(20),
  content character varying,
  content_eng character varying,
  dream character varying,
  created_at timestamp without time zone NOT NULL DEFAULT now(),
  CONSTRAINT dreams_pkey PRIMARY KEY (doc_id)
);