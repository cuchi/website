import PostsSection from './PostsSection'

export default { title: "Posts Section" }

const Template = () => ({
    components: { PostsSection },
    props: ["posts"],
    template: '<PostsSection :posts="posts"/>',
})

export const Simple = Template.bind({})
Simple.args = {
    posts: [{
        name: "this-is-an-article-name",
        title: "Some cool article",
        createdAtPretty: "Some time ago",
    }]
}
