import React from 'react'
import ReactDOM from 'react-dom'
import { App } from './components/app'
import 'modern-normalize'
import '@accurat/tachyons-lite'
import 'tachyons-extra'
import './reset.css'
import './style.css'

function renderApp() {
  ReactDOM.render(<App />, document.getElementById('root'))
}

// First render
renderApp()

// Hot module reloading
if (module.hot) {
  module.hot.accept('components/app', () => {
    console.clear()
    renderApp()
  })
}
