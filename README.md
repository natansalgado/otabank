# OTABANK

> CLIENTS HTTP REQUEST METHODS:
>
> - GET: '/clients' - To show all clients.
> - GET: '/clients/:id' - To find a client by id (the id need to be a integer number).
> - POST: '/clients' - To create a client (need a name, password, email, number and address in the json body).
> - PATCH: '/clients/:id - To update a client (the id need to be integer number and need a name, password, email, number and address in the json body).
> - DELETE '/clients/:id - To delete a client and all his accounts (the id need to be a integer number).

> ACCOUNTS HTTP REQUEST METHODS:
>
> - GET: '/accounts' - To show all accounts.
> - GET: '/accounts/:id' - To find an account by id (the id need to be a integer number).
> - POST: '/accounts' - To create an account (need the clientId in the json body).
> - PATCH: '/accounts - To add a amount of money to a count (need the account number and a value to add to the account (can be a negative number to remove) in the json body).
> - DELETE '/accounts/:id - To delete an account (the id need to be a integer number).
