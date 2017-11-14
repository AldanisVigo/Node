--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.9
-- Dumped by pg_dump version 9.5.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: nonces; Type: TABLE; Schema: public; Owner: danny
--

CREATE TABLE nonces (
    id integer NOT NULL,
    nonce character varying(256),
    email character varying(30),
    expires timestamp without time zone
);


ALTER TABLE nonces OWNER TO danny;

--
-- Name: nonces_id_seq; Type: SEQUENCE; Schema: public; Owner: danny
--

CREATE SEQUENCE nonces_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE nonces_id_seq OWNER TO danny;

--
-- Name: nonces_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: danny
--

ALTER SEQUENCE nonces_id_seq OWNED BY nonces.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: danny
--

CREATE TABLE users (
    id integer NOT NULL,
    fname character varying(30),
    lname character varying(30),
    email character varying(30),
    password character varying(256)
);


ALTER TABLE users OWNER TO danny;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: danny
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_id_seq OWNER TO danny;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: danny
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: danny
--

ALTER TABLE ONLY nonces ALTER COLUMN id SET DEFAULT nextval('nonces_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: danny
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: nonces; Type: TABLE DATA; Schema: public; Owner: danny
--

COPY nonces (id, nonce, email, expires) FROM stdin;
\.


--
-- Name: nonces_id_seq; Type: SEQUENCE SET; Schema: public; Owner: danny
--

SELECT pg_catalog.setval('nonces_id_seq', 43, true);


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: danny
--

COPY users (id, fname, lname, email, password) FROM stdin;
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: danny
--

SELECT pg_catalog.setval('users_id_seq', 4, true);


--
-- Name: nonces_pkey; Type: CONSTRAINT; Schema: public; Owner: danny
--

ALTER TABLE ONLY nonces
    ADD CONSTRAINT nonces_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: danny
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

