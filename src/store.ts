import { writable, get } from 'svelte/store'
import type { List } from './lib/List.svelte'

interface ToDos {
  lists: List[]
  selectedListId: number
}

export const toDos = writable<ToDos>(
  {
    lists: [],
    selectedListId: null,
  },
  (set) => {
    const hasLists =
      localStorage.getItem('todos') &&
      localStorage.getItem('todos').charAt(0) === '['
    set({
      lists: hasLists ? JSON.parse(localStorage.getItem('todos')) : [],
      selectedListId: hasLists
        ? JSON.parse(localStorage.getItem('todos'))[0].id
        : null,
    })
  }
)

export const setSelectedList = (listId) => {
  toDos.update((currData) => ({
    ...currData,
    selectedListId: listId || null,
  }))
}

export const setLists = (value) => {
  toDos.update((currData) => ({
    ...currData,
    lists: value,
  }))
  localStorage.setItem('todos', JSON.stringify(value))
}

export const addList = (newList) => {
  let $toDos
  const unsubscribe = toDos.subscribe((currData) => ($toDos = currData))

  const newLists = $toDos.lists ? [...$toDos.lists, newList] : [newList]
  setLists(newLists)
  // Select the recently created list.
  setSelectedList($toDos.lists[$toDos.lists.length - 1].id)

  unsubscribe()
}

export const editList = (listId, newList) => {
  const $toDos = get(toDos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex] = newList
  setLists(newLists)
}

export const editListTitle = (listId, newListTitle) => {
  const $toDos = get(toDos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex].title = newListTitle
  setLists(newLists)
}

export const removeList = (listId) => {
  const $toDos = get(toDos)

  const listIndex = $toDos.lists.findIndex((list) => list.id === listId)
  // Select the previous list (if it exists) before deleting.
  if ($toDos.lists.length > 1 && listIndex !== 0) {
    setSelectedList($toDos.lists[listIndex - 1].id)
    // Select the next list (if it exists) before deleting.
  } else if ($toDos.lists.length > 1 && listIndex === 0) {
    setSelectedList($toDos.lists[listIndex + 1].id)
    // Deselect the current list before deleting.
  } else {
    setSelectedList(null)
  }

  const newLists = $toDos.lists.filter((list) => list.id !== listId)
  setLists(newLists)
}

export const addTask = (listId, newTaskData) => {
  const $toDos = get(toDos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  newLists[targetListIndex].tasks.push(newTaskData)
  setLists(newLists)
}

export const editTask = (listId, taskId, newTaskTitle) => {
  const $toDos = get(toDos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
    (task) => task.id === taskId
  )
  newLists[targetListIndex].tasks[targetTaskIndex].title = newTaskTitle
  setLists(newLists)
}

export const toggleTaskStatus = (listId, taskId) => {
  const $toDos = get(toDos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
    (task) => task.id === taskId
  )
  newLists[targetListIndex].tasks[targetTaskIndex].isDone =
    !newLists[targetListIndex].tasks[targetTaskIndex].isDone
  setLists(newLists)
}

export const removeTask = (listId, taskId) => {
  const $toDos = get(toDos)

  const newLists = $toDos.lists
  const targetListIndex = newLists.findIndex((list) => list.id === listId)
  const targetTaskIndex = newLists[targetListIndex].tasks.findIndex(
    (task) => task.id === taskId
  )
  newLists[targetListIndex].tasks.splice(targetTaskIndex, 1)
  setLists(newLists)
}
