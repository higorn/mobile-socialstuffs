# Midias sociais em aplicativos mobile híbridos com ngCordova

## Sumário

1. [Facebook](#Facebook)

## Facebook

- [1.1](#1.1) <a name='1.1'></a> **Preparação**: Primeiramente é necessário criar um AppID no portal de desenvolvimento do Facebook (https://developers.facebook.com). Em 'My Apps' selecione a opção 'Add a New App'.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/getStarted-1.png)
  Selecione a plataforma desejada, entre com um nome para o App e clique no botão para criar o App ID.
  Após isso você será direcionado para a página de Quick Start da plataforma, clique em 'Skip Quick Start' no canto superior direito para pular essa etapa que será realizada mais a frente.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/fbdev-quickstart.png)
  Agora você está na dashboard do seu App, onde tem o App ID e o nome do seu App que serão usados para configuração do cordova.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/fbdev-dashboard.png)

- [1.2](#1.2) <a name='1.2'></a> **Instalação Android**
```sh
# Cria a aplicação e adicione a plataforma
$ cordova create myapp br.com.yourdomain.mobile.myapp myApp
$ cd myapp
$ cordova platform add android

# Configure o FB App ID em res/values/facebookconnect.xml
$ mkdir -p res/values
$ vi res/values/facebookconnect.xml

<resources>
    <string name="fb_app_id">123456789</string>
    <string name="fb_app_name">myapp</string>
</resources>

```
Em seguida continue com a configuração do cordova executando os seguintes comandos

```sh
# IMPORTATE: Não esqueça de trocar o APP_ID e APP_NAME para os da sua aplicação
$ cordova -d plugin add https://github.com/phonegap/phonegap-facebook-plugin.git \
 --variable APP_ID="123456789" --variable APP_NAME="myApp"

$ android update project --subprojects --path "platforms/android" \
 --target android-22 --library "CordovaLib"

$ android update project --subprojects --path "platforms/android" \
 --target android-22 --library "phonegap-facebook-plugin/myapp-FacebookLib"
 
 $ echo '{"directory": "www/bower_components"}' > .bowerrc
 $ bower install -S ngCordova
```

Inclua o ng-cordova.js ou ng-cordova.min.js no seu index.html antes do cordova.js e após seu angularjs/ionic, já que o ngCordova depende do angularjs.

```javascript
<script src="bower_components/ngCordova/dist/ng-cordova.js"></script>
<script src="cordova.js"></script>
```

Injete o ngCordova como dependência no seu módulo angular

```javascript
angular.module('myApp', ['ngCordova'])
```


- [1.3](#1.3) <a name='1.3'></a> **Instalação IOS**

