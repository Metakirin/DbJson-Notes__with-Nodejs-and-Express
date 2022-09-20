document.addEventListener('click', (e) => {
  if (e.target.dataset.type === 'remove') {
    const id = e.target.dataset.id
    remove(id).then(() => {
      e.target.closest('li').remove()
    })
  }

  if (e.target.dataset.type === 'edit') {
    const $task = e.target.closest('li')
    const id = e.target.dataset.id
    const title = e.target.dataset.title
    const initialHtml = $task.innerHTML

    $task.innerHTML = `
        <input type="text" value="${title}" autofocus/>
        <div>
            <button class="btn btn-success" data-type="save">Save</button>
            <button class="btn btn-danger" data-type="cancel">Cancel</button>
        </div>
    `

    const taskListener = ({ target }) => {
      console.log('me')
      if (target.dataset.type === 'cancel') {
        $task.innerHTML = initialHtml
        $task.removeEventListener('click', taskListener)
      } else if (target.dataset.type === 'save') {
        const title = $task.querySelector('input').value
        edit({ id, title }).then(() => {
          $task.innerHTML = initialHtml
          $task.querySelector('span').innerText = title
          $task.querySelector('[data-type="edit"]').dataset.title = title
          $task.removeEventListener('click', () => taskListener)
        })
      }
    }

    $task.addEventListener('click', taskListener)
  }
})

async function remove(id) {
  await fetch(`/${id}`, {
    method: 'DELETE'
  })
}

async function edit(newNote) {
  await fetch(`/${newNote.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(newNote)
  })
}
