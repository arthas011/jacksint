
// imports
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Wallet, WALLET_TABLE_NAME } from '../models/wallet';
import {doClient} from '../models/pool';
import { WalletTransaction, WALLET_TRANSACTIONS_TABLE_NAME } from '../models/walletTransactions';


// Define the repository class for interacting with wallets in DynamoDB
export class WalletHandler {

  private readonly documentClient: DocumentClient;

  constructor() {
    // Acquire the DynamoDB DocumentClient
    this.documentClient = doClient;
  }

  // Method to retrieve a wallet by its ID
  async getWalletBalance(userId: string): Promise<Wallet | null> {
    const params = {
      TableName: WALLET_TABLE_NAME,
      Key: {
        userId: userId
      }
    };

    try {
      const result = await this.documentClient.get(params).promise();
      console.log("Debug Log Result ", result);
      console.log("Current Balance : ", result.Item?.balance);
      return result.Item as Wallet | null;
    } catch (error) {
      console.error('Error getting wallet from DynamoDB:', error);
      return null;
    }
  }

  // Method to create a new wallet
  async createWallet(wallet: Wallet): Promise<boolean> {
    const params = {
      TableName: WALLET_TABLE_NAME,
      Item: wallet,
      ConditionExpression: 'attribute_not_exists(userId)'
    };

    try {
      console.log("wallet creation params ", params)
      const data = await this.documentClient.put(params).promise();
      console.log("Wallet created successfully ", data);
      return true;
    } catch (error) {
      console.error('Error creating wallet in DynamoDB:', error);
      return false;
    }
  }

  // Method to create new wallet transaction and update balance
  async makeTransaction(wt: WalletTransaction){

    const params = {
      TransactItems:[
        {
          Put:{
            TableName: WALLET_TRANSACTIONS_TABLE_NAME,
              Item: wt,
              ConditionExpression: 'attribute_not_exists(tid)'
          }
        },
        {
          Update: {
            TableName: WALLET_TABLE_NAME,
            Key: {
                userId: wt.userId
            },
            UpdateExpression: wt.type == 'credit' ? 'SET balance = balance + :amount, updatedAt = :newdate'
                            :'SET balance = balance - :amount, updatedAt = :newdate',
            ExpressionAttributeValues: {
                ':amount': wt.amount,
                ':newdate': new Date().toISOString()
            },
            ConditionExpression: wt.type == 'debit' ? 'attribute_exists(userId) AND balance >= :amount'
                            :'attribute_exists(userId)',
            ReturnValues: 'ALL_NEW'
        }
        }
      ]
    };

    try {

      // distributed redis lock to handle race conditions across regions
      // const client = require('redis').createClient();
      // const { promisify } = require('util');
      // const lock = promisify(require('redis-lock')(client));

      // const unlock = await lock('lockString');
      // Perform your task;
      // perform business logic
      const response = await this.documentClient.transactWrite(params).promise();
      
      // release distributed lock
      //unlock();
      console.log("Transaction Response ", response);
    } catch (error) {
      console.error("Error inserting wallet transaction and updating balance transactionally:", error);
      throw error;
    }
  }
}
