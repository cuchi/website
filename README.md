# https://cuchi.me

This is my webpage, which I use to display some brief information about myself
in the most **overengineered** way.

While the website is _relatively_ simple to the end-user's browser, the code
itself has no limits for overengineering. Keep this in mind if you want to fork
it for any reason.

## Features
- Blog posts [automatically listed](api/helpers/post-loader.js) and
[rendered](pages/posts/_post.vue) from markdown files.
- Its own RSS feed [generated](api/rss.js) from the same blog posts.
- An interactive [career timeline](components/Timeline.vue) with
[tooltips](components/TimelineTooltip.vue).
- Wakatime activity [fetching](api/wakatime-activity.js) and
[displaying](components/WakatimeActivity.vue).
- GitHub activity [fetching](api/github-events.js) and
[displaying](components/GithubEvents.vue).

P.S. The last two are disabled fow now.

If you find anything that could be improved, fell free to contribute!
