<template>
  <div ref="wrapper">
      <p ref="line">一句话。</p>
      <span v-for="n in 3" ref="loop">{{ n }}</span>
      <child ref="component" />
      <child v-for="n in 3" ref="component-loop" :key="n" />
  </div>
</template>

<script>
import Child from './child';
export default {
    mounted() {
        // console.log(this.$refs.wrapper);
        // console.log(this.$refs.line);
        // console.log(this.$refs.loop);
        // console.log(this.$refs.component);
        // console.log(this.$refs['component-loop']);
    },
    components: {
        Child
    }
};
</script>