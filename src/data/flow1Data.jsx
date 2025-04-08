
import dayjs from "dayjs";
// GET api/v1/vaccines/doctors/{doctorId} --> api/v1/doctors/{doctorId}/vaccines
export const laySoLuongVaccineCanChoNgayHomNay = () => {
    return {
        date: '2025-01-01T00:00:00',
        doctorId: 'D-001',
        shift: 'morning',
        vaccines: [
            {
                id: 1,
                name: 'Pfizer-BioNTech',
                vaccineCode: 'BNT162b2',
                manufacturer: 'Pfizer',
                quantity: 150
            },
            {
                id: 2,
                name: 'Moderna',
                vaccineCode: 'mRNA-1273',
                manufacturer: 'Moderna',
                quantity: 130
            },
            {
                id: 3,
                name: 'AstraZeneca',
                vaccineCode: 'AZD1222',
                manufacturer: 'AstraZeneca',
                quantity: 140
            },
            {
                id: 4,
                name: 'Johnson & Johnson',
                vaccineCode: 'Ad26.COV2.S',
                manufacturer: 'Janssen Pharmaceuticals',
                quantity: 120
            },
            {
                id: 5,
                name: 'Sinopharm',
                vaccineCode: 'BBIBP-CorV',
                manufacturer: 'China National Pharmaceutical Group',
                quantity: 160
            },
            {
                id: 6,
                name: 'Sinovac',
                vaccineCode: 'CoronaVac',
                manufacturer: 'Sinovac Biotech',
                quantity: 135
            },
            {
                id: 7,
                name: 'Novavax',
                vaccineCode: 'NVX-CoV2373',
                manufacturer: 'Novavax',
                quantity: 125
            },
            {
                id: 8,
                name: 'Covaxin',
                vaccineCode: 'BBV152',
                manufacturer: 'Bharat Biotech',
                quantity: 110
            },
            {
                id: 9,
                name: 'Sputnik V',
                vaccineCode: 'Gam-COVID-Vac',
                manufacturer: 'Gamaleya Research Institute',
                quantity: 145
            },
            {
                id: 10,
                name: 'CureVac',
                vaccineCode: 'CVnCoV',
                manufacturer: 'CureVac',
                quantity: 100
            },
            {
                id: 11,
                name: 'Valneva',
                vaccineCode: 'VLA2001',
                manufacturer: 'Valneva SE',
                quantity: 90
            },
            {
                id: 12,
                name: 'Zydus Cadila',
                vaccineCode: 'ZyCoV-D',
                manufacturer: 'Cadila Healthcare',
                quantity: 105
            },
            {
                id: 13,
                name: 'Medicago',
                vaccineCode: 'CoVLP',
                manufacturer: 'Medicago Inc.',
                quantity: 95
            },
            {
                id: 14,
                name: 'Sanofi-GSK',
                vaccineCode: 'VAT00002',
                manufacturer: 'Sanofi & GSK',
                quantity: 115
            },
            {
                id: 15,
                name: 'Inovio',
                vaccineCode: 'INO-4800',
                manufacturer: 'Inovio Pharmaceuticals',
                quantity: 85
            },
            {
                id: 16,
                name: 'CanSinoBIO',
                vaccineCode: 'Convidecia',
                manufacturer: 'CanSino Biologics',
                quantity: 130
            },
            {
                id: 17,
                name: 'ImmunityBio',
                vaccineCode: 'hAd5',
                manufacturer: 'ImmunityBio',
                quantity: 95
            },
            {
                id: 18,
                name: 'Vaxart',
                vaccineCode: 'VXA-CoV2-1',
                manufacturer: 'Vaxart',
                quantity: 80
            },
            {
                id: 19,
                name: 'COVIran Barekat',
                vaccineCode: 'COVIran',
                manufacturer: 'Shifa Pharmed Industrial Group',
                quantity: 140
            },
            {
                id: 20,
                name: 'EpiVacCorona',
                vaccineCode: 'EpiVacCorona',
                manufacturer: 'Vector Institute',
                quantity: 125
            }
        ]
    };
}

// POST vaccines/doctors/{doctorId}
export const xuatVaccine = (time, doctorId, vaccines) => {
    let sample_time = dayjs(); //now
    let sample_doctorId = 1; // = UserId
    let sample_vaccines = laySoLuongVaccineCanChoNgayHomNay().vaccines;

    // Goi API

}

// Step 2 : Xác nhận tiêm

// GET api/v1/schedules/{doctorId}?date=2025-01-01 --> GET api/v1/doctor/{doctorId}/schedules?date=2025-01-01
export const layLichTiemCuaBacSi = () => {
    return {
        date: '2025-01-01T00:00:00',
        doctorId: "D-001",
        schedules: [
            { id: 1, date: '2025-02-25T08:00:00', childName: 'Nguyen Van A', vaccine: 'Pfizer', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T08:30:00', childName: 'Tran Thi B', vaccine: 'Moderna', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T09:00:00', childName: 'Le Van C', vaccine: 'AstraZeneca', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T09:30:00', childName: 'Pham Van D', vaccine: 'Sinovac', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T10:00:00', childName: 'Hoang Thi E', vaccine: 'Pfizer', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T10:30:00', childName: 'Vo Van F', vaccine: 'Moderna', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T11:00:00', childName: 'Doan Thi G', vaccine: 'AstraZeneca', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T11:30:00', childName: 'Bui Van H', vaccine: 'Sinovac', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T13:00:00', childName: 'Dang Thi I', vaccine: 'Pfizer', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T13:30:00', childName: 'Ngo Van J', vaccine: 'Moderna', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T14:00:00', childName: 'Nguyen Thi K', vaccine: 'AstraZeneca', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T14:30:00', childName: 'Trinh Van L', vaccine: 'Sinovac', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T15:00:00', childName: 'Le Thi M', vaccine: 'Pfizer', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T15:30:00', childName: 'Pham Van N', vaccine: 'Moderna', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T16:00:00', childName: 'Hoang Thi O', vaccine: 'AstraZeneca', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T16:30:00', childName: 'Vo Van P', vaccine: 'Sinovac', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T17:00:00', childName: 'Doan Thi Q', vaccine: 'Pfizer', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T17:30:00', childName: 'Bui Van R', vaccine: 'Moderna', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T18:00:00', childName: 'Dang Thi S', vaccine: 'AstraZeneca', status: 'PLANNED' },
            { id: 1, date: '2025-02-25T18:30:00', childName: 'Ngo Van T', vaccine: 'Sinovac', status: 'PLANNED' }
        ]
    }
}

// GET api/v1/schedules/{scheduleId}
export const chiTietLichTiem = (id) => {
    return {
        id: 5678,
        child: {
            id: 101,
            firstName: 'Nguyen',
            lastName: 'An',
            dob: '2020-06-15',
            gender: 'MALE',
            weight: 18.5, // in kg
            height: 110, // in cm
            bloodType: 'O+',
            healthNotes: 'No known allergies. Mild asthma.'
        },
        order: {
            id: 9876,
            bookDate: '2025-03-10',
            serviceType: 'SINGLE' // SINGLE/COMBO/MIXED
        },
        pastSchedules: [
            {
                id: 201,
                date: '2024-08-20',
                vaccineName: 'MMR (Measles, Mumps, Rubella)',
                doctorId: 'D-012',
                feedback: 'Mild fever for 2 days, no other issues.',
                comboName: '', // Only applicable for COMBO types
                reactions: [
                    {
                        date: '2024-08-21',
                        reaction: 'Slight fever, resolved within 24 hours.'
                    }
                ]
            },
            {
                id: 202,
                date: '2024-12-10',
                vaccineName: 'Influenza',
                doctorId: 'D-007',
                feedback: 'No adverse reactions.',
                comboName: '',
                reactions: []
            }
        ]
    };
};

// POST api/v1/schedules/{scheduleId} --> PUT api/v1/schedules/doctor/{scheduleId} 


