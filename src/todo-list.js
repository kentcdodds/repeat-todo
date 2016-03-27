import React, {PropTypes as pt} from 'react' // eslint-disable-line no-unused-vars
import ListOfTodos from './list-of-todos'
import AddTodo from './add-todo'

const noop = () => {}

export default TodoList

function TodoList({
  todoList,
  onAddTodo = noop,
  onCompleteTodo = noop,
  onDeleteTodo = noop,
  onRenameList = noop,
  onDeleteList = noop,
}) {
  return (
    <div>
      <div>{todoList.name}</div>
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

