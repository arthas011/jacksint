
// imports
import {dynamoDB} from './pool';
import {DynamoDB} from 'aws-sdk';


// Define wallet transactions model
export interface WalletTransaction {
    userId: string      // unique user id
    tid: string;        // Unique transaction id
    type: string;       // transaction type credit or debit
    amount: number;     // amount involved in transaction
    createdAt: string,  // date string to hold transaction creation time
    updatedAt: string   // date string to hold transaction updated time
}

export const WALLET_TRANSACTIONS_TABLE_NAME = "WalletTransactions";

// create wallet transactions
export async function createWalletTransactionTable(){

    const params: DynamoDB.CreateTableInput = {

        TableName: WALLET_TRANSACTIONS_TABLE_NAME,
        KeySchema:[
            {AttributeName: 'userId', KeyType: 'HASH'},
            {AttributeName: 'tid', KeyType: 'RANGE'}, // idempotent key
        ],
        AttributeDefinitions:[

            {AttributeName: 'userId', AttributeType: 'S'},
            {AttributeName: 'tid', AttributeType: 'S'},
        ],
        ProvisionedThroughput:{
            ReadCapacityUnits:5,
            WriteCapacityUnits:5
        }
    }

    try{
        const data = await dynamoDB.createTable(params).promise();
        console.log('Wallet Transactions Table created:', data);
    }catch(err){
        console.error('Error creating wallet table:', err);

    }
}


// delete wallet transactions
export function deleteWalletTransactionTable(){

    const params: DynamoDB.DeleteTableInput = {

        TableName: WALLET_TRANSACTIONS_TABLE_NAME
    }
    
    // Delete the table
    dynamoDB.deleteTable(params, (err, data) => {
    if (err) {
        console.error("Unable to delete table. Error JSON:", JSON.stringify(err, null, 2));
    } else {
        console.log("Deleted table. Table description JSON:", JSON.stringify(data, null, 2));
    }
    });
}

