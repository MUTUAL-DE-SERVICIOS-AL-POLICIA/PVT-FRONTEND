# PVT-FRONTEND

***NOTA:** Se usó el sistema operativo GNU/Linux en su distribución *Ubuntu 20.04**

## Requisitos
    
- Instalar ***Node.js*** en su versión reciente de *LTS*, (Al momento de redactar esta documentación, la versión LTS de node es: ***LTS v16.14.0***).

- Instalar yarn versión más reciente.

Puede instalar ***Node.js*** en su versión LTS, a través de ***nvm*** (herramienta para administrar múltiples versiones de Node.js) o consultar la [documentación oficial](https://nodejs.org/es/docs/) para su instalación.

## Instalación de la última versión LTS de node mediante nvm

### Instalación de la herramienta nvm

La instalación de la herramienta para administrar múltiples versiones de Node.j (nvm) se lo realiza con el siguiente comando:

`curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash`

Activando la variable de entorno de *nvm*:

`source ~/.bashrc`

Instalando la versión LTS v16.14.0 de Node.js:

`nvm install v16.14.0`

Compruebe la instalación con el siguiente comando:

`node --version`


## Instalación de yarn 

Instalando yarn mediante *curl*. Si aún no tiene instalado *curl* en su sistema operativo, lo puede realizar con el siguiente comando:

`sudo apt install curl`

Añadir la clave GPG para verificar los paquetes de Yarn. Para ello debe importar la clave GPG con el siguiente comando:

`curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`

Habilitando el repositorio y añadiendo el repositorio yarn en Ubuntu:

`echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`

Actualizar el caché e instalar yarn

`sudo apt update && sudo apt install yarn`

Compruebe que tenga instalado yarn:

`yarn --version`

## Plugins

El directorio de plugins contiene plugins de JavaScript que desea ejecutar antes de instanciar la aplicación raíz Vue.js. Puede agregar acá complementos Vue e inyectar funciones o constantes, mediante la adición de la ruta a los plugins en el archivo `nuxt.config.js`.

Más información sobre el uso de este directorio en la [documentación](https://nuxtjs.org/docs/directory-structure/plugins/).


### Instalar el plugin **dotenv**

Puede realizar la instalación con el administrador de paquetes *npm*:

`npm install @nuxtjs/dotenv`

O con el administrador de paquetes *yarn*:

`yarn add @nuxtjs/dotenv`

## Configuraciones

Debe realizar una serie de configuraciones en el proyecto antes de poder ejecutarlo.

### Adicionar el archivo .env

Dicho archivo sirve para personalizar las variables de entorno de la aplicación. Debe configurar el archivo, con los siguientes parámetros:

`APP_TITLE = Plataforma Virtual de Trámites`

`BASE_URL = http://<ip-backend>:<puerto>`

La ip y el puerto deben apuntar a la dirección donde está implementado el **BACKEND**.


## Modo Ejecución

Para ejecutar el proyecto, utilizamos el administrador de paquetes yarn. 

- Instalar dependenias

    `yarn install`
    
- Hacer correr el proyecto:

    `yarn dev`

## Desplegar el proyecto con Docker

- Construcción de la imagen, ejecutar dentro del directorio del proyecto

```sh
docker build --no-cache -t muserpol/frontend:2.0 .
```

- Crear el contenedor para instalar las dependencias

```sh
docker run -it -p 3001:5000 --name pvt-frontend -v /path/to/your/code/PVT-FRONTEND:/usr/src/nuxt-app muserpol/frontend:2.0 /bin/sh
```
- Una vez ingresado al contenedor ejecutar la instalacion de las dependencias

```sh
npm install
```

```sh
npm run build
```

- Salir del contenedor

```sh
exit
```

- Eliminar el contenedor

```sh
docker rm -f pvt-frontend
```

- Levantar el contenedor listo para produccion

```sh
docker run -d -p 3001:5000 --name pvt-frontend -v /path/to/your/code/PVT-FRONTEND:/usr/src/nuxt-app muserpol/frontend:2.0
```

# Actualización de cambios

- Descargar cambios desde fuera del contenedor
- ingresar al contenedor y compilar

```sh
docker exec -it id_contenedor /bin/sh
```

```sh
npm run build
```

- Reiniciar el contenedor

```sh
docker restart id_contenedor
```