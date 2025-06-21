
# 📱 Zoe – Aplicación de Conexiones Sociales

Zoe es una aplicación móvil desarrollada con el objetivo de conectar personas mediante un sistema de emparejamiento y citas. Diseñada con una interfaz amigable, temas personalizables y funciones centradas en la experiencia del usuario.

---

## 🚀 Características Principales

- Registro e inicio de sesión (con autenticación JWT/OAuth2)
- Creación y edición de perfil con fotos e intereses
- Sistema de emparejamiento tipo Tinder (deslizar)
- Historial de matches y gestión de conexiones
- Temas personalizables (claro, oscuro, neumórfico)
- Notificaciones en tiempo real
- Busqueda de usuarios por nombre, intereses, etc.
- Chat privado entre usuarios

---

## 🧑‍💻 Tecnologías Usadas

### Frontend:
- Vite React
- Tailwind CSS (si aplica)

### Backend:
- Node.js + Express
- MongoDB + Mongoose
- JWT para autenticación

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
cd src
npm install
npm run dev
```

---

## ⚙️ Variables de Entorno

Crea un archivo `.env` en la raíz del backend con:

```
PORT=5000
MONGO_URI=<tu_mongo_uri>
JWT_SECRET=<clave_secreta>

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
      └── third-party.js

/src
  ├── pages/
  ├── components/
  ├── services/
  ├── utils/
  └── contexts/

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

## 📄 Licencia

Este proyecto está licenciado bajo MIT License.
