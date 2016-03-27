import React, {PropTypes as pt} from 'react'
import ReactDOM from 'react-dom'
import uuid from 'an-uuid'
import {arrayMoveToEnd, arrayRemoveElement} from './utils'
import TodoList from './todo-list'
import Store from './store'
import migrations from './migrations'

const App = React.createClass({
  propTypes: {
    store: pt.shape({
      get: pt.func,
      set: pt.func,
    }).isRequired,
  },
  getInitialState() {
    return {todoList: {lists: [], selectedListIndex: 0}}
  },
  componentDidMount() {
    this._updateStateFromStore()
  },
  render() {
    const {lists, selectedListIndex} = this.state.todoList
    return (
      <div>
        <h1>Repeat Todo</h1>
        <select onChange={this._onSelectedListChange}>
          {lists.map((l, i) => <option value={i} key={l.id}>{l.name}</option>)}
        </select>
        {
          lists[selectedListIndex] !== undefined ? (
            <TodoList
              todoList={lists[selectedListIndex]}
              onAddTodo={this._onAddTodo}
              onCompleteTodo={this._onCompleteTodo}
              onDeleteTodo={this._onDeleteTodo}
            />
          ) : null
        }
      </div>
    )
  },
  _onAddTodo(val) {
    const {lists, selectedListIndex} = this.state.todoList
    const list = lists[selectedListIndex]
    const newItem = {id: uuid(), value: val}
    list.todos.unshift(newItem)
    this._updateStoreAndState()
  },
  _onCompleteTodo(currentIndex) {
    const {lists, selectedListIndex} = this.state.todoList
    const list = lists[selectedListIndex]
    list.todos = arrayMoveToEnd(list.todos, currentIndex)
    this._updateStoreAndState()
  },
  _onDeleteTodo(index) {
    const {lists, selectedListIndex} = this.state.todoList
    const list = lists[selectedListIndex]
    list.todos = arrayRemoveElement(list.todos, index)
    this._updateStoreAndState()
  },
  _onSelectedListChange(event) {
    this.setState({selectedListIndex: event.target.value})
    this._updateStore()
  },
  _updateStoreAndState() {
    this._updateStore()
    this._updateStateFromStore()
  },
  _updateStore() {
    const {lists, selectedListIndex} = this.state.todoList
    this.props.store.set({lists, selectedListIndex})
  },
  _updateStateFromStore() {
    const todoList = this.props.store.get() || {lists: [], selectedListIndex: 0}
    this.setState({todoList})
  },
})

ReactDOM.render(
  <App store={new Store('todoList', migrations)} />,
  document.getElementById('app')
)

