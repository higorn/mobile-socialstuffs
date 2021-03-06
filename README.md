# Midias sociais em aplicativos mobile híbridos com ngCordova

## Sumário

1. [Facebook](#facebook)
  * 1.1. [Preparação](#1.1)
  * 1.2. [Instalação Android](#1.2)
  * 1.3. [Instalação IOs](#1.3)
  * 1.4. [Utilizando](#1.4)
  * 1.4.1 [Métodos](#1.4.1)
  * 1.4.2 [Exemplo de login](#1.4.2)
  * 1.4.3 [Exemplo de compartilhamento](#1.4.3)
  * 1.4.4 [Recuperando informações do usuário](#1.4.4)

1. [Referências](#referências)

## Facebook

### [1.1](#1.1) <a name='1.1'></a> Preparação
Primeiramente é necessário criar um AppID no portal de desenvolvimento do Facebook (https://developers.facebook.com). Em 'My Apps' selecione a opção 'Add a New App'.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/getStarted-1.png)
  Selecione a plataforma desejada, entre com um nome para o App e clique no botão para criar o App ID.
  Após isso você será direcionado para a página de Quick Start da plataforma, clique em 'Skip Quick Start' no canto superior direito para pular essa etapa que será realizada mais a frente.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/fbdev-quickstart.png)
  Agora você está na dashboard do seu App, onde tem o App ID e o nome do seu App que serão usados para configuração do cordova.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/fbdev-dashboard.png)

**[⬆ back to top](#sumário)**

### [1.2](#1.2) <a name='1.2'></a> Instalação Android
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

$ phonegap plugin add --save cordova-plugin-facebook4 --variable APP_ID="App ID" --variable APP_NAME="App Name"

$ cordova plugin add https://github.com/EddyVerbruggen/SocialSharing-PhoneGap-Plugin.git

$ cordova build android

# Instale o ngCordova

$ echo '{"directory": "www/bower_components"}' > .bowerrc
$ bower install -S ngCordova
```

Para a autenticação funcionar de forma nativa no android, é necessário adicionar a plataforma Android no seu portal de desenvolvimento do Facebook (https://developers.facebook.com).
Em 'Settings/Configurações' clique no botão 'Add Platform' e selecione Android.

![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/fbdev-addplatform.png)

Em seguida preencha o formulário conforme exemplo abaixo.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/fbdev-platformsettings.png)

Para saber o nome do pacote da sua aplicação (Package Name) consulte o arquivo platforms/android/AndroidManifest.xml
E para gerar a chave de denvolvimento execute o seguinte comando abaixo
```sh
$ keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore | openssl sha1 -binary | openssl base64

# Caso pessa senha, deixe em brando apenas pressionando enter
```
**[⬆ back to top](#sumário)**

### [1.3](#1.3) <a name='1.3'></a> Instalação IOS

Adicione e configure a plataforma IOs no Portal de Desenvolvimento do Facebook (https://developers.facebook.com) conforme a imagem abaixo.
![alt tag](https://github.com/higorn/mobile-socialstuffs/blob/master/resources/img/fbdev-platformios.png)

Adicione o Bundle ID que você encontra no Xcode do projeto e abilite a opção 'Single Sign On'

Compile para plataforma ios

```sh
$ cordova build ios
```
Agora o arquivo 'platforms/ios/Paludo Fidelidade/Paludo Fidelidade-Info.plist' e localize a opção 'App Transport Security Settings', expanda a opção e adicione a subtag 'Allow Arbitrary Loads' (no botão de + ao lado) e sete como 'YES'.
Pronto, agora é só abrir o projeto no xcode e executar.

**[⬆ back to top](#sumário)**

### [1.4](#1.4) <a name='1.4'></a> Utilizando

Inclua o ng-cordova.js ou ng-cordova.min.js no seu index.html antes do cordova.js e após seu angularjs/ionic, já que o ngCordova depende do angularjs.

```javascript
<script src="bower_components/ngCordova/dist/ng-cordova.js"></script>
<script src="cordova.js"></script>
```

Injete o ngCordova como dependência no seu módulo angular

```javascript
angular.module('myApp', ['ngCordova'])
```
**[⬆ back to top](#sumário)**

#### [1.4.1](#1.4.1) <a name='1.4.1'></a> Métodos

#### login(permissions)

Param | Type | Detail
------|------|--------
permissions | String Array | Um string array de permissões que o seu app requer. Ex: ["public_profile", "email"]

Retorna um objeto com as informações do usuário, como id, lastName, etc.

#### showDialog(options)

Param | Type | Detail
------|------|--------
options | Object | Um objeto JSON com 3 keys: method, link, caption. Todos do tipo string.

#### api(path, permissions)
Param | Type | Detail
------|------|--------
path | String | O caminho da API Facebook. Ex: me, me/photos, search?q={your-query}
permissions | String Array | Um string array de permissões que o seu app requer. Sete para null para que o app do Facebook não abra novamente.

#### getLoginStatus(message)
Verifica se o usuário já está logado. Se ele ja estiver logado, não é precisso logar novamente e o método api pode ser chamado.

#### getAccessToken(message)
Recupera o tokem de acesso da sessão atual.

#### logout(message)
Faz logout do Facebook

**[⬆ back to top](#sumário)**

#### [1.4.2](#1.4.2) <a name='1.4.2'></a> Exemplo de Login

```javascript
module.controller('MyCtrl', function($scope, $cordovaFacebook) {

  $cordovaFacebook.login(["public_profile", "email", "user_friends"])
    .then(function(success) {
      // { id: "634565435",
      //   lastName: "bob"
      //   ...
      // }
    }, function (error) {
      // error
    });
...    
    
```

#### [1.4.3](#1.4.3) <a name='1.4.3'></a> Exemplo de Compartilhamento

```javascript
...

# usando $cordovaSocialSharing

$cordovaSocialSharing.shareViaFacebook(message, image, link).then(function(result) {
  // {true}
}, function(error) {
  // error
});

# usando $cordovaFacebook

$cordovaFacebook.showDialog({
  method: 'share',
  href: link
}).then(function(result) {
  // {"post_id":"1196750357008..."}
}, function(error) {
  // error
});

```

#### [1.4.4](#1.4.4) <a name='1.4.4'></a> Recuperando Informações do Usuário

```javascript
...

 $cordovaFacebook.api("me", ["public_profile"])
    .then(function(success) {
      // success
    }, function (error) {
      // error
    });
    
...
```

## Referências
- [2.1](#2.1) <a name='2.1'></a> http://ngcordova.com/docs/plugins/facebook/
- [2.2](#2.2) <a name='2.2'></a> https://github.com/Wizcorp/phonegap-facebook-plugin/
- [2.3](#2.3) <a name='2.3'></a> https://developers.facebook.com

**[⬆ back to top](#sumário)**
