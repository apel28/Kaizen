import pool from "../db.js";
import * as patientCode from "../query/patient.js"

export async function patientDashboardData(req, res) {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');
        const user_id = req.user.user_id; //attached fromt the auth middleware using token
        const patient_prof = await patientCode.getPatientProfile(user_id, client);

        if(patient_prof.patient_id == null) {
            await client.query('ROLLBACK');
            return res.json({
                'bp' : {
                    'systolic' : null,
                    'diastolic': null,
                },
                'heart rate': null,
                'blood sugar': null,
                'bmi': null,
                'name': null,
                'patientId': null,
            });
        }
        const patient_name = patient_prof.first_name + " " + (patient_prof.middle_name ? patient_prof.middle_name + " " : "") + patient_prof.last_name

        const vitals = await patientCode.getLatestVitals(patient_prof.patient_id, client);
        if(vitals == null) {
            await client.query('ROLLBACK');
            return res.json({
                'bp' : {
                    'systolic' : null,
                    'diastolic': null,
                },
                'heart rate': null,
                'blood sugar': null,
                'bmi': null,
                'name': patient_name,
                'patientId': patient_prof.patient_id,
            });
        }

        const bp = vitals.bp ? vitals.bp.split('/') : [null, null];
        
        const bmi = (1.00*vitals.weight*100*100)/(vitals.height*vitals.height);

        

        await client.query('COMMIT');
        return res.json({
            'bp' : {
                'systolic': bp[0] ? Number(bp[0]) : null,
                'diastolic': bp[1] ? Number(bp[1]): null,
            },
            'heart rate': vitals.heart_rate,
            'blood sugar': vitals.blood_sugar,
            'bmi': bmi,
            'name': patient_name,
            'patientId': patient_prof.patient_id,
        });

    } catch (err) {
        await client.query('ROLLBACK');
        res.status(500).json({ error: err.message });
    } finally {
        client.release();
    }
}

// async function test() {
//     const req = {
//         user: { user_id: '2MzNw87diL' }
//     };

//     const res = {
//         json: (data) => {
//             console.log("Response:", data);
//         }
//     };

//     await patientDashboardData(req, res);
// }

// test();
