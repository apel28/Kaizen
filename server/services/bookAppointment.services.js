import { getAppointment, getAppointmentCountByDoctorDateTime } from "../query/appointment.js";
import { getAvailability } from "../query/availability.js";


async function slotsAvailableByDate(doctorId, date) {
    const days = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
    const d = new Date(date);

    const targetDay = days[d.getDay()];

    const availabilityResult = await getAvailability(doctorId, targetDay);

    if (!availabilityResult || availabilityResult.length === 0) {
        return { rows: [] };
    }

    const availableSlots = [];

    for (const slot of availabilityResult) {
        const appointmentCount = await getAppointmentCountByDoctorDateTime(
            doctorId,
            date,
            slot.slot_time
        );

        // Only include slot if appointment count is less than slot_duration_minutes
        if (appointmentCount < slot.slot_duration_minutes) {
            availableSlots.push({
                slot_time: slot.slot_time
            });
        }
    }

    return { rows: availableSlots };
}

async function test() {
    console.log(await slotsAvailableByDate(2, '2026-03-23'));
}

test()