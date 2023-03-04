<script lang="ts" context="module">
  export interface Task {
    id: number
    title: string
    isDone: boolean
  }
</script>

<script lang="ts">
  import { fade, fly } from 'svelte/transition'
  import { editTask, removeTask, toDos, toggleTaskStatus } from '../store'

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let task: Task
  export let dataId: number

  let checkboxRef
  let labelRef

  let selectedList = null
  $: selectedList = $toDos.selectedListId
    ? $toDos.lists.filter((list) => list.id === $toDos.selectedListId)[0]
    : null
  let labelPrevContent
  let isTaskBeingEdited = false

  const handleEditTask = () => {
    labelPrevContent = labelRef.textContent
    isTaskBeingEdited = true
    checkboxRef.setAttribute('disabled', true)
    labelRef.setAttribute('contenteditable', true)
    labelRef.focus()
  }

  const handleTaskChanges = (action: 'confirm' | 'cancel') => {
    isTaskBeingEdited = false
    action === 'confirm'
      ? editTask(selectedList.id, task.id, labelRef.textContent)
      : (labelRef.textContent = labelPrevContent)
    checkboxRef.removeAttribute('disabled')
    labelRef.removeAttribute('contenteditable')
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

<li
  class="task"
  class:task--done={task.isDone}
  data-id={dataId}
  in:fly|local={{ y: 32, duration: 320 }}
  out:fade|local={{ duration: 320 }}
>
  <span class="task__handle">
    <Icon icon="grip-dots-vertical" />
  </span>
  <input
    bind:this={checkboxRef}
    type="checkbox"
    bind:checked={task.isDone}
    id="task-{task.id}"
    class="task__checkbox"
    on:click={() => toggleTaskStatus(selectedList.id, task.id)}
  />
  <label
    bind:this={labelRef}
    for="task-{task.id}"
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
        class="task__button-confirm"
        on:click={() => handleTaskChanges('confirm')}
      />
      <Button
        variant="neutral"
        icon="times"
        class="task__button-cancel"
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
    background-color: var(--white);
    transition: background-color 0.24s;

    &--done {
      .task__label {
        text-decoration: line-through;
        opacity: 0.5;
      }
    }

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
          fill: var(--indigo-500);
        }
      }
    }

    &__checkbox,
    &__label {
      transition: opacity 0.24s;
      cursor: pointer;
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
        box-shadow: 0 2px 0 var(--indigo-500);
        cursor: text;
      }
    }

    &__actions {
      margin-left: auto;
      display: flex;
    }

    :global(.task__button-confirm) {
      &:focus,
      &:hover {
        color: var(--green-500);
      }
    }

    :global(.task__button-cancel) {
      &:focus,
      &:hover {
        color: var(--red-500);
      }
    }

    &:global(.task--ghost) {
      background-color: var(--gray-100);
      position: relative;
      z-index: 10;
    }

    &:global(.task--drag) {
      opacity: 0;
    }
  }
</style>
