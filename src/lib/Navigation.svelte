<script lang="ts">
  import { fly } from 'svelte/transition'
  import { addList, setSelectedList, toDos } from '../store'

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  let listNewTitle = ''

  const handleAddList = () => {
    addList({
      id: new Date().getTime(),
      title: listNewTitle,
      tasks: [],
    })
    listNewTitle = ''
  }
</script>

<nav class="navigation" in:fly={{ y: 32, duration: 320, delay: 320 }}>
  {#each $toDos.lists as list}
    <li
      class="navigation__item"
      class:is-active={list.id === $toDos.selectedListId}
      on:click={() => setSelectedList(list.id)}
    >
      <span class="navigation__item-handle">
        <Icon icon="grip-dots-vertical" />
      </span>
      <span class="navigation__item-label">{list.title}</span>
    </li>
  {/each}
  <form class="navigation__form" on:submit|preventDefault={handleAddList}>
    <input
      type="text"
      class="navigation__form-input"
      bind:value={listNewTitle}
    />
    <Button variant="dark" type="submit" icon="plus" />
  </form>
</nav>

<style lang="scss">
  .navigation {
    color: var(--white);

    &__item {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      font-size: 1.5rem;
      line-height: 1.2;
      padding: 1rem 0;
      transition: background-color 0.32s, padding 0.32s;
      cursor: pointer;

      &.is-active {
        font-weight: 600;
        color: var(--white-rich);
        background-color: var(--color-main--dark);
        padding: 1rem;
      }
    }

    &__item-handle {
      flex: 0 0 auto;
      display: flex;
      padding: 0.25rem 0.5rem;
      cursor: grab;

      :global(svg circle) {
        fill: var(--color-main--lighter);
        transition: fill 0.24s;
      }

      &:focus,
      &:hover {
        :global(svg circle) {
          fill: var(--color-main--lightest);
        }
      }
    }

    &__form {
      display: flex;
      gap: 0.25rem;
      padding-left: 2rem;
      padding-right: 1rem;
      margin-top: 1rem;
    }

    &__form-input {
      flex: 1;
      font-size: 1.25rem;
      background-color: transparent;
      border: none;
      border-bottom: 2px solid var(--gray-100);
      outline: none;
      transition: border 0.32s;

      &:focus {
        border-bottom-color: var(--white-rich);
      }
    }
  }
</style>