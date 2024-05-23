# Music Album Backend

## Descripción

Este es el backend del proyecto de gestión de álbumes de música. Proporciona API REST para la gestión de álbumes, incluyendo la subida de imágenes de portada y archivos de canciones, así como la notificación de nuevos álbumes utilizando long polling.

## Tecnologías Utilizadas

- Node.js
- Express
- MongoDB
- Mongoose
- Cloudinary (para almacenamiento de imágenes y archivos de audio)

## Instalación

1. Clona el repositorio:
   ```bash
   git clone https://github.com/YaelAguilar/-project-ws-polling-backend.git
   ```
2. Navega al directorio del proyecto:
   ```bash
   cd -project-ws-polling-backend
   ```
3. Instala las dependencias:
   ```bash
   npm install
   ```

## Uso

1. Inicia el servidor:
   ```bash
   npm start
   ```
2. El servidor debería estar corriendo en `http://localhost:8080`.

## Endpoints

- `POST /api/albums`: Subir un nuevo álbum.
- `GET /api/albums`: Obtener todos los álbumes.
- `GET /api/albums/notifications`: Esperar nuevas notificaciones de álbumes (long polling).
- `GET /api/albums/:id`: Obtener un álbum por su ID.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT.
