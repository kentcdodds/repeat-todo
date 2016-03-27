import React, {PropTypes as pt} from 'react' // eslint-disable-line no-unused-vars
import ListOfTodos from './list-of-todos'
import AddTodo from './add-todo'

export default TodoList

function TodoList({
  todoList,
  onAddTodo,
  onCompleteTodo,
  onDeleteTodo,
  onRenameList,
  onDeleteList,
}) {
  const formStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    textAlign: 'left',
  }
  return (
    <div>
      <form
        style={formStyle}
        onSubmit={onDeleteSubmit}
      >
        <h2 style={{flex: 1}} onClick={onNameClick}>{todoList.name}</h2>
        <button type="submit" className="danger">Delete List</button>
      </form>
      <AddTodo
        onAdd={onAddTodo}
      />
      <ListOfTodos
        todos={todoList.todos}
        onComplete={onCompleteTodo}
        onDelete={onDeleteTodo}
      />
    </div>
  )

  function onDeleteSubmit(event) {
    event.preventDefault()
    const result = window.confirm(`Do you want to delete the ${todoList.name} list?`)
    if (result) {
      onDeleteList(todoList)
    }
  }

  function onNameClick(event) {
    event.preventDefault()
    const result = window.prompt(`Rename ${todoList.name} to:`)
    if (result) {
      onRenameList(todoList, result)
    }
  }
}

TodoList.propTypes = {
  todoList: pt.shape({
    name: pt.string,
    list: pt.array,
  }).isRequired,
  onAddTodo: pt.func,
  onCompleteTodo: pt.func,
  onDeleteTodo: pt.func,
  onRenameList: pt.func,
  onDeleteList: pt.func,
}

