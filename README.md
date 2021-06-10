# account-manager
Handles all authentication and account recovery processes.

### Broadcast

#### Socket Event Emitters
key | data | description 
| --- | --- | --- |
account:deleted | userId | broadcasts userId of deleted account |
account:login | {user, device, accessToken, refreshToken } | sends login data to rq scanned device |
keys:updated | publicKey | broad casts public key when it is updated |

### Socket Event Listeneres
key | data | description 
| --- | --- | --- |
Seconds | account:deleted | 283 | 290 |

### Single Client

#### Socket Event Emitters
key | data | description 
| --- | --- | --- |
account:deleted | userId | broadcasts userId of deleted account |
account:login | {user, device, accessToken, refreshToken } | sends login data to rq scanned device |
keys:updated | publicKey | broad casts public key when it is updated |

### Socket Event Listeneres
key | param | description 
| --- | --- | --- |
get:client:info | socketId | { useragent } |
came:online | { userId, deviceId } | { useragent } |
came:online | { userId, deviceId } | { useragent } |
came:online | { userId, deviceId } | { useragent } |


