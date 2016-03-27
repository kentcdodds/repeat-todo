import React, {PropTypes as pt} from 'react' // eslint-disable-line no-unused-vars

export default ListChooser

function ListChooser({
  lists,
  selectedListIndex,
  onAddList,
  onChange,
}) {
  return (
    <div>
      <form onSubmit={onAddSubmit} style={{display: 'flex'}}>
        <select
          onChange={onSelectedListChange}
          style={{flex: 1}}
          value={selectedListIndex}
        >
          {lists.map((l, i) => <option value={i} key={l.id}>{l.name}</option>)}
        </select>
        <button type="submit" className="success">Create List</button>
      </form>
    </div>
  )

  function onAddSubmit(event) {
    event.preventDefault()
    const name = window.prompt('Name your new list')
    if (!name) {
      return
    }
    onAddList(name)
  }

  function onSelectedListChange(event) {
    onChange(event.target.value)
  }
}

ListChooser.propTypes = {
  lists: pt.array.isRequired,
  selectedListIndex: pt.string.isRequired,
  onAddList: pt.func.isRequired,
  onChange: pt.func.isRequired,
}

