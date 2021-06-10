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




