import React from 'react'

export default React.createClass({
  propTypes: {
    onAdd: React.PropTypes.func,
  },
  getInitialState() {
    return {todoInput: ''}
  },
  render() {
    return (
      <form onSubmit={this._onAddSubmit} style={{display: 'flex'}}>
        <input
          type="text"
          value={this.state.todoInput}
          onChange={this._onTodoInputChange}
          style={{flex: 1}}
        />
        <button type="submit">
          Add
        </button>
      </form>
    )
  },
  _onAddSubmit(event) {
    event.preventDefault()
    if (this.state.todoInput) {
      this.props.onAdd(this.state.todoInput)
      this.setState({todoInput: ''})
    }
  },
  _onTodoInputChange(event) {
    this.setState({todoInput: event.target.value})
  },
})
