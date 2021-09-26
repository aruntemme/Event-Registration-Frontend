<template>
  <div class="w-100 h-12 flex flex-row justify-center md:justify-between items-center md:px-12 px-5 py-5">
     <div class="custom-shape-divider-top-1632553452">
      <svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120" preserveAspectRatio="none">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" class="shape-fill"></path>
      </svg>
    </div>
    <h3 class="uppercase text-4xl font-semibold font-mono  z-30 mt-5"> <a href="/" class="uppercase text-xl font-semibold font-mono "
          ><img src="../assets/flicks_logo.png" class="w-32" alt="flicks-logo"/></a
        ></h3>
  </div>
</template>

<script>
export default {
  name: 'LoginHeader'
}
</script>
<style lang="scss" scoped>
.custom-shape-divider-top-1632553452 {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;
}

.custom-shape-divider-top-1632553452 svg {
    position: relative;
    display: block;
    width: calc(114% + 1.3px);
    height: 233px;
}

.custom-shape-divider-top-1632553452 .shape-fill {
    fill: #7a2ad6;
}

/** For tablet devices **/
@media (min-width: 768px) and (max-width: 1023px) {
    .custom-shape-divider-top-1632553452 svg {
        width: calc(150% + 1.3px);
        height: 233px;
    }
}

/** For mobile devices **/
@media (max-width: 767px) {
    .custom-shape-divider-top-1632553452 svg {
        width: calc(280% + 1.3px);
        height: 142px;
    }
}

</style>
