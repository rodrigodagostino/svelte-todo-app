<script lang="ts">
  import Icon from './Icon.svelte'

  export let href: string = undefined
  export let target: '_self' | '_blank' = '_self'
  export let type: 'button' | 'submit' = 'button'
  export let variant:
    | 'neutral'
    | 'neutral-dark'
    | 'ghost'
    | 'ghost-negative'
    | 'ghost-dark' = 'ghost'
  export let size: 'small' | 'medium' | 'large' = 'small'
  export let icon:
    | 'check'
    | 'grip-dots-vertical'
    | 'pen'
    | 'plus'
    | 'times'
    | 'trash-can' = undefined
</script>

{#if href}
  <a
    class="button button--{variant} button--{size} {$$restProps.class}"
    {href}
    {target}
  >
    {#if icon}
      <Icon {icon} {size} />
    {/if}
    {#if $$slots.default}
      <span class="button__text">
        <slot />
      </span>
    {/if}
  </a>
{:else}
  <button
    class="button button--{variant} button--{size} {$$restProps.class}"
    {type}
    on:click
  >
    {#if icon}
      <Icon {icon} {size} />
    {/if}
    {#if $$slots.default}
      <span class="button__text">
        <slot />
      </span>
    {/if}
  </button>
{/if}

<style lang="scss">
  .button {
    display: flex;
    gap: 0.5rem;
    justify-content: center;
    align-items: center;
    padding: 0.5em;
    border: none;
    border-radius: 0.25em;
    outline: 3px solid transparent;
    font-family: var(--font-main);
    font-weight: 600;
    text-transform: uppercase;
    text-decoration: none;
    transition: background-color 0.24s, color 0.24s, outline 0.24s;
    cursor: pointer;

    &:focus-visible {
      outline: 3px solid currentColor;
    }

    &--neutral {
      color: var(--gray-050);
      background-color: var(--gray-600);

      &:focus,
      &:hover {
        color: var(--white-rich);
        background-color: var(--gray-400);
      }
    }

    &--neutral-dark {
      color: var(--gray-100);
      background-color: var(--gray-700);

      &:focus,
      &:hover {
        color: var(--white-rich);
        background-color: var(--gray-500);
      }
    }

    &--ghost {
      color: var(--gray-400);
      background-color: transparent;

      &:focus,
      &:hover {
        color: var(--indigo-500);
      }
    }

    &--ghost-negative {
      color: var(--gray-100);
      background-color: transparent;

      &:focus,
      &:hover {
        color: var(--white-rich);
      }
    }

    &--ghost-dark {
      color: var(--gray-400);
      background-color: transparent;

      &:focus,
      &:hover {
        color: var(--indigo-400);
      }
    }

    &--small {
      font-size: 1rem;
    }

    &--medium {
      font-size: 1.5rem;
    }

    &--large {
      font-size: 2.5rem;
    }
  }
</style>
