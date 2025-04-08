// GET api/v1/vaccines - SUA - Moc Nguyen
export const vaccines = [
    { id: "1", name: "Vắc xin Shingrix", manufacturer: "GSK (Bỉ)", price: 3890000, uses: ["Zona thần kinh", "Ngừa biến chứng thần kinh"] },
    { id: "2", name: "Vắc xin QDenga", manufacturer: "Takeda (Germany)", price: 1390000, uses: ["Sốt xuất huyết", "Giảm nguy cơ nhập viện do sốt xuất huyết"] },
    { id: "3", name: "Vắc xin Priorix", manufacturer: "GSK (Bỉ)", price: 495000, uses: ["Sởi", "Quai bị", "Rubella"] },
    { id: "4", name: "Vắc xin MMR II", manufacturer: "MSD (Mỹ)", price: 445000, uses: ["Sởi", "Quai bị", "Rubella"] },
    { id: "5", name: "Vắc xin Varilrix", manufacturer: "GSK (Bỉ)", price: 1085000, uses: ["Thủy đậu", "Giảm nguy cơ biến chứng da do thủy đậu"] },
    { id: "6", name: "Vắc xin Varivax", manufacturer: "MSD (Mỹ)", price: 1085000, uses: ["Thủy đậu", "Ngăn ngừa biến chứng nặng"] },
    { id: "7", name: "Vắc xin Infanrix Hexa", manufacturer: "GSK (Bỉ)", price: 1850000, uses: ["Bạch hầu", "Ho gà", "Uốn ván", "Viêm gan B", "Bại liệt", "Hib"] },
    { id: "8", name: "Vắc xin Pentaxim", manufacturer: "Sanofi Pasteur (Pháp)", price: 980000, uses: ["Bạch hầu", "Ho gà", "Uốn ván", "Bại liệt", "Hib"] },
    { id: "9", name: "Vắc xin Prevenar 13", manufacturer: "Pfizer (Mỹ)", price: 1400000, uses: ["Phòng bệnh do phế cầu khuẩn", "Giảm nguy cơ viêm phổi do phế cầu"] },
    { id: "10", name: "Vắc xin Engerix-B", manufacturer: "GSK (Bỉ)", price: 350000, uses: ["Viêm gan B", "Ngăn ngừa biến chứng xơ gan"] },
    { id: "11", name: "Vắc xin Twinrix", manufacturer: "GSK (Bỉ)", price: 1150000, uses: ["Viêm gan A", "Viêm gan B"] },
    { id: "12", name: "Vắc xin Havrix", manufacturer: "GSK (Bỉ)", price: 850000, uses: ["Viêm gan A", "Giảm nguy cơ viêm gan cấp tính"] },
    { id: "13", name: "Vắc xin Gardasil 9", manufacturer: "MSD (Mỹ)", price: 2100000, uses: ["Phòng ung thư cổ tử cung do HPV", "Ngăn ngừa mụn cóc sinh dục"] },
    { id: "14", name: "Vắc xin Rotarix", manufacturer: "GSK (Bỉ)", price: 970000, uses: ["Phòng tiêu chảy do Rotavirus", "Giảm nguy cơ mất nước do tiêu chảy"] },
    { id: "15", name: "Vắc xin Ixiaro", manufacturer: "Valneva (Áo)", price: 1900000, uses: ["Viêm não Nhật Bản", "Ngăn ngừa tổn thương thần kinh do viêm não"] },
    { id: "16", name: "Vắc xin Menactra", manufacturer: "Sanofi Pasteur (Pháp)", price: 1300000, uses: ["Phòng viêm màng não do não mô cầu", "Giảm nguy cơ biến chứng thần kinh"] }
];

// [REUSE] GET api/v1/children (Co roi) - SUA
export const childrenList = [
    {
        id: 1,
        firstName: "Liam",
        lastName: "Johnson",
        dob: "2018-05-14",
        gender: "MALE",
        weight: 18.5,
        height: 110.2,
        bloodType: "O+",
        healthNote: "No known allergies"
    },
    {
        id: 2,
        firstName: "Emma",
        lastName: "Smith",
        dob: "2019-08-22",
        gender: "FEMALE",
        weight: 15.8,
        height: 105.5,
        bloodType: "A-",
        healthNote: "Mild lactose intolerance"
    },
    {
        id: 3,
        firstName: "Noah",
        lastName: "Brown",
        dob: "2017-03-10",
        gender: "MALE",
        weight: 20.1,
        height: 115.0,
        bloodType: "B+",
        healthNote: "Asthma - uses inhaler occasionally"
    },
    {
        id: 4,
        firstName: "Olivia",
        lastName: "Garcia",
        dob: "2020-11-05",
        gender: "FEMALE",
        weight: 12.4,
        height: 95.3,
        bloodType: "AB+",
        healthNote: "No known allergies"
    },
    {
        id: 5,
        firstName: "Lucas",
        lastName: "Martinez",
        dob: "2016-07-30",
        gender: "MALE",
        weight: 22.0,
        height: 120.8,
        bloodType: "O-",
        healthNote: "Nut allergy - carries EpiPen"
    },
    {
        id: 6,
        firstName: "Mia",
        lastName: "Davis",
        dob: "2019-01-12",
        gender: "FEMALE",
        weight: 16.2,
        height: 108.4,
        bloodType: "A+",
        healthNote: "Mild eczema - uses hypoallergenic lotions"
    },
    {
        id: 7,
        firstName: "Ethan",
        lastName: "Hernandez",
        dob: "2018-12-25",
        gender: "MALE",
        weight: 19.0,
        height: 112.6,
        bloodType: "B-",
        healthNote: "No known allergies"
    },
    {
        id: 8,
        firstName: "Sophia",
        lastName: "Lopez",
        dob: "2017-06-18",
        gender: "FEMALE",
        weight: 20.5,
        height: 116.2,
        bloodType: "O+",
        healthNote: "Peanut allergy - avoids peanut products"
    },
    {
        id: 9,
        firstName: "James",
        lastName: "Gonzalez",
        dob: "2021-02-08",
        gender: "MALE",
        weight: 10.5,
        height: 89.7,
        bloodType: "A-",
        healthNote: "No known allergies"
    },
    {
        id: 10,
        firstName: "Ava",
        lastName: "Wilson",
        dob: "2016-09-14",
        gender: "FEMALE",
        weight: 23.1,
        height: 122.0,
        bloodType: "AB-",
        healthNote: "Shellfish allergy - avoids seafood"
    }
];

// [REUSE] GET api/v1/children/{childrenId}/schedules (Co roi)
export const getPastSchedules = () => {

}

// [REUSE] POST api/v1/children (Co roi)
export const themTre = (id, firstName, lastName, dob, gender, weight, height, bloodType, healthNote) => {
    let body = {
        id: id,
        firstName: firstName,
        lastName: lastName,
        dob: dob,
        gender: gender,
        weight: weight,
        height: height,
        bloodType: bloodType,
        healthNote: healthNote
    }

    let fakeChild = {
        id: 10,
        firstName: "Ava",
        lastName: "Wilson",
        dob: "2016-09-14",
        gender: "FEMALE",
        weight: 23.1,
        height: 122.0,
        bloodType: "AB-",
        healthNote: "Shellfish allergy - avoids seafood"
    }

    // goi Api

    children.push(fakeChild);
}

// GET api/v1/doctors - Easy - Moc Nguyen
export const doctors = [
    {
        id: 1,
        firstName: 'Doctor',
        lastName: 'Who'
    },
    {
        id: 2,
        firstName: 'Doctor',
        lastName: 'Strange'
    }
]

// GET api/v1/combos - SUA NANG - TANH - DONE
export const combos = [
    {
        id: 1,
        name: 'Combo Alpha',
        description: 'Comprehensive vaccine package for early childhood.',
        price: 1500000.50,
        minAge: 1,
        maxAge: 5,
        vaccines: [
            { id: 1, name: 'Vaccine A', quantity: 2 },
            { id: 2, name: 'Vaccine B', quantity: 1 }
        ]
    },
    {
        id: 2,
        name: 'Combo Beta',
        description: 'Essential vaccines for school-aged children.',
        price: 2000000.75,
        minAge: 6,
        maxAge: 12,
        vaccines: [
            { id: 3, name: 'Vaccine C', quantity: 3 },
            { id: 4, name: 'Vaccine D', quantity: 2 }
        ]
    },
    {
        id: 3,
        name: 'Combo Gamma',
        description: 'Protection against respiratory and viral diseases.',
        price: 1800000.00,
        minAge: 2,
        maxAge: 8,
        vaccines: [
            { id: 5, name: 'Vaccine E', quantity: 1 },
            { id: 6, name: 'Vaccine F', quantity: 2 }
        ]
    },
    {
        id: 4,
        name: 'Combo Delta',
        description: 'Advanced immunity for infants.',
        price: 2500000.90,
        minAge: 0,
        maxAge: 2,
        vaccines: [
            { id: 7, name: 'Vaccine G', quantity: 3 },
            { id: 8, name: 'Vaccine H', quantity: 1 }
        ]
    },
    {
        id: 5,
        name: 'Combo Epsilon',
        description: 'General wellness and booster shots.',
        price: 1200000.30,
        minAge: 10,
        maxAge: 18,
        vaccines: [
            { id: 9, name: 'Vaccine I', quantity: 2 },
            { id: 10, name: 'Vaccine J', quantity: 2 }
        ]
    },
    {
        id: 6,
        name: 'Combo Zeta',
        description: 'Special care for immune-compromised individuals.',
        price: 3000000.00,
        minAge: 5,
        maxAge: 15,
        vaccines: [
            { id: 11, name: 'Vaccine K', quantity: 1 },
            { id: 12, name: 'Vaccine L', quantity: 3 }
        ]
    },
    {
        id: 7,
        name: 'Combo Eta',
        description: 'Full-body protection for young adults.',
        price: 2200000.45,
        minAge: 15,
        maxAge: 25,
        vaccines: [
            { id: 13, name: 'Vaccine M', quantity: 2 },
            { id: 14, name: 'Vaccine N', quantity: 1 }
        ]
    },
    {
        id: 8,
        name: 'Combo Theta',
        description: 'Senior citizen immunity booster.',
        price: 2800000.60,
        minAge: 50,
        maxAge: 80,
        vaccines: [
            { id: 15, name: 'Vaccine O', quantity: 2 },
            { id: 16, name: 'Vaccine P', quantity: 3 }
        ]
    },
    {
        id: 9,
        name: 'Combo Iota',
        description: 'Pre-travel vaccination for global travelers.',
        price: 2600000.70,
        minAge: 18,
        maxAge: 60,
        vaccines: [
            { id: 17, name: 'Vaccine Q', quantity: 2 },
            { id: 18, name: 'Vaccine R', quantity: 2 }
        ]
    },
    {
        id: 10,
        name: 'Combo Kappa',
        description: 'Preventive health care for all age groups.',
        price: 1900000.20,
        minAge: 5,
        maxAge: 30,
        vaccines: [
            { id: 19, name: 'Vaccine S', quantity: 1 },
            { id: 20, name: 'Vaccine T', quantity: 3 }
        ]
    }
];

// POST api/v1/orders - HARD + tao lich - TANH - DONE
export const datCoc20 = () => {

}

// GET api/v1/customers/{customerId}/schedules - EASY - TANH
export const getAllSchedulesOfCustomer = [
    {
        id: 1,
        date: "2025-03-01T10:00:00",
        status: "PLANNED",
        doctorName: "Dr. Linh Tran",
        orderId: 101,
        childId: 1,
        childName: "Gia Khanh"
    },
    {
        id: 2,
        date: "2025-03-02T11:30:00",
        status: "COMPLETED",
        doctorName: "Dr. Hieu Vu",
        orderId: 102,
        childId: 2,
        childName: "Bao Lam"
    },
    {
        id: 3,
        date: "2025-03-03T09:00:00",
        status: "CANCELLED",
        doctorName: "Dr. Anh Pham",
        orderId: 103,
        childId: 3,
        childName: "Mai Phan"
    },
    {
        id: 4,
        date: "2025-03-04T14:00:00",
        status: "PLANNED",
        doctorName: "Dr. Thao Nguyen",
        orderId: 104,
        childId: 4,
        childName: "Nam Hoang"
    },
    {
        id: 5,
        date: "2025-03-05T16:30:00",
        status: "COMPLETED",
        doctorName: "Dr. Dung Le",
        orderId: 105,
        childId: 5,
        childName: "Lan Do"
    },
    {
        id: 6,
        date: "2025-03-06T12:15:00",
        status: "CANCELLED",
        doctorName: "Dr. Vuong Tran",
        orderId: 106,
        childId: 6,
        childName: "Phuc Nguyen"
    },
    {
        id: 7,
        date: "2025-03-07T08:45:00",
        status: "PLANNED",
        doctorName: "Dr. Tien Dang",
        orderId: 107,
        childId: 7,
        childName: "Minh Chau"
    },
    {
        id: 8,
        date: "2025-03-08T15:00:00",
        status: "COMPLETED",
        doctorName: "Dr. Ha Bui",
        orderId: 108,
        childId: 8,
        childName: "Tuan Le"
    },
    {
        id: 9,
        date: "2025-03-09T10:30:00",
        status: "CANCELLED",
        doctorName: "Dr. My Pham",
        orderId: 109,
        childId: 9,
        childName: "Quynh Tran"
    },
    {
        id: 10,
        date: "2025-03-10T17:00:00",
        status: "PLANNED",
        doctorName: "Dr. Son Vu",
        orderId: 110,
        childId: 10,
        childName: "Thinh Hoang"
    },
    {
        id: 11,
        date: "2025-03-11T09:45:00",
        status: "COMPLETED",
        doctorName: "Dr. Thanh Ngo",
        orderId: 111,
        childId: 11,
        childName: "Duy Tran"
    },
    {
        id: 12,
        date: "2025-03-12T13:00:00",
        status: "CANCELLED",
        doctorName: "Dr. Hoa Le",
        orderId: 112,
        childId: 12,
        childName: "Khanh Bui"
    },
    {
        id: 13,
        date: "2025-03-13T14:45:00",
        status: "PLANNED",
        doctorName: "Dr. Phuong Nguyen",
        orderId: 113,
        childId: 13,
        childName: "Vy Dang"
    },
    {
        id: 14,
        date: "2025-03-14T11:15:00",
        status: "COMPLETED",
        doctorName: "Dr. Loc Tran",
        orderId: 114,
        childId: 14,
        childName: "Nhi Ho"
    },
    {
        id: 15,
        date: "2025-03-15T08:00:00",
        status: "CANCELLED",
        doctorName: "Dr. Bao Vu",
        orderId: 115,
        childId: 15,
        childName: "Tai Pham"
    },
    {
        id: 16,
        date: "2025-03-16T16:00:00",
        status: "PLANNED",
        doctorName: "Dr. Kim Nguyen",
        orderId: 116,
        childId: 16,
        childName: "Hien Le"
    },
    {
        id: 17,
        date: "2025-03-17T13:30:00",
        status: "COMPLETED",
        doctorName: "Dr. Tan Bui",
        orderId: 117,
        childId: 17,
        childName: "Phong Tran"
    },
    {
        id: 18,
        date: "2025-03-18T09:15:00",
        status: "CANCELLED",
        doctorName: "Dr. Duong Vo",
        orderId: 118,
        childId: 18,
        childName: "An Nguyen"
    },
    {
        id: 19,
        date: "2025-03-19T15:45:00",
        status: "PLANNED",
        doctorName: "Dr. Dinh Pham",
        orderId: 119,
        childId: 19,
        childName: "Hoa Dang"
    },
    {
        id: 20,
        date: "2025-03-20T12:30:00",
        status: "COMPLETED",
        doctorName: "Dr. Kiet Le",
        orderId: 120,
        childId: 20,
        childName: "Binh Vu"
    }
];

// Batch job 2 weeks - HARD ??? TANH

// [REUSE] GET api/v1/schedules/{scheduleId} (Co roi)

// PUT api/v1/customers/schedules/{scheduleId}/feedback - EASY - Moc Nguyen

// POST api/v1/customers/schedules/{scheduleId}/reaction - EASY - Moc Nguyen

