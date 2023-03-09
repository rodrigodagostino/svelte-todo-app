<script lang="ts">
  import Sortable, { type SortableOptions } from 'sortablejs'
  import { fly } from 'svelte/transition'
  import { fadeScale, flyScale } from '../transitions'
  import { addList, setLists, setSelectedList, toDos } from '../store'

  import Button from './Button.svelte'
  import Icon from './Icon.svelte'

  let listNewTitle = ''

  const handleAddList = () => {
    if (!(listNewTitle.trim() !== '')) return

    addList({
      id: new Date().getTime(),
      title: listNewTitle,
      tasks: [],
    })
    listNewTitle = ''
  }

  const sortableOptions: SortableOptions = {
    handle: '.navigation__item-handle',
    ghostClass: 'navigation__item--ghost',
    dragClass: 'navigation__item--drag',
    animation: 200,
    store: {
      get: () => {
        const order = $toDos.lists.map((list) => `${list.id}`)
        return order ? order : []
      },
      set: (sortable) => {
        const order = sortable.toArray()
        const reorderedLists = $toDos.lists.sort(
          (a, b) => order.indexOf(`${a.id}`) - order.indexOf(`${b.id}`)
        )
        setLists(reorderedLists)
      },
    },
  }

  const sortable = (element, options) => {
    const instance = Sortable.create(element, options)

    return {
      destroy() {
        instance.destroy
      },
    }
  }
</script>

<nav class="navigation" in:fly={{ y: 32, duration: 320, delay: 320 }}>
  <ul class="navigation__items" use:sortable={sortableOptions}>
    {#each $toDos.lists as list (list.id)}
      <li
        class="navigation__item"
        data-id={list.id}
        in:flyScale|local={{ y: 64, duration: 320 }}
        out:fadeScale|local={{ duration: 320 }}
      >
        <button
          class="navigation__item-button"
          class:is-active={list.id === $toDos.selectedListId}
          on:click={() => setSelectedList(list.id)}
        >
          <span class="navigation__item-handle">
            <Icon icon="grip-dots-vertical" />
          </span>
          <span class="navigation__item-label">{list.title}</span>
        </button>
      </li>
    {/each}
  </ul>
  <form class="navigation__form" on:submit|preventDefault={handleAddList}>
    <input
      type="text"
      class="navigation__form-input"
      bind:value={listNewTitle}
    />
    <Button variant="ghost-negative" type="submit" icon="plus" />
  </form>
</nav>

<style lang="scss">
  .navigation {
    color: var(--white);

    &__items {
      list-style: none;
    }

    &__item {
      &:global(.navigation__item--ghost) {
        background-color: rgba(79, 70, 229, 0.5);
        position: relative;
        z-index: 10;
      }

      &:global(.navigation__item--drag) {
        opacity: 0;
      }
    }

    &__item-button {
      display: flex;
      gap: 0.5rem;
      align-items: center;
      width: 100%;
      padding: 1rem 0;
      border: none;
      outline: 3px solid transparent;
      font-size: 1.5rem;
      line-height: 1.2;
      transition: background-color 0.24s, padding 0.24s, outline 0.24s;
      cursor: pointer;

      &:focus-visible {
        outline: 3px solid currentColor;
      }

      &.is-active {
        padding: 1rem 1rem 1rem 0.75rem;
        font-weight: 600;
        color: var(--white-rich);
        background-color: var(--indigo-800);
      }
    }

    &__item-handle {
      display: block;
      flex: 0 0 auto;
      display: flex;
      padding: 0.25rem 0.5rem;
      cursor: grab;

      :global(svg circle) {
        fill: var(--indigo-200);
        transition: fill 0.24s;
      }

      &:focus,
      &:hover {
        :global(svg circle) {
          fill: var(--indigo-100);
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
      transition: border 0.24s;

      &:focus {
        border-bottom-color: var(--white-rich);
      }
    }
  }
</style>
