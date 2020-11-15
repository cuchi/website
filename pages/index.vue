
<template>
  <div class="container col-6 col-lg-8 col-md-10 col-sm-11 pad-top">
    <header>
      <h1>Paulo Henrique Cuchi</h1>

      <blockquote>
        <em>
          I am a self-taught software developer with passion for full-stack web
          development and distributed systems. My goal is to deliver reliable
          and maintainable software while working collaboratively with
          multidisciplinar teams.
          <b>
            I also like to mentor people technically to help them thrive in
            those same aspects.
          </b>
        </em>
      </blockquote>
    </header>
    <main class="columns">
      <section class="col-6 col-sm-12">
        <h3>My interests</h3>
        <ul>
          <li>Fullstack web development</li>
          <li>Technical leadership and mentorship</li>
          <li>Programming paradigms</li>
          <li>Distributed systems</li>
          <li>DevOps culture, processes &amp; tools</li>
          <li>
            Tools, productivity and philosophy of Unix-based operating systems
          </li>
        </ul>
      </section>

      <PostsSection :posts="posts" />

      <section class="col-6 col-sm-12">
        <h3>My latest activity on GitHub</h3>
        <GithubEvents :events="events" />
      </section>

      <section class="col-6 col-sm-12">
        <h3>What I've been using this week</h3>
        <WakatimeActivity :activity="activity" />
      </section>

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
import GithubEvents from "~/components/github-events";
import WakatimeActivity from "~/components/wakatime-activity";
import PostsSection from "~/components/posts-section";
import Timeline from "~/components/timeline";

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
