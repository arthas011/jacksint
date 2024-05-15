
// imports
import {dynamoDB} from './pool';
import {DynamoDB} from 'aws-sdk';


// Define an interface for the Wallet model
export interface Wallet {
    userId: string;       // Unique identifier for the wallet
    balance: number;      // Current balance in the wallet
    currency: string;     // Currency of the wallet (e.g., USD, EUR)
    createdAt : string;   // wallet creation time
    updatedAt : string    // wallet profile last update time
  }
  
// Define an interface for creating a new wallet
export interface WalletConstructor {
    name: string;
    initialBalance: number;
    currency: string;
}

export const WALLET_TABLE_NAME = "Wallet";


// create wallet 
export async function createWalletTable(){

    const params: DynamoDB.CreateTableInput = {

        TableName: WALLET_TABLE_NAME,
        KeySchema: [
            { AttributeName: 'userId', KeyType: 'HASH' }, // Partition key
           
        ],
        AttributeDefinitions: [
            { AttributeName: 'userId', AttributeType: 'S' }, // S for String
        ],
        ProvisionedThroughput:{
            ReadCapacityUnits:5,
            WriteCapacityUnits:5
        }
    }

    try{
        const data = await dynamoDB.createTable(params).promise();
        console.log('Table created:', data);
    }catch(err){
        console.error('Error creating wallet table:', err);

    }
}

// delete wallet
export function deleteWalletTable(){

    const params: DynamoDB.DeleteTableInput = {

        TableName: WALLET_TABLE_NAME
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
