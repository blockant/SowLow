const Web3 = require('web3');
const HDWalletProvider = require('@truffle/hdwallet-provider');
const init = async() => { 
    try{

        //Current "ETH" transfers will be on Rinkeby network.

        const provider = new HDWalletProvider(
            'sort island camera clay tiger miss sting light scheme quit bid model',
            'https://rinkeby.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
          );
        let web = new Web3(provider);

        const account = await web.eth.getAccounts();
        const balanceOfAccount = await web.eth.getBalance(account[0]); 
        // This will fetch the eth balance of the central wallet.
        //Make a check that sending eth should be less than the balance of the central wallet.

        let amountToBeSent = 0.00001; //Amount to be sent to the winner

        await web.eth.sendTransaction({
            from: account[0], //account[0] will be the central address and will not change
            to: account[1],  //replace "account[1]" with the winner address
            value: web.utils.toWei(amountToBeSent.toString()), 
        }, function(err, transactionHash) {
            if (err) { 
                console.log(err); 
            } else {
                console.log(transactionHash); //Once we receive the transaction hash, transaction is initiated and will mostly be confirmed in 15-20s 
            }
        });

        //Above function will send the required ETH to the winner

        //Token address for SOWLOW test is = 0x1476e528528a649bb9d0dbf6b8d447f4e6f3c4ec
        //All tokens are minted to = 0x493ebfc970f376d32898f294da161a1fe2eae08c


    }catch(err){
        console.log(err)
    }
}
init();


//akshay-X (10) Mohit-Y (Owner)

//Akshay 2 