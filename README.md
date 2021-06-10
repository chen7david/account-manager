# account-manager
Handles all authentication and account recovery processes.

### Broadcast

#### Socket Event Emitters
name | key | data | description 
--- | --- | --- | --- |
Seconds | account:deleted | userId | broadcasts userId of deleted account |
Seconds | account:login | {user, device, accessToken, refreshToken } | sends login data to rq scanned device |
Seconds | keys:updated | publicKey | broad casts public key when it is updated |

### Socket Event Listeneres
name | key | data | description 
--- | --- | --- | --- |
Seconds | account:deleted | 283 | 290 |

### Single Client

#### Socket Event Emitters
name | key | data | description 
--- | --- | --- | --- |
Seconds | account:deleted | userId | broadcasts userId of deleted account |
Seconds | account:login | {user, device, accessToken, refreshToken } | sends login data to rq scanned device |
Seconds | keys:updated | publicKey | broad casts public key when it is updated |

### Socket Event Listeneres
key | param | description 
--- | --- | --- |
get:client:info | socketId | { useragent } |
came:online | { userId, deviceId } | { useragent } |
came:online | { userId, deviceId } | { useragent } |
came:online | { userId, deviceId } | { useragent } |


