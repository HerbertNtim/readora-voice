# Readora

Readora is an AI-powered reading assistant built with Next.js, Vapi, MongoDB, and Clerk.  
The platform allows users to upload and interact with documents using voice AI, creating a more engaging and accessible reading experience.

---

## 🚀 Features

- 🔐 Authentication and user management with Clerk
- 🤖 Voice AI interactions powered by Vapi
- 📄 PDF/document processing and parsing
- ☁️ File storage using Vercel Blob
- 📱 Responsive modern UI with Tailwind CSS and shadcn/ui
- ✅ Form validation using React Hook Form + Zod
- 🗄️ MongoDB database integration
- ⚡ Built with the latest Next.js App Router architecture

---

## 🛠️ Tech Stack

### Frontend

- React
- Next.js
- Tailwind CSS
- shadcn/ui
- Radix UI

### Backend & Services

- MongoDB
- Mongoose
- Clerk Authentication
- Vapi AI
- Vercel Blob

### Developer Tools

- TypeScript
- ESLint
- Prettier
- Husky

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/HerbertNtim/readora.git
cd readora
```

Install dependencies:

```bash
npm install
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# MongoDB
MONGODB_URI=

# Vapi
NEXT_PUBLIC_VAPI_WEB_TOKEN=
VAPI_API_KEY=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=
```

---

## 🧑‍💻 Running the Project

Start the development server:

```bash
npm run dev
```

Build the project:

```bash
npm run build
```

Start production server:

```bash
npm start
```

Lint the project:

```bash
npm run lint
```

---

## 📁 Project Structure

```bash
readora/
├── app/
├── components/
├── lib/
├── database/
├── public/
├── types/
└── hooks/
```

---

## 🧠 How It Works

1. Users sign in securely using Clerk.
2. Documents are uploaded and stored using Vercel Blob.
3. PDF content is parsed and processed.
4. Vapi powers real-time voice AI interactions.
5. MongoDB stores application and user data.

---

## 📸 Screenshots

Add screenshots or demo GIFs here.

---

## 🚀 Deployment

The easiest way to deploy this application is using Vercel.

```bash
vercel
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome.

1. Fork the project
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

Built with ❤️ using modern web technologies and AI.
