# IN-Server
## MVC패턴 사용
### controllers, views, model 디렉토리


## MVC 패턴 Guide line: 

### ex)로그인 과정
### 1. model디렉토리에 저장된 Account.js의 accounts 스키마를 exports.moudle를 통해 내보냅니다. controller디렉토리의 authenticationRoutes.js에서 const Acouunt = require('../model/Account)를 통해### accounts 스키마를 Account로 받고 로직을 수행한 뒤 다시 한번 exports.auth로 내보내고 sever.js에서 require로 받은 뒤 최종적으로 실행이 됩니다.

## 그림 예시 
### ![image](https://github.com/HanEum-IsalNaesal/IN-Server/assets/83203154/885e95fb-ef3e-404b-ab19-4d6e9a058482)

### ![image](https://github.com/HanEum-IsalNaesal/IN-Server/assets/83203154/68d188fd-9b7c-454f-886a-cfca74b51489)

### ![image](https://github.com/HanEum-IsalNaesal/IN-Server/assets/83203154/bcb225e5-f080-4410-989f-5cefd5c962fa)



