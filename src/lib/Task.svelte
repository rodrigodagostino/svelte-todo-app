<script lang="ts" context="module">
  export interface Task {
    listId: number
    id: number
    title: string
    isDone: boolean
  }
</script>

<script lang="ts">
  import { flyScale, fadeScale } from '../transitions'
  import { editTask, removeTask, toggleTaskStatus } from '../store'

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let listId: Task['listId']
  export let id: Task['id']
  export let title: Task['title']
  export let isDone: Task['isDone']

  let checkboxRef
  let labelRef

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
      ? editTask(listId, id, labelRef.textContent)
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
  class:task--done={isDone}
  data-id={id}
  in:flyScale|local={{ y: 64, duration: 320 }}
  out:fadeScale|local={{ duration: 320 }}
>
  <div class="task__inner">
    <span class="task__handle">
      <Icon icon="grip-dots-vertical" />
    </span>
    <input
      bind:this={checkboxRef}
      type="checkbox"
      bind:checked={isDone}
      id="task-{id}"
      class="task__checkbox"
      on:click={() => toggleTaskStatus(listId, id)}
    />
    <label
      bind:this={labelRef}
      for="task-{id}"
      class="task__label"
      on:keydown={(event) => handleOnKeydownTaskChanges(event)}
    >
      {title}
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
          on:click={() => removeTask(listId, id)}
        />
      </div>
    {/if}
  </div>
</li>

<style lang="scss">
  .task {
    list-style: none;

    &--done {
      .task__label {
        text-decoration: line-through;
        opacity: 0.5;
      }
    }

    &__inner {
      display: flex;
      align-items: center;
      padding: 0.5rem 0;
      border-bottom: 1px solid var(--gray-200);
      background-color: var(--white);
      transition: background-color 0.24s;
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
          fill: var(--color-main);
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
        box-shadow: 0 2px 0 var(--color-main);
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
