import '@testing-library/jest-dom/vitest'
import { I18nProvider } from '@/i18n/I18nProvider'
import { afterEach } from 'vitest'
import * as rtl from '@testing-library/react'
import React from 'react'

// Polyfills for jsdom + Radix UI interactions
// hasPointerCapture/setPointerCapture are used by @radix-ui primitives
if (!(HTMLElement.prototype as any).hasPointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'hasPointerCapture', {
    value: () => false,
    configurable: true,
  })
}
if (!(HTMLElement.prototype as any).setPointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'setPointerCapture', {
    value: () => {},
    configurable: true,
  })
}
if (!(HTMLElement.prototype as any).releasePointerCapture) {
  Object.defineProperty(HTMLElement.prototype, 'releasePointerCapture', {
    value: () => {},
    configurable: true,
  })
}

// scrollIntoView polyfill for jsdom
if (!(HTMLElement.prototype as any).scrollIntoView) {
  Object.defineProperty(HTMLElement.prototype, 'scrollIntoView', {
    value: () => {},
    configurable: true,
  })
}

// Define PointerEvent if missing
// @ts-ignore
if (typeof window !== 'undefined' && !('PointerEvent' in window)) {
  // @ts-ignore
  class PointerEvent extends MouseEvent {
    pointerId = 1
    width = 0
    height = 0
    pressure = 0
    tangentialPressure = 0
    tiltX = 0
    tiltY = 0
    twist = 0
    pointerType = 'mouse'
    isPrimary = true
  }
  // @ts-ignore
  ;(window as any).PointerEvent = PointerEvent
}

// Patch RTL render to auto-wrap I18nProvider for component tests
const originalRender = rtl.render
;(global as any).renderWithI18n = (ui: any, options?: any) =>
  rtl.render(React.createElement(I18nProvider, null, ui), options)

afterEach(() => {
  rtl.cleanup()
})

