import * as patientCode from "../query/patient.js";

export async function patientDashboardData(req, res) {
  const user_id = req.user.user_id; //attached from the auth middleware using token
  const patient_id = await patientCode.getPatientId(user_id);
  if (patient_id == null) {
    return res.json({
      bp: {
        systolic: null,
        diastolic: null,
      },
      "heart rate": null,
      "blood sugar": null,
      height: null,
      weight: null,
    });
  }
  const vitals = await patientCode.getLatestVitals(patient_id);
  if (vitals == null) {
    return res.json({
      bp: {
        systolic: null,
        diastolic: null,
      },
      "heart rate": null,
      "blood sugar": null,
      height: null,
      weight: null,
    });
  }

  const bp = vitals.bp.split("/");

  return res.json({
    bp: {
      systolic: Number(bp[0]),
      diastolic: Number(bp[1]),
    },
    "heart rate": vitals.heart_rate,
    "blood sugar": vitals.blood_sugar,
    height: vitals.height,
    weight: vitals.weight,
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
