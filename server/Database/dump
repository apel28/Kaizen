--
-- PostgreSQL database dump
--

\restrict cEXYBxhbgJxMkiVg6HtAWtgIqa3qnCTJUwbVqyvAu4roNULxqQ1nX5HeTne4xy3

-- Dumped from database version 14.20 (Homebrew)
-- Dumped by pg_dump version 14.20 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: refresh_token_cleanup(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.refresh_token_cleanup() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN	
	DELETE FROM refresh_tokens
	WHERE expires_at < NOW();
	
	DELETE FROM refresh_tokens
	WHERE user_id = NEW.user_id
		AND token_id <> NEW.token_id;
		
	RETURN NULL;
END;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: admit_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admit_queue (
    admission_id bigint NOT NULL,
    date date NOT NULL,
    department_id integer NOT NULL,
    priority numeric(1,0) NOT NULL
);


--
-- Name: admitted; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.admitted (
    ad_id bigint NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    department_id integer NOT NULL,
    ward_id integer NOT NULL,
    room_id integer NOT NULL,
    bed_id integer NOT NULL
);


--
-- Name: admitted_ad_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.admitted_ad_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admitted_ad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.admitted_ad_id_seq OWNED BY public.admitted.ad_id;


--
-- Name: all_medicines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.all_medicines (
    medicine_id bigint NOT NULL,
    name text NOT NULL,
    brand text NOT NULL,
    generic_name text NOT NULL,
    ppu real NOT NULL
);


--
-- Name: all_medicines_medicine_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.all_medicines_medicine_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: all_medicines_medicine_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.all_medicines_medicine_id_seq OWNED BY public.all_medicines.medicine_id;


--
-- Name: all_test; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.all_test (
    test_id bigint NOT NULL,
    test_name text NOT NULL,
    price integer NOT NULL
);


--
-- Name: all_test_test_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.all_test_test_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: all_test_test_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.all_test_test_id_seq OWNED BY public.all_test.test_id;


--
-- Name: allergy; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.allergy (
    patient_id integer NOT NULL,
    allergy_trigger text NOT NULL,
    trigger_meds text,
    severity numeric(1,0) NOT NULL
);


--
-- Name: appoinment_queue; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appoinment_queue (
    appq_id bigint NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    department_id integer NOT NULL
);


--
-- Name: appoinment_queue_appq_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.appoinment_queue_appq_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: appoinment_queue_appq_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.appoinment_queue_appq_id_seq OWNED BY public.appoinment_queue.appq_id;


--
-- Name: appointments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.appointments (
    app_id bigint NOT NULL,
    doctor_id integer NOT NULL,
    patient_id integer NOT NULL,
    date date NOT NULL,
    slot_time time without time zone NOT NULL,
    queue numeric(1,0) NOT NULL
);


--
-- Name: appoinments_app_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.appoinments_app_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: appoinments_app_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.appoinments_app_id_seq OWNED BY public.appointments.app_id;


--
-- Name: attendance; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.attendance (
    at_id integer NOT NULL,
    user_id character varying(10) NOT NULL,
    date date NOT NULL,
    start_time time without time zone NOT NULL,
    end_time time without time zone NOT NULL
);


--
-- Name: attendance_at_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.attendance_at_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: attendance_at_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.attendance_at_id_seq OWNED BY public.attendance.at_id;


--
-- Name: availability; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.availability (
    a_id integer NOT NULL,
    doctor_id integer NOT NULL,
    week_day character varying(3) NOT NULL,
    slot_time time without time zone NOT NULL,
    slot_duration_minutes integer DEFAULT 30 NOT NULL,
    CONSTRAINT availability_slot_duration_minutes_check CHECK ((slot_duration_minutes > 0)),
    CONSTRAINT availability_week_day_check CHECK (((week_day)::text = ANY ((ARRAY['SUN'::character varying, 'MON'::character varying, 'TUE'::character varying, 'WED'::character varying, 'THU'::character varying, 'FRI'::character varying, 'SAT'::character varying])::text[])))
);


--
-- Name: availability_a_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.availability_a_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: availability_a_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.availability_a_id_seq OWNED BY public.availability.a_id;


--
-- Name: bed; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bed (
    bed_id integer NOT NULL,
    room_id integer NOT NULL,
    occupied character(1) NOT NULL,
    CONSTRAINT bed_occupied_check CHECK ((occupied = ANY (ARRAY['y'::bpchar, 'n'::bpchar])))
);


--
-- Name: bed_bed_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.bed_bed_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: bed_bed_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.bed_bed_id_seq OWNED BY public.bed.bed_id;


--
-- Name: bills; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.bills (
    bill_id bigint NOT NULL,
    patient_id integer NOT NULL,
    bill_name text NOT NULL,
    bill_amount integer NOT NULL
);


--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    department_id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: departments_department_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departments_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departments_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departments_department_id_seq OWNED BY public.departments.department_id;


--
-- Name: diagnosis; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.diagnosis (
    diagnosis_id bigint NOT NULL,
    history_id bigint NOT NULL,
    visit_id bigint NOT NULL
);


--
-- Name: diagnosis_diagnosis_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.diagnosis_diagnosis_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: diagnosis_diagnosis_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.diagnosis_diagnosis_id_seq OWNED BY public.diagnosis.diagnosis_id;


--
-- Name: discharge_summary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.discharge_summary (
    admission_id bigint NOT NULL,
    date date NOT NULL,
    note text
);


--
-- Name: doctor; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctor (
    doctor_id integer NOT NULL,
    user_id character varying(10)
);


--
-- Name: doctor_department; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.doctor_department (
    doctor_id integer NOT NULL,
    department_id integer NOT NULL
);


--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.doctor_doctor_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.doctor_doctor_id_seq OWNED BY public.doctor.doctor_id;


--
-- Name: emergency; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.emergency (
    emer_id bigint NOT NULL,
    patient_id integer NOT NULL,
    department_id integer NOT NULL
);


--
-- Name: emergency_emer_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.emergency_emer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: emergency_emer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.emergency_emer_id_seq OWNED BY public.emergency.emer_id;


--
-- Name: equipment; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.equipment (
    equipment_id integer NOT NULL,
    room_id integer NOT NULL
);


--
-- Name: equipment_list; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.equipment_list (
    equipment_id integer NOT NULL,
    name text NOT NULL
);


--
-- Name: experience; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.experience (
    e_id integer NOT NULL,
    doctor_id integer NOT NULL,
    institue text NOT NULL,
    role text NOT NULL,
    start_date date NOT NULL,
    end_date date NOT NULL
);


--
-- Name: experience_e_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.experience_e_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: experience_e_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.experience_e_id_seq OWNED BY public.experience.e_id;


--
-- Name: family_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.family_history (
    patient_id integer NOT NULL,
    relative_relation text NOT NULL,
    condition text NOT NULL,
    effect text NOT NULL
);


--
-- Name: medical_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medical_history (
    history_id bigint NOT NULL,
    patient_id integer NOT NULL,
    condition text NOT NULL,
    department_id integer NOT NULL,
    status character(1),
    CONSTRAINT medical_history_status_check CHECK ((status = ANY (ARRAY['a'::bpchar, 'i'::bpchar, 'd'::bpchar])))
);


--
-- Name: medicines; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.medicines (
    patient_id integer NOT NULL,
    medicine_id bigint NOT NULL,
    history_id bigint NOT NULL
);


--
-- Name: notification; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notification (
    noti_id bigint NOT NULL,
    "from" character varying(10),
    message text NOT NULL,
    user_id character varying(10) NOT NULL
);


--
-- Name: notification_noti_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.notification_noti_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: notification_noti_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.notification_noti_id_seq OWNED BY public.notification.noti_id;


--
-- Name: nurse; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.nurse (
    nurse_id integer NOT NULL,
    user_id character varying(10) NOT NULL
);


--
-- Name: nurse_nurse_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.nurse_nurse_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: nurse_nurse_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.nurse_nurse_id_seq OWNED BY public.nurse.nurse_id;


--
-- Name: order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."order" (
    medicine_id bigint NOT NULL,
    amount integer NOT NULL
);


--
-- Name: patient; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.patient (
    patient_id integer NOT NULL,
    user_id character varying(10)
);


--
-- Name: patient_patient_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.patient_patient_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: patient_patient_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.patient_patient_id_seq OWNED BY public.patient.patient_id;


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    pay_id integer NOT NULL,
    user_id character varying(10),
    date date NOT NULL,
    amount real NOT NULL
);


--
-- Name: payments_pay_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.payments_pay_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: payments_pay_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.payments_pay_id_seq OWNED BY public.payments.pay_id;


--
-- Name: prescription; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.prescription (
    pres_id bigint NOT NULL,
    patient_id integer NOT NULL,
    visit_id bigint NOT NULL,
    note text
);


--
-- Name: prescription_pres_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.prescription_pres_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: prescription_pres_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.prescription_pres_id_seq OWNED BY public.prescription.pres_id;


--
-- Name: procedure_plan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.procedure_plan (
    pp_id bigint NOT NULL,
    procedure text NOT NULL,
    plan_id bigint NOT NULL
);


--
-- Name: procedure_plan_pp_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.procedure_plan_pp_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: procedure_plan_pp_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.procedure_plan_pp_id_seq OWNED BY public.procedure_plan.pp_id;


--
-- Name: profile; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.profile (
    user_id character varying(10) NOT NULL,
    first_name text NOT NULL,
    middle_name text,
    last_name text NOT NULL,
    date_of_birth date NOT NULL,
    address text,
    contact_info character varying(11) NOT NULL,
    emergency_contact character varying(11),
    gender text,
    nid character varying(17) NOT NULL,
    nationality text,
    CONSTRAINT profile_gender_check CHECK ((upper(gender) = ANY (ARRAY['MALE'::text, 'FEMALE'::text, 'OTHERS'::text])))
);


--
-- Name: qualifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.qualifications (
    q_id integer NOT NULL,
    doctor_id integer NOT NULL,
    degree_name text NOT NULL,
    institute text NOT NULL,
    year integer NOT NULL,
    department_name text
);


--
-- Name: qualifications_q_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.qualifications_q_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: qualifications_q_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.qualifications_q_id_seq OWNED BY public.qualifications.q_id;


--
-- Name: refresh_tokens; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.refresh_tokens (
    token_id bigint NOT NULL,
    user_id text NOT NULL,
    token_hash text NOT NULL,
    created_at timestamp without time zone DEFAULT now(),
    expires_at timestamp without time zone NOT NULL,
    ipaddress inet
);


--
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.refresh_tokens_token_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.refresh_tokens_token_id_seq OWNED BY public.refresh_tokens.token_id;


--
-- Name: role; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role (
    user_id character varying(10) NOT NULL,
    role_id numeric(1,0) NOT NULL
);


--
-- Name: room; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.room (
    room_id integer NOT NULL,
    ward_id integer NOT NULL
);


--
-- Name: room_room_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.room_room_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: room_room_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.room_room_id_seq OWNED BY public.room.room_id;


--
-- Name: salary; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.salary (
    user_id character varying(10) NOT NULL,
    salary real NOT NULL,
    commission real NOT NULL
);


--
-- Name: staff; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.staff (
    staff_id integer NOT NULL,
    user_id character varying(10) NOT NULL
);


--
-- Name: staff_staff_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.staff_staff_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: staff_staff_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.staff_staff_id_seq OWNED BY public.staff.staff_id;


--
-- Name: stock; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.stock (
    medicine_id bigint NOT NULL,
    amount integer NOT NULL
);


--
-- Name: test_order; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_order (
    t_id bigint NOT NULL,
    test_id bigint NOT NULL,
    patient_id integer NOT NULL,
    priority numeric(1,0) NOT NULL
);


--
-- Name: test_order_t_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_order_t_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_order_t_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_order_t_id_seq OWNED BY public.test_order.t_id;


--
-- Name: test_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_orders (
    order_id bigint NOT NULL,
    test_id bigint NOT NULL,
    patient_id integer NOT NULL,
    visit_id integer NOT NULL
);


--
-- Name: test_orders_order_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_orders_order_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_orders_order_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_orders_order_id_seq OWNED BY public.test_orders.order_id;


--
-- Name: test_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.test_reports (
    report_id bigint NOT NULL,
    patient_id integer NOT NULL,
    report_path text NOT NULL
);


--
-- Name: test_reports_report_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.test_reports_report_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: test_reports_report_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.test_reports_report_id_seq OWNED BY public.test_reports.report_id;


--
-- Name: treatment_plan; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.treatment_plan (
    plan_id bigint NOT NULL,
    patient_id integer NOT NULL,
    history_id bigint NOT NULL
);


--
-- Name: treatment_plan_plan_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.treatment_plan_plan_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: treatment_plan_plan_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.treatment_plan_plan_id_seq OWNED BY public.treatment_plan.plan_id;


--
-- Name: user; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."user" (
    user_id character varying(10) NOT NULL,
    password text NOT NULL,
    email text NOT NULL,
    CONSTRAINT user_email_check CHECK ((email ~~ '%@%'::text)),
    CONSTRAINT user_password_check CHECK ((length(password) >= 8)),
    CONSTRAINT user_user_id_check CHECK ((length((user_id)::text) = 10))
);


--
-- Name: visits; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.visits (
    visit_id bigint NOT NULL,
    patient_id integer NOT NULL,
    doctor_id integer NOT NULL,
    date date NOT NULL,
    admission_id bigint
);


--
-- Name: visits_visit_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.visits_visit_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: visits_visit_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.visits_visit_id_seq OWNED BY public.visits.visit_id;


--
-- Name: vitals; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.vitals (
    visit_id bigint NOT NULL,
    patient_id integer NOT NULL,
    bp character varying(7),
    blood_sugar real,
    heart_rate integer,
    height real,
    weight real
);


--
-- Name: ward; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.ward (
    ward_id integer NOT NULL,
    department_id integer NOT NULL,
    ward_number integer NOT NULL
);


--
-- Name: ward_ward_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.ward_ward_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: ward_ward_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.ward_ward_id_seq OWNED BY public.ward.ward_id;


--
-- Name: admitted ad_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted ALTER COLUMN ad_id SET DEFAULT nextval('public.admitted_ad_id_seq'::regclass);


--
-- Name: all_medicines medicine_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.all_medicines ALTER COLUMN medicine_id SET DEFAULT nextval('public.all_medicines_medicine_id_seq'::regclass);


--
-- Name: all_test test_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.all_test ALTER COLUMN test_id SET DEFAULT nextval('public.all_test_test_id_seq'::regclass);


--
-- Name: appoinment_queue appq_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appoinment_queue ALTER COLUMN appq_id SET DEFAULT nextval('public.appoinment_queue_appq_id_seq'::regclass);


--
-- Name: appointments app_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments ALTER COLUMN app_id SET DEFAULT nextval('public.appoinments_app_id_seq'::regclass);


--
-- Name: attendance at_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance ALTER COLUMN at_id SET DEFAULT nextval('public.attendance_at_id_seq'::regclass);


--
-- Name: availability a_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.availability ALTER COLUMN a_id SET DEFAULT nextval('public.availability_a_id_seq'::regclass);


--
-- Name: bed bed_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bed ALTER COLUMN bed_id SET DEFAULT nextval('public.bed_bed_id_seq'::regclass);


--
-- Name: departments department_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments ALTER COLUMN department_id SET DEFAULT nextval('public.departments_department_id_seq'::regclass);


--
-- Name: diagnosis diagnosis_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis ALTER COLUMN diagnosis_id SET DEFAULT nextval('public.diagnosis_diagnosis_id_seq'::regclass);


--
-- Name: doctor doctor_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor ALTER COLUMN doctor_id SET DEFAULT nextval('public.doctor_doctor_id_seq'::regclass);


--
-- Name: emergency emer_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency ALTER COLUMN emer_id SET DEFAULT nextval('public.emergency_emer_id_seq'::regclass);


--
-- Name: experience e_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience ALTER COLUMN e_id SET DEFAULT nextval('public.experience_e_id_seq'::regclass);


--
-- Name: notification noti_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification ALTER COLUMN noti_id SET DEFAULT nextval('public.notification_noti_id_seq'::regclass);


--
-- Name: nurse nurse_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nurse ALTER COLUMN nurse_id SET DEFAULT nextval('public.nurse_nurse_id_seq'::regclass);


--
-- Name: patient patient_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient ALTER COLUMN patient_id SET DEFAULT nextval('public.patient_patient_id_seq'::regclass);


--
-- Name: payments pay_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments ALTER COLUMN pay_id SET DEFAULT nextval('public.payments_pay_id_seq'::regclass);


--
-- Name: prescription pres_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescription ALTER COLUMN pres_id SET DEFAULT nextval('public.prescription_pres_id_seq'::regclass);


--
-- Name: procedure_plan pp_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.procedure_plan ALTER COLUMN pp_id SET DEFAULT nextval('public.procedure_plan_pp_id_seq'::regclass);


--
-- Name: qualifications q_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifications ALTER COLUMN q_id SET DEFAULT nextval('public.qualifications_q_id_seq'::regclass);


--
-- Name: refresh_tokens token_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens ALTER COLUMN token_id SET DEFAULT nextval('public.refresh_tokens_token_id_seq'::regclass);


--
-- Name: room room_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room ALTER COLUMN room_id SET DEFAULT nextval('public.room_room_id_seq'::regclass);


--
-- Name: staff staff_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff ALTER COLUMN staff_id SET DEFAULT nextval('public.staff_staff_id_seq'::regclass);


--
-- Name: test_order t_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_order ALTER COLUMN t_id SET DEFAULT nextval('public.test_order_t_id_seq'::regclass);


--
-- Name: test_orders order_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_orders ALTER COLUMN order_id SET DEFAULT nextval('public.test_orders_order_id_seq'::regclass);


--
-- Name: test_reports report_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_reports ALTER COLUMN report_id SET DEFAULT nextval('public.test_reports_report_id_seq'::regclass);


--
-- Name: treatment_plan plan_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.treatment_plan ALTER COLUMN plan_id SET DEFAULT nextval('public.treatment_plan_plan_id_seq'::regclass);


--
-- Name: visits visit_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits ALTER COLUMN visit_id SET DEFAULT nextval('public.visits_visit_id_seq'::regclass);


--
-- Name: ward ward_id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ward ALTER COLUMN ward_id SET DEFAULT nextval('public.ward_ward_id_seq'::regclass);


--
-- Data for Name: admit_queue; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admit_queue (admission_id, date, department_id, priority) FROM stdin;
\.


--
-- Data for Name: admitted; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.admitted (ad_id, patient_id, doctor_id, department_id, ward_id, room_id, bed_id) FROM stdin;
\.


--
-- Data for Name: all_medicines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.all_medicines (medicine_id, name, brand, generic_name, ppu) FROM stdin;
\.


--
-- Data for Name: all_test; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.all_test (test_id, test_name, price) FROM stdin;
\.


--
-- Data for Name: allergy; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.allergy (patient_id, allergy_trigger, trigger_meds, severity) FROM stdin;
\.


--
-- Data for Name: appoinment_queue; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.appoinment_queue (appq_id, patient_id, doctor_id, department_id) FROM stdin;
\.


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.appointments (app_id, doctor_id, patient_id, date, slot_time, queue) FROM stdin;
\.


--
-- Data for Name: attendance; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.attendance (at_id, user_id, date, start_time, end_time) FROM stdin;
\.


--
-- Data for Name: availability; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.availability (a_id, doctor_id, week_day, slot_time, slot_duration_minutes) FROM stdin;
\.


--
-- Data for Name: bed; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bed (bed_id, room_id, occupied) FROM stdin;
\.


--
-- Data for Name: bills; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.bills (bill_id, patient_id, bill_name, bill_amount) FROM stdin;
\.


--
-- Data for Name: departments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.departments (department_id, name) FROM stdin;
\.


--
-- Data for Name: diagnosis; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.diagnosis (diagnosis_id, history_id, visit_id) FROM stdin;
\.


--
-- Data for Name: discharge_summary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.discharge_summary (admission_id, date, note) FROM stdin;
\.


--
-- Data for Name: doctor; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.doctor (doctor_id, user_id) FROM stdin;
1	Ps6gLzBv6n
2	1O5jk0V99Z
3	10PPrdkMC5
4	1re53KWLfw
5	1NaS726wGR
6	1L8Hh0ufwi
\.


--
-- Data for Name: doctor_department; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.doctor_department (doctor_id, department_id) FROM stdin;
\.


--
-- Data for Name: emergency; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.emergency (emer_id, patient_id, department_id) FROM stdin;
\.


--
-- Data for Name: equipment; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.equipment (equipment_id, room_id) FROM stdin;
\.


--
-- Data for Name: equipment_list; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.equipment_list (equipment_id, name) FROM stdin;
\.


--
-- Data for Name: experience; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.experience (e_id, doctor_id, institue, role, start_date, end_date) FROM stdin;
\.


--
-- Data for Name: family_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.family_history (patient_id, relative_relation, condition, effect) FROM stdin;
\.


--
-- Data for Name: medical_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medical_history (history_id, patient_id, condition, department_id, status) FROM stdin;
\.


--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.medicines (patient_id, medicine_id, history_id) FROM stdin;
\.


--
-- Data for Name: notification; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notification (noti_id, "from", message, user_id) FROM stdin;
\.


--
-- Data for Name: nurse; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.nurse (nurse_id, user_id) FROM stdin;
1	3CCHZXAUEu
2	30AwHB87rU
\.


--
-- Data for Name: order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."order" (medicine_id, amount) FROM stdin;
\.


--
-- Data for Name: patient; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.patient (patient_id, user_id) FROM stdin;
1	2Hz8yR9cCu
2	2MzNw87diL
3	2XfXBvI852
4	2rqZbg4vq9
5	2ZlqmGbg12
6	2TnOKTclkl
7	2UV5bSjaFs
8	27viUPfHye
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (pay_id, user_id, date, amount) FROM stdin;
\.


--
-- Data for Name: prescription; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.prescription (pres_id, patient_id, visit_id, note) FROM stdin;
\.


--
-- Data for Name: procedure_plan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.procedure_plan (pp_id, procedure, plan_id) FROM stdin;
\.


--
-- Data for Name: profile; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.profile (user_id, first_name, middle_name, last_name, date_of_birth, address, contact_info, emergency_contact, gender, nid, nationality) FROM stdin;
Ps6gLzBv6n	Saurav	Admin	Rahman	2001-05-14	Dhaka, Bangladesh	01712345678	01887654321	Male	12345678901234567	Bangladeshi
1O5jk0V99Z	Alice	\N	Smith	1980-01-10	\N	01710000001	\N	FEMALE	12345678901	Bangladeshi
10PPrdkMC5	Bob	\N	Johnson	1978-02-15	\N	01710000002	\N	MALE	12345678902	Bangladeshi
1re53KWLfw	Charlie	\N	Brown	1985-03-20	\N	01710000003	\N	MALE	12345678903	Bangladeshi
1NaS726wGR	Diana	\N	Williams	1982-04-25	\N	01710000004	\N	FEMALE	12345678904	Bangladeshi
1L8Hh0ufwi	Md	Shakibul	Arefin	2003-04-25	\N	01710000004	\N	MALE	12345678905	Bangladeshi
2Hz8yR9cCu	John	\N	Doe	2000-05-10	\N	01720000001	\N	MALE	22345678901	Bangladeshi
2MzNw87diL	Jane	\N	Doe	2001-06-15	\N	01720000002	\N	FEMALE	22345678902	Bangladeshi
2XfXBvI852	Mike	\N	Taylor	1999-07-20	\N	01720000003	\N	MALE	22345678903	Bangladeshi
2rqZbg4vq9	Lucy	\N	Adams	2002-08-10	\N	01720000004	\N	FEMALE	22345678904	Bangladeshi
2ZlqmGbg12	Peter	\N	Parker	2000-09-05	\N	01720000005	\N	MALE	22345678905	Bangladeshi
2TnOKTclkl	Mary	\N	Jane	2001-10-12	\N	01720000006	\N	FEMALE	22345678906	Bangladeshi
3CCHZXAUEu	Nancy	\N	White	1990-01-10	\N	01730000001	\N	FEMALE	32345678901	Bangladeshi
30AwHB87rU	George	\N	King	1988-02-12	\N	01730000002	\N	MALE	32345678902	Bangladeshi
4TkRe98j4X	Sam	\N	Brown	1985-03-01	\N	01740000001	\N	MALE	42345678901	Bangladeshi
4dqCeH3T0N	Lisa	\N	Green	1992-04-05	\N	01740000002	\N	FEMALE	42345678902	Bangladeshi
2UV5bSjaFs	Proteek	\N	Rosul	2000-03-03	BUET-1000	01333333333	\N	male	21414325234324	Bangladeshi
27viUPfHye	Saurav	Nigga	Gay	2069-03-03	\N	6969696869	696	female	696969696969	Gay
\.


--
-- Data for Name: qualifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.qualifications (q_id, doctor_id, degree_name, institute, year, department_name) FROM stdin;
\.


--
-- Data for Name: refresh_tokens; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.refresh_tokens (token_id, user_id, token_hash, created_at, expires_at, ipaddress) FROM stdin;
35	2UV5bSjaFs	$2b$12$WKauZEwvxCo4WxfOU5owQ.LkFRahp03S2xhvH/ephbdolbZAYnjSy	2026-03-14 03:19:02.353689	2026-03-21 03:19:02.353	::ffff:127.0.0.1
44	1L8Hh0ufwi	$2b$12$PtQ/5eu8DojbCERAYZpaM.6LHCu7Tf.XSY2NYMagp7OZnyYcK1oPq	2026-03-17 21:44:11.661491	2026-03-24 21:44:11.66	::1
49	2MzNw87diL	$2b$12$JQODwGGLhkjgS7noUm0HL.kdSfaEJFlMjj5afV.z03qn.ysvi976G	2026-03-17 21:59:20.664541	2026-03-24 21:59:20.664	::1
\.


--
-- Data for Name: role; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.role (user_id, role_id) FROM stdin;
1O5jk0V99Z	1
10PPrdkMC5	1
1re53KWLfw	1
1NaS726wGR	1
1L8Hh0ufwi	1
2Hz8yR9cCu	2
2MzNw87diL	2
2XfXBvI852	2
2rqZbg4vq9	2
2ZlqmGbg12	2
2TnOKTclkl	2
3CCHZXAUEu	3
30AwHB87rU	3
4TkRe98j4X	4
4dqCeH3T0N	4
2UV5bSjaFs	2
27viUPfHye	2
\.


--
-- Data for Name: room; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.room (room_id, ward_id) FROM stdin;
\.


--
-- Data for Name: salary; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.salary (user_id, salary, commission) FROM stdin;
\.


--
-- Data for Name: staff; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.staff (staff_id, user_id) FROM stdin;
1	4TkRe98j4X
2	4dqCeH3T0N
\.


--
-- Data for Name: stock; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.stock (medicine_id, amount) FROM stdin;
\.


--
-- Data for Name: test_order; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_order (t_id, test_id, patient_id, priority) FROM stdin;
\.


--
-- Data for Name: test_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_orders (order_id, test_id, patient_id, visit_id) FROM stdin;
\.


--
-- Data for Name: test_reports; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.test_reports (report_id, patient_id, report_path) FROM stdin;
\.


--
-- Data for Name: treatment_plan; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.treatment_plan (plan_id, patient_id, history_id) FROM stdin;
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public."user" (user_id, password, email) FROM stdin;
Ps6gLzBv6n	$2b$12$6ayXy9KUxAMsBHDT01.Ae.JI8LHLiuOYIMfJbAvVDPxdf.7zbbsMO	saurav@example.com
1O5jk0V99Z	$2b$12$QMHk9NGu2cikLzYcZslcJO5Q66FPA8Qd6Ud.QeZ52c.G9GIN18BQC	alice1@example.com
10PPrdkMC5	$2b$12$fsP08X4AVrBQamYmwfk3iOnUn8.i2nLO4QSfmBskcYO3qr06CbZUS	bob@example.com
1re53KWLfw	$2b$12$OTyIOME4PpQ0G7SIfi9oAuifFYy.L4ZJR0xOsGoT1UZ9fTERlfrw6	charlie@example.com
1NaS726wGR	$2b$12$htQpGcM8cN0vwVJA3nYpLenZayvHO8xwiITzUHbvbVmhiMp3I87ym	diana@example.com
1L8Hh0ufwi	$2b$12$IOVxHK1KBf.XAtnSnaZTW.OJVQ.nslUghdzgxbVo03Wigci0XWMzC	shakib@example.com
2Hz8yR9cCu	$2b$12$VPRN2qaKtT1cVlVqFxFLsuRlBC7ErGpxNsLKnQGyy8qXeti6MxEdi	john@example.com
2MzNw87diL	$2b$12$mia4VILAT7LC.h6G0dI.6.nakKCyWxqonHqBxpt4nKcPl7eg//ZNe	jane@example.com
2XfXBvI852	$2b$12$DM4ERmKDfYR1Va2TM8H/3urD9AbaqSj2dovcv/.5F4ZGsZNXkjQdy	mike@example.com
2rqZbg4vq9	$2b$12$/nqWsXIAK7N8Dd/MGPe4supKwdoIOnlU/7lWmvJ6w63ktAHRWzAoO	lucy@example.com
2ZlqmGbg12	$2b$12$UWXxAv3SqnVYMKvVHp8keumw.nVqPoVH/tCG9uGs6JNFvX9rWSuz2	peter@example.com
2TnOKTclkl	$2b$12$7yh1md/E5BOSgXpfZFYVzeU1BOJImCFmyRDmdA.la7PMAEtgA8ZU.	mary@example.com
3CCHZXAUEu	$2b$12$aPeoKwurjlPj04jQiwTj2.85BJQ2bcCokKBx3jrZ19vdihXj60nM2	nancy@example.com
30AwHB87rU	$2b$12$sppZDTiu/xYOllO1cYrw8.itvR/Og.qeuPNPugzaci3PbNGIjmEY6	george@example.com
4TkRe98j4X	$2b$12$j1hgKIGfbRBln77XoXDJq.Zhj1zfPGHGU0.KnQWu1DShd5cRfV6um	sam@example.com
4dqCeH3T0N	$2b$12$2M7zCPGPL0m9pLw0yMbsve8jfUzMXotPalfO7O.1v8KFqoxPBRnUC	lisa@example.com
2UV5bSjaFs	$2b$12$6FG7dbzVUFkLD/UnZgXp/uYQLrPEVleIKFZzDOar.WraNIsFplbNK	proteek@example.com
27viUPfHye	$2b$12$C6aRJhMU2vtlC1iBay0R3O6e7h1p3ElFnl2mIBcRneF/pUKlpzyze	sauravniggagayyyy@gay.gay
\.


--
-- Data for Name: visits; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.visits (visit_id, patient_id, doctor_id, date, admission_id) FROM stdin;
1	2	3	2026-03-11	\N
\.


--
-- Data for Name: vitals; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.vitals (visit_id, patient_id, bp, blood_sugar, heart_rate, height, weight) FROM stdin;
1	2	128/27	4.6	80	80	90
\.


--
-- Data for Name: ward; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.ward (ward_id, department_id, ward_number) FROM stdin;
\.


--
-- Name: admitted_ad_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.admitted_ad_id_seq', 1, false);


--
-- Name: all_medicines_medicine_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.all_medicines_medicine_id_seq', 1, false);


--
-- Name: all_test_test_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.all_test_test_id_seq', 1, false);


--
-- Name: appoinment_queue_appq_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.appoinment_queue_appq_id_seq', 1, false);


--
-- Name: appoinments_app_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.appoinments_app_id_seq', 1, false);


--
-- Name: attendance_at_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.attendance_at_id_seq', 1, false);


--
-- Name: availability_a_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.availability_a_id_seq', 1, false);


--
-- Name: bed_bed_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.bed_bed_id_seq', 1, false);


--
-- Name: departments_department_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.departments_department_id_seq', 1, false);


--
-- Name: diagnosis_diagnosis_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.diagnosis_diagnosis_id_seq', 1, false);


--
-- Name: doctor_doctor_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.doctor_doctor_id_seq', 6, true);


--
-- Name: emergency_emer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.emergency_emer_id_seq', 1, false);


--
-- Name: experience_e_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.experience_e_id_seq', 1, false);


--
-- Name: notification_noti_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.notification_noti_id_seq', 1, false);


--
-- Name: nurse_nurse_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.nurse_nurse_id_seq', 2, true);


--
-- Name: patient_patient_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.patient_patient_id_seq', 8, true);


--
-- Name: payments_pay_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.payments_pay_id_seq', 1, false);


--
-- Name: prescription_pres_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.prescription_pres_id_seq', 1, false);


--
-- Name: procedure_plan_pp_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.procedure_plan_pp_id_seq', 1, false);


--
-- Name: qualifications_q_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.qualifications_q_id_seq', 1, false);


--
-- Name: refresh_tokens_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.refresh_tokens_token_id_seq', 49, true);


--
-- Name: room_room_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.room_room_id_seq', 1, false);


--
-- Name: staff_staff_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.staff_staff_id_seq', 2, true);


--
-- Name: test_order_t_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.test_order_t_id_seq', 1, false);


--
-- Name: test_orders_order_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.test_orders_order_id_seq', 1, false);


--
-- Name: test_reports_report_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.test_reports_report_id_seq', 1, false);


--
-- Name: treatment_plan_plan_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.treatment_plan_plan_id_seq', 1, false);


--
-- Name: visits_visit_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.visits_visit_id_seq', 1, false);


--
-- Name: ward_ward_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.ward_ward_id_seq', 1, false);


--
-- Name: admit_queue admit_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admit_queue
    ADD CONSTRAINT admit_queue_pkey PRIMARY KEY (admission_id);


--
-- Name: admitted admitted_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted
    ADD CONSTRAINT admitted_pkey PRIMARY KEY (ad_id);


--
-- Name: all_medicines all_medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.all_medicines
    ADD CONSTRAINT all_medicines_pkey PRIMARY KEY (medicine_id);


--
-- Name: all_test all_test_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.all_test
    ADD CONSTRAINT all_test_pkey PRIMARY KEY (test_id);


--
-- Name: allergy allergy_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allergy
    ADD CONSTRAINT allergy_pkey PRIMARY KEY (patient_id);


--
-- Name: appoinment_queue appoinment_queue_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appoinment_queue
    ADD CONSTRAINT appoinment_queue_pkey PRIMARY KEY (appq_id);


--
-- Name: appointments appoinments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appoinments_pkey PRIMARY KEY (app_id);


--
-- Name: attendance attendance_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_pkey PRIMARY KEY (at_id);


--
-- Name: availability availability_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.availability
    ADD CONSTRAINT availability_pkey PRIMARY KEY (a_id);


--
-- Name: bed bed_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bed
    ADD CONSTRAINT bed_pkey PRIMARY KEY (bed_id);


--
-- Name: bills bills_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_pkey PRIMARY KEY (bill_id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (department_id);


--
-- Name: diagnosis diagnosis_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis
    ADD CONSTRAINT diagnosis_pkey PRIMARY KEY (diagnosis_id);


--
-- Name: discharge_summary discharge_summary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discharge_summary
    ADD CONSTRAINT discharge_summary_pkey PRIMARY KEY (admission_id);


--
-- Name: doctor_department doctor_department_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_department
    ADD CONSTRAINT doctor_department_pkey PRIMARY KEY (doctor_id, department_id);


--
-- Name: doctor doctor_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_pkey PRIMARY KEY (doctor_id);


--
-- Name: emergency emergency_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency
    ADD CONSTRAINT emergency_pkey PRIMARY KEY (emer_id);


--
-- Name: equipment_list equipment_list_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipment_list
    ADD CONSTRAINT equipment_list_pkey PRIMARY KEY (equipment_id);


--
-- Name: equipment equipment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_pkey PRIMARY KEY (equipment_id);


--
-- Name: experience experience_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience
    ADD CONSTRAINT experience_pkey PRIMARY KEY (e_id);


--
-- Name: family_history family_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.family_history
    ADD CONSTRAINT family_history_pkey PRIMARY KEY (patient_id);


--
-- Name: medical_history medical_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_history
    ADD CONSTRAINT medical_history_pkey PRIMARY KEY (history_id);


--
-- Name: medicines medicines_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_pkey PRIMARY KEY (patient_id, medicine_id, history_id);


--
-- Name: notification notification_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_pkey PRIMARY KEY (noti_id);


--
-- Name: nurse nurse_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nurse
    ADD CONSTRAINT nurse_pkey PRIMARY KEY (nurse_id);


--
-- Name: order order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_pkey PRIMARY KEY (medicine_id);


--
-- Name: patient patient_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_pkey PRIMARY KEY (patient_id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (pay_id);


--
-- Name: prescription prescription_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_pkey PRIMARY KEY (pres_id);


--
-- Name: procedure_plan procedure_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.procedure_plan
    ADD CONSTRAINT procedure_plan_pkey PRIMARY KEY (pp_id);


--
-- Name: profile profile_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_pkey PRIMARY KEY (user_id);


--
-- Name: qualifications qualifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifications
    ADD CONSTRAINT qualifications_pkey PRIMARY KEY (q_id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (token_id);


--
-- Name: role role_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_pkey PRIMARY KEY (user_id);


--
-- Name: room room_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_pkey PRIMARY KEY (room_id);


--
-- Name: salary salary_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_pkey PRIMARY KEY (user_id);


--
-- Name: staff staff_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_pkey PRIMARY KEY (staff_id);


--
-- Name: stock stock_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_pkey PRIMARY KEY (medicine_id);


--
-- Name: test_order test_order_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_order
    ADD CONSTRAINT test_order_pkey PRIMARY KEY (t_id);


--
-- Name: test_orders test_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_orders
    ADD CONSTRAINT test_orders_pkey PRIMARY KEY (order_id);


--
-- Name: test_reports test_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_reports
    ADD CONSTRAINT test_reports_pkey PRIMARY KEY (report_id);


--
-- Name: treatment_plan treatment_plan_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.treatment_plan
    ADD CONSTRAINT treatment_plan_pkey PRIMARY KEY (plan_id);


--
-- Name: appointments unique_appointment_slot; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT unique_appointment_slot UNIQUE (doctor_id, date, slot_time);


--
-- Name: availability unique_doctor_week_slot; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.availability
    ADD CONSTRAINT unique_doctor_week_slot UNIQUE (doctor_id, week_day, slot_time);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (user_id);


--
-- Name: visits visits_admission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_admission_id_key UNIQUE (admission_id);


--
-- Name: visits visits_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_pkey PRIMARY KEY (visit_id);


--
-- Name: vitals vitals_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vitals
    ADD CONSTRAINT vitals_pkey PRIMARY KEY (visit_id);


--
-- Name: ward ward_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_pkey PRIMARY KEY (ward_id);


--
-- Name: refresh_tokens refresh_token_cleanup_t; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER refresh_token_cleanup_t AFTER INSERT ON public.refresh_tokens FOR EACH ROW EXECUTE FUNCTION public.refresh_token_cleanup();


--
-- Name: admit_queue admit_queue_admission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admit_queue
    ADD CONSTRAINT admit_queue_admission_id_fkey FOREIGN KEY (admission_id) REFERENCES public.visits(admission_id) ON DELETE CASCADE;


--
-- Name: admit_queue admit_queue_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admit_queue
    ADD CONSTRAINT admit_queue_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;


--
-- Name: admitted admitted_bed_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted
    ADD CONSTRAINT admitted_bed_id_fkey FOREIGN KEY (bed_id) REFERENCES public.bed(bed_id);


--
-- Name: admitted admitted_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted
    ADD CONSTRAINT admitted_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- Name: admitted admitted_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted
    ADD CONSTRAINT admitted_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id);


--
-- Name: admitted admitted_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted
    ADD CONSTRAINT admitted_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id);


--
-- Name: admitted admitted_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted
    ADD CONSTRAINT admitted_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id);


--
-- Name: admitted admitted_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.admitted
    ADD CONSTRAINT admitted_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(ward_id);


--
-- Name: allergy allergy_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.allergy
    ADD CONSTRAINT allergy_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: appoinment_queue appoinment_queue_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appoinment_queue
    ADD CONSTRAINT appoinment_queue_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;


--
-- Name: appoinment_queue appoinment_queue_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appoinment_queue
    ADD CONSTRAINT appoinment_queue_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: appoinment_queue appoinment_queue_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appoinment_queue
    ADD CONSTRAINT appoinment_queue_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: appointments appoinments_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appoinments_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: appointments appoinments_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT appoinments_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: attendance attendance_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.attendance
    ADD CONSTRAINT attendance_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: availability availability_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.availability
    ADD CONSTRAINT availability_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: bed bed_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bed
    ADD CONSTRAINT bed_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE CASCADE;


--
-- Name: bills bills_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.bills
    ADD CONSTRAINT bills_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id);


--
-- Name: diagnosis diagnosis_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis
    ADD CONSTRAINT diagnosis_history_id_fkey FOREIGN KEY (history_id) REFERENCES public.medical_history(history_id) ON DELETE CASCADE;


--
-- Name: diagnosis diagnosis_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.diagnosis
    ADD CONSTRAINT diagnosis_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(visit_id) ON DELETE CASCADE;


--
-- Name: discharge_summary discharge_summary_admission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.discharge_summary
    ADD CONSTRAINT discharge_summary_admission_id_fkey FOREIGN KEY (admission_id) REFERENCES public.visits(admission_id) ON DELETE CASCADE;


--
-- Name: doctor_department doctor_department_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_department
    ADD CONSTRAINT doctor_department_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id);


--
-- Name: doctor_department doctor_department_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor_department
    ADD CONSTRAINT doctor_department_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id);


--
-- Name: doctor doctor_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.doctor
    ADD CONSTRAINT doctor_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: emergency emergency_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency
    ADD CONSTRAINT emergency_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;


--
-- Name: emergency emergency_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.emergency
    ADD CONSTRAINT emergency_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: equipment equipment_equipment_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_equipment_id_fkey FOREIGN KEY (equipment_id) REFERENCES public.equipment_list(equipment_id) ON DELETE CASCADE;


--
-- Name: equipment equipment_room_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.equipment
    ADD CONSTRAINT equipment_room_id_fkey FOREIGN KEY (room_id) REFERENCES public.room(room_id) ON DELETE CASCADE;


--
-- Name: experience experience_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.experience
    ADD CONSTRAINT experience_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: family_history family_history_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.family_history
    ADD CONSTRAINT family_history_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: medical_history medical_history_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_history
    ADD CONSTRAINT medical_history_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;


--
-- Name: medical_history medical_history_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medical_history
    ADD CONSTRAINT medical_history_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: medicines medicines_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_history_id_fkey FOREIGN KEY (history_id) REFERENCES public.medical_history(history_id);


--
-- Name: medicines medicines_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.all_medicines(medicine_id);


--
-- Name: medicines medicines_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT medicines_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id);


--
-- Name: notification notification_from_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_from_fkey FOREIGN KEY ("from") REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: notification notification_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: nurse nurse_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.nurse
    ADD CONSTRAINT nurse_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: order order_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."order"
    ADD CONSTRAINT order_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.all_medicines(medicine_id);


--
-- Name: patient patient_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.patient
    ADD CONSTRAINT patient_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: payments payments_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: prescription prescription_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: prescription prescription_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.prescription
    ADD CONSTRAINT prescription_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(visit_id) ON DELETE CASCADE;


--
-- Name: procedure_plan procedure_plan_plan_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.procedure_plan
    ADD CONSTRAINT procedure_plan_plan_id_fkey FOREIGN KEY (plan_id) REFERENCES public.treatment_plan(plan_id) ON DELETE CASCADE;


--
-- Name: profile profile_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.profile
    ADD CONSTRAINT profile_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: qualifications qualifications_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.qualifications
    ADD CONSTRAINT qualifications_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.refresh_tokens
    ADD CONSTRAINT refresh_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- Name: role role_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role
    ADD CONSTRAINT role_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);


--
-- Name: room room_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.room
    ADD CONSTRAINT room_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.ward(ward_id) ON DELETE CASCADE;


--
-- Name: salary salary_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.salary
    ADD CONSTRAINT salary_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: staff staff_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.staff
    ADD CONSTRAINT staff_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id) ON DELETE CASCADE;


--
-- Name: stock stock_medicine_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.stock
    ADD CONSTRAINT stock_medicine_id_fkey FOREIGN KEY (medicine_id) REFERENCES public.all_medicines(medicine_id);


--
-- Name: test_order test_order_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_order
    ADD CONSTRAINT test_order_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id);


--
-- Name: test_order test_order_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_order
    ADD CONSTRAINT test_order_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.all_test(test_id);


--
-- Name: test_orders test_orders_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_orders
    ADD CONSTRAINT test_orders_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id);


--
-- Name: test_orders test_orders_test_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_orders
    ADD CONSTRAINT test_orders_test_id_fkey FOREIGN KEY (test_id) REFERENCES public.all_test(test_id);


--
-- Name: test_orders test_orders_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_orders
    ADD CONSTRAINT test_orders_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(visit_id);


--
-- Name: test_reports test_reports_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.test_reports
    ADD CONSTRAINT test_reports_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: treatment_plan treatment_plan_history_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.treatment_plan
    ADD CONSTRAINT treatment_plan_history_id_fkey FOREIGN KEY (history_id) REFERENCES public.medical_history(history_id) ON DELETE CASCADE;


--
-- Name: treatment_plan treatment_plan_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.treatment_plan
    ADD CONSTRAINT treatment_plan_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: visits visits_doctor_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_doctor_id_fkey FOREIGN KEY (doctor_id) REFERENCES public.doctor(doctor_id) ON DELETE CASCADE;


--
-- Name: visits visits_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.visits
    ADD CONSTRAINT visits_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id) ON DELETE CASCADE;


--
-- Name: vitals vitals_patient_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vitals
    ADD CONSTRAINT vitals_patient_id_fkey FOREIGN KEY (patient_id) REFERENCES public.patient(patient_id);


--
-- Name: vitals vitals_visit_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.vitals
    ADD CONSTRAINT vitals_visit_id_fkey FOREIGN KEY (visit_id) REFERENCES public.visits(visit_id);


--
-- Name: ward ward_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.ward
    ADD CONSTRAINT ward_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.departments(department_id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

\unrestrict cEXYBxhbgJxMkiVg6HtAWtgIqa3qnCTJUwbVqyvAu4roNULxqQ1nX5HeTne4xy3

