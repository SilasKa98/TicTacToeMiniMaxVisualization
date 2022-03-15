<template>
    <div @click="$emit('click')" class="playCell">
      <span
        v-if="value !== ''"
        :class="{ 'red' : value === 'x', 'green': value === 'o' }"
      >
        {{ value }}
      </span>
    </div>
</template>

<script>
  export default {
    props: {
      value: String,
    },
  }
</script>
<style>


  .playCell {
    width: 64px;
    height: 64px;
    border: 2px solid black;
    font-size: 42px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .red {
    color: rgb(255 0 0);
  }
  .green {
    color: rgb(27 255 0);
  }

  .red,.green {
    position: relative;
    top: -6px;
    font-weight: bold;
    font-size: 48px;
  }
</style>
