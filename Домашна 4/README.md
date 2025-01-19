### Линк:

https://www.youtube.com/watch?v=TlqqBDR0XB0

#
Analytics-script е мапиран на порта 5000 преку сопствениот Dockerfile, каде потоа се стартува на истата порта за да биде достапен од другите ресурси.
```bash
docker build -t analytics-script .
docker run -p 5000:5000 analytics-script
```

index.js се користи како API помеѓу клиентската страна и серверската страна, иницијално е мапиран на порта 3001 и стартуван на истата порта.
```bash
docker build -t backend-app .
docker run -p 3001:3001 backend-app
```
Клиентската страна со користење на React мапирана преку Dockerfile на порта 3000, која има овозможен пристап до останатите images.
```bash
docker build -t frontend-app .
docker run -p 3000:3000 frontend
```