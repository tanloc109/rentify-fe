export const transactions = [
    {
        id: 1,
        quantity: 10,
        exportDate: '2021-09-01T00:00:00',
        batchId: 1,
        batchCode: 'B001',
    },
    {
        id: 2,
        quantity: 15,
        exportDate: '2021-09-02T00:00:00',
        batchId: 2,
        batchCode: 'B002',
    },
    {
        id: 3,
        quantity: 20,
        exportDate: '2021-09-03T00:00:00',
        batchId: 3,
        batchCode: 'B003',
    },
    {
        id: 4,
        quantity: 25,
        exportDate: '2021-09-04T00:00:00',
        batchId: 4,
        batchCode: 'B004',
    },
    {
        id: 5,
        quantity: 30,
        exportDate: '2021-09-05T00:00:00',
        batchId: 5,
        batchCode: 'B005',
    },
    {
        id: 6,
        quantity: 12,
        exportDate: '2021-09-06T00:00:00',
        batchId: 6,
        batchCode: 'B006',
    },
    {
        id: 7,
        quantity: 18,
        exportDate: '2021-09-07T00:00:00',
        batchId: 7,
        batchCode: 'B007',
    },
    {
        id: 8,
        quantity: 22,
        exportDate: '2021-09-08T00:00:00',
        batchId: 8,
        batchCode: 'B008',
    },
    {
        id: 9,
        quantity: 16,
        exportDate: '2021-09-09T00:00:00',
        batchId: 9,
        batchCode: 'B009',
    },
    {
        id: 10,
        quantity: 13,
        exportDate: '2021-09-10T00:00:00',
        batchId: 10,
        batchCode: 'B010',
    },
    {
        id: 11,
        quantity: 27,
        exportDate: '2021-09-11T00:00:00',
        batchId: 11,
        batchCode: 'B011',
    },
    {
        id: 12,
        quantity: 21,
        exportDate: '2021-09-12T00:00:00',
        batchId: 12,
        batchCode: 'B012',
    },
    {
        id: 13,
        quantity: 10,
        exportDate: '2021-09-13T00:00:00',
        batchId: 13,
        batchCode: 'B013',
    },
    {
        id: 14,
        quantity: 17,
        exportDate: '2021-09-14T00:00:00',
        batchId: 14,
        batchCode: 'B014',
    },
    {
        id: 15,
        quantity: 35,
        exportDate: '2021-09-15T00:00:00',
        batchId: 15,
        batchCode: 'B015',
    },
    {
        id: 16,
        quantity: 29,
        exportDate: '2021-09-16T00:00:00',
        batchId: 16,
        batchCode: 'B016',
    },
    {
        id: 17,
        quantity: 14,
        exportDate: '2021-09-17T00:00:00',
        batchId: 17,
        batchCode: 'B017',
    },
    {
        id: 18,
        quantity: 19,
        exportDate: '2021-09-18T00:00:00',
        batchId: 18,
        batchCode: 'B018',
    },
    {
        id: 19,
        quantity: 16,
        exportDate: '2021-09-19T00:00:00',
        batchId: 19,
        batchCode: 'B019',
    },
    {
        id: 20,
        quantity: 24,
        exportDate: '2021-09-20T00:00:00',
        batchId: 20,
        batchCode: 'B020',
    },
    {
        id: 21,
        quantity: 28,
        exportDate: '2021-09-21T00:00:00',
        batchId: 21,
        batchCode: 'B021',
    },
]

export const addTransaction = ({
    quantity,
    exportDate,
    batchId,
    batchCode,
}) => {
    transactions.push({
        id: transactions.length + 1,
        quantity,
        exportDate,
        batchId,
        batchCode,
    })
}

export const updateTransaction = ({
    id,
    quantity,
    exportDate,
    batchId,
    batchCode,
}) => {
    const index = transactions.findIndex(transaction => transaction.id === id);
    if (index === -1) {
        throw new Error('Transaction not found');
    }
    transactions[index] = {
        id,
        quantity,
        exportDate,
        batchId,
        batchCode,
    }
}

export const deleteTransactions = (ids) => {
    if (ids.length === 0) throw new Error('No transaction to delete');

    ids.forEach(id => {
        const index = transactions.findIndex(transaction => transaction.id === id);
        if (index >= 0) {
            transactions.splice(index, 1);
        }
    });

    console.log(transactions);
}