
<template>
  <div class="container content pad-top">
    <header>
      <h1>Paulo Henrique Cuchi</h1>

      <blockquote>
        <em>
          I'm a software engineer who likes to delete code more than I like to
          write it.

          This is the place I might share anything I find both interesting and
          relevant.

          I don't post as much as I would expect.
        </em>
      </blockquote>
    </header>
    <main class="columns">
      <section class="col-6 col-lg-12">
        <h3>Thing I like</h3>
        <ul>
          <li>Backend web development</li>
          <li>Technical leadership and mentorship</li>
          <li>DevOps culture, processes &amp; tools</li>
          <li>Unix-based tools and systems, either using or developing them</li>
        </ul>
      </section>

      <PostsSection :posts="posts" />

      <!-- GitHub and Wakatime activity would be displayed here -->

      <section class="col-12">
        <h3>My career</h3>
        <Timeline :events="career.events" :current-date="career.currentDate" />
      </section>

      <section>
        <h3>See also</h3>
        <ul>
          <li>
            <a href="https://fasterthanli.me/" target="_blank" rel="noopener"
              >Amos's blog (fasterthanlime)</a
            >
            - Great reference for in-depth topics on Rust and systems
            programming in general.
          </li>
          <li>
            <a href="https://lukesmith.xyz/" target="_blank" rel="noopener"
              >Luke Smith</a
            >
            - Very good content on free software, internet independence and
            tutorials on Linux and your day-to-day shell scripting tools.
          </li>
        </ul>
      </section>

      <section class="col-12 social-buttons">
        <a
          class="social-link"
          href="https://github.com/cuchi"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="github-link"
            class="social-button"
            src="~assets/images/github.png"
          />
        </a>
        <a
          class="social-link"
          href="https://www.linkedin.com/in/pcuchi/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            alt="linkedin-link"
            class="social-button"
            src="~assets/images/linkedin.png"
          />
        </a>
        <a class="social-link" href="/rss.xml" target="_blank" rel="nofollow">
          <img
            alt="rss-link"
            class="social-button"
            src="~assets/images/rss.png"
          />
        </a>
      </section>
    </main>
    <footer>
      This website is an open source project under the Apache 2.0 license. You
      can find all the source code
      <a
        href="https://github.com/cuchi/website"
        target="_blank"
        rel="noopener noreferrer"
        >here</a
      >.
    </footer>
  </div>
</template>

<script>
import axios from "axios";
import GithubEvents from "~/components/GithubEvents";
import WakatimeActivity from "~/components/WakatimeActivity";
import PostsSection from "~/components/PostsSection";
import Timeline from "~/components/Timeline";

export default {
  head: {
    title: "Home",
  },

  components: { GithubEvents, WakatimeActivity, PostsSection, Timeline },
  asyncData: async () => {
    const baseUrl = process.env.BASE_URL;
    const [events, activities, posts, career] = await Promise.all([
      axios.get(`${baseUrl}/api/github-events`),
      axios.get(`${baseUrl}/api/wakatime-activity`),
      axios.get(`${baseUrl}/api/posts`),
      axios.get(`${baseUrl}/api/career`),
    ]);
    return {
      events: events.data,
      activity: activities.data,
      posts: posts.data,
      career: career.data,
    };
  },
};
</script>

<style lang="scss">
section {
  padding: 1em 1em 1em 0;
}

.content {
  max-width: 1100px;
  padding-left: 2rem;
  padding-right: 2rem;
}

.pad-top {
  padding-top: 3em;
}

.social-buttons {
  text-align: center;
}

.social-link {
  display: inline-block;
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
