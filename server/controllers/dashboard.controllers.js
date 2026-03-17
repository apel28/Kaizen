import * as patientCode from "../query/patient.js"

export async function patientDashboardData(req, res) {
    const user_id = req.user.user_id; //attached fromt the auth middleware using token
    const patient_prof = await patientCode.getPatientProfile(user_id);
    if(patient_prof.patient_id == null) {
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
    const vitals = await patientCode.getLatestVitals(patient_prof.patient_id);
    if(vitals == null) {
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
 
    const bp = vitals.bp.split('/');

    const bmi = vitals.weight/(vitals.height*vitals.height);

    const patient_name = patient_prof.first_name + " " + (patient_prof.middle_name ? patient_prof.middle_name + " " : "") + patient_prof.last_name

    return res.json({
        'bp' : {
            'systolic': Number(bp[0]),
            'diastolic': Number(bp[1]),
        },
        'heart rate': vitals.heart_rate,
        'blood sugar': vitals.blood_sugar,
        'bmi': bmi,
        'name': patient_name,
        'patientId': patient_prof.patient_id,
    });

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
