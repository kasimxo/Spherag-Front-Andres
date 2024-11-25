# Prueba técnica de Desarrollador FrontEnd JS

## Descripción

El propósito de este proyecto es construir una página que permita la visualización de los datos obtenidos por un dispositivo IoT. Esta página deberá tener un diseño responsive y buen rendimiento. El proyecto deberá a su vez cumplir con los estándares de clen code y respetar una arquitectura MVC. 

## Instalación:

- A través de un ejecutable (solo disponible para Windows):
Puedes instalar y probar el proyecto descargando la carpeta comprimida dentro del apartado Releases de este repositorio. En ella encontrarás un archivo ejecutable con el nombre  "Spherag-frontend-andres".

Al ejecutarlo, automáticamente se podrá acceder a la página introduciendo como dirección web localhost:5000 en cualquier navegador.

- Descargando el proyecto:
Si prefieres descargar el proyecto completo para poder ver el código fuente y sus clases, puedes clonar este repositorio para después abrirlo en un IDE:

git clone git@github.com:kasimxo/Spherag-Front-Andres.git

## Tecnologías utilizadas:

Este proyecto ha sido construido con las mismas tecnologías listadas en la oferta:

- Bootstrap: Diseño visual y de componentes

- DevExtreme: Componentes para la visualización de datos (gráfico)

- JQuery: Framework de JS que permite una mayor facilidad de manipulación del DOM

- .Net MVC: Tecnología principal del proyecto. 

## Estructura del proyecto:
- /wwwroot -> Contiene los archivos css, js, libs y archivos estáticos necesarios para la página

- /Services -> Interacción con la API. Todo lo relacionado con la API (token de login, peticiones, repuesta) está aquí

- /Models -> Los modelos del proyecto

- /Views -> Las vistas del proyecto. En este proyecto se han usado únicamente dos distintas, _Layout e Index

- /Controllers -> Los controladores para las vistas. El controlador de Index es HomeController y es el encargado de manejar las interacciones del usuario

## Consideraciones:

![CapturaPruebaTecnicaFirefox](https://github.com/user-attachments/assets/33e98fc7-046f-4c34-b883-5cdb0b14f527)

- Se ha añadido paginación en la muestra de los mensajes de log, pese a que no estaba incuido en la captura de ejemplo para mejorar la experiencia de usuario, ya que de otro modo se producía un scroll excesivo.

- No se ha incluido (por el momento) un mecanismo para refrescar el token de la API (debido a la falta de documentación para ello), aunque se ha dejado planteada su implementación.

- Todos los iconos han sido extraídos de la librería de iconos de Bootstrap (a excepción del logo de Spherag). Debido a ello, algunos iconos pueden variar con respecto a la referencia.

## Autor:

Nombre: Andrés Baños Lajusticia

Email: andres.banos.lajusticia@gmail.com

LinkedIn: https://www.linkedin.com/in/andres-banos-lajusticia

La aplicación ha sido probada en los principales navegadores: Google Chrome, Firefox, Microsoft Edge.
