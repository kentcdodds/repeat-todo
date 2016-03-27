import React, {PropTypes as pt} from 'react' // eslint-disable-line no-unused-vars
import {Motion, spring} from 'react-motion'

const ITEM_HEIGHT = 80 //TODO: find a way without hardcoded height

export default ListOfTodos

function ListOfTodos({todos, onComplete, onDelete}) {
  return (
    <ol className="todo-list">
      {todos.map(todoToMotionTodo)}
    </ol>
  )

  function todoToMotionTodo(todo, index) {
    return (
      <Motion
        key={todo.id}
        style={{top: spring(index * ITEM_HEIGHT)}}
      >
        {getTodo}
      </Motion>
    )
    function getTodo(val) {
      return (
        <Todo
          style={{...val}}
          todo={todo.value}
          onComplete={() => onComplete(index)}
          onDelete={() => onDelete(index)}
        />
      )
    }
  }
}

ListOfTodos.propTypes = {
  todos: pt.array,
  onComplete: pt.func,
  onDelete: pt.func,
}

function Todo({
  style,
  todo,
  onComplete,
  onDelete,
}) {
  return (
    <li style={style} className="todo-item">
      <strong>{todo}</strong>
      <br />
      <button
        className="success"
        onClick={onComplete}
      >
        Complete
      </button>
      <button
        className="danger"
        onClick={verifyAndDelete}
      >
        Delete
      </button>
    </li>
  )

  function verifyAndDelete() {
    const result = window.confirm(`Are you sure you want to delete "${todo}"?`) // eslint-disable-line no-alert
    if (result) {
      onDelete()
    }
  }
}

Todo.propTypes = {
  style: pt.any,
  todo: pt.string,
  onComplete: pt.func,
  onDelete: pt.func,
}
