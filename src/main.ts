// Main file

// import business funcs
import { Wallet, createWalletTable, deleteWalletTable } from "./models/wallet";
import { WalletTransaction, createWalletTransactionTable, deleteWalletTransactionTable } from "./models/walletTransactions";
import { WalletHandler } from './apis/walletHandler';


/* uncomment the following the create and delete respective wallet tables schema in dyanmodb */

    //createWalletTable();
    //deleteWalletTable();

    //createWalletTransactionTable();
    //deleteWalletTransactionTable();


/* 
Test run for creating a wallet and inserting an idempotent transaction 
please comment and uncomment respective funcs respectively
*/

// create a new wallet
const wallet_handler = new WalletHandler();
const new_wallet: Wallet = {
    userId: '1',
    balance: 0,
    currency: 'USDT',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}
//wallet_handler.createWallet(new_wallet);
// check balance
//wallet_handler.getWalletBalance('1');

// insert wallet transaction and update balance atomically
const wallet_transaction: WalletTransaction = {

    userId : '1',
    tid : '1',  // idempotent key
    type : 'credit',
    amount: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
}


wallet_handler.makeTransaction(wallet_transaction);
// check balance after transaction
//wallet_handler.getWalletBalance('1');


