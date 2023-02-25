<script lang="ts" context="module">
  export interface Task {
    id: number
    title: string
    isDone: boolean
  }
</script>

<script lang="ts">
  import { editTask, removeTask, toDos, toggleTaskStatus } from '../store'
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let task: Task

  let selectedList = null
  $: selectedList = $toDos.selectedListId
    ? $toDos.lists.filter((list) => list.id === $toDos.selectedListId)[0]
    : null
  let labelPrevContent
  let isTaskBeingEdited = false

  let checkbox
  let label

  const handleEditTask = () => {
    labelPrevContent = label.textContent
    isTaskBeingEdited = true
    checkbox.setAttribute('disabled', true)
    label.setAttribute('contenteditable', true)
    label.focus()
  }

  const handleTaskChanges = (action: 'confirm' | 'cancel') => {
    isTaskBeingEdited = false
    action === 'confirm'
      ? editTask(selectedList.id, task.id, label.textContent)
      : (label.textContent = labelPrevContent)
    checkbox.removeAttribute('disabled')
    label.removeAttribute('contenteditable')
  }

  const handleOnKeydownTaskChanges = (event) => {
    switch (event.key) {
      case 'Enter':
        handleTaskChanges('confirm')
        break
      case 'Escape':
        handleTaskChanges('cancel')
        break
    }
  }
</script>

<li class="task" class:task--done={task.isDone}>
  <span class="task__handle">
    <Icon icon="grip-dots-vertical" />
  </span>
  <input
    bind:this={checkbox}
    type="checkbox"
    bind:checked={task.isDone}
    id={`task-${task.id}`}
    class="task__checkbox"
    on:click={() => toggleTaskStatus(selectedList.id, task.id)}
  />
  <label
    bind:this={label}
    for={`task-${task.id}`}
    class="task__label"
    on:keydown={(event) => handleOnKeydownTaskChanges(event)}
  >
    {task.title}
  </label>
  {#if isTaskBeingEdited}
    <div class="task__actions">
      <Button
        variant="neutral"
        icon="check"
        on:click={() => handleTaskChanges('confirm')}
      />
      <Button
        variant="neutral"
        icon="times"
        on:click={() => handleTaskChanges('cancel')}
      />
    </div>
  {:else}
    <div class="task__actions">
      <Button variant="neutral" icon="pen" on:click={handleEditTask} />
      <Button
        variant="neutral"
        icon="trash-can"
        on:click={() => removeTask(selectedList.id, task.id)}
      />
    </div>
  {/if}
</li>

<style lang="scss">
  .task {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--gray-200);

    &__handle {
      display: flex;
      padding: 0.25rem 0.5rem;
      cursor: grab;

      :global(svg circle) {
        fill: var(--gray-400);
        transition: fill 0.24s;
      }

      &:focus,
      &:hover {
        :global(svg circle) {
          fill: var(--color-main);
        }
      }
    }

    &__checkbox,
    &__label {
      cursor: pointer;
      transition: opacity 0.32s;
    }

    &__checkbox {
      flex-shrink: 0;
      margin-left: 0.5rem;
    }

    &__label {
      font-size: 1.25rem;
      line-height: 1.2;
      margin-left: 0.75rem;

      &:is([contenteditable='true']) {
        outline: none;
        box-shadow: 0 2px 0 var(--color-main);
        cursor: text;
      }
    }

    &__actions {
      margin-left: auto;
      display: flex;
    }

    &--done {
      .task__label {
        text-decoration: line-through;
        opacity: 0.5;
      }
    }
  }
</style>
