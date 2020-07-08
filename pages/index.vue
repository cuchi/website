
<template>
  <div class="container col-6 col-lg-8 col-md-10 col-sm-11 pad-top">
    <header>
      <h1>Paulo Henrique Cuchi</h1>

      <blockquote>
        <em>
          I am a self-taught software developer with passion for server-side
          web technologies and distributed systems. My goal is to deliver
          reliable and maintainable applications with the best technologies in
          the market.
        </em>
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

      <section class="col-12">
        <h3>My posts</h3>
        <ul>
          <li><a href="./posts/go-vs-rust">Go vs Rust: Writing a CLI tool</a></li>
        </ul>
      </section>

      <section class="col-12">
        <h3>My career</h3>
        A beautiful interactive timeline would appear here.
      </section>

      <section class="col-6 col-sm-12">
        <h3>My latest activity on GitHub</h3>
        <GithubEvents v-bind:events="events" />
      </section>

      <section class="col-6 col-sm-12">
        <h3>What I've been using this week</h3>
        <WakatimeActivity v-bind:activity="activity" />
      </section>

      <section class="col-12">
        <a target="_blank" href="https://github.com/cuchi">
          <img class="social-button" src="~assets/images/github.png" />
        </a>
        <a target="_blank" href="https://www.linkedin.com/in/paulo-henrique-cuchi-02684b116/">
          <img class="social-button" src="~assets/images/linkedin.png" />
        </a>
      </section>
    </main>
    <footer>
      This website is an open source project under the Apache 2.0
      license. You can find all the source code
      <a
        target="_blank"
        href="https://github.com/cuchi/website"
      >here</a>.
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import GithubEvents from "~/components/github-events";
import WakatimeActivity from "~/components/wakatime-activity";

export default {
  head: {
    title: "Home"
  },

  components: { GithubEvents, WakatimeActivity },
  asyncData: async () => {
    const baseUrl = process.env.baseUrl;
    const [events, activities] = await Promise.all([
      axios.get(`${baseUrl}/api/github-events`),
      axios.get(`${baseUrl}/api/wakatime-activity`)
    ])
    return {
      events: events.data,
      activity: activities.data
    };
  }
};
</script>

<style lang="scss">
a {
  text-decoration: underline;
}

section {
  padding: 1em 1em 1em 0;
}

.pad-top {
  padding-top: 3em;
}

.social-button {
  margin: 0.5em;
}

footer {
  margin: 1em;
  text-align: center;
  font-size: 80%;
}
</style>
