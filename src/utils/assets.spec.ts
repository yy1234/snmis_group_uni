import { existsSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const root = path.dirname(fileURLToPath(import.meta.url))
const staticRoot = path.resolve(root, '../static')

const required = [
  'tabbar/work.png',
  'tabbar/work-active.png',
  'tabbar/message.png',
  'tabbar/message-active.png',
  'tabbar/todo.png',
  'tabbar/todo-active.png',
  'tabbar/contacts.png',
  'tabbar/contacts-active.png',
  'tabbar/profile.png',
  'tabbar/profile-active.png',
  'work/header/work_waste_incineration.png',
  'work/header/work_garbage_power.png',
  'work/header/work_main_thirdPhoto.jpg',
  'work/header/work_currentDot.png',
  'work/header/work_otherDot.png',
  'work/functions/经营计划.png',
  'work/home_boiler.png',
]

describe('static assets', () => {
  required.forEach((relPath) => {
    it(`has ${relPath}`, () => {
      expect(existsSync(path.join(staticRoot, relPath))).toBe(true)
    })
  })
})
