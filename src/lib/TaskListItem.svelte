<script lang="ts">
  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  export let task

  let checkbox
  let label

  let isTaskBeingEdited = false

  const toggleTaskStatus = () => {
    console.log('Nothing to see here @_@')
  }

  const editTask = () => {
    console.log('Nothing to see here @_@')
  }

  const removeTask = () => {
    console.log('Nothing to see here @_@')
  }

  const confirmTaskChanges = () => {
    console.log('Nothing to see here @_@')
  }

  const cancelTaskChanges = () => {
    console.log('Nothing to see here @_@')
  }
</script>

<li class="task-item" class:task-item--done={task.isDone}>
  <span class="task-item__handle">
    <Icon icon="grip-dots-vertical" />
  </span>
  <input
    bind:this={checkbox}
    type="checkbox"
    bind:checked={task.isDone}
    id={task.id}
    class="task-item__checkbox"
    on:click={toggleTaskStatus}
  />
  <label
    bind:this={label}
    for={task.id}
    class="task-item__label"
    on:keydown={confirmTaskChanges}
    on:keydown={cancelTaskChanges}
  >
    {task.title}
  </label>
  {#if isTaskBeingEdited}
    <div class="task-item__actions">
      <Button variant="neutral" icon="check" on:click={confirmTaskChanges} />
      <Button variant="neutral" icon="plus" on:click={cancelTaskChanges} />
    </div>
  {:else}
    <div class="task-item__actions">
      <Button variant="neutral" icon="pen" on:click={editTask} />
      <Button variant="neutral" icon="trash-can" on:click={removeTask} />
    </div>
  {/if}
</li>

<style lang="scss">
  .task-item {
    display: flex;
    align-items: center;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--gray-200);
  }

  .task-item__handle {
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

  .task-item__checkbox,
  .task-item__label {
    cursor: pointer;
    transition: opacity 0.32s;
  }

  .task-item__checkbox {
    flex-shrink: 0;
    margin-left: 0.5rem;
  }

  .task-item__label {
    font-size: 1.25rem;
    line-height: 1.2;
    margin-left: 0.75rem;

    &[contenteditable='true'] {
      outline: none;
      box-shadow: 0 2px 0 var(--color-main);
      cursor: text;
    }
  }

  .task-item__actions {
    margin-left: auto;
    display: flex;
  }

  .task-item--done {
    .task-item__label {
      text-decoration: line-through;
      opacity: 0.5;
    }
  }
</style>
