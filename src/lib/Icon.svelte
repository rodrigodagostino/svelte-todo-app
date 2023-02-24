<script lang="ts">
  import Check from './Icon/Check.svelte'
  import GripDotsVertical from './Icon/GripDotsVertical.svelte'
  import Pen from './Icon/Pen.svelte'
  import Plus from './Icon/Plus.svelte'
  import TrashCan from './Icon/TrashCan.svelte'
  import XMark from './Icon/XMark.svelte'

  export let icon:
    | 'check'
    | 'grip-dots-vertical'
    | 'pen'
    | 'plus'
    | 'trash-can'
    | 'xmark'
  export let size: 'small' | 'medium' | 'large' = 'small'

  const iconComponents = {
    check: Check,
    'grip-dots-vertical': GripDotsVertical,
    pen: Pen,
    plus: Plus,
    'trash-can': TrashCan,
    xmark: XMark,
  }

  const sizeInNumbers = {
    small: '16px',
    medium: '24px',
    large: '40px',
  }
</script>

<svelte:component
  this={iconComponents[icon]}
  size={sizeInNumbers[size]}
  {...$$restProps}
/>
