import { useState } from 'react'
import logo from './logo.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col gap-8 justify-center items-center h-screen text-white bg-gray-800">
      <img src={logo} className="w-[600px] animate-spin-slow" alt="logo" />
      <h1 className="text-6xl font-bold">Hello Vite + React + Tailwind!</h1>
      <button
        className="py-2 px-3 text-xl font-bold bg-sky-400 active:bg-sky-600 rounded-md transition-all hover:scale-105"
        type="button"
        onClick={() => setCount((count) => count + 1)}
      >
        Count is: {count}
      </button>
      <p>
        Edit <code className="p-1 bg-gray-600 rounded-md">App.tsx</code> and
        save to test HMR updates.
      </p>
      <p className="text-sky-500">
        <a
          className="hover:text-sky-700 underline"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
        {' | '}
        <a
          className="hover:text-sky-700 underline"
          href="https://vitejs.dev/guide/features.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          Vite Docs
        </a>
        {' | '}
        <a
          className="hover:text-sky-700 underline"
          href="https://tailwindcss.com/docs/installation"
          target="_blank"
          rel="noopener noreferrer"
        >
          Tailwind Docs
        </a>
      </p>
    </div>
  )
}

export default App
