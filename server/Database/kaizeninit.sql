CREATE DATABASE kaizen;

CREATE ROLE patient LOGIN PASSWORD 'patient_password';
CREATE ROLE doctor LOGIN PASSWORD 'doctor_password';
CREATE ROLE administrator LOGIN PASSWORD 'admin_password';
CREATE ROLE researcher LOGIN PASSWORD 'researcher_password';

CREATE ROLE kaizen_users;

GRANT kaizen_users TO patient;
GRANT kaizen_users TO doctor;
GRANT kaizen_users TO administrator;
GRANT kaizen_users TO researcher;

ALTER DATABASE kaizen OWNER TO administrator;
GRANT CONNECT ON DATABASE kaizen TO kaizen_users;

REVOKE ALL ON SCHEMA public FROM PUBLIC;
GRANT USAGE ON SCHEMA public TO kaizen_users;


CREATE TABLE "user" (
	user_id VARCHAR(10) CHECK (length(user_id) = 10),
	"password" TEXT NOT NULL,
	email TEXT NOT NULL CHECK (email LIKE '%@%'),
	PRIMARY KEY(user_id)
);

CREATE TABLE refresh_tokens (
    token_id BIGSERIAL PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES "user"(user_id),
    token_hash TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL
);

CREATE TABLE profile (
	user_id VARCHAR(10) PRIMARY KEY,
	first_name TEXT NOT NULL,
	middle_name TEXT,
	last_name TEXT NOT NULL,
	date_of_birth DATE NOT NULL,
	address TEXT,
	contact_info VARCHAR(11) NOT NULL,
	emergency_contact VARCHAR(11),
	gender TEXT CHECK (upper(gender) in ('MALE', 'FEMALE', 'OTHERS')),
	nid VARCHAR(17) NOT NULL,
	nationality TEXT,
	
	FOREIGN KEY (user_id) REFERENCES "user"(user_id) ON DELETE CASCADE
);

CREATE TABLE patient(
	patient_id SERIAL PRIMARY KEY,
	user_id VARCHAR(10),
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE
);

CREATE TABLE doctor(
	doctor_id SERIAL PRIMARY KEY,
	user_id VARCHAR(10),
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE
);

CREATE TABLE experience(
	e_id SERIAL PRIMARY KEY,
	doctor_id INT not null,
	institue TEXT not null,
	"role" text not null,
	start_date DATE not null,
	end_date date not null,
	FOREIGN KEY(doctor_id) REFERENCES "doctor"(doctor_id) on DELETE CASCADE
);

CREATE TABLE qualifications(
	q_id SERIAL PRIMARY KEY,
	doctor_id INT not null,
	degree_name TEXT not null,
	institute TEXT not null,
	"year" INT not null,
	FOREIGN KEY(doctor_id) REFERENCES "doctor"(doctor_id) on DELETE CASCADE
);

CREATE TABLE availability(
	a_id SERIAL PRIMARY KEY,
	doctor_id INT not null,
	week_day VARCHAR(3) not null CHECK (week_day in ('SUN','MON','TUE','WED', 'THU','FRI','SAT')),
	"time" CHAR(2) not null CHECK ("time"::int BETWEEN 00 AND 23),
	FOREIGN KEY(doctor_id) REFERENCES "doctor"(doctor_id) on DELETE CASCADE
);

CREATE TABLE nurse(
	nurse_id SERIAL PRIMARY KEY,
	user_id VARCHAR(10) not null,
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE
);

CREATE TABLE staff(
	staff_id SERIAL PRIMARY KEY,
	user_id VARCHAR(10) not null,
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE
);

CREATE TABLE attendance(
	at_id SERIAL PRIMARY KEY,
	user_id VARCHAR(10) not null,
	"date" DATE not null,
	start_time TIME not null,
	end_time time not null,
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE
);

CREATE TABLE salary(
	user_id VARCHAR(10) PRIMARY KEY,
	salary REAL not null,
	commission REAL not null, 
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE
);

CREATE TABLE payments(
	pay_id SERIAL PRIMARY KEY,
	user_id VARCHAR(10),
	"date" DATE not null,
	amount REAL not null,
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE
);

CREATE TABLE departments(
	department_id SERIAL PRIMARY KEY,
	name TEXT not null
);

CREATE TABLE ward(
	ward_id SERIAL PRIMARY KEY,
	department_id INT not null,
	ward_number INT not null,
	FOREIGN key(department_id) REFERENCES departments(department_id) on DELETE cascade
);

CREATE TABLE room(
	room_id SERIAL PRIMARY KEY,
	ward_id INT not null,
	FOREIGN key(ward_id) REFERENCES ward(ward_id) on DELETE cascade
);

CREATE TABLE bed(
	bed_id SERIAL PRIMARY key,
	room_id int not null,
	occupied char(1) not null check (occupied in ('y','n')) ,
	FOREIGN key(room_id) REFERENCES room(room_id) on DELETE cascade
);

CREATE TABLE equipment_list(
	equipment_id int PRIMARY KEY,
	name TEXT not null
);

CREATE TABLE equipment(
	equipment_id int PRIMARY key,
	room_id int not null,
	FOREIGN key(room_id) REFERENCES room(room_id) on DELETE cascade,
	foreign key(equipment_id) REFERENCES equipment_list(equipment_id) on delete cascade
);

create table appoinments(
	app_id BIGSERIAL PRIMARY key,
	doctor_id int not null,
	patient_id int not null,
	"date" date not null,
	"time" time not null,
	queue NUMERIC(1) not null,
	FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id) on delete cascade,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade
);

create table appoinment_queue(
	appq_id BIGSERIAL PRIMARY key,
	patient_id int not null,
	doctor_id int not null,
	department_id int not null,
	FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id) on delete cascade,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade,
	FOREIGN KEY(department_id) REFERENCES departments(department_id) on delete cascade
);

create table emergency(
	emer_id BIGSERIAL PRIMARY key,
	patient_id int not null,
	department_id int not null,
	FOREIGN KEY(department_id) REFERENCES departments(department_id) on delete cascade,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade
);

create table family_history(
	patient_id int PRIMARY key,
	relative_relation text not null,
	"condition" text not null,
	effect text not null,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade
);

create table allergy(
	patient_id int PRIMARY key,
	allergy_trigger text not null,
	trigger_meds text,
	severity NUMERIC(1) not null,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade
);

create table test_reports(
	report_id BIGSERIAL PRIMARY key,
	patient_id int not null,
	report_path text not null,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade
);

create table visits(
	visit_id BIGSERIAL PRIMARY key,
	patient_id int not null,
	doctor_id int not null,
	"date" date not null,
	admission_id BIGINT UNIQUE,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade,
	FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id) on delete cascade
);

create table admit_queue(
	admission_id BIGINT PRIMARY key,
	"date" date not null,
	department_id int not null,
	priority NUMERIC(1) not null,
	FOREIGN KEY(department_id) REFERENCES departments(department_id) on delete cascade,
	FOREIGN KEY(admission_id) REFERENCES visits(admission_id) on delete cascade
);

create table discharge_summary(
	admission_id BIGINT PRIMARY key,
	"date" date not null,
	note TEXT,
	FOREIGN KEY(admission_id) REFERENCES visits(admission_id) on delete cascade
);

create table medical_history(
	history_id BIGINT PRIMARY key,
	patient_id int not null,
	"condition" text not null,
	department_id int not null,
	status CHAR(1) check(status in('a', 'i', 'd')),
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade,
	foreign key(department_id) references departments(department_id) on delete cascade
);

create table diagnosis(
	diagnosis_id BIGSERIAL PRIMARY key,
	history_id BIGINT not null,
	visit_id BIGINT not null,
	FOREIGN KEY(visit_id) REFERENCES visits(visit_id) on delete cascade,
	foreign key(history_id) references medical_history(history_id) on delete cascade
);

create table all_medicines(
	medicine_id BIGSERIAL PRIMARY key,
	name text not null,
	brand text not null,
	generic_name text not null,
	ppu real not null
);

create table medicines(
	patient_id int,
	medicine_id BIGINT not null,
	history_id bigint not null,
	PRIMARY KEY(patient_id, medicine_id, history_id),
	FOREIGN key(patient_id) REFERENCES patient(patient_id),
	FOREIGN key(medicine_id) REFERENCES all_medicines(medicine_id),
	FOREIGN key(history_id) REFERENCES medical_history(history_id)
);


create table treatment_plan(
	plan_id BIGSERIAL PRIMARY key,
	patient_id int not null,
	history_id BIGINT not null,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on delete cascade,
	foreign key(history_id) references medical_history(history_id) on delete cascade
);

create table procedure_plan(
	pp_id BIGSERIAL PRIMARY KEY,
	"procedure" text not null,
	plan_id BIGINT not null,
	FOREIGN key(plan_id) REFERENCES treatment_plan(plan_id) on DELETE CASCADE
);

create table vitals(
	visit_id BIGINT PRIMARY key,
	patient_id int not null,
	bp VARCHAR(7),
	blood_sugar REAL,
	heart_rate int,
	"height" real,
	weight real,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id),
	foreign key(visit_id) references visits(visit_id)
);

create table bills(
	bill_id BIGINT PRIMARY key,
	patient_id int not null,
	bill_name text not null,
	bill_amount int not null,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id)
);

create table stock(
	medicine_id BIGINT PRIMARY key,
	amount int not null,
	FOREIGN KEY(medicine_id) REFERENCES all_medicines(medicine_id)
);

create table "order"(
	medicine_id BIGINT PRIMARY key,
	amount int not null,
	FOREIGN KEY(medicine_id) REFERENCES all_medicines(medicine_id)
);

create table all_test(
	test_id BIGSERIAL PRIMARY key,
	test_name text not null,
	price int not null
);

create table test_order(
	t_id BIGSERIAL PRIMARY key,
	test_id BIGINT not null,
	patient_id int not null,
	priority NUMERIC(1) not null,
	FOREIGN key(patient_id) references patient(patient_id),
	foreign key(test_id) references all_test(test_id)
);

create table admitted (
	ad_id BIGSERIAL PRIMARY KEY,
	patient_id INT not null,
	doctor_id INT not null,
	department_id INT not null,
	ward_id INT not null,
	room_id INT not null,
	bed_id INT not null,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id),
	FOREIGN KEY(doctor_id) REFERENCES doctor(doctor_id),
	FOREIGN KEY(department_id) REFERENCES departments(department_id),
	FOREIGN KEY(ward_id) REFERENCES ward(ward_id),
	FOREIGN KEY(room_id) REFERENCES room(room_id),
	FOREIGN KEY(bed_id) REFERENCES bed(bed_id)
);
	
create table notification (
	noti_id BIGSERIAL PRIMARY KEY,
	"from" VARCHAR(10),
	message text not null,
	user_id VARCHAR(10) not null,
	FOREIGN KEY(user_id) REFERENCES "user"(user_id) on DELETE CASCADE,
	FOREIGN KEY("from") REFERENCES "user"(user_id) on DELETE CASCADE
);
	
	
create table prescription (
	pres_id BIGSERIAL PRIMARY KEY,
	patient_id INT not null,
	visit_id BIGINT not null,
	note text,
	FOREIGN KEY(patient_id) REFERENCES patient(patient_id) on DELETE CASCADE,
	FOREIGN KEY(visit_id) REFERENCES visits(visit_id) on DELETE CASCADE
);
	
	
create table role (
	user_id VARCHAR(10) PRIMARY KEY,
	role_id NUMERIC(1) not null,
	FOREIGN KEY(user_id) REFERENCES "user"(user_id)
);
	

create table test_orders(
	order_id BIGSERIAL PRIMARY key,
	test_id BIGINT not null,
	patient_id int not null,
	visit_id int not null,
	FOREIGN key(patient_id) references patient(patient_id),
	foreign key(test_id) references all_test(test_id),
	foreign key(visit_id) references visits(visit_id)
);


