# OTABANK

> CLIENTS HTTP REQUEST METHODS:
>
> - GET: '/clients' - To show all clients.
> - GET: '/clients/:id' - To find a client by id (the id need to be a integer number).
> - POST: '/clients' - To create a client (need a 'name', 'password', 'email', 'number' and 'address' in the json body).
> - PATCH: '/clients/:id - To update a client (the id need to be integer number and need a name, password, email, number and address in the json body).
> - DELETE '/clients/:id - To delete a client and all his accounts (the id need to be a integer number).

> ACCOUNTS HTTP REQUEST METHODS:
>
> - GET: '/accounts' - To show all accounts.
> - GET: '/accounts/:id' - To find an account by id (the id need to be a integer number).
> - POST: '/accounts' - To create an account (need the 'clientId' in the json body).
> - DELETE '/accounts/:id - To delete an account (the id need to be a integer number).

> TRANSACTIONS HTTP REQUEST METHODS:
>
> - GET: '/transactions' - To show all transactions.
> - GET: '/transactions/:id' - To find an transaction by id (the id need to be a integer number).
> - POST: '/transactions' - To create an transaction (need the 'account', 'type', 'toAccount' and 'value' in the json body).
> - DELETE '/transactions/:id - To delete an transaction (the id need to be a integer number).
> 
> Transactions types: 'balance', 'deposit', 'withdraw' and 'transfer'. Just need to inform the 'toAccount' and 'value' if the transaction type is 'transfer'.
>'account' and 'toAccount' is the number of the account NOT THE ID.