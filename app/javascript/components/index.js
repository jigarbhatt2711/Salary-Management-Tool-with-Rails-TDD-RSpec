import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('root')
  if (root) {
    const reactRoot = createRoot(root)
    reactRoot.render(<App />)
  }
})