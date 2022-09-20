const fs = require('fs/promises')
const path = require('path')
const chalk = require('chalk')

const notesPath = path.join(__dirname, './db.json')

async function addNote(title) {
  //   const notes = require('./db.json')
  //   const notes = Buffer.from(buffer).toString('utf-8')

  const notes = await getNotes()

  const note = {
    title,
    id: Date.now().toString()
  }

  notes.push(note)
  await saveNotes(notes)
  console.log(chalk.bgGreen('Note added'))
}

async function getNotes() {
  const notes = await fs.readFile(notesPath, { encoding: 'utf8' })
  return Array.isArray(JSON.parse(notes)) ? JSON.parse(notes) : []
}

async function editNote(content) {
  const notes = await getNotes()
  const index = notes.findIndex((note) => note.id === content.id)
  if (index >= 0) {
    notes[index] = { ...notes[index], ...content }
    await saveNotes(notes)
    console.log(chalk.yellow(`Note ${content.id} edited`))
  }
}

async function saveNotes(notes) {
  await fs.writeFile(notesPath, JSON.stringify(notes))
}

async function printNotes() {
  const notes = await getNotes()

  console.log(chalk.bgBlue('Here is the list of notes'))
  notes.forEach((note) =>
    console.log(chalk.bgWhite(note.id), chalk.blue(note.title))
  )
}

async function removeNotes(id) {
  const notes = await getNotes()

  const filtered = notes.filter((note) => note.id !== id)

  await saveNotes(filtered)
  console.log(chalk.red(`Removed note with id: ${id}`))
}

module.exports = {
  addNote,
  printNotes,
  removeNotes,
  getNotes,
  editNote
}
