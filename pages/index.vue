
<template>
  <div class="container col-6 col-lg-8 col-md-10 col-sm-11 pad-top">
    <header>
      <h1>Paulo Henrique Cuchi</h1>
      <blockquote>
        <em>Hi there! this page is where I share my thoughs and knowledge about software development.</em>
      </blockquote>
    </header>
    <main class="columns">
      <section class="col-6 col-sm-12">
        <h3>I love working with</h3>
        <ul>
          <li>Backend web development</li>
          <li>Linux</li>
          <li>Cloud native technologies</li>
          <li>Continuous integration &amp; continuous delivery</li>
        </ul>
      </section>

      <section class="col-6 col-sm-12">
        <h3>I also like</h3>
        <ul>
          <li>Mobile development</li>
          <li>Information security</li>
          <li>Functional programming</li>
        </ul>
      </section>

      <section class="col-6">
        <h3>My latest activity on GitHub</h3>
        <GithubEvents v-bind:events="events"/>
      </section>

      <section class="col-6">
        <h3>What I've been using this week</h3>
        <WakatimeActivity v-bind:activity="activity"/>
      </section>
    </main>
  </div>
</template>

<script>
  import GithubEvents from '~/components/github-events'
  import WakatimeActivity from '~/components/wakatime-activity'

  export default {
    middleware: ['github-events', 'wakatime-activity'],

    head: {
      title: 'Home'
    },

    components: { GithubEvents, WakatimeActivity },
    asyncData: ({ events, activity }) => ({ events, activity })
  }
</script>

<style>
  section {
    padding: 1em 1em 1em 0;
  }

  .pad-top {
    padding-top: 3em;
  }
</style>
