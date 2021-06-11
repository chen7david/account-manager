# account-manager
Handles all authentication and account recovery processes.

### Sockets

#### Broadcast Events
listener | emitter | params | data 
| ---| --- | --- | --- |
| - | account:deleted | - | userId |
| - | account:login | - | {user, device, accessToken, refreshToken } | 
| - | keys:updated | - | publicKey | 

#### Socket Events
listener | emitter | params | data 
| --- | --- | --- | --- |
get:client:info | set:client:info | deviceId:<code>str</code> | connection:<code>obj</code> |
<code>http</code>post:/qrlogin | account:qr:login | {socketId, loginInfo:<code>obj</code>} | loginInfo:<code>obj</code> |
came:online | is:online | { userId, deviceId } | deviceId:<code>str</code> |
went:offline | is:offline | deviceId:<code>str</code> | deviceId:<code>str</code> |
check:status | is:online / is:offline | deviceId:<code>str</code> | deviceId:<code>str</code> |


### Routes

1. routes that require an access-token are marked with <code>*</code>
2. routes that require admin level clearance are marked with <code>A</code>

#### Auth
| # | ENDPOINT  | METHOD | PAYLOAD |
| ------------- | ------------- | ------------- | ------------- |
|1| /register  | POST  | user:<code>object</code>  |
|2| /login  | POST  | accessToken:<code>string</code>, refreshToken:<code>string</code>, user:<code>object</code> |
|3| /qrlogin | POST<code>*</code> | accessToken:<code>string</code>, refreshToken:<code>string</code>, user:<code>object</code> |
|4| /refresh  | PATCH | accessToken:<code>string</code>, user:<code>object</code> |
|5| /publickey | GET | pubkey:<code>string</code> |
|6| /email-verification  | POST  | <code>null</code> |
|7| /email-verification  | PATCH | <code>null</code> |
|8| /recover-password  | POST | <code>null</code> |
|9| /recover-password  | PATCH | <code>null</code> |
|10| /renewkeys | PATCH<code>*</code> | <code>null</code> |

#### User
| # | ENDPOINT  | METHOD | PAYLOAD |
| ------------- | ------------- | ------------- | ------------- |
|1| /user | GET<code>*</code> | user:<code>object</code> |
|2| /user | PATCH<code>*</code> | user:<code>object</code> |
|3| /user-devices | GET<code>*</code> | devices:<code>array</code> |
|4| /user-password | PATCH<code>*</code> | <code>null</code> |
|5| /user | DELETE<code>*</code> | <code>null</code> |
|6| /users | GET<code>*</code><code>A</code>  | users:<code>array</code> |
|7| /users/:id| GET<code>*</code><code>A</code> | user:<code>object</code> |
|8| /users/:id| PATCH<code>*</code><code>A</code> | user:<code>object</code> |
|9| /users/:id  | DELETE<code>*</code><code>A</code> | <code>null</code> |
|10| /users/:id/devices| GET<code>*</code><code>A</code> | devices:<code>array</code> |
|11| /users/:id/roles| GET<code>*</code><code>A</code> | roles:<code>array</code> |
|12| /users/:id/roles| PATCH<code>*</code><code>A</code> | roles:<code>array</code> |





