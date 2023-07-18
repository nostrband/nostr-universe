# nostr-universe

To build apk or start locally:

```
npm i
cordova plugin add https://github.com/nostrband/nostr-keystore-cordova-plugin.git
cordova platform add android
cordova build android
```

apk file will be generated to nostr-band-cordova/platforms/android/app/build/outputs/apk/debug/app-debug.apk

To start application locally open nostr-band-cordova/platforms/android package in android studio and start app


надо сделать:

1. хранение запроса и ответа в локал сторадж:
 объект: где ключи (сгенерированные айдишки), значение имя функции (getPublicKey/signEvent) и ответ.
 как только ответ получен - удаляем из локалстораджа этот объект по айдишке
 сщщтвественно как запрос создается - надо генерировать айди и класть в локал сторадж (сейчас хранится просто пустая стринга
в локал сторадже для всего)
2. подумать нужны ли эти таймауты? может пока нет респонса то и фигачим рекурсией? или сделать какое то ограничение?
   может 1-2 минуты будет достаточно?
3. сделать сайн эвент
4. код ревью - все поправить
