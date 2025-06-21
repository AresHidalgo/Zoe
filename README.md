# 📱 Zoe – Aplicación de Conexiones Sociales

Zoe es una aplicación móvil desarrollada con el objetivo de conectar personas mediante un sistema de emparejamiento y citas. Diseñada con una interfaz amigable, temas personalizables y funciones centradas en la experiencia del usuario.

---

## 🚀 Características Principales

- Registro e inicio de sesión (con autenticación JWT/OAuth2)
- Creación y edición de perfil con fotos e intereses
- Sistema de emparejamiento tipo Tinder (deslizar)
- Historial de matches y gestión de conexiones
- Calendario para agendar citas
- Temas personalizables (claro, oscuro, neumórfico)
- Notificaciones en tiempo real

---

## 🧑‍💻 Tecnologías Usadas

### Frontend:
- React Native / Flutter
- Tailwind CSS (si aplica)
- React Navigation
- Expo (si aplica)

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación
- Cloudinary para almacenamiento de imágenes
- Google Calendar API (para citas)

---

## 📦 Instalación

### Backend
```bash
cd server
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd app
npm install
npm run start
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del backend con:

```
PORT=5000
MONGO_URI=<tu_mongo_uri>
JWT_SECRET=<clave_secreta>
CLOUDINARY_CLOUD_NAME=<nombre>
CLOUDINARY_API_KEY=<clave>
CLOUDINARY_API_SECRET=<secreto>
```

---

## 📁 Estructura de Carpetas

```
/server
  ├── controllers/
  ├── routes/
  ├── models/
  ├── middlewares/
  └── config/
      ├── database.js
      ├── environment.js
      └── third-party.js

/app
  ├── screens/
  ├── components/
  ├── services/
  └── navigation/
```

---

## 🧪 Pruebas

Las pruebas están escritas con Jest y Postman para endpoints REST.

```bash
npm test
```

---

## 📌 Estado del Proyecto

✅ Funcionalidades base completas  
⏳ Próximamente: integración de IA para chat y recomendaciones

---

## 📧 Contacto

¿Tienes preguntas o quieres contribuir?  
Escríbenos a: `soporte@zoeapp.com`

---

## 📄 Licencia

Este proyecto está licenciado bajo MIT License.
